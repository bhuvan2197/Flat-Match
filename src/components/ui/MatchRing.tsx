import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MatchRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: 'mint' | 'yellow' | 'pink' | 'blue';
  showLabel?: boolean;
}

export const MatchRing: React.FC<MatchRingProps> = ({
  score,
  size = 72,
  strokeWidth = 6,
  color = 'mint',
  showLabel = true,
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const stepTime = Math.max(10, Math.floor(duration / (score || 1)));
    const timer = setInterval(() => {
      start += 1;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const strokeColors = {
    mint: '#3DDBA5',
    yellow: '#F5C230',
    pink: '#FF5C8D',
    blue: '#45B5F5',
  };

  const ringColor = strokeColors[color] || '#3DDBA5';

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>

      {/* Center percentage */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className="font-heading font-black tracking-tight leading-none text-white"
          style={{ fontSize: size * 0.28 }}
        >
          {displayScore}%
        </span>
        {showLabel && size >= 64 && (
          <span
            className="font-mono text-[9px] uppercase tracking-micro text-muted leading-tight mt-0.5"
            style={{ color: ringColor }}
          >
            MATCH
          </span>
        )}
      </div>
    </div>
  );
};

