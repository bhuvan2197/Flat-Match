import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Building,
  Heart,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  Cigarette,
  DollarSign,
  Utensils,
  Users,
  Volume2,
  Share2,
  Check,
  Tag,
  FileEdit,
} from 'lucide-react';
import { Profile, MatchResult } from '../../types';
import { MatchRing } from '../../components/ui/MatchRing';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { useAppStore } from '../../store/useAppStore';

interface ProfileDetailModalProps {
  profile: Profile | null;
  matchResult: MatchResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  matchResult,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { shortlist, shortlistProfile, initSafePath, addToast } = useAppStore();

  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (!profile || !matchResult) return null;

  const isShortlisted = shortlist.some((s) => s.profileId === profile.id);

  const handleStartChat = () => {
    initSafePath(profile.id);
    onClose();
    navigate(`/matches/${profile.id}`);
  };

  const handleShortlistWithNote = () => {
    shortlistProfile(profile.id, noteText || 'Shortlisted from profile detail', ['Top Match']);
    setIsAddingNote(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-bg shrink-0 shadow-lg font-black font-mono text-2xl"
              style={{ backgroundColor: profile.avatarBgColor || '#FF5C8D' }}
            >
              <User size={38} strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
                  {profile.name}, {profile.age}
                </h2>
                {profile.verification.tier === 'trusted' && (
                  <span className="px-2 py-0.5 rounded-full bg-mint/20 text-mint border border-mint/40 text-[10px] font-mono font-bold flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>TRUSTED</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-muted font-sans font-medium">
                {profile.occupation} • {profile.companyOrCollege}
              </p>
              <p className="text-xs font-mono text-blue flex items-center gap-1 mt-0.5">
                <MapPin size={12} />
                <span>{profile.locality}, {profile.city}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MatchRing
              score={matchResult.overallScore}
              size={76}
              strokeWidth={6}
              color={matchResult.hasDealBreaker ? 'yellow' : 'mint'}
            />
          </div>
        </div>

        {/* Micro habit line */}
        <div className="p-3 rounded-2xl bg-surface-2 border border-white/10 text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-micro text-white">
            {profile.microHabitLine}
          </p>
        </div>

        {/* Bio */}
        <div>
          <span className="font-mono text-[10px] text-muted uppercase tracking-micro block mb-1">
            ABOUT {profile.name.toUpperCase()}
          </span>
          <p className="text-sm text-white/90 leading-relaxed font-sans bg-white/5 p-3.5 rounded-xl border border-white/10">
            "{profile.bio}"
          </p>
        </div>

        {/* Deal-breaker alert if present */}
        {matchResult.hasDealBreaker && (
          <div className="p-4 rounded-2xl bg-yellow/15 border border-yellow/40 text-yellow text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold font-mono uppercase tracking-micro">
              <AlertTriangle size={16} />
              <span>Lifestyle Deal-Breaker Flagged</span>
            </div>
            <p className="text-muted text-[11px] leading-snug">
              {matchResult.dealBreakerReason || 'One or more of your strict filters did not match this candidate.'} Score is capped at 40%.
            </p>
          </div>
        )}

        {/* COMPATIBILITY BREAKDOWN WITH ATTRIBUTE COLOR BARS */}
        <div>
          <span className="font-mono text-[10px] text-muted uppercase tracking-micro block mb-3 font-bold">
            COMPATIBILITY BREAKDOWN BY HABIT
          </span>
          <div className="space-y-3">
            {matchResult.breakdown.map((item) => {
              const barColors = {
                mint: 'bg-mint',
                yellow: 'bg-yellow',
                pink: 'bg-pink',
                blue: 'bg-blue',
              }[item.color];

              return (
                <div key={item.category} className="p-3 rounded-xl bg-surface-2 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-heading font-bold text-white">{item.category}</span>
                    <span className="font-mono font-bold text-xs" style={{ color: `var(--${item.color})` }}>
                      {item.score}% SYNC
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={`h-full ${barColors}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted font-sans">
                    <span>You: <strong className="text-white">{item.userValue}</strong></span>
                    <span>Them: <strong className="text-white">{item.matchValue}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WHERE YOU'LL CLICK */}
        {matchResult.clicks.length > 0 && (
          <div className="p-4 rounded-2xl bg-mint/10 border border-mint/30 space-y-2">
            <span className="font-mono text-[10px] uppercase text-mint font-bold tracking-micro flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>WHERE YOU'LL CLICK</span>
            </span>
            <ul className="space-y-1.5">
              {matchResult.clicks.map((click, i) => (
                <li key={i} className="text-xs text-white/90 flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-mint shrink-0 mt-0.5" />
                  <span>{click}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* WHERE YOU'LL CLASH */}
        {matchResult.clashes.length > 0 && (
          <div className="p-4 rounded-2xl bg-pink/10 border border-pink/30 space-y-2">
            <span className="font-mono text-[10px] uppercase text-pink font-bold tracking-micro flex items-center gap-1.5">
              <AlertTriangle size={13} />
              <span>HONEST CHECKS • WHERE YOU MIGHT CLASH</span>
            </span>
            <ul className="space-y-1.5">
              {matchResult.clashes.map((clash, i) => (
                <li key={i} className="text-xs text-white/90 flex items-start gap-2">
                  <span className="text-pink font-bold">•</span>
                  <span>{clash}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* VERIFICATION PANEL */}
        <div className="p-4 rounded-2xl bg-surface-2 border border-white/10 space-y-3">
          <span className="font-mono text-[10px] text-muted uppercase tracking-micro block font-bold">
            SAFETY & VERIFICATION BADGES
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Phone OTP', verified: profile.verification.phone },
              { label: 'Govt ID', verified: profile.verification.govtId },
              { label: 'Liveness Selfie', verified: profile.verification.selfie },
              { label: 'Work/College', verified: profile.verification.workEmail },
            ].map((v) => (
              <div
                key={v.label}
                className={`p-2.5 rounded-xl border text-center text-xs font-mono uppercase tracking-micro flex items-center justify-center gap-1.5 ${
                  v.verified
                    ? 'border-mint/40 bg-mint/10 text-mint font-bold'
                    : 'border-white/10 bg-white/5 text-muted/60'
                }`}
              >
                {v.verified ? <Check size={12} strokeWidth={3} /> : <span className="text-[10px]">•</span>}
                <span>{v.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FLAT DETAILS IF LISTED */}
        {profile.hasFlat && profile.flatDetails && (
          <div className="p-4 rounded-2xl bg-blue/10 border border-blue/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-blue font-bold uppercase tracking-micro flex items-center gap-1.5">
                <Building size={14} />
                <span>FLAT DETAILS ({profile.flatDetails.bhk})</span>
              </span>
              <span className="text-sm font-heading font-black text-white">
                Rent: ₹{profile.flatDetails.rent.toLocaleString('en-IN')}/mo
              </span>
            </div>
            <p className="text-xs text-white/90 font-mono">
              Deposit: ₹{profile.flatDetails.deposit.toLocaleString('en-IN')} • Furnishing: {profile.flatDetails.furnishing} • Ready: {profile.flatDetails.availableFrom}
            </p>
            <p className="text-xs text-muted">
              Address: {profile.flatDetails.address}
            </p>
            {profile.flatDetails.photos?.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {profile.flatDetails.photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt="Flat preview"
                    className="h-28 w-full object-cover rounded-xl border border-white/10"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-line">
          <Button
            size="lg"
            variant="primary"
            onClick={handleStartChat}
            icon={<MessageSquare size={18} />}
            className="w-full sm:flex-1"
          >
            Start Safe Path Chat
          </Button>

          <Button
            size="lg"
            variant={isShortlisted ? 'secondary' : 'outline'}
            onClick={() => {
              if (isShortlisted) {
                navigate('/shortlist');
                onClose();
              } else {
                handleShortlistWithNote();
              }
            }}
            icon={<Heart size={18} className={isShortlisted ? 'fill-mint text-mint' : ''} />}
            className="w-full sm:w-auto"
          >
            {isShortlisted ? 'In Shortlist' : 'Shortlist Candidate'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

