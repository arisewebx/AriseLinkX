import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock Supabase ────────────────────────────────────────────────────────────
const buildChain = (finalResult) => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(finalResult),
    order: vi.fn().mockResolvedValue(finalResult),
    in: vi.fn().mockResolvedValue(finalResult),
  };
  // make non-terminal methods also resolve for cases without .single()
  chain.eq.mockImplementation(() => ({ ...chain }));
  chain.or.mockImplementation(() => ({ ...chain }));
  chain.delete.mockImplementation(() => ({ ...chain, eq: vi.fn().mockResolvedValue(finalResult) }));
  return chain;
};

vi.mock('@/db/supabase', () => ({
  default: { from: vi.fn(), auth: { getSession: vi.fn() } },
  supabaseUrl: 'https://test.supabase.co',
}));

import { getUrls, getUrl, getLongUrl, createUrl, deleteUrl, getAllUrls } from '@/db/apiUrls';

// ─── getUrls ──────────────────────────────────────────────────────────────────
describe('getUrls', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns list of URLs for a user', async () => {
    const mockData = [{ id: 1, user_id: 'u1', original_url: 'https://google.com' }];
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }),
    });

    const result = await getUrls('u1');
    expect(result).toEqual(mockData);
  });

  it('throws "Unable to load URLs" on error', async () => {
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
      }),
    });

    await expect(getUrls('u1')).rejects.toThrow('Unable to load URLs');
  });

  it('returns empty array when user has no URLs', async () => {
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    });

    const result = await getUrls('new_user');
    expect(result).toEqual([]);
  });
});

// ─── getUrl ───────────────────────────────────────────────────────────────────
describe('getUrl', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns single URL matching id and user_id', async () => {
    const mockUrl = { id: 5, user_id: 'u1', original_url: 'https://github.com' };
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockUrl, error: null }),
          }),
        }),
      }),
    });

    const result = await getUrl({ id: 5, user_id: 'u1' });
    expect(result).toEqual(mockUrl);
  });

  it('throws "Short Url not found" when URL does not exist', async () => {
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'No rows' } }),
          }),
        }),
      }),
    });

    await expect(getUrl({ id: 999, user_id: 'u1' })).rejects.toThrow('Short Url not found');
  });
});

// ─── getLongUrl ───────────────────────────────────────────────────────────────
describe('getLongUrl', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the URL data when short_url matches', async () => {
    const mockData = { id: 10, original_url: 'https://youtube.com' };
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        or: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      }),
    });

    const result = await getLongUrl('abc123');
    expect(result).toEqual(mockData);
  });

  it('returns null when short URL is not found (PGRST116 — expected not-found)', async () => {
    // getLongUrl treats PGRST116 as "not found" and falls through to return shortLinkData (null)
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        or: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116', message: 'No rows found' },
          }),
        }),
      }),
    });

    const result = await getLongUrl('nonexistent');
    expect(result).toBeNull();
  });

  it('returns undefined on other DB errors (logs but does not throw)', async () => {
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        or: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST500', message: 'Internal error' },
          }),
        }),
      }),
    });

    const result = await getLongUrl('bad');
    expect(result).toBeUndefined();
  });

  it('works with custom_url as well (OR query)', async () => {
    const mockData = { id: 11, original_url: 'https://custom.com' };
    const orMock = vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    });
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({ or: orMock }),
    });

    await getLongUrl('myslug');
    expect(orMock).toHaveBeenCalledWith('short_url.eq.myslug,custom_url.eq.myslug');
  });
});

