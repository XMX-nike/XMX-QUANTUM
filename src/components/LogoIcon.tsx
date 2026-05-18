import React from 'react';

/**
 * LogoIcon — XMX-QUANTUM Q+X Monogram
 *
 * Design:
 *   - Rounded square container with subtle gradient border + glow
 *   - Bold Q ring arc: radius 32, center (50,50), gap at bottom-right (280°–340°)
 *   - X stroke 1: top-left (28,28) → center (50,50) → tail exit (78,78) (Q tail)
 *   - X stroke 2: top-right (72,28) → bottom-left (28,72)
 *   - Single cyan→purple gradient across the entire mark
 *   - Round stroke caps for premium look
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
  const bgGradId = `qxbg-${size}`;
  const glowId = `qxglow-${size}`;

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
          {/* Main cyan → purple gradient */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#00d4ff" />
            <stop offset="50%"  stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          {/* Background gradient for container */}
          <linearGradient id={bgGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#0a1628" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          {/* Glow filter */}
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Rounded square container */}
        <rect
          x="4" y="4" width="92" height="92" rx="22" ry="22"
          fill={`url(#${bgGradId})`}
          stroke={`url(#${gradId})`}
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/*
          Q Ring Arc
          Center: (50, 50), Radius: 30
          Gap: 280° → 340° (60° gap at bottom-right, where the X tail exits)
          Arc goes from 340° → 280° the long way (300° of arc)

          Arc start point (340°):
            x = 50 + 30·cos(340°) = 50 + 30·0.93969 = 78.191
            y = 50 + 30·sin(340°) = 50 + 30·(−0.34202) = 39.739

          Arc end point (280°):
            x = 50 + 30·cos(280°) = 50 + 30·0.17365 = 55.210
            y = 50 + 30·sin(280°) = 50 + 30·(−0.98481) = 20.456

          SVG arc: large-arc-flag=1, sweep-flag=0 (counter-clockwise)
        */}
        <path
          d="M 78.191 39.739 A 30 30 0 1 0 55.210 20.456"
          stroke={`url(#${gradId})`}
          strokeWidth="8.5"
          strokeLinecap="round"
          fill="none"
          filter={`url(#${glowId})`}
        />

        {/*
          X Stroke 1 — upper-left arm: (28,28) → (50,50)
        */}
        <line
          x1="28" y1="28"
          x2="50" y2="50"
          stroke={`url(#${gradId})`}
          strokeWidth="8.5"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
        />

        {/*
          X Stroke 1 — Q tail: (50,50) → (78,78)
          Extends at 45° through the Q ring gap — this IS the Q's tail
        */}
        <line
          x1="50" y1="50"
          x2="78" y2="78"
          stroke={`url(#${gradId})`}
          strokeWidth="8.5"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
        />

        {/*
          X Stroke 2 — full diagonal: top-right (72,28) → bottom-left (28,72)
        */}
        <line
          x1="72" y1="28"
          x2="28" y2="72"
          stroke={`url(#${gradId})`}
          strokeWidth="8.5"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
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
