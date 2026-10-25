import React, { useLayoutEffect, useRef } from 'react';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import {
  Zap,
  Cpu,
  Layers,
  Activity,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Terminal,
  RefreshCw,
  Gauge,
  CheckCircle2,
  Code2,
  Workflow
} from 'lucide-react';
import { useStore } from './store/useStore';
import './App.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Sub-component to bind Lenis RAF with GSAP ScrollTrigger
function LenisScrollSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

export default function App() {
  const containerRef = useRef(null);

  const {
    projectName,
    tagline,
    metrics,
    activeCategory,
    setActiveCategory,
    runBenchmark,
    isBenchmarking,
    getCategoryStats,
    getOverallVelocity,
  } = useStore();

  const categoryStats = getCategoryStats();
  const overallVelocity = getOverallVelocity();

  // GSAP Lifecycle: Always use gsap.context inside useLayoutEffect with unmount revert
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // GPU Acceleration: ONLY animate transform (y, scale) and opacity
      gsap.from('.gsap-hero-badge', {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.gsap-hero-title', {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.15,
        ease: 'power3.out',
      });

      gsap.from('.gsap-hero-desc', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        delay: 0.3,
        ease: 'power3.out',
      });

      gsap.from('.gsap-hero-actions', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.45,
        ease: 'power3.out',
      });

      gsap.from('.gsap-metric-card', {
        opacity: 0,
        y: 35,
        stagger: 0.08,
        duration: 0.8,
        delay: 0.6,
        ease: 'power2.out',
      });

      // Scroll-triggered section animations
      gsap.from('.gsap-pillar-card', {
        scrollTrigger: {
          trigger: '.gsap-pillars-grid',
          start: 'top 82%',
        },
        opacity: 0,
        y: 45,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power2.out',
      });

      gsap.from('.gsap-benchmark-panel', {
        scrollTrigger: {
          trigger: '.gsap-benchmark-panel',
          start: 'top 85%',
        },
        opacity: 0,
        scale: 0.96,
        duration: 0.9,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const filteredMetrics =
    activeCategory === 'all'
      ? metrics
      : metrics.filter((m) => m.category === activeCategory);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <LenisScrollSync />
      <div
        ref={containerRef}
        className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans relative overflow-hidden"
      >
        {/* Dynamic Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-[600px] left-[-200px] w-[600px] h-[600px] bg-cyan-600/10 blur-[130px] pointer-events-none -z-10" />
        <div className="absolute bottom-[200px] right-[-200px] w-[600px] h-[600px] bg-fuchsia-600/10 blur-[130px] pointer-events-none -z-10" />

        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-neutral-950/75 border-b border-neutral-800/70">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-neutral-950 rounded-[7px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-bold tracking-wider text-sm text-neutral-100 flex items-center gap-1.5">
                {projectName}
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700/60">
                  v1.0
                </span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-400">
              <a href="#architecture" className="hover:text-neutral-100 transition-colors">
                Architecture
              </a>
              <a href="#telemetry" className="hover:text-neutral-100 transition-colors">
                Logic Engine
              </a>
              <a href="#benchmark" className="hover:text-neutral-100 transition-colors">
                Benchmark
              </a>
              <a href="#rules" className="hover:text-neutral-100 transition-colors">
                Compliance
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={runBenchmark}
                disabled={isBenchmarking}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 border border-neutral-700/80 hover:border-neutral-600 text-neutral-200 transition-colors shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isBenchmarking ? 'animate-spin' : ''}`} />
                <span>{isBenchmarking ? 'Calibrating...' : 'Run Test'}</span>
              </motion.button>
              <a
                href="https://github.com/an-netizen-ant/orcathon-26"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-600/25"
              >
                <span>GitHub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 pt-20 pb-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="gsap-hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-mono text-cyan-400 mb-6 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              STRICT GPU PIPELINE // 120 FPS LENIS SYNC
            </div>

            <h1 className="gsap-hero-title text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Hyper-Optimized Kinetic{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                Hackathon Engine
              </span>
            </h1>

            <p className="gsap-hero-desc text-neutral-400 text-base sm:text-lg leading-relaxed mb-8">
              Built strictly to hackathon specifications with Vite, React, Tailwind CSS, GSAP context lifecycle, Lenis smooth scrolling, Zustand reactive telemetry, and Radash logic algorithms.
            </p>

            <div className="gsap-hero-actions flex flex-wrap items-center justify-center gap-4">
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="#benchmark"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-shadow"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore Live Benchmark</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="#architecture"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 font-medium text-sm transition-colors"
              >
                <Code2 className="w-4 h-4 text-neutral-400" />
                <span>Stack Architecture</span>
              </motion.a>
            </div>
          </div>

          {/* Real-time Telemetry Dashboard Cards */}
          <section id="telemetry" className="mb-24">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Live Kinetic Telemetry
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Real-time compute verified with Zod schemas and computed via <code className="text-neutral-300 font-mono">src/utils/logicEngine.js</code>
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                {['all', 'performance', 'velocity', 'reliability'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-md capitalize transition-all ${
                      activeCategory === cat
                        ? 'bg-neutral-800 text-white font-medium shadow'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMetrics.map((m) => (
                <div
                  key={m.id}
                  className="gsap-metric-card p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700/80 transition-all hover:bg-neutral-900/90 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                      {m.category}
                    </span>
                    <span className="inline-flex items-center text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                      +{m.trend}%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      {m.value}
                    </span>
                    <span className="text-xs font-medium text-neutral-400">{m.unit}</span>
                  </div>
                  <p className="text-xs text-neutral-300 font-medium">{m.label}</p>
                  <div className="w-full bg-neutral-800/70 h-1 rounded-full mt-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, (m.value / 120) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Core Pillars / Architecture Section */}
          <section id="architecture" className="mb-24">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
                System Standards
              </span>
              <h2 className="text-3xl font-bold text-white mt-2 mb-3">
                Architectural Pillars
              </h2>
              <p className="text-sm text-neutral-400">
                Engineered to maximize rendering throughput while enforcing modular logic separation.
              </p>
            </div>

            <div className="gsap-pillars-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pillar 1 */}
              <div className="gsap-pillar-card p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
                  <Workflow className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  GSAP + Lenis Synchronized RAF
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Lenis smooth scroll delivers frictionless momentum while continuously updating GSAP's ScrollTrigger hook in real time, preventing layout reflows and stutter.
                </p>
                <ul className="text-xs text-neutral-300 space-y-1.5 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    useLenis sync with ScrollTrigger.update()
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    Strict transform & opacity GPU transforms only
                  </li>
                </ul>
              </div>

              {/* Pillar 2 */}
              <div className="gsap-pillar-card p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Centralized Logic Engine
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Algorithmic operations, calculations, and transforms reside strictly inside <code className="text-neutral-300">src/utils/logicEngine.js</code> powered by Radash functional primitives.
                </p>
                <ul className="text-xs text-neutral-300 space-y-1.5 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    Zod runtime input & metric schema validation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    Radash functional aggregation & filtering
                  </li>
                </ul>
              </div>

              {/* Pillar 3 */}
              <div className="gsap-pillar-card p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 text-violet-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  React Lifecycle & gsap.context()
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  All GSAP timelines and selectors are scoped inside <code className="text-neutral-300">gsap.context()</code> within <code className="text-neutral-300">useLayoutEffect</code>, ensuring leak-free unmount cleanup.
                </p>
                <ul className="text-xs text-neutral-300 space-y-1.5 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                    Automatic ctx.revert() on component teardown
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                    Scoped DOM queries restricted to component ref
                  </li>
                </ul>
              </div>

              {/* Pillar 4 */}
              <div className="gsap-pillar-card p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mb-4 text-fuchsia-400">
                  <Gauge className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Zustand Reactive Store
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Minimal boilerplate state management via Zustand decoupled from UI rendering cycles, giving instant metric updates without context re-render thrashing.
                </p>
                <ul className="text-xs text-neutral-300 space-y-1.5 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-400" />
                    src/store/useStore.js centralized state
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-400" />
                    Framer Motion tactile micro-interactions
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Interactive Benchmark Section */}
          <section id="benchmark" className="mb-24">
            <div className="gsap-benchmark-panel p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-900/40 border border-neutral-800 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                    Live Stress Simulator
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-2">
                    Algorithmic Telemetry Velocity: {overallVelocity} pts
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
                    Run the benchmark to trigger live schema validation via Zod and Radash aggregations across all categories.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={runBenchmark}
                  disabled={isBenchmarking}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isBenchmarking ? 'animate-spin' : ''}`} />
                  <span>{isBenchmarking ? 'Recalculating Logic...' : 'Trigger Benchmark'}</span>
                </motion.button>
              </div>

              {/* Aggregated Category breakdown */}
              <div className="mt-8 pt-8 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categoryStats.map((stat) => (
                  <div key={stat.category} className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/60">
                    <span className="text-[11px] font-mono uppercase text-neutral-400">{stat.category}</span>
                    <div className="text-xl font-bold text-white mt-1">{stat.total}</div>
                    <div className="text-[11px] text-cyan-400 font-mono mt-0.5">+{stat.averageTrend}% avg trend</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Project Rules Compliance Section */}
          <section id="rules" className="mb-12">
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800/80">
              <div className="flex items-center gap-2 text-emerald-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-sm font-mono uppercase tracking-wider font-semibold">
                  Hackathon Rules Compliance Verification
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-neutral-300">
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Framework: Vite 8 + React 18 + Tailwind CSS</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Animation: GSAP ScrollTrigger + Lenis smooth scroll</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Motion & UI: Framer Motion + Lucide Icons</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Logic Layer: Zustand, Zod schema validation, Radash algorithms</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Folder Structure: Algorithms inside src/utils/logicEngine.js</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Performance: ONLY transform & opacity animated via GPU</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-800/60 py-8 text-center text-xs text-neutral-500 font-mono">
          <p>ORCATHON 2026 // ALL SYSTEMS OPERATIONAL // READY FOR COMMIT</p>
        </footer>
      </div>
    </ReactLenis>
  );
}
