async function test() {
  const lat = 11.0168; // Coimbatore
  const lng = 76.9558;
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
    const data = await res.json();
    console.log("BigDataCloud Result:", data.city, data.principalSubdivision, data.countryName);
  } catch (e) {
    console.error("Failed:", e.message);
  }
}
test();
