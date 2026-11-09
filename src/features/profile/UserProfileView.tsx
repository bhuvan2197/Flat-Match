import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Building,
  Heart,
  MessageSquare,
  Sparkles,
  Share2,
  Download,
  MapPin,
  Clock,
  Cigarette,
  DollarSign,
  ArrowLeft,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_PROFILES } from '../../data/mockProfiles';
import { calculateCompatibility } from '../../lib/matchEngine';
import { MatchRing } from '../../components/ui/MatchRing';
import { Button } from '../../components/ui/Button';
import { CheckBadge } from '../../components/ui/CheckBadge';

export const UserProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, weights, shortlist, shortlistProfile, initSafePath, addToast } = useAppStore();

  const isSelf = id === 'current-user' || id === currentUser.id;
  const profile = isSelf ? currentUser : MOCK_PROFILES.find((p) => p.id === id);

  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!profile) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
        <h2 className="text-xl font-heading font-black text-white">Profile not found</h2>
        <Button variant="primary" size="md" onClick={() => navigate('/discover')} className="mt-4">
          Back to Discover
        </Button>
      </div>
    );
  }

  const match = !isSelf ? calculateCompatibility(currentUser, profile, weights) : null;
  const isShortlisted = shortlist.some((s) => s.profileId === profile.id);

  const handleExportPNG = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `flatmatch-living-style-${profile.name.toLowerCase().split(' ')[0]}.png`;
      link.href = dataUrl;
      link.click();
      addToast({
        type: 'success',
        title: 'Story Card Downloaded',
        description: 'Ready to share on Instagram / WhatsApp Stories (9:16 format)!',
      });
    } catch (e) {
      addToast({
        type: 'warning',
        title: 'Export Failed',
        description: 'Could not export card.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between pb-2 border-b border-line">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-mono uppercase text-muted hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Go Back</span>
        </button>

        {isSelf && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/onboarding')}
          >
            Retake Quiz
          </Button>
        )}
      </div>

      {/* Main 9:16 Style Living Card */}
      <div
        ref={cardRef}
        className="max-w-md mx-auto rounded-3xl border-2 border-mint/50 bg-surface p-6 sm:p-8 shadow-mint-glow relative overflow-hidden"
      >
        {/* Top Eyebrow */}
        <div className="flex items-center justify-between mb-5">
          <span className="px-3 py-1 rounded-full bg-mint text-bg font-mono font-black text-[10px] uppercase">
            {profile.archetype.toUpperCase()}
          </span>
          <span className="font-mono text-[10px] text-muted uppercase">FLATMATCH INDIA</span>
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-bg shrink-0 shadow-md font-black font-mono text-xl"
            style={{ backgroundColor: profile.avatarBgColor || '#3DDBA5' }}
          >
            <User size={34} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-heading font-black text-white">
                {profile.name}, {profile.age}
              </h2>
            </div>
            <p className="text-xs text-muted font-mono uppercase tracking-micro">
              {profile.occupation} • {profile.locality}
            </p>
          </div>
        </div>

        {/* Archetype tagline */}
        <div className="p-4 rounded-2xl bg-surface-2 border border-mint/30 mb-5">
          <p className="text-base font-heading font-black text-mint tracking-tight">
            {profile.archetype}
          </p>
          <p className="text-xs text-muted mt-1 leading-snug">{profile.archetypeTagline}</p>
        </div>

        {/* Bio */}
        <p className="text-xs text-white/90 leading-relaxed font-sans mb-5 bg-white/5 p-3 rounded-xl border border-white/10">
          "{profile.bio}"
        </p>

        {/* 5 Attribute Rows with Check Badges */}
        <div className="space-y-2.5 mb-5 text-xs font-sans">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-2 border border-yellow/40">
            <span className="text-muted font-mono uppercase text-[10px]">BUDGET</span>
            <span className="font-bold text-white">₹{(profile.budgetMin / 1000).toFixed(0)}k–{(profile.budgetMax / 1000).toFixed(0)}k</span>
            <CheckBadge color="yellow" size="sm" checked={true} />
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-2 border border-blue/40">
            <span className="text-muted font-mono uppercase text-[10px]">LOCATION</span>
            <span className="font-bold text-white">{profile.locality}, {profile.city}</span>
            <CheckBadge color="blue" size="sm" checked={true} />
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-2 border border-pink/40">
            <span className="text-muted font-mono uppercase text-[10px]">SLEEP</span>
            <span className="font-bold text-white">
              {profile.sleep === 'by-11' ? 'By 11:00 PM' : profile.sleep}
            </span>
            <CheckBadge color="pink" size="sm" checked={true} />
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-2 border border-mint/40">
            <span className="text-muted font-mono uppercase text-[10px]">CLEANING</span>
            <span className="font-bold text-white">
              {profile.cleaning === 'daily' ? 'Cleans Daily' : profile.cleaning}
            </span>
            <CheckBadge color="mint" size="sm" checked={true} />
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-2 border border-yellow/40">
            <span className="text-muted font-mono uppercase text-[10px]">SMOKING</span>
            <span className="font-bold text-white">
              {profile.smoking === 'no' ? 'Strictly Smoke-Free' : profile.smoking}
            </span>
            <CheckBadge color="yellow" size="sm" checked={true} />
          </div>
        </div>

        {/* Verification Tier */}
        <div className="pt-3 border-t border-line flex items-center justify-between text-[11px] font-mono text-muted">
          <span>Trust Tier</span>
          <span className="text-mint font-bold uppercase flex items-center gap-1">
            <ShieldCheck size={13} />
            <span>{profile.verification.tier}</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
        {isSelf ? (
          <Button
            size="lg"
            variant="primary"
            onClick={handleExportPNG}
            disabled={isExporting}
            icon={<Download size={18} />}
            className="w-full"
          >
            {isExporting ? 'Exporting...' : 'Export 9:16 Story PNG'}
          </Button>
        ) : (
          <>
            <Button
              size="lg"
              variant="primary"
              onClick={() => {
                initSafePath(profile.id);
                navigate(`/matches/${profile.id}`);
              }}
              icon={<MessageSquare size={18} />}
              className="flex-1 w-full sm:w-auto"
            >
              Start Safe Path Chat
            </Button>
            <Button
              size="lg"
              variant={isShortlisted ? 'secondary' : 'outline'}
              onClick={() => {
                if (!isShortlisted) shortlistProfile(profile.id);
              }}
              icon={<Heart size={18} className={isShortlisted ? 'fill-mint text-mint' : ''} />}
              className="w-full sm:w-auto"
            >
              {isShortlisted ? 'In Shortlist' : 'Shortlist'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

