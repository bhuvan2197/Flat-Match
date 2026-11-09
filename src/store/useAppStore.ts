import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Profile,
  LivingPreferences,
  CompatibilityWeights,
  ShortlistNote,
  SafePathStatus,
  ChatMessage,
  ExpenseItem,
  ChoreItem,
  VibeCheckAnswers,
} from '../types';
import { DEFAULT_WEIGHTS } from '../lib/matchEngine';
import { MOCK_PROFILES } from '../data/mockProfiles';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  description?: string;
}

interface AppState {
  currentUser: Profile;
  isOnboarded: boolean;
  weights: CompatibilityWeights;
  
  // Discover & Actions
  passedProfileIds: string[];
  shortlist: ShortlistNote[];
  superLikedIds: string[];
  lastSwipedId: string | null;

  // Safe Path & Chat
  safePaths: Record<string, SafePathStatus>;
  chats: Record<string, ChatMessage[]>;

  // Tools
  expenses: ExpenseItem[];
  chores: ChoreItem[];

  // Discover Filters
  filters: {
    city: string;
    locality: string;
    lookingFor: 'all' | 'room' | 'flatmate' | 'flat-to-share';
    budgetMin: number;
    budgetMax: number;
    sortBy: 'match' | 'newest' | 'budget-low' | 'budget-high';
    viewMode: 'stack' | 'grid';
    onlyVerified: boolean;
  };

  // Toasts
  toasts: ToastMessage[];

  // Actions
  updateCurrentUser: (updates: Partial<Profile>) => void;
  updatePreferences: (prefs: Partial<LivingPreferences>) => void;
  updateWeights: (weights: Partial<CompatibilityWeights>) => void;
  setOnboarded: (val: boolean) => void;
  
  // Discover actions
  passProfile: (id: string) => void;
  shortlistProfile: (id: string, note?: string, tags?: string[]) => void;
  superLikeProfile: (id: string) => void;
  undoLastSwipe: () => void;
  removeShortlist: (id: string) => void;
  updateShortlistNote: (id: string, notes: string, tags: string[]) => void;

  // Safe path actions
  initSafePath: (matchId: string) => void;
  advanceSafeStep: (matchId: string, nextStep: 'chat' | 'verify' | 'meet') => void;
  submitVibeCheckAnswers: (matchId: string, answers: Partial<VibeCheckAnswers>, isUser: boolean) => void;
  updateMeetPlan: (matchId: string, plan: Partial<SafePathStatus['meetPlan']>) => void;

  // Chat actions
  sendMessage: (matchId: string, text: string, senderId?: string) => void;

  // Verification actions
  updateUserVerification: (tier: 'basic' | 'verified' | 'trusted', key: 'phone' | 'govtId' | 'selfie' | 'workEmail') => void;

  // Tools actions
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  toggleSettleExpense: (id: string) => void;
  deleteExpense: (id: string) => void;
  toggleChore: (id: string) => void;
  addChore: (chore: Omit<ChoreItem, 'id'>) => void;

  // Filters actions
  setFilter: (key: keyof AppState['filters'], value: any) => void;
  resetFilters: () => void;

