import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  User,
  Trash2,
  Tag,
  FileEdit,
  ArrowRight,
  Crown,
  Check,
  ShieldCheck,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_PROFILES } from '../../data/mockProfiles';
import { calculateCompatibility } from '../../lib/matchEngine';
import { Button } from '../../components/ui/Button';
import { MatchRing } from '../../components/ui/MatchRing';
import { Chip } from '../../components/ui/Chip';

export const ShortlistPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    weights,
    shortlist,
    removeShortlist,
    updateShortlistNote,
    initSafePath,
    addToast,
  } = useAppStore();

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');
  const [tempTag, setTempTag] = useState('');

  const shortlistedItems = shortlist
    .map((item) => {
      const profile = MOCK_PROFILES.find((p) => p.id === item.profileId);
      if (!profile) return null;
      const match = calculateCompatibility(currentUser, profile, weights);
      return {
        item,
        profile,
        match,
      };
    })
    .filter(Boolean) as {
    item: (typeof shortlist)[0];
    profile: (typeof MOCK_PROFILES)[0];
    match: ReturnType<typeof calculateCompatibility>;
  }[];

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((cid) => cid !== id));
    } else {
      if (compareIds.length >= 3) {
        addToast({
          type: 'info',
          title: 'Maximum 3 Candidates',
          description: 'You can compare up to 3 candidates side-by-side.',
        });
        return;
      }
      setCompareIds([...compareIds, id]);
    }
  };

  const comparedProfiles = compareIds
    .map((id) => shortlistedItems.find((s) => s.profile.id === id))
    .filter((p): p is (typeof shortlistedItems)[0] => Boolean(p));

  const bestCompareProfile = comparedProfiles.length > 0
    ? comparedProfiles.reduce((best, curr) =>
        curr.match.overallScore > best.match.overallScore ? curr : best
      )
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white flex items-center gap-2">
            <Heart className="text-mint fill-mint" size={24} />
            <span>Shortlisted Candidates ({shortlistedItems.length})</span>
          </h1>
          <p className="text-xs text-muted font-mono uppercase tracking-micro mt-0.5">
            Add private notes, compare habits side-by-side, or launch Safe Path chats
          </p>
        </div>

        {shortlistedItems.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted uppercase">
              Selected for Comparison: {compareIds.length} / 3
            </span>
            {compareIds.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setCompareIds([])}>
                Clear
              </Button>
            )}
          </div>
        )}
      </div>

      {/* SIDE-BY-SIDE COMPARISON TABLE (UP TO 3 CANDIDATES) */}
      {comparedProfiles.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-surface border border-mint/40 shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Crown className="text-yellow" size={20} />
              <h2 className="text-lg font-heading font-black text-white">
                Side-by-Side Candidate Comparison
              </h2>
            </div>
            {bestCompareProfile && (
              <span className="px-3 py-1 rounded-full bg-yellow/15 border border-yellow/30 text-yellow font-mono text-xs font-bold uppercase flex items-center gap-1.5">
                <Crown size={13} />
                <span>Best Overall: {bestCompareProfile.profile.name} ({bestCompareProfile.match.overallScore}%)</span>
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-muted font-mono uppercase">
                  <th className="py-3 px-3 w-40">Attribute</th>
                  {comparedProfiles.map((cp) => (
                    <th key={cp!.profile.id} className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-white text-sm">
                          {cp!.profile.name}
                        </span>
                        {bestCompareProfile?.profile.id === cp!.profile.id && (
                          <Crown size={14} className="text-yellow" />
                        )}
                      </div>
                      <span className="text-mint font-mono">{cp!.match.overallScore}% MATCH</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                <tr>
                  <td className="py-3 px-3 font-mono text-muted uppercase">Sleep Schedule</td>
                  {comparedProfiles.map((cp) => (
                    <td key={cp!.profile.id} className="py-3 px-4 text-white font-medium">
                      {cp!.profile.sleep === 'by-11' ? '11:00 PM' : cp!.profile.sleep}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono text-muted uppercase">Cleanliness</td>
                  {comparedProfiles.map((cp) => (
                    <td key={cp!.profile.id} className="py-3 px-4 text-white font-medium">
                      {cp!.profile.cleaning}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono text-muted uppercase">Smoking</td>
                  {comparedProfiles.map((cp) => (
                    <td key={cp!.profile.id} className="py-3 px-4 text-white font-medium">
                      {cp!.profile.smoking === 'no' ? 'Smoke-Free 🚭' : cp!.profile.smoking}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono text-muted uppercase">Budget</td>
                  {comparedProfiles.map((cp) => (
                    <td key={cp!.profile.id} className="py-3 px-4 text-white font-medium">
                      ₹{(cp!.profile.budgetMin / 1000).toFixed(0)}k–{(cp!.profile.budgetMax / 1000).toFixed(0)}k
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono text-muted uppercase">Food Style</td>
                  {comparedProfiles.map((cp) => (
                    <td key={cp!.profile.id} className="py-3 px-4 text-white font-medium">
                      {cp!.profile.food}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono text-muted uppercase">Trust Tier</td>
                  {comparedProfiles.map((cp) => (
                    <td key={cp!.profile.id} className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-mint/15 text-mint font-mono uppercase text-[10px] font-bold">
                        {cp!.profile.verification.tier}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* SHORTLIST CARDS GRID */}
      {shortlistedItems.length === 0 ? (
        <div className="text-center py-20 px-6 rounded-3xl border border-white/10 bg-surface space-y-4">
          <Heart size={36} className="text-muted mx-auto" />
          <h3 className="text-xl font-heading font-black text-white">Your shortlist is empty</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Swipe right on profiles in Discover to save them here for side-by-side comparison.
          </p>
          <Button variant="primary" size="md" onClick={() => navigate('/discover')}>
            Explore Flatmates
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shortlistedItems.map(({ item, profile, match }) => {
            const isCompared = compareIds.includes(profile.id);

            return (
              <div
                key={profile.id}
                className="p-5 rounded-3xl bg-surface border border-white/10 hover:border-mint/40 transition-all space-y-4 shadow-xl relative"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-bg shrink-0 font-black font-mono"
                      style={{ backgroundColor: profile.avatarBgColor || '#FF5C8D' }}
                    >
                      <User size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-black text-white">
                        {profile.name}, {profile.age}
                      </h3>
                      <p className="text-xs text-muted font-mono">{profile.occupation}</p>
                      <p className="text-[11px] font-mono text-blue">
                        {profile.locality}, {profile.city}
                      </p>
                    </div>
                  </div>

                  <MatchRing score={match.overallScore} size={60} strokeWidth={5} />
                </div>

                {/* Habit Line */}
                <div className="p-2.5 rounded-xl bg-surface-2 border border-white/10 text-center">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-micro text-white">
                    {profile.microHabitLine}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/15 text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const newTag = prompt('Add tag (e.g. Call tomorrow, Indiranagar flat):');
                      if (newTag) {
                        updateShortlistNote(profile.id, item.notes, [...item.tags, newTag]);
                      }
                    }}
                    className="text-[10px] font-mono text-mint hover:underline"
                  >
                    + Add Tag
                  </button>
                </div>

                {/* Private Notes */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-muted uppercase">PRIVATE NOTE</span>
                    <button
                      onClick={() => {
                        const note = prompt('Edit note for ' + profile.name, item.notes);
                        if (note !== null) {
                          updateShortlistNote(profile.id, note, item.tags);
                        }
                      }}
                      className="text-[10px] font-mono text-muted hover:text-white flex items-center gap-1"
                    >
                      <FileEdit size={11} />
                      <span>Edit</span>
                    </button>
                  </div>
                  <p className="text-white/90 italic font-sans">
                    {item.notes || 'No private note yet. Tap edit to jot down call reminders.'}
                  </p>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-line gap-2">
                  <button
                    onClick={() => toggleCompare(profile.id)}
                    className={`text-xs font-mono uppercase px-3 py-1.5 rounded-xl border transition-all ${
                      isCompared
                        ? 'border-yellow bg-yellow/20 text-yellow font-bold'
                        : 'border-white/15 text-muted hover:text-white'
                    }`}
                  >
                    {isCompared ? '✓ Comparing' : '+ Compare'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        initSafePath(profile.id);
                        navigate(`/matches/${profile.id}`);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-mint text-bg font-heading font-black text-xs shadow-mint-glow hover:bg-[#4ff5bc] flex items-center gap-1.5"
                    >
                      <MessageSquare size={14} />
                      <span>Safe Chat</span>
                    </button>

                    <button
                      onClick={() => removeShortlist(profile.id)}
                      className="p-2 rounded-xl text-muted hover:text-pink transition-colors"
                      title="Remove from shortlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
