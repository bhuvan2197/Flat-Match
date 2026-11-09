import { LivingPreferences } from '../types';

export interface ArchetypeResult {
  title: string;
  tagline: string;
  badge: string;
  accent: 'mint' | 'yellow' | 'pink' | 'blue';
  traits: string[];
}

export function determineArchetype(prefs: Partial<LivingPreferences>): ArchetypeResult {
  const isEarly = prefs.sleep === 'before-10' || prefs.sleep === 'by-11';
  const isNightOwl = prefs.sleep === 'night-owl';
  const isCleanFreak = prefs.cleaning === 'daily';
  const isChill = prefs.cleaning === 'when-messy' || prefs.cleaning === 'weekly';
  const isSocial = prefs.guests === 'weekends' || prefs.guests === 'anytime' || prefs.drinking === 'often';
  const isQuiet = prefs.noise === 'silent' || prefs.guests === 'never';
  const isWFH = prefs.workMode === 'wfh';

  if (isEarly && isCleanFreak) {
    return {
      title: 'The Early-Bird Neat Freak',
      tagline: 'Up with the sunrise, spotless kitchen before 9 AM',
      badge: '🌅 SPOTLESS LIVING',
      accent: 'mint',
      traits: ['Lights off by 11 PM', 'Wipes counter immediately', 'Low weekend drama'],
    };
  }

  if (isNightOwl && isSocial) {
    return {
      title: 'The Midnight Socialite',
      tagline: 'Life starts after 10 PM. Always down to order late-night chai & talk',
      badge: '🌙 CREATIVE ENERGY',
      accent: 'pink',
      traits: ['Coding/working late', 'Weekend dinners & guests', 'Chill vibe, zero stress'],
    };
  }

  if (isQuiet && isEarly) {
    return {
      title: 'The Zen Minimalist',
      tagline: 'Peace, quiet, and predictable routines. Safe haven after busy workdays',
      badge: '🕯️ LOW DRAMA',
      accent: 'blue',
      traits: ['Respects privacy', 'Quiet evenings', 'Prompt bill payer'],
    };
  }

  if (isWFH && isCleanFreak) {
    return {
      title: 'The Focused Remote Pro',
      tagline: 'Workspace is sacred. High-speed WiFi, clean surroundings, deep focus',
      badge: '💻 HOME OFFICE HERO',
      accent: 'yellow',
      traits: ['Desk is clean', 'Daytime quiet hours', 'Split bills instantly'],
    };
  }

  if (isChill && isNightOwl) {
    return {
      title: 'The Chill Night Owl',
      tagline: 'No petty complaints, minding own business, late gaming or reading sessions',
      badge: '🎧 EASY-GOING',
      accent: 'pink',
      traits: ['Zero micromanagement', 'Flexible chores', 'Sleeps through anything'],
    };
  }

  return {
    title: 'The Balanced Urbanite',
    tagline: 'Adaptable, dependable, and respects shared common spaces',
    badge: '⚖️ THE ALL-ROUNDER',
    accent: 'mint',
    traits: ['Reliable roommate', 'Social yet respectful', 'Balanced routine'],
  };
}

