import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  User,
  ShieldCheck,
  Building,
  Heart,
  X,
  Star,
  MapPin,
  Clock,
  Sparkles,
  Cigarette,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { Profile, MatchResult } from '../../types';
import { MatchRing } from '../../components/ui/MatchRing';
import { Chip } from '../../components/ui/Chip';

interface ProfileCardProps {
  profile: Profile;
  matchResult: MatchResult;
  onPass?: () => void;
  onShortlist?: () => void;
  onSuperLike?: () => void;
  onClickDetail?: () => void;
  isDraggable?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  matchResult,
  onPass,
  onShortlist,
  onSuperLike,
  onClickDetail,
  isDraggable = false,
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const opacityPass = useTransform(x, [-120, -30], [1, 0]);
  const opacityLike = useTransform(x, [30, 120], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100 && onShortlist) {
      onShortlist();
    } else if (info.offset.x < -100 && onPass) {
      onPass();
    }
  };

  return (
    <motion.div
      style={isDraggable ? { x, rotate } : {}}
      drag={isDraggable ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileHover={{ y: -3 }}
      className="relative w-full rounded-3xl border border-white/15 bg-surface p-5 sm:p-6 shadow-2xl overflow-hidden transition-all select-none"
    >
      {/* Draggable feedback stamps */}
      {isDraggable && (
        <>
          <motion.div
            style={{ opacity: opacityPass }}
            className="absolute top-6 right-6 z-20 px-3 py-1 rounded-xl border-2 border-pink text-pink font-heading font-black text-sm uppercase -rotate-12 bg-surface/90 pointer-events-none"
          >
            PASS
          </motion.div>
          <motion.div
            style={{ opacity: opacityLike }}
            className="absolute top-6 left-6 z-20 px-3 py-1 rounded-xl border-2 border-mint text-mint font-heading font-black text-sm uppercase rotate-12 bg-surface/90 pointer-events-none"
          >
            SHORTLIST
          </motion.div>
        </>
      )}

      {/* Deal-breaker alert banner */}
      {matchResult.hasDealBreaker && (
        <div className="mb-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow/15 border border-yellow/40 text-yellow text-xs font-mono">
          <AlertTriangle size={14} className="shrink-0" />
          <span className="font-bold uppercase tracking-micro">
            Deal-breaker: {matchResult.dealBreakerReason || 'Lifestyle Clash'}
          </span>
        </div>
      )}

      {/* Top Header: Avatar + Info + Match % Ring */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3.5">
          {/* Avatar block: solid pink/accent square with person icon */}
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-bg shrink-0 shadow-md relative"
            style={{ backgroundColor: profile.avatarBgColor || '#FF5C8D' }}
          >
            <User size={30} strokeWidth={2.3} />
            {profile.verification.tier === 'trusted' && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-mint text-bg flex items-center justify-center text-[10px] shadow">
                <ShieldCheck size={13} strokeWidth={3} />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-heading font-black text-white leading-tight">
                {profile.name.split(' ')[0]}, {profile.age}
              </h3>
            </div>
            <p className="text-xs text-muted font-sans font-medium line-clamp-1">
              {profile.occupation}
            </p>
            <p className="text-[11px] font-mono text-muted uppercase tracking-micro flex items-center gap-1 mt-0.5">
              <MapPin size={11} className="text-blue" />
              <span>{profile.locality}, {profile.city}</span>
            </p>
          </div>
        </div>

        {/* Big Match % Ring */}
        <div className="shrink-0">
          <MatchRing
            score={matchResult.overallScore}
            size={68}
            strokeWidth={5.5}
            color={
              matchResult.hasDealBreaker
                ? 'yellow'
                : matchResult.overallScore >= 80
                ? 'mint'
                : matchResult.overallScore >= 60
                ? 'blue'
                : 'pink'
            }
          />
        </div>
      </div>

      {/* Tiny uppercase habit line exactly as in video */}
      <div className="p-2.5 rounded-xl bg-surface-2 border border-white/10 text-center mb-4">
        <p className="font-mono text-[11px] font-bold uppercase tracking-micro text-white/90 truncate">
          {profile.microHabitLine}
        </p>
      </div>

      {/* Bio excerpt */}
      <p
        onClick={onClickDetail}
        className="text-xs text-muted leading-relaxed mb-4 line-clamp-2 cursor-pointer hover:text-white/90 transition-colors"
      >
        "{profile.bio}"
      </p>

      {/* 4 Habit Chips (Sleep, Cleaning, Smoking, Budget) */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        <Chip
          label={profile.sleep === 'by-11' ? '11 PM BED' : profile.sleep.toUpperCase()}
          color="pink"
          variant="tint"
          icon={<Clock size={11} />}
        />
        <Chip
          label={profile.cleaning === 'daily' ? 'CLEANS DAILY' : profile.cleaning.toUpperCase()}
          color="mint"
          variant="tint"
          icon={<Sparkles size={11} />}
        />
        <Chip
          label={profile.smoking === 'no' ? 'NON-SMOKER' : profile.smoking.toUpperCase()}
          color="yellow"
          variant="tint"
          icon={<Cigarette size={11} />}
        />
        <Chip
          label={`₹${(profile.budgetMin / 1000).toFixed(0)}k–${(profile.budgetMax / 1000).toFixed(0)}k`}
          color="blue"
          variant="tint"
          icon={<DollarSign size={11} />}
        />
      </div>

      {/* Room Available Tag */}
      {profile.hasFlat && (
        <div className="mb-4 p-2.5 rounded-xl bg-blue/10 border border-blue/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-blue font-bold">
            <Building size={14} />
            <span>ROOM AVAILABLE IN FLAT</span>
          </div>
          <span className="text-white font-bold">₹{profile.flatDetails?.rent?.toLocaleString('en-IN')}/mo</span>
        </div>
      )}

      {/* Action Buttons (Pass, Super-Like, Shortlist, Detail) */}
      <div className="flex items-center justify-between pt-4 border-t border-line gap-2">
        <button
          onClick={onClickDetail}
          className="text-xs font-mono uppercase text-muted hover:text-white underline underline-offset-4"
        >
          View Full Breakdown →
        </button>

        <div className="flex items-center gap-2">
          {onPass && (
            <button
              onClick={onPass}
              className="w-10 h-10 rounded-full border border-pink/40 bg-pink/10 hover:bg-pink/20 text-pink flex items-center justify-center transition-all hover:scale-105"
              title="Pass"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          )}

          {onSuperLike && (
            <button
              onClick={onSuperLike}
              className="w-10 h-10 rounded-full border border-blue/40 bg-blue/10 hover:bg-blue/20 text-blue flex items-center justify-center transition-all hover:scale-105"
              title="Super Interest"
            >
              <Star size={18} strokeWidth={2.5} className="fill-blue/20" />
            </button>
          )}

          {onShortlist && (
            <button
              onClick={onShortlist}
              className="w-10 h-10 rounded-full border border-mint/40 bg-mint text-bg flex items-center justify-center font-bold shadow-mint-glow transition-all hover:scale-105"
              title="Shortlist & Vibe Check"
            >
              <Heart size={18} strokeWidth={2.5} className="fill-bg" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

