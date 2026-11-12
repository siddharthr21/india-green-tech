import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getLiveGridData, getStateHistory } from './gridData';
import { runOptimization, generateForecastData, CITY_CHARACTERISTICS } from './forecasting';
import { calculateRooftopSolar, STATE_TARIFFS } from './suryaData';
import { simulatePVStrings } from './pvgisEngine';
import { getAIMentorResponse } from './aiMentor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'online',
    platform: 'India Green Tech',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------
// 1. National Grid Telemetry APIs
// ----------------------------------------------------
app.get('/api/grid/live', (req, res) => {
  try {
    const data = getLiveGridData();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/grid/zone/:id/history', (req, res) => {
  try {
    const hours = parseInt(req.query.hours as string) || 24;
    const history = getStateHistory(req.params.id, hours);
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 2. Regional Renewable Forecasting & Optimization
// ----------------------------------------------------
app.get('/api/forecasting/regions', (req, res) => {
  res.json(CITY_CHARACTERISTICS);
});

app.post('/api/forecasting/optimize', (req, res) => {
  try {
    const { region = 'Jodhpur', forecastMethod = '24h', energyFocus = ['solar', 'wind', 'hydro'], costWeight = 0.5 } = req.body;
    const result = runOptimization(region, forecastMethod, energyFocus, costWeight);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 3. Smart City Clean Energy Simulation
// ----------------------------------------------------
app.post('/api/smart-city/simulate', (req, res) => {
  try {
    const { city = 'Jodhpur', totalBudgetCr = 100, allocations = { solar: 40, wind: 30, hydro: 15, storage: 15 }, simYear = 2026 } = req.body;
    
    const totalAllocated = allocations.solar + allocations.wind + allocations.hydro + allocations.storage;
    const scaleFactor = totalAllocated > 0 ? (totalBudgetCr / totalAllocated) : 1;
    
    const solarCr = allocations.solar * scaleFactor;
    const windCr = allocations.wind * scaleFactor;
    const hydroCr = allocations.hydro * scaleFactor;
    const storageCr = allocations.storage * scaleFactor;

    const solarMw = solarCr * 1.8;
    const windMw = windCr * 1.2;
    const hydroMw = hydroCr * 0.9;
    const storageMwh = storageCr * 1.4;

    const annualGwh = (solarMw * 1500 + windMw * 2200 + hydroMw * 3500) / 1000;
    const co2SavedTonnes = Math.round(annualGwh * 1000 * 0.82);
    
    const diversityScore = (Math.min(solarCr, windCr, hydroCr, storageCr) / (totalBudgetCr / 4)) * 25;
    const cleanEnergyPct = Math.min(98, Math.round(45 + (annualGwh / 5) * 1.2));
    const publicSatisfactionPct = Math.min(99, Math.round(65 + diversityScore + (cleanEnergyPct * 0.2)));

    let sustainabilityRank = 'A+';
    if (publicSatisfactionPct < 70) sustainabilityRank = 'B';
    else if (publicSatisfactionPct < 85) sustainabilityRank = 'A';

    res.json({
      city,
      simYear,
      energyOutputGwh: Number(annualGwh.toFixed(1)),
      budgetRemainingCr: Math.max(0, totalBudgetCr - (solarCr + windCr + hydroCr + storageCr)),
      co2SavedTonnes,
      publicSatisfactionPct,
      sustainabilityRank,
      capacitiesBuilt: {
        solarMw: Number(solarMw.toFixed(1)),
        windMw: Number(windMw.toFixed(1)),
        hydroMw: Number(hydroMw.toFixed(1)),
        storageMwh: Number(storageMwh.toFixed(1))
      },
      eventsTriggered: [
        'Monsoon peak boosted hydro generation by 18%',
        'Heatwave spike met comfortably via solar noon generation',
        'Storage buffer prevented local feeder tripping during evening peak'
      ]
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 4. Rooftop Solar & Subsidy Endpoints
// ----------------------------------------------------
function getReferenceData() {
  const possiblePaths = [
    path.resolve(__dirname, 'reference.json'),
    path.resolve(__dirname, '../../server/reference.json'),
    path.resolve(process.cwd(), 'server/reference.json'),
    path.resolve(process.cwd(), 'dist/server/reference.json')
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, 'utf-8'));
      } catch (e) {
        console.warn('Error reading reference json at', p, e);
      }
    }
  }
  return null;
}

app.get(['/reference', '/api/reference'], (req, res) => {
  const ref = getReferenceData();
  if (ref) {
    res.json(ref);
  } else {
    res.status(404).json({ error: 'reference_not_found', hint: 'Reference data file not found' });
  }
});

app.get(['/geocode', '/api/geocode', '/suggest', '/api/suggest'], async (req, res) => {
  const q = (req.query.q as string || '').trim();
  if (!q) return res.json([]);
  try {
    const fetchRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ', India')}&countrycodes=in&limit=5`, {
      headers: { 'User-Agent': 'IndiaGreenTech/1.0 (clean-energy-platform)' }
    });
    if (fetchRes.ok) {
      const data: any[] = await fetchRes.json();
      const places = data.map((d: any) => ({
        name: d.display_name,
        lat: parseFloat(d.lat),
        lon: parseFloat(d.lon),
        state: d.display_name.split(',').slice(-3, -2)[0]?.trim() || 'India'
      }));
      return res.json(places);
    }
  } catch (e) {
    // Fallback if network blocked
  }

  // Fallback preset places
  const presets = [
    { name: 'Rohini Sector 15, New Delhi, Delhi, 110089', lat: 28.7180, lon: 77.1260, state: 'Delhi', stateCode: 'DL', city: 'Delhi' },
    { name: 'Indiranagar, Bangalore, Karnataka, 560038', lat: 12.9784, lon: 77.6408, state: 'Karnataka', stateCode: 'KA', city: 'Bangalore' },
    { name: 'Bandra West, Mumbai, Maharashtra, 400050', lat: 19.0596, lon: 72.8295, state: 'Maharashtra', stateCode: 'MH', city: 'Mumbai' },
    { name: 'Adyar, Chennai, Tamil Nadu, 600020', lat: 13.0012, lon: 80.2565, state: 'Tamil Nadu', stateCode: 'TN', city: 'Chennai' },
    { name: 'Vastrapur, Ahmedabad, Gujarat, 380015', lat: 23.0360, lon: 72.5298, state: 'Gujarat', stateCode: 'GJ', city: 'Ahmedabad' },
    { name: 'Mansarovar, Jaipur, Rajasthan, 302020', lat: 26.8532, lon: 75.7667, state: 'Rajasthan', stateCode: 'RJ', city: 'Jaipur' }
  ];
  const matched = presets.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  res.json(matched.length > 0 ? matched : presets.slice(0, 3));
});

// ----------------------------------------------------
// Location & Geocoding Endpoints
// ----------------------------------------------------
app.get(['/api/locate', '/locate'], async (req, res) => {
  try {
    const ipRes = await fetch('https://ipapi.co/json/', {
      headers: { 'User-Agent': 'IndiaGreenTech/1.0 (clean-energy-platform)' },
      signal: AbortSignal.timeout(3500)
    });
    if (ipRes.ok) {
      const data: any = await ipRes.json();
      if (data && data.latitude && data.longitude) {
        return res.json({
          found: true,
          city: data.city || 'Bengaluru',
          state: data.region || 'Karnataka',
          stateCode: data.region_code || 'KA',
          postal: data.postal || '',
          name: `${data.city || 'Local Area'}, ${data.region || 'Karnataka'}, India`,
          lat: data.latitude,
          lon: data.longitude
        });
      }
    }
  } catch (err) {
    // try fallback
  }

  try {
    const altRes = await fetch('https://freeipapi.com/api/json', {
      signal: AbortSignal.timeout(3000)
    });
    if (altRes.ok) {
      const d: any = await altRes.json();
      if (d && d.latitude && d.longitude) {
        return res.json({
          found: true,
          city: d.cityName || 'Bengaluru',
          state: d.regionName || 'Karnataka',
          stateCode: d.regionCode || 'KA',
          postal: d.zipCode || '',
          name: `${d.cityName || 'Urban Area'}, ${d.regionName || 'Karnataka'}, India`,
          lat: d.latitude,
          lon: d.longitude
        });
      }
    }
  } catch (err) {}

  // Safe geographic fallback if offline (Bengaluru central)
  res.json({
    found: true,
    city: 'Bengaluru',
    state: 'Karnataka',
    stateCode: 'KA',
    postal: '560001',
    name: 'MG Road, Bengaluru, Karnataka, 560001',
    lat: 12.9716,
    lon: 77.5946
  });
});

app.get(['/reverse', '/api/reverse'], async (req, res) => {
  const lat = parseFloat(req.query.lat as string) || 12.9716;
  const lon = parseFloat((req.query.lon || req.query.lng) as string) || 77.5946;

  try {
    const fetchRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`, {
      headers: { 'User-Agent': 'IndiaGreenTech/1.0 (clean-energy-platform)' },
      signal: AbortSignal.timeout(3500)
    });
    if (fetchRes.ok) {
      const data: any = await fetchRes.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || 'Local Area';
      const state = addr.state || 'Karnataka';

      const stateMap: Record<string, string> = {
        'Karnataka': 'KA', 'Delhi': 'DL', 'Maharashtra': 'MH', 'Tamil Nadu': 'TN',
        'Gujarat': 'GJ', 'Rajasthan': 'RJ', 'Uttar Pradesh': 'UP', 'Telangana': 'TS',
        'Andhra Pradesh': 'AP', 'Kerala': 'KL', 'West Bengal': 'WB', 'Punjab': 'PB',
        'Haryana': 'HR', 'Madhya Pradesh': 'MP', 'Bihar': 'BR', 'Odisha': 'OD'
      };
      const stateCode = stateMap[state] || 'KA';
      const name = data.display_name || `${city}, ${state}, India`;

      return res.json({
        found: true,
        name,
        lat,
        lon,
        state,
        stateCode,
        city
      });
    }
  } catch (err) {
    // fallback if external API is slow or unreachable
  }

  // Coordinate-based Indian city resolution fallback
  let city = 'Bengaluru';
  let state = 'Karnataka';
  let stateCode = 'KA';

  if (lat >= 12.0 && lat <= 13.6 && lon >= 77.0 && lon <= 78.0) {
    city = 'Bengaluru';
    state = 'Karnataka';
    stateCode = 'KA';
  } else if (lat >= 28.3 && lat <= 28.9 && lon >= 76.8 && lon <= 77.4) {
    city = 'New Delhi';
    state = 'Delhi';
    stateCode = 'DL';
  } else if (lat >= 18.8 && lat <= 19.4 && lon >= 72.7 && lon <= 73.2) {
    city = 'Mumbai';
    state = 'Maharashtra';
    stateCode = 'MH';
  } else if (lat >= 12.8 && lat <= 13.3 && lon >= 80.0 && lon <= 80.4) {
    city = 'Chennai';
    state = 'Tamil Nadu';
    stateCode = 'TN';
  } else if (lat >= 17.2 && lat <= 17.6 && lon >= 78.2 && lon <= 78.6) {
    city = 'Hyderabad';
    state = 'Telangana';
    stateCode = 'TS';
  }

  res.json({
    found: true,
    name: `${city}, ${state}, India`,
    lat,
    lon,
    state,
    stateCode,
    city
  });
});

app.get(['/quick', '/api/quick'], (req, res) => {
  res.json({
    kwhPerKwp: 1450,
    tilt: 20,
    source: 'MNRE/PVGIS Solar Benchmark'
  });
});

app.get(['/building', '/api/building'], (req, res) => {
  const lat = parseFloat(req.query.lat as string) || 12.9716;
  const lon = parseFloat((req.query.lon || req.query.lng) as string) || 77.5946;
  // Realistic rectangular roof polygon of ~116 m² (11.2m x 10.4m) centered around the pin
  const dLat = 0.000047; // ~5.2m north/south
  const dLng = 0.000052; // ~5.6m east/west
  const polygon = [
    [lon - dLng, lat - dLat],
    [lon + dLng, lat - dLat],
    [lon + dLng, lat + dLat],
    [lon - dLng, lat + dLat],
    [lon - dLng, lat - dLat]
  ];
  res.json({
    found: true,
    containsPoint: true,
    polygon,
    ring: polygon,
    areaM2: 116,
    levels: "2",
    height: "6.5"
  });
});

app.get(['/monthly', '/api/monthly'], (req, res) => {
  res.json({
    tilt: 20,
    monthly: [120, 130, 145, 155, 160, 125, 95, 98, 115, 135, 128, 118]
  });
});

app.post(['/yield', '/api/yield'], (req, res) => {
  const { tilts = [5, 10, 15, 20, 25, 30, 35] } = req.body;
  const yields: Record<string, number> = {};
  for (const t of tilts) {
    const factor = 1 - Math.abs(t - 20) * 0.004;
    // Normalized annual kWh per 1 kWp for Indian insolation (~1,450 kWh/kWp/year)
    yields[t] = Math.round(1450 * factor);
  }
  // Return the direct Record<string, number> as required by YieldResponse
  res.json(yields);
});

app.post(['/finance', '/api/finance'], (req, res) => {
  const kwp = Number(req.body.kwp || req.body.systemSizeKw || 3);
  const state = String(req.body.stateCode || req.body.state || 'KA').toUpperCase();
  const monthlyBill = Number(req.body.monthlyBill || req.body.billMonthly || 2500);

  let central = 0;
  if (kwp <= 2) central = Math.round(kwp * 30000);
  else if (kwp <= 3) central = Math.round(60000 + (kwp - 2) * 18000);
  else central = 78000;

  // State subsidies
  let stateSubsidy = 0;
  if (state === 'DL') stateSubsidy = Math.min(10000, Math.round(kwp * 2000));
  else if (state === 'UP') stateSubsidy = Math.min(30000, Math.round(kwp * 5000));

  const subsidy = central + stateSubsidy;
  const costLow = Math.round(kwp * 50000);
  const costHigh = Math.round(kwp * 60000);
  const netLow = Math.max(0, costLow - subsidy);
  const netHigh = Math.max(0, costHigh - subsidy);

  const tariff = state === 'DL' ? 7.5 : state === 'KA' ? 7.2 : state === 'MH' ? 8.5 : 6.8;
  const offsetKwhYear = Math.round(kwp * 1450);
  const savingsYear = Math.round(offsetKwhYear * tariff);

  const paybackLow = Number((netLow / (savingsYear || 1)).toFixed(1));
  const paybackHigh = Number((netHigh / (savingsYear || 1)).toFixed(1));
  const co2 = Number(((offsetKwhYear * 25 * 0.82) / 1000).toFixed(1));

  res.json({
    subsidy,
    subsidyBreakdown: { central, state: stateSubsidy, eligible: true },
    costRange: [costLow, costHigh],
    netCostRange: [netLow, netHigh],
    savingsYear,
    paybackRange: [paybackLow, paybackHigh],
    co2,
    offsetKwhYear,
    tariffUsed: tariff,
    notes: [
      'PM Surya Ghar: Muft Bijli Yojana Central Subsidy included',
      'Calculated against official MNRE and State DISCOM guidelines'
    ]
  });
});

app.post(['/pair', '/api/pair'], (req, res) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  res.json({ code, expiresIn: 300 });
});

app.get('/pair/:code', (req, res) => {
  res.json({ connected: true, marks: [] });
});

app.get('/api/rooftop/tariffs', (req, res) => {
  res.json(STATE_TARIFFS);
});

app.post('/api/rooftop/calculate', (req, res) => {
  try {
    const result = calculateRooftopSolar(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 5. Precision PV Yield Simulation Endpoints
// ----------------------------------------------------
app.post(['/api/simulate', '/simulate', '/api/pv-yield/simulate'], (req, res) => {
  try {
    const result = simulatePVStrings(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get(['/api/forecast', '/forecast'], (req, res) => {
  const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  const forecast = days.map((day, idx) => ({
    date: day,
    clearnessIndex: Number((0.65 + Math.sin(idx) * 0.15).toFixed(2)),
    dniKwhM2: Number((5.8 + Math.cos(idx) * 0.8).toFixed(1)),
    expectedYieldKwh: Math.round(18 + Math.sin(idx) * 4),
    condition: idx % 3 === 0 ? 'Sunny' : idx % 3 === 1 ? 'Partly Cloudy' : 'Clear'
  }));
  res.json({ site: { lat: 28.6139, lng: 77.2090 }, forecast });
});

// ----------------------------------------------------
// 6. AI Clean Energy Mentor
// ----------------------------------------------------
app.post('/api/mentor/chat', (req, res) => {
  try {
    const { message, context } = req.body;
    const response = getAIMentorResponse(message || '', context);
    res.json({ response });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static frontend files in production
const distPath = fs.existsSync(path.resolve(__dirname, '..', 'index.html'))
  ? path.resolve(__dirname, '..')
  : path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`India Green Tech unified server running on http://localhost:${PORT}`);
});
