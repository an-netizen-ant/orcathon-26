# OrbitDiff AI // Track 05: SpaceTech & Satellite Intelligence

> **OrbitDiff AI** is a high-end aerospace command center interface and automated satellite intelligence engine that detects, classifies, and quantifies rapid planetary surface changes across high-cadence Sentinel-2 multispectral earth observation data.

---

## 🛰️ Architecture & Technology Stack

- **Core & UI Framework:** React 18, Vite 8, Tailwind CSS (with luxury aerospace dark palette `#040711`, neon cyan `#00f2fe`, amber `#f59e0b`, emerald `#00ff87`)
- **SYBIOSME Kinetic Engine:** Pinned Multi-Stage GSAP 3.15 ScrollTrigger Timeline (`end: "+=300%"`, `scrub: 0.8`) + Lenis (`@studio-freight/react-lenis`)
- **State & Logic Layer:** Zustand (`zustand`) client-side seed store + Radash (`radash`) functional data processing + Zod (`zod`) runtime schema validation
- **Aerospace Telemetry Icons:** Lucide Icons (`lucide-react`)
- **Audio Synthesizer:** Real-time Web Audio API procedural mission telemetry audio (target locks, sweep hums, and control toggles)

---

## 🎯 SYBIOSME-Inspired 3-Stage Narrative Orbital Pass

### Stage 1: Orbital Zoom In (0% to 30% scroll)
- Viewport starts scaled down at `scale(0.82)` with `border border-cyan-500/30` and `backdrop-blur-md`.
- Floating telemetry reads: `"ORBITAL PASS ACTIVE // TARGET: ..."` with live altitude descending from `786 KM` to `10m/px GROUND LOCK`.
- Atmospheric cloud haze dissipates smoothly as satellite zooms down to ground level (`scale: 1.0`).

### Stage 2: Scanner Laser Wipe & Detect (30% to 75% scroll)
- Section remains pinned in place.
- Scrubbing scrolls a vertical cyan laser scanning beam horizontally across the screen from 0% to 100% width.
- The beam uncovers the "After" satellite image layer using `clip-path: inset(0 X% 0 0)`.
- Glowing neon bounding boxes with animated radar pulse rings (`radar-pulse-ring`) trigger over change zones **only as the laser line passes over their exact x-coordinates**.

### Stage 3: HUD Report & Detach (75% to 100% scroll)
- The viewport tilts on the 3D X-axis (`perspective: 1000px, rotateX: 4deg`).
- The **Executive Report Card** slides up from the bottom right with `backdrop-blur-xl` luxury glass styling.
- Displays the exact anomaly micro-crop thumbnail preview, surface area in $\text{km}^2$, neural confidence score, $\Delta\text{NDVI}$, and strategic AI recommendations.
- Smoothly unpins when scroll reaches 100%, allowing continuous inspection of the Advanced Control Sidebar.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation
```bash
npm install
```

### Run Locally
```bash
npm run dev
```
Navigate to `http://localhost:5173/` in your browser.

### Build & Lint
```bash
npm run build
npm run lint
```
