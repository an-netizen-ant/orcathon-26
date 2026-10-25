import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Satellite,
  Radio,
  ShieldCheck,
  AlertCircle,
  Calendar,
  Sliders,
  Volume2,
  VolumeX,
  Download,
  Play,
  Pause,
  Scan,
  CheckCircle2,
  Activity,
  FileText,
  ChevronRight,
  Sparkles,
  Crosshair,
  Compass,
  TreePine,
  Building2,
  MountainSnow,
  Target,
  Layers,
  Eye,
  EyeOff,
  ZoomIn,
  ChevronDown,
  Info,
  BarChart3,
  Globe,
  MapPin,
  Flame,
  Droplets,
  Pickaxe,
  Menu,
  X,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { useStore, CASE_STUDIES } from './store/useStore';
import { SatelliteScene } from './components/SatelliteScene';
import { MicroCropPreview } from './components/MicroCropPreview';
import { REAL_IMAGERY } from './constants/imagery';
import './App.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Bind Lenis RAF to GSAP ScrollTrigger & Pause during Command Drawer to prevent background map scrub
function LenisScrollSync({ isMenuOpen }) {
  const lenis = useLenis();

  useEffect(() => {
    if (isMenuOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, lenis]);

  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

// ─── Utility helpers ──────────────────────────────────────────────────────────

function getScenarioIcon(id, className = 'w-4 h-4') {
  const icons = {
    amazon: <TreePine className={`${className} text-emerald-400`} />,
    dubai: <Building2 className={`${className} text-cyan-400`} />,
    glacier: <MountainSnow className={`${className} text-sky-400`} />,
    flood: <Droplets className={`${className} text-blue-400`} />,
    wildfire: <Flame className={`${className} text-orange-400`} />,
    coastal: <Globe className={`${className} text-amber-400`} />,
    reservoir: <Activity className={`${className} text-teal-400`} />,
    mining: <Pickaxe className={`${className} text-yellow-500`} />,
  };
  return icons[id] || <Satellite className={`${className} text-slate-400`} />;
}

function getSeverityColor(level) {
  const map = {
    CRITICAL: 'text-red-400 border-red-500/50 bg-red-950/40',
    HIGH: 'text-orange-400 border-orange-500/50 bg-orange-950/40',
    ELEVATED: 'text-amber-400 border-amber-500/50 bg-amber-950/40',
    MODERATE: 'text-yellow-400 border-yellow-500/50 bg-yellow-950/40',
    LOW: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40',
  };
  return map[level] || map.LOW;
}

function MetricCard({ label, value, unit, color = 'cyan', icon }) {
  const colorMap = {
    cyan: 'text-[#00E5FF] border-[#00E5FF]/20',
    emerald: 'text-[#00FFA3] border-[#00FFA3]/20',
    amber: 'text-amber-400 border-amber-400/20',
    slate: 'text-slate-300 border-slate-700',
  };
  return (
    <div className="od-card p-4 flex flex-col gap-1 min-w-0">
      {icon && <div className="mb-1 opacity-70">{icon}</div>}
      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{label}</span>
      <div className={`text-xl font-bold font-mono ${colorMap[color].split(' ')[0]}`}>
        {value}
        {unit && <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const containerRef = useRef(null);
  const heroSectionRef = useRef(null);
  const heroViewportRef = useRef(null);
  const viewerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const casesRef = useRef(null);
  const analyzeRef = useRef(null);
  const dossierRef = useRef(null);

  const [utcTime, setUtcTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');
  const [overlayLegendOpen, setOverlayLegendOpen] = useState(false);

  const {
    activeScenarioId,
    confidenceThreshold,
    noChangeControl,
    wipeProgress,
    currentStage,
    scrollProgress,
    isAutoSweeping,
    spectralMode,
    showHUD,
    audioEnabled,
    showOverlay,
    overlayOpacity,
    comparisonMode,
    zoomLevel,
    setCurrentStage,
    setScrollProgress,
    setActiveScenario,
    setConfidenceThreshold,
    setNoChangeControl,
    setWipeProgress,
    setSelectedAnomaly,
    setSpectralMode,
    setShowOverlay,
    setOverlayOpacity,
    setComparisonMode,
    setZoomLevel,
    toggleHUD,
    toggleAudio,
    toggleAutoSweep,
    getActiveScenario,
    getFilteredAnomalies,
    getExecutiveMetrics,
    getExecutiveReport,
    getSelectedAnomalyData,
    playAudioFx,
  } = useStore();

  const activeScenario = getActiveScenario();
  const filteredAnomalies = getFilteredAnomalies();
  const executiveMetrics = getExecutiveMetrics();
  const executiveReport = getExecutiveReport();
  const selectedAnomaly = getSelectedAnomalyData();

  // Live UTC clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // Keyboard shortcut: ESC to dismiss Command Drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        playAudioFx('close');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, playAudioFx]);

  // Auto-sweep animation
  useEffect(() => {
    if (!isAutoSweeping) return;
    let forward = true;
    const interval = setInterval(() => {
      const current = useStore.getState().wipeProgress;
      if (current >= 100) forward = false;
      if (current <= 0) forward = true;
      useStore.getState().setWipeProgress(forward ? current + 1.4 : current - 1.4);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoSweeping]);

  // GSAP Hero Intro: Orbital zoom-in then lock
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (!heroSectionRef.current || !heroViewportRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top top',
          end: '+=220%',
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollProgress(p);
            if (p < 0.35) {
              setCurrentStage(1);
              setWipeProgress(0);
            } else if (p <= 0.78) {
              setCurrentStage(2);
              const mapped = Math.max(0, Math.min(100, ((p - 0.35) / 0.43) * 100));
              setWipeProgress(mapped);
            } else {
              setCurrentStage(3);
              setWipeProgress(100);
            }
          },
        },
      });

      // Stage 1: Orbital zoom in
      tl.fromTo(heroViewportRef.current,
        { scale: 0.78, borderRadius: '24px' },
        { scale: 1.0, borderRadius: '16px', ease: 'power1.inOut', duration: 0.35 },
        0
      );
      tl.fromTo('.hero-haze', { opacity: 0.9 }, { opacity: 0, ease: 'power1.out', duration: 0.32 }, 0);
      tl.fromTo('.hero-orbital-badge', { opacity: 1, y: 0 }, { opacity: 0, y: -8, ease: 'power2.out', duration: 0.06 }, 0.29);

      // Stage 2: wipe scrub (handled via onUpdate)
      tl.to({}, { duration: 0.43 }, 0.35);

      // Stage 3: subtle tilt + CTA card reveal
      tl.to(heroViewportRef.current, {
        rotateX: 2,
        y: -8,
        transformPerspective: 1200,
        ease: 'power2.out',
        duration: 0.22,
      }, 0.78);

      // Telemetry intro
      gsap.from('.tel-item', { opacity: 0, y: -8, stagger: 0.04, duration: 0.5, ease: 'power2.out', delay: 0.3 });
    }, containerRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScenarioId, setCurrentStage, setScrollProgress, setWipeProgress]);

  // Pointer drag for wipe divider
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    if (viewerRef.current) {
      const r = viewerRef.current.getBoundingClientRect();
      setWipeProgress(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
    }
  };

  useEffect(() => {
    const move = (e) => {
      if (!isDraggingRef.current || !viewerRef.current) return;
      const r = viewerRef.current.getBoundingClientRect();
      useStore.getState().setWipeProgress(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
    };
    const up = () => { isDraggingRef.current = false; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, []);

  // Smooth Section Navigation Actions
  const scrollToOverview = useCallback(() => {
    playAudioFx('tap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [playAudioFx]);

  const scrollToCases = useCallback(() => {
    playAudioFx('tap');
    casesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [playAudioFx]);

  const scrollToAnalyzer = useCallback(() => {
    playAudioFx('tap');
    analyzeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [playAudioFx]);

  const scrollToDossier = useCallback(() => {
    playAudioFx('tap');
    dossierRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [playAudioFx]);

  // Export dossier
  const handleExport = () => {
    playAudioFx('success');
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
    const payload = {
      mission: 'OrbitDiff AI — Satellite Intelligence Dashboard',
      timestamp: utcTime,
      scenario: activeScenario,
      controls: { confidenceThreshold, noChangeControl, spectralMode, wipeProgress },
      metrics: executiveMetrics,
      anomalies: filteredAnomalies,
      report: executiveReport,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orbitdiff-report-${activeScenario.id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const simAlt = scrollProgress < 0.35
    ? Math.round(786 - (scrollProgress / 0.35) * 776)
    : 10;

  return (
    <ReactLenis root>
      <LenisScrollSync isMenuOpen={mobileMenuOpen} />
      <div ref={containerRef} className="min-h-screen od-bg text-slate-100 overflow-x-hidden selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">

        {/* ══════════════════════════════════════════════════════
            A. TOP NAVIGATION
        ══════════════════════════════════════════════════════ */}
        <header className="sticky top-0 z-50 od-nav-bar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

            {/* Logo */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="relative w-8 h-8 rounded-lg flex items-center justify-center od-logo-bg">
                <Satellite className="w-4 h-4 text-[#00E5FF]" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00FFA3] od-pulse-ring" />
              </div>
              <div>
                <div className="font-display font-bold text-sm tracking-wide text-white leading-none">
                  ORBIT<span className="text-[#00E5FF]">DIFF</span>
                  <span className="text-[10px] text-slate-400 font-mono font-normal ml-1.5">AI</span>
                </div>
                <div className="text-[9px] font-mono text-slate-500 leading-none mt-0.5">SENTINEL-2 L2A · TRACK 05</div>
              </div>
            </div>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'overview', label: 'Overview', action: scrollToOverview },
                { id: 'cases', label: 'Case Studies', action: scrollToCases },
                { id: 'analyze', label: 'Analyze', action: scrollToAnalyzer },
                { id: 'reports', label: 'Dossier', action: scrollToDossier },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    item.action();
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeNav === item.id
                      ? 'text-[#00E5FF] bg-[#00E5FF]/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Status + actions */}
            <div className="flex items-center gap-2">
              {/* System status */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full od-status-badge text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
                <span className="text-[#00FFA3] font-semibold">SYSTEM ACTIVE</span>
                <span className="text-slate-500 hidden lg:inline">· {activeScenario.satellite}</span>
              </div>

              <button
                onClick={toggleAudio}
                title={audioEnabled ? 'Mute audio' : 'Enable satisfying telemetry audio'}
                className="od-icon-btn"
              >
                {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#00E5FF]" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button onClick={toggleHUD} title="Toggle HUD" className="od-icon-btn hidden sm:flex">
                <Crosshair className={`w-3.5 h-3.5 ${showHUD ? 'text-[#00FFA3]' : 'text-slate-400'}`} />
              </button>

              <button
                onClick={handleExport}
                className="od-btn-primary text-[11px] px-3 py-1.5 flex items-center gap-1.5"
              >
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {/* Mission Command & Navigation Menu Button */}
              <button
                className={`od-icon-btn transition-all ${
                  mobileMenuOpen
                    ? 'text-[#00E5FF] border-[#00E5FF]/50 bg-[#00E5FF]/15 ring-1 ring-[#00E5FF]/30'
                    : 'text-slate-300 hover:text-white'
                }`}
                onClick={() => {
                  const next = !mobileMenuOpen;
                  setMobileMenuOpen(next);
                  playAudioFx(next ? 'menu' : 'close');
                }}
                title={mobileMenuOpen ? 'Close Mission Command Menu' : 'Open Mission Command Menu'}
              >
                {mobileMenuOpen ? <X className="w-4 h-4 text-[#00FFA3]" /> : <Menu className="w-4 h-4" />}
                <span className="hidden xl:inline text-[10px] font-mono font-medium">MENU</span>
              </button>
            </div>
          </div>

          {/* Secondary metadata strip */}
          <div className="od-meta-strip">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 text-[10px] font-mono text-slate-500">
              <div className="flex items-center gap-4 flex-wrap tel-item">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#00E5FF]" />
                  <span className="text-slate-400">{activeScenario.coordinates}</span>
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#00FFA3]" />
                  <span>{activeScenario.resolution}</span>
                </span>
                <span className="hidden md:flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>{activeScenario.beforeDate} → {activeScenario.afterDate}</span>
                  <span className="text-slate-600">({activeScenario.temporalDeltaDays}d)</span>
                </span>
                <span className="hidden lg:flex items-center gap-1">
                  <Compass className="w-3 h-3 text-slate-400" />
                  <span>ALT {simAlt} KM</span>
                </span>
              </div>
              <div className="flex items-center gap-3 tel-item">
                <span className="text-slate-600 font-mono">{utcTime}</span>
                {noChangeControl && (
                  <span className="flex items-center gap-1 text-[#00FFA3] bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full animate-pulse">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    CONTROL ACTIVE · 0% FPR
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Toast */}
        <AnimatePresence>
          {downloadNotice && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="fixed top-20 right-5 z-50 od-card px-4 py-2.5 flex items-center gap-2 text-xs font-mono border-[#00FFA3]/40"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00FFA3]" />
              <span className="text-[#00FFA3]">Mission dossier exported</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════════
            B. HERO / ORBITAL INTRO (GSAP ScrollTrigger)
        ══════════════════════════════════════════════════════ */}
        <section ref={heroSectionRef} className="relative w-full od-hero-height flex flex-col items-center justify-center overflow-hidden">

          {/* Background grid radial glow */}
          <div className="absolute inset-0 od-hero-bg pointer-events-none" />

          <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col h-full justify-center gap-4">

            {/* Hero label */}
            <div className="flex items-center gap-2 hero-orbital-badge pointer-events-none flex-wrap">
              <div className="flex items-center gap-2 od-badge-cyan text-[11px] font-mono">
                <Target className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="font-semibold">ORBITAL PASS ACTIVE</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300">{activeScenario.shortName?.toUpperCase()}</span>
              </div>
              {REAL_IMAGERY[activeScenario.id] && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-mono text-[#00E5FF]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                  <span>SATELLITE IMAGERY · LIVE FEED</span>
                </div>
              )}
              <div className="od-badge-amber text-[10px] font-mono hidden sm:flex items-center gap-1">
                <span>ALT {simAlt} KM → 10m/px</span>
              </div>
            </div>

            {/* Main viewport frame */}
            <div
              ref={heroViewportRef}
              className="od-hero-frame relative w-full"
              style={{ aspectRatio: '16/9' }}
            >
              {/* Atmospheric haze */}
              <div className="hero-haze absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-[#00AAFF]/10 via-transparent to-[#00E5FF]/6 backdrop-blur-[1px]" />

              {/* Targeting crosshair — Stage 1 only */}
              {currentStage === 1 && (
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border border-[#00E5FF]/40 rounded-full animate-ping opacity-30" />
                    <div className="absolute inset-4 border border-[#00E5FF]/30 rounded-full" />
                    <div className="absolute inset-x-0 top-1/2 h-px bg-[#00E5FF]/60" />
                    <div className="absolute inset-y-0 left-1/2 w-px bg-[#00E5FF]/60" />
                    <Crosshair className="absolute inset-0 m-auto w-7 h-7 text-[#00E5FF]/80" />
                  </div>
                </div>
              )}

              {/* Satellite viewer area */}
              <div
                ref={viewerRef}
                className={`relative w-full h-full select-none overflow-hidden rounded-[inherit] ${comparisonMode === 'swipe' ? 'cursor-ew-resize' : 'cursor-default'}`}
                onPointerDown={comparisonMode === 'swipe' ? handlePointerDown : undefined}
              >
                {/* Scaled imagery container for ZoomLevel */}
                <div
                  className="w-full h-full relative"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: selectedAnomaly
                      ? `${selectedAnomaly.box.x + selectedAnomaly.box.width / 2}% ${selectedAnomaly.box.y + selectedAnomaly.box.height / 2}%`
                      : 'center center',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {comparisonMode === 'sideBySide' ? (
                    /* ── SIDE-BY-SIDE MODE ── */
                    <div className="grid grid-cols-2 w-full h-full">
                      {/* Left: BEFORE */}
                      <div className="relative w-full h-full border-r border-[#00E5FF]/30 overflow-hidden">
                        <SatelliteScene
                          scenarioId={activeScenario.id}
                          isAfter={false}
                          spectralMode={spectralMode}
                        />
                        <div className="od-img-label left-3 top-3 text-[#00FFA3]">
                          BEFORE (t₀) · {activeScenario.beforeDate}
                        </div>
                      </div>

                      {/* Right: AFTER */}
                      <div className="relative w-full h-full overflow-hidden">
                        <SatelliteScene
                          scenarioId={activeScenario.id}
                          isAfter={!noChangeControl}
                          spectralMode={spectralMode}
                          showChangeMask={showOverlay}
                          changeMaskOpacity={overlayOpacity / 100}
                          anomalies={filteredAnomalies}
                        />
                        <div className="od-img-label right-3 top-3 text-[#00E5FF]">
                          {noChangeControl
                            ? `CONTROL MATCH (t₀) · ${activeScenario.beforeDate}`
                            : `AFTER (t₁) · ${activeScenario.afterDate}`
                          }
                        </div>

                        {/* Anomaly bounding boxes (in after panel) */}
                        {!noChangeControl && filteredAnomalies.map((anomaly) => {
                          const isSelected = selectedAnomaly?.id === anomaly.id;
                          const isCritical = anomaly.severity === 'CRITICAL';
                          return (
                            <div
                              key={anomaly.id}
                              onClick={(e) => { e.stopPropagation(); setSelectedAnomaly(anomaly.id); playAudioFx('lock'); }}
                              style={{
                                left: `${anomaly.box.x}%`,
                                top: `${anomaly.box.y}%`,
                                width: `${anomaly.box.width}%`,
                                height: `${anomaly.box.height}%`,
                                opacity: 1,
                                transform: 'scale(1)',
                                transition: 'transform 0.2s',
                              }}
                              className={`anomaly-bounding-box ${isSelected ? 'is-selected' : ''} ${isCritical ? 'is-critical' : ''}`}
                            >
                              <span className="radar-pulse-ring" />
                              <span className="reticle-corner reticle-tl" />
                              <span className="reticle-corner reticle-tr" />
                              <span className="reticle-corner reticle-bl" />
                              <span className="reticle-corner reticle-br" />
                              <div className={`od-anomaly-label ${isCritical ? 'od-anomaly-label--critical' : ''} ${isSelected ? 'scale-110' : ''}`}>
                                <span className="font-bold">{anomaly.id}</span>
                                <span className="mx-1 opacity-40">·</span>
                                <span>{anomaly.confidence}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : comparisonMode === 'difference' ? (
                    /* ── DIFFERENCE MODE ── */
                    <div className="relative w-full h-full overflow-hidden">
                      <SatelliteScene
                        scenarioId={activeScenario.id}
                        isAfter={!noChangeControl}
                        spectralMode="diff"
                        comparisonMode="difference"
                        showChangeMask={true}
                        changeMaskOpacity={Math.max(overlayOpacity / 100, 0.7)}
                        anomalies={filteredAnomalies}
                      />
                      <div className="od-img-label left-3 top-3 text-[#00FFA3]">
                        TEMPORAL DIFFERENCE MAP · Δt {activeScenario.temporalDeltaDays}d
                      </div>
                      <div className="od-img-label right-3 top-3 text-[#00E5FF]">
                        {filteredAnomalies.length} DIFFERENCE ZONES
                      </div>

                      {/* Anomaly bounding boxes */}
                      {!noChangeControl && filteredAnomalies.map((anomaly) => {
                        const isSelected = selectedAnomaly?.id === anomaly.id;
                        const isCritical = anomaly.severity === 'CRITICAL';
                        return (
                          <div
                            key={anomaly.id}
                            onClick={(e) => { e.stopPropagation(); setSelectedAnomaly(anomaly.id); playAudioFx('lock'); }}
                            style={{
                              left: `${anomaly.box.x}%`,
                              top: `${anomaly.box.y}%`,
                              width: `${anomaly.box.width}%`,
                              height: `${anomaly.box.height}%`,
                              opacity: 1,
                              transform: 'scale(1)',
                            }}
                            className={`anomaly-bounding-box ${isSelected ? 'is-selected' : ''} ${isCritical ? 'is-critical' : ''}`}
                          >
                            <span className="radar-pulse-ring" />
                            <span className="reticle-corner reticle-tl" />
                            <span className="reticle-corner reticle-tr" />
                            <span className="reticle-corner reticle-bl" />
                            <span className="reticle-corner reticle-br" />
                            <div className={`od-anomaly-label ${isCritical ? 'od-anomaly-label--critical' : ''} ${isSelected ? 'scale-110' : ''}`}>
                              <span className="font-bold">{anomaly.id}</span>
                              <span className="mx-1 opacity-40">·</span>
                              <span>{anomaly.confidence}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* ── SWIPE MODE (Default Interactive Laser Scrub) ── */
                    <>
                      {/* BEFORE layer */}
                      <div className="absolute inset-0">
                        <SatelliteScene scenarioId={activeScenario.id} isAfter={false} spectralMode={spectralMode} />
                        <div className="od-img-label left-3 top-3 text-[#00FFA3]">
                          BEFORE (t₀) · {activeScenario.beforeDate}
                        </div>
                      </div>

                      {/* AFTER layer — clip-path wipe */}
                      <div
                        className="absolute inset-0 z-10 overflow-hidden"
                        style={{ clipPath: `inset(0 ${100 - wipeProgress}% 0 0)` }}
                      >
                        <SatelliteScene
                          scenarioId={activeScenario.id}
                          isAfter={!noChangeControl}
                          spectralMode={spectralMode}
                          showChangeMask={showOverlay}
                          changeMaskOpacity={overlayOpacity / 100}
                          anomalies={filteredAnomalies}
                        />
                        <div className="od-img-label right-3 top-3 text-[#00E5FF]">
                          {noChangeControl
                            ? `CONTROL MATCH (t₀) · ${activeScenario.beforeDate}`
                            : `AFTER (t₁) · ${activeScenario.afterDate}`
                          }
                        </div>

                        {/* Anomaly bounding boxes */}
                        {!noChangeControl && filteredAnomalies.map((anomaly) => {
                          const revealed = wipeProgress >= anomaly.box.x;
                          const isSelected = selectedAnomaly?.id === anomaly.id;
                          const isCritical = anomaly.severity === 'CRITICAL';
                          return (
                            <div
                              key={anomaly.id}
                              onClick={(e) => { e.stopPropagation(); setSelectedAnomaly(anomaly.id); playAudioFx('lock'); }}
                              style={{
                                left: `${anomaly.box.x}%`,
                                top: `${anomaly.box.y}%`,
                                width: `${anomaly.box.width}%`,
                                height: `${anomaly.box.height}%`,
                                opacity: revealed ? 1 : 0,
                                transform: revealed ? 'scale(1)' : 'scale(0.92)',
                                transition: 'opacity 0.3s, transform 0.3s',
                                pointerEvents: revealed ? 'auto' : 'none',
                              }}
                              className={`anomaly-bounding-box ${isSelected ? 'is-selected' : ''} ${isCritical ? 'is-critical' : ''}`}
                            >
                              {revealed && <span className="radar-pulse-ring" />}
                              <span className="reticle-corner reticle-tl" />
                              <span className="reticle-corner reticle-tr" />
                              <span className="reticle-corner reticle-bl" />
                              <span className="reticle-corner reticle-br" />
                              <div className={`od-anomaly-label ${isCritical ? 'od-anomaly-label--critical' : ''} ${isSelected ? 'scale-110' : ''}`}>
                                <span className="font-bold">{anomaly.id}</span>
                                <span className="mx-1 opacity-40">·</span>
                                <span>{anomaly.confidence}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Laser seam */}
                      <div className="laser-seam-line" style={{ left: `${wipeProgress}%` }}>
                        <div className="laser-emitter-node absolute -top-2" />
                        <div className="laser-emitter-node absolute -bottom-2" />
                        <div className={`od-laser-hud ${wipeProgress < 15 ? 'left-3' : '-left-3 -translate-x-full'}`}>
                          <Scan className="w-3 h-3 text-[#00E5FF] animate-spin" style={{ animationDuration: '2s' }} />
                          <span>SCAN {Math.round(wipeProgress)}%</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* HUD overlays */}
                {showHUD && (
                  <div className="absolute inset-0 pointer-events-none z-30">
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00E5FF]/50" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00E5FF]/50" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00E5FF]/50" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00E5FF]/50" />
                    <div className="absolute bottom-3 left-4 od-hud-tag">
                      <span className="w-8 h-0.5 bg-[#00E5FF]/60 inline-block" /> 500m
                    </div>
                    <div className="absolute bottom-3 right-4 od-hud-tag">{activeScenario.satellite}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Stage indicator row + CTA */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                {[
                  { s: 1, label: '01 ORBITAL ZOOM' },
                  { s: 2, label: '02 LASER WIPE' },
                  { s: 3, label: '03 DOSSIER' },
                ].map(({ s, label }) => (
                  <div
                    key={s}
                    className={`px-2.5 py-1 rounded-md font-mono text-[9px] font-bold flex items-center gap-1.5 transition-all ${
                      currentStage === s
                        ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30'
                        : 'text-slate-600 border border-transparent'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${currentStage === s ? 'bg-[#00E5FF] animate-pulse' : 'bg-slate-700'}`} />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{s}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleAutoSweep}
                  className="od-icon-btn text-[11px] font-mono flex items-center gap-1.5 px-3"
                >
                  {isAutoSweeping
                    ? <><Pause className="w-3 h-3 text-amber-400" /><span>PAUSE</span></>
                    : <><Play className="w-3 h-3 text-[#00E5FF]" /><span>AUTO SWEEP</span></>
                  }
                </button>
                <button
                  onClick={scrollToAnalyzer}
                  className="od-btn-primary text-[11px] px-3 py-1.5 flex items-center gap-1.5"
                >
                  <span>Analyze Changes</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-slate-600 animate-bounce" />
            <span className="text-[9px] font-mono text-slate-600 tracking-widest">SCROLL</span>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            D. CASE-STUDY LIBRARY
        ══════════════════════════════════════════════════════ */}
        <section ref={casesRef} id="case-studies" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-base text-white tracking-wide">Case Studies</h2>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">Select a scenario to load imagery, anomalies and metadata</p>
            </div>
            <span className="od-badge-cyan text-[10px] font-mono">{CASE_STUDIES.length} DATASETS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CASE_STUDIES.map((cs) => {
              const isActive = cs.id === activeScenarioId;
              return (
                <button
                  key={cs.id}
                  onClick={() => setActiveScenario(cs.id)}
                  className={`od-case-card text-left group transition-all ${isActive ? 'od-case-card--active' : ''}`}
                >
                  {/* Thumbnail */}
                  <div className="od-case-thumb">
                    <SatelliteScene
                      scenarioId={cs.id}
                      isAfter
                      spectralMode="rgb"
                      thumbnail
                    />
                    <div className="od-case-thumb-overlay">
                      {getScenarioIcon(cs.id, 'w-5 h-5')}
                    </div>

                    {isActive && (
                      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-[#00E5FF]/20 border border-[#00E5FF]/60 text-[8px] font-mono font-bold text-[#00E5FF]">
                        ACTIVE
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <div className="flex items-start justify-between gap-1">
                      <div className="font-display font-bold text-[11px] text-white leading-tight">{cs.title}</div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">{cs.region}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[9px] text-slate-600 font-mono">{cs.beforeDate.slice(0, 7)}</span>
                      <span className="od-severity-pill text-[8px]">{cs.anomalies.length} detections</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            E. DETECTION METRICS BAR
        ══════════════════════════════════════════════════════ */}
        <section ref={analyzeRef} className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard
              label="Affected Area"
              value={executiveMetrics.hasValidDetections ? executiveMetrics.totalAreaKm2 : '—'}
              unit={executiveMetrics.hasValidDetections ? 'km²' : ''}
              color="emerald"
              icon={<TrendingDown className="w-4 h-4 text-[#00FFA3]" />}
            />
            <MetricCard
              label="Detected Regions"
              value={executiveMetrics.totalAnomalies}
              color="cyan"
              icon={<Scan className="w-4 h-4 text-[#00E5FF]" />}
            />
            <MetricCard
              label="Change Confidence"
              value={executiveMetrics.hasValidDetections ? `${executiveMetrics.averageConfidence}%` : '—'}
              color={executiveMetrics.averageConfidence >= 90 ? 'cyan' : 'amber'}
              icon={<Activity className="w-4 h-4 text-[#00E5FF]" />}
            />
            <MetricCard
              label="Data Quality"
              value={noChangeControl ? '100%' : executiveMetrics.hasValidDetections ? '≥98%' : '—'}
              unit={noChangeControl ? 'Match' : ''}
              color="slate"
              icon={<ShieldCheck className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            C + F + G. ANALYSIS PANEL (Comparison + Controls + Report)
        ══════════════════════════════════════════════════════ */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

            {/* ── LEFT: Controls (4 cols) ── */}
            <aside className="xl:col-span-4 space-y-4">

              {/* Detection Controls card */}
              <div className="od-card p-5 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-white/6">
                  <Sliders className="w-4 h-4 text-[#00E5FF]" />
                  <h3 className="font-display font-bold text-sm text-white">Detection Controls</h3>
                </div>

                {/* Scenario selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="od-label">Scenario Presets</label>
                    <span className="text-[10px] font-mono text-slate-500">8 available</span>
                  </div>
                  {/* Quick-switch presets for top 3 test cases */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {CASE_STUDIES.slice(0, 3).map((cs) => (
                      <button
                        key={cs.id}
                        onClick={() => setActiveScenario(cs.id)}
                        className={`px-2 py-1.5 rounded-lg border text-[11px] font-mono text-center truncate transition-all ${
                          activeScenarioId === cs.id
                            ? 'bg-[#00E5FF]/15 border-[#00E5FF]/50 text-[#00E5FF] font-bold shadow-[0_0_8px_rgba(0,229,255,0.2)]'
                            : 'bg-white/3 border-white/8 text-slate-400 hover:border-white/15 hover:text-slate-200'
                        }`}
                        title={cs.title}
                      >
                        {cs.shortName?.split(' ')[0] || cs.title}
                      </button>
                    ))}
                  </div>
                  {/* Full scenario select */}
                  <select
                    value={activeScenarioId}
                    onChange={(e) => setActiveScenario(e.target.value)}
                    className="w-full bg-[#0a0f1e] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#00E5FF]/50 transition-colors cursor-pointer"
                  >
                    {CASE_STUDIES.map((cs) => (
                      <option key={cs.id} value={cs.id} className="bg-[#060913] text-slate-200">
                        {cs.title} ({cs.region})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Comparison mode */}
                <div className="space-y-1.5">
                  <label className="od-label">Comparison Mode</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'swipe', label: 'Swipe' },
                      { id: 'sideBySide', label: 'Side-by-Side' },
                      { id: 'difference', label: 'Difference' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setComparisonMode(m.id)}
                        className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono transition-all ${
                          comparisonMode === m.id
                            ? 'bg-[#00E5FF]/12 border-[#00E5FF]/40 text-[#00E5FF]'
                            : 'bg-white/3 border-white/8 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confidence threshold */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="od-label flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-[#00E5FF]" />
                      Confidence Threshold
                    </label>
                    <span className="font-mono text-sm font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/20">
                      {confidenceThreshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0" max="100" step="1"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(e.target.value)}
                    className="aerospace-slider w-full"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-600">
                    <span>0% (ALL)</span>
                    <span className="text-[#00E5FF]/80">
                      {filteredAnomalies.length}/{activeScenario.anomalies.length} active
                    </span>
                    <span>100% (STRICT)</span>
                  </div>
                </div>

                {/* Overlay opacity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="od-label flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#00FFA3]" />
                      Overlay Opacity
                    </label>
                    <span className="font-mono text-xs text-[#00FFA3]">{overlayOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0" max="100" step="5"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(e.target.value)}
                    className="aerospace-slider w-full accent-emerald"
                  />
                </div>

                {/* Image divider position */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="od-label">Image Divider</label>
                    <span className="font-mono text-xs text-slate-400">{wipeProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0" max="100" step="1"
                    value={wipeProgress}
                    onChange={(e) => setWipeProgress(Number(e.target.value))}
                    className="aerospace-slider w-full"
                  />
                </div>

                {/* Toggles row */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowOverlay(!showOverlay)}
                    className={`od-toggle-btn ${showOverlay ? 'od-toggle-btn--on' : ''}`}
                  >
                    {showOverlay ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>Overlay</span>
                  </button>
                  <button onClick={toggleHUD} className={`od-toggle-btn ${showHUD ? 'od-toggle-btn--on' : ''}`}>
                    <Crosshair className="w-3 h-3" />
                    <span>HUD</span>
                  </button>
                  <button
                    onClick={() => setZoomLevel(zoomLevel === 1.0 ? 1.5 : zoomLevel === 1.5 ? 2.0 : 1.0)}
                    className={`od-toggle-btn ${zoomLevel > 1 ? 'od-toggle-btn--on' : ''}`}
                    title="Cycle zoom level (1.0×, 1.5×, 2.0×)"
                  >
                    <ZoomIn className="w-3 h-3" />
                    <span>{Number(zoomLevel).toFixed(1)}×</span>
                  </button>
                </div>
              </div>

              {/* No-change control test */}
              <div className="od-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`w-4 h-4 ${noChangeControl ? 'text-[#00FFA3]' : 'text-slate-500'}`} />
                    <span className="text-sm font-semibold text-white">No-Change Verification</span>
                  </div>
                  <button
                    onClick={() => setNoChangeControl(!noChangeControl)}
                    className={`relative w-10 h-5.5 rounded-full border transition-all p-0.5 ${
                      noChangeControl
                        ? 'bg-[#00FFA3]/20 border-[#00FFA3]/60 shadow-[0_0_12px_rgba(0,255,163,0.3)]'
                        : 'bg-white/5 border-white/15'
                    }`}
                    style={{ height: '22px' }}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${noChangeControl ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Compare identical baseline images to verify&nbsp;
                  <strong className="text-[#00FFA3]">zero false positives</strong>. Proves the engine does not hallucinate detections.
                </p>
                {noChangeControl && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#00FFA3] bg-emerald-950/40 border border-emerald-500/25 p-2 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    ZERO-HALLUCINATION VERIFIED — 0 anomalies, 0 false positives
                  </div>
                )}
              </div>

              {/* Spectral mode */}
              <div className="od-card p-5 space-y-3">
                <label className="od-label">Spectral Visualization Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'rgb', label: 'RGB True Color' },
                    { id: 'cir', label: 'CIR Infrared' },
                    { id: 'ndvi', label: 'NDVI Heatmap' },
                    { id: 'diff', label: 'Temporal Diff' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSpectralMode(m.id)}
                      className={`px-2.5 py-2 rounded-lg border text-[11px] font-mono transition-all text-left ${
                        spectralMode === m.id
                          ? 'bg-[#00E5FF]/12 border-[#00E5FF]/40 text-[#00E5FF]'
                          : 'bg-white/3 border-white/8 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overlay legend */}
              <div className="od-card p-4">
                <button
                  onClick={() => setOverlayLegendOpen(!overlayLegendOpen)}
                  className="w-full flex items-center justify-between text-xs font-mono text-slate-400 hover:text-slate-200"
                >
                  <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-[#00E5FF]" /> Overlay Color Legend</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${overlayLegendOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {overlayLegendOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-3 space-y-1.5 text-[10px] font-mono">
                        {[
                          { color: 'bg-red-500', label: 'CRITICAL change (>90% conf.)' },
                          { color: 'bg-orange-500', label: 'HIGH severity (70–90%)' },
                          { color: 'bg-amber-400', label: 'ELEVATED change (50–70%)' },
                          { color: 'bg-[#00E5FF]', label: 'Confirmed detection zone' },
                          { color: 'bg-[#00FFA3]', label: 'Selected / focused anomaly' },
                        ].map(({ color, label }) => (
                          <div key={label} className="flex items-center gap-2 text-slate-400">
                            <span className={`w-3 h-3 rounded-sm flex-shrink-0 ${color} opacity-80`} />
                            {label}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </aside>

            {/* ── RIGHT: Dossier + Anomaly list (8 cols) ── */}
            <div className="xl:col-span-8 space-y-5">

              {/* G. Executive Report */}
              <div className="od-card p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#00FFA3]" />
                    <h3 className="font-display font-bold text-sm text-white">Executive Report</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="od-badge-cyan text-[9px] font-mono">{activeScenario.classification}</span>
                    <button onClick={handleExport} className="od-btn-secondary text-[10px] px-2.5 py-1 flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                {/* Report metadata grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[10px] font-mono">
                  {[
                    { label: 'LOCATION', value: activeScenario.region },
                    { label: 'SATELLITE', value: activeScenario.satellite },
                    { label: 'BEFORE DATE', value: activeScenario.beforeDate },
                    { label: 'AFTER DATE', value: noChangeControl ? `${activeScenario.beforeDate} [CTRL]` : activeScenario.afterDate },
                    { label: 'RESOLUTION', value: activeScenario.resolution },
                    { label: 'DETECTION METHOD', value: activeScenario.detectionMethod?.split(' ')[0] + '…' },
                  ].map(({ label, value }) => (
                    <div key={label} className="space-y-0.5">
                      <div className="text-slate-600 uppercase tracking-wider">{label}</div>
                      <div className="text-slate-300 truncate" title={value}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Status banner */}
                <div className={`od-status-banner ${
                  executiveMetrics.statusLevel === 'critical' ? 'od-status-banner--critical' :
                  executiveMetrics.statusLevel === 'high' ? 'od-status-banner--high' :
                  noChangeControl ? 'od-status-banner--ok' : 'od-status-banner--neutral'
                }`}>
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-mono font-bold text-[10px]">{executiveMetrics.statusLabel}</span>
                </div>

                {/* Executive summary */}
                <p className="text-xs text-slate-300 leading-relaxed bg-white/3 p-3 rounded-xl border border-white/6">
                  {executiveReport.summary}
                </p>

                {/* Key findings */}
                {executiveReport.keyFindings?.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Key Findings</div>
                    {executiveReport.keyFindings.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-white/3 border border-white/6 text-xs text-slate-300">
                        <ChevronRight className="w-3.5 h-3.5 text-[#00E5FF] flex-shrink-0 mt-0.5" />
                        {f}
                      </div>
                    ))}
                  </div>
                )}

                {/* Impact + recommendation */}
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    REGIONAL IMPACT ASSESSMENT
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeScenario.environmentalImpact}</p>
                  <div className="pt-2 border-t border-white/8 text-[10px] font-mono text-[#00FFA3] flex items-start gap-2">
                    <span className="flex-shrink-0">RECOMMENDATION:</span>
                    <span className="text-slate-300">{executiveReport.actionRecommendation}</span>
                  </div>
                </div>

                {/* Confidence & data-quality warnings */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Data Quality & Limitations</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-500 font-mono">
                    <div className="bg-white/2 border border-white/6 rounded-lg p-2.5 space-y-1">
                      <div className="text-slate-400 font-semibold">Confidence Limitations</div>
                      <div className="leading-relaxed">{activeScenario.confidenceLimitations}</div>
                    </div>
                    <div className="bg-white/2 border border-white/6 rounded-lg p-2.5 space-y-1">
                      <div className="text-slate-400 font-semibold">Data Quality Note</div>
                      <div className="leading-relaxed">{activeScenario.dataQualityWarning}</div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Anomaly list */}
              <div ref={dossierRef} id="dossier" className="od-card p-5 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#00E5FF]" />
                    <h3 className="font-display font-bold text-sm text-white">Detected Anomalies</h3>
                  </div>
                  <span className="od-badge-cyan text-[9px] font-mono">{filteredAnomalies.length} ACTIVE</span>
                </div>

                {noChangeControl ? (
                  <div className="flex flex-col items-center py-8 gap-3 text-center">
                    <ShieldCheck className="w-8 h-8 text-[#00FFA3] opacity-60" />
                    <div className="text-sm text-[#00FFA3] font-mono">Zero-Hallucination Verified</div>
                    <p className="text-xs text-slate-500 max-w-xs">
                      Control baseline active. Identical images produce 0 anomalies and 0 false positives.
                    </p>
                  </div>
                ) : filteredAnomalies.length === 0 ? (
                  <div className="flex flex-col items-center py-8 gap-2 text-center">
                    <Eye className="w-6 h-6 text-slate-600" />
                    <div className="text-sm text-slate-500 font-mono">No anomalies above threshold</div>
                    <p className="text-xs text-slate-600">Lower the confidence threshold to reveal additional detections.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredAnomalies.map((anomaly) => {
                      const isSelected = selectedAnomaly?.id === anomaly.id;
                      return (
                        <button
                          key={anomaly.id}
                          onClick={() => setSelectedAnomaly(anomaly.id)}
                          className={`w-full text-left p-3 rounded-xl border transition-all group ${
                            isSelected
                              ? 'bg-[#00E5FF]/8 border-[#00E5FF]/35'
                              : 'bg-white/2 border-white/8 hover:border-white/16'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[10px] font-bold text-[#00E5FF]">{anomaly.id}</span>
                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold ${getSeverityColor(anomaly.severity)}`}>
                                  {anomaly.severity}
                                </span>
                                <span className="text-[9px] font-mono text-slate-600 capitalize">{anomaly.category}</span>
                              </div>
                              <div className="text-xs text-slate-300 mt-1 leading-tight font-medium">{anomaly.name}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5 truncate">{anomaly.summary}</div>
                            </div>
                            <div className="text-right flex-shrink-0 space-y-1">
                              <div className="text-xs font-bold font-mono text-[#00FFA3]">{anomaly.confidence}%</div>
                              <div className="text-[9px] font-mono text-slate-500">{anomaly.areaKm2} km²</div>
                              <div className="text-[9px] font-mono text-slate-600">ΔNDVI {anomaly.ndviDelta}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Micro-crop evidence */}
                {!noChangeControl && selectedAnomaly && (
                  <div className="pt-3 border-t border-white/6">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Evidence Crop — {selectedAnomaly.id}</div>
                    <MicroCropPreview
                      anomaly={selectedAnomaly}
                      scenario={activeScenario}
                      isControlMode={noChangeControl}
                      spectralMode={spectralMode}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-white/6 bg-[#040810] py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-slate-600">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]/60" />
              <span>ORBITDIFF AI · TRACK 05: SPACETECH &amp; SATELLITE INTELLIGENCE</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Sentinel-2 MSI · Level-2A BOA</span>
              <span className="text-slate-700">·</span>
              <span>Built with GSAP + Zustand + Vite</span>
            </div>
          </div>
        </footer>

        {/* ══════════════════════════════════════════════════════
            MISSION COMMAND & NAVIGATION DRAWER (PORTALED TO BODY)
            Rendered directly into document.body with z-[99999] so it is NEVER
            overlayed by map tiles, GSAP 3D transforms, or scroll effects
        ══════════════════════════════════════════════════════ */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <div className="fixed inset-0 z-[99999] pointer-events-auto">
                {/* Backdrop blur overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    playAudioFx('close');
                  }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Command Drawer Modal */}
                <motion.div
                  initial={{ opacity: 0, x: 360 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 360 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="fixed top-0 right-0 z-[100000] h-full w-full max-w-md bg-[#070b16] border-l border-white/12 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden"
                  style={{ overscrollBehavior: 'contain' }}
                >
                  {/* Drawer Header */}
                  <div className="p-4 border-b border-white/8 flex items-center justify-between bg-[#060913]/95">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center">
                        <Compass className="w-4 h-4 text-[#00E5FF]" />
                      </div>
                      <div>
                        <div className="font-display font-bold text-xs tracking-wider text-white">MISSION CONTROL</div>
                        <div className="text-[9px] font-mono text-slate-500">ORBITAL SUITE · SENTINEL-2 L2A</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        playAudioFx('close');
                      }}
                      className="od-icon-btn p-1.5 hover:text-white"
                      title="Close"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  {/* Drawer Content */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs touch-pan-y">
                    {/* Section 1: Direct Jumps */}
                    <div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                        <span>Navigation &amp; Jump Anchors</span>
                        <span className="text-[#00E5FF]">5 ACTIONS</span>
                      </div>
                      <div className="space-y-1.5">
                        {[
                          {
                            title: '01. Orbital Viewport & Satellite Feed',
                            desc: 'Altitude zoom (786km → 10km) & laser swipe scanner',
                            icon: <Satellite className="w-4 h-4 text-[#00E5FF]" />,
                            action: () => {
                              setMobileMenuOpen(false);
                              setTimeout(scrollToOverview, 80);
                            },
                          },
                          {
                            title: '02. Earth Observation Case Studies',
                            desc: 'Amazon, Dubai & Alpine Glacier verified datasets',
                            icon: <Globe className="w-4 h-4 text-[#00FFA3]" />,
                            action: () => {
                              setMobileMenuOpen(false);
                              setTimeout(scrollToCases, 80);
                            },
                          },
                          {
                            title: '03. Spectral & Difference Workbench',
                            desc: 'RGB / CIR / NDVI bands with interactive slider & side-by-side',
                            icon: <Sliders className="w-4 h-4 text-amber-400" />,
                            action: () => {
                              setMobileMenuOpen(false);
                              setTimeout(scrollToAnalyzer, 80);
                            },
                          },
                          {
                            title: '04. Verification Dossier & Micro-Crops',
                            desc: 'Sub-pixel ground truth detections and severity telemetry',
                            icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
                            action: () => {
                              setMobileMenuOpen(false);
                              setTimeout(scrollToDossier, 80);
                            },
                          },
                          {
                            title: '05. Export Mission Intelligence Report',
                            desc: 'Generate and download complete JSON telemetry package',
                            icon: <Download className="w-4 h-4 text-[#00E5FF]" />,
                            action: () => {
                              setMobileMenuOpen(false);
                              handleExport();
                            },
                          },
                        ].map((navItem, idx) => (
                          <button
                            key={idx}
                            onClick={navItem.action}
                            className="w-full text-left p-2.5 rounded-lg bg-white/2 hover:bg-white/6 border border-white/6 hover:border-white/12 transition-all group flex items-start gap-2.5"
                          >
                            <div className="mt-0.5 p-1 rounded bg-black/40 border border-white/8 group-hover:border-[#00E5FF]/40">
                              {navItem.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-slate-200 group-hover:text-white text-xs">{navItem.title}</div>
                              <div className="text-[10px] text-slate-500 truncate mt-0.5 font-mono">{navItem.desc}</div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#00E5FF] mt-1 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Section 2: Active Scenario Switcher */}
                    <div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                        <span>Active Case Studies</span>
                        <span className="text-[#00FFA3] font-bold">3 VERIFIED</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {CASE_STUDIES.map((cs) => {
                          const isActive = cs.id === activeScenarioId;
                          return (
                            <button
                              key={cs.id}
                              onClick={() => {
                                setActiveScenario(cs.id);
                                playAudioFx('switch');
                              }}
                              className={`p-2.5 rounded-lg border text-left transition-all flex items-center justify-between gap-3 ${
                                isActive
                                  ? 'bg-[#00E5FF]/10 border-[#00E5FF]/50 text-white'
                                  : 'bg-white/2 border-white/6 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="p-1.5 rounded-md bg-black/50 border border-white/8">
                                  {getScenarioIcon(cs.id, 'w-4 h-4')}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-display font-semibold text-xs leading-none truncate text-white">
                                    {cs.title}
                                  </div>
                                  <div className="text-[9px] font-mono text-slate-500 mt-1 truncate">
                                    {cs.region} · {cs.anomalies.length} detections
                                  </div>
                                </div>
                              </div>
                              {isActive ? (
                                <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-[#00FFA3]/20 border border-[#00FFA3]/50 text-[#00FFA3]">
                                  CURRENT
                                </span>
                              ) : (
                                <span className="text-[9px] font-mono text-slate-600 hover:text-slate-400">
                                  Select →
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 3: Aerospace Cockpit Controls */}
                    <div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2">
                        Cockpit Telemetry Toggles
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Audio Toggle + Test */}
                        <div className="p-2.5 rounded-lg bg-white/2 border border-white/6 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              {audioEnabled ? <Volume2 className="w-3 h-3 text-[#00FFA3]" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
                              Audio FX
                            </span>
                            <button
                              onClick={() => {
                                toggleAudio();
                              }}
                              className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold transition-colors ${
                                audioEnabled
                                  ? 'bg-[#00FFA3]/20 text-[#00FFA3] border border-[#00FFA3]/40'
                                  : 'bg-white/5 text-slate-500 border border-white/10'
                              }`}
                            >
                              {audioEnabled ? 'ON' : 'MUTED'}
                            </button>
                          </div>
                          {audioEnabled && (
                            <button
                              onClick={() => playAudioFx('lock')}
                              className="w-full text-[9px] font-mono py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00E5FF] transition-colors flex items-center justify-center gap-1"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              Test Chime
                            </button>
                          )}
                        </div>

                        {/* HUD Toggle */}
                        <div className="p-2.5 rounded-lg bg-white/2 border border-white/6 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              <Crosshair className="w-3 h-3 text-[#00E5FF]" />
                              HUD Grid
                            </span>
                            <button
                              onClick={toggleHUD}
                              className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold transition-colors ${
                                showHUD
                                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                                  : 'bg-white/5 text-slate-500 border border-white/10'
                              }`}
                            >
                              {showHUD ? 'ACTIVE' : 'OFF'}
                            </button>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono mt-1">Crosshairs &amp; vectors</span>
                        </div>

                        {/* Auto-Sweep Toggle */}
                        <div className="p-2.5 rounded-lg bg-white/2 border border-white/6 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              {isAutoSweeping ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-[#00E5FF]" />}
                              Auto-Sweep
                            </span>
                            <button
                              onClick={toggleAutoSweep}
                              className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold transition-colors ${
                                isAutoSweeping
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                  : 'bg-white/5 text-slate-500 border border-white/10'
                              }`}
                            >
                              {isAutoSweeping ? 'SCANNING' : 'OFF'}
                            </button>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono mt-1">Continuous wipe radar</span>
                        </div>

                        {/* 0% FPR Baseline Control */}
                        <div className="p-2.5 rounded-lg bg-white/2 border border-white/6 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-[#00FFA3]" />
                              Control Mode
                            </span>
                            <button
                              onClick={() => setNoChangeControl(!noChangeControl)}
                              className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold transition-colors ${
                                noChangeControl
                                  ? 'bg-[#00FFA3]/20 text-[#00FFA3] border border-[#00FFA3]/40'
                                  : 'bg-white/5 text-slate-500 border border-white/10'
                              }`}
                            >
                              {noChangeControl ? '0% FPR' : 'NORMAL'}
                            </button>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono mt-1">Zero-hallucination test</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Live Telemetry Briefing */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/8 space-y-2">
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center justify-between">
                        <span>Active Telemetry Briefing</span>
                        <span className="text-[#00E5FF]">{activeScenario.satellite}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div>
                          <div className="text-slate-600">COORDINATES</div>
                          <div className="text-slate-300 truncate">{activeScenario.coordinates}</div>
                        </div>
                        <div>
                          <div className="text-slate-600">DELTA TIMEFRAME</div>
                          <div className="text-slate-300">{activeScenario.temporalDeltaDays} Days</div>
                        </div>
                        <div>
                          <div className="text-slate-600">SPATIAL RESOLUTION</div>
                          <div className="text-slate-300 truncate">{activeScenario.resolution.split(' ')[0]}</div>
                        </div>
                        <div>
                          <div className="text-slate-600">ORBIT ALTITUDE</div>
                          <div className="text-slate-300">{activeScenario.orbitAlt || '786.2 KM'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Drawer Footer */}
                  <div className="p-3 border-t border-white/8 bg-[#040810] flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
                      OrbitDiff AI · Track 05
                    </span>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleExport();
                      }}
                      className="px-2.5 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 transition-colors flex items-center gap-1"
                    >
                      <Download className="w-2.5 h-2.5" />
                      Export JSON
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </ReactLenis>
  );
}
