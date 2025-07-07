// import {UAParser} from "ua-parser-js";
// import supabase from "./supabase";

// // export async function getClicks() {
// //   let {data, error} = await supabase.from("clicks").select("*");

// //   if (error) {
// //     console.error(error);
// //     throw new Error("Unable to load Stats");
// //   }

// //   return data;
// // }

// export async function getClicksForUrls(urlIds) {
//   const {data, error} = await supabase
//     .from("clicks")
//     .select("*")
//     .in("url_id", urlIds);

//   if (error) {
//     console.error("Error fetching clicks:", error);
//     return null;
//   }

//   return data;
// }

// export async function getClicksForUrl(url_id) {
//   const {data, error} = await supabase
//     .from("clicks")
//     .select("*")
//     .eq("url_id", url_id);

//   if (error) {
//     console.error(error);
//     throw new Error("Unable to load Stats");
//   }

//   return data;
// }

// const parser = new UAParser();

// // export const storeClicks = async ({id, originalUrl}) => {
// //   try {
// //     const res = parser.getResult();
// //     const device = res.type || "desktop"; // Default to desktop if type is not detected

// //     const response = await fetch("https://ipapi.co/json");
// //     const {city, country_name: country} = await response.json();

// //     // Record the click
// //     await supabase.from("clicks").insert({
// //       url_id: id,
// //       city: city,
// //       country: country,
// //       device: device,
// //     });

// //     // Redirect to the original URL
// //     window.location.href = originalUrl;
// //   } catch (error) {
// //     console.error("Error recording click:", error);
// //   }
// // };
// export const storeClicks = async ({ id, originalUrl }) => {
//   try {
//     const res = parser.getResult();
//     const device = res.device?.type || "desktop"; // mobile, tablet, or desktop

//     const response = await fetch("https://ipapi.co/json");
//     const { city, country_name: country } = await response.json();

//     await supabase.from("clicks").insert({
//       url_id: id,
//       city,
//       country,
//       device,
//     });

//     window.location.href = originalUrl;
//   } catch (error) {
//     console.error("Error recording click:", error);
//   }
// };

import { UAParser } from "ua-parser-js";
import supabase from "./supabase";

const parser = new UAParser();

// Your original working approach - but with ip-api.com instead of ipapi.co
export const storeClicks = async ({ id, originalUrl }) => {
  try {
    const res = parser.getResult();
    const device = res.device?.type || "desktop";
    
    // Get system info for validation
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language || 'unknown';
    const userAgent = navigator.userAgent || 'unknown';

    // Switch to ip-api.com since it shows Coimbatore correctly!
    const response = await fetch("http://ip-api.com/json/?fields=status,country,countryCode,region,regionName,city,query");
    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error('Geolocation service failed');
    }

    const { city, country, regionName: region, query: ip } = data;

    console.log(`🎯 Location detected: ${city}, ${country} (via ip-api.com)`);

    // Store with additional fields for better analytics
    await supabase.from("clicks").insert({
      url_id: id,
      city,
      country,
      region: region || 'Unknown',
      device,
      timezone,
      language,
      user_agent: userAgent,
      ip_address: ip,
      location_source: 'ip-api', // Track which service was used
      created_at: new Date().toISOString()
    });

    window.location.href = originalUrl;
  } catch (error) {
    console.error("Error recording click:", error);
    // Still redirect even if tracking fails
    window.location.href = originalUrl;
  }
};

// Keep your existing functions unchanged
export async function getClicksForUrls(urlIds) {
  if (!urlIds || urlIds.length === 0) {
    return [];
  }

  const {data, error} = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error("Error fetching clicks:", error);
    return null;
  }

  return data;
}

export async function getClicksForUrl(url_id) {
  const {data, error} = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load Stats");
  }

  return data;
}

// Simple validation function for analytics (doesn't affect location detection)
export const validateLocationAccuracy = (country, timezone) => {
  if (!timezone || !country) return 'unknown';
  
  console.log(`🔍 Validating: ${country} + ${timezone}`);
  
  // India and Sri Lanka both use UTC+5:30, so both Kolkata and Colombo are valid for India
  if (country === 'India' && (timezone.toLowerCase().includes('kolkata') || timezone.toLowerCase().includes('colombo'))) {
    return 'likely_accurate';
  }
  
  if (country === 'United States' && timezone.includes('America/')) {
    return 'likely_accurate';
  }
  if (country === 'United Kingdom' && timezone.includes('Europe/London')) {
    return 'likely_accurate';
  }
  
  // For other countries, assume accurate if country and timezone region match
  const timezoneRegion = timezone.split('/')[0]; // Asia, Europe, America, etc.
  const countryToRegion = {
    'India': 'Asia',
    'China': 'Asia', 
    'Japan': 'Asia',
    'Thailand': 'Asia',
    'Singapore': 'Asia',
    'Malaysia': 'Asia',
    'Indonesia': 'Asia',
    'Sri Lanka': 'Asia',
    'United States': 'America',
    'Canada': 'America',
    'Brazil': 'America',
    'Mexico': 'America',
    'Germany': 'Europe',
    'France': 'Europe',
    'United Kingdom': 'Europe',
    'Italy': 'Europe',
    'Spain': 'Europe'
  };
  
  const expectedRegion = countryToRegion[country];
  if (expectedRegion && timezoneRegion === expectedRegion) {
    return 'likely_accurate';
  }
  
  return 'potential_vpn_proxy';
};
