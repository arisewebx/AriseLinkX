const fetch = require('node-fetch'); // wait, fetch is native in Node 18+

async function test() {
  const lat = 11.0168; // Coimbatore
  const lng = 76.9558;
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
    headers: { 'User-Agent': 'node-test-app/1.0', 'Accept-Language': 'en' }
  });
  const data = await res.json();
  console.log("Raw geo address:", data.address);
}
test();
