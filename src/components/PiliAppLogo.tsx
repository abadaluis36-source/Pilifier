import React from 'react';

interface PiliAppLogoProps {
  size?: number;
  className?: string;
  withGlow?: boolean;
}

export const PiliAppLogo: React.FC<PiliAppLogoProps> = ({
  size = 72,
  className = '',
  withGlow = true,
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center select-none ${className}`}
      aria-hidden="true"
    >
      {/* Ambient Radial Backlight Glow */}
      {withGlow && (
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-orange-500/20 blur-xl scale-125 pointer-events-none"
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
      >
        {/* Main Botanical Leaf Frame - Gradient Orange to Gold */}
        <path
          d="M50 10 C74 10, 86 26, 78 54 C71 76, 52 84, 34 84 C23 84, 17 77, 19 64 C22 47, 31 18, 50 10 Z"
          stroke="url(#leafGradientStroke)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />

        {/* Delicate Internal Leaf Ribs */}
        <path
          d="M34 68 C44 54, 56 41, 70 30"
          stroke="url(#leafGradientStroke)"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.95"
        />
        <path
          d="M44 52 C54 50, 64 54, 71 57"
          stroke="url(#leafGradientStroke)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M40 62 C47 63, 55 67, 60 72"
          stroke="url(#leafGradientStroke)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Central Sprout Spiral Swirl (Crisp Sky Tint) */}
        <path
          d="M48 64 C42 66, 37 63, 39 57 C41 51, 53 49, 58 55 C62 61, 55 70, 46 70"
          stroke="#BAE6FD"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Organic Fresh Green Seedling Leaf */}
        <path
          d="M51 67 C62 63, 76 67, 78 78 C70 82, 57 78, 51 67 Z"
          fill="url(#seedlingFill)"
          stroke="#65A30D"
          strokeWidth="2.2"
        />
        <path
          d="M56 71 C64 72, 70 75, 75 78"
          stroke="#365314"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Sparkle highlight at leaf apex */}
        <circle cx="50" cy="10" r="2.5" fill="#FEF08A" />

        {/* Gradients */}
        <defs>
          <linearGradient
            id="leafGradientStroke"
            x1="18"
            y1="82"
            x2="78"
            y2="12"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="45%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>

          <linearGradient
            id="seedlingFill"
            x1="52"
            y1="67"
            x2="78"
            y2="80"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#A3E635" />
            <stop offset="100%" stopColor="#65A30D" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
