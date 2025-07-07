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

// import { UAParser } from "ua-parser-js";
// import supabase from "./supabase";

// const parser = new UAParser();

// // Your original working approach - but with ip-api.com instead of ipapi.co
// export const storeClicks = async ({ id, originalUrl }) => {
//   try {
//     const res = parser.getResult();
//     const device = res.device?.type || "desktop";
    
//     // Get system info for validation
//     const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//     const language = navigator.language || 'unknown';
//     const userAgent = navigator.userAgent || 'unknown';

//     // Switch to ip-api.com since it shows Coimbatore correctly!
//     const response = await fetch("http://ip-api.com/json/?fields=status,country,countryCode,region,regionName,city,query");
//     const data = await response.json();
    
//     if (data.status !== 'success') {
//       throw new Error('Geolocation service failed');
//     }

//     const { city, country, regionName: region, query: ip } = data;

//     console.log(`🎯 Location detected: ${city}, ${country} (via ip-api.com)`);

//     // Store with additional fields for better analytics
//     await supabase.from("clicks").insert({
//       url_id: id,
//       city,
//       country,
//       region: region || 'Unknown',
//       device,
//       timezone,
//       language,
//       user_agent: userAgent,
//       ip_address: ip,
//       location_source: 'ip-api', // Track which service was used
//       created_at: new Date().toISOString()
//     });

//     window.location.href = originalUrl;
//   } catch (error) {
//     console.error("Error recording click:", error);
//     // Still redirect even if tracking fails
//     window.location.href = originalUrl;
//   }
// };

// // Keep your existing functions unchanged
// export async function getClicksForUrls(urlIds) {
//   if (!urlIds || urlIds.length === 0) {
//     return [];
//   }

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

// // Simple validation function for analytics (doesn't affect location detection)
// export const validateLocationAccuracy = (country, timezone) => {
//   if (!timezone || !country) return 'unknown';
  
//   console.log(`🔍 Validating: ${country} + ${timezone}`);
  
//   // India and Sri Lanka both use UTC+5:30, so both Kolkata and Colombo are valid for India
//   if (country === 'India' && (timezone.toLowerCase().includes('kolkata') || timezone.toLowerCase().includes('colombo'))) {
//     return 'likely_accurate';
//   }
  
//   if (country === 'United States' && timezone.includes('America/')) {
//     return 'likely_accurate';
//   }
//   if (country === 'United Kingdom' && timezone.includes('Europe/London')) {
//     return 'likely_accurate';
//   }
  
//   // For other countries, assume accurate if country and timezone region match
//   const timezoneRegion = timezone.split('/')[0]; // Asia, Europe, America, etc.
//   const countryToRegion = {
//     'India': 'Asia',
//     'China': 'Asia', 
//     'Japan': 'Asia',
//     'Thailand': 'Asia',
//     'Singapore': 'Asia',
//     'Malaysia': 'Asia',
//     'Indonesia': 'Asia',
//     'Sri Lanka': 'Asia',
//     'United States': 'America',
//     'Canada': 'America',
//     'Brazil': 'America',
//     'Mexico': 'America',
//     'Germany': 'Europe',
//     'France': 'Europe',
//     'United Kingdom': 'Europe',
//     'Italy': 'Europe',
//     'Spain': 'Europe'
//   };
  
//   const expectedRegion = countryToRegion[country];
//   if (expectedRegion && timezoneRegion === expectedRegion) {
//     return 'likely_accurate';
//   }
  
//   return 'potential_vpn_proxy';
// };
import { UAParser } from "ua-parser-js";
import supabase from "./supabase";

const parser = new UAParser();

// Cache to avoid repeated API calls for same IP (30 minutes)
const locationCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000;

// HTTPS geolocation services (priority order for accuracy)
const GEOLOCATION_SERVICES = [
  {
    name: 'ipinfo',
    url: 'https://ipinfo.io/json',
    parseResponse: (data) => ({
      city: data.city || 'Unknown',
      country: data.country === 'IN' ? 'India' : (data.country || 'Unknown'),
      region: data.region || 'Unknown',
      ip: data.ip
    }),
    isValid: (data) => data && data.city && data.country
  },
  {
    name: 'ipapi',
    url: 'https://ipapi.co/json',
    parseResponse: (data) => ({
      city: data.city || 'Unknown',
      country: data.country_name || 'Unknown',
      region: data.region || 'Unknown',
      ip: data.ip
    }),
    isValid: (data) => data && data.city && data.country_name
  },
  {
    name: 'ipgeolocation',
    url: 'https://api.ipgeolocation.io/ipgeo',
    parseResponse: (data) => ({
      city: data.city || 'Unknown',
      country: data.country_name || 'Unknown',
      region: data.state_prov || 'Unknown',
      ip: data.ip
    }),
    isValid: (data) => data && data.city && data.country_name
  }
];

