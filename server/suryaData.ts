// Rooftop Solar Planner rooftop solar, obstacle shadow modeling, and PM Surya Ghar subsidy calculator
import { RooftopCalculationInput, RooftopCalculationResult } from '../shared/types';

export const STATE_TARIFFS: Record<string, { name: string; tariffRsPerKwh: number; stateSubsidyPerKw: number; stateSubsidyCap: number }> = {
  "DL": { name: "Delhi", tariffRsPerKwh: 6.5, stateSubsidyPerKw: 10000, stateSubsidyCap: 30000 },
  "MH": { name: "Maharashtra", tariffRsPerKwh: 8.2, stateSubsidyPerKw: 0, stateSubsidyCap: 0 },
  "KA": { name: "Karnataka", tariffRsPerKwh: 7.4, stateSubsidyPerKw: 0, stateSubsidyCap: 0 },
  "TN": { name: "Tamil Nadu", tariffRsPerKwh: 6.8, stateSubsidyPerKw: 0, stateSubsidyCap: 0 },
  "GJ": { name: "Gujarat", tariffRsPerKwh: 6.2, stateSubsidyPerKw: 0, stateSubsidyCap: 0 },
  "RJ": { name: "Rajasthan", tariffRsPerKwh: 7.1, stateSubsidyPerKw: 0, stateSubsidyCap: 0 },
  "UP": { name: "Uttar Pradesh", tariffRsPerKwh: 6.9, stateSubsidyPerKw: 15000, stateSubsidyCap: 30000 },
  "WB": { name: "West Bengal", tariffRsPerKwh: 7.8, stateSubsidyPerKw: 0, stateSubsidyCap: 0 },
  "default": { name: "National Average", tariffRsPerKwh: 6.75, stateSubsidyPerKw: 0, stateSubsidyCap: 0 }
};

export function calculateRooftopSolar(input: RooftopCalculationInput): RooftopCalculationResult {
  const stateInfo = STATE_TARIFFS[input.stateCode] || STATE_TARIFFS["default"];

  // 1. Calculate usable area subtracting obstacles and their shadow buffers
  let obstacleArea = 0;
  for (const obs of input.obstacles || []) {
    const totalW = obs.width + obs.shadowBuffer * 2;
    const totalH = obs.height + obs.shadowBuffer * 2;
    obstacleArea += totalW * totalH;
  }

  // Usable area after parapet clearance (typically 80% baseline minus obstacles)
  const netUsableSqM = Math.max(10, (input.roofAreaSqM * 0.85) - obstacleArea);

  // 2. Panel packing
  // Standard 550W panel is ~2.28m x 1.13m = ~2.58 m2
  // Standard 400W panel is ~2.0m x 1.0m = ~2.0 m2
  const panelWattage = input.panelWattageW || 550;
  const panelArea = panelWattage >= 500 ? 2.58 : 2.0;
  
  // Calculate maximum physical panel fit
  const maxPanels = Math.floor(netUsableSqM / (panelArea * 1.15)); // 15% walking clearance between rows

  // Estimate required capacity from electricity bill:
  // Units per month = monthlyBill / tariff
  // Daily units = Units / 30
  // Required kW = Daily units / 4 (1 kW gives ~4 kWh/day in India)
  const monthlyUnits = input.monthlyBillRs / stateInfo.tariffRsPerKwh;
  const targetKw = monthlyUnits / (30 * 4.0);
  const targetPanels = Math.ceil((targetKw * 1000) / panelWattage);

  // Final panel count is constrained by roof space, but at least 2 panels if space permits
  const panelCount = Math.max(2, Math.min(maxPanels, targetPanels));
  const systemSizeKw = Number(((panelCount * panelWattage) / 1000).toFixed(2));

  // 3. PM Surya Ghar Muft Bijli Yojana Central Subsidy
  // First 2 kW: Rs 30,000 / kW
  // 3rd kW: Rs 18,000 / kW
  // Max central subsidy cap: Rs 78,000 (at 3 kW and above)
  let centralSubsidyRs = 0;
  if (systemSizeKw <= 2) {
    centralSubsidyRs = systemSizeKw * 30000;
  } else if (systemSizeKw <= 3) {
    centralSubsidyRs = 2 * 30000 + (systemSizeKw - 2) * 18000;
  } else {
    centralSubsidyRs = 78000;
  }
  centralSubsidyRs = Math.round(Math.min(78000, centralSubsidyRs));

  // State top-up subsidy (e.g. Delhi up to Rs 30,000, UP up to Rs 30,000)
  const stateSubsidyRs = Math.min(stateInfo.stateSubsidyCap, Math.round(systemSizeKw * stateInfo.stateSubsidyPerKw));
  const totalSubsidyRs = centralSubsidyRs + stateSubsidyRs;

  // Gross benchmark cost in India: ~Rs 52,000 - 60,000 per kW (monocrystalline PERC/TopCon with inverter & net metering)
  const costPerKw = 55000;
  const grossCostRs = Math.round(systemSizeKw * costPerKw);
  const netCostRs = Math.max(0, grossCostRs - totalSubsidyRs);

  // 4. Generation & Financial Returns
  // In India average solar insolation yields ~1450 kWh per kWp per year
  const tiltFactor = 1 - Math.abs((input.tiltDeg || 20) - 20) * 0.005;
  const annualYieldKwh = Math.round(systemSizeKw * 1460 * tiltFactor);

  const annualSavingsRs = Math.round(annualYieldKwh * stateInfo.tariffRsPerKwh);
  const paybackYears = Number((netCostRs / (annualSavingsRs || 1)).toFixed(1));

  // 25-year CO2 offset (0.82 kg CO2 per kWh avoided from Indian coal grid)
  const co2Offset25YrsTonnes = Number(((annualYieldKwh * 25 * 0.82) / 1000).toFixed(1));

  // Monthly generation distribution (April/May high, July/August monsoon dip)
  const monthlyWeights = [0.08, 0.085, 0.095, 0.105, 0.11, 0.08, 0.065, 0.065, 0.075, 0.085, 0.08, 0.075];
  const monthlyGenerationKwh = monthlyWeights.map(w => Math.round(annualYieldKwh * w));

  // Concessional Green Energy Loan (PM Surya Ghar collateral-free loan at 7% p.a. for 7 years)
  const loanPrincipal = netCostRs * 0.90; // 10% margin money
  const r = 0.07 / 12;
  const n = 84; // 7 years = 84 months
  const emi = Math.round((loanPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

  return {
    systemSizeKw,
    panelCount,
    estimatedAnnualKwh: annualYieldKwh,
    centralSubsidyRs,
    stateSubsidyRs,
    totalSubsidyRs,
    grossCostRs,
    netCostRs,
    annualSavingsRs,
    paybackYears,
    co2Offset25YrsTonnes,
    monthlyGenerationKwh,
    discomTariffRsPerKwh: stateInfo.tariffRsPerKwh,
    loanEmiMonthlyRs: emi
  };
}
