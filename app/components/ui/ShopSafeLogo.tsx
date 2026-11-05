import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'white';
  height?: number | string;
}

export default function ShopSafeLogo({ className = '', variant = 'full', height = 28 }: LogoProps) {
  const isWhite = variant === 'white';
  const textColor = isWhite ? '#FFFFFF' : '#031435';
  const taglineColor = isWhite ? '#E2E8F0' : '#031435';
  const cartColor = isWhite ? '#FFFFFF' : '#031435';
  const orangeColor = '#FA3728';

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 150 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height, width: 'auto' }}
        className={`shrink-0 ${className}`}
        aria-label="ShopSafeNG"
      >
        {/* Speed lines */}
        <rect x="5" y="52" width="34" height="9" rx="4.5" fill={orangeColor} />
        <rect x="15" y="67" width="28" height="9" rx="4.5" fill={orangeColor} />

        {/* Shield */}
        <path
          d="M 75 24 Q 92 18 110 24 Q 118 48 116 66 C 112 84 94 96 92.5 98 C 91 96 73 84 69 66 C 67 48 75 24 75 24 Z"
          fill={orangeColor}
        />
        {/* Checkmark */}
        <path
          d="M 81 58 L 89 66 L 105 48"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cart frame */}
        <path
          d="M 22 38 C 30 38 33 40 36 47 L 44 70 C 48 84 60 93 75 94 C 94 95 109 86 117 71 C 113 84 99 101 74 101 C 53 101 39 90 34 75 L 28 52 L 22 52 C 18.5 52 16 49.5 16 46 C 16 41.5 18.5 38 22 38 Z"
          fill={cartColor}
        />

        {/* Wheels */}
        <circle cx="55" cy="115" r="10.5" fill={cartColor} />
        <circle cx="96" cy="115" r="10.5" fill={cartColor} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 420 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height, width: 'auto' }}
      className={`shrink-0 ${className}`}
      aria-label="ShopSafeNG"
    >
      {/* Cart Icon */}
      <g transform="translate(5, 5) scale(0.68)">
        {/* Speed lines */}
        <rect x="15" y="52" width="34" height="9" rx="4.5" fill={orangeColor} />
        <rect x="25" y="67" width="28" height="9" rx="4.5" fill={orangeColor} />

        {/* Shield */}
        <path
          d="M 85 24 Q 102 18 120 24 Q 128 48 126 66 C 122 84 104 96 102.5 98 C 101 96 83 84 79 66 C 77 48 85 24 85 24 Z"
          fill={orangeColor}
        />
        {/* Checkmark */}
        <path
          d="M 91 58 L 99 66 L 115 48"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cart frame */}
        <path
          d="M 32 38 C 40 38 43 40 46 47 L 54 70 C 58 84 70 93 85 94 C 104 95 119 86 127 71 C 123 84 109 101 84 101 C 63 101 49 90 44 75 L 38 52 L 32 52 C 28.5 52 26 49.5 26 46 C 26 41.5 28.5 38 32 38 Z"
          fill={cartColor}
        />

        {/* Wheels */}
        <circle cx="65" cy="115" r="10.5" fill={cartColor} />
        <circle cx="106" cy="115" r="10.5" fill={cartColor} />
      </g>

      {/* Brand Name Text: ShopSafeNG */}
      <text
        x="110"
        y="62"
        fontFamily="var(--font-jakarta), system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="39"
        letterSpacing="-0.5px"
      >
        <tspan fill={textColor}>ShopSafe</tspan>
        <tspan fill={orangeColor}>NG</tspan>
      </text>

      {/* Tagline: Shop n Get. */}
      <text
        x="112"
        y="84"
        fontFamily="var(--font-jakarta), system-ui, -apple-system, sans-serif"
        fontWeight="600"
        fontSize="14.5"
        fill={taglineColor}
        letterSpacing="0.2px"
      >
        Shop n Get.
      </text>
    </svg>
  );
}

