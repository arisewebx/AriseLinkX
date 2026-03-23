import { createClient } from '@supabase/supabase-js';


const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY);

async function test() {
  console.log("Fetching a URL to test...");
  const { data: urls, error: urlError } = await supabase.from('urls').select('id, original_url').limit(1);
  
  if (urlError || !urls || urls.length === 0) {
    console.error("Could not fetch URL:", urlError);
    return;
  }
  
  const testUrl = urls[0];
  console.log("Testing with URL ID:", testUrl.id);

  const clickData = {
    url_id: testUrl.id,
    city: "Test City",
    country: "Test Country",
    region: "Test Region",
    device: "desktop",
    timezone: "UTC",
    language: "en-US",
    user_agent: "Test Agent",
    ip_address: "127.0.0.1",
    location_source: "test",
    created_at: new Date().toISOString()
  };

  console.log("Attempting insert...");
  const { data, error } = await supabase.from('clicks').insert(clickData);
  
  if (error) {
    console.error("❌ Insert failed:", error);
  } else {
    console.log("✅ Insert succeeded:", data);
  }
}

test();
