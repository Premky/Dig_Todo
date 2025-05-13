const API_OPTIONS = [
  "http://localhost:3002",
  "http://192.168.162.15:3002",
  "http://192.168.192.15:3002"
];

const PORT = 3002;
const CURRENT_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${PORT}`;
const HEALTH_CHECK_PATH = "/display/ranks";

// Fetch with timeout
const fetchWithTimeout = (url, options = {}, timeout = 1500) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    ...options,
    signal: controller.signal
  }).finally(() => clearTimeout(id));
};

// Main function to determine usable API
export const getBaseUrl = async () => {
  // 1. Try cached URL (if it exists)
  const cached = localStorage.getItem("BASE_URL");
  if (cached) {
    try {
      const res = await fetchWithTimeout(`${cached}${HEALTH_CHECK_PATH}`);
      if (res.ok) {
        console.log(`✅ Using cached API: ${cached}`);
        return cached;
      }
    } catch {
      console.warn(`❌ Cached API failed: ${cached}`);
    }
  }

  // 2. Try current origin
  try {
    const res = await fetchWithTimeout(`${CURRENT_BASE_URL}${HEALTH_CHECK_PATH}`);
    if (res.ok) {
      console.log(`✅ Using current origin: ${CURRENT_BASE_URL}`);
      localStorage.setItem("BASE_URL", CURRENT_BASE_URL);
      return CURRENT_BASE_URL;
    }
  } catch {
    console.warn(`❌ Current origin not reachable: ${CURRENT_BASE_URL}`);
  }

  // 3. Try predefined options
  for (const url of API_OPTIONS) {
    try {
      const res = await fetchWithTimeout(`${url}${HEALTH_CHECK_PATH}`);
      if (res.ok) {
        console.log(`✅ Using fallback API: ${url}`);
        localStorage.setItem("BASE_URL", url);
        return url;
      }
    } catch {
      console.warn(`❌ API not reachable: ${url}`);
    }
  }

  // 4. All failed
  console.error("⚠️ No reachable API server found!");
  return null;
};
