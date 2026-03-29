import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createRemoteJWKSet, jwtVerify } from 'https://deno.land/x/jose@v5.2.4/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifyAdminJWT(token: string, supabaseUrl: string) {
  const JWKS = createRemoteJWKSet(new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`));
  const { payload } = await jwtVerify(token, JWKS);
  const email = payload.email as string;
  const userMetadata = payload.user_metadata as any;
  const isAdmin = email === 'arisewebx@gmail.com' || userMetadata?.role === 'admin';
  return { email, isAdmin };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const token = authHeader.replace('Bearer ', '');

    const { isAdmin } = await verifyAdminJWT(token, supabaseUrl);
    if (!isAdmin) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });

    const adminClient = createClient(supabaseUrl, Deno.env.get('ADMIN_SERVICE_KEY')!, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const body = await req.json();
    const { userId, action } = body;
    if (!userId) return new Response(JSON.stringify({ error: 'userId required' }), { status: 400, headers: corsHeaders });

    if (action === 'get-details') {
      const { data: { user }, error } = await adminClient.auth.admin.getUserById(userId);
      if (error) throw error;

      const { data: userUrls, error: urlsError } = await adminClient
        .from('urls').select('*, clicks(*)').eq('user_id', userId).order('created_at', { ascending: false });
      if (urlsError) throw urlsError;

      let userClicks: any[] = [];
      let totalClicks = 0;

      if (userUrls && userUrls.length > 0) {
        const urlIds = userUrls.map((u: any) => u.id);
        const { data: clicks } = await adminClient
          .from('clicks').select('*').in('url_id', urlIds).order('created_at', { ascending: false });
        userClicks = clicks || [];
        totalClicks = userClicks.length;
        userUrls.forEach((u: any) => {
          u.clickCount = userClicks.filter((c: any) => c.url_id === u.id).length;
          u.clicks = userClicks.filter((c: any) => c.url_id === u.id);
        });
      }

      return new Response(JSON.stringify({
        user: {
          id: user.id, email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          profilepic: user.user_metadata?.profilepic || null,
          created_at: user.created_at, last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at, phone: user.phone || '',
          role: user.role,
          isAdmin: user.email === 'arisewebx@gmail.com' || user.user_metadata?.role === 'admin',
          status: user.email_confirmed_at ? 'active' : 'pending',
          banned: user.app_metadata?.banned === true,
          banReason: user.app_metadata?.banned_reason,
          bannedAt: user.app_metadata?.banned_at,
          app_metadata: user.app_metadata, user_metadata: user.user_metadata
        },
        urls: userUrls || [], clicks: userClicks,
        stats: {
          totalLinks: userUrls?.length || 0, totalClicks,
          avgClicksPerLink: userUrls?.length ? Math.round(totalClicks / userUrls.length) : 0,
          lastActive: user.last_sign_in_at
        }
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (['make-admin', 'remove-admin', 'ban', 'unban'].includes(action)) {
      const { data: { user: existing }, error: fetchError } = await adminClient.auth.admin.getUserById(userId);
      if (fetchError) throw fetchError;

      let result;
      if (action === 'make-admin') {
        const { data, error } = await adminClient.auth.admin.updateUserById(userId, {
          user_metadata: { ...existing.user_metadata, role: 'admin' }
        });
        if (error) throw error;
        result = data;
      } else if (action === 'remove-admin') {
        const { data, error } = await adminClient.auth.admin.updateUserById(userId, {
          user_metadata: { ...existing.user_metadata, role: 'user' }
        });
        if (error) throw error;
        result = data;
      } else if (action === 'ban') {
        const { data, error } = await adminClient.auth.admin.updateUserById(userId, {
          app_metadata: {
            ...existing.app_metadata, banned: true,
            banned_at: new Date().toISOString(),
            banned_reason: body.reason || 'Your account has been suspended for violating our terms of service.'
          }
        });
        if (error) throw error;
        result = { ...data, banned: true, message: 'User banned successfully' };
      } else if (action === 'unban') {
        const { data, error } = await adminClient.auth.admin.updateUserById(userId, {
          app_metadata: {
            ...existing.app_metadata, banned: false,
            banned_at: null, banned_reason: null,
            unbanned_at: new Date().toISOString()
          }
        });
        if (error) throw error;
        result = { success: true, user: { ...data.user, banned: false }, message: 'User unbanned successfully' };
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'delete') {
      const { data: urls } = await adminClient.from('urls').select('id').eq('user_id', userId);
      if (urls && urls.length > 0) {
        const BATCH = 20;
        const urlIds = urls.map((u: any) => u.id);
        for (let i = 0; i < urlIds.length; i += BATCH) {
          await adminClient.from('clicks').delete().in('url_id', urlIds.slice(i, i + BATCH));
        }
        await adminClient.from('urls').delete().eq('user_id', userId);
      }
      const { error: authError } = await adminClient.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      return new Response(JSON.stringify({ success: true, deletedUserId: userId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
