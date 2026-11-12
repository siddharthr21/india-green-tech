# 🇮🇳 India Green Tech (India Green Grid)

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-teal.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)

**India Green Tech** is an integrated clean energy and grid intelligence platform for India. It unifies national grid telemetry across 32 states, regional renewable forecasting, municipal smart city simulations, residential rooftop solar with PM Surya Ghar subsidies, and multi-string PV engineering into one cohesive platform.

---

## 🌟 Integrated Applications & Domains

| Application & Source | Integration Scope & Features |
|---|---|
| **⚡ National Grid Telemetry** *(from India Energy Data)* | Real-time demand met, generation fuel mix (Coal, Solar, Wind, Hydro, Nuclear, Biomass, Gas), and carbon intensity across all 32 Indian States/UTs. Includes SCADA measured vs MERIT estimated freshness ladder and 24h historical charts. |
| **🏙️ Regional Renewable Planner** *(from EnerJee)* | Multi-objective Pareto optimization engine trading off levelized cost (₹/MWh) against carbon emissions (gCO2/kWh). Simulates hourly solar, wind, and hydro generation profiles across 7 Indian hubs (Jodhpur, Bangalore, Chennai, Kutch, Uttarakashi, Satara, Delhi NCR). |
| **🎮 Smart City Clean Energy Simulator** *(from EnerJee)* | Municipal capital budget allocation across Solar PV, Wind, Hydro, and Battery Storage. Stress-tests urban grid resilience against simulated monsoons, heatwaves, and peak load surges to compute public satisfaction and national green rankings. |
| **☀️ Rooftop Solar & Subsidy Engine** *(from SuryaCheck)* | Rooftop feasibility tool for Indian RCC roofs. Places obstacles (water tanks, staircase mumties) and computes 3D shadow buffers, auto-packs 550W TopCon panels, and calculates **PM Surya Ghar: Muft Bijli Yojana** central subsidies (up to ₹78,000) + state top-ups (Delhi, UP) with 25-year financial ROI. |
| **📐 Precision PV Yield Studio** *(from Solar PV Yield Estimator)* | Multi-string solar array design (East string, South string, West string), true-north azimuth compass, tilt angle adjustments, system losses, and monthly yield simulation against European Commission PVGIS models. |
| **🤖 AI Clean Energy Mentor** *(EnerJeePT / GridGPT)* | Intelligent advisory assistant trained on Indian grid codes, CERC merit order dispatch, state DISCOM tariffs, and PM Surya Ghar eligibility guidelines. |

---

## 🏗️ Project Architecture

```
india_green_grid/
├── client/ (or src/)
│   ├── components/
│   │   ├── common/       # Global Navbar with live grid ticker, Footer
│   │   ├── overview/     # Executive Command Center dashboard
│   │   ├── grid/         # Live 32-state National Grid telemetry & charts
│   │   ├── planner/      # EnerJee regional renewable Pareto optimizer
│   │   ├── smartcity/    # Municipal clean energy capital allocation sim
│   │   ├── rooftop/      # SuryaCheck obstacle shadow & subsidy engine
│   │   ├── pvyield/      # Precision multi-array compass & PVGIS studio
│   │   └── mentor/       # AI Clean Energy Mentor chat interface
│   ├── lib/              # API clients and calculations
│   ├── App.tsx           # Unified root application
│   ├── main.tsx          # Vite React entrypoint
│   └── index.css         # Tailwind styles & theme variables
├── server/
│   ├── gridData.ts       # All-India 32-state live data provider & SCADA ladder
│   ├── forecasting.ts    # Deterministic renewable simulation engine
│   ├── suryaData.ts      # PM Surya Ghar subsidy rules & DISCOM tariffs
│   ├── pvgisEngine.ts    # Multi-string solar irradiance & yield calculation
│   ├── aiMentor.ts       # Clean energy domain knowledge base
│   └── index.ts          # Unified Express REST API server
├── shared/
│   └── types.ts          # Shared TypeScript contracts & schemas
├── subsystems/           # Preserved standalone modules and scraper packages
│   ├── enerjee/          # Original EnerJee React/Postgres codebase
│   ├── india-energy-data/# Original Python gridscrapers, TimescaleDB & Next.js
│   ├── solar-pv-yield/   # Original PV yield estimator and PVGIS proxy
│   └── suryacheck/       # Original SuryaCheck FastAPI backend & Next.js web
├── package.json          # Root build & scripts
├── vite.config.ts        # Vite build configuration
├── tailwind.config.js    # Tailwind styling config
└── tsconfig.json         # TypeScript configuration
```

---

## 🚀 Quick Start

### 1. Requirements
- **Node.js**: v18+ (tested on Node.js v24.12)
- **npm**: v9+ (tested on npm 11.6)
- **Python**: 3.10+ (optional, for standalone scrapers in `subsystems/`)

### 2. Installation
```bash
git clone https://github.com/siddharthr21/india-green-tech.git
cd india-green-tech
npm install
```

### 3. Development Server
Starts the unified Express backend and Vite frontend proxy:
```bash
npm run dev
```
Open your browser at `http://localhost:5173` (Vite dev server) or `http://localhost:5000` (Express API).

### 4. Production Build
```bash
npm run build
npm start
```

---

## 📡 Unified REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Health status and platform metadata |
| `/api/grid/live` | `GET` | All-India grid summary and 32 states/UTs telemetry |
| `/api/grid/zone/:id/history` | `GET` | 24-hour historical generation mix and demand timeseries |
| `/api/forecasting/regions` | `GET` | Available renewable hubs and physical generation multipliers |
| `/api/forecasting/optimize` | `POST` | Multi-objective cost vs emissions Pareto optimization |
| `/api/smart-city/simulate` | `POST` | Municipal clean energy capex allocation and stress test |
| `/api/rooftop/tariffs` | `GET` | State DISCOM tariffs and local top-up subsidy rules |
| `/api/rooftop/calculate` | `POST` | Rooftop panel packing, obstacle shadow buffer, and subsidy breakdown |
| `/api/pv-yield/simulate` | `POST` | Multi-string azimuth, tilt, and PVGIS yield calculations |
| `/api/mentor/chat` | `POST` | AI Clean Energy Mentor conversational advisory |

---

## 📑 Methodology & Standards

- **National Grid:** Generation dispatch follows Central Electricity Regulatory Commission (CERC) Merit Order Dispatch rules. Live SCADA telemetry is captured from State Load Despatch Centres (Delhi SLDC, KPTCL, PSTCL, CSPDCL).
- **Rooftop Solar & Subsidies:** Central Financial Assistance (CFA) implements official Ministry of New and Renewable Energy (MNRE) guidelines for **PM Surya Ghar: Muft Bijli Yojana** (₹30,000/kW up to 2 kW, ₹18,000 for 3rd kW, capped at ₹78,000).
- **PV Yield:** Solar insolation profiles and performance ratios align with European Commission PVGIS-SARAH2 solar irradiance satellite benchmarks adapted for Indian geographical coordinates.

---

## 📄 License
This unified project is licensed under the [MIT License](LICENSE).
