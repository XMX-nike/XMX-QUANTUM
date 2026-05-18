import React from 'react';

interface XQLogoProps {
  size?: number;
  showWordmark?: boolean;
  wordmarkSize?: string;
  wordmarkColor?: string;
  subtitle?: string;
  subtitleColor?: string;
  gap?: string;
  direction?: 'row' | 'column';
}

/**
 * XQ Logo — the canonical XMX-QUANTUM brand mark.
 * Use this component everywhere: auth pages, sidebar, landing nav, footer, headers.
 */
const XQLogo: React.FC<XQLogoProps> = ({
  size = 40,
  showWordmark = false,
  wordmarkSize = '1rem',
  wordmarkColor = '#f0f0ff',
  subtitle,
  subtitleColor = '#94a3b8',
  gap = '0.6rem',
  direction = 'row',
}) => {
  const radius = Math.round(size * 0.22);

  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: direction,
      alignItems: direction === 'row' ? 'center' : 'center',
      gap,
    }}>
      {/* XQ blue rounded-square icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-label="XMX-QUANTUM logo"
      >
        <defs>
          <linearGradient id="xq-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx={radius} fill="url(#xq-grad)" />
        <text
          x="20"
          y="26"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="14"
          fontWeight="800"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="-0.5"
        >
          XQ
        </text>
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          <span style={{
            fontWeight: 800,
            fontSize: wordmarkSize,
            color: wordmarkColor,
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}>
            XMX-QUANTUM
          </span>
          {subtitle && (
            <span style={{
              fontSize: `calc(${wordmarkSize} * 0.72)`,
              color: subtitleColor,
              fontWeight: 500,
              lineHeight: 1.2,
            }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default XQLogo;
