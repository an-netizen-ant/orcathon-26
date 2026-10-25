import React from 'react';
import { Crosshair, ShieldCheck, Eye } from 'lucide-react';

/**
 * MicroCropPreview Component
 * Renders an embedded micro-crop image thumbnail preview of the exact anomaly detected,
 * featuring tactical HUD crosshairs, coordinate badges, and spectral telemetry.
 */
export function MicroCropPreview({ anomaly, scenario, isControlMode, spectralMode = 'rgb' }) {
  if (isControlMode) {
    return (
      <div className="relative w-full h-56 rounded-xl bg-space-950/90 border border-telemetry-emerald/30 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-telemetry-emerald/10 border border-telemetry-emerald/40 flex items-center justify-center mb-3 text-telemetry-emerald animate-pulse">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="font-mono text-xs font-semibold uppercase tracking-wider text-telemetry-emerald">
          Zero Hallucination Verified
        </div>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Identical temporal baseline match. 0 pixel disparity detected. Micro-crop anomaly feed suppressed.
        </p>
        <div className="mt-3 font-mono text-[10px] text-slate-500 bg-space-900 px-3 py-1 rounded-full border border-slate-800">
          DELTA_PIXELS: 0.0000 · CONFIDENCE: 100.0%
        </div>
      </div>
    );
  }

  if (!anomaly) {
    return (
      <div className="relative w-full h-56 rounded-xl bg-space-950/90 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mb-2 text-slate-400">
          <Eye className="w-5 h-5" />
        </div>
        <div className="font-mono text-xs text-slate-400 uppercase tracking-wider">
          No Anomaly In Target View
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Adjust confidence sensitivity or select a different scenario preset.
        </p>
      </div>
    );
  }

  // Calculate box dimensions for viewBox centering
  const box = anomaly.box || { x: 20, y: 20, width: 25, height: 25 };
  // Convert percentage (0-100) to SVG coordinate space (0-1000, 0-650)
  const vbWidth = Math.max(160, box.width * 10 * 1.6);
  const vbHeight = Math.max(110, box.height * 6.5 * 1.6);
  const vbX = Math.max(0, Math.min(1000 - vbWidth, box.x * 10 - vbWidth * 0.15));
  const vbY = Math.max(0, Math.min(650 - vbHeight, box.y * 6.5 - vbHeight * 0.15));

  const isCritical = anomaly.severity === 'CRITICAL';
  const badgeColor = isCritical
    ? 'text-red-400 bg-red-950/60 border-red-500/40'
    : 'text-telemetry-cyan bg-cyan-950/60 border-cyan-500/40';

  return (
    <div className="relative w-full rounded-xl bg-space-950/90 border border-cyan-500/30 overflow-hidden shadow-cockpit">
      {/* Micro-Crop Header Telemetry Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-space-900/90 border-b border-cyan-500/20 text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-200 font-semibold">{anomaly.id} // ANOMALY MICROCROP</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${badgeColor}`}>
            {anomaly.severity}
          </span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">3.2× RESOLVED ZOOM</span>
        </div>
      </div>

      {/* Scaled Satellite Imagery Window with CRT Scanlines & Targeting Crosshairs */}
      <div className="relative h-48 w-full overflow-hidden bg-space-950">
        {/* Render High-Resolution SVG Cropped to Anomaly */}
        <svg
          viewBox={`${vbX} ${vbY} ${vbWidth} ${vbHeight}`}
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Base scene rendering based on scenario */}
          {scenario.id === 'amazon' && (
            <g>
              <rect width="1000" height="650" fill={spectralMode === 'cir' ? '#881337' : '#14381e'} />
              {/* Roads and deforestation cuts */}
              <line x1="120" y1="40" x2="460" y2="400" stroke="#f59e0b" strokeWidth="8" />
              <polygon
                points="170,120 320,80 370,170 230,220"
                fill={spectralMode === 'cir' ? '#22d3ee' : '#c27847'}
              />
              <polygon
                points="510,70 680,60 710,180 540,200"
                fill={spectralMode === 'cir' ? '#22d3ee' : '#c27847'}
              />
              <polygon
                points="610,340 850,330 890,520 640,540"
                fill={spectralMode === 'cir' ? '#0f172a' : '#292524'}
              />
              <path
                d="M -20,240 Q 150,190 280,260 T 520,220 T 780,290 T 1040,210 L 1040,265"
                stroke={spectralMode === 'cir' ? '#071526' : '#2b4c6f'}
                strokeWidth="50"
                fill="none"
              />
            </g>
          )}

          {scenario.id === 'dubai' && (
            <g>
              <rect width="1000" height="650" fill={spectralMode === 'cir' ? '#030712' : '#0e7490'} />
              {/* Reclaimed peninsula & shipping dredged channel */}
              <path
                d="M 330,440 L 330,170 Q 330,130 380,130 Q 430,130 430,170 L 430,440 Z"
                fill={spectralMode === 'cir' ? '#38bdf8' : '#fde68a'}
              />
              <polygon points="640,110 880,90 850,330 610,350" fill="#082f49" />
              <path d="M 0,470 L 1000,470" stroke="#334155" strokeWidth="16" />
              <path
                d="M 170,300 C 140,110 380,50 560,90 C 620,110 650,150 660,190"
                fill="none"
                stroke="#fef3c7"
                strokeWidth="22"
              />
            </g>
          )}

          {scenario.id === 'glacier' && (
            <g>
              <rect width="1000" height="650" fill="#1e293b" />
              {/* Retreated glacier and new lake */}
              <path
                d="M 340,40 Q 500,20 660,40 L 640,160 Q 590,220 500,230 Q 410,220 355,160 Z"
                fill="#7dd3fc"
              />
              <polygon
                points="355,160 500,230 640,160 660,390 590,440 400,440 330,390"
                fill="#52525b"
              />
              <path
                d="M 350,440 Q 500,410 640,440 Q 660,540 570,590 Q 490,610 420,590 Q 330,540 350,440 Z"
                fill="#22d3ee"
              />
            </g>
          )}

          {/* Highlight Target Box Overlay on SVG */}
          <rect
            x={box.x * 10}
            y={box.y * 6.5}
            width={box.width * 10}
            height={box.height * 6.5}
            fill="rgba(0, 242, 254, 0.12)"
            stroke={isCritical ? '#ef4444' : '#00f2fe'}
            strokeWidth="2.5"
            strokeDasharray="6,4"
          />
        </svg>

        {/* Tactical HUD Overlay Elements */}
        <div className="absolute inset-0 scanline-overlay pointer-events-none" />

        {/* Center Crosshairs */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-16 h-16">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-cyan-400/50" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-cyan-400/50" />
            <div className="absolute inset-0 border border-cyan-400/30 rounded-full animate-ping opacity-30" />
            <div className="absolute inset-2 border border-cyan-400/60 rounded-full" />
            <Crosshair className="w-5 h-5 absolute inset-0 m-auto text-cyan-400" />
          </div>
        </div>

        {/* Corner HUD Markers */}
        <div className="absolute top-2 left-2 font-mono text-[9px] text-cyan-300 bg-space-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
          LAT/LON: {anomaly.coordinates}
        </div>
        <div className="absolute bottom-2 right-2 font-mono text-[9px] text-emerald-400 bg-space-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
          CONF: {anomaly.confidence}% · ΔNDVI: {anomaly.ndviDelta}
        </div>
      </div>

      {/* Micro-Crop Deep Intelligence Metadata */}
      <div className="p-3 bg-space-900/70 border-t border-cyan-500/20 space-y-2">
        <div className="text-xs text-slate-200 font-medium leading-relaxed">
          {anomaly.cropDescription}
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 border-t border-slate-800">
          <div>
            <span className="text-slate-400 block">SPECTRAL DISPARITY:</span>
            <span className="text-cyan-300 font-medium truncate block">
              {anomaly.microCropDetail?.spectralSignature || 'Band 8 Collapse (-64%)'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">EST. DISPLACEMENT:</span>
            <span className="text-emerald-400 font-medium block">
              {anomaly.microCropDetail?.estimatedDisplacement || `${anomaly.areaKm2} km² footprint`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
