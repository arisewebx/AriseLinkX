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

    const { userId, days = 30 } = await req.json();
    if (!userId) return new Response(JSON.stringify({ error: 'userId required' }), { status: 400, headers: corsHeaders });

    const { data: userUrls } = await adminClient.from('urls').select('id').eq('user_id', userId);
    if (!userUrls || userUrls.length === 0) {
      return new Response(JSON.stringify([]), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const urlIds = userUrls.map((u: any) => u.id);
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const { data: clicks, error } = await adminClient
      .from('clicks')
      .select('created_at, country, device, city, timezone')
      .in('url_id', urlIds)
      .gte('created_at', dateLimit.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(clicks || []), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
