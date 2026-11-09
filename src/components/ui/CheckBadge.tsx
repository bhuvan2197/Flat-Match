import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface CheckBadgeProps {
  color?: 'mint' | 'yellow' | 'blue' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  checked?: boolean;
}

export const CheckBadge: React.FC<CheckBadgeProps> = ({
  color = 'mint',
  size = 'md',
  checked = true,
}) => {
  const colorMap = {
    mint: 'bg-mint text-bg shadow-mint-glow',
    yellow: 'bg-yellow text-bg shadow-yellow-glow',
    blue: 'bg-blue text-bg shadow-blue-glow',
    pink: 'bg-pink text-bg shadow-pink-glow',
  };

  const sizeMap = {
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-6 h-6 text-xs',
    lg: 'w-8 h-8 text-sm',
  };

  const iconSizes = {
    sm: 10,
    md: 14,
    lg: 18,
  };

  if (!checked) {
    return (
      <div
        className={`rounded-full border border-white/20 bg-white/5 flex items-center justify-center ${sizeMap[size]}`}
      />
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      className={`rounded-full flex items-center justify-center font-bold font-mono transition-transform ${colorMap[color]} ${sizeMap[size]}`}
    >
      <Check strokeWidth={3} size={iconSizes[size]} />
    </motion.div>
  );
};

