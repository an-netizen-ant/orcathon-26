import React from 'react';

/**
 * SatelliteScene Component
 * Renders multispectral satellite imagery for all 8 verified earth observation case studies.
 * Supports Before/After states, spectral modes, thumbnail mode, and change-mask overlay.
 */

// ── Outer SVG wrapper — declared outside of SatelliteScene to avoid lint warning ──
function SceneSvg({ children, viewBox = '0 0 1000 650', className, showMask, maskOpacity }) {
  return (
    <div className="relative w-full h-full">
      <svg
        viewBox={viewBox}
        className={`w-full h-full select-none ${className || ''}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
      {showMask && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{ opacity: Math.max(0, Math.min(1, maskOpacity * 0.5)) }}
        >
          <div className="absolute rounded" style={{ left: '16%', top: '18%', width: '28%', height: '34%', background: 'rgba(239,68,68,0.55)' }} />
          <div className="absolute rounded" style={{ left: '50%', top: '12%', width: '24%', height: '32%', background: 'rgba(245,158,11,0.45)' }} />
          <div className="absolute rounded" style={{ left: '60%', top: '52%', width: '26%', height: '34%', background: 'rgba(239,68,68,0.4)' }} />
        </div>
      )}
    </div>
  );
}

export function SatelliteScene({
  scenarioId,
  isAfter,
  spectralMode = 'rgb',
  comparisonMode = 'swipe',
  className = '',
  thumbnail = false,
  showChangeMask = false,
  changeMaskOpacity = 0.85,
}) {
  const uid = `${scenarioId}-${isAfter ? 'a' : 'b'}-${thumbnail ? 't' : 'f'}`;
  const isDiff = comparisonMode === 'difference' || spectralMode === 'diff';
  const isCir = spectralMode === 'cir';
  const showMask = showChangeMask && isAfter;

  const wrapperProps = {
    className,
    showMask,
    maskOpacity: changeMaskOpacity,
  };

  // ── 1. AMAZON DEFORESTATION ──────────────────────────────────────────────
  if (scenarioId === 'amazon') {
    const forestBg = isDiff ? '#0f172a' : isCir ? '#9f1239' : '#14381e';
    const forestEnd = isDiff ? '#090d16' : isCir ? '#881337' : '#0d2814';
    const soilA = isDiff ? '#f59e0b' : isCir ? '#67e8f9' : '#c27847';
    const soilB = isDiff ? '#ef4444' : isCir ? '#22d3ee' : '#9a5328';
    const burnFill = isDiff ? '#ef4444' : '#1c1917';
    return (
      <SceneSvg {...wrapperProps}>
        <defs>
          <linearGradient id={`${uid}-riv`} x1="0%" y1="20%" x2="100%" y2="80%">
            <stop offset="0%" stopColor={isCir ? '#071526' : '#2b4c6f'} />
            <stop offset="100%" stopColor={isCir ? '#02070d' : '#172b40'} />
          </linearGradient>
          <linearGradient id={`${uid}-for`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={forestBg} />
            <stop offset="100%" stopColor={forestEnd} />
          </linearGradient>
          <linearGradient id={`${uid}-sol`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={soilA} />
            <stop offset="100%" stopColor={soilB} />
          </linearGradient>
        </defs>
        <rect width="1000" height="650" fill={`url(#${uid}-for)`} />
        <path d="M -20,240 Q 150,190 280,260 T 520,220 T 780,290 T 1040,210 L 1040,265 Q 780,345 520,275 T 280,315 T -20,295 Z"
          fill={isDiff ? '#1e293b' : `url(#${uid}-riv)`} opacity="0.9" />
        {isAfter && (
          <g>
            <path d="M 120,40 L 460,400" stroke={isDiff ? '#00FFA3' : '#d97706'} strokeWidth="9" strokeLinecap="round" />
            <g stroke={`url(#${uid}-sol)`} strokeWidth="18" strokeLinecap="square" opacity="0.95">
              <line x1="160" y1="90" x2="270" y2="60" />
              <line x1="190" y1="120" x2="310" y2="85" />
              <line x1="225" y1="155" x2="350" y2="120" />
              <line x1="260" y1="190" x2="385" y2="155" />
              <line x1="290" y1="225" x2="415" y2="190" />
            </g>
            <polygon points="170,120 320,80 370,170 230,220" fill={`url(#${uid}-sol)`} />
            <polygon points="510,70 680,60 710,180 540,200" fill={`url(#${uid}-sol)`} />
            <polygon points="610,340 850,330 890,520 640,540" fill={burnFill} />
          </g>
        )}
      </SceneSvg>
    );
  }

  // ── 2. DUBAI URBAN EXPANSION ─────────────────────────────────────────────
  if (scenarioId === 'dubai') {
    const seaA = isDiff ? '#090d16' : '#0e7490';
    const seaB = isDiff ? '#020409' : '#164e63';
    const sandA = isDiff ? '#00E5FF' : '#fef3c7';
    const sandB = isDiff ? '#00FFA3' : '#fde68a';
    return (
      <SceneSvg {...wrapperProps}>
        <defs>
          <linearGradient id={`${uid}-sea`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={seaA} />
            <stop offset="100%" stopColor={seaB} />
          </linearGradient>
          <linearGradient id={`${uid}-snd`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={sandA} />
            <stop offset="100%" stopColor={sandB} />
          </linearGradient>
        </defs>
        <rect width="1000" height="650" fill={`url(#${uid}-sea)`} />
        <path d="M 0,420 Q 250,460 500,430 T 1000,470 L 1000,650 L 0,650 Z" fill={isDiff ? '#1e293b' : '#ca9b5a'} />
        {isAfter && (
          <g>
            <polygon points="640,110 880,90 850,330 610,350" fill={isDiff ? '#0284c7' : '#082f49'} />
            <path d="M 330,440 L 330,170 Q 330,130 380,130 Q 430,130 430,170 L 430,440 Z"
              fill={`url(#${uid}-snd)`} stroke="#b45309" strokeWidth="2" />
            <g fill={`url(#${uid}-snd)`} stroke="#92400e" strokeWidth="1.5">
              <rect x="230" y="160" width="100" height="24" rx="4" />
              <rect x="430" y="160" width="100" height="24" rx="4" />
              <rect x="210" y="210" width="120" height="26" rx="4" />
              <rect x="430" y="210" width="120" height="26" rx="4" />
            </g>
            <path d="M 170,300 C 140,110 380,50 560,90 C 620,110 650,150 660,190"
              fill="none" stroke={`url(#${uid}-snd)`} strokeWidth="22" strokeLinecap="round" />
          </g>
        )}
      </SceneSvg>
    );
  }

  // ── 3. ALPINE GLACIER RETREAT ────────────────────────────────────────────
  if (scenarioId === 'glacier') {
    return (
      <SceneSvg {...wrapperProps}>
        <defs>
          <linearGradient id={`${uid}-pk`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id={`${uid}-ic`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
        </defs>
        <rect width="1000" height="650" fill={`url(#${uid}-pk)`} />
        {!isAfter ? (
          <path d="M 330,40 Q 500,20 670,40 L 650,220 Q 610,380 580,510 Q 500,560 420,510 Q 380,380 345,220 Z"
            fill={`url(#${uid}-ic)`} stroke="#bae6fd" strokeWidth="3" />
        ) : (
          <g>
            <path d="M 340,40 Q 500,20 660,40 L 640,160 Q 590,220 500,230 Q 410,220 355,160 Z"
              fill={`url(#${uid}-ic)`} stroke="#7dd3fc" strokeWidth="2" />
            <polygon points="355,160 500,230 640,160 660,390 590,440 400,440 330,390"
              fill={isDiff ? '#ef4444' : '#52525b'} />
            <path d="M 350,440 Q 500,410 640,440 Q 660,540 570,590 Q 490,610 420,590 Q 330,540 350,440 Z"
              fill={isDiff ? '#00E5FF' : '#22d3ee'} />
          </g>
        )}
      </SceneSvg>
    );
  }

  // ── 4. FLOOD IMPACT ──────────────────────────────────────────────────────
  if (scenarioId === 'flood') {
    const gridLines = [200, 400, 600, 800];
    const hLines = [160, 320, 480];
    return (
      <SceneSvg {...wrapperProps}>
        <rect width="1000" height="650" fill="#78350f" opacity="0.8" />
        <g stroke="#854d0e" strokeWidth="1" opacity="0.35">
          {gridLines.map((x) => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="650" />)}
          {hLines.map((y) => <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y} />)}
        </g>
        <path d="M 450,0 Q 530,280 480,450 T 520,650" stroke="#0284c7" strokeWidth="28" fill="none" />
        {isAfter && (
          <g>
            <path d="M 160,180 Q 380,120 620,190 T 880,320 T 750,560 T 320,580 T 140,360 Z"
              fill={isDiff ? '#00E5FF' : '#0369a1'} opacity="0.88" />
            <path d="M 520,260 Q 680,240 820,380 T 640,490 Z"
              fill={isDiff ? '#00FFA3' : '#0284c7'} opacity="0.9" />
          </g>
        )}
      </SceneSvg>
    );
  }

  // ── 5. WILDFIRE AFTERMATH ────────────────────────────────────────────────
  if (scenarioId === 'wildfire') {
    return (
      <SceneSvg {...wrapperProps}>
        <rect width="1000" height="650" fill="#14532d" />
        <path d="M 0,320 Q 320,380 640,290 T 1000,340" stroke="#0284c7" strokeWidth="18" fill="none" />
        {isAfter && (
          <g>
            <path d="M 220,160 Q 460,90 740,180 T 860,420 T 580,560 T 260,480 Z"
              fill={isDiff ? '#ef4444' : '#1c1917'} stroke="#7f1d1d" strokeWidth="3" />
            <ellipse cx="720" cy="220" rx="90" ry="60" fill={isDiff ? '#f59e0b' : '#292524'} />
          </g>
        )}
      </SceneSvg>
    );
  }

  // ── 6. COASTAL EROSION ───────────────────────────────────────────────────
  if (scenarioId === 'coastal') {
    return (
      <SceneSvg {...wrapperProps}>
        <rect width="1000" height="650" fill="#0f172a" />
        <path d="M 480,0 Q 560,280 510,650 L 1000,650 L 1000,0 Z" fill="#075985" />
        <path d="M 0,0 L 480,0 Q 560,280 510,650 L 0,650 Z" fill="#15803d" />
        {isAfter && (
          <g>
            <path d="M 460,140 Q 530,280 470,440 L 410,380 Q 460,260 410,180 Z"
              fill={isDiff ? '#f59e0b' : '#78350f'} />
            <path d="M 470,220 Q 580,310 500,420"
              stroke={isDiff ? '#00E5FF' : '#ca8a04'} strokeWidth="12" fill="none" />
          </g>
        )}
      </SceneSvg>
    );
  }

  // ── 7. RESERVOIR WATER LOSS ──────────────────────────────────────────────
  if (scenarioId === 'reservoir') {
    return (
      <SceneSvg {...wrapperProps}>
        <rect width="1000" height="650" fill="#78350f" opacity="0.7" />
        <rect width="1000" height="650" fill="#44403c" opacity="0.4" />
        {!isAfter ? (
          <path d="M 180,140 Q 420,90 680,180 T 820,440 T 560,570 T 240,460 Z"
            fill="#0369a1" stroke="#38bdf8" strokeWidth="3" />
        ) : (
          <g>
            <path d="M 180,140 Q 420,90 680,180 T 820,440 T 560,570 T 240,460 Z"
              fill={isDiff ? '#f59e0b' : '#f8fafc'} stroke="#e2e8f0" strokeWidth="2" />
            <path d="M 280,240 Q 450,210 610,270 T 710,400 T 530,480 T 320,410 Z"
              fill="#0284c7" />
          </g>
        )}
      </SceneSvg>
    );
  }

  // ── 8. MINING EXPANSION (default / fallback) ─────────────────────────────
  return (
    <SceneSvg {...wrapperProps}>
      <rect width="1000" height="650" fill="#57534e" />
      <rect width="1000" height="650" fill="#44403c" opacity="0.5" />
      <ellipse cx="380" cy="340" rx="140" ry="90" fill="#44403c" stroke="#78716c" strokeWidth="2" />
      {isAfter && (
        <g>
          <ellipse cx="380" cy="340" rx="240" ry="160"
            fill={isDiff ? '#f59e0b' : '#292524'}
            stroke={isDiff ? '#00FFA3' : '#a8a29e'} strokeWidth="4" />
          <ellipse cx="380" cy="340" rx="190" ry="120" fill="none" stroke="#78716c" strokeWidth="2" />
          <ellipse cx="380" cy="340" rx="120" ry="70" fill="none" stroke="#78716c" strokeWidth="2" />
          <ellipse cx="380" cy="340" rx="60" ry="35" fill="#1c1917" />
          <rect x="680" y="180" width="220" height="260" rx="12"
            fill={isDiff ? '#00E5FF' : '#64748b'} stroke="#475569" strokeWidth="3" />
        </g>
      )}
    </SceneSvg>
  );
}
