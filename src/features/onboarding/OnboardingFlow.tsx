import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  MapPin,
  Moon,
  Sparkles,
  Cigarette,
  Wine,
  Utensils,
  User,
  Users,
  Briefcase,
  Volume2,
  Heart,
  Camera,
  Share2,
  ArrowRight,
  ArrowLeft,
  Check,
  Download,
  AlertCircle,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { useAppStore } from '../../store/useAppStore';
import { determineArchetype } from '../../lib/archetypes';
import { CITIES_DATA, ALL_LOCALITIES } from '../../data/localities';
import { HighlightWord } from '../../components/ui/HighlightWord';
import { CheckBadge } from '../../components/ui/CheckBadge';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import {
  SleepSchedule,
  CleaningFrequency,
  SmokingHabit,
  DrinkingHabit,
  FoodPreference,
  GuestPolicy,
  WorkMode,
  NoiseTolerance,
  PetPreference,
} from '../../types';

export const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser, updatePreferences, setOnboarded, addToast } = useAppStore();

  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Local form state initialized from store
  const [formData, setFormData] = useState({
    name: currentUser.name === 'Rishabh (You)' ? 'Rishabh' : currentUser.name,
    age: currentUser.age || 24,
    gender: currentUser.gender || 'male',
    occupation: currentUser.occupation || 'Staff Frontend Engineer',
    companyOrCollege: currentUser.companyOrCollege || 'Bangalore Tech',
    bio: currentUser.bio || 'Product builder obsessed with clean code & spotless kitchens. Lights out by 11 PM, morning filter coffee, zero drama.',
    languages: currentUser.languages || ['English', 'Hindi'],
    city: currentUser.city || 'Bengaluru',
    locality: currentUser.locality || 'Indiranagar',
    radiusKm: currentUser.radiusKm || 5,
    budgetMin: currentUser.budgetMin || 18000,
    budgetMax: currentUser.budgetMax || 26000,
    sleep: currentUser.sleep as SleepSchedule,
    cleaning: currentUser.cleaning as CleaningFrequency,
    smoking: currentUser.smoking as SmokingHabit,
    drinking: currentUser.drinking as DrinkingHabit,
    food: currentUser.food as FoodPreference,
    guests: currentUser.guests as GuestPolicy,
    workMode: currentUser.workMode as WorkMode,
    noise: currentUser.noise as NoiseTolerance,
    pets: currentUser.pets as PetPreference,
    dealBreakers: { ...currentUser.dealBreakers },
  });

  const [isExporting, setIsExporting] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const archetype = determineArchetype(formData);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save and finish
      updateCurrentUser({
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        occupation: formData.occupation,
        companyOrCollege: formData.companyOrCollege,
        bio: formData.bio,
        languages: formData.languages,
        archetype: archetype.title,
        archetypeTagline: archetype.tagline,
        microHabitLine: `${formData.sleep === 'by-11' ? '11 PM BED' : formData.sleep.toUpperCase()} · ${formData.cleaning.toUpperCase()} CLEAN · ${formData.smoking === 'no' ? 'NON-SMOKER' : 'SMOKER'}`,
      });
      updatePreferences({
        city: formData.city,
        locality: formData.locality,
        radiusKm: formData.radiusKm,
        budgetMin: formData.budgetMin,
        budgetMax: formData.budgetMax,
        sleep: formData.sleep,
        cleaning: formData.cleaning,
        smoking: formData.smoking,
        drinking: formData.drinking,
        food: formData.food,
        guests: formData.guests,
        workMode: formData.workMode,
        noise: formData.noise,
        pets: formData.pets,
        dealBreakers: formData.dealBreakers,
      });
      setOnboarded(true);
      addToast({
        type: 'success',
        title: 'Lifestyle Profile Saved!',
        description: `You are "${archetype.title}". Ready to discover flatmates.`,
      });
      setStep(8); // Summary screen
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleExportStory = async () => {
    if (!shareCardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `flatmatch-living-style-${formData.name.toLowerCase()}.png`;
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
        description: 'Could not generate story image right now.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // AI-suggested bio openers
  const bioStarters = [
    "Lights off by 11 PM, morning filter coffee, clean kitchen policy.",
    "WFH engineer. Respect personal space, love Sunday board games & chai.",
    "Gym at 7 AM, office till evening. Ultra organized, prompt bill payer.",
    "Creative director. Bass on headphones after 10 PM. Clean common areas.",
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Step Indicator & Progress */}
      {step <= totalSteps && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-micro text-muted mb-2">
            <span>
              STEP {step} OF {totalSteps}
            </span>
            <span className="text-mint font-bold">{Math.round((step / totalSteps) * 100)}% COMPLETE</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-mint"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Screen Form Container */}
      <div className="bg-surface border border-white/10 rounded-3xl p-6 sm:p-9 shadow-2xl relative">
        <AnimatePresence mode="wait">
          {/* STEP 1: BUDGET (yellow) */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-xs text-yellow uppercase tracking-micro font-bold">
                  STEP 1 • BUDGET
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
                  What's your monthly <HighlightWord color="yellow">rent budget?</HighlightWord>
                </h2>
                <p className="text-xs text-muted mt-1">Per person for a private room in a shared flat.</p>
              </div>

              {/* Display current target */}
              <div className="p-5 rounded-2xl bg-surface-2 border border-yellow/50 text-center shadow-yellow-glow">
                <span className="font-mono text-xs uppercase text-muted">TARGET RENT RANGE</span>
                <p className="text-3xl sm:text-4xl font-heading font-black text-white mt-1">
                  ₹{(formData.budgetMin / 1000).toFixed(0)}k – ₹{(formData.budgetMax / 1000).toFixed(0)}k
                  <span className="text-xs text-muted font-normal"> / month</span>
                </p>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { label: '₹8k – ₹12k', min: 8000, max: 12000 },
                  { label: '₹12k – ₹18k', min: 12000, max: 18000 },
                  { label: '₹18k – ₹26k', min: 18000, max: 26000, popular: true },
                  { label: '₹25k – ₹35k', min: 25000, max: 35000 },
                  { label: '₹35k – ₹50k', min: 35000, max: 50000 },
                  { label: '₹50k+', min: 45000, max: 65000 },
                ].map((preset) => {
                  const isSelected =
                    formData.budgetMin === preset.min && formData.budgetMax === preset.max;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => setFormData({ ...formData, budgetMin: preset.min, budgetMax: preset.max })}
                      className={`p-3 rounded-xl border text-center transition-all font-mono text-xs uppercase tracking-micro flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-yellow bg-yellow/15 text-yellow font-bold shadow-sm'
                          : 'border-white/10 bg-surface-2 text-white hover:border-white/20'
                      }`}
                    >
                      <span>{preset.label}</span>
                      {preset.popular && (
                        <span className="text-[9px] text-yellow font-bold mt-0.5">MOST POPULAR</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Deal-breaker toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5">
                <div>
                  <p className="text-xs font-heading font-bold text-white">Budget is a strict deal-breaker</p>
                  <p className="text-[11px] text-muted">Don't show flatmates above my budget max</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.dealBreakers.budget}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dealBreakers: { ...formData.dealBreakers, budget: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-yellow rounded cursor-pointer"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: LOCATION (blue) */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-xs text-blue uppercase tracking-micro font-bold">
                  STEP 2 • LOCATION
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
                  Where in India do you <HighlightWord color="blue">want to live?</HighlightWord>
                </h2>
                <p className="text-xs text-muted mt-1">Choose your primary city and target neighbourhood.</p>
              </div>

              {/* City selector */}
              <div>
                <label className="text-xs font-mono text-muted uppercase block mb-2">City</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CITIES_DATA.map((c) => (
                    <button
                      key={c.city}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          city: c.city,
                          locality: c.localities[0] || 'Any',
                        })
                      }
                      className={`p-3 rounded-xl border text-xs font-mono uppercase tracking-micro text-center transition-all ${
                        formData.city === c.city
                          ? 'border-blue bg-blue/15 text-blue font-bold'
                          : 'border-white/10 bg-surface-2 text-white hover:border-white/20'
                      }`}
                    >
                      {c.city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Locality Autocomplete / Picker */}
              <div>
                <label className="text-xs font-mono text-muted uppercase block mb-2">
                  Locality in {formData.city}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    CITIES_DATA.find((c) => c.city === formData.city)?.localities || []
                  ).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setFormData({ ...formData, locality: loc })}
                      className={`p-2.5 rounded-xl border text-xs font-sans text-left transition-all ${
                        formData.locality === loc
                          ? 'border-blue bg-blue/15 text-white font-bold'
                          : 'border-white/10 bg-surface-2 text-white/80 hover:border-white/20'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Radius slider */}
              <div className="p-4 rounded-2xl bg-surface-2 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted uppercase">Search Radius</span>
                  <span className="text-blue font-bold">{formData.radiusKm} km radius</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={formData.radiusKm}
                  onChange={(e) => setFormData({ ...formData, radiusKm: Number(e.target.value) })}
                  className="w-full accent-blue cursor-pointer"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 3: SLEEP SCHEDULE (pink) */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-xs text-pink uppercase tracking-micro font-bold">
                  STEP 3 • SLEEP
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
                  What time is <HighlightWord color="pink">lights out?</HighlightWord>
                </h2>
                <p className="text-xs text-muted mt-1">
                  The #1 cause of flatmate divorce. Be painfully honest.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    value: 'before-10' as SleepSchedule,
                    title: 'Before 10:00 PM',
                    desc: 'Early bird. Sunrise runner, deep uninterrupted sleep.',
                    icon: '🌅',
                  },
                  {
                    value: 'by-11' as SleepSchedule,
                    title: 'By 11:00 PM',
                    desc: 'Balanced routine. Winding down with book or podcast by 10:30.',
                    icon: '🌙',
                  },
                  {
                    value: 'midnight' as SleepSchedule,
                    title: 'Around Midnight',
                    desc: 'Normal urban rhythm. Off screens around 12:00 – 12:30 AM.',
                    icon: '⭐',
                  },
                  {
                    value: 'night-owl' as SleepSchedule,
                    title: 'Night Owl (2:00 AM+)',
                    desc: 'Life begins after dark. Coding, gaming, or late calls.',
                    icon: '🦉',
                  },
                ].map((opt) => {
                  const isSelected = formData.sleep === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, sleep: opt.value })}
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-pink bg-pink/15 shadow-pink-glow'
                          : 'border-white/10 bg-surface-2 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-2xl">{opt.icon}</span>
                        <div>
                          <h4 className="text-sm font-heading font-black text-white">{opt.title}</h4>
                          <p className="text-xs text-muted">{opt.desc}</p>
                        </div>
                      </div>
                      <CheckBadge color="pink" size="md" checked={isSelected} />
                    </div>
                  );
                })}
              </div>

              {/* Deal-breaker toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5">
                <div>
                  <p className="text-xs font-heading font-bold text-white">Strict sleep deal-breaker</p>
                  <p className="text-[11px] text-muted">Never match me with night owls / early birds</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.dealBreakers.sleep}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dealBreakers: { ...formData.dealBreakers, sleep: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-pink rounded cursor-pointer"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 4: CLEANING (mint) */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-xs text-mint uppercase tracking-micro font-bold">
                  STEP 4 • CLEANLINESS
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
                  How often do you <HighlightWord color="mint">clean up?</HighlightWord>
                </h2>
                <p className="text-xs text-muted mt-1">Dishes, kitchen counters, and shared spaces.</p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    value: 'daily' as CleaningFrequency,
                    title: 'Every single day',
                    desc: 'Counters wiped after cooking, sink cleared immediately. Spotless.',
                    icon: '✨',
                  },
                  {
                    value: 'few-times-week' as CleaningFrequency,
                    title: 'A few times a week',
                    desc: 'Maid visits daily or we alternate. Tidy enough to invite guests.',
                    icon: '🧹',
                  },
                  {
                    value: 'weekly' as CleaningFrequency,
                    title: 'Weekly deep clean',
                    desc: 'Light maintenance through the week, big reset every Sunday.',
                    icon: '🧽',
                  },
                  {
                    value: 'when-messy' as CleaningFrequency,
                    title: "When it's messy / Chill",
                    desc: 'Relaxed about small clutter. Clean when things pile up.',
                    icon: '🛋️',
                  },
                ].map((opt) => {
                  const isSelected = formData.cleaning === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, cleaning: opt.value })}
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-mint bg-mint/15 shadow-mint-glow'
                          : 'border-white/10 bg-surface-2 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-2xl">{opt.icon}</span>
                        <div>
                          <h4 className="text-sm font-heading font-black text-white">{opt.title}</h4>
                          <p className="text-xs text-muted">{opt.desc}</p>
                        </div>
                      </div>
                      <CheckBadge color="mint" size="md" checked={isSelected} />
                    </div>
                  );
                })}
              </div>

              {/* Deal-breaker toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5">
                <div>
                  <p className="text-xs font-heading font-bold text-white">Hygiene deal-breaker</p>
                  <p className="text-[11px] text-muted">Must align with my cleaning frequency</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.dealBreakers.cleaning}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dealBreakers: { ...formData.dealBreakers, cleaning: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-mint rounded cursor-pointer"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 5: SMOKING & DRINKING (yellow) */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-xs text-yellow uppercase tracking-micro font-bold">
                  STEP 5 • SUBSTANCES
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
                  Smoking & drinking <HighlightWord color="yellow">habits</HighlightWord>
                </h2>
                <p className="text-xs text-muted mt-1">Set clear boundaries so nobody has to compromise.</p>
              </div>

              {/* Smoking */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted uppercase">Smoking Habit</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { value: 'no' as SmokingHabit, label: 'Non-Smoker', icon: '🚭' },
                    { value: 'outside' as SmokingHabit, label: 'Outside / Balcony', icon: '🌿' },
                    { value: 'yes' as SmokingHabit, label: 'Smoker', icon: '🚬' },
                  ].map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setFormData({ ...formData, smoking: s.value })}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        formData.smoking === s.value
                          ? 'border-yellow bg-yellow/15 text-white font-bold'
                          : 'border-white/10 bg-surface-2 text-muted hover:border-white/20'
                      }`}
                    >
                      <div className="text-xl mb-1">{s.icon}</div>
                      <span className="text-xs font-heading">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drinking */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted uppercase">Drinking Habit</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { value: 'never' as DrinkingHabit, label: 'Never Drinks', icon: '🧃' },
                    { value: 'social' as DrinkingHabit, label: 'Social Drinks', icon: '🍻' },
                    { value: 'often' as DrinkingHabit, label: 'Often / Weekends', icon: '🍷' },
                  ].map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setFormData({ ...formData, drinking: d.value })}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        formData.drinking === d.value
                          ? 'border-yellow bg-yellow/15 text-white font-bold'
                          : 'border-white/10 bg-surface-2 text-muted hover:border-white/20'
                      }`}
                    >
                      <div className="text-xl mb-1">{d.icon}</div>
                      <span className="text-xs font-heading">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deal-breaker */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5">
                <div>
                  <p className="text-xs font-heading font-bold text-white">Strict non-smoking deal-breaker</p>
                  <p className="text-[11px] text-muted">Never show active smokers</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.dealBreakers.smoking}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dealBreakers: { ...formData.dealBreakers, smoking: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-yellow rounded cursor-pointer"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 6: EXTRAS (Food, Guests, Work, Noise, Pets) */}
          {step === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <span className="font-mono text-xs text-mint uppercase tracking-micro font-bold">
                  STEP 6 • HOUSE CULTURE
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
                  Food, guests & <HighlightWord color="mint">daily rhythm</HighlightWord>
                </h2>
              </div>

              {/* Food */}
              <div>
                <label className="text-[11px] font-mono text-muted uppercase block mb-1.5">Dietary Preference</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { val: 'veg' as FoodPreference, label: 'Pure Veg' },
                    { val: 'eggetarian' as FoodPreference, label: 'Eggetarian' },
                    { val: 'non-veg' as FoodPreference, label: 'Non-Veg' },
                    { val: 'jain' as FoodPreference, label: 'Jain Food' },
                  ].map((f) => (
                    <button
                      key={f.val}
                      onClick={() => setFormData({ ...formData, food: f.val })}
                      className={`p-2.5 rounded-xl border text-xs font-sans text-center transition-all ${
                        formData.food === f.val
                          ? 'border-mint bg-mint/15 text-white font-bold'
                          : 'border-white/10 bg-surface-2 text-muted'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="text-[11px] font-mono text-muted uppercase block mb-1.5">Guest Policy</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { val: 'never' as GuestPolicy, label: 'No Guests' },
                    { val: 'day-only' as GuestPolicy, label: 'Day-time only' },
                    { val: 'weekends' as GuestPolicy, label: 'Weekends ok' },
                    { val: 'anytime' as GuestPolicy, label: 'Open door' },
                  ].map((g) => (
                    <button
                      key={g.val}
                      onClick={() => setFormData({ ...formData, guests: g.val })}
                      className={`p-2.5 rounded-xl border text-xs font-sans text-center transition-all ${
                        formData.guests === g.val
                          ? 'border-blue bg-blue/15 text-white font-bold'
                          : 'border-white/10 bg-surface-2 text-muted'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work Mode */}
              <div>
                <label className="text-[11px] font-mono text-muted uppercase block mb-1.5">Work Mode</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { val: 'wfh' as WorkMode, label: 'WFH Daily' },
                    { val: 'hybrid' as WorkMode, label: 'Hybrid' },
                    { val: 'office' as WorkMode, label: 'Office Daily' },
                    { val: 'student' as WorkMode, label: 'Student' },
                  ].map((w) => (
                    <button
                      key={w.val}
                      onClick={() => setFormData({ ...formData, workMode: w.val })}
                      className={`p-2.5 rounded-xl border text-xs font-sans text-center transition-all ${
                        formData.workMode === w.val
                          ? 'border-yellow bg-yellow/15 text-white font-bold'
                          : 'border-white/10 bg-surface-2 text-muted'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Noise & Pets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-mono text-muted uppercase block mb-1.5">Noise Level</label>
                  <select
                    value={formData.noise}
                    onChange={(e) => setFormData({ ...formData, noise: e.target.value as NoiseTolerance })}
                    className="w-full p-2.5 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none"
                  >
                    <option value="silent">Pin-drop quiet</option>
                    <option value="moderate">Moderate background music</option>
                    <option value="party-friendly">Party-friendly energy</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-muted uppercase block mb-1.5">Pets</label>
                  <select
                    value={formData.pets}
                    onChange={(e) => setFormData({ ...formData, pets: e.target.value as PetPreference })}
                    className="w-full p-2.5 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none"
                  >
                    <option value="no-pets">Prefer no pets</option>
                    <option value="loves-pets">Love pets</option>
                    <option value="has-pets">I have a pet</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 7: BIO + PHOTO */}
          {step === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <span className="font-mono text-xs text-pink uppercase tracking-micro font-bold">
                  STEP 7 • PROFILE & BIO
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
                  Introduce yourself to <HighlightWord color="pink">flatmates</HighlightWord>
                </h2>
              </div>

              {/* Name & Occupation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-muted uppercase block mb-1">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-surface-2 border border-white/15 text-white text-sm outline-none font-sans"
                    placeholder="E.g. Rishabh"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted uppercase block mb-1">Occupation & Company</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full p-3 rounded-xl bg-surface-2 border border-white/15 text-white text-sm outline-none font-sans"
                    placeholder="E.g. Product Designer @ Swiggy"
                  />
                </div>
              </div>

              {/* Bio & AI Starters */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-mono text-muted uppercase">Short Bio (160 chars max)</label>
                  <span className="text-[10px] font-mono text-muted">{formData.bio.length} / 160</span>
                </div>
                <textarea
                  maxLength={160}
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-3 rounded-xl bg-surface-2 border border-white/15 text-white text-sm outline-none font-sans resize-none"
                  placeholder="Tell flatmates what living with you is really like..."
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] font-mono text-muted mr-1">Quick ideas:</span>
                  {bioStarters.map((starter, i) => (
                    <button
                      key={i}
                      onClick={() => setFormData({ ...formData, bio: starter })}
                      className="text-[10px] font-sans px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted hover:text-white hover:border-mint transition-colors"
                    >
                      "{starter.slice(0, 32)}..."
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 8: LIVING STYLE SUMMARY CARD & INSTAGRAM EXPORT */}
          {step === 8 && (
            <motion.div
              key="step-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                <span className="font-mono text-xs text-mint uppercase tracking-micro font-bold">
                  🎉 YOUR LIVING ARCHETYPE IS READY
                </span>
                <h2 className="text-2xl sm:text-4xl font-heading font-black text-white mt-1">
                  Here is how you <HighlightWord color="mint">actually live</HighlightWord>
                </h2>
              </div>

              {/* The 9:16 Shareable Card (matches reference video) */}
              <div
                ref={shareCardRef}
                className="max-w-md mx-auto rounded-3xl border-2 border-mint/60 bg-surface p-6 sm:p-7 shadow-mint-glow relative overflow-hidden"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-mint text-bg font-mono font-black text-[10px] uppercase">
                    {archetype.badge}
                  </span>
                  <span className="font-mono text-[10px] text-muted uppercase">FLATMATCH INDIA</span>
                </div>

                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-bg shrink-0 shadow-md font-black font-mono text-xl"
                    style={{ backgroundColor: archetype.accent === 'pink' ? '#FF5C8D' : '#3DDBA5' }}
                  >
                    <User size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-black text-white">{formData.name}, {formData.age}</h3>
                    <p className="text-xs text-muted font-mono uppercase tracking-micro">
                      {formData.occupation} • {formData.locality}
                    </p>
                  </div>
                </div>

                {/* Archetype Title & Tagline */}
                <div className="p-4 rounded-2xl bg-surface-2 border border-mint/40 mb-5">
                  <p className="text-lg font-heading font-black text-mint tracking-tight">
                    {archetype.title}
                  </p>
                  <p className="text-xs text-muted mt-1 leading-snug">{archetype.tagline}</p>
                </div>

                {/* 5 Attribute Rows with Check Badges */}
                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-yellow/40 text-xs">
                    <span className="text-muted font-mono uppercase">BUDGET</span>
                    <span className="font-bold text-white">₹{(formData.budgetMin / 1000).toFixed(0)}k–{(formData.budgetMax / 1000).toFixed(0)}k</span>
                    <CheckBadge color="yellow" size="sm" checked={true} />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-blue/40 text-xs">
                    <span className="text-muted font-mono uppercase">LOCATION</span>
                    <span className="font-bold text-white">{formData.locality}, {formData.city}</span>
                    <CheckBadge color="blue" size="sm" checked={true} />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-pink/40 text-xs">
                    <span className="text-muted font-mono uppercase">SLEEP</span>
                    <span className="font-bold text-white">
                      {formData.sleep === 'by-11' ? 'By 11:00 PM' : formData.sleep}
                    </span>
                    <CheckBadge color="pink" size="sm" checked={true} />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-mint/40 text-xs">
                    <span className="text-muted font-mono uppercase">CLEANING</span>
                    <span className="font-bold text-white">
                      {formData.cleaning === 'daily' ? 'Kitchen Cleans Daily' : formData.cleaning}
                    </span>
                    <CheckBadge color="mint" size="sm" checked={true} />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-yellow/40 text-xs">
                    <span className="text-muted font-mono uppercase">SMOKING</span>
                    <span className="font-bold text-white">
                      {formData.smoking === 'no' ? 'Strictly Smoke-Free' : 'Smoker'}
                    </span>
                    <CheckBadge color="yellow" size="sm" checked={true} />
                  </div>
                </div>

                {/* Card footer watermark */}
                <div className="pt-3 border-t border-line flex items-center justify-between text-[10px] font-mono text-muted uppercase">
                  <span>No random roommates</span>
                  <span className="text-mint font-bold">FLATMATCH.IN</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => navigate('/discover')}
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                  className="w-full sm:w-auto"
                >
                  Discover Compatible Flatmates
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleExportStory}
                  disabled={isExporting}
                  icon={<Download size={16} />}
                  className="w-full sm:w-auto"
                >
                  {isExporting ? 'Generating...' : 'Export 9:16 Story PNG'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back and Next navigation buttons */}
        {step <= totalSteps && (
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-line">
            <Button
              variant="ghost"
              size="md"
              onClick={handleBack}
              disabled={step === 1}
              icon={<ArrowLeft size={16} />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              icon={<ArrowRight size={16} />}
              iconPosition="right"
            >
              {step === totalSteps ? 'Finish & Generate Card' : 'Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
