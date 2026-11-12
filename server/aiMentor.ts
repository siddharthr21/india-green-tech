// AI Energy Mentor backend helper for India Green Tech

export function getAIMentorResponse(query: string, context?: any): string {
  const q = query.toLowerCase();

  if (q.includes("pm surya ghar") || q.includes("subsidy") || q.includes("muft bijli")) {
    return `### ☀️ PM Surya Ghar: Muft Bijli Yojana Guide

**Central Financial Assistance (CFA) Structure:**
- **Systems up to 2 kW:** ₹30,000 per kW (Max ₹60,000 for 2 kW).
- **For the 3rd kW:** Additional ₹18,000.
- **Maximum Central Subsidy:** ₹78,000 for systems ≥ 3 kW.

**State Top-ups:**
- **Delhi:** ₹10,000/kW up to ₹30,000 extra under Delhi Solar Policy 2024.
- **Uttar Pradesh:** Up to ₹30,000 additional state subsidy.

**Concessional Financing:**
- Collateral-free bank loans available via national portal at ~7% interest for up to 7 years with only 10% margin money.`;
  }

  if (q.includes("merit order") || q.includes("grid dispatch") || q.includes("scada")) {
    return `### ⚡ Merit Order Dispatch & Grid Operations

- In the Indian National Grid, power stations are dispatched strictly by **variable cost** (Merit Order Dispatch).
- **Must-Run Status:** Solar and Wind plants enjoy statutory "must-run" priority—DISCOMs and SLDCs cannot curtail them except for severe grid security conditions.
- Four pioneering states (**Punjab, Delhi, Karnataka, Chhattisgarh**) publish real-time per-fuel generation via SLDC SCADA feeds. Other states are estimated via MERIT dispatch ladders.`;
  }

  if (q.includes("string") || q.includes("tilt") || q.includes("azimuth") || q.includes("pvgis")) {
    return `### 📐 Solar Array Engineering & Tilt Guidelines

- **Optimal Azimuth in India:** 180° (True South). Deviations to East (90°) or West (270°) cause a 12-18% reduction in total annual yield.
- **Optimal Tilt Angle:** Approximately equal to your site latitude (e.g., 28° in Delhi/Rajasthan, 13° in Bangalore/Chennai, 19° in Mumbai). A flat RCC roof typically uses a 15° to 20° fixed south-facing frame.
- **System Losses:** Standard baseline is 14% (soiling/dust: 3-5%, DC/AC cabling: 2%, inverter efficiency: 2%, temperature coefficient losses: 5%).`;
  }

  if (q.includes("smart city") || q.includes("budget") || q.includes("storage")) {
    return `### 🏙️ Municipal Clean Energy Strategy

- **Balanced Resource Allocation:** Relying solely on solar creates severe evening peak shortages (the "duck curve").
- **Best Practice Mix:** Allocate ~45% budget to Solar PV, ~25% to Wind (which peaks in afternoon/monsoon), and ~30% to Battery Energy Storage Systems (BESS) or Pumped-Storage Hydro (PSP) to achieve a 95%+ sustainability score.`;
  }

  return `### 🇮🇳 India Clean Energy Advisory

India has surpassed **200 GW of non-fossil fuel capacity** on its way to the **500 GW by 2030** national target.

Key highlights across our integrated platform:
1. **National Grid:** Track live 32-state demand and clean energy mix.
2. **Regional Planner:** Run multi-objective optimization balancing cost against emissions for major regional hubs.
3. **Rooftop Solar (SuryaCheck):** Model roof obstacles, shadow clearance, and PM Surya Ghar subsidies.
4. **PV Yield Studio:** Engineer precision multi-array orientations with true-north compass and PVGIS solar modeling.

What specific aspect of clean energy planning or grid telemetry would you like to explore?`;
}
