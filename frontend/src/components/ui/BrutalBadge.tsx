import type { ReactNode } from 'react';

interface BrutalBadgeProps {
  children: ReactNode;
  variant?: 'yellow' | 'blue' | 'pink' | 'white';
  className?: string;
}

export default function BrutalBadge({
  children,
  variant = 'yellow',
  className = '',
}: BrutalBadgeProps) {
  const variants = {
    yellow: 'bg-highvisYellow text-black',
    blue: 'bg-electricBlue text-white',
    pink: 'bg-cyberPink text-white',
    white: 'bg-white text-black',
  };

  return (
    <span
      className={`
        inline-block px-3 py-1
        border-2 border-black
        font-bold text-sm uppercase
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
