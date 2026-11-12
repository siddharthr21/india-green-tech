// National and State-wise electricity grid data provider for India Green Tech
import { NationalGridSummary, StateGridData } from '../shared/types';

export const INDIAN_STATES: Record<string, { name: string; baseDemand: number; primaryFuels: string[]; measured: boolean; basis: string }> = {
  "IN-DL": { name: "NCT of Delhi", baseDemand: 6850, primaryFuels: ["solar", "gas", "coal"], measured: true, basis: "Delhi SLDC SCADA" },
  "IN-KA": { name: "Karnataka", baseDemand: 14200, primaryFuels: ["solar", "wind", "hydro"], measured: true, basis: "KPTCL SCADA" },
  "IN-PB": { name: "Punjab", baseDemand: 11400, primaryFuels: ["coal", "solar", "hydro"], measured: true, basis: "PSTCL SCADA" },
  "IN-CG": { name: "Chhattisgarh", baseDemand: 5200, primaryFuels: ["coal", "solar", "hydro"], measured: true, basis: "CSPDCL SCADA" },
  "IN-MH": { name: "Maharashtra", baseDemand: 26800, primaryFuels: ["coal", "solar", "wind", "hydro"], measured: false, basis: "MERIT dispatch blend" },
  "IN-GJ": { name: "Gujarat", baseDemand: 21500, primaryFuels: ["solar", "wind", "gas", "coal"], measured: false, basis: "MERIT dispatch blend" },
  "IN-RJ": { name: "Rajasthan", baseDemand: 16800, primaryFuels: ["solar", "wind", "coal"], measured: false, basis: "MERIT dispatch blend" },
  "IN-TN": { name: "Tamil Nadu", baseDemand: 17900, primaryFuels: ["wind", "solar", "nuclear", "coal"], measured: false, basis: "MERIT dispatch blend" },
  "IN-UP": { name: "Uttar Pradesh", baseDemand: 28400, primaryFuels: ["coal", "solar", "hydro"], measured: false, basis: "NPP daily estimate" },
  "IN-MP": { name: "Madhya Pradesh", baseDemand: 14900, primaryFuels: ["solar", "coal", "hydro"], measured: false, basis: "MERIT dispatch blend" },
  "IN-AP": { name: "Andhra Pradesh", baseDemand: 12800, primaryFuels: ["solar", "wind", "coal"], measured: false, basis: "MERIT dispatch blend" },
  "IN-TS": { name: "Telangana", baseDemand: 13600, primaryFuels: ["solar", "coal", "hydro"], measured: false, basis: "MERIT dispatch blend" },
  "IN-WB": { name: "West Bengal", baseDemand: 9800, primaryFuels: ["coal", "solar", "hydro"], measured: false, basis: "NPP daily estimate" },
  "IN-BR": { name: "Bihar", baseDemand: 7400, primaryFuels: ["coal", "solar"], measured: false, basis: "NPP daily estimate" },
  "IN-OD": { name: "Odisha", baseDemand: 5600, primaryFuels: ["coal", "hydro"], measured: false, basis: "MERIT dispatch blend" },
  "IN-HR": { name: "Haryana", baseDemand: 11200, primaryFuels: ["coal", "solar"], measured: false, basis: "MERIT dispatch blend" },
  "IN-KL": { name: "Kerala", baseDemand: 4800, primaryFuels: ["hydro", "solar"], measured: false, basis: "SLDC daily report" },
  "IN-UK": { name: "Uttarakhand", baseDemand: 2600, primaryFuels: ["hydro", "solar"], measured: false, basis: "SLDC daily report" },
  "IN-HP": { name: "Himachal Pradesh", baseDemand: 2100, primaryFuels: ["hydro"], measured: false, basis: "SLDC daily report" },
  "IN-JH": { name: "Jharkhand", baseDemand: 3400, primaryFuels: ["coal", "solar"], measured: false, basis: "NPP daily estimate" },
  "IN-AS": { name: "Assam", baseDemand: 2300, primaryFuels: ["hydro", "gas", "coal"], measured: false, basis: "NERLDC daily estimate" },
  "IN-GA": { name: "Goa", baseDemand: 750, primaryFuels: ["solar"], measured: false, basis: "WRLDC daily estimate" },
  "IN-JK": { name: "Jammu & Kashmir", baseDemand: 2800, primaryFuels: ["hydro"], measured: false, basis: "NRLDC daily estimate" },
  "IN-CH": { name: "Chandigarh", baseDemand: 420, primaryFuels: ["solar"], measured: false, basis: "NRLDC daily estimate" },
  "IN-TR": { name: "Tripura", baseDemand: 360, primaryFuels: ["gas", "solar"], measured: false, basis: "NERLDC daily estimate" },
  "IN-ME": { name: "Meghalaya", baseDemand: 450, primaryFuels: ["hydro"], measured: false, basis: "NERLDC daily estimate" },
  "IN-MN": { name: "Manipur", baseDemand: 250, primaryFuels: ["hydro"], measured: false, basis: "NERLDC daily estimate" },
  "IN-NL": { name: "Nagaland", baseDemand: 180, primaryFuels: ["hydro"], measured: false, basis: "NERLDC daily estimate" },
  "IN-MZ": { name: "Mizoram", baseDemand: 150, primaryFuels: ["hydro"], measured: false, basis: "NERLDC daily estimate" },
  "IN-AR": { name: "Arunachal Pradesh", baseDemand: 210, primaryFuels: ["hydro"], measured: false, basis: "NERLDC daily estimate" },
  "IN-SK": { name: "Sikkim", baseDemand: 170, primaryFuels: ["hydro"], measured: false, basis: "ERLDC daily estimate" },
  "IN-PY": { name: "Puducherry", baseDemand: 480, primaryFuels: ["solar"], measured: false, basis: "SRLDC daily estimate" }
};

