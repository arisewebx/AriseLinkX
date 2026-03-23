import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Hoist mocks so factories can reference them ──────────────────────────────
const { adminAuth, supabaseAdminMock, supabaseMock } = vi.hoisted(() => {
  const adminAuth = {
    admin: {
      listUsers: vi.fn(),
      getUserById: vi.fn(),
      updateUserById: vi.fn(),
      deleteUser: vi.fn(),
    },
  };
  const supabaseAdminMock = { auth: adminAuth, from: vi.fn() };
  const supabaseMock = { from: vi.fn() };
  return { adminAuth, supabaseAdminMock, supabaseMock };
});

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => supabaseAdminMock),
}));

vi.mock('@/db/supabase', () => ({ default: supabaseMock }));

import {
  getAllUsers,
  getUserDetails,
  makeUserAdmin,
  removeAdminPrivileges,
  banUserSimple,
  unbanUserSimple,
  deleteUser,
  deleteUserLink,
  getUserActivity,
  bulkDeleteUsers,
} from '@/db/apiAdmin';

// ─── Helper builders ──────────────────────────────────────────────────────────
const makeUser = (overrides = {}) => ({
  id: 'u1',
  email: 'user@test.com',
  user_metadata: { name: 'Test User', profilepic: null },
  app_metadata: { banned: false },
  created_at: '2024-01-01T00:00:00Z',
  last_sign_in_at: '2024-03-01T00:00:00Z',
  email_confirmed_at: '2024-01-01T01:00:00Z',
  phone: '',
  role: 'authenticated',
  ...overrides,
});

// ─── getAllUsers ──────────────────────────────────────────────────────────────
describe('getAllUsers', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns list of users with stats', async () => {
    const users = [makeUser()];
    adminAuth.admin.listUsers.mockResolvedValue({ data: { users }, error: null });

    supabaseMock.from.mockImplementation((table) => {
      if (table === 'urls') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: 2, data: [{ id: 'link1' }, { id: 'link2' }] }),
          }),
        };
      }
      if (table === 'clicks') {
        return {
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({ count: 10 }),
          }),
        };
      }
    });

    const result = await getAllUsers();
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('user@test.com');
    expect(result[0].status).toBe('active');
    expect(result[0].banned).toBe(false);
  });

  it('marks banned user correctly', async () => {
    const bannedUser = makeUser({ app_metadata: { banned: true, banned_reason: 'TOS violation' } });
    adminAuth.admin.listUsers.mockResolvedValue({ data: { users: [bannedUser] }, error: null });
    supabaseMock.from.mockReturnValue({
      select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ count: 0, data: [] }) }),
    });

    const result = await getAllUsers();
    expect(result[0].banned).toBe(true);
    expect(result[0].banReason).toBe('TOS violation');
  });

  it('marks user as pending when email not confirmed', async () => {
    const unconfirmed = makeUser({ email_confirmed_at: null });
    adminAuth.admin.listUsers.mockResolvedValue({ data: { users: [unconfirmed] }, error: null });
    supabaseMock.from.mockReturnValue({
      select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ count: 0, data: [] }) }),
    });

    const result = await getAllUsers();
    expect(result[0].status).toBe('pending');
  });

  it('throws on Supabase admin error', async () => {
    adminAuth.admin.listUsers.mockResolvedValue({
      data: { users: [] },
      error: { message: 'Unauthorized' },
    });

    await expect(getAllUsers()).rejects.toThrow('Unauthorized');
  });
});

