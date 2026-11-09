import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  ShieldCheck,
  Coffee,
  Send,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Check,
  User,
  Info,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_PROFILES } from '../../data/mockProfiles';
import { VIBE_CHECK_STARTERS, VIBE_QUESTIONS, SAFE_MEETING_SPOTS } from '../../data/prompts';
import { ProgressStepper } from '../../components/ui/ProgressStepper';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';

export const SafePathMatchView: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const {
    currentUser,
    safePaths,
    chats,
    advanceSafeStep,
    sendMessage,
    submitVibeCheckAnswers,
    updateMeetPlan,
    addToast,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'chat' | 'verify' | 'meet'>('chat');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const profile = MOCK_PROFILES.find((p) => p.id === matchId);
  const safeStatus = matchId ? safePaths[matchId] : undefined;
  const matchChat = matchId ? chats[matchId] || [] : [];

  if (!profile || !matchId) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
        <h2 className="text-xl font-heading font-black text-white">Match not found</h2>
        <Button variant="primary" size="md" onClick={() => navigate('/discover')} className="mt-4">
          Back to Discover
        </Button>
      </div>
    );
  }

  const currentStep = safeStatus?.step || 'chat';
  const meetPlan = safeStatus?.meetPlan || {
    venueName: 'Third Wave Coffee, 12th Main Indiranagar',
    venueAddress: 'Indiranagar, Bengaluru',
    dateTime: 'Saturday, 4:30 PM',
    sharedWithContact: false,
    hasArrived: false,
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    sendMessage(matchId, text, 'current-user');
    if (!textToSend) setInputText('');

    // Trigger typing indicator for simulated reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1400);
  };

  const handleAdvanceToVerify = () => {
    advanceSafeStep(matchId, 'verify');
    setActiveTab('verify');
    addToast({
      type: 'success',
      title: 'Step 2 Unlocked: Verify IDs',
      description: 'Proceed to exchange verified credentials before meeting.',
    });
  };

  const handleAdvanceToMeet = () => {
    advanceSafeStep(matchId, 'meet');
    setActiveTab('meet');
    addToast({
      type: 'success',
      title: 'Step 3 Unlocked: Meet First Planner',
      description: 'Choose a verified public spot and lock in a 20-min coffee.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Back button & Candidate Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-line">
        <button
          onClick={() => navigate('/matches')}
          className="flex items-center gap-1.5 text-xs font-mono uppercase text-muted hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>All Safe Matches</span>
        </button>

        <Link
          to={`/profile/${profile.id}`}
          className="text-xs font-mono text-mint hover:underline uppercase"
        >
          View Full Living Style →
        </Link>
      </div>

      {/* Safety Protocol Banner from Section 3.6 */}
      <div className="p-3.5 rounded-2xl bg-surface border border-yellow/40 mb-6 flex items-start gap-3 shadow-yellow-glow/20">
        <AlertTriangle className="text-yellow shrink-0 mt-0.5" size={18} />
        <div className="text-xs">
          <p className="font-heading font-black text-white uppercase tracking-micro">
            SAFE LIVING PROTOCOL • INDIA
          </p>
          <p className="text-muted text-[11px] mt-0.5 leading-snug">
            Never send a security deposit, token amount, or brokerage before meeting in person and verifying government IDs. FlatMatch keeps you protected.
          </p>
        </div>
      </div>

      {/* MATCH HEADER + 3-STEP PROGRESS STEPPER */}
      <div className="p-5 rounded-3xl bg-surface border border-white/10 mb-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-bg shrink-0 font-black font-mono"
              style={{ backgroundColor: profile.avatarBgColor || '#FF5C8D' }}
            >
              <User size={24} />
            </div>
            <div>
              <h2 className="text-lg font-heading font-black text-white">
                {profile.name}, {profile.age}
              </h2>
              <p className="text-xs text-muted font-mono uppercase tracking-micro">
                {profile.archetype} • {profile.locality}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-muted uppercase block">SAFE STEP</span>
            <span className="text-xs font-mono uppercase font-bold text-mint">
              {currentStep === 'chat' ? '1. VIBE CHAT' : currentStep === 'verify' ? '2. VERIFY IDs' : '3. MEET FIRST'}
            </span>
          </div>
        </div>

        {/* Stepper Tabs */}
        <div className="pt-2">
          <ProgressStepper
            currentStep={currentStep}
            verifyUnlocked={safeStatus?.verifyUnlocked}
            meetUnlocked={safeStatus?.meetUnlocked}
            orientation="horizontal"
            onStepClick={(step) => setActiveTab(step)}
          />
        </div>
      </div>

      {/* SUB-VIEWS BASED ON ACTIVE TAB */}
      <div>
        {/* TAB 1: CHAT INTERFACE & VIBE CHECK */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            {/* VIBE CHECK CARD (Interactive Shared Questionnaire from Section 3.6) */}
            <div className="p-5 rounded-3xl bg-surface border border-blue/40 shadow-blue-glow/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-blue" />
                  <h3 className="text-sm font-heading font-black text-white uppercase tracking-micro">
                    SHARED VIBE CHECK CARD
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-blue bg-blue/15 px-2 py-0.5 rounded-full border border-blue/30 font-bold uppercase">
                  5/5 ANSWERED
                </span>
              </div>
              <p className="text-xs text-muted">
                Compare your lifestyle answers with {profile.name.split(' ')[0]}. Identical answers are highlighted in mint.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {VIBE_QUESTIONS.map((q) => {
                  const userAns =
                    safeStatus?.vibeCheckUserAnswers?.[q.id as keyof typeof safeStatus.vibeCheckUserAnswers] ||
                    q.options[0];
                  const matchAns =
                    safeStatus?.vibeCheckMatchAnswers?.[q.id as keyof typeof safeStatus.vibeCheckMatchAnswers] ||
                    q.options[1];
                  const isSync = userAns === matchAns;

                  return (
                    <div
                      key={q.id}
                      className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                        isSync ? 'border-mint/50 bg-mint/5' : 'border-white/10 bg-surface-2'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-white text-[11px] truncate">
                          {q.question}
                        </span>
                        {isSync && (
                          <span className="text-[9px] font-mono text-mint uppercase font-bold px-1.5 py-0.2 rounded bg-mint/20">
                            SYNC ✓
                          </span>
                        )}
                      </div>
                      <div className="space-y-0.5 text-[11px]">
                        <p className="text-muted">
                          You: <strong className="text-white">{userAns}</strong>
                        </p>
                        <p className="text-muted">
                          {profile.name.split(' ')[0]}: <strong className="text-white">{matchAns}</strong>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 10 VIBE CHECK CONVERSATION STARTERS */}
            <div>
              <span className="font-mono text-[10px] text-muted uppercase tracking-micro block mb-2 font-bold">
                PROMPTS TO AVOID AWKWARD CONVERSATIONS (TAP TO SEND):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {VIBE_CHECK_STARTERS.slice(0, 5).map((starter, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(starter)}
                    className="text-xs font-sans px-3 py-1.5 rounded-xl border border-white/10 bg-surface hover:border-mint hover:text-mint text-white/90 transition-all text-left"
                  >
                    "{starter}"
                  </button>
                ))}
              </div>
            </div>

            {/* CHAT MESSAGES THREAD */}
            <div className="p-4 sm:p-5 rounded-3xl bg-surface border border-white/10 min-h-[380px] max-h-[460px] flex flex-col justify-between shadow-2xl">
              {/* Message list */}
              <div className="space-y-3 overflow-y-auto pr-1">
                {matchChat.map((msg) => {
                  if (msg.isSystem) {
                    return (
                      <div key={msg.id} className="text-center py-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-muted uppercase">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  const isMe = msg.senderId === 'current-user';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm font-sans leading-relaxed shadow-sm ${
                          isMe
                            ? 'bg-mint text-bg font-medium rounded-tr-sm'
                            : 'bg-surface-2 text-white border border-white/10 rounded-tl-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] font-mono text-muted mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {/* Simulated typing indicator */}
                {isTyping && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-surface-2 border border-white/10 w-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-mint animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-mint animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-mint animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>

              {/* Input Box */}
              <div className="pt-3 border-t border-line flex items-center gap-2 mt-4">
                <input
                  type="text"
                  placeholder={`Message ${profile.name.split(' ')[0]}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 p-3 rounded-xl bg-surface-2 border border-white/15 text-white text-xs sm:text-sm outline-none font-sans"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleSend()}
                  icon={<Send size={15} />}
                >
                  Send
                </Button>
              </div>
            </div>

            {/* Advance to Step 2 Banner */}
            <div className="p-4 rounded-2xl bg-surface-2 border border-mint/40 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-heading font-black text-white">Vibe check feeling good?</p>
                <p className="text-[11px] text-muted">Advance to Step 2 to verify government IDs and work credentials.</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAdvanceToVerify}
                icon={<ShieldCheck size={15} />}
              >
                Verify IDs Next
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: VERIFICATION GATE */}
        {activeTab === 'verify' && (
          <div className="space-y-6">
            <div className="text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-mint/15 text-mint border border-mint/40 flex items-center justify-center mx-auto mb-3 shadow-mint-glow">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-heading font-black text-white">
                Step 2 • Identity Verification Exchange
              </h3>
              <p className="text-xs text-muted mt-1">
                Both parties confirm authentic identity before scheduling any in-person meeting.
              </p>
            </div>

            {/* Comparison of verification status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Your status */}
              <div className="p-5 rounded-3xl bg-surface border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-heading font-black text-white">YOUR BADGES</h4>
                  <span className="text-[10px] font-mono text-mint uppercase font-bold px-2 py-0.5 rounded bg-mint/15 border border-mint/30">
                    {currentUser.verification.tier}
                  </span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center p-2 rounded-xl bg-surface-2">
                    <span className="text-muted">PHONE OTP</span>
                    <span className="text-mint font-bold flex items-center gap-1">
                      <Check size={12} strokeWidth={3} /> VERIFIED
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-surface-2">
                    <span className="text-muted">GOVERNMENT ID</span>
                    <span className="text-mint font-bold flex items-center gap-1">
                      <Check size={12} strokeWidth={3} /> VERIFIED
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-surface-2">
                    <span className="text-muted">WORK/COLLEGE EMAIL</span>
                    <span className="text-mint font-bold flex items-center gap-1">
                      <Check size={12} strokeWidth={3} /> VERIFIED
                    </span>
                  </div>
                </div>
              </div>

              {/* Candidate status */}
              <div className="p-5 rounded-3xl bg-surface border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-heading font-black text-white">
                    {profile.name.toUpperCase()}'S BADGES
                  </h4>
                  <span className="text-[10px] font-mono text-mint uppercase font-bold px-2 py-0.5 rounded bg-mint/15 border border-mint/30">
                    {profile.verification.tier}
                  </span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center p-2 rounded-xl bg-surface-2">
                    <span className="text-muted">PHONE OTP</span>
                    <span className="text-mint font-bold flex items-center gap-1">
                      <Check size={12} strokeWidth={3} /> VERIFIED
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-surface-2">
                    <span className="text-muted">GOVERNMENT ID</span>
                    <span className="text-mint font-bold flex items-center gap-1">
                      <Check size={12} strokeWidth={3} /> VERIFIED
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-surface-2">
                    <span className="text-muted">WORK EMAIL</span>
                    <span className="text-mint font-bold flex items-center gap-1">
                      <Check size={12} strokeWidth={3} /> VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Promise */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-muted flex items-start gap-2.5">
              <Info size={16} className="text-mint shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Protected:</strong> Raw Aadhaar/PAN numbers and selfies are encrypted and never shown to other users. Only the verified badge status is visible.
              </span>
            </div>

            {/* Unlock Step 3 CTA */}
            <div className="text-center pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAdvanceToMeet}
                icon={<Coffee size={18} />}
              >
                Both Verified • Unlock Step 3: Meet First
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: MEET FIRST PLANNER */}
        {activeTab === 'meet' && (
          <div className="space-y-6">
            <div className="text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-yellow/15 text-yellow border border-yellow/40 flex items-center justify-center mx-auto mb-3 shadow-yellow-glow">
                <Coffee size={28} />
              </div>
              <h3 className="text-xl font-heading font-black text-white">
                Step 3 • Meet First Planner
              </h3>
              <p className="text-xs text-muted mt-1">
                Grab a 20-min daytime coffee at a public spot before signing any lease.
              </p>
            </div>

            {/* Suggested Public Meeting Spots */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] text-muted uppercase tracking-micro block font-bold">
                SUGGESTED PUBLIC SPOTS IN {profile.city.toUpperCase()}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAFE_MEETING_SPOTS.slice(0, 4).map((spot) => {
                  const isSelected = meetPlan.venueName === spot.name;
                  return (
                    <div
                      key={spot.name}
                      onClick={() =>
                        updateMeetPlan(matchId, {
                          venueName: spot.name,
                          venueAddress: `${spot.area}, ${spot.city}`,
                        })
                      }
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-yellow bg-yellow/15 shadow-yellow-glow'
                          : 'border-white/10 bg-surface hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-white text-xs">{spot.name}</span>
                        {isSelected && (
                          <span className="text-[10px] font-mono text-yellow font-bold uppercase">
                            SELECTED ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted font-mono">{spot.area} • {spot.type}</p>
                      <p className="text-[10px] text-muted/80 mt-1">{spot.vibe}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Picker */}
            <div className="p-4 rounded-2xl bg-surface-2 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold text-white">Selected Meeting Schedule</span>
                <span className="text-xs font-mono text-yellow font-bold">{meetPlan.dateTime}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {['Saturday, 11:30 AM', 'Saturday, 4:30 PM', 'Sunday, 5:00 PM'].map((time) => (
                  <button
                    key={time}
                    onClick={() => updateMeetPlan(matchId, { dateTime: time })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      meetPlan.dateTime === time
                        ? 'border-yellow bg-yellow/20 text-white font-bold'
                        : 'border-white/10 bg-white/5 text-muted hover:border-white/20'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Share Plan & Safety Check-in */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  updateMeetPlan(matchId, { sharedWithContact: true });
                  addToast({
                    type: 'success',
                    title: 'Plan Shared with Emergency Contact',
                    description: `Meeting venue and time sent via encrypted link.`,
                  });
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  meetPlan.sharedWithContact
                    ? 'border-mint/50 bg-mint/10 text-white'
                    : 'border-white/10 bg-surface hover:border-white/25 text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Share2 size={16} className="text-mint" />
                  {meetPlan.sharedWithContact && (
                    <span className="text-[10px] font-mono text-mint font-bold uppercase">SHARED ✓</span>
                  )}
                </div>
                <h4 className="text-xs font-heading font-bold">Share with a Friend / Parent</h4>
                <p className="text-[11px] text-muted mt-0.5">
                  Sends venue address & time to your trusted contact for peace of mind.
                </p>
              </button>

              <button
                onClick={() => {
                  updateMeetPlan(matchId, { hasArrived: true });
                  addToast({
                    type: 'success',
                    title: 'Safety Check-in Recorded',
                    description: 'Location check-in logged at ' + meetPlan.venueName,
                  });
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  meetPlan.hasArrived
                    ? 'border-mint/50 bg-mint/10 text-white'
                    : 'border-white/10 bg-surface hover:border-white/25 text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <MapPin size={16} className="text-yellow" />
                  {meetPlan.hasArrived && (
                    <span className="text-[10px] font-mono text-mint font-bold uppercase">CHECKED-IN ✓</span>
                  )}
                </div>
                <h4 className="text-xs font-heading font-bold">"I've Arrived Safely"</h4>
                <p className="text-[11px] text-muted mt-0.5">
                  Tap to confirm your arrival at {meetPlan.venueName}.
                </p>
              </button>
            </div>

            {/* Post-Meet Verdict: "Would you live with them?" */}
            <div className="p-5 rounded-3xl bg-surface-2 border border-mint/40 space-y-3">
              <h4 className="text-sm font-heading font-black text-white text-center">
                POST-MEET VERDICT: "Would you live with {profile.name.split(' ')[0]}?"
              </h4>
              <p className="text-xs text-muted text-center max-w-sm mx-auto">
                Private to you. Helps us prepare your House Rules agreement or suggest other options.
              </p>
              <div className="flex justify-center gap-3 pt-1">
                {[
                  { val: 'yes' as const, label: 'Yes! Let’s move in', color: 'bg-mint text-bg' },
                  { val: 'maybe' as const, label: 'Maybe / Need more info', color: 'bg-yellow text-bg' },
                  { val: 'no' as const, label: 'Not a vibe match', color: 'bg-white/10 text-white' },
                ].map((verdict) => (
                  <button
                    key={verdict.val}
                    onClick={() => {
                      updateMeetPlan(matchId, { postMeetVerdict: verdict.val });
                      if (verdict.val === 'yes') {
                        addToast({
                          type: 'success',
                          title: 'Match Confirmed!',
                          description: 'You can now generate your House Rules Agreement PDF.',
                        });
                        navigate('/agreement');
                      }
                    }}
                    className={`px-4 py-2.5 rounded-xl font-heading font-bold text-xs transition-all ${verdict.color} ${
                      meetPlan.postMeetVerdict === verdict.val ? 'ring-2 ring-white shadow-lg' : ''
                    }`}
                  >
                    {verdict.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const MatchesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { safePaths } = useAppStore();

  const matchEntries = Object.entries(safePaths);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white flex items-center gap-2">
          <MessageSquare className="text-blue" size={24} />
          <span>Safe Path Matches</span>
        </h1>
        <p className="text-xs text-muted font-mono uppercase tracking-micro mt-0.5">
          "Chat first. Verify next. Meet before you move in."
        </p>
      </div>

      {matchEntries.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-3xl border border-white/10 bg-surface space-y-3">
          <MessageSquare size={32} className="text-muted mx-auto" />
          <h3 className="text-lg font-heading font-black text-white">No active matches yet</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Browse compatible flatmates in Discover, tap Shortlist or Super Interest to start the safe path.
          </p>
          <Button variant="primary" size="md" onClick={() => navigate('/discover')}>
            Discover Flatmates
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {matchEntries.map(([matchId, status]) => {
            const profile = MOCK_PROFILES.find((p) => p.id === matchId);
            if (!profile) return null;

            return (
              <div
                key={matchId}
                onClick={() => navigate(`/matches/${matchId}`)}
                className="p-5 rounded-3xl bg-surface border border-white/10 hover:border-mint/50 cursor-pointer transition-all space-y-4 shadow-lg group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-bg shrink-0 font-black font-mono"
                      style={{ backgroundColor: profile.avatarBgColor || '#FF5C8D' }}
                    >
                      <User size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-heading font-black text-white group-hover:text-mint transition-colors">
                          {profile.name}, {profile.age}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-mint/15 text-mint text-[10px] font-mono font-bold uppercase">
                          {profile.archetype}
                        </span>
                      </div>
                      <p className="text-xs text-muted font-mono">
                        {profile.occupation} • {profile.locality}, {profile.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-mint font-bold uppercase">
                    <span>Open Safe Path</span>
                    <ChevronRight size={16} />
                  </div>
                </div>

                {/* Progress Stepper bar */}
                <div className="pt-1 pointer-events-none">
                  <ProgressStepper
                    currentStep={status.step}
                    verifyUnlocked={status.verifyUnlocked}
                    meetUnlocked={status.meetUnlocked}
                    orientation="horizontal"
                    compact={true}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