// ─── createUrl ────────────────────────────────────────────────────────────────
describe('createUrl', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates a URL and returns data', async () => {
    const mockResult = [{
      id: 1, title: 'My Link', short_url: 'abc123',
      original_url: 'https://github.com', qr: 'https://test.supabase.co/storage/v1/object/public/qrs/qr-abc123'
    }];

    const { default: supabase } = await import('@/db/supabase');
    supabase.storage = {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ error: null }),
      }),
    };
    supabase.from.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: mockResult, error: null }),
      }),
    });

    const result = await createUrl(
      { title: 'My Link', longUrl: 'https://github.com', customUrl: '', user_id: 'u1' },
      new Blob(['qr'])
    );
    expect(result).toEqual(mockResult);
  });

  it('throws if QR upload fails', async () => {
    const { default: supabase } = await import('@/db/supabase');
    supabase.storage = {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ error: { message: 'Storage full' } }),
      }),
    };

    await expect(
      createUrl({ title: 'T', longUrl: 'https://x.com', user_id: 'u1' }, new Blob(['qr']))
    ).rejects.toThrow('Storage full');
  });

  it('throws "Error creating short URL" if DB insert fails', async () => {
    const { default: supabase } = await import('@/db/supabase');
    supabase.storage = {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ error: null }),
      }),
    };
    supabase.from.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: null, error: { message: 'Duplicate short_url' } }),
      }),
    });

    await expect(
      createUrl({ title: 'T', longUrl: 'https://x.com', user_id: 'u1' }, new Blob(['qr']))
    ).rejects.toThrow('Error creating short URL');
  });

  it('sets custom_url to null when not provided', async () => {
    const mockResult = [{ id: 2 }];
    const insertMock = vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: mockResult, error: null }),
    });
    const { default: supabase } = await import('@/db/supabase');
    supabase.storage = {
      from: vi.fn().mockReturnValue({ upload: vi.fn().mockResolvedValue({ error: null }) }),
    };
    supabase.from.mockReturnValue({ insert: insertMock });

    await createUrl({ title: 'T', longUrl: 'https://x.com', user_id: 'u1' }, new Blob(['qr']));

    const insertedData = insertMock.mock.calls[0][0][0];
    expect(insertedData.custom_url).toBeNull();
  });
});

// ─── deleteUrl ────────────────────────────────────────────────────────────────
describe('deleteUrl', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deletes clicks then URL and returns data', async () => {
    const { default: supabase } = await import('@/db/supabase');
    supabase.auth.getSession = vi.fn().mockResolvedValue({
      data: { session: { user: { id: 'u1' } } },
      error: null,
    });

    const deleteClicksMock = vi.fn().mockResolvedValue({ error: null });
    const deleteUrlMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: [{ id: 1 }], error: null }),
    });

    supabase.from.mockImplementation((table) => {
      if (table === 'clicks') {
        return { delete: vi.fn().mockReturnValue({ eq: deleteClicksMock }) };
      }
      if (table === 'urls') {
        return { delete: vi.fn().mockReturnValue({ eq: deleteUrlMock }) };
      }
    });

    const result = await deleteUrl(1);
    expect(deleteClicksMock).toHaveBeenCalledWith('url_id', 1);
  });

  it('throws "User not authenticated" when no session', async () => {
    const { default: supabase } = await import('@/db/supabase');
    supabase.auth.getSession = vi.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    });

    await expect(deleteUrl(1)).rejects.toThrow('User not authenticated');
  });

  it('throws if click deletion fails', async () => {
    const { default: supabase } = await import('@/db/supabase');
    supabase.auth.getSession = vi.fn().mockResolvedValue({
      data: { session: { user: { id: 'u1' } } },
      error: null,
    });
    supabase.from.mockImplementation((table) => {
      if (table === 'clicks') {
        return {
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: { message: 'FK error' } }),
          }),
        };
      }
    });

    await expect(deleteUrl(1)).rejects.toThrow('Unable to delete related click data');
  });
});

// ─── getAllUrls ────────────────────────────────────────────────────────────────
describe('getAllUrls', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns all URLs without user filter', async () => {
    const allUrls = [
      { id: 1, user_id: 'u1' },
      { id: 2, user_id: 'u2' },
    ];
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: allUrls, error: null }),
    });

    const result = await getAllUrls();
    expect(result).toEqual(allUrls);
    expect(result).toHaveLength(2);
  });

  it('throws "Unable to load URLs" on error', async () => {
    const { default: supabase } = await import('@/db/supabase');
    supabase.from.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB down' } }),
    });

    await expect(getAllUrls()).rejects.toThrow('Unable to load URLs');
  });
});
