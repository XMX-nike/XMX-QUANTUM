import React from 'react';

/**
 * LogoIcon — XMX-QUANTUM Q+X Monogram
 *
 * Geometry (viewBox 0 0 100 100):
 *   - Bold Q ring arc: radius 36, center (50,50), gap at bottom-right (290°–340°)
 *   - X stroke 1: top-left (30,30) → center (50,50) → tail exit (77.73,77.73)
 *     The tail exits through the Q ring gap — this IS the Q tail
 *   - X stroke 2: top-right (70,30) → bottom-left (30,70)
 *   - Single cyan→purple gradient across the entire mark
 *   - Square stroke caps for sharp geometric edges
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
      {/* ── Q+X SVG Mark ── */}
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
            <stop offset="45%"  stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/*
          Q Ring Arc
          Center: (50, 50), Radius: 36
          Gap: 290° → 340° (50° gap at bottom-right, where the X tail exits)
          Arc goes from 340° → 290° the long way (310° of arc)

          Arc start point (340°):
            x = 50 + 36·cos(340°) = 50 + 36·0.93969 = 83.829
            y = 50 + 36·sin(340°) = 50 + 36·(−0.34202) = 37.687

          Arc end point (290°):
            x = 50 + 36·cos(290°) = 50 + 36·0.34202 = 62.313
            y = 50 + 36·sin(290°) = 50 + 36·(−0.93969) = 16.171

          SVG arc: large-arc-flag=1, sweep-flag=0 (counter-clockwise)
        */}
        <path
          d="M 83.829 37.687 A 36 36 0 1 0 62.313 16.171"
          stroke={`url(#${gradId})`}
          strokeWidth="9"
          strokeLinecap="square"
          fill="none"
        />

        {/*
          X Stroke 1 — top-left arm: (30,30) → (50,50)
          This is the upper-left arm of the X
        */}
        <line
          x1="30" y1="30"
          x2="50" y2="50"
          stroke={`url(#${gradId})`}
          strokeWidth="9"
          strokeLinecap="square"
        />

        {/*
          X Stroke 1 — tail (Q tail): (50,50) → (77.73,77.73)
          Extends at 45° through the Q ring gap — this IS the Q's tail
          77.73 = 50 + 27.73 where 27.73 ≈ 18px extension beyond the ring
        */}
        <line
          x1="50"    y1="50"
          x2="77.73" y2="77.73"
          stroke={`url(#${gradId})`}
          strokeWidth="9"
          strokeLinecap="square"
        />

        {/*
          X Stroke 2 — full diagonal: top-right (70,30) → bottom-left (30,70)
        */}
        <line
          x1="70" y1="30"
          x2="30" y2="70"
          stroke={`url(#${gradId})`}
          strokeWidth="9"
          strokeLinecap="square"
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
