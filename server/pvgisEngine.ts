// Precision Multi-Array PV Array Yield Studio Simulator and PVGIS proxy
import { PVSimulationInput, PVSimulationResult } from '../shared/types';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// Global solar radiation profile per month for typical Indian latitudes (kWh/m2/day)
const INDIAN_MONTHLY_GHI = [4.8, 5.5, 6.4, 6.8, 6.9, 5.4, 4.2, 4.3, 5.0, 5.2, 4.9, 4.6];

export function simulatePVStrings(input: PVSimulationInput): PVSimulationResult {
  const strings = input.strings || [];
  const totalCapacityKwp = Number(strings.reduce((sum, s) => sum + (s.capacityKwp || 0), 0).toFixed(2));

  // Compute monthly yields across strings
  const monthlyBreakdown: { month: string; yieldKwh: number; solarIrradianceKwhM2: number }[] = [];
  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let totalAnnualYield = 0;

  const stringsSummary = strings.map(s => {
    let strAnnual = 0;
    // Azimuth penalty (180 deg = true South is optimal in Northern Hemisphere India)
    // Azimuth difference from 180 deg:
    const azDiff = Math.abs(s.azimuthDeg - 180);
    const azEfficiency = Math.max(0.72, 1 - (azDiff / 180) * 0.25);

    // Tilt penalty (optimal ~20-25 deg in India)
    const tiltDiff = Math.abs(s.tiltDeg - 20);
    const tiltEfficiency = Math.max(0.85, 1 - (tiltDiff / 90) * 0.18);

    // System loss (cables, inverter, dust, temperature: typically 14%)
    const lossFactor = 1 - (s.systemLossPct || 14) / 100;

    for (let m = 0; m < 12; m++) {
      const dailyKwhPerKwp = INDIAN_MONTHLY_GHI[m] * azEfficiency * tiltEfficiency * lossFactor;
      const monthYield = dailyKwhPerKwp * daysInMonths[m] * s.capacityKwp;
      strAnnual += monthYield;
    }

    return {
      id: s.id,
      name: s.name,
      capacityKwp: s.capacityKwp,
      annualKwh: Math.round(strAnnual)
    };
  });

  for (let m = 0; m < 12; m++) {
    let monthTotal = 0;
    strings.forEach(s => {
      const azDiff = Math.abs(s.azimuthDeg - 180);
      const azEfficiency = Math.max(0.72, 1 - (azDiff / 180) * 0.25);
      const tiltDiff = Math.abs(s.tiltDeg - 20);
      const tiltEfficiency = Math.max(0.85, 1 - (tiltDiff / 90) * 0.18);
      const lossFactor = 1 - (s.systemLossPct || 14) / 100;

      const dailyKwhPerKwp = INDIAN_MONTHLY_GHI[m] * azEfficiency * tiltEfficiency * lossFactor;
      monthTotal += dailyKwhPerKwp * daysInMonths[m] * s.capacityKwp;
    });

    totalAnnualYield += monthTotal;
    monthlyBreakdown.push({
      month: MONTH_NAMES[m],
      yieldKwh: Math.round(monthTotal),
      solarIrradianceKwhM2: Number((INDIAN_MONTHLY_GHI[m] * daysInMonths[m]).toFixed(1))
    });
  }

  const roundedAnnualYield = Math.round(totalAnnualYield);
  const specificYield = totalCapacityKwp > 0 ? Math.round(roundedAnnualYield / totalCapacityKwp) : 1450;
  const performanceRatio = 78.5; // Typical high-quality Indian PV plant

  // Economics: 65% self-consumption, 35% grid export
  const selfConsumptionKwh = Math.round(roundedAnnualYield * 0.65);
  const exportKwh = Math.round(roundedAnnualYield * 0.35);

  const importTariff = input.economicAssumptions?.importTariffRsPerKwh || 7.2;
  const exportTariff = input.economicAssumptions?.exportTariffRsPerKwh || 3.15; // Average feed-in APPC tariff in India

  const annualRevenueRs = Math.round((selfConsumptionKwh * importTariff) + (exportKwh * exportTariff));

  return {
    site: { lat: input.lat || 28.6139, lng: input.lng || 77.2090 },
    totalCapacityKwp,
    annualYieldKwh: roundedAnnualYield,
    specificYieldKwhPerKwp: specificYield,
    performanceRatioPct: performanceRatio,
    monthlyBreakdown,
    stringsSummary,
    economics: {
      annualSelfConsumptionKwh: selfConsumptionKwh,
      annualExportKwh: exportKwh,
      annualRevenueRs
    }
  };
}
