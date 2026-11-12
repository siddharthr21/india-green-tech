import express from 'express';
import cors from 'cors';
import path from 'path';
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
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'India Green Tech',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------
// 1. National Grid Telemetry APIs (India Energy Data)
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
// 2. Regional Renewable Forecasting & Optimization (EnerJee)
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
// 3. Smart City Clean Energy Simulation (EnerJee)
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

    // Realistic capacity built per Cr: Solar 1.8 MW/Cr, Wind 1.2 MW/Cr, Hydro 0.9 MW/Cr, Storage 1.4 MWh/Cr
    const solarMw = solarCr * 1.8;
    const windMw = windCr * 1.2;
    const hydroMw = hydroCr * 0.9;
    const storageMwh = storageCr * 1.4;

    const annualGwh = (solarMw * 1500 + windMw * 2200 + hydroMw * 3500) / 1000;
    const co2SavedTonnes = Math.round(annualGwh * 1000 * 0.82); // 820 gCO2/kWh saved vs coal
    
    // Balanced portfolio rewards public satisfaction
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
// 4. Rooftop Solar & Subsidy Calculator (SuryaCheck)
// ----------------------------------------------------
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
// 5. Precision PV Yield Simulation (Solar PV Yield)
// ----------------------------------------------------
app.post('/api/pv-yield/simulate', (req, res) => {
  try {
    const result = simulatePVStrings(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
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
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`India Green Tech unified server running on http://localhost:${PORT}`);
});
