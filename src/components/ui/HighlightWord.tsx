import React from 'react';

interface HighlightWordProps {
  children: React.ReactNode;
  color?: 'mint' | 'yellow' | 'pink' | 'blue';
  rotate?: string;
  className?: string;
}

export const HighlightWord: React.FC<HighlightWordProps> = ({
  children,
  color = 'mint',
  rotate = '-1deg',
  className = '',
}) => {
  const bgColors = {
    mint: 'bg-mint text-bg shadow-sm',
    yellow: 'bg-yellow text-bg shadow-sm',
    pink: 'bg-pink text-bg shadow-sm',
    blue: 'bg-blue text-bg shadow-sm',
  };

  return (
    <span
      className={`inline-block px-2.5 py-0.5 mx-1 font-heading font-black tracking-tight rounded-md select-none transition-transform hover:scale-105 ${bgColors[color]} ${className}`}
      style={{ transform: `rotate(${rotate})` }}
    >
      {children}
    </span>
  );
};

