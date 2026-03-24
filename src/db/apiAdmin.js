import { createClient } from '@supabase/supabase-js';

// Create admin client with service role for admin operations
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Regular supabase client for other operations
import supabase from "./supabase";

// Get all users (Admin only) - UPDATED with correct ban status
export async function getAllUsers() {
  try {
    // Get all auth users using service role
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) throw new Error(error.message);
    
    // Get additional user stats (links count, clicks count)
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Get user's links count
        const { count: linksCount } = await supabaseAdmin
          .from('urls')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        // Get user's total clicks
        const { data: userUrls } = await supabaseAdmin
          .from('urls')
          .select('id')
          .eq('user_id', user.id);
        
        let totalClicks = 0;
        if (userUrls && userUrls.length > 0) {
          const urlIds = userUrls.map(url => url.id);
          const { count: clicksCount } = await supabaseAdmin
            .from('clicks')
            .select('*', { count: 'exact', head: true })
            .in('url_id', urlIds);
          
          totalClicks = clicksCount || 0;
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          profilepic: user.user_metadata?.profilepic || null,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at,
          phone: user.phone || '',
          linksCount: linksCount || 0,
          totalClicks: totalClicks,
          role: user.role,
          // Check if user is admin
          isAdmin: user.email === 'arisewebx@gmail.com' || user.user_metadata?.role === 'admin',
          // User status
          status: user.email_confirmed_at ? 'active' : 'pending',
          // FIXED: Check ban status from app_metadata instead of banned_until
          banned: user.app_metadata?.banned === true,
          banReason: user.app_metadata?.banned_reason,
          bannedAt: user.app_metadata?.banned_at
        };
      })
    );
    
    return usersWithStats;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.message);
  }
}

