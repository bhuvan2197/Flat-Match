import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Sliders,
  Shield,
  Eye,
  Bell,
  Trash2,
  Save,
  RotateCcw,
  User,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { DEFAULT_WEIGHTS } from '../../lib/matchEngine';
import { Button } from '../../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    weights,
    updateCurrentUser,
    updateWeights,
    updatePreferences,
    addToast,
  } = useAppStore();

  const [localWeights, setLocalWeights] = useState({ ...weights });
  const [dealBreakers, setDealBreakers] = useState({ ...currentUser.dealBreakers });
  const [hideLastName, setHideLastName] = useState(false);
  const [blurPhotoUntilChat, setBlurPhotoUntilChat] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handleSaveWeights = () => {
    updateWeights(localWeights);
    updatePreferences({ dealBreakers });
    addToast({
      type: 'success',
      title: 'Compatibility Weights Saved',
      description: 'Your discovery ranking will now reflect your custom priorities.',
    });
  };

  const handleResetDefaults = () => {
    setLocalWeights(DEFAULT_WEIGHTS);
    updateWeights(DEFAULT_WEIGHTS);
    addToast({
      type: 'info',
      title: 'Weights Reset',
      description: 'Default algorithm weights restored.',
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white flex items-center gap-2">
          <Settings className="text-mint" size={24} />
          <span>Settings & Compatibility Engine</span>
        </h1>
        <p className="text-xs text-muted font-mono uppercase tracking-micro mt-0.5">
          Tune your matching algorithm weights, deal-breakers & privacy controls
        </p>
      </div>

      {/* 1. COMPATIBILITY WEIGHTS CUSTOMIZER (from Section 4.1) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-white/10 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-mint" />
            <h2 className="text-base font-heading font-black text-white uppercase tracking-micro">
              TRANSPARENT MATCH ENGINE WEIGHTS
            </h2>
          </div>
          <button
            onClick={handleResetDefaults}
            className="text-xs font-mono text-muted hover:text-white flex items-center gap-1"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>
        <p className="text-xs text-muted">
          Adjust how much each habit impacts your compatibility score calculation. Total sum is normalized to 100.
        </p>

        {/* Sliders */}
        <div className="space-y-4 pt-1">
          {[
            { key: 'sleep' as const, label: 'Sleep Schedule Sync', color: 'text-pink accent-pink' },
            { key: 'cleaning' as const, label: 'Kitchen & Cleaning Standards', color: 'text-mint accent-mint' },
            { key: 'smoking' as const, label: 'Smoking / Substance Policy', color: 'text-yellow accent-yellow' },
            { key: 'budget' as const, label: 'Budget Range Overlap', color: 'text-yellow accent-yellow' },
            { key: 'food' as const, label: 'Food Preference (Veg vs Non-Veg)', color: 'text-mint accent-mint' },
            { key: 'guests' as const, label: 'Guest & Party Frequency', color: 'text-blue accent-blue' },
            { key: 'noise' as const, label: 'Noise & Work-From-Home Silence', color: 'text-pink accent-pink' },
          ].map(({ key, label, color }) => (
            <div key={key} className="space-y-1.5 p-3 rounded-2xl bg-surface-2 border border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-heading font-bold text-white">{label}</span>
                <span className={`font-mono font-bold ${color.split(' ')[0]}`}>
                  {localWeights[key]} pts
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={localWeights[key]}
                onChange={(e) =>
                  setLocalWeights({ ...localWeights, [key]: Number(e.target.value) })
                }
                className={`w-full cursor-pointer ${color.split(' ')[1]}`}
              />
            </div>
          ))}
        </div>

        <Button variant="primary" size="md" onClick={handleSaveWeights} icon={<Save size={15} />}>
          Save Algorithm Weights
        </Button>
      </div>

      {/* 2. STRICT DEAL-BREAKERS (Section 4.2) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-yellow" />
          <h2 className="text-base font-heading font-black text-white uppercase tracking-micro">
            DEAL-BREAKER EDITORS
          </h2>
        </div>
        <p className="text-xs text-muted">
          Any deal-breaker clash caps the match score at 40% and flags the candidate with an amber deal-breaker warning.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {[
            { key: 'sleep' as const, label: 'Sleep clash deal-breaker' },
            { key: 'cleaning' as const, label: 'Cleanliness deal-breaker' },
            { key: 'smoking' as const, label: 'Strict non-smoker only' },
            { key: 'budget' as const, label: 'Hard budget max limit' },
            { key: 'food' as const, label: 'Strict veg kitchen required' },
            { key: 'guests' as const, label: 'No overnight guests rule' },
          ].map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-2 border border-white/5"
            >
              <span className="text-xs font-heading font-medium text-white">{label}</span>
              <input
                type="checkbox"
                checked={dealBreakers[key as keyof typeof dealBreakers]}
                onChange={(e) =>
                  setDealBreakers({ ...dealBreakers, [key]: e.target.checked })
                }
                className="w-4 h-4 accent-yellow rounded cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. VISIBILITY & PRIVACY CONTROLS (Section 3.10) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Eye size={18} className="text-blue" />
          <h2 className="text-base font-heading font-black text-white uppercase tracking-micro">
            PRIVACY & VISIBILITY CONTROLS
          </h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-2 border border-white/5">
            <div>
              <p className="text-xs font-heading font-bold text-white">Hide Last Name</p>
              <p className="text-[11px] text-muted">Only show "Rishabh" to public searches</p>
            </div>
            <input
              type="checkbox"
              checked={hideLastName}
              onChange={(e) => setHideLastName(e.target.checked)}
              className="w-4 h-4 accent-mint rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-2 border border-white/5">
            <div>
              <p className="text-xs font-heading font-bold text-white">Blur Photo Until Safe Chat</p>
              <p className="text-[11px] text-muted">Reveal photo only after mutual match handshake</p>
            </div>
            <input
              type="checkbox"
              checked={blurPhotoUntilChat}
              onChange={(e) => setBlurPhotoUntilChat(e.target.checked)}
              className="w-4 h-4 accent-mint rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. DANGER ZONE */}
      <div className="p-5 rounded-3xl bg-surface border border-pink/30 space-y-3">
        <h3 className="text-xs font-mono text-pink uppercase font-bold tracking-micro">
          DANGER ZONE
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-heading font-bold text-white">Reset Local Mock Data</p>
            <p className="text-[11px] text-muted">Clears all custom swipes, chats, and restores initial seed state</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm('Are you sure you want to reset all mock data to defaults?')) {
                localStorage.removeItem('flatmatch-storage-v1');
                window.location.reload();
              }
            }}
          >
            Reset App State
          </Button>
        </div>
      </div>
    </div>
  );
};