// ─── getUserDetails ───────────────────────────────────────────────────────────
describe('getUserDetails', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns user with urls and stats', async () => {
    const user = makeUser();
    adminAuth.admin.getUserById.mockResolvedValue({ data: { user }, error: null });

    const urls = [
      { id: 'link1', title: 'A', original_url: 'https://a.com', created_at: '2025-01-01T00:00:00Z' },
    ];
    const clicks = [
      { id: 'c1', url_id: 'link1', country: 'India', created_at: '2025-03-01T00:00:00Z' },
      { id: 'c2', url_id: 'link1', country: 'India', created_at: '2025-03-02T00:00:00Z' },
    ];

    supabaseMock.from.mockImplementation((table) => {
      if (table === 'urls') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: urls, error: null }),
            }),
          }),
        };
      }
      if (table === 'clicks') {
        return {
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: clicks, error: null }),
            }),
          }),
        };
      }
    });

    const result = await getUserDetails('u1');
    expect(result.user.email).toBe('user@test.com');
    expect(result.urls).toHaveLength(1);
    expect(result.stats.totalClicks).toBe(2);
    expect(result.urls[0].clickCount).toBe(2);
  });

  it('returns zero stats when user has no URLs', async () => {
    const user = makeUser();
    adminAuth.admin.getUserById.mockResolvedValue({ data: { user }, error: null });
    supabaseMock.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    });

    const result = await getUserDetails('u1');
    expect(result.stats.totalLinks).toBe(0);
    expect(result.stats.totalClicks).toBe(0);
    expect(result.urls).toEqual([]);
  });

  it('throws when user not found', async () => {
    adminAuth.admin.getUserById.mockResolvedValue({
      data: { user: null },
      error: { message: 'User not found' },
    });

    await expect(getUserDetails('bad_id')).rejects.toThrow('User not found');
  });
});

// ─── makeUserAdmin ────────────────────────────────────────────────────────────
describe('makeUserAdmin', () => {
  beforeEach(() => vi.clearAllMocks());

  it('promotes user to admin while preserving existing metadata', async () => {
    const user = makeUser({ user_metadata: { name: 'John', profilepic: 'pic.jpg', role: 'user' } });
    adminAuth.admin.getUserById.mockResolvedValue({ data: { user }, error: null });
    adminAuth.admin.updateUserById.mockResolvedValue({ data: { user: { ...user } }, error: null });

    await makeUserAdmin('u1');

    const updateCall = adminAuth.admin.updateUserById.mock.calls[0];
    expect(updateCall[1].user_metadata.role).toBe('admin');
    // Must preserve existing fields
    expect(updateCall[1].user_metadata.name).toBe('John');
    expect(updateCall[1].user_metadata.profilepic).toBe('pic.jpg');
  });

  it('throws on update error', async () => {
    adminAuth.admin.getUserById.mockResolvedValue({ data: { user: makeUser() }, error: null });
    adminAuth.admin.updateUserById.mockResolvedValue({ data: null, error: { message: 'Not allowed' } });

    await expect(makeUserAdmin('u1')).rejects.toThrow('Not allowed');
  });
});

// ─── removeAdminPrivileges ────────────────────────────────────────────────────
describe('removeAdminPrivileges', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sets role to "user" while preserving other metadata', async () => {
    const user = makeUser({ user_metadata: { name: 'Jane', profilepic: 'pic.jpg', role: 'admin' } });
    adminAuth.admin.getUserById.mockResolvedValue({ data: { user }, error: null });
    adminAuth.admin.updateUserById.mockResolvedValue({ data: { user }, error: null });

    await removeAdminPrivileges('u1');

    const updateCall = adminAuth.admin.updateUserById.mock.calls[0];
    expect(updateCall[1].user_metadata.role).toBe('user');
    expect(updateCall[1].user_metadata.name).toBe('Jane');
    expect(updateCall[1].user_metadata.profilepic).toBe('pic.jpg');
  });
});

