import React from 'react';

interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  color?: 'mint' | 'yellow' | 'blue' | 'pink' | 'neutral';
  variant?: 'outline' | 'filled' | 'tint';
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  color = 'mint',
  variant = 'outline',
  size = 'sm',
  className = '',
  onClick,
}) => {
  const borderColors = {
    mint: 'border-mint/60 text-mint',
    yellow: 'border-yellow/60 text-yellow',
    blue: 'border-blue/60 text-blue',
    pink: 'border-pink/60 text-pink',
    neutral: 'border-white/15 text-muted',
  };

  const fillColors = {
    mint: 'bg-mint text-bg font-bold',
    yellow: 'bg-yellow text-bg font-bold',
    blue: 'bg-blue text-bg font-bold',
    pink: 'bg-pink text-bg font-bold',
    neutral: 'bg-white/10 text-white',
  };

  const tintColors = {
    mint: 'bg-mint/10 border border-mint/40 text-mint',
    yellow: 'bg-yellow/10 border border-yellow/40 text-yellow',
    blue: 'bg-blue/10 border border-blue/40 text-blue',
    pink: 'bg-pink/10 border border-pink/40 text-pink',
    neutral: 'bg-white/5 border border-white/15 text-white/80',
  };

  const styleClass =
    variant === 'filled'
      ? fillColors[color]
      : variant === 'tint'
      ? tintColors[color]
      : `border bg-surface/50 backdrop-blur-sm ${borderColors[color]}`;

  const sizeClass =
    size === 'sm'
      ? 'px-2.5 py-1 text-[10px] gap-1.5'
      : 'px-3.5 py-1.5 text-xs gap-2';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full font-mono uppercase tracking-micro select-none whitespace-nowrap transition-all ${styleClass} ${sizeClass} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};

