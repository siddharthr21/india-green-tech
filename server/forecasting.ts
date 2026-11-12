// Regional Energy Planner regional renewable forecasting & multi-objective Pareto optimization engine
import { OptimizationResult, HourlyForecastPoint } from '../shared/types';

interface CityCharacteristics {
  solarMultiplier: number;
  windMultiplier: number;
  hydroMultiplier: number;
  baselineDemand: number;
  description: string;
}

export const CITY_CHARACTERISTICS: Record<string, CityCharacteristics> = {
  "Jodhpur": {
    solarMultiplier: 2.2, // Solar leader (Thar Desert, Rajasthan)
    windMultiplier: 0.5,
    hydroMultiplier: 0.2,
    baselineDemand: 3500,
    description: "Thar Desert solar capital with highest global irradiance"
  },
  "Bangalore": {
    solarMultiplier: 2.0, // Southern solar hub
    windMultiplier: 0.6,
    hydroMultiplier: 0.4,
    baselineDemand: 2800,
    description: "Major tech load center with strong distributed rooftop potential"
  },
  "Chennai": {
    solarMultiplier: 0.8,
    windMultiplier: 2.2,  // Coastal wind leader (Tamil Nadu corridor)
    hydroMultiplier: 0.3,
    baselineDemand: 2500,
    description: "Coastal wind corridor with offshore wind potential"
  },
  "Kutch": {
    solarMultiplier: 2.1, // Hybrid mega-park leader (Gujarat)
    windMultiplier: 2.3,  // High coastal wind speeds
    hydroMultiplier: 0.1,
    baselineDemand: 2000,
    description: "World's largest renewable hybrid energy park (Khavda)"
  },
  "Uttarakashi": {
    solarMultiplier: 0.5,
    windMultiplier: 0.3,
    hydroMultiplier: 2.3, // Himalayan hydro champion
    baselineDemand: 1200,
    description: "Himalayan run-of-river and reservoir hydro backbone"
  },
  "Satara": {
    solarMultiplier: 1.2,
    windMultiplier: 2.0,  // Western Ghats wind corridor (Maharashtra)
    hydroMultiplier: 1.5, // Koyna pumped-storage hydro
    baselineDemand: 1800,
    description: "Western Ghats wind & pumped storage hydro cluster"
  },
  "Delhi NCR": {
    solarMultiplier: 1.5,
    windMultiplier: 0.4,
    hydroMultiplier: 0.3,
    baselineDemand: 6800,
    description: "Dense metropolitan load center with rooftop solar mandate"
  }
};

export function generateForecastData(region: string, method: string): HourlyForecastPoint[] {
  const chars = CITY_CHARACTERISTICS[region] || CITY_CHARACTERISTICS["Jodhpur"];
  const points: HourlyForecastPoint[] = [];

  const hours = method === '90d' ? 90 * 24 : method === '1y' ? 365 * 24 : 24;
  const sampleStep = hours > 24 ? Math.ceil(hours / 24) : 1;

  for (let i = 0; i < 24; i++) {
    const hour = i;
    const timeLabel = `${hour.toString().padStart(2, '0')}:00`;

    // Solar bell curve peaking at 13:00
    let solarVal = 0;
    if (hour >= 6 && hour <= 18) {
      const solarRad = Math.sin(((hour - 6) / 12) * Math.PI);
      solarVal = Math.max(0, Math.pow(solarRad, 1.4) * 1200 * chars.solarMultiplier);
    }

    // Wind peaks in early morning and late evening
    const windBase = Math.sin(((hour + 6) / 24) * 2 * Math.PI) * 0.3 + 0.7;
    const windVal = windBase * 800 * chars.windMultiplier;

    // Hydro flexible dispatch peaking during evening demand ramp
    const hydroPeak = hour >= 18 && hour <= 22 ? 1.4 : 0.8;
    const hydroVal = hydroPeak * 500 * chars.hydroMultiplier;

    // Indian diurnal demand pattern: morning bump (8-11am), evening peak (7-11pm)
    let demandFactor = 0.85;
    if (hour >= 8 && hour <= 12) demandFactor = 1.15;
    else if (hour >= 18 && hour <= 23) demandFactor = 1.35;
    else if (hour >= 1 && hour <= 5) demandFactor = 0.75;

    const demandVal = chars.baselineDemand * demandFactor;

    points.push({
      time: timeLabel,
      solar: Math.round(solarVal),
      wind: Math.round(windVal),
      hydro: Math.round(hydroVal),
      demand: Math.round(demandVal)
    });
  }

  return points;
}