// Get location with HTTPS fallback system
const getLocationWithFallback = async () => {
  console.log('🌍 Starting HTTPS geolocation detection...');

  for (const service of GEOLOCATION_SERVICES) {
    try {
      console.log(`🔍 Trying ${service.name} (HTTPS)...`);
      
      const response = await fetch(service.url);
      
      if (!response.ok) {
        console.warn(`❌ ${service.name}: HTTP ${response.status}`);
        continue;
      }

      const data = await response.json();
      
      if (service.isValid(data)) {
        const location = service.parseResponse(data);
        console.log(`✅ ${service.name} success:`, location);
        
        return {
          ...location,
          source: service.name
        };
      } else {
        console.warn(`❌ ${service.name}: Invalid response`, data);
      }
    } catch (error) {
      console.warn(`❌ ${service.name} failed:`, error.message);
      continue;
    }
  }
  
  console.log('❌ All HTTPS geolocation services failed, using fallback');
  return {
    city: 'Unknown',
    country: 'Unknown', 
    region: 'Unknown',
    ip: 'Unknown',
    source: 'fallback'
  };
};

// Get cached location or fetch new one
const getCachedLocation = async () => {
  try {
    // Get user's IP first for caching
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const { ip } = await ipResponse.json();
    
    const cacheKey = ip;
    const cached = locationCache.get(cacheKey);
    
    // Check if we have valid cached data
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('📦 Using cached location for IP:', ip);
      return { ...cached.data, ip };
    }
    
    // Get fresh location data
    const location = await getLocationWithFallback();
    
    // Cache the result
    locationCache.set(cacheKey, {
      data: location,
      timestamp: Date.now()
    });
    
    return { ...location, ip };
  } catch (error) {
    console.error('Error getting IP address:', error);
    return await getLocationWithFallback();
  }
};

// Main click tracking function - PRODUCTION READY
export const storeClicks = async ({ id, originalUrl }) => {
  const startTime = Date.now();
  console.log('🔗 Processing click for URL ID:', id);
  console.log('🌐 Site URL:', window.location.origin);

  try {
    // Get device info
    const res = parser.getResult();
    const device = res.device?.type || "desktop";
    console.log('📱 Device detected:', device);

    // Get system info
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language || 'unknown';
    const userAgent = navigator.userAgent || 'unknown';
    console.log('🕐 System info:', { timezone, language });

    // Get location with HTTPS fallback
    const location = await getCachedLocation();
    console.log('📍 Location result:', location);
    
    // Prepare data for database
    const clickData = {
      url_id: id,
      city: location.city,
      country: location.country,
      region: location.region,
      device,
      timezone,
      language,
      user_agent: userAgent,
      ip_address: location.ip,
      location_source: location.source,
      created_at: new Date().toISOString()
    };

    console.log('💾 Storing click data:', {
      ...clickData,
      user_agent: userAgent.substring(0, 50) + '...' // Truncate for cleaner logs
    });

    // Store in database with error handling
    const { data, error } = await supabase
      .from("clicks")
      .insert(clickData);

    if (error) {
      console.error('❌ Database error:', error);
      
      // Try fallback with minimal data if enhanced insert fails
      const fallbackData = {
        url_id: id,
        city: location.city,
        country: location.country,
        device
      };
      
      console.log('🔄 Trying fallback insert with minimal data...');
      const { error: fallbackError } = await supabase
        .from("clicks")
        .insert(fallbackData);
        
      if (fallbackError) {
        console.error('❌ Fallback insert also failed:', fallbackError);
        throw fallbackError;
      } else {
        console.log('✅ Fallback insert successful');
      }
    } else {
      console.log('✅ Enhanced insert successful');
    }

    const endTime = Date.now();
    console.log(`⚡ Click processing completed in ${endTime - startTime}ms`);
    console.log(`🎯 Final location: ${location.city}, ${location.country} via ${location.source}`);

    // Redirect to original URL
    window.location.href = originalUrl;

  } catch (error) {
    console.error("❌ Critical error recording click:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack
    });
    
    // Always redirect even if tracking completely fails
    console.log("🔄 Redirecting despite tracking failure...");
    window.location.href = originalUrl;
  }
};

