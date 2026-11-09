import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  Compass,
  RotateCcw,
  LayoutGrid,
  Layers,
  MapPin,
  Sparkles,
  ShieldCheck,
  Building,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_PROFILES } from '../../data/mockProfiles';
import { calculateCompatibility } from '../../lib/matchEngine';
import { ProfileCard } from './ProfileCard';
import { ProfileDetailModal } from './ProfileDetailModal';
import { CITIES_DATA } from '../../data/localities';
import { Button } from '../../components/ui/Button';
import { Profile, MatchResult } from '../../types';

export const DiscoverPage: React.FC = () => {
  const {
    currentUser,
    weights,
    passedProfileIds,
    shortlist,
    superLikedIds,
    filters,
    setFilter,
    resetFilters,
    passProfile,
    shortlistProfile,
    superLikeProfile,
    undoLastSwipe,
    lastSwipedId,
  } = useAppStore();

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedMatchResult, setSelectedMatchResult] = useState<MatchResult | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Keyboard navigation for desktop swipe
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (filters.viewMode !== 'stack') return;

      if (e.key === 'ArrowLeft' && currentStackProfile) {
        passProfile(currentStackProfile.profile.id);
      } else if (e.key === 'ArrowRight' && currentStackProfile) {
        shortlistProfile(currentStackProfile.profile.id);
      } else if (e.key === 'ArrowUp' && currentStackProfile) {
        superLikeProfile(currentStackProfile.profile.id);
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        undoLastSwipe();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filters.viewMode, passedProfileIds, shortlist, superLikedIds]);

  // Compute match results for all profiles
  const profilesWithScores = useMemo(() => {
    return MOCK_PROFILES.map((profile) => {
      const matchResult = calculateCompatibility(currentUser, profile, weights);
      return {
        profile,
        matchResult,
      };
    });
  }, [currentUser, weights]);

  // Filter and sort profiles
  const filteredProfiles = useMemo(() => {
    return profilesWithScores
      .filter(({ profile, matchResult }) => {
        // City filter
        if (filters.city && profile.city !== filters.city) return false;

        // Locality filter
        if (
          filters.locality &&
          filters.locality !== 'All Localities' &&
          profile.locality !== filters.locality
        )
          return false;

        // Looking for filter
        if (filters.lookingFor !== 'all') {
          if (filters.lookingFor === 'flat-to-share' && !profile.hasFlat) return false;
          if (filters.lookingFor !== 'flat-to-share' && profile.lookingFor !== filters.lookingFor)
            return false;
        }

        // Budget overlap filter
        if (
          profile.budgetMax < filters.budgetMin ||
          profile.budgetMin > filters.budgetMax
        )
          return false;

        // Verified filter
        if (filters.onlyVerified && profile.verification.tier === 'none') return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'match') {
          return b.matchResult.overallScore - a.matchResult.overallScore;
        }
        if (filters.sortBy === 'budget-low') {
          return a.profile.budgetMin - b.profile.budgetMin;
        }
        if (filters.sortBy === 'budget-high') {
          return b.profile.budgetMax - a.profile.budgetMax;
        }
        if (filters.sortBy === 'newest') {
          return new Date(b.profile.createdAt).getTime() - new Date(a.profile.createdAt).getTime();
        }
        return 0;
      });
  }, [profilesWithScores, filters]);

  // Profiles available for the stack (exclude passed / already shortlisted)
  const stackProfiles = useMemo(() => {
    const passedSet = new Set(passedProfileIds);
    const shortlistSet = new Set(shortlist.map((s) => s.profileId));
    return filteredProfiles.filter(
      ({ profile }) => !passedSet.has(profile.id) && !shortlistSet.has(profile.id)
    );
  }, [filteredProfiles, passedProfileIds, shortlist]);

  const currentStackProfile = stackProfiles[0] || null;

  const openDetail = (profile: Profile, matchResult: MatchResult) => {
    setSelectedProfile(profile);
    setSelectedMatchResult(matchResult);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Top Filter Bar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white flex items-center gap-2">
              <Compass className="text-mint" size={24} />
              <span>Discover Flatmates</span>
            </h1>
            <p className="text-xs text-muted font-mono uppercase tracking-micro mt-0.5">
              Matched against your living archetype • {filteredProfiles.length} candidates in {filters.city}
            </p>
          </div>

          {/* Controls on Right */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-surface border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setFilter('viewMode', 'stack')}
                className={`p-1.5 rounded-lg text-xs font-mono uppercase tracking-micro flex items-center gap-1.5 transition-all ${
                  filters.viewMode === 'stack'
                    ? 'bg-mint text-bg font-bold shadow-sm'
                    : 'text-muted hover:text-white'
                }`}
                title="Stack / Swipe View"
              >
                <Layers size={14} />
                <span className="hidden sm:inline">Stack</span>
              </button>
              <button
                onClick={() => setFilter('viewMode', 'grid')}
                className={`p-1.5 rounded-lg text-xs font-mono uppercase tracking-micro flex items-center gap-1.5 transition-all ${
                  filters.viewMode === 'grid'
                    ? 'bg-mint text-bg font-bold shadow-sm'
                    : 'text-muted hover:text-white'
                }`}
                title="Grid / List View"
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

            {/* Undo Button if stack view */}
            {filters.viewMode === 'stack' && lastSwipedId && (
              <button
                onClick={undoLastSwipe}
                className="px-3 py-1.5 rounded-xl border border-white/10 bg-surface hover:border-white/20 text-xs font-mono text-muted hover:text-white flex items-center gap-1.5 transition-all"
                title="Undo last swipe"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Undo</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills & Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-line">
          {/* City Selector */}
          <select
            value={filters.city}
            onChange={(e) => {
              setFilter('city', e.target.value);
              setFilter('locality', 'All Localities');
            }}
            className="px-3 py-1.5 rounded-xl bg-surface border border-white/10 text-xs text-white font-mono uppercase outline-none cursor-pointer hover:border-white/30"
          >
            {CITIES_DATA.map((c) => (
              <option key={c.city} value={c.city} className="bg-surface text-white">
                {c.city}
              </option>
            ))}
          </select>

          {/* Locality Selector */}
          <select
            value={filters.locality}
            onChange={(e) => setFilter('locality', e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-surface border border-white/10 text-xs text-white font-mono uppercase outline-none cursor-pointer hover:border-white/30 max-w-[160px] truncate"
          >
            <option value="All Localities" className="bg-surface text-white">
              All Localities
            </option>
            {(
              CITIES_DATA.find((c) => c.city === filters.city)?.localities || []
            ).map((loc) => (
              <option key={loc} value={loc} className="bg-surface text-white">
                {loc}
              </option>
            ))}
          </select>

          {/* Looking For Segmented Control */}
          <div className="flex items-center bg-surface border border-white/10 rounded-xl p-0.5 text-xs font-mono uppercase">
            {[
              { id: 'all', label: 'All' },
              { id: 'room', label: 'Room' },
              { id: 'flatmate', label: 'Flatmate' },
              { id: 'flat-to-share', label: 'Has Flat 🏢' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter('lookingFor', tab.id)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filters.lookingFor === tab.id
                    ? 'bg-surface-2 text-mint border border-mint/40 font-bold'
                    : 'text-muted hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value)}
            className="ml-auto px-3 py-1.5 rounded-xl bg-surface border border-white/10 text-xs text-muted hover:text-white font-mono uppercase outline-none cursor-pointer"
          >
            <option value="match" className="bg-surface text-white">Best Match %</option>
            <option value="budget-low" className="bg-surface text-white">Lowest Rent</option>
            <option value="budget-high" className="bg-surface text-white">Highest Budget</option>
            <option value="newest" className="bg-surface text-white">Newest Profiles</option>
          </select>
        </div>
      </div>

      {/* VIEW MODE 1: SWIPE STACK */}
      {filters.viewMode === 'stack' ? (
        <div className="max-w-md mx-auto pt-2">
          {currentStackProfile ? (
            <div className="space-y-4">
              {/* Desktop keyboard helper note */}
              <p className="text-[11px] font-mono text-muted text-center uppercase tracking-micro hidden sm:block">
                ← Left arrow: Pass · → Right arrow: Shortlist · ↑ Up arrow: Super Match
              </p>

              {/* The Active Stack Card */}
              <AnimatePresence mode="wait">
                <ProfileCard
                  key={currentStackProfile.profile.id}
                  profile={currentStackProfile.profile}
                  matchResult={currentStackProfile.matchResult}
                  isDraggable={true}
                  onPass={() => passProfile(currentStackProfile.profile.id)}
                  onShortlist={() => shortlistProfile(currentStackProfile.profile.id)}
                  onSuperLike={() => superLikeProfile(currentStackProfile.profile.id)}
                  onClickDetail={() =>
                    openDetail(currentStackProfile.profile, currentStackProfile.matchResult)
                  }
                />
              </AnimatePresence>

              {/* Stack remaining counter */}
              <p className="text-center font-mono text-xs text-muted uppercase">
                {stackProfiles.length} Profiles left in this stack
              </p>
            </div>
          ) : (
            /* Empty state for stack */
            <div className="text-center py-16 px-6 rounded-3xl border border-white/10 bg-surface space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-mint/10 border border-mint/30 text-mint flex items-center justify-center mx-auto">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-heading font-black text-white">
                You've reviewed all available profiles!
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Reset your passed list, broaden your budget/locality radius, or switch to Grid View.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    useAppStore.setState({ passedProfileIds: [] });
                  }}
                >
                  Reset Passed Profiles
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setFilter('viewMode', 'grid')}
                >
                  View All in Grid
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VIEW MODE 2: GRID / LIST VIEW */
        <div>
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-3xl border border-white/10 bg-surface space-y-4 max-w-md mx-auto">
              <AlertCircle size={32} className="text-yellow mx-auto" />
              <h3 className="text-xl font-heading font-black text-white">No flatmates match these filters</h3>
              <p className="text-xs text-muted">
                Try selecting "All Localities" or widening your budget range.
              </p>
              <Button variant="primary" size="md" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map(({ profile, matchResult }) => {
                const isShortlisted = shortlist.some((s) => s.profileId === profile.id);
                return (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    matchResult={matchResult}
                    onShortlist={!isShortlisted ? () => shortlistProfile(profile.id) : undefined}
                    onSuperLike={() => superLikeProfile(profile.id)}
                    onClickDetail={() => openDetail(profile, matchResult)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Profile Detail Modal */}
      <ProfileDetailModal
        profile={selectedProfile}
        matchResult={selectedMatchResult}
        isOpen={Boolean(selectedProfile)}
        onClose={() => {
          setSelectedProfile(null);
          setSelectedMatchResult(null);
        }}
      />
    </div>
  );
};

