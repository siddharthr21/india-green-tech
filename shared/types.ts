// Shared types across India Green Tech platform

export interface NationalGridSummary {
  demandMetMw: number;
  totalGenerationMw: number;
  renewableSharePct: number;
  carbonIntensityGco2: number;
  frequencyHz: number;
  timestamp: string;
  statesCount: number;
  measuredStatesCount: number;
}

export interface StateGridData {
  zone: string;
  name: string;
  demandMetMw: number;
  generationTotalMw: number;
  carbonIntensity: number;
  ciEstimated: boolean;
  ciBasis: string;
  dataAgeMin: number;
  lastUpdated: string;
  fuels: {
    coal: number;
    gas: number;
    nuclear: number;
    hydro: number;
    wind: number;
    solar: number;
    biomass: number;
    other: number;
  };
  netImportMw: number;
  exchangePriceRsKwh: number;
}

export interface RegionalForecastRequest {
  region: string;
  forecastMethod: string;
  energyFocus: string[];
  costWeight: number; // 0 to 1 (0 = prioritize emissions, 1 = prioritize cost)
}

export interface HourlyForecastPoint {
  time: string;
  solar: number;
  wind: number;
  hydro: number;
  demand: number;
}

export interface OptimizationResult {
  region: string;
  forecastMethod: string;
  optimized: {
    cost: number;
    emissions: number;
    reliability: number;
    renewableShare: number;
  };
  baseline: {
    cost: number;
    emissions: number;
    reliability: number;
    renewableShare: number;
  };
  energyMix: HourlyForecastPoint[];
  priceData: { time: string; optimized: number; baseline: number }[];
  emissionsData: { name: string; value: number }[];
}

export interface SmartCitySimulationParams {
  city: string;
  totalBudgetCr: number;
  allocations: {
    solar: number;
    wind: number;
    hydro: number;
    storage: number;
  };
  simYear: number;
}

export interface SmartCityResult {
  city: string;
  energyOutputGwh: number;
  budgetRemainingCr: number;
  co2SavedTonnes: number;
  publicSatisfactionPct: number;
  sustainabilityRank: string;
  eventsTriggered: string[];
  history: { year: number; satisfaction: number; cleanEnergyPct: number }[];
}

export interface RooftopCalculationInput {
  address: string;
  lat: number;
  lng: number;
  stateCode: string;
  monthlyBillRs: number;
  roofAreaSqM: number;
  usableAreaSqM: number;
  obstacles: Array<{
    id: string;
    type: 'water_tank' | 'staircase' | 'parapet' | 'custom';
    x: number;
    y: number;
    width: number;
    height: number;
    shadowBuffer: number;
  }>;
  tiltDeg: number;
  panelWattageW: number;
}

export interface RooftopCalculationResult {
  systemSizeKw: number;
  panelCount: number;
  estimatedAnnualKwh: number;
  centralSubsidyRs: number;
  stateSubsidyRs: number;
  totalSubsidyRs: number;
  grossCostRs: number;
  netCostRs: number;
  annualSavingsRs: number;
  paybackYears: number;
  co2Offset25YrsTonnes: number;
  monthlyGenerationKwh: number[];
  discomTariffRsPerKwh: number;
  loanEmiMonthlyRs: number;
}

export interface PVString {
  id: string;
  name: string;
  panelCount: number;
  panelWattage: number;
  capacityKwp: number;
  tiltDeg: number;
  azimuthDeg: number;
  systemLossPct: number;
}

export interface PVSimulationInput {
  lat: number;
  lng: number;
  strings: PVString[];
  economicAssumptions: {
    importTariffRsPerKwh: number;
    exportTariffRsPerKwh: number;
    inflationRatePct: number;
  };
}

export interface PVSimulationResult {
  site: { lat: number; lng: number };
  totalCapacityKwp: number;
  annualYieldKwh: number;
  specificYieldKwhPerKwp: number;
  performanceRatioPct: number;
  monthlyBreakdown: {
    month: string;
    yieldKwh: number;
    solarIrradianceKwhM2: number;
  }[];
  stringsSummary: {
    id: string;
    name: string;
    capacityKwp: number;
    annualKwh: number;
  }[];
  economics: {
    annualSelfConsumptionKwh: number;
    annualExportKwh: number;
    annualRevenueRs: number;
  };
}