  // Toast actions
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const DEFAULT_USER: Profile = {
  id: 'current-user',
  name: 'Rishabh (You)',
  age: 24,
  gender: 'male',
  occupation: 'Staff Frontend Engineer',
  companyOrCollege: 'Bangalore Tech',
  avatarBgColor: '#3DDBA5',
  bio: 'Product builder obsessed with clean code & spotless kitchens. Lights out by 11 PM, morning filter coffee, zero drama.',
  languages: ['English', 'Hindi'],
  lookingFor: 'room',
  city: 'Bengaluru',
  locality: 'Indiranagar',
  radiusKm: 5,
  budgetMin: 18000,
  budgetMax: 26000,
  sleep: 'by-11',
  cleaning: 'daily',
  smoking: 'no',
  drinking: 'social',
  food: 'veg',
  guests: 'day-only',
  workMode: 'hybrid',
  noise: 'silent',
  pets: 'loves-pets',
  dealBreakers: {
    sleep: true,
    cleaning: true,
    smoking: true,
    budget: true,
    food: false,
    guests: false,
    pets: false,
  },
  archetype: 'The Early-Bird Neat Freak',
  archetypeTagline: 'Lights out at 11, spotless kitchen, dependable flatmate',
  microHabitLine: '11 PM LIGHTS OUT · CLEANS KITCHEN DAILY · STRICT NON-SMOKER',
  verification: {
    phone: true,
    govtId: true,
    selfie: false,
    workEmail: true,
    tier: 'verified',
  },
  createdAt: '2026-11-08',
};

const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    title: 'Monthly Rent (3 BHK Indiranagar)',
    amount: 54000,
    category: 'rent',
    paidBy: 'Rishabh (You)',
    splitBetween: ['Rishabh (You)', 'Kabir Mehta', 'Aarav Patel'],
    date: '2026-11-01',
    settled: true,
  },
  {
    id: 'exp-2',
    title: 'High-Speed 300 Mbps Fiber WiFi',
    amount: 1499,
    category: 'wifi',
    paidBy: 'Kabir Mehta',
    splitBetween: ['Rishabh (You)', 'Kabir Mehta', 'Aarav Patel'],
    date: '2026-11-04',
    settled: false,
  },
  {
    id: 'exp-3',
    title: 'Full-time Cook + Maid Charges',
    amount: 12000,
    category: 'cook',
    paidBy: 'Rishabh (You)',
    splitBetween: ['Rishabh (You)', 'Kabir Mehta', 'Aarav Patel'],
    date: '2026-11-05',
    settled: false,
  },
  {
    id: 'exp-4',
    title: 'Shared Pantry Essentials & Milk (Zepto)',
    amount: 2850,
    category: 'groceries',
    paidBy: 'Aarav Patel',
    splitBetween: ['Rishabh (You)', 'Kabir Mehta', 'Aarav Patel'],
    date: '2026-11-07',
    settled: false,
  },
];

