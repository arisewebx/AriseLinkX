import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Mock Supabase ───────────────────────────────────────────────────────────
const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockIn = vi.fn();
const mockOrder = vi.fn();
const mockGte = vi.fn();

vi.mock('@/db/supabase', () => ({
  default: {
    from: vi.fn(() => ({
      insert: mockInsert,
      select: vi.fn(() => ({
        eq: mockEq,
        in: mockIn,
        order: mockOrder,
        gte: mockGte,
      })),
    })),
  },
}));

// ─── Mock UAParser ────────────────────────────────────────────────────────────
vi.mock('ua-parser-js', () => ({
  UAParser: vi.fn().mockImplementation(() => ({
    getResult: () => ({ device: { type: 'mobile' } }),
  })),
}));

// ─── Import after mocks ───────────────────────────────────────────────────────
import {
  validateLocationAccuracy,
  getClicksForUrls,
  getClicksForUrl,
  storeClicks,
} from '@/db/apiClicks';

// ─── validateLocationAccuracy ─────────────────────────────────────────────────
describe('validateLocationAccuracy', () => {
  it('returns "unknown" when country is missing', () => {
    expect(validateLocationAccuracy(null, 'Asia/Kolkata')).toBe('unknown');
    expect(validateLocationAccuracy(undefined, 'Asia/Kolkata')).toBe('unknown');
    expect(validateLocationAccuracy('', 'Asia/Kolkata')).toBe('unknown');
  });

  it('returns "likely_accurate" for India + Kolkata timezone', () => {
    expect(validateLocationAccuracy('India', 'Asia/Kolkata')).toBe('likely_accurate');
  });

  it('returns "likely_accurate" for India + Colombo timezone (same UTC+5:30)', () => {
    expect(validateLocationAccuracy('India', 'Asia/Colombo')).toBe('likely_accurate');
  });

  it('returns "likely_accurate" for US + America/* timezone', () => {
    expect(validateLocationAccuracy('United States', 'America/New_York')).toBe('likely_accurate');
    expect(validateLocationAccuracy('United States', 'America/Los_Angeles')).toBe('likely_accurate');
  });

  it('returns "likely_accurate" for UK + Europe/London', () => {
    expect(validateLocationAccuracy('United Kingdom', 'Europe/London')).toBe('likely_accurate');
  });

  it('returns "likely_accurate" for Germany + Europe/* (regional match)', () => {
    expect(validateLocationAccuracy('Germany', 'Europe/Berlin')).toBe('likely_accurate');
  });

  it('returns "likely_accurate" for Australia + Australia/* (regional match)', () => {
    expect(validateLocationAccuracy('Australia', 'Australia/Sydney')).toBe('likely_accurate');
  });

  it('returns "potential_vpn_proxy" when country and timezone region mismatch', () => {
    expect(validateLocationAccuracy('India', 'America/New_York')).toBe('potential_vpn_proxy');
    expect(validateLocationAccuracy('Germany', 'Asia/Kolkata')).toBe('potential_vpn_proxy');
  });

  it('returns "likely_accurate" for known country without timezone (admin API case)', () => {
    expect(validateLocationAccuracy('India', undefined)).toBe('likely_accurate');
    expect(validateLocationAccuracy('Japan', null)).toBe('likely_accurate');
    expect(validateLocationAccuracy('France', undefined)).toBe('likely_accurate');
  });

  it('returns "unknown" for unknown country without timezone', () => {
    expect(validateLocationAccuracy('Narnia', undefined)).toBe('unknown');
    expect(validateLocationAccuracy('UnknownLand', null)).toBe('unknown');
  });

  it('returns "likely_accurate" for Canada + America/* timezone', () => {
    expect(validateLocationAccuracy('Canada', 'America/Toronto')).toBe('likely_accurate');
  });

  it('returns "likely_accurate" for Japan + Asia/* timezone', () => {
    expect(validateLocationAccuracy('Japan', 'Asia/Tokyo')).toBe('likely_accurate');
  });
});

