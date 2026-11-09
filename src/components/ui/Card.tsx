import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  color?: 'mint' | 'yellow' | 'blue' | 'pink' | 'neutral';
  selected?: boolean;
  interactive?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  color = 'neutral',
  selected = false,
  interactive = false,
  glow = false,
  padding = 'md',
  className = '',
  ...props
}) => {
  const borderColors = {
    mint: 'border-mint/50',
    yellow: 'border-yellow/50',
    blue: 'border-blue/50',
    pink: 'border-pink/50',
    neutral: 'border-line',
  };

  const glows = {
    mint: 'shadow-mint-glow',
    yellow: 'shadow-yellow-glow',
    blue: 'shadow-blue-glow',
    pink: 'shadow-pink-glow',
    neutral: 'shadow-lg',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-8',
  };

  const selectedClasses = selected
    ? `bg-surface-2 ${borderColors[color]} ${glows[color]}`
    : `bg-surface ${borderColors[color]}`;

  return (
    <motion.div
      whileHover={interactive ? { y: -2 } : {}}
      className={`rounded-2xl border transition-all ${selectedClasses} ${
        glow ? glows[color] : ''
      } ${interactive ? 'cursor-pointer hover:border-white/30' : ''} ${
        paddings[padding]
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