const INITIAL_CHORES: ChoreItem[] = [
  { id: 'ch-1', task: 'Deep Clean Kitchen & Wipe Stovetop', assignedTo: 'Rishabh (You)', day: 'Mon', completed: true },
  { id: 'ch-2', task: 'Living Room Dusting & Balcony Plants', assignedTo: 'Kabir Mehta', day: 'Tue', completed: false },
  { id: 'ch-3', task: 'Trash & Wet Waste Segregation Bin', assignedTo: 'Aarav Patel', day: 'Wed', completed: true },
  { id: 'ch-4', task: 'Fridge Cleanup & Expired Items Check', assignedTo: 'Rishabh (You)', day: 'Thu', completed: false },
  { id: 'ch-5', task: 'Restock Pantry & Dishwasher Pods', assignedTo: 'Kabir Mehta', day: 'Sat', completed: false },
  { id: 'ch-6', task: 'Bathroom Deep Clean & Disinfectant', assignedTo: 'Aarav Patel', day: 'Sun', completed: false },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: DEFAULT_USER,
      isOnboarded: true,
      weights: DEFAULT_WEIGHTS,
      
      passedProfileIds: [],
      shortlist: [
        {
          profileId: 'ananya-25',
          notes: 'Exact match on 11 PM bedtime & daily kitchen cleaning. Swiggy designer!',
          tags: ['Top pick', 'High compatibility', 'Call soon'],
          addedAt: '2026-11-08T14:30:00Z',
        },
        {
          profileId: 'kabir-24',
          notes: 'Great aesthetic flat in Indiranagar 100ft Rd, but need to check sleep hours.',
          tags: ['Indiranagar flat', 'Has flat'],
          addedAt: '2026-11-08T16:15:00Z',
        },
      ],
      superLikedIds: ['ananya-25'],
      lastSwipedId: null,

      safePaths: {
        'kabir-24': {
          matchId: 'kabir-24',
          step: 'chat',
          chatUnlocked: true,
          verifyUnlocked: true,
          meetUnlocked: false,
          vibeCheckUserAnswers: {
            wakeTime: '8:00 AM – 9:30 AM',
            weekendStyle: 'Quiet Netflix & sleep by 11',
            cookingRole: 'Full-time cook split 50:50',
            guestPolicy: 'Prior notice in WhatsApp group',
            acThermostat: '24°C eco comfort',
          },
          vibeCheckMatchAnswers: {
            wakeTime: 'Past Noon (Night Owl)',
            weekendStyle: 'Board games & chill friends over',
            cookingRole: 'Full-time cook split 50:50',
            guestPolicy: 'Weekends totally welcome',
            acThermostat: '18°C arctic freezer',
          },
          meetPlan: {
            venueName: 'Third Wave Coffee, 12th Main Indiranagar',
            venueAddress: '12th Main Rd, HAL 2nd Stage, Indiranagar',
            dateTime: 'Saturday, 4:30 PM',
            sharedWithContact: true,
            hasArrived: false,
          },
        },
        'ananya-25': {
          matchId: 'ananya-25',
          step: 'verify',
          chatUnlocked: true,
          verifyUnlocked: true,
          meetUnlocked: true,
          vibeCheckUserAnswers: {
            wakeTime: '8:00 AM – 9:30 AM',
            weekendStyle: 'Quiet Netflix & sleep by 11',
            cookingRole: 'We cook together & split groceries',
            guestPolicy: 'Prior notice in WhatsApp group',
            acThermostat: '24°C eco comfort',
          },
          vibeCheckMatchAnswers: {
            wakeTime: 'Before 7:30 AM',
            weekendStyle: 'Cooking dinner & listening to podcasts',
            cookingRole: 'We cook together & split groceries',
            guestPolicy: 'Prior notice in WhatsApp group',
            acThermostat: '24°C eco comfort',
          },
          meetPlan: {
            venueName: 'Araku Coffee Flagship',
            venueAddress: '100ft Road, Indiranagar, Bengaluru',
            dateTime: 'Sunday, 11:00 AM',
            sharedWithContact: true,
            hasArrived: false,
          },
        },
      },

      chats: {
        'kabir-24': [
          {
            id: 'm-1',
            senderId: 'system',
            text: 'Safe Path initiated. Step 1: Vibe Check Chat unlocked.',
            timestamp: 'Yesterday, 6:00 PM',
            isSystem: true,
          },
          {
            id: 'm-2',
            senderId: 'kabir-24',
            text: 'Hey Rishabh! Saw your profile. The 3 BHK flat in Indiranagar has one master room available with a private balcony. Rent is ₹22k.',
            timestamp: 'Yesterday, 6:02 PM',
          },
          {
            id: 'm-3',
            senderId: 'current-user',
            text: 'Hey Kabir, sounds awesome! Indiranagar is ideal for me. I usually sleep by 11 PM on weekdays though — how loud do studio sessions get?',
            timestamp: 'Yesterday, 6:05 PM',
          },
          {
            id: 'm-4',
            senderId: 'kabir-24',
            text: 'Fair question! After 10:30 PM I strictly switch to closed-back studio monitor headphones. Zero sound leaks. You will get deep sleep 🎧',
            timestamp: 'Yesterday, 6:07 PM',
          },
        ],
        'ananya-25': [
          {
            id: 'a-1',
            senderId: 'system',
            text: 'Match Compatibility 94%! Verified profiles connected.',
            timestamp: 'Today, 10:00 AM',
            isSystem: true,
          },
          {
            id: 'a-2',
            senderId: 'ananya-25',
            text: 'Hey! Loved your archetype "The Early-Bird Neat Freak" haha. It is so rare to find someone who actually cleans the kitchen immediately.',
            timestamp: 'Today, 10:02 AM',
          },
          {
            id: 'a-3',
            senderId: 'current-user',
            text: 'Haha 100%! Dirty pans in the sink overnight are my biggest pet peeve. Are you looking at 2 BHKs around Koramangala 4th/5th Block?',
            timestamp: 'Today, 10:06 AM',
          },
          {
            id: 'a-4',
            senderId: 'ananya-25',
            text: 'Yes! Exactly there. Let’s do the ID verify and grab a quick coffee at Araku this Sunday to check vibe?',
            timestamp: 'Today, 10:08 AM',
          },
        ],
      },

      expenses: INITIAL_EXPENSES,
      chores: INITIAL_CHORES,

      filters: {
        city: 'Bengaluru',
        locality: 'All Localities',
        lookingFor: 'all',
        budgetMin: 5000,
        budgetMax: 60000,
        sortBy: 'match',
        viewMode: 'stack',
        onlyVerified: false,
      },

      toasts: [],

      updateCurrentUser: (updates) =>
        set((state) => ({ currentUser: { ...state.currentUser, ...updates } })),

      updatePreferences: (prefs) =>
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            ...prefs,
            dealBreakers: { ...state.currentUser.dealBreakers, ...(prefs.dealBreakers || {}) },
          },
        })),

      updateWeights: (weights) =>
        set((state) => ({ weights: { ...state.weights, ...weights } })),

      setOnboarded: (val) => set({ isOnboarded: val }),

      passProfile: (id) => {
        set((state) => ({
          passedProfileIds: [...state.passedProfileIds, id],
          lastSwipedId: id,
        }));
      },

      shortlistProfile: (id, note = '', tags = ['Shortlisted']) => {
        const state = get();
        if (state.shortlist.some((s) => s.profileId === id)) return;
        set({
          shortlist: [
            {
              profileId: id,
              notes: note,
              tags: tags.length ? tags : ['Shortlisted'],
              addedAt: new Date().toISOString(),
            },
            ...state.shortlist,
          ],
          lastSwipedId: id,
        });
        get().addToast({
          type: 'success',
          title: 'Added to Shortlist',
          description: 'You can compare and review notes in your Shortlist tab.',
        });
      },

      superLikeProfile: (id) => {
        const state = get();
        set({
          superLikedIds: [...state.superLikedIds, id],
          lastSwipedId: id,
        });
        get().shortlistProfile(id, 'Super-interested! High priority follow-up.', ['★ Super Match']);
        get().initSafePath(id);
      },

      undoLastSwipe: () => {
        const state = get();
        if (!state.lastSwipedId) return;
        const targetId = state.lastSwipedId;
        set({
          passedProfileIds: state.passedProfileIds.filter((id) => id !== targetId),
          shortlist: state.shortlist.filter((item) => item.profileId !== targetId),
          superLikedIds: state.superLikedIds.filter((id) => id !== targetId),
          lastSwipedId: null,
        });
        get().addToast({
          type: 'info',
          title: 'Action Undone',
          description: 'Restored previous profile to the stack.',
        });
      },

      removeShortlist: (id) =>
        set((state) => ({
          shortlist: state.shortlist.filter((s) => s.profileId !== id),
        })),

      updateShortlistNote: (id, notes, tags) =>
        set((state) => ({
          shortlist: state.shortlist.map((item) =>
            item.profileId === id ? { ...item, notes, tags } : item
          ),
        })),

      initSafePath: (matchId) => {
        const state = get();
        if (!state.safePaths[matchId]) {
          set({
            safePaths: {
              ...state.safePaths,
              [matchId]: {
                matchId,
                step: 'chat',
                chatUnlocked: true,
                verifyUnlocked: false,
                meetUnlocked: false,
              },
            },
          });
        }
      },

      advanceSafeStep: (matchId, nextStep) => {
        set((state) => {
          const current = state.safePaths[matchId] || {
            matchId,
            step: 'chat',
            chatUnlocked: true,
            verifyUnlocked: false,
            meetUnlocked: false,
          };
          return {
            safePaths: {
              ...state.safePaths,
              [matchId]: {
                ...current,
                step: nextStep,
                verifyUnlocked: nextStep === 'verify' || nextStep === 'meet' ? true : current.verifyUnlocked,
                meetUnlocked: nextStep === 'meet' ? true : current.meetUnlocked,
              },
            },
          };
        });
      },

      submitVibeCheckAnswers: (matchId, answers, isUser) => {
        set((state) => {
          const current = state.safePaths[matchId] || {
            matchId,
            step: 'chat',
            chatUnlocked: true,
            verifyUnlocked: false,
            meetUnlocked: false,
          };
          return {
            safePaths: {
              ...state.safePaths,
              [matchId]: {
                ...current,
                vibeCheckUserAnswers: isUser
                  ? { ...current.vibeCheckUserAnswers, ...answers }
                  : current.vibeCheckUserAnswers,
                vibeCheckMatchAnswers: !isUser
                  ? { ...current.vibeCheckMatchAnswers, ...answers }
                  : current.vibeCheckMatchAnswers,
              },
            },
          };
        });
      },

      updateMeetPlan: (matchId, plan) => {
        set((state) => {
          const current = state.safePaths[matchId];
          if (!current) return state;
          const p = plan || {};
          return {
            safePaths: {
              ...state.safePaths,
              [matchId]: {
                ...current,
                meetPlan: {
                  venueName: p.venueName || current.meetPlan?.venueName || 'Third Wave Coffee',
                  venueAddress: p.venueAddress || current.meetPlan?.venueAddress || 'Indiranagar',
                  dateTime: p.dateTime || current.meetPlan?.dateTime || 'Saturday, 4:00 PM',
                  sharedWithContact: p.sharedWithContact ?? current.meetPlan?.sharedWithContact ?? false,
                  hasArrived: p.hasArrived ?? current.meetPlan?.hasArrived ?? false,
                  postMeetVerdict: p.postMeetVerdict ?? current.meetPlan?.postMeetVerdict,
                  postMeetNotes: p.postMeetNotes ?? current.meetPlan?.postMeetNotes,
                },
              },
            },
          };
        });
      },

      sendMessage: (matchId, text, senderId = 'current-user') => {
        const msgId = 'msg-' + Date.now();
        const newMsg: ChatMessage = {
          id: msgId,
          senderId,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        set((state) => ({
          chats: {
            ...state.chats,
            [matchId]: [...(state.chats[matchId] || []), newMsg],
          },
        }));

        // Simulated reply if sent by current-user
        if (senderId === 'current-user') {
          const profile = MOCK_PROFILES.find((p) => p.id === matchId);
          const replies = [
            `Hey! Absolutely, that sounds great to me. Let's make sure our schedules align.`,
            `100%! I appreciate honest upfront communication. FlatMatch saves so much awkwardness!`,
            `Awesome! Ready to verify IDs and set up a quick 20-min coffee this weekend?`,
            `Totally agree with you on that. Keeping boundaries clear from day one is key.`,
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];

          setTimeout(() => {
            set((state) => ({
              chats: {
                ...state.chats,
                [matchId]: [
                  ...(state.chats[matchId] || []),
                  {
                    id: 'reply-' + Date.now(),
                    senderId: matchId,
                    text: randomReply,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ],
              },
            }));
          }, 1200);
        }
      },

      updateUserVerification: (tier, key) => {
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            verification: {
              ...state.currentUser.verification,
              [key]: true,
              tier,
            },
          },
        }));
      },

      addExpense: (expense) => {
        const item: ExpenseItem = {
          ...expense,
          id: 'exp-' + Date.now(),
        };
        set((state) => ({ expenses: [item, ...state.expenses] }));
      },

      toggleSettleExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, settled: !e.settled } : e)),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));
      },

      toggleChore: (id) => {
        set((state) => ({
          chores: state.chores.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c)),
        }));
      },

      addChore: (chore) => {
        const item: ChoreItem = {
          ...chore,
          id: 'ch-' + Date.now(),
        };
        set((state) => ({ chores: [...state.chores, item] }));
      },

      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }));
      },

      resetFilters: () => {
        set((state) => ({
          filters: {
            city: 'Bengaluru',
            locality: 'All Localities',
            lookingFor: 'all',
            budgetMin: 5000,
            budgetMax: 60000,
            sortBy: 'match',
            viewMode: 'stack',
            onlyVerified: false,
          },
        }));
      },

      addToast: (toast) => {
        const id = 'toast-' + Date.now();
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
        setTimeout(() => {
          get().removeToast(id);
        }, 3500);
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: 'flatmatch-storage-v1',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isOnboarded: state.isOnboarded,
        weights: state.weights,
        passedProfileIds: state.passedProfileIds,
        shortlist: state.shortlist,
        superLikedIds: state.superLikedIds,
        safePaths: state.safePaths,
        chats: state.chats,
        expenses: state.expenses,
        chores: state.chores,
        filters: state.filters,
      }),
    }
  )
);
