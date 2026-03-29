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

    const { data: { users }, error } = await adminClient.auth.admin.listUsers();
    if (error) throw error;

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const { count: linksCount } = await adminClient
          .from('urls').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

        const { data: userUrls } = await adminClient.from('urls').select('id').eq('user_id', user.id);

        let totalClicks = 0;
        if (userUrls && userUrls.length > 0) {
          const urlIds = userUrls.map((u: { id: string }) => u.id);
          const { count: clicksCount } = await adminClient
            .from('clicks').select('*', { count: 'exact', head: true }).in('url_id', urlIds);
          totalClicks = clicksCount || 0;
        }

        return {
          id: user.id, email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          profilepic: user.user_metadata?.profilepic || null,
          created_at: user.created_at, last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at, phone: user.phone || '',
          linksCount: linksCount || 0, totalClicks, role: user.role,
          isAdmin: user.email === 'arisewebx@gmail.com' || user.user_metadata?.role === 'admin',
          status: user.email_confirmed_at ? 'active' : 'pending',
          banned: user.app_metadata?.banned === true,
          banReason: user.app_metadata?.banned_reason,
          bannedAt: user.app_metadata?.banned_at,
        };
      })
    );

    return new Response(JSON.stringify(usersWithStats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
