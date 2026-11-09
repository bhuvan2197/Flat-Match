import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Compass,
  Heart,
  MessageSquare,
  ShieldCheck,
  FileText,
  Calculator,
  CalendarCheck,
  Settings,
  Sparkles,
  ArrowRight,
  User,
} from 'lucide-react';
import { MOCK_PROFILES } from '../../data/mockProfiles';
import { useAppStore } from '../../store/useAppStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { shortlist } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const quickNavItems = [
    { label: 'Discover Matches (Swipe & Stack)', path: '/discover', icon: Compass, category: 'Navigation' },
    { label: 'Shortlist & Compare Candidates', path: '/shortlist', icon: Heart, category: 'Navigation' },
    { label: 'Safe Path Matches & Vibe Chat', path: '/matches', icon: MessageSquare, category: 'Navigation' },
    { label: 'Verification Center (ID & Selfie)', path: '/verify', icon: ShieldCheck, category: 'Tools' },
    { label: 'House Rules Agreement Generator (PDF)', path: '/agreement', icon: FileText, category: 'Tools' },
    { label: 'Rent & Expense Splitter', path: '/expenses', icon: Calculator, category: 'Tools' },
    { label: 'Weekly Chore Rota & Swapper', path: '/chores', icon: CalendarCheck, category: 'Tools' },
    { label: 'Preferences & Deal-breakers Editor', path: '/settings', icon: Settings, category: 'Settings' },
    { label: 'Retake Lifestyle Onboarding Quiz', path: '/onboarding', icon: Sparkles, category: 'Settings' },
  ];

  const matchedProfiles = MOCK_PROFILES.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.locality.toLowerCase().includes(query.toLowerCase()) ||
      p.occupation.toLowerCase().includes(query.toLowerCase()) ||
      p.archetype.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const matchedNav = quickNavItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const combinedItems = [
    ...matchedNav.map((n) => ({ type: 'nav' as const, data: n })),
    ...matchedProfiles.map((p) => ({ type: 'profile' as const, data: p })),
  ];

  const handleSelect = (index: number) => {
    const item = combinedItems[index];
    if (!item) return;
    if (item.type === 'nav') {
      navigate(item.data.path);
      onClose();
    } else {
      navigate(`/profile/${item.data.id}`);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, combinedItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + combinedItems.length) % Math.max(1, combinedItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Palette panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="relative z-10 w-full max-w-xl bg-surface border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Input bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line bg-surface-2/60">
              <Search className="text-mint shrink-0" size={18} />
              <input
                autoFocus
                type="text"
                placeholder="Search flatmates, localities, tools, or press Esc..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-white placeholder-muted text-sm outline-none font-sans"
              />
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono uppercase bg-white/10 text-muted rounded border border-white/15">
                ESC
              </kbd>
            </div>

            {/* Results list */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {combinedItems.length === 0 ? (
                <div className="py-8 text-center text-muted text-xs">
                  No matching tools or flatmates found for "{query}".
                </div>
              ) : (
                combinedItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  if (item.type === 'nav') {
                    const Icon = item.data.icon;
                    return (
                      <div
                        key={item.data.path}
                        onClick={() => handleSelect(idx)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                          isSelected ? 'bg-mint text-bg font-bold' : 'text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={16} className={isSelected ? 'text-bg' : 'text-mint'} />
                          <span>{item.data.label}</span>
                        </div>
                        <span
                          className={`font-mono text-[10px] uppercase ${
                            isSelected ? 'text-bg/80' : 'text-muted'
                          }`}
                        >
                          {item.data.category}
                        </span>
                      </div>
                    );
                  } else {
                    const p = item.data;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelect(idx)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                          isSelected ? 'bg-mint text-bg font-bold' : 'text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-mono uppercase font-black"
                            style={{ backgroundColor: p.avatarBgColor || '#FF5C8D' }}
                          >
                            <User size={13} />
                          </div>
                          <div>
                            <span className="font-heading font-black">{p.name}, {p.age}</span>
                            <span className={`ml-2 text-[11px] ${isSelected ? 'text-bg/80' : 'text-muted'}`}>
                              • {p.locality}, {p.city}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-[10px] uppercase ${
                              isSelected ? 'text-bg/80' : 'text-muted'
                            }`}
                          >
                            ₹{(p.budgetMin / 1000).toFixed(0)}k–{(p.budgetMax / 1000).toFixed(0)}k
                          </span>
                          <ArrowRight size={13} className={isSelected ? 'text-bg' : 'text-mint'} />
                        </div>
                      </div>
                    );
                  }
                })
              )}
            </div>

            {/* Footer tip */}
            <div className="px-4 py-2 border-t border-line bg-surface/90 flex items-center justify-between text-[11px] text-muted font-mono">
              <span>Use ↑ ↓ to navigate, Enter to select</span>
              <span>⌘K to toggle</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

