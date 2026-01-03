import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface BrutalCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function BrutalCard({
  children,
  className = '',
  hover = false,
  onClick,
}: BrutalCardProps) {
  const MotionWrapper = hover || onClick ? motion.div : 'div';

  const motionProps =
    hover || onClick
      ? {
          whileHover: {
            x: -2,
            y: -2,
            boxShadow: '10px 10px 0px 0px rgba(0,0,0,1)',
          },
          whileTap: onClick
            ? {
                x: 2,
                y: 2,
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
              }
            : undefined,
        }
      : {};

  return (
    <MotionWrapper
      className={`
        bg-white brutal-border brutal-shadow
        p-6
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </MotionWrapper>
  );
}
