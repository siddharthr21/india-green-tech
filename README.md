# 🇮🇳 India Green Tech (India Green Grid)

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-teal.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)

> **India Green Tech** is an all-in-one clean energy and electricity grid intelligence platform built for India. Whether you are an everyday homeowner looking to cut your electricity bill to zero with rooftop solar, an engineer designing solar panel strings, a student learning how India's power grid operates, or a municipal planner running clean energy simulations—this platform puts the entire energy ecosystem in your hands.

---

## 📖 Table of Contents
1. [What is India Green Tech?](#-what-is-india-green-tech)
2. [Who Is This Platform For?](#-who-is-this-platform-for)
3. [Core Features & How to Use Them](#-core-features--how-to-use-them)
   - [1. ☀️ Rooftop Solar & PM Surya Ghar Subsidy Engine](#1-️-rooftop-solar--pm-surya-ghar-subsidy-engine)
   - [2. ⚡ Live National Electricity Grid](#2-️-live-national-electricity-grid)
   - [3. 📐 Precision PV Yield Engineering Studio](#3--precision-pv-yield-engineering-studio)
   - [4. 🏙️ Regional Renewable Grid Planner](#4-️-regional-renewable-grid-planner)
   - [5. 🎮 Smart City Clean Energy Simulator](#5--smart-city-clean-energy-simulator)
   - [6. 🤖 AI Clean Energy Advisor](#6--ai-clean-energy-advisor)
4. [How Rooftop Solar Subsidies Work in India](#-how-rooftop-solar-subsidies-work-in-india)
5. [How to Run the Project (Step-by-Step)](#-how-to-run-the-project-step-by-step)
6. [Project Structure](#-project-structure)
7. [Unified API Reference](#-unified-api-reference)
8. [Frequently Asked Questions (FAQ)](#-frequently-asked-questions-faq)
9. [License](#-license)

---

## 💡 What is India Green Tech?

India has one of the largest synchronized electricity grids in the world and is undergoing a historic transition toward solar and wind power. However, energy data has traditionally been scattered across different portals, government PDF reports, and specialized engineering tools.

**India Green Tech** unifies everything into a single, intuitive web platform:
- **For Homes:** Find your house on satellite imagery (or click "Current Location"), draw your roof, account for water tanks or staircases that cast shadows, and calculate your exact government subsidy under **PM Surya Ghar: Muft Bijli Yojana** alongside 25-year financial savings.
- **For the Country:** Watch electricity generation live across all 32 Indian States and Union Territories—see how much power comes from Coal, Solar, Wind, Hydro, Nuclear, and Gas in real time.
- **For Engineers & Technicians:** Simulate solar panel yield across different roof angles, compass directions (North, South, East, West), and string setups with European Commission PVGIS irradiance models adapted for Indian coordinates.
- **For Cities & Regions:** Allocate clean energy municipal budgets, stress-test urban grids against heatwaves and monsoons, and optimize regional renewable capacity.
- **For Everyone:** Ask any question in plain English to our built-in **AI Clean Energy Advisor**.

---

## 👥 Who Is This Platform For?

| User | What You Can Do on India Green Tech |
|---|---|
| **🏠 Homeowners & Residents** | Check if your rooftop is good for solar, how many panels will fit, how much money the government pays in subsidies (up to ₹78,000+), and download a ready-to-print quotation report. |
| **🔧 Solar Installers & EPCs** | Run rapid site assessments, draw realistic obstacle shadow buffers, and present clear 25-year return-on-investment (ROI) numbers to prospective customers. |
| **⚡ Electrical Engineers & Students** | Study multi-string solar arrays, compare tilt angle variations against seasonal sun paths, and examine real-time Merit Order Dispatch and grid frequencies. |
| **🏛️ Policy Analysts & Researchers** | Track real-time carbon intensity (gCO2/kWh), thermal vs renewable generation splits, and monitor state-level clean energy progress. |
| **🏙️ City Administrators** | Simulate municipal clean energy investments and evaluate grid resilience under climate stress. |

---

## 🚀 Core Features & How to Use Them

### 1. ☀️ Rooftop Solar & PM Surya Ghar Subsidy Engine

Plan a residential solar installation with satellite precision in less than 2 minutes.

- **Use Your Current Location (GPS) or Search Any Indian Address:**
  - Type your street, colony, or city (e.g., *"Indiranagar, Bengaluru"* or *"Rohini, Delhi"*), or simply click the **"Current Location (GPS)"** button to instantly zoom to your home.
- **Pinpoint Your Roof:**
  - An interactive high-resolution satellite map lets you center the pin directly over your building.
- **Trace Your Roof Boundary:**
  - Click around your roof perimeter to mark the usable area in square meters / square feet.
- **Place Obstacles & Compute 3D Shadow Buffers:**
  - Add rooftop water tanks, staircase mumties, solar water heaters, or AC outdoor units. The engine calculates seasonal shadow lengths so panels are never placed in shaded spots.
- **Instant Financial & Subsidy Calculation:**
  - Enter your average monthly electricity bill (e.g., ₹2,500/month).
  - Automatically calculates your recommended system size (e.g., 3 kW), number of 550W TopCon panels needed, total cost, central government subsidy (CFA), state top-up subsidies, and payback period (usually 3.5 to 4.5 years).
- **One-Click Printable Report:**
  - Generate a professional feasibility and subsidy report suitable for sharing with banks, DISCOMs, or local solar installers.

---

### 2. ⚡ Live National Electricity Grid

Monitor the heartbeat of India's power system in real time.

- **32 States & Union Territories Telemetry:**
  - Instant live demand met (in Megawatts / MW) across the Northern, Western, Southern, Eastern, and North-Eastern regional grids.
- **Fuel Generation Mix:**
  - Live breakdown of generation sources: **Solar, Wind, Hydro, Coal, Nuclear, Gas, and Biomass**.
- **Real-Time Carbon Intensity:**
  - See carbon emissions in grams of CO₂ per kilowatt-hour (gCO₂/kWh) updated continuously.
- **Data Freshness Ladder:**
  - Transparent badges indicating whether data is directly measured via state SCADA feeds (e.g., Delhi SLDC, KPTCL Karnataka, PSTCL Punjab, CSPDCL Chhattisgarh) or estimated using CERC merit order dispatch schedules.
- **24-Hour Historical Trends:**
  - Interactive charts displaying day-to-night demand curves, solar generation peaks during midday, and evening peak power consumption.

---

### 3. 📐 Precision PV Yield Engineering Studio

A dedicated tool for solar engineers, researchers, and technical designers.

- **Multi-String Solar Design:**
  - Configure multiple strings on different roof orientations (e.g., String 1 facing South at 15° tilt, String 2 facing West at 10° tilt).
- **Interactive Azimuth Compass:**
  - Visual circular compass displaying true-north array orientation and panel layout angles.
- **Loss Modeling & Inverter Sizing:**
  - Factor in cable losses, dust/soiling losses, inverter clipping, and seasonal temperature degradation coefficients.
- **PVGIS Irradiance Calculations:**
  - Benchmarked against satellite solar irradiance data for exact Indian coordinates, providing month-by-month kWh generation estimates.

---

### 4. 🏙️ Regional Renewable Grid Planner

Explore how India's regional power grids can transition to 100% clean power.

- **7 Key Indian Renewable Hubs:**
  - Jodhpur (Solar Hub), Bangalore (Tech Hub), Chennai (Coastal Wind/Solar), Kutch (Mega Hybrid Wind-Solar), Uttarakashi (Hydro Hub), Satara (Wind Corridors), and Delhi NCR (Metropolitan Load Center).
- **Pareto Optimization (Cost vs Carbon):**
  - Slide between **"Lowest Cost"** and **"Lowest Carbon"** to see how optimal capacity additions shift between Solar PV, Wind Turbines, Hydro Peaking, and Battery Energy Storage Systems (BESS).

---

### 5. 🎮 Smart City Clean Energy Simulator

A strategic simulation for urban planners and university students.

- **Manage Municipal Clean Energy Budget:**
  - Allocate a ₹50 Crore capital budget across Rooftop Solar, Wind Turbines, Micro-Hydro, and Battery Storage.
- **Stress-Test Urban Resilience:**
  - Subject your city's grid to simulated climate events:
    - ☀️ **Summer Heatwave** (air conditioning demand spikes by 40%)
    - 🌧️ **Monsoon Cloud Cover** (solar generation drops by 65%)
    - ⚡ **Industrial Peak Load Surge**
- **Scorecards & Green Ranking:**
  - Receive an evaluation covering Citizen Satisfaction, Grid Reliability, Carbon Reduction, and National Green City Ranking.

---

### 6. 🤖 AI Clean Energy Advisor

Have questions about solar panels, government schemes, or electricity tariffs? Just ask!

- Trained on Indian grid codes, DISCOM net metering regulations, CERC policies, and official MNRE guidelines.
- **Sample questions you can ask:**
  - *"How does the PM Surya Ghar subsidy work for a 2 kW system in Uttar Pradesh?"*
  - *"What is net metering and how will my electricity bill become zero?"*
  - *"What is the difference between polycrystalline, monocrystalline, and TopCon bifacial solar panels?"*
  - *"Why does grid carbon intensity increase in the evening in India?"*

---

## 💰 How Rooftop Solar Subsidies Work in India

Under the **PM Surya Ghar: Muft Bijli Yojana** (National Rooftop Solar Scheme), the Government of India provides direct Central Financial Assistance (CFA) deposited into the homeowner's bank account:

| System Capacity (kW) | Typical RCC Roof Area Needed | Central Subsidy (CFA) | Approximate Net Cost to Homeowner | Monthly Bill Savings |
|---|---|---|---|---|
| **1 kW** (1–2 BHK home) | ~100 sq. ft. (10 m²) | **₹30,000** | ~₹25,000 – ₹30,000 | ₹1,000 – ₹1,500 / month |
| **2 kW** (2–3 BHK home) | ~200 sq. ft. (20 m²) | **₹60,000** | ~₹50,000 – ₹60,000 | ₹2,200 – ₹3,000 / month |
| **3 kW** (3+ BHK / ACs) | ~300 sq. ft. (30 m²) | **₹78,000** (Max Central) | ~₹75,000 – ₹85,000 | ₹3,500 – ₹4,500 / month |
| **Above 3 kW** (Large homes) | ~400+ sq. ft. | **₹78,000** (Capped) | Varies by capacity | ₹5,000+ / month |

*Note: Certain states provide additional top-up subsidies (e.g., Delhi provides ₹2,000/kW up to ₹10,000 extra; Uttar Pradesh provides up to ₹30,000 additional state subsidy).*

---

## 💻 How to Run the Project (Step-by-Step)

You do **not** need advanced programming knowledge to run this project on your computer.

### Step 1: Install Node.js
If you don't already have Node.js installed:
- Download the LTS version from [nodejs.org](https://nodejs.org/) (version 18 or higher).
- Follow the standard installer prompts.

### Step 2: Download or Clone the Repository
Open your terminal (or Command Prompt / PowerShell on Windows) and run:
```bash
git clone https://github.com/siddharthr21/india-green-tech.git
cd india-green-tech
```

### Step 3: Install Dependencies
Install all required libraries with one command:
```bash
npm install
```

### Step 4: Start the Platform
You can run in development mode or build for production:

**Option A — Quick Development Mode (Recommended for testing):**
```bash
npm run dev
```
Open your browser at:
👉 **`http://localhost:5173`** (or the URL shown in your terminal).

**Option B — Production Mode (Fastest performance):**
```bash
npm run build
npm start
```
Open your browser at:
👉 **`http://localhost:5000`**

That's it! The full platform—including satellite mapping, live grid feeds, solar calculators, and the AI advisor—will be up and running.

---

## 📁 Project Structure

```
india-green-tech/
├── src/                          # Frontend Application (React 18 + TypeScript)
│   ├── components/
│   │   ├── common/               # Global Navbar with live national grid ticker
│   │   ├── overview/             # Executive Overview & quick statistics
│   │   ├── rooftop/              # Rooftop Solar Planner (Satellite, Obstacles, Subsidies)
│   │   │   └── screens/          # Multi-step workflow (Landing, Map, Confirm, Plan)
│   │   ├── grid/                 # Live 32-State National Grid Telemetry & Charts
│   │   ├── pvyield/              # Multi-String PV Engineering & Compass Studio
│   │   ├── planner/              # Regional Grid Renewable Pareto Optimizer
│   │   ├── smartcity/            # Municipal Clean Energy Simulator
│   │   └── mentor/               # AI Clean Energy Advisor chat interface
│   ├── lib/                      # Client API connection & data formatting
│   ├── App.tsx                   # Master router & view coordinator
│   └── main.tsx                  # React DOM entrypoint
├── server/                       # Unified Backend API (Express + TypeScript)
│   ├── index.ts                  # REST API endpoints & static asset server
│   ├── gridData.ts               # 32-state live power data & SCADA ladder
│   ├── suryaData.ts              # PM Surya Ghar subsidies & state DISCOM tariffs
│   ├── forecasting.ts            # Hourly renewable generation models
│   ├── pvgisEngine.ts            # Multi-string solar physics & yield engine
│   ├── aiMentor.ts               # Clean energy knowledge base & advisor logic
│   └── reference.json            # Reference solar insolation and national grid constants
├── subsystems/                   # Preserved original source packages & scraper tools
├── package.json                  # Scripts & dependencies
├── vite.config.ts                # Vite bundler configuration
└── tailwind.config.js            # Tailwind styling tokens & design system
```

---

## 📡 Unified API Reference

The backend provides a unified REST API for developers and researchers:

| Endpoint | Method | What it Returns |
|---|---|---|
| `/reference` | `GET` | Central solar constants, state tariff rates, and PM Surya Ghar subsidy brackets |
| `/geocode?q={address}` | `GET` | Searches Indian addresses and returns latitude/longitude coordinates |
| `/reverse?lat={lat}&lng={lng}` | `GET` | Converts GPS coordinates into street address, city, and state |
| `/quick?bill={amount}` | `GET` | Instant rooftop solar estimate based on monthly electricity bill |
| `/building` | `POST` | Calculates usable roof area after deducting obstacle shadow buffers |
| `/finance` | `POST` | Full 25-year financial breakdown, cashflow table, and net payback period |
| `/api/grid/live` | `GET` | All-India live demand met, fuel generation mix, and 32 states telemetry |
| `/api/grid/zone/:id/history` | `GET` | 24-hour historical generation mix and demand timeseries |
| `/api/forecasting/optimize` | `POST` | Multi-objective cost vs emissions Pareto optimization |
| `/api/smart-city/simulate` | `POST` | Municipal clean energy budget allocation and stress testing |
| `/api/mentor/chat` | `POST` | AI Clean Energy Advisor chat completion |

---

## ❓ Frequently Asked Questions (FAQ)

### 1. Can I use my device's GPS to find my house?
**Yes!** On both the Rooftop Solar landing screen and the satellite map screen, simply click the **"Current Location (GPS)"** button. Your browser will ask for location permission and then immediately zoom to your exact roof.

### 2. Is this platform free to use?
**Yes, 100% free and open-source.** There is no registration, login, or payment required.

### 3. How accurate is the rooftop solar estimate?
The rooftop tool uses satellite photography resolution down to ~0.5 meters and factors in real-world Indian conditions:
- **RCC Roof Obstacles:** Accounts for shadows cast by overhead Sintex water tanks, staircase rooms (mumties), and parapet walls.
- **TopCon High-Efficiency Panels:** Uses modern 550W mono-facial / bifacial panel specifications commonly installed by Indian EPCs today.
- **Official MNRE Subsidies:** Implements the exact Central Financial Assistance (CFA) brackets updated for the PM Surya Ghar scheme in 2024–2026.

### 4. Can I share or print my solar estimate?
**Yes.** Once you complete your roof layout, click **"Print / Save Report"** at the bottom of the plan screen to generate a clean, professional PDF summary with all financial charts, subsidies, and panel specs.

### 5. Where does the live national grid data come from?
The platform gathers data from official State Load Despatch Centres (SLDCs) across India, Central Electricity Authority (CEA) reports, and Merit Order Dispatch telemetry to provide real-time visibility into state-by-state electricity demand and generation fuel mix.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free for personal, educational, research, and commercial use.

---

<div align="center">
  <sub>Built with ❤️ for India's clean energy transition.</sub>
</div>
