const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    // In browser: call same-origin /api rewrite which proxies to BACKEND_ORIGIN
    return "/api";
  }
  // Server-side: use bound internal service URL
  return (process.env.BACKEND_ORIGIN || "http://localhost:8000").replace(/\/+$/, "");
};

async function get(path) {
  const base = getBaseUrl();
  const res = await fetch(`${base}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
}

export const fetchZones = () => get("/v1/zones");
export const fetchLive = (zone) => get(`/v1/zone/${zone}/live`);
export const fetchHistory = (zone, metric = "demand_met", hours = 24) =>
  get(`/v1/zone/${zone}/history?metric=${metric}&hours=${hours}`);

// one fetch per zone covering every panel chart
export const PANEL_METRICS = "demand_met,generation,carbon_intensity,net_import";
export const fetchPanelHistory = (zone) => fetchHistory(zone, PANEL_METRICS, 48);