// ─── getClicksForUrls ─────────────────────────────────────────────────────────
describe('getClicksForUrls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array when urlIds is empty', async () => {
    const result = await getClicksForUrls([]);
    expect(result).toEqual([]);
  });

  it('returns empty array when urlIds is null', async () => {
    const result = await getClicksForUrls(null);
    expect(result).toEqual([]);
  });

  it('returns empty array when urlIds is undefined', async () => {
    const result = await getClicksForUrls(undefined);
    expect(result).toEqual([]);
  });

  it('fetches clicks for given URL IDs', async () => {
    const mockClicks = [
      { id: 1, url_id: 'abc', country: 'India', device: 'desktop' },
      { id: 2, url_id: 'xyz', country: 'US', device: 'mobile' },
    ];

    const mockOrderFn = vi.fn().mockResolvedValue({ data: mockClicks, error: null });
    const mockInFn = vi.fn().mockReturnValue({ order: mockOrderFn });
    const mockSelectFn = vi.fn().mockReturnValue({ in: mockInFn });
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({ select: mockSelectFn });

    const result = await getClicksForUrls(['abc', 'xyz']);
    expect(result).toEqual(mockClicks);
    expect(mockInFn).toHaveBeenCalledWith('url_id', ['abc', 'xyz']);
  });

  it('returns empty array on Supabase error', async () => {
    const mockOrderFn = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
    const mockInFn = vi.fn().mockReturnValue({ order: mockOrderFn });
    const mockSelectFn = vi.fn().mockReturnValue({ in: mockInFn });
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({ select: mockSelectFn });

    const result = await getClicksForUrls(['abc']);
    expect(result).toEqual([]);
  });
});

// ─── getClicksForUrl ──────────────────────────────────────────────────────────
describe('getClicksForUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns clicks for a single URL', async () => {
    const mockClicks = [
      { id: 1, url_id: 'abc', country: 'India', created_at: '2025-01-01T00:00:00Z' },
    ];

    const mockOrderFn = vi.fn().mockResolvedValue({ data: mockClicks, error: null });
    const mockEqFn = vi.fn().mockReturnValue({ order: mockOrderFn });
    const mockSelectFn = vi.fn().mockReturnValue({ eq: mockEqFn });
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({ select: mockSelectFn });

    const result = await getClicksForUrl('abc');
    expect(result).toEqual(mockClicks);
    expect(mockEqFn).toHaveBeenCalledWith('url_id', 'abc');
  });

  it('returns empty array when no clicks exist', async () => {
    const mockOrderFn = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockEqFn = vi.fn().mockReturnValue({ order: mockOrderFn });
    const mockSelectFn = vi.fn().mockReturnValue({ eq: mockEqFn });
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({ select: mockSelectFn });

    const result = await getClicksForUrl('nonexistent');
    expect(result).toEqual([]);
  });

  it('throws on Supabase error', async () => {
    const mockOrderFn = vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } });
    const mockEqFn = vi.fn().mockReturnValue({ order: mockOrderFn });
    const mockSelectFn = vi.fn().mockReturnValue({ eq: mockEqFn });
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({ select: mockSelectFn });

    await expect(getClicksForUrl('bad_id')).rejects.toThrow('Unable to load Stats');
  });
});

// ─── storeClicks ──────────────────────────────────────────────────────────────
describe('storeClicks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('inserts click data and redirects to original URL', async () => {
    // Mock IP fetch
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ip: '1.2.3.4' }) }) // ipify
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          city: 'Coimbatore',
          country: 'IN',
          region: 'Tamil Nadu',
          ip: '1.2.3.4',
        }),
      }); // ipinfo

    const mockInsertFn = vi.fn().mockResolvedValue({ data: {}, error: null });
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({ insert: mockInsertFn });

    await storeClicks({ id: 42, originalUrl: 'https://google.com' });

    expect(mockInsertFn).toHaveBeenCalled();
    const insertArg = mockInsertFn.mock.calls[0][0];
    expect(insertArg.url_id).toBe(42);
    expect(insertArg.device).toBeDefined();
    expect(window.location.href).toBe('https://google.com');
  });

  it('still redirects even if all geolocation services fail', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const mockInsertFn = vi.fn().mockResolvedValue({ data: {}, error: null });
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({ insert: mockInsertFn });

    await storeClicks({ id: 99, originalUrl: 'https://fallback.com' });

    expect(window.location.href).toBe('https://fallback.com');
  });

  it('uses fallback minimal insert if enhanced insert fails', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ip: '1.2.3.4' }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ city: 'Chennai', country: 'IN', region: 'TN', ip: '1.2.3.4' }),
      });

    const mockInsertFn = vi.fn()
      .mockResolvedValueOnce({ data: null, error: { message: 'column does not exist' } }) // first fails
      .mockResolvedValueOnce({ data: {}, error: null }); // fallback succeeds

    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({ insert: mockInsertFn });

    await storeClicks({ id: 7, originalUrl: 'https://example.com' });

    expect(mockInsertFn).toHaveBeenCalledTimes(2);
    const fallbackArg = mockInsertFn.mock.calls[1][0];
    expect(fallbackArg).toHaveProperty('url_id', 7);
    expect(fallbackArg).not.toHaveProperty('timezone'); // minimal data
  });
});