// Get single user details - UPDATED with correct ban status
export async function getUserDetails(userId) {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (error) throw new Error(error.message);
    
    // Get user's links with click counts
    const { data: userUrls, error: urlsError } = await supabaseAdmin
      .from('urls')
      .select(`
        *,
        clicks(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (urlsError) throw new Error(urlsError.message);
    
    // Get user's clicks with more details
    let userClicks = [];
    let totalClicks = 0;
    
    if (userUrls && userUrls.length > 0) {
      const urlIds = userUrls.map(url => url.id);
      const { data: clicks, error: clicksError } = await supabaseAdmin
        .from('clicks')
        .select('*')
        .in('url_id', urlIds)
        .order('created_at', { ascending: false });
      
      if (!clicksError) {
        userClicks = clicks || [];
        totalClicks = userClicks.length;
      }
      
      // Add click count to each URL
      userUrls.forEach(url => {
        const urlClicks = userClicks.filter(click => click.url_id === url.id);
        url.clickCount = urlClicks.length;
        url.clicks = urlClicks;
      });
    }
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        profilepic: user.user_metadata?.profilepic || null,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        email_confirmed_at: user.email_confirmed_at,
        phone: user.phone || '',
        role: user.role,
        isAdmin: user.email === 'arisewebx@gmail.com' || user.user_metadata?.role === 'admin',
        status: user.email_confirmed_at ? 'active' : 'pending',
        // FIXED: Check ban status from app_metadata instead of banned_until
        banned: user.app_metadata?.banned === true,
        banReason: user.app_metadata?.banned_reason,
        bannedAt: user.app_metadata?.banned_at,
        app_metadata: user.app_metadata,
        user_metadata: user.user_metadata
      },
      urls: userUrls || [],
      clicks: userClicks,
      stats: {
        totalLinks: userUrls?.length || 0,
        totalClicks: totalClicks,
        avgClicksPerLink: userUrls?.length ? Math.round(totalClicks / userUrls.length) : 0,
        lastActive: user.last_sign_in_at
      }
    };
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw new Error(error.message);
  }
}

// Make user admin
export async function makeUserAdmin(userId) {
  try {
    // Fetch existing metadata first to avoid wiping name/profilepic
    const { data: { user: existing }, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (fetchError) throw new Error(fetchError.message);

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { ...existing.user_metadata, role: 'admin' }
    });

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('Error making user admin:', error);
    throw new Error(error.message);
  }
}

// Remove admin privileges
export async function removeAdminPrivileges(userId) {
  try {
    // Fetch existing metadata first to avoid wiping name/profilepic
    const { data: { user: existing }, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (fetchError) throw new Error(fetchError.message);

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { ...existing.user_metadata, role: 'user' }
    });

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('Error removing admin privileges:', error);
    throw new Error(error.message);
  }
}

// OLD BAN FUNCTIONS (Keep for backward compatibility but use simple ones)
export async function banUser(userId) {
  try {
    const { data: { user }, error: fetchError } = 
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (fetchError) throw fetchError;

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      app_metadata: {
        ...user.app_metadata,
        banned: true,
        banned_at: new Date().toISOString()
      }
    });

    if (error) throw error;

    await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: crypto.randomUUID()
    });

    return {
      ...data,
      sessions_invalidated: true
    };

  } catch (error) {
    console.error('Ban user error:', error);
    throw new Error(`Ban operation failed: ${error.message}`);
  }
}

export async function unbanUser(userId) {
  try {
    const { data: { user }, error: fetchError } = 
      await supabaseAdmin.auth.admin.getUserById(userId);
    if (fetchError) throw fetchError;

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      app_metadata: {
        ...user.app_metadata,
        banned: false,
        banned_at: null
      }
    });
    if (error) throw error;

    return { 
      success: true,
      user: {
        ...data.user,
        banned: false
      }
    };

  } catch (error) {
    console.error('Unban error:', error);
    throw new Error(`Unban failed: ${error.message}`);
  }
}

// NEW SIMPLE BAN FUNCTIONS (No password issues) - USE THESE!
export async function banUserSimple(userId) {
  try {
    const { data: { user }, error: fetchError } = 
      await supabaseAdmin.auth.admin.getUserById(userId);
    if (fetchError) throw fetchError;

    // Just set ban flag, don't touch password
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      app_metadata: {
        ...user.app_metadata,
        banned: true,
        banned_at: new Date().toISOString(),
        banned_reason: 'Your account has been suspended for violating our terms of service. Please contact support for more information.'
      }
    });

    if (error) throw error;
    
    console.log(`User ${user.email} has been banned (simple method)`);
    
    return { 
      ...data, 
      banned: true, 
      message: 'User banned successfully'
    };
  } catch (error) {
    console.error('Simple ban error:', error);
    throw new Error(`Ban operation failed: ${error.message}`);
  }
}

export async function unbanUserSimple(userId) {
  try {
    const { data: { user }, error: fetchError } = 
      await supabaseAdmin.auth.admin.getUserById(userId);
    if (fetchError) throw fetchError;

    // Just remove ban flag - no password issues
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      app_metadata: {
        ...user.app_metadata,
        banned: false,
        banned_at: null,
        banned_reason: null,
        unbanned_at: new Date().toISOString()
      }
    });

    if (error) throw error;
    
    console.log(`User ${user.email} has been unbanned (simple method)`);
    
    return { 
      success: true,
      user: { ...data.user, banned: false },
      message: 'User unbanned successfully'
    };
  } catch (error) {
    console.error('Simple unban error:', error);
    throw new Error(`Unban failed: ${error.message}`);
  }
}

// MISSING FUNCTION - Get ban status for current user
export async function getCurrentUserBanStatus() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('User not authenticated');
    
    const isBanned = user.app_metadata?.banned === true;
    const banReason = user.app_metadata?.banned_reason || 'No reason provided';
    const bannedAt = user.app_metadata?.banned_at;
    
    return {
      isBanned,
      banReason,
      bannedAt,
      userEmail: user.email,
      userId: user.id
    };
  } catch (error) {
    console.error('Current user ban status error:', error);
    return { isBanned: false, error: error.message };
  }
}

// IMPROVED DELETE USER FUNCTION with better error handling
export async function deleteUser(userId) {
  try {
    if (!userId) throw new Error('No user ID provided');

    console.log(`Starting deletion process for user: ${userId}`);

    // Step 1: Get user info before deletion (for logging)
    let userEmail = 'unknown';
    try {
      const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (!userError && user) {
        userEmail = user.email;
        console.log(`Deleting user: ${userEmail}`);
      }
    } catch (err) {
      console.warn('Could not fetch user info before deletion:', err);
    }

    // Step 2: Delete user's URLs and related clicks using admin client
    try {
      console.log('Fetching user URLs...');
      
      // Use admin client to fetch URLs (bypasses RLS)
      const { data: urls, error: urlsError } = await supabaseAdmin
        .from('urls')
        .select('id')
        .eq('user_id', userId);

      if (urlsError) {
        console.error('Error fetching URLs:', urlsError);
        // Continue with deletion even if URL fetch fails
      }

      if (urls && urls.length > 0) {
        console.log(`Found ${urls.length} URLs to delete`);
        
        // Step 3: Delete clicks in smaller batches using admin client
        const BATCH_SIZE = 20; // Smaller batch size to prevent timeouts
        const urlIds = urls.map(url => url.id);
        
        for (let i = 0; i < urlIds.length; i += BATCH_SIZE) {
          const batch = urlIds.slice(i, i + BATCH_SIZE);
          console.log(`Deleting clicks for URLs batch ${Math.floor(i/BATCH_SIZE) + 1}`);
          
          const { error: clicksError } = await supabaseAdmin
            .from('clicks')
            .delete()
            .in('url_id', batch);

          if (clicksError) {
            console.error(`Error deleting clicks batch ${Math.floor(i/BATCH_SIZE) + 1}:`, clicksError);
            // Continue with next batch even if this one fails
          }
        }

        // Step 4: Delete URLs using admin client
        console.log('Deleting URLs...');
        const { error: deleteUrlsError } = await supabaseAdmin
          .from('urls')
          .delete()
          .eq('user_id', userId);

        if (deleteUrlsError) {
          console.error('Error deleting URLs:', deleteUrlsError);
          // Continue with user deletion even if URL deletion fails partially
        }
      } else {
        console.log('No URLs found for user');
      }
    } catch (dataError) {
      console.error('Error during data cleanup:', dataError);
      // Continue with auth user deletion even if data cleanup fails
    }

    // Step 5: Delete the auth user (this is the critical part)
    console.log('Deleting auth user...');
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.error('Auth deletion error:', authError);
      throw new Error(`Failed to delete user from auth: ${authError.message}`);
    }

    console.log(`Successfully deleted user: ${userEmail}`);
    return { 
      success: true, 
      message: `User ${userEmail} and associated data deleted successfully`,
      deletedUserId: userId
    };

  } catch (error) {
    console.error('Complete deletion failed:', error);
    throw new Error(`User deletion failed: ${error.message}`);
  }
}

// Alternative simpler delete function (if the above still fails)
export async function deleteUserSimple(userId) {
  try {
    if (!userId) throw new Error('No user ID provided');

    // Get user email for logging
    let userEmail = 'unknown';
    try {
      const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
      userEmail = user?.email || 'unknown';
    } catch (err) {
      console.warn('Could not get user email:', err);
    }

    console.log(`Attempting simple deletion of user: ${userEmail}`);

    // Just delete the auth user - let Supabase handle cascading deletes
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.error('Simple auth deletion error:', authError);
      throw new Error(`Failed to delete user: ${authError.message}`);
    }

    // Manually clean up any remaining data (optional, run after auth deletion)
    try {
      // clicks has no user_id column — must go through urls first
      const { data: remainingUrls } = await supabaseAdmin
        .from('urls').select('id').eq('user_id', userId);
      if (remainingUrls?.length) {
        const ids = remainingUrls.map(u => u.id);
        await supabaseAdmin.from('clicks').delete().in('url_id', ids);
      }
      await supabaseAdmin.from('urls').delete().eq('user_id', userId);
    } catch (cleanupError) {
      console.warn('Cleanup error (non-critical):', cleanupError);
    }

    return { 
      success: true, 
      message: `User ${userEmail} deleted successfully`,
      deletedUserId: userId
    };

  } catch (error) {
    console.error('Simple deletion failed:', error);
    throw new Error(`User deletion failed: ${error.message}`);
  }
}

// Delete specific link - IMPROVED version
export async function deleteUserLink(linkId) {
  try {
    // First verify the link exists
    const { data: link, error: findError } = await supabaseAdmin
      .from('urls')
      .select('id')
      .eq('id', linkId)
      .single();

    if (findError || !link) {
      throw new Error('Link not found');
    }

    // Delete clicks first (foreign key constraint)
    const { error: clicksError } = await supabaseAdmin
      .from('clicks')
      .delete()
      .eq('url_id', linkId);

    if (clicksError) {
      throw new Error(`Failed to delete clicks: ${clicksError.message}`);
    }

    // Then delete the link
    const { error: linkError } = await supabaseAdmin
      .from('urls')
      .delete()
      .eq('id', linkId);

    if (linkError) {
      throw new Error(`Failed to delete link: ${linkError.message}`);
    }

    return { 
      success: true,
      deletedLinkId: linkId
    };

  } catch (error) {
    console.error('Link deletion error:', error);
    throw new Error(`Link deletion failed: ${error.message}`);
  }
}

// Get user activity/clicks data
export async function getUserActivity(userId, days = 30) {
  try {
    const { data: userUrls } = await supabaseAdmin
      .from('urls')
      .select('id')
      .eq('user_id', userId);
    
    if (!userUrls || userUrls.length === 0) {
      return [];
    }
    
    const urlIds = userUrls.map(url => url.id);
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);
    
    const { data: clicks, error } = await supabaseAdmin
      .from('clicks')
      .select('created_at, country, device, city, timezone')
      .in('url_id', urlIds)
      .gte('created_at', dateLimit.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return clicks || [];
  } catch (error) {
    console.error('Error fetching user activity:', error);
    throw new Error(error.message);
  }
}

// Bulk delete function with better error handling
export async function bulkDeleteUsers(userIds) {
  const results = [];
  
  for (const userId of userIds) {
    try {
      console.log(`Processing deletion for user: ${userId}`);
      const result = await deleteUser(userId);
      results.push({ userId, success: true, result });
      
      // Small delay between deletions to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error);
      results.push({ userId, success: false, error: error.message });
    }
  }
  
  return results;
}