import { Profile, LivingPreferences, MatchResult, CategoryBreakdown, CompatibilityWeights } from '../types';

export const DEFAULT_WEIGHTS: CompatibilityWeights = {
  sleep: 25,
  cleaning: 25,
  smoking: 20,
  budget: 15,
  food: 5,
  guests: 5,
  noise: 5,
};

const SLEEP_ORDER = ['before-10', 'by-11', 'midnight', 'night-owl'];
const CLEANING_ORDER = ['daily', 'few-times-week', 'weekly', 'when-messy'];
const GUESTS_ORDER = ['never', 'day-only', 'weekends', 'anytime'];
const NOISE_ORDER = ['silent', 'moderate', 'party-friendly'];

export const SLEEP_LABELS: Record<string, string> = {
  'before-10': 'Before 10 PM',
  'by-11': 'By 11 PM',
  'midnight': 'Around Midnight',
  'night-owl': 'Night Owl (2 AM+)',
};

export const CLEANING_LABELS: Record<string, string> = {
  'daily': 'Daily',
  'few-times-week': 'Few times / week',
  'weekly': 'Weekly',
  'when-messy': "When it's messy",
};

export const SMOKING_LABELS: Record<string, string> = {
  'no': 'Non-smoker',
  'outside': 'Outside / Balcony',
  'yes': 'Smoker',
};

export const FOOD_LABELS: Record<string, string> = {
  'veg': 'Pure Veg',
  'non-veg': 'Non-Veg',
  'eggetarian': 'Eggetarian',
  'jain': 'Jain Food',
};

export const GUESTS_LABELS: Record<string, string> = {
  'never': 'No guests',
  'day-only': 'Day-time only',
  'weekends': 'Weekends only',
  'anytime': 'Anytime welcome',
};

export const NOISE_LABELS: Record<string, string> = {
  'silent': 'Pin-drop quiet',
  'moderate': 'Normal chatter & music',
  'party-friendly': 'Party & energetic',
};