// ─── banUserSimple ────────────────────────────────────────────────────────────
describe('banUserSimple', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sets banned: true in app_metadata', async () => {
    const user = makeUser({ app_metadata: { role: 'user' } });
    adminAuth.admin.getUserById.mockResolvedValue({ data: { user }, error: null });
    adminAuth.admin.updateUserById.mockResolvedValue({
      data: { user: { ...user, app_metadata: { banned: true } } },
      error: null,
    });

    const result = await banUserSimple('u1');
    expect(result.banned).toBe(true);

    const updateCall = adminAuth.admin.updateUserById.mock.calls[0];
    expect(updateCall[1].app_metadata.banned).toBe(true);
    expect(updateCall[1].app_metadata.banned_at).toBeDefined();
    // Must preserve existing app_metadata fields
    expect(updateCall[1].app_metadata.role).toBe('user');
  });

  it('does NOT change the user password (simple method)', async () => {
    const user = makeUser();
    adminAuth.admin.getUserById.mockResolvedValue({ data: { user }, error: null });
    adminAuth.admin.updateUserById.mockResolvedValue({ data: { user }, error: null });

    await banUserSimple('u1');

    // updateUserById should only be called once (no password change call)
    expect(adminAuth.admin.updateUserById).toHaveBeenCalledTimes(1);
    const call = adminAuth.admin.updateUserById.mock.calls[0];
    expect(call[1]).not.toHaveProperty('password');
  });

  it('throws on ban error', async () => {
    adminAuth.admin.getUserById.mockResolvedValue({ data: { user: makeUser() }, error: null });
    adminAuth.admin.updateUserById.mockResolvedValue({ data: null, error: { message: 'Ban failed' } });

    await expect(banUserSimple('u1')).rejects.toThrow('Ban operation failed');
  });
});

// ─── unbanUserSimple ──────────────────────────────────────────────────────────
describe('unbanUserSimple', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sets banned: false and clears ban fields', async () => {
    const user = makeUser({
      app_metadata: { banned: true, banned_at: '2025-01-01', banned_reason: 'TOS' },
    });
    adminAuth.admin.getUserById.mockResolvedValue({ data: { user }, error: null });
    adminAuth.admin.updateUserById.mockResolvedValue({
      data: { user: { ...user, app_metadata: { banned: false } } },
      error: null,
    });

    const result = await unbanUserSimple('u1');
    expect(result.success).toBe(true);

    const updateCall = adminAuth.admin.updateUserById.mock.calls[0];
    expect(updateCall[1].app_metadata.banned).toBe(false);
    expect(updateCall[1].app_metadata.banned_at).toBeNull();
    expect(updateCall[1].app_metadata.banned_reason).toBeNull();
    expect(updateCall[1].app_metadata.unbanned_at).toBeDefined();
  });
});

// ─── deleteUser ───────────────────────────────────────────────────────────────
describe('deleteUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('throws when no userId provided', async () => {
    await expect(deleteUser(null)).rejects.toThrow('No user ID provided');
    await expect(deleteUser(undefined)).rejects.toThrow('No user ID provided');
  });

  it('deletes clicks, urls, then auth user successfully', async () => {
    const user = makeUser();
    adminAuth.admin.getUserById.mockResolvedValue({ data: { user }, error: null });
    adminAuth.admin.deleteUser.mockResolvedValue({ error: null });

    const urls = [{ id: 'link1' }, { id: 'link2' }];
    supabaseAdminMock.from.mockImplementation((table) => {
      if (table === 'urls') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: urls, error: null }),
          }),
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      }
      if (table === 'clicks') {
        return {
          delete: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      }
    });

    const result = await deleteUser('u1');
    expect(result.success).toBe(true);
    expect(adminAuth.admin.deleteUser).toHaveBeenCalledWith('u1');
  });

  it('throws if auth user deletion fails', async () => {
    adminAuth.admin.getUserById.mockResolvedValue({ data: { user: makeUser() }, error: null });
    supabaseAdminMock.from.mockReturnValue({
      select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    });
    adminAuth.admin.deleteUser.mockResolvedValue({ error: { message: 'Cannot delete' } });

    await expect(deleteUser('u1')).rejects.toThrow('User deletion failed');
  });
});

