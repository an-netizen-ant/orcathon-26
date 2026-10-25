import React, { useState } from 'react';
import { Crosshair, ShieldCheck, Eye } from 'lucide-react';
import { REAL_IMAGERY } from '../constants/imagery';

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

  let imgFilter = 'none';
  if (spectralMode === 'cir') {
    imgFilter = 'hue-rotate(185deg) saturate(2.4) contrast(1.2)';
  } else if (spectralMode === 'ndvi') {
    imgFilter = 'hue-rotate(90deg) saturate(2.5) contrast(1.35)';
  } else if (spectralMode === 'diff') {
    imgFilter = 'contrast(1.6) saturate(0.2) brightness(0.9)';
  }
  const [cropImgError, setCropImgError] = useState(false);
  const realImgSrc = REAL_IMAGERY[scenario.id]?.after;
  const hasRaster = !cropImgError && Boolean(realImgSrc);

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
          {/* Real satellite image crop if available */}
          {hasRaster ? (
            <image
              href={realImgSrc}
              xlinkHref={realImgSrc}
              x="0"
              y="0"
              width="1000"
              height="650"
              preserveAspectRatio="none"
              style={{ filter: imgFilter }}
              onError={() => setCropImgError(true)}
            />
          ) : (
            <>
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

          {scenario.id === 'flood' && (
            <g>
              <rect width="1000" height="650" fill={spectralMode === 'cir' ? '#064e3b' : '#78350f'} opacity="0.85" />
              {[200, 400, 600, 800].map((x) => (
                <line key={`f-x-${x}`} x1={x} y1="0" x2={x} y2="650" stroke="#854d0e" strokeWidth="2" opacity="0.4" />
              ))}
              {[160, 320, 480].map((y) => (
                <line key={`f-y-${y}`} x1="0" y1={y} x2="1000" y2={y} stroke="#854d0e" strokeWidth="2" opacity="0.4" />
              ))}
              <path d="M 450,0 Q 530,280 480,450 T 520,650" stroke="#0284c7" strokeWidth="36" fill="none" />
              <path
                d="M 160,180 Q 380,120 620,190 T 880,320 T 750,560 T 320,580 T 140,360 Z"
                fill={spectralMode === 'cir' ? '#0f172a' : '#0369a1'}
                opacity="0.9"
              />
              <path
                d="M 520,260 Q 680,240 820,380 T 640,490 Z"
                fill={spectralMode === 'cir' ? '#1e293b' : '#0284c7'}
                opacity="0.95"
              />
              <polygon points="560,290 640,270 660,330 570,335" fill="#38bdf8" />
            </g>
          )}

          {scenario.id === 'wildfire' && (
            <g>
              <rect width="1000" height="650" fill={spectralMode === 'cir' ? '#881337' : '#14532d'} />
              <path d="M 0,320 Q 320,380 640,290 T 1000,340" stroke="#0284c7" strokeWidth="20" fill="none" />
              <path
                d="M 220,160 Q 460,90 740,180 T 860,420 T 580,560 T 260,480 Z"
                fill={spectralMode === 'cir' ? '#0f172a' : '#1c1917'}
                stroke="#7f1d1d"
                strokeWidth="4"
              />
              <ellipse cx="720" cy="220" rx="90" ry="60" fill={spectralMode === 'cir' ? '#1e293b' : '#292524'} stroke="#dc2626" strokeWidth="2" />
              <circle cx="680" cy="210" r="14" fill="#f97316" opacity="0.6" />
              <circle cx="740" cy="235" r="10" fill="#ef4444" opacity="0.7" />
            </g>
          )}

          {scenario.id === 'coastal' && (
            <g>
              <rect width="1000" height="650" fill="#0f172a" />
              <path d="M 480,0 Q 560,280 510,650 L 1000,650 L 1000,0 Z" fill={spectralMode === 'cir' ? '#020617' : '#075985'} />
              <path d="M 0,0 L 480,0 Q 560,280 510,650 L 0,650 Z" fill={spectralMode === 'cir' ? '#9f1239' : '#15803d'} />
              <path
                d="M 460,140 Q 530,280 470,440 L 410,380 Q 460,260 410,180 Z"
                fill="#78350f"
                stroke="#b45309"
                strokeWidth="2"
              />
              <path d="M 470,220 Q 580,310 500,420" stroke="#38bdf8" strokeWidth="14" fill="none" opacity="0.7" />
            </g>
          )}

          {scenario.id === 'reservoir' && (
            <g>
              <rect width="1000" height="650" fill="#78350f" opacity="0.75" />
              <rect width="1000" height="650" fill="#44403c" opacity="0.45" />
              <path
                d="M 180,140 Q 420,90 680,180 T 820,440 T 560,570 T 240,460 Z"
                fill="#f8fafc"
                stroke="#e2e8f0"
                strokeWidth="3"
              />
              <path
                d="M 280,240 Q 450,210 610,270 T 710,400 T 530,480 T 320,410 Z"
                fill={spectralMode === 'cir' ? '#020617' : '#0284c7'}
              />
            </g>
          )}

          {scenario.id === 'mining' && (
            <g>
              <rect width="1000" height="650" fill="#57534e" />
              <rect width="1000" height="650" fill="#44403c" opacity="0.5" />
              <ellipse cx="380" cy="340" rx="240" ry="160" fill="#292524" stroke="#a8a29e" strokeWidth="4" />
              <ellipse cx="380" cy="340" rx="190" ry="120" fill="none" stroke="#78716c" strokeWidth="2" />
              <ellipse cx="380" cy="340" rx="120" ry="70" fill="none" stroke="#78716c" strokeWidth="2" />
              <ellipse cx="380" cy="340" rx="60" ry="35" fill="#1c1917" />
              <rect x="680" y="180" width="220" height="260" rx="12" fill={spectralMode === 'cir' ? '#0284c7' : '#64748b'} stroke="#475569" strokeWidth="3" />
            </g>
          )}
            </>
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
