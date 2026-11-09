import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ShieldCheck, Coffee, Lock, Check } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: 'chat' | 'verify' | 'meet';
  verifyUnlocked?: boolean;
  meetUnlocked?: boolean;
  onStepClick?: (step: 'chat' | 'verify' | 'meet') => void;
  orientation?: 'vertical' | 'horizontal';
  compact?: boolean;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  verifyUnlocked = true,
  meetUnlocked = false,
  onStepClick,
  orientation = 'vertical',
  compact = false,
}) => {
  const steps = [
    {
      id: 'chat' as const,
      number: '1',
      title: 'CHAT',
      subtitle: 'Vibe check first',
      color: 'blue',
      icon: MessageSquare,
      unlocked: true,
      done: currentStep === 'verify' || currentStep === 'meet',
    },
    {
      id: 'verify' as const,
      number: '2',
      title: 'VERIFY IDs',
      subtitle: "Know who's real",
      color: 'mint',
      icon: ShieldCheck,
      unlocked: verifyUnlocked,
      done: currentStep === 'meet',
    },
    {
      id: 'meet' as const,
      number: '3',
      title: 'MEET FIRST',
      subtitle: 'Before moving in',
      color: 'yellow',
      icon: Coffee,
      unlocked: meetUnlocked,
      done: false,
    },
  ];

  if (orientation === 'horizontal') {
    return (
      <div className="flex items-center justify-between gap-2 w-full">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isDone = step.done;
          const isLocked = !step.unlocked;

          const colorClasses = {
            blue: 'border-blue text-blue bg-blue/10',
            mint: 'border-mint text-mint bg-mint/10',
            yellow: 'border-yellow text-yellow bg-yellow/10',
          }[step.color];

          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => !isLocked && onStepClick && onStepClick(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                  isActive
                    ? `${colorClasses} shadow-sm ring-1 ring-white/10`
                    : isDone
                    ? 'border-mint/50 bg-mint/5 text-mint'
                    : isLocked
                    ? 'border-white/10 bg-white/5 text-muted/60 opacity-60 cursor-not-allowed'
                    : 'border-white/10 bg-surface text-muted hover:border-white/30 cursor-pointer'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    isDone
                      ? 'bg-mint text-bg'
                      : isActive
                      ? step.color === 'blue'
                        ? 'bg-blue text-bg'
                        : step.color === 'mint'
                        ? 'bg-mint text-bg'
                        : 'bg-yellow text-bg'
                      : 'bg-white/10 text-muted'
                  }`}
                >
                  {isDone ? <Check size={12} strokeWidth={3} /> : isLocked ? <Lock size={11} /> : step.number}
                </div>
                {!compact && (
                  <div className="text-left hidden sm:block">
                    <p className="text-[11px] font-mono font-bold uppercase tracking-micro text-white">
                      {step.title}
                    </p>
                    <p className="text-[10px] text-muted leading-tight">{step.subtitle}</p>
                  </div>
                )}
              </div>
              {idx < steps.length - 1 && (
                <div className="h-[2px] flex-1 bg-gradient-to-r from-blue/50 via-mint/50 to-yellow/50 min-w-4" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // Vertical layout (Replicating the video's vertical timeline)
  return (
    <div className="relative pl-6 py-2">
      {/* Gradient connecting line */}
      <div className="absolute left-[34px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-blue via-mint to-yellow" />

      <div className="space-y-6">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isDone = step.done;
          const isLocked = !step.unlocked;

          const colorThemes: Record<string, { activeRing: string; badge: string; highlight: string }> = {
            blue: {
              activeRing: 'border-blue shadow-blue-glow bg-blue/15 text-blue',
              badge: 'bg-blue text-bg',
              highlight: 'text-blue',
            },
            mint: {
              activeRing: 'border-mint shadow-mint-glow bg-mint/15 text-mint',
              badge: 'bg-mint text-bg',
              highlight: 'text-mint',
            },
            yellow: {
              activeRing: 'border-yellow shadow-yellow-glow bg-yellow/15 text-yellow',
              badge: 'bg-yellow text-bg',
              highlight: 'text-yellow',
            },
          };
          const colorTheme = colorThemes[step.color] || colorThemes.mint;

          return (
            <motion.div
              key={step.id}
              whileHover={!isLocked ? { x: 3 } : {}}
              onClick={() => !isLocked && onStepClick && onStepClick(step.id)}
              className={`relative flex items-start gap-4 p-3.5 rounded-2xl border transition-all ${
                isActive
                  ? `${colorTheme.activeRing} ring-1 ring-white/10`
                  : isDone
                  ? 'border-mint/40 bg-surface-2 text-white cursor-pointer'
                  : isLocked
                  ? 'border-white/10 bg-surface/40 text-muted opacity-60 cursor-not-allowed'
                  : 'border-white/10 bg-surface hover:border-white/30 text-white cursor-pointer'
              }`}
            >
              {/* Stepper icon bubble */}
              <div
                className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                  isDone
                    ? 'bg-mint text-bg border-mint'
                    : isActive
                    ? `${colorTheme.badge} border-transparent`
                    : isLocked
                    ? 'bg-surface border-white/15 text-muted'
                    : 'bg-surface border-white/20 text-white'
                }`}
              >
                {isDone ? (
                  <Check size={18} strokeWidth={3} />
                ) : isLocked ? (
                  <Lock size={15} />
                ) : (
                  <Icon size={18} strokeWidth={2} />
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted uppercase">STEP {step.number}</span>
                    <h4 className="font-heading font-black text-sm tracking-tight uppercase text-white">
                      {step.title}
                    </h4>
                  </div>
                  {isDone ? (
                    <span className="text-[10px] font-mono text-mint uppercase px-2 py-0.5 rounded-full bg-mint/10 border border-mint/30">
                      COMPLETED
                    </span>
                  ) : isActive ? (
                    <span className="text-[10px] font-mono text-white uppercase px-2 py-0.5 rounded-full bg-white/10 border border-white/20 animate-pulse">
                      ACTIVE NOW
                    </span>
                  ) : isLocked ? (
                    <span className="text-[10px] font-mono text-muted uppercase">
                      LOCKED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-muted uppercase">
                      READY
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted mt-0.5">{step.subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