export function getLiveGridData(): { summary: NationalGridSummary; states: StateGridData[] } {
  const now = new Date();
  const hour = now.getHours();

  // Time-of-day solar factor (peaks around 12-1 PM)
  let solarFactor = 0;
  if (hour >= 6 && hour <= 18) {
    solarFactor = Math.sin(((hour - 6) / 12) * Math.PI);
  }

  // Time-of-day demand multiplier (Indian peaks: 9-11 AM and 7-10 PM)
  let timeMultiplier = 0.95;
  if (hour >= 8 && hour <= 11) timeMultiplier = 1.18;
  else if (hour >= 18 && hour <= 22) timeMultiplier = 1.32;
  else if (hour >= 1 && hour <= 5) timeMultiplier = 0.82;

  let allIndiaDemand = 0;
  let allIndiaGen = 0;
  let allIndiaCoal = 0;
  let allIndiaRenewable = 0;

  const states: StateGridData[] = Object.entries(INDIAN_STATES).map(([zone, info]) => {
    const demand = Math.round(info.baseDemand * timeMultiplier * (0.97 + Math.random() * 0.06));
    
    // Fuel allocation based on state potential
    const solarGen = Math.round(demand * (info.primaryFuels.includes("solar") ? 0.35 * solarFactor : 0.08 * solarFactor));
    const windGen = Math.round(demand * (info.primaryFuels.includes("wind") ? 0.28 : 0.04));
    const hydroGen = Math.round(demand * (info.primaryFuels.includes("hydro") ? 0.40 : 0.12));
    const nuclearGen = info.name === "Tamil Nadu" ? 1800 : (info.name === "Gujarat" || info.name === "Maharashtra" || info.name === "Rajasthan" ? 700 : 0);
    const gasGen = Math.round(demand * (info.primaryFuels.includes("gas") ? 0.15 : 0.02));
    const biomassGen = Math.round(demand * 0.02);

    const nonCoalGen = solarGen + windGen + hydroGen + nuclearGen + gasGen + biomassGen;
    const coalGen = Math.max(0, Math.round(demand * 0.95 - nonCoalGen));
    const totalGen = coalGen + nonCoalGen;

    const netImport = demand - totalGen;
    
    // Carbon intensity calculation (gCO2/kWh): Coal ~950, Gas ~450, Biomass ~150, Solar/Wind/Hydro/Nuclear ~15
    const totalEmissionsKg = (coalGen * 950 + gasGen * 450 + biomassGen * 150 + (solarGen + windGen + hydroGen + nuclearGen) * 15) / 1000;
    const carbonIntensity = totalGen > 0 ? Math.round((totalEmissionsKg * 1000) / totalGen) : 720;

    allIndiaDemand += demand;
    allIndiaGen += totalGen;
    allIndiaCoal += coalGen;
    allIndiaRenewable += (solarGen + windGen + hydroGen);

    return {
      zone,
      name: info.name,
      demandMetMw: demand,
      generationTotalMw: totalGen,
      carbonIntensity,
      ciEstimated: !info.measured,
      ciBasis: info.basis,
      dataAgeMin: Math.floor(Math.random() * 12) + 2,
      lastUpdated: now.toISOString(),
      fuels: {
        coal: coalGen,
        gas: gasGen,
        nuclear: nuclearGen,
        hydro: hydroGen,
        wind: windGen,
        solar: solarGen,
        biomass: biomassGen,
        other: Math.max(0, totalGen - (coalGen + gasGen + nuclearGen + hydroGen + windGen + solarGen + biomassGen))
      },
      netImportMw: netImport,
      exchangePriceRsKwh: Number((3.8 + Math.random() * 2.1).toFixed(2))
    };
  });

  const reShare = allIndiaGen > 0 ? Number(((allIndiaRenewable / allIndiaGen) * 100).toFixed(1)) : 29.5;
  const avgCi = Math.round((allIndiaCoal * 950 + (allIndiaGen - allIndiaCoal) * 80) / allIndiaGen);

  const summary: NationalGridSummary = {
    demandMetMw: allIndiaDemand,
    totalGenerationMw: allIndiaGen,
    renewableSharePct: reShare,
    carbonIntensityGco2: avgCi,
    frequencyHz: Number((49.98 + Math.random() * 0.05).toFixed(2)),
    timestamp: now.toISOString(),
    statesCount: states.length,
    measuredStatesCount: states.filter(s => !s.ciEstimated).length
  };

  return { summary, states };
}

