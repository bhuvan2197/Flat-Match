export type SleepSchedule = 'before-10' | 'by-11' | 'midnight' | 'night-owl';
export type CleaningFrequency = 'daily' | 'few-times-week' | 'weekly' | 'when-messy';
export type SmokingHabit = 'no' | 'outside' | 'yes';
export type DrinkingHabit = 'never' | 'social' | 'often';
export type FoodPreference = 'veg' | 'non-veg' | 'eggetarian' | 'jain';
export type GuestPolicy = 'never' | 'day-only' | 'weekends' | 'anytime';
export type WorkMode = 'wfh' | 'office' | 'hybrid' | 'student';
export type NoiseTolerance = 'silent' | 'moderate' | 'party-friendly';
export type PetPreference = 'no-pets' | 'has-pets' | 'loves-pets';

export interface DealBreakers {
  sleep: boolean;
  cleaning: boolean;
  smoking: boolean;
  budget: boolean;
  food: boolean;
  guests: boolean;
  pets: boolean;
}

export interface CompatibilityWeights {
  sleep: number;
  cleaning: number;
  smoking: number;
  budget: number;
  food: number;
  guests: number;
  noise: number;
}

export interface VerificationTier {
  phone: boolean;
  govtId: boolean;
  selfie: boolean;
  workEmail: boolean;
  tier: 'none' | 'basic' | 'verified' | 'trusted';
}

export interface LivingPreferences {
  budgetMin: number;
  budgetMax: number;
  city: string;
  locality: string;
  radiusKm: number;
  sleep: SleepSchedule;
  cleaning: CleaningFrequency;
  smoking: SmokingHabit;
  drinking: DrinkingHabit;
  food: FoodPreference;
  guests: GuestPolicy;
  workMode: WorkMode;
  noise: NoiseTolerance;
  pets: PetPreference;
  dealBreakers: DealBreakers;
}

export interface Profile extends LivingPreferences {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary';
  occupation: string;
  companyOrCollege: string;
  avatarBgColor?: string;
  avatarUrl?: string;
  bio: string;
  languages: string[];
  lookingFor: 'room' | 'flatmate' | 'flat-to-share';
  archetype: string;
  archetypeTagline: string;
  microHabitLine: string;
  verification: VerificationTier;
  createdAt: string;
  hasFlat?: boolean;
  flatDetails?: {
    bhk: string;
    rent: number;
    deposit: number;
    furnishing: 'fully' | 'semi' | 'unfurnished';
    availableFrom: string;
    photos: string[];
    address: string;
  };
}

export interface CategoryBreakdown {
  category: string;
  attributeKey: 'sleep' | 'cleaning' | 'smoking' | 'budget' | 'food' | 'guests' | 'noise';
  score: number;
  userValue: string;
  matchValue: string;
  color: 'mint' | 'yellow' | 'blue' | 'pink';
  isDealBreakerTriggered?: boolean;
}

export interface MatchResult {
  profileId: string;
  overallScore: number;
  hasDealBreaker: boolean;
  dealBreakerReason?: string;
  breakdown: CategoryBreakdown[];
  clashes: string[];
  clicks: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface VibeCheckAnswers {
  wakeTime: string;
  weekendStyle: string;
  cookingRole: string;
  guestPolicy: string;
  acThermostat: string;
}

export interface SafePathStatus {
  matchId: string;
  step: 'chat' | 'verify' | 'meet';
  chatUnlocked: boolean;
  verifyUnlocked: boolean;
  meetUnlocked: boolean;
  vibeCheckUserAnswers?: Partial<VibeCheckAnswers>;
  vibeCheckMatchAnswers?: Partial<VibeCheckAnswers>;
  meetPlan?: {
    venueName: string;
    venueAddress: string;
    dateTime: string;
    sharedWithContact: boolean;
    hasArrived: boolean;
    postMeetVerdict?: 'yes' | 'maybe' | 'no';
    postMeetNotes?: string;
  };
}

export interface ShortlistNote {
  profileId: string;
  notes: string;
  tags: string[];
  addedAt: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'rent' | 'electricity' | 'wifi' | 'groceries' | 'maid' | 'cook' | 'other';
  paidBy: string; // name
  splitBetween: string[]; // names
  date: string;
  settled: boolean;
}

export interface ChoreItem {
  id: string;
  task: string;
  assignedTo: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  completed: boolean;
}

