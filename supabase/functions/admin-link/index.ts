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

    const { linkId } = await req.json();
    if (!linkId) return new Response(JSON.stringify({ error: 'linkId required' }), { status: 400, headers: corsHeaders });

    const { data: link, error: findError } = await adminClient
      .from('urls').select('id').eq('id', linkId).single();
    if (findError || !link) return new Response(JSON.stringify({ error: 'Link not found' }), { status: 404, headers: corsHeaders });

    const { error: clicksError } = await adminClient.from('clicks').delete().eq('url_id', linkId);
    if (clicksError) throw new Error(`Failed to delete clicks: ${clicksError.message}`);

    const { error: linkError } = await adminClient.from('urls').delete().eq('id', linkId);
    if (linkError) throw new Error(`Failed to delete link: ${linkError.message}`);

    return new Response(JSON.stringify({ success: true, deletedLinkId: linkId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
