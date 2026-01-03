import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface BrutalButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export default function BrutalButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}: BrutalButtonProps) {
  const variants = {
    primary: 'bg-electricBlue text-white',
    secondary: 'bg-white text-black',
    warning: 'bg-highvisYellow text-black',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        brutal-border brutal-shadow
        font-bold uppercase
        transition-none
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileTap={
        !disabled
          ? {
              x: 2,
              y: 2,
              boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)',
            }
          : {}
      }
      whileHover={
        !disabled
          ? {
              x: -2,
              y: -2,
              boxShadow: '10px 10px 0px 0px rgba(0,0,0,1)',
            }
          : {}
      }
    >
      {children}
    </motion.button>
  );
}