// Fetch clicks for multiple URLs (Dashboard & Admin)
export async function getClicksForUrls(urlIds) {
  if (!urlIds || urlIds.length === 0) {
    return [];
  }

  try {
    const {data, error} = await supabase
      .from("clicks")
      .select("*")
      .in("url_id", urlIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching clicks for URLs:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Network error fetching clicks:", error);
    return [];
  }
}

// Fetch clicks for single URL (LinkPage)
export async function getClicksForUrl(url_id) {
  try {
    const {data, error} = await supabase
      .from("clicks")
      .select("*")
      .eq("url_id", url_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching clicks for URL:", error);
      throw new Error("Unable to load Stats");
    }

    return data || [];
  } catch (error) {
    console.error("Network error fetching URL clicks:", error);
    throw error;
  }
}

// Location accuracy validation (works with or without timezone)
export const validateLocationAccuracy = (country, timezone) => {
  if (!country) return 'unknown';
  
  // If no timezone data, assume legitimate countries are accurate (admin API)
  if (!timezone) {
    const legitimateCountries = [
      'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 
      'Germany', 'France', 'Japan', 'China', 'Brazil', 'Italy', 'Spain',
      'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'South Korea'
    ];
    return legitimateCountries.includes(country) ? 'likely_accurate' : 'unknown';
  }
  
  // India and Sri Lanka both use UTC+5:30, so both Kolkata and Colombo are valid
  if (country === 'India' && (
    timezone.toLowerCase().includes('kolkata') || 
    timezone.toLowerCase().includes('colombo')
  )) {
    return 'likely_accurate';
  }
  
  // US timezones
  if (country === 'United States' && timezone.includes('America/')) {
    return 'likely_accurate';
  }
  
  // UK timezone
  if (country === 'United Kingdom' && timezone.includes('Europe/London')) {
    return 'likely_accurate';
  }
  
  // Regional matching for other countries
  const timezoneRegion = timezone.split('/')[0];
  const countryToRegion = {
    'India': 'Asia',
    'China': 'Asia', 
    'Japan': 'Asia',
    'Thailand': 'Asia',
    'Singapore': 'Asia',
    'Malaysia': 'Asia',
    'Indonesia': 'Asia',
    'Philippines': 'Asia',
    'South Korea': 'Asia',
    'United States': 'America',
    'Canada': 'America',
    'Brazil': 'America',
    'Mexico': 'America',
    'Argentina': 'America',
    'Chile': 'America',
    'Germany': 'Europe',
    'France': 'Europe',
    'United Kingdom': 'Europe',
    'Italy': 'Europe',
    'Spain': 'Europe',
    'Netherlands': 'Europe',
    'Sweden': 'Europe',
    'Norway': 'Europe',
    'Australia': 'Australia',
    'New Zealand': 'Pacific'
  };
  
  const expectedRegion = countryToRegion[country];
  if (expectedRegion && timezoneRegion === expectedRegion) {
    return 'likely_accurate';
  }
  
  return 'potential_vpn_proxy';
};

// Analytics helper for location accuracy
export const analyzeLocationAccuracy = async (days = 7) => {
  try {
    const { data, error } = await supabase
      .from('clicks')
      .select('country, timezone, location_source, city, created_at')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Error fetching location analytics:', error);
      return null;
    }

    const analysis = data.reduce((acc, click) => {
      const accuracy = validateLocationAccuracy(click.country, click.timezone);
      
      if (!acc[accuracy]) {
        acc[accuracy] = { count: 0, countries: new Set(), sources: new Set() };
      }
      
      acc[accuracy].count++;
      acc[accuracy].countries.add(click.country);
      acc[accuracy].sources.add(click.location_source);
      
      return acc;
    }, {});

    // Convert Sets to arrays
    Object.keys(analysis).forEach(key => {
      analysis[key].countries = Array.from(analysis[key].countries);
      analysis[key].sources = Array.from(analysis[key].sources);
    });

    return {
      totalClicks: data.length,
      accuracyBreakdown: analysis,
      topCountries: [...new Set(data.map(c => c.country))].slice(0, 10),
      activeSources: [...new Set(data.map(c => c.location_source))].filter(Boolean)
    };
  } catch (error) {
    console.error('Error analyzing location accuracy:', error);
    return null;
  }
};

// Test function for debugging
export const testGeolocation = async () => {
  console.log('🧪 Testing geolocation services...');
  
  const location = await getCachedLocation();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const accuracy = validateLocationAccuracy(location.country, timezone);
  
  return {
    detectedLocation: location,
    systemTimezone: timezone,
    accuracyAssessment: accuracy,
    browserInfo: {
      language: navigator.language,
      userAgent: navigator.userAgent.substring(0, 100) + '...',
      online: navigator.onLine
    },
    siteInfo: {
      origin: window.location.origin,
      protocol: window.location.protocol,
      isHTTPS: window.location.protocol === 'https:'
    },
    timestamp: new Date().toISOString()
  };
};