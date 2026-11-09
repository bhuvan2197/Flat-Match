import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Phone,
  FileCheck,
  Camera,
  Mail,
  Check,
  Sparkles,
  Lock,
  ArrowRight,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';

export const VerificationPage: React.FC = () => {
  const { currentUser, updateUserVerification, addToast } = useAppStore();

  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');

  const [idFile, setIdFile] = useState<string | null>(null);
  const [isScanningSelfie, setIsScanningSelfie] = useState(false);
  const [selfieDone, setSelfieDone] = useState(currentUser.verification.selfie);

  const [workEmail, setWorkEmail] = useState('rishabh@swiggy.com');
  const [workEmailSent, setWorkEmailSent] = useState(false);

  const verification = currentUser.verification;

  const handlePhoneVerify = () => {
    if (!otpValue || otpValue.length < 4) {
      addToast({
        type: 'warning',
        title: 'Enter 6-digit OTP',
        description: 'You can type any 6 digits (e.g. 123456) for demo.',
      });
      return;
    }
    updateUserVerification('basic', 'phone');
    setOtpStep(false);
    addToast({
      type: 'success',
      title: 'Phone Verified!',
      description: 'Mobile OTP confirmed. Basic tier unlocked.',
    });
  };

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setIdFile(fakeUrl);
      setTimeout(() => {
        updateUserVerification('verified', 'govtId');
        addToast({
          type: 'success',
          title: 'Government ID Verified!',
          description: 'Document authenticity verified by AI scanner.',
        });
      }, 1000);
    }
  };

  const handleSelfieScan = () => {
    setIsScanningSelfie(true);
    setTimeout(() => {
      setIsScanningSelfie(false);
      setSelfieDone(true);
      updateUserVerification('verified', 'selfie');
      addToast({
        type: 'success',
        title: 'Liveness Selfie Verified!',
        description: '3D facial biometric scan completed.',
      });
    }, 2200);
  };

  const handleWorkEmailVerify = () => {
    setWorkEmailSent(true);
    setTimeout(() => {
      updateUserVerification('trusted', 'workEmail');
      addToast({
        type: 'success',
        title: '🎉 Trusted Badge Unlocked!',
        description: 'Corporate domain confirmed. You now hold the highest Trust tier.',
      });
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-mint/15 text-mint border border-mint/40 flex items-center justify-center mx-auto mb-3 shadow-mint-glow">
          <ShieldCheck size={30} />
        </div>
        <h1 className="text-2xl sm:text-4xl font-heading font-black text-white">
          Trust & Identity Verification
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-2">
          Verify your profile once. Unlock 3x higher reply rates and build instant trust with aligned flatmates.
        </p>
      </div>

      {/* BADGE TIERS REVEAL */}
      <div className="p-5 rounded-3xl bg-surface border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted uppercase tracking-micro">
            YOUR CURRENT TRUST TIER
          </span>
          <span className="font-mono text-xs uppercase px-3 py-1 rounded-full bg-mint text-bg font-bold shadow-mint-glow">
            {verification.tier.toUpperCase()} TIER
          </span>
        </div>

        {/* 3 Tier progress visual */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            className={`p-4 rounded-2xl border text-center transition-all ${
              verification.tier !== 'none'
                ? 'border-mint/50 bg-mint/10 text-white'
                : 'border-white/10 bg-surface-2 text-muted'
            }`}
          >
            <span className="text-[10px] font-mono uppercase block mb-1">TIER 1</span>
            <h4 className="text-sm font-heading font-black">Basic Badge</h4>
            <p className="text-[11px] text-muted mt-0.5">Phone OTP Verified</p>
            {verification.phone && <Check size={14} className="text-mint mx-auto mt-2" strokeWidth={3} />}
          </div>

          <div
            className={`p-4 rounded-2xl border text-center transition-all ${
              verification.tier === 'verified' || verification.tier === 'trusted'
                ? 'border-mint/50 bg-mint/10 text-white'
                : 'border-white/10 bg-surface-2 text-muted'
            }`}
          >
            <span className="text-[10px] font-mono uppercase block mb-1">TIER 2</span>
            <h4 className="text-sm font-heading font-black">Verified Badge</h4>
            <p className="text-[11px] text-muted mt-0.5">Govt ID + Liveness Selfie</p>
            {verification.govtId && <Check size={14} className="text-mint mx-auto mt-2" strokeWidth={3} />}
          </div>

          <div
            className={`p-4 rounded-2xl border text-center transition-all ${
              verification.tier === 'trusted'
                ? 'border-mint shadow-mint-glow bg-mint/15 text-white'
                : 'border-white/10 bg-surface-2 text-muted'
            }`}
          >
            <span className="text-[10px] font-mono uppercase block mb-1">TIER 3</span>
            <h4 className="text-sm font-heading font-black flex items-center justify-center gap-1">
              <span>Trusted Badge</span>
              <Sparkles size={14} className="text-mint" />
            </h4>
            <p className="text-[11px] text-muted mt-0.5">Corporate / College Domain</p>
            {verification.workEmail && <Check size={14} className="text-mint mx-auto mt-2" strokeWidth={3} />}
          </div>
        </div>
      </div>

      {/* 4 VERIFICATION STEPS */}
      <div className="space-y-4">
        {/* Step 1: Phone OTP */}
        <div className="p-5 rounded-3xl bg-surface border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue/15 text-blue flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <h3 className="text-sm font-heading font-black text-white">1. Phone Number OTP</h3>
                <p className="text-xs text-muted">Ensures account uniqueness & SMS alerts</p>
              </div>
            </div>

            {verification.phone ? (
              <span className="text-xs font-mono text-mint font-bold uppercase flex items-center gap-1">
                <Check size={14} strokeWidth={3} /> Verified
              </span>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setOtpStep(true)}>
                Verify Phone
              </Button>
            )}
          </div>

          {otpStep && !verification.phone && (
            <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="Enter any 6 digits (e.g. 123456)"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="w-full sm:w-60 p-2.5 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none font-mono"
              />
              <Button variant="primary" size="sm" onClick={handlePhoneVerify}>
                Submit OTP
              </Button>
            </div>
          )}
        </div>

        {/* Step 2: Government ID */}
        <div className="p-5 rounded-3xl bg-surface border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-mint/15 text-mint flex items-center justify-center shrink-0">
                <FileCheck size={18} />
              </div>
              <div>
                <h3 className="text-sm font-heading font-black text-white">2. Government ID Document</h3>
                <p className="text-xs text-muted">Aadhaar Card, PAN Card, Driving License, or Passport</p>
              </div>
            </div>

            {verification.govtId ? (
              <span className="text-xs font-mono text-mint font-bold uppercase flex items-center gap-1">
                <Check size={14} strokeWidth={3} /> Verified
              </span>
            ) : (
              <label className="px-3.5 py-1.5 rounded-xl bg-mint text-bg font-heading font-bold text-xs cursor-pointer hover:bg-[#4ff5bc] flex items-center gap-1.5 shadow-mint-glow">
                <Upload size={14} />
                <span>Upload ID</span>
                <input type="file" accept="image/*" onChange={handleIdUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Step 3: Selfie Liveness */}
        <div className="p-5 rounded-3xl bg-surface border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink/15 text-pink flex items-center justify-center shrink-0">
                <Camera size={18} />
              </div>
              <div>
                <h3 className="text-sm font-heading font-black text-white">3. Liveness Selfie Verification</h3>
                <p className="text-xs text-muted">Quick 3-second camera face check to eliminate catfishing</p>
              </div>
            </div>

            {selfieDone ? (
              <span className="text-xs font-mono text-mint font-bold uppercase flex items-center gap-1">
                <Check size={14} strokeWidth={3} /> Verified
              </span>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelfieScan}
                disabled={isScanningSelfie}
              >
                {isScanningSelfie ? 'Scanning Face...' : 'Start Camera Check'}
              </Button>
            )}
          </div>

          {/* Animated scanning ring */}
          {isScanningSelfie && (
            <div className="py-6 text-center space-y-3">
              <div className="w-24 h-24 rounded-full border-4 border-mint border-t-transparent animate-spin mx-auto flex items-center justify-center">
                <Camera size={28} className="text-mint animate-pulse" />
              </div>
              <p className="text-xs font-mono text-mint uppercase">
                Detecting face landmarks & blink liveness...
              </p>
            </div>
          )}
        </div>

        {/* Step 4: Corporate / College Work Email */}
        <div className="p-5 rounded-3xl bg-surface border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow/15 text-yellow flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <h3 className="text-sm font-heading font-black text-white">4. Work or College Domain</h3>
                <p className="text-xs text-muted">E.g. @swiggy.com, @microsoft.com, @iitb.ac.in</p>
              </div>
            </div>

            {verification.workEmail ? (
              <span className="text-xs font-mono text-mint font-bold uppercase flex items-center gap-1">
                <Check size={14} strokeWidth={3} /> Verified
              </span>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleWorkEmailVerify}
                disabled={workEmailSent}
              >
                {workEmailSent ? 'Confirming...' : 'Verify Work Email'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Privacy guarantee note */}
      <div className="p-4 rounded-2xl bg-surface-2 border border-white/10 text-xs text-muted leading-relaxed font-sans flex items-start gap-3">
        <Lock size={16} className="text-mint shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Strict Privacy Standard:</strong> Your documents are never shared or made public. Other flatmates only see the verified badge icon on your card.
        </div>
      </div>
    </div>
  );
};