// ─── deleteUserLink ───────────────────────────────────────────────────────────
describe('deleteUserLink', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deletes clicks then the link', async () => {
    supabaseAdminMock.from.mockImplementation((table) => {
      if (table === 'urls') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'link1' }, error: null }),
            }),
          }),
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      }
      if (table === 'clicks') {
        return {
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      }
    });

    const result = await deleteUserLink('link1');
    expect(result.success).toBe(true);
    expect(result.deletedLinkId).toBe('link1');
  });

  it('throws "Link not found" when link does not exist', async () => {
    supabaseAdminMock.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'No rows' } }),
        }),
      }),
    });

    await expect(deleteUserLink('bad_id')).rejects.toThrow('Link deletion failed');
  });

  it('throws if click deletion fails', async () => {
    supabaseAdminMock.from.mockImplementation((table) => {
      if (table === 'urls') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'link1' }, error: null }),
            }),
          }),
        };
      }
      if (table === 'clicks') {
        return {
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: { message: 'FK constraint' } }),
          }),
        };
      }
    });

    await expect(deleteUserLink('link1')).rejects.toThrow('Link deletion failed');
  });
});

// ─── getUserActivity ──────────────────────────────────────────────────────────
describe('getUserActivity', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns clicks for a user including timezone field', async () => {
    const clicks = [
      { created_at: '2025-03-01T10:00:00Z', country: 'India', device: 'mobile', city: 'Chennai', timezone: 'Asia/Kolkata' },
    ];
    const urls = [{ id: 'link1' }];

    supabaseMock.from.mockImplementation((table) => {
      if (table === 'urls') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: urls, error: null }),
          }),
        };
      }
      if (table === 'clicks') {
        return {
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockReturnValue({
              gte: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: clicks, error: null }),
              }),
            }),
          }),
        };
      }
    });

    const result = await getUserActivity('u1', 30);
    expect(result).toHaveLength(1);
    // Verify timezone is included (bug fix check)
    expect(result[0].timezone).toBe('Asia/Kolkata');
  });

  it('returns empty array when user has no URLs', async () => {
    supabaseMock.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    });

    const result = await getUserActivity('u_empty', 30);
    expect(result).toEqual([]);
  });

  it('defaults to 30 days if no days param', async () => {
    supabaseMock.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    });

    // Should not throw
    await expect(getUserActivity('u1')).resolves.toBeDefined();
  });
});

// ─── bulkDeleteUsers ──────────────────────────────────────────────────────────
describe('bulkDeleteUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns success results for all users', async () => {
    const user1 = makeUser({ id: 'u1', email: 'u1@test.com' });
    const user2 = makeUser({ id: 'u2', email: 'u2@test.com' });

    adminAuth.admin.getUserById
      .mockResolvedValueOnce({ data: { user: user1 }, error: null })
      .mockResolvedValueOnce({ data: { user: user2 }, error: null });

    supabaseAdminMock.from.mockReturnValue({
      select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    });

    adminAuth.admin.deleteUser.mockResolvedValue({ error: null });

    const promise = bulkDeleteUsers(['u1', 'u2']);
    await vi.runAllTimersAsync();
    const results = await promise;

    expect(results).toHaveLength(2);
    expect(results[0].success).toBe(true);
    expect(results[1].success).toBe(true);
  });

  it('records failure for individual users without stopping bulk operation', async () => {
    const user1 = makeUser({ id: 'u1', email: 'u1@test.com' });
    const user2 = makeUser({ id: 'u2', email: 'u2@test.com' });

    adminAuth.admin.getUserById
      .mockResolvedValueOnce({ data: { user: user1 }, error: null })
      .mockResolvedValueOnce({ data: { user: user2 }, error: null });

    supabaseAdminMock.from.mockReturnValue({
      select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    });

    // u1 succeeds, u2 auth deletion fails
    adminAuth.admin.deleteUser
      .mockResolvedValueOnce({ error: null })
      .mockResolvedValueOnce({ error: { message: 'Cannot delete protected user' } });

    const promise = bulkDeleteUsers(['u1', 'u2']);
    await vi.runAllTimersAsync();
    const results = await promise;

    expect(results[0].success).toBe(true);
    expect(results[1].success).toBe(false);
    expect(results[1].error).toBeDefined();
  });
});