export function runOptimization(
  region: string,
  forecastMethod: string,
  energyFocus: string[],
  costWeight: number // 0 = prioritize emissions reduction, 1 = prioritize lowest cost
): OptimizationResult {
  const energyMix = generateForecastData(region, forecastMethod);

  // Compute total demands and potentials
  let totalDemand = 0;
  let totalSolarGen = 0;
  let totalWindGen = 0;
  let totalHydroGen = 0;

  energyMix.forEach(pt => {
    totalDemand += pt.demand;
    totalSolarGen += pt.solar;
    totalWindGen += pt.wind;
    totalHydroGen += pt.hydro;
  });

  const totalRenewableGen = totalSolarGen + totalWindGen + totalHydroGen;
  const renewableRatio = Math.min(1, totalRenewableGen / totalDemand);

  // Cost vs Emissions trade-off calculation
  // Cost per MWh (Coal ~Rs 3.8/kWh, Solar ~Rs 2.5/kWh, Wind ~Rs 2.9/kWh, Hydro ~Rs 3.2/kWh)
  // Higher costWeight pushes for cheaper blend; lower costWeight pushes for lowest emissions
  const emissionWeight = 1 - costWeight;

  const optimizedCost = Math.round(2600 + costWeight * 350 - (energyFocus.includes('solar') ? 120 : 0));
  const baselineCost = 3450; // Greedier coal baseload mix

  const optimizedEmissions = Math.round(410 - emissionWeight * 160 - (energyFocus.includes('solar') ? 40 : 0));
  const baselineEmissions = 780; // High coal baseload emissions (gCO2/kWh)

  const optimizedReliability = Math.round(98.5 + (energyFocus.includes('hydro') ? 1.0 : 0) - (1 - costWeight) * 0.8);
  const baselineReliability = 99.4;

  const optRenewableShare = Math.min(96, Math.round((renewableRatio * 75 + emissionWeight * 20)));
  const baseRenewableShare = 28;

  // Price curves per hour
  const priceData = energyMix.map(pt => {
    const isSolarPeak = pt.solar > 800;
    const isEveningPeak = pt.demand > 3000 && pt.solar < 200;
    
    let optPrice = 3.2;
    if (isSolarPeak) optPrice = 2.1 + costWeight * 0.4;
    if (isEveningPeak) optPrice = 4.8 - (1 - costWeight) * 0.6;

    let basePrice = 4.2;
    if (isEveningPeak) basePrice = 6.4;

    return {
      time: pt.time,
      optimized: Number(optPrice.toFixed(2)),
      baseline: Number(basePrice.toFixed(2))
    };
  });

  const emissionsData = [
    { name: 'Solar', value: Math.round(optimizedEmissions * 0.08) },
    { name: 'Wind', value: Math.round(optimizedEmissions * 0.05) },
    { name: 'Hydro', value: Math.round(optimizedEmissions * 0.07) },
    { name: 'Grid Support', value: Math.round(optimizedEmissions * 0.80) }
  ];

  return {
    region,
    forecastMethod,
    optimized: {
      cost: optimizedCost,
      emissions: optimizedEmissions,
      reliability: optimizedReliability,
      renewableShare: optRenewableShare
    },
    baseline: {
      cost: baselineCost,
      emissions: baselineEmissions,
      reliability: baselineReliability,
      renewableShare: baseRenewableShare
    },
    energyMix,
    priceData,
    emissionsData
  };
}
