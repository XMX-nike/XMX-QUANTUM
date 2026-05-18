import React from 'react';

/**
 * LogoIcon — XMX-QUANTUM Q+X Monogram
 *
 * Design (no container box):
 *   - Bare Q+X mark sitting directly on the page background
 *   - Bold Q ring arc: radius 32, center (50,50), gap at bottom-right (280°–340°)
 *   - X stroke 1: top-left (28,28) → center (50,50) → tail exit (78,78) (Q tail)
 *   - X stroke 2: top-right (72,28) → bottom-left (28,72)
 *   - Cyan→purple gradient, round stroke caps
 *   - No background rect, no border box
 */

interface LogoIconProps {
  /** Icon size in px. Default: 32 */
  size?: number;
  /** Show "XMX-QUANTUM" wordmark to the right. Default: false */
  showWordmark?: boolean;
  /** Wordmark font size in px. Default: size * 0.5 */
  wordmarkSize?: number;
  /** Wordmark text color. Default: 'white' */
  wordmarkColor?: string;
  /** Show "by Quaxix Technologies" subtitle. Default: false */
  showSubtitle?: boolean;
  /** Subtitle color. Default: '#94a3b8' */
  subtitleColor?: string;
  /** Gap between icon and wordmark in px. Default: 8 */
  gap?: number;
  className?: string;
  style?: React.CSSProperties;
}

const LogoIcon: React.FC<LogoIconProps> = ({
  size = 32,
  showWordmark = false,
  wordmarkSize,
  wordmarkColor = 'white',
  showSubtitle = false,
  subtitleColor = '#94a3b8',
  gap = 8,
  className,
  style,
}) => {
  const wm = wordmarkSize ?? Math.round(size * 0.5);
  // Use a unique gradient ID per size to avoid conflicts when multiple instances render
  const gradId = `qxg-${size}`;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: showWordmark ? gap : 0,
        flexShrink: 0,
        ...style,
      }}
    >
      {/* ── Q+X SVG Mark (no container box) ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="XMX-QUANTUM logo"
        style={{ flexShrink: 0, display: 'block' }}
      >
        <defs>
          {/* Cyan top-left → purple bottom-right */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#00d4ff" />
            <stop offset="50%"  stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/*
          Q Ring Arc
          Center: (50, 50), Radius: 34
          Gap: 280° → 340° (60° gap at bottom-right, where the X tail exits)
          Arc goes from 340° → 280° the long way (300° of arc)

          Arc start point (340°):
            x = 50 + 34·cos(340°) = 50 + 34·0.93969 = 81.950
            y = 50 + 34·sin(340°) = 50 + 34·(−0.34202) = 38.371

          Arc end point (280°):
            x = 50 + 34·cos(280°) = 50 + 34·0.17365 = 55.904
            y = 50 + 34·sin(280°) = 50 + 34·(−0.98481) = 16.516

          SVG arc: large-arc-flag=1, sweep-flag=0 (counter-clockwise)
        */}
        <path
          d="M 81.950 38.371 A 34 34 0 1 0 55.904 16.516"
          stroke={`url(#${gradId})`}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />

        {/* X upper-left arm: (26,26) → (50,50) */}
        <line
          x1="26" y1="26"
          x2="50" y2="50"
          stroke={`url(#${gradId})`}
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* X tail (Q tail through gap): (50,50) → (78,78) */}
        <line
          x1="50" y1="50"
          x2="78" y2="78"
          stroke={`url(#${gradId})`}
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* X second diagonal: top-right (74,26) → bottom-left (26,74) */}
        <line
          x1="74" y1="26"
          x2="26" y2="74"
          stroke={`url(#${gradId})`}
          strokeWidth="9"
          strokeLinecap="round"
        />
      </svg>

      {/* ── Wordmark ── */}
      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span
            style={{
              fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: wm,
              color: wordmarkColor,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
            }}
          >
            XMX-QUANTUM
          </span>
          {showSubtitle && (
            <span
              style={{
                fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
                fontWeight: 500,
                fontSize: Math.max(9, Math.round(wm * 0.6)),
                color: subtitleColor,
                letterSpacing: '0.05em',
                textTransform: 'uppercase' as const,
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              by Quaxix Technologies
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LogoIcon;
