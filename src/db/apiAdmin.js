import supabase from "./supabase";

async function callAdminFunction(functionName, body = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
    headers: { Authorization: `Bearer ${session.access_token}` }
  });
  if (error) throw new Error(data?.error || error.message);
  if (data?.error) throw new Error(data.error);
  return data;
}

// Get all users (Admin only)
export async function getAllUsers() {
  return callAdminFunction('admin-users');
}

// Get single user details
export async function getUserDetails(userId) {
  return callAdminFunction('admin-user', { userId, action: 'get-details' });
}

// Make user admin
export async function makeUserAdmin(userId) {
  return callAdminFunction('admin-user', { userId, action: 'make-admin' });
}

// Remove admin privileges
export async function removeAdminPrivileges(userId) {
  return callAdminFunction('admin-user', { userId, action: 'remove-admin' });
}

// Ban user
export async function banUser(userId) {
  return callAdminFunction('admin-user', { userId, action: 'ban' });
}

export async function banUserSimple(userId) {
  return callAdminFunction('admin-user', { userId, action: 'ban' });
}

// Unban user
export async function unbanUser(userId) {
  return callAdminFunction('admin-user', { userId, action: 'unban' });
}

export async function unbanUserSimple(userId) {
  return callAdminFunction('admin-user', { userId, action: 'unban' });
}

// Get ban status for current user (uses regular client - no admin needed)
export async function getCurrentUserBanStatus() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('User not authenticated');

    return {
      isBanned: user.app_metadata?.banned === true,
      banReason: user.app_metadata?.banned_reason || 'No reason provided',
      bannedAt: user.app_metadata?.banned_at,
      userEmail: user.email,
      userId: user.id
    };
  } catch (error) {
    return { isBanned: false, error: error.message };
  }
}

// Delete user with full cleanup
export async function deleteUser(userId) {
  return callAdminFunction('admin-user', { userId, action: 'delete' });
}

export async function deleteUserSimple(userId) {
  return deleteUser(userId);
}

// Delete specific link
export async function deleteUserLink(linkId) {
  return callAdminFunction('admin-link', { linkId });
}

// Get user activity/clicks data
export async function getUserActivity(userId, days = 30) {
  return callAdminFunction('admin-activity', { userId, days });
}

// Bulk delete users
export async function bulkDeleteUsers(userIds) {
  const results = [];
  for (const userId of userIds) {
    try {
      const result = await deleteUser(userId);
      results.push({ userId, success: true, result });
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      results.push({ userId, success: false, error: error.message });
    }
  }
  return results;
}