export function calculateCompatibility(
  user: LivingPreferences,
  match: Profile,
  weights: CompatibilityWeights = DEFAULT_WEIGHTS
): MatchResult {
  const breakdown: CategoryBreakdown[] = [];
  const clashes: string[] = [];
  const clicks: string[] = [];
  let isDealBreakerTriggered = false;
  let dealBreakerReason: string | undefined = undefined;

  // 1. SLEEP COMPATIBILITY
  const uSleepIdx = SLEEP_ORDER.indexOf(user.sleep);
  const mSleepIdx = SLEEP_ORDER.indexOf(match.sleep);
  const sleepDiff = Math.abs(uSleepIdx - mSleepIdx);
  let sleepScore = 100;
  if (sleepDiff === 1) sleepScore = 80;
  else if (sleepDiff === 2) sleepScore = 50;
  else if (sleepDiff >= 3) sleepScore = 20;

  if (sleepDiff === 0) {
    clicks.push(`Sync sleep cycles: Both usually call it a night ${SLEEP_LABELS[user.sleep]}`);
  } else if (sleepDiff >= 2) {
    const clashMsg = `Sleep clash: You sleep ${SLEEP_LABELS[user.sleep]}, they're up ${SLEEP_LABELS[match.sleep]}`;
    clashes.push(clashMsg);
    if (user.dealBreakers.sleep) {
      isDealBreakerTriggered = true;
      dealBreakerReason = 'Sleep schedule deal-breaker';
    }
  }

  breakdown.push({
    category: 'Sleep Schedule',
    attributeKey: 'sleep',
    score: sleepScore,
    userValue: SLEEP_LABELS[user.sleep] || user.sleep,
    matchValue: SLEEP_LABELS[match.sleep] || match.sleep,
    color: 'pink',
    isDealBreakerTriggered: user.dealBreakers.sleep && sleepDiff >= 2,
  });

  // 2. CLEANING COMPATIBILITY
  const uCleanIdx = CLEANING_ORDER.indexOf(user.cleaning);
  const mCleanIdx = CLEANING_ORDER.indexOf(match.cleaning);
  const cleanDiff = Math.abs(uCleanIdx - mCleanIdx);
  let cleanScore = 100;
  if (cleanDiff === 1) cleanScore = 75;
  else if (cleanDiff === 2) cleanScore = 45;
  else if (cleanDiff >= 3) cleanScore = 15;

  if (cleanDiff === 0) {
    clicks.push(`Kitchen & chores: Both prefer ${CLEANING_LABELS[user.cleaning]} cleaning`);
  } else if (cleanDiff >= 2) {
    const clashMsg = `Cleanliness standards: You clean ${CLEANING_LABELS[user.cleaning]}, they clean ${CLEANING_LABELS[match.cleaning]}`;
    clashes.push(clashMsg);
    if (user.dealBreakers.cleaning) {
      isDealBreakerTriggered = true;
      dealBreakerReason = dealBreakerReason || 'Cleaning standards deal-breaker';
    }
  }

  breakdown.push({
    category: 'Cleanliness',
    attributeKey: 'cleaning',
    score: cleanScore,
    userValue: CLEANING_LABELS[user.cleaning] || user.cleaning,
    matchValue: CLEANING_LABELS[match.cleaning] || match.cleaning,
    color: 'mint',
    isDealBreakerTriggered: user.dealBreakers.cleaning && cleanDiff >= 2,
  });

  // 3. SMOKING & DRINKING COMPATIBILITY
  let smokeScore = 100;
  if (user.smoking === match.smoking) {
    smokeScore = 100;
    if (user.smoking === 'no') {
      clicks.push('Both non-smokers: strictly smoke-free apartment');
    }
  } else if (user.smoking === 'no' && match.smoking === 'outside') {
    smokeScore = 65;
    clashes.push("They smoke only outside on the balcony");
  } else if (user.smoking === 'no' && match.smoking === 'yes') {
    smokeScore = 15;
    const clashMsg = "Heavy smoke clash: You don't smoke, they smoke inside";
    clashes.push(clashMsg);
    if (user.dealBreakers.smoking) {
      isDealBreakerTriggered = true;
      dealBreakerReason = dealBreakerReason || 'Non-smoker only deal-breaker';
    }
  } else if (user.smoking === 'outside' && match.smoking === 'yes') {
    smokeScore = 75;
  } else {
    smokeScore = 70;
  }

  breakdown.push({
    category: 'Smoking Habit',
    attributeKey: 'smoking',
    score: smokeScore,
    userValue: SMOKING_LABELS[user.smoking] || user.smoking,
    matchValue: SMOKING_LABELS[match.smoking] || match.smoking,
    color: 'yellow',
    isDealBreakerTriggered: user.dealBreakers.smoking && user.smoking === 'no' && match.smoking !== 'no',
  });

  // 4. BUDGET OVERLAP
  let budgetScore = 100;
  const userOverlapMin = Math.max(user.budgetMin, match.budgetMin);
  const userOverlapMax = Math.min(user.budgetMax, match.budgetMax);

  if (userOverlapMin <= userOverlapMax) {
    budgetScore = 100;
    clicks.push(`Budget match: Shared range ₹${(userOverlapMin/1000).toFixed(0)}K – ₹${(userOverlapMax/1000).toFixed(0)}K`);
  } else {
    const diff = userOverlapMin - userOverlapMax;
    if (diff <= 3000) {
      budgetScore = 75;
      clicks.push('Close budget range (₹3K delta)');
    } else if (diff <= 8000) {
      budgetScore = 50;
      clashes.push(`Budget gap: roughly ₹${(diff/1000).toFixed(0)}K difference in targets`);
      if (user.dealBreakers.budget) {
        isDealBreakerTriggered = true;
        dealBreakerReason = dealBreakerReason || 'Budget range mismatch';
      }
    } else {
      budgetScore = 20;
      clashes.push(`Large budget divergence of ₹${(diff/1000).toFixed(0)}K`);
      if (user.dealBreakers.budget) {
        isDealBreakerTriggered = true;
        dealBreakerReason = dealBreakerReason || 'Budget range mismatch';
      }
    }
  }

  breakdown.push({
    category: 'Budget Range',
    attributeKey: 'budget',
    score: budgetScore,
    userValue: `₹${user.budgetMin / 1000}k–${user.budgetMax / 1000}k`,
    matchValue: `₹${match.budgetMin / 1000}k–${match.budgetMax / 1000}k`,
    color: 'yellow',
    isDealBreakerTriggered: user.dealBreakers.budget && userOverlapMin > userOverlapMax + 5000,
  });

  // 5. FOOD PREFERENCE
  let foodScore = 100;
  if (user.food === match.food) {
    foodScore = 100;
    clicks.push(`Dietary match: Both prefer ${FOOD_LABELS[user.food]}`);
  } else if ((user.food === 'veg' || user.food === 'jain') && match.food === 'non-veg') {
    foodScore = 40;
    clashes.push('Different food styles (Veg vs Non-veg kitchen storage/cookware)');
    if (user.dealBreakers.food) {
      isDealBreakerTriggered = true;
      dealBreakerReason = dealBreakerReason || 'Strict vegetarian kitchen required';
    }
  } else {
    foodScore = 75;
  }

  breakdown.push({
    category: 'Food & Kitchen',
    attributeKey: 'food',
    score: foodScore,
    userValue: FOOD_LABELS[user.food] || user.food,
    matchValue: FOOD_LABELS[match.food] || match.food,
    color: 'mint',
    isDealBreakerTriggered: user.dealBreakers.food && user.food === 'veg' && match.food === 'non-veg',
  });

  // 6. GUESTS
  const uGuestsIdx = GUESTS_ORDER.indexOf(user.guests);
  const mGuestsIdx = GUESTS_ORDER.indexOf(match.guests);
  const guestDiff = Math.abs(uGuestsIdx - mGuestsIdx);
  let guestScore = 100;
  if (guestDiff === 1) guestScore = 80;
  else if (guestDiff === 2) guestScore = 55;
  else if (guestDiff >= 3) guestScore = 25;

  if (guestDiff === 0) {
    clicks.push(`Social boundaries: Aligned on guests (${GUESTS_LABELS[user.guests]})`);
  } else if (guestDiff >= 2) {
    clashes.push(`Guest expectations: You prefer ${GUESTS_LABELS[user.guests]}, they prefer ${GUESTS_LABELS[match.guests]}`);
    if (user.dealBreakers.guests) {
      isDealBreakerTriggered = true;
      dealBreakerReason = dealBreakerReason || 'Guest policy deal-breaker';
    }
  }

  breakdown.push({
    category: 'Guest Policy',
    attributeKey: 'guests',
    score: guestScore,
    userValue: GUESTS_LABELS[user.guests] || user.guests,
    matchValue: GUESTS_LABELS[match.guests] || match.guests,
    color: 'blue',
    isDealBreakerTriggered: user.dealBreakers.guests && guestDiff >= 2,
  });

  // 7. NOISE
  const uNoiseIdx = NOISE_ORDER.indexOf(user.noise);
  const mNoiseIdx = NOISE_ORDER.indexOf(match.noise);
  const noiseDiff = Math.abs(uNoiseIdx - mNoiseIdx);
  let noiseScore = 100;
  if (noiseDiff === 1) noiseScore = 70;
  else if (noiseDiff >= 2) noiseScore = 30;

  if (noiseDiff === 0) {
    clicks.push(`Vibe balance: Both enjoy ${NOISE_LABELS[user.noise]}`);
  } else if (noiseDiff >= 2) {
    clashes.push(`Noise clash: You prefer ${NOISE_LABELS[user.noise]}, they prefer ${NOISE_LABELS[match.noise]}`);
  }

  breakdown.push({
    category: 'Noise Tolerance',
    attributeKey: 'noise',
    score: noiseScore,
    userValue: NOISE_LABELS[user.noise] || user.noise,
    matchValue: NOISE_LABELS[match.noise] || match.noise,
    color: 'pink',
  });

  // WEIGHTED CALCULATION
  const totalWeight =
    weights.sleep +
    weights.cleaning +
    weights.smoking +
    weights.budget +
    weights.food +
    weights.guests +
    weights.noise;

  const rawWeightedScore =
    (sleepScore * weights.sleep +
      cleanScore * weights.cleaning +
      smokeScore * weights.smoking +
      budgetScore * weights.budget +
      foodScore * weights.food +
      guestScore * weights.guests +
      noiseScore * weights.noise) /
    totalWeight;

  let finalScore = Math.round(rawWeightedScore);

  // DEAL-BREAKER LOGIC:
  // Any deal-breaker mismatch caps the score at 40% and shows deal-breaker amber alert
  if (isDealBreakerTriggered && finalScore > 40) {
    finalScore = 39;
  }

  return {
    profileId: match.id,
    overallScore: Math.min(99, Math.max(15, finalScore)),
    hasDealBreaker: isDealBreakerTriggered,
    dealBreakerReason,
    breakdown,
    clashes,
    clicks,
  };
}

