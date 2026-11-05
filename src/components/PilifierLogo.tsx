import React from 'react';

interface PilifierLogoProps {
  className?: string;
  size?: number;
}

export const PilifierLogo: React.FC<PilifierLogoProps> = ({ className = '', size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Pili Nut stylized botanical spindle shape */}
      <path
        d="M16 2.5C11 8 6 15 6 21.5C6 26.5 10.5 29.5 16 29.5C21.5 29.5 26 26.5 26 21.5C26 15 21 8 16 2.5Z"
        fill="#174D35"
      />
      {/* Nut shell facet spine */}
      <path
        d="M16 3C16 3 13 14 13 22C13 26 14.5 28.5 16 29.5C17.5 28.5 19 26 19 22C19 14 16 3 16 3Z"
        fill="#2F7D50"
      />
      {/* Golden Kernel Light Accent */}
      <path
        d="M16 7C14.5 11 13.5 16 14 20C14.2 21.5 15.2 23.5 16 24C16 24 15 17 16 7Z"
        fill="#D8A84E"
      />
      {/* Subtle seed tip highlight */}
      <circle cx="16" cy="4" r="1.5" fill="#D8A84E" />
    </svg>
  );
};
