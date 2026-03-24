async function test() {
  // Vasudevanallur coords approx
  const lat = 8.9333;
  const lng = 77.3667;
  const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
  const data = await res.json();
  console.log("city:", data.city);
  console.log("locality:", data.locality);
  console.log("localityInfo:", JSON.stringify(data.localityInfo, null, 2));
  console.log("principalSubdivision:", data.principalSubdivision);
  console.log("countryName:", data.countryName);
}
test();