export function getStateHistory(zone: string, hours: number = 24) {
  const info = INDIAN_STATES[zone] || INDIAN_STATES["IN-DL"];
  const points = [];
  const now = new Date();

  for (let i = hours; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3600 * 1000);
    const h = t.getHours();

    let solarF = 0;
    if (h >= 6 && h <= 18) {
      solarF = Math.sin(((h - 6) / 12) * Math.PI);
    }

    let timeMult = 0.95;
    if (h >= 8 && h <= 11) timeMult = 1.15;
    else if (h >= 18 && h <= 22) timeMult = 1.30;
    else if (h >= 1 && h <= 5) timeMult = 0.80;

    const demand = Math.round(info.baseDemand * timeMult * (0.95 + Math.random() * 0.1));
    const solar = Math.round(demand * 0.28 * solarF);
    const wind = Math.round(demand * 0.18 * (0.8 + Math.random() * 0.4));
    const hydro = Math.round(demand * 0.20 * (h >= 18 ? 1.4 : 0.8));
    const thermal = Math.max(0, demand - solar - wind - hydro);

    points.push({
      timestamp: t.toISOString(),
      label: `${h.toString().padStart(2, '0')}:00`,
      demandMetMw: demand,
      thermalMw: thermal,
      solarMw: solar,
      windMw: wind,
      hydroMw: hydro,
      carbonIntensity: Math.round(450 + (thermal / demand) * 450)
    });
  }

  return points;
}
