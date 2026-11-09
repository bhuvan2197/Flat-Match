import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Moon,
  Sparkles,
  ShieldCheck,
  Coffee,
  MessageSquare,
  ArrowRight,
  User,
  Check,
  CheckCircle2,
  Sliders,
  DollarSign,
  MapPin,
  Clock,
  Flame,
  Cigarette,
} from 'lucide-react';
import { HighlightWord } from '../../components/ui/HighlightWord';
import { Chip } from '../../components/ui/Chip';
import { CheckBadge } from '../../components/ui/CheckBadge';
import { Button } from '../../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {/* Radial Mint Spotlight */}
      <div className="hero-spotlight absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-mint/30 bg-surface-2 text-mint font-mono text-[11px] uppercase tracking-micro mb-6"
        >
          <Sparkles size={13} className="text-mint animate-pulse" />
          <span>"PLEASE, someone build this in India!"</span>
        </motion.div>

        {/* Huge Bold Headline with mint highlighted word */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6 text-white"
        >
          Your flatmate shouldn't be a{' '}
          <HighlightWord color="mint">gamble.</HighlightWord>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
        >
          Stop relying on broker WhatsApp forwards and random Facebook groups.
          Match with people who <strong className="text-white">actually live like you</strong> — before you sign any lease.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
        >
          <Button
            size="xl"
            variant="primary"
            onClick={() => navigate('/onboarding')}
            icon={<ArrowRight size={20} />}
            iconPosition="right"
            className="w-full sm:w-auto"
          >
            Find my flatmate
          </Button>
          <Button
            size="xl"
            variant="secondary"
            onClick={() => navigate('/discover')}
            className="w-full sm:w-auto"
          >
            Explore 40+ Profiles
          </Button>
        </motion.div>

        <p className="text-xs font-mono text-muted uppercase tracking-micro">
          It's optional. You're always in control.
        </p>
      </section>

      {/* STORYTELLING STEP 2: YOU vs YOUR FLATMATE Animated Comparison */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-mono text-xs uppercase tracking-micro text-muted mb-2">
            THE REALITY CHECK
          </p>
          <h2 className="text-2xl sm:text-4xl font-heading font-black tracking-tight">
            Why random flatmates <HighlightWord color="pink">ruin peace</HighlightWord>
          </h2>
        </div>

        {/* Comparison grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Card 1: Sleep Schedule */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/10 bg-surface p-6 sm:p-7 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs text-muted uppercase tracking-micro">SLEEP CLASH</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-pink/20 text-pink border border-pink/30 uppercase">
                CRITICAL
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-2 border border-mint/40">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-mint text-bg font-mono font-black text-[10px] uppercase">
                    YOU
                  </span>
                  <span className="text-sm font-heading font-bold text-white">11 PM, lights off, sleeping</span>
                </div>
                <CheckCircle2 size={18} className="text-mint shrink-0" />
              </div>

              <div className="text-center">
                <span className="font-mono font-bold text-xs text-muted uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  VS
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-2 border border-pink/40">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-pink text-bg font-mono font-black text-[10px] uppercase">
                    THEIR HABIT
                  </span>
                  <span className="text-sm font-heading font-bold text-white">Partying & gaming at 2 AM</span>
                </div>
                <span className="font-mono text-pink font-bold text-xs uppercase">No sleep</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Cleanliness */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/10 bg-surface p-6 sm:p-7 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs text-muted uppercase tracking-micro">HYGIENE DISASTER</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-yellow/20 text-yellow border border-yellow/30 uppercase">
                COMMON SORE
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-2 border border-mint/40">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-mint text-bg font-mono font-black text-[10px] uppercase">
                    YOU
                  </span>
                  <span className="text-sm font-heading font-bold text-white">Cleans the kitchen daily</span>
                </div>
                <CheckCircle2 size={18} className="text-mint shrink-0" />
              </div>

              <div className="text-center">
                <span className="font-mono font-bold text-xs text-muted uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  VS
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-2 border border-pink/40">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-pink text-bg font-mono font-black text-[10px] uppercase">
                    THEIR HABIT
                  </span>
                  <span className="text-sm font-heading font-bold text-white">Pans rotting in sink for days</span>
                </div>
                <span className="font-mono text-pink font-bold text-xs uppercase">Chaos</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STORYTELLING STEP 3: "Now imagine an app..." -> Kabir, 24 Profile Card */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-mono text-xs uppercase tracking-micro text-mint mb-2">
            IMAGINE AN APP...
          </p>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight">
            Where everyone lays their <HighlightWord color="mint">habits bare</HighlightWord>
          </h2>
        </div>

        {/* Video Card Recreation: "Kabir, 24" */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto bg-surface border-2 border-pink/60 rounded-3xl p-6 sm:p-7 shadow-pink-glow relative"
        >
          {/* Avatar block: solid pink square with outlined person */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-pink flex items-center justify-center text-bg shrink-0 shadow-md">
              <User size={34} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-heading font-black text-white">Kabir, 24</h3>
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-pink/20 text-pink rounded-full border border-pink/30 font-bold">
                  NIGHT OWL
                </span>
              </div>
              <p className="text-xs text-muted font-mono uppercase tracking-micro">
                Creative Director • Indiranagar
              </p>
            </div>
          </div>

          {/* Tiny uppercase habit line exactly as in video */}
          <div className="p-3 rounded-xl bg-pink/10 border border-pink/30 text-center mb-5">
            <p className="font-mono text-xs font-bold uppercase tracking-micro text-pink">
              PARTIES TILL 2 AM • CLEANS NEVER • BALCONY SMOKER
            </p>
          </div>

          <p className="text-xs text-muted mb-5 leading-relaxed font-sans">
            "Late night music producer. If you want silence by 10 PM, we will definitely drive each other crazy. But if you are chill with bass headphones, we are golden."
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-line text-xs font-mono text-muted">
            <span>Budget: ₹22,000</span>
            <span className="text-pink font-bold">NOT A MATCH FOR EARLY BIRDS</span>
          </div>
        </motion.div>
      </section>

      {/* STORYTELLING STEP 4: CREATE YOUR PROFILE with 5 Attribute Rows */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-mono text-xs uppercase tracking-micro text-muted mb-2">
            STEP 1 • SET YOUR LIFESTYLE
          </p>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight">
            Create your living <HighlightWord color="yellow">style card</HighlightWord>
          </h2>
          <p className="text-sm text-muted mt-3">
            Five non-negotiables that make or break shared living.
          </p>
        </div>

        {/* 5 Attribute Rows with Check Badges */}
        <div className="space-y-3.5 max-w-xl mx-auto">
          {[
            {
              category: 'BUDGET',
              label: '₹18,000 – ₹25,000 / month',
              sub: 'Zero hidden maintenance surprises',
              color: 'yellow' as const,
              icon: DollarSign,
            },
            {
              category: 'LOCATION',
              label: 'Indiranagar, Koramangala (Bengaluru)',
              sub: 'Within 4 km of metro & cafes',
              color: 'blue' as const,
              icon: MapPin,
            },
            {
              category: 'SLEEP SCHEDULE',
              label: 'Lights out by 11:00 PM',
              sub: 'Quiet hours respected after 10:30 PM',
              color: 'pink' as const,
              icon: Clock,
            },
            {
              category: 'CLEANING STANDARDS',
              label: 'Kitchen cleaned daily after meals',
              sub: 'Split maid & rotating chore rota',
              color: 'mint' as const,
              icon: Sparkles,
            },
            {
              category: 'SMOKING & DRINKING',
              label: 'Strictly non-smoker / outside only',
              sub: 'Social weekend drinks welcome',
              color: 'yellow' as const,
              icon: Cigarette,
            },
          ].map((row, idx) => {
            const Icon = row.icon;
            const borderStyles = {
              yellow: 'border-yellow/50 bg-surface hover:border-yellow',
              blue: 'border-blue/50 bg-surface hover:border-blue',
              pink: 'border-pink/50 bg-surface hover:border-pink',
              mint: 'border-mint/50 bg-surface hover:border-mint',
            }[row.color];

            return (
              <motion.div
                key={row.category}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${borderStyles}`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-bg shrink-0 font-bold ${
                      row.color === 'yellow'
                        ? 'bg-yellow'
                        : row.color === 'blue'
                        ? 'bg-blue'
                        : row.color === 'pink'
                        ? 'bg-pink'
                        : 'bg-mint'
                    }`}
                  >
                    <Icon size={18} strokeWidth={2.2} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-muted uppercase tracking-micro block">
                      {row.category}
                    </span>
                    <h4 className="text-sm font-heading font-black text-white">{row.label}</h4>
                    <p className="text-[11px] text-muted">{row.sub}</p>
                  </div>
                </div>

                {/* Pop check badge */}
                <CheckBadge color={row.color} size="md" checked={true} />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* STORYTELLING STEP 5: TWO OVERLAPPING CIRCLES WITH 94% PILL */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <p className="font-mono text-xs uppercase tracking-micro text-mint mb-2">
          COMPATIBILITY ENGINE
        </p>
        <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight max-w-2xl mx-auto mb-12">
          "And it matches you with people who actually <HighlightWord color="mint">LIVE LIKE YOU</HighlightWord>"
        </h2>

        {/* Overlapping Circles graphic from video */}
        <div className="relative w-72 h-44 sm:w-80 sm:h-48 mx-auto flex items-center justify-center mb-8">
          {/* Blue Circle (Left) */}
          <div className="absolute left-4 sm:left-6 w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 border-blue bg-blue/10 backdrop-blur-sm flex items-center justify-start pl-6 text-left">
            <div>
              <span className="text-[10px] font-mono text-blue uppercase block font-bold">YOU</span>
              <span className="text-xs font-heading font-black text-white">11 PM Bed</span>
            </div>
          </div>

          {/* Pink Circle (Right) */}
          <div className="absolute right-4 sm:right-6 w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 border-pink bg-pink/10 backdrop-blur-sm flex items-center justify-end pr-6 text-right">
            <div>
              <span className="text-[10px] font-mono text-pink uppercase block font-bold">MATCH</span>
              <span className="text-xs font-heading font-black text-white">11 PM Bed</span>
            </div>
          </div>

          {/* Mint 94% Pill in the Overlap */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative z-10 px-5 py-2.5 rounded-full bg-mint text-bg font-heading font-black text-xl sm:text-2xl shadow-mint-glow tracking-tight flex items-center gap-1.5"
          >
            <Sparkles size={18} className="fill-bg" />
            <span>94% MATCH</span>
          </motion.div>
        </div>

        {/* Habit chips under it */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
          <Chip label="SLEEP: 100% SYNC" color="pink" variant="tint" />
          <Chip label="CLEANING: 90% SYNC" color="mint" variant="tint" />
          <Chip label="SMOKE FREE" color="yellow" variant="tint" />
          <Chip label="BUDGET ALIGNED" color="blue" variant="tint" />
        </div>
      </section>

      {/* STORYTELLING STEP 6: "BEFORE YOU SIGN ANYTHING" 3-Step Safe Path */}
      <section className="py-20 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-micro text-muted mb-2">
            BEFORE YOU SIGN ANYTHING
          </p>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight">
            The safe 3-step <HighlightWord color="yellow">handshake</HighlightWord>
          </h2>
          <p className="text-sm text-muted mt-3 max-w-md mx-auto">
            Never pay a deposit to a stranger. Follow the verified protocol.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-10 space-y-8">
          {/* Connecting gradient line (blue -> pink -> yellow) */}
          <div className="absolute left-[31px] sm:left-[47px] top-6 bottom-6 w-[3px] bg-gradient-to-b from-blue via-mint to-yellow" />

          {/* Step 1: CHAT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex items-start gap-4 p-5 rounded-2xl border border-blue/50 bg-surface shadow-blue-glow/30"
          >
            <div className="w-10 h-10 rounded-xl bg-blue text-bg flex items-center justify-center font-heading font-black shrink-0 relative z-10 shadow-md">
              <MessageSquare size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-blue uppercase font-bold">STEP 1</span>
                <h3 className="text-lg font-heading font-black text-white">CHAT</h3>
              </div>
              <p className="text-xs text-blue font-mono uppercase mt-0.5">Vibe check first</p>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Break the ice with 10 built-in lifestyle prompts. Answer the shared Vibe Check card to see where you agree on AC temperature, dishes, and weekend guests.
              </p>
            </div>
          </motion.div>

          {/* Step 2: VERIFY IDs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex items-start gap-4 p-5 rounded-2xl border border-mint/50 bg-surface shadow-mint-glow/30"
          >
            <div className="w-10 h-10 rounded-xl bg-mint text-bg flex items-center justify-center font-heading font-black shrink-0 relative z-10 shadow-md">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-mint uppercase font-bold">STEP 2</span>
                <h3 className="text-lg font-heading font-black text-white">VERIFY IDs</h3>
              </div>
              <p className="text-xs text-mint font-mono uppercase mt-0.5">Know who's real</p>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                OTP phone verification, government ID document scan preview, selfie liveness check, and corporate work/college email. Badges unlock tier by tier.
              </p>
            </div>
          </motion.div>

          {/* Step 3: MEET FIRST */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex items-start gap-4 p-5 rounded-2xl border border-yellow/50 bg-surface shadow-yellow-glow/30"
          >
            <div className="w-10 h-10 rounded-xl bg-yellow text-bg flex items-center justify-center font-heading font-black shrink-0 relative z-10 shadow-md">
              <Coffee size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-yellow uppercase font-bold">STEP 3</span>
                <h3 className="text-lg font-heading font-black text-white">MEET FIRST</h3>
              </div>
              <p className="text-xs text-yellow font-mono uppercase mt-0.5">Before moving in</p>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Pick a verified public cafe (Third Wave, Blue Tokai, Araku). Share your plan with a trusted friend and record post-meeting feedback before signing any rental agreement.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-3xl border border-mint/40 bg-gradient-to-b from-surface-2 to-surface relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <span className="inline-block font-mono text-xs uppercase tracking-micro text-mint mb-3 font-bold">
              ZERO BROKERAGE • 100% COMPATIBLE
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight mb-5">
              Ready to meet flatmates who <HighlightWord color="mint">live like you?</HighlightWord>
            </h2>
            <p className="text-sm sm:text-base text-muted max-w-lg mx-auto mb-8 font-sans">
              Takes 3 minutes. Unlock your Living Archetype card and start browsing 40+ verified candidates across Bengaluru, Mumbai, Delhi-NCR, Pune, and Hyderabad.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="xl"
                variant="primary"
                onClick={() => navigate('/onboarding')}
                icon={<ArrowRight size={20} />}
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                Find my flatmate
              </Button>
              <Button
                size="xl"
                variant="outline"
                onClick={() => navigate('/discover')}
                className="w-full sm:w-auto"
              >
                Browse Candidates
              </Button>
            </div>

            <p className="text-[11px] font-mono text-muted uppercase tracking-micro mt-6">
              It's optional. You're always in control.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

