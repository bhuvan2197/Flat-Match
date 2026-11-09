import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Heart,
  MessageSquare,
  ShieldCheck,
  Search,
  Sliders,
  Calculator,
  User,
  Sparkles,
  Menu,
  X,
  FileText,
  CalendarCheck,
  Building,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CommandPalette } from '../ui/CommandPalette';
import { ListFlatModal } from '../../features/tools/ListFlatModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { shortlist, safePaths, currentUser } = useAppStore();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isListFlatOpen, setIsListFlatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const shortlistCount = shortlist.length;
  const matchCount = Object.keys(safePaths).length;

  const navLinks = [
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Shortlist', path: '/shortlist', icon: Heart, badge: shortlistCount },
    { label: 'Matches', path: '/matches', icon: MessageSquare, badge: matchCount },
    { label: 'Verify', path: '/verify', icon: ShieldCheck },
    { label: 'Splitter', path: '/expenses', icon: Calculator },
    { label: 'Agreement', path: '/agreement', icon: FileText },
    { label: 'Rota', path: '/chores', icon: CalendarCheck },
  ];

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-mint flex items-center justify-center text-bg font-heading font-black text-lg transition-transform group-hover:rotate-6">
              FM
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black tracking-tight text-white text-lg leading-none">
                FLAT<span className="text-mint">MATCH</span>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-micro text-muted">
                INDIA • SAFE LIVING
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isCurrent(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-micro transition-all ${
                    active
                      ? 'bg-surface-2 text-mint border border-mint/40 font-bold'
                      : 'text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-mint' : 'text-muted'} />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="w-4 h-4 rounded-full bg-mint text-bg text-[9px] font-mono font-bold flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Quick ⌘K button */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-white/10 hover:border-white/30 text-xs text-muted hover:text-white transition-all font-mono"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline px-1.5 py-0.2 text-[9px] bg-white/10 rounded border border-white/10">
                ⌘K
              </kbd>
            </button>

            {/* List Flat Button */}
            <button
              onClick={() => setIsListFlatOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 border border-blue/40 text-blue hover:border-blue text-xs font-mono uppercase tracking-micro font-bold transition-all"
            >
              <Building size={13} />
              <span>List Flat</span>
            </button>

            {/* Profile Avatar / Living Style Pill */}
            <Link
              to="/profile/current-user"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface-2 border border-mint/40 hover:border-mint transition-all"
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-bg text-xs font-black font-mono"
                style={{ backgroundColor: currentUser.avatarBgColor || '#3DDBA5' }}
              >
                <User size={13} className="text-bg" />
              </div>
              <span className="text-xs font-heading font-black text-white hidden md:inline">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="hidden sm:inline font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-mint/15 text-mint font-bold">
                {currentUser.verification.tier}
              </span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-muted hover:text-white rounded-xl bg-surface border border-white/10"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-line bg-surface/95 backdrop-blur-xl px-4 py-4 space-y-2">
            <div className="grid grid-cols-2 gap-2 pb-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isCurrent(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-mono uppercase tracking-micro ${
                      active
                        ? 'bg-mint text-bg font-bold'
                        : 'bg-surface-2 text-white border border-white/10'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{link.label}</span>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="ml-auto w-4 h-4 rounded-full bg-white/20 text-[9px] flex items-center justify-center">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="pt-2 border-t border-line flex justify-between gap-2">
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-xs font-mono uppercase rounded-xl bg-white/5 border border-white/10 text-muted"
              >
                Settings
              </Link>
              <Link
                to="/onboarding"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-xs font-mono uppercase rounded-xl bg-mint text-bg font-bold"
              >
                Retake Quiz
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile bottom persistent tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-line bg-bg/90 backdrop-blur-xl px-3 py-2 flex items-center justify-around">
        <Link
          to="/discover"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl font-mono text-[9px] uppercase tracking-micro ${
            isCurrent('/discover') ? 'text-mint font-bold' : 'text-muted'
          }`}
        >
          <Compass size={18} />
          <span>Discover</span>
        </Link>
        <Link
          to="/shortlist"
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl font-mono text-[9px] uppercase tracking-micro ${
            isCurrent('/shortlist') ? 'text-mint font-bold' : 'text-muted'
          }`}
        >
          <Heart size={18} />
          <span>Shortlist</span>
          {shortlistCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-mint" />
          )}
        </Link>
        <Link
          to="/matches"
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl font-mono text-[9px] uppercase tracking-micro ${
            isCurrent('/matches') ? 'text-mint font-bold' : 'text-muted'
          }`}
        >
          <MessageSquare size={18} />
          <span>Safe Path</span>
          {matchCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-blue" />
          )}
        </Link>
        <Link
          to="/verify"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl font-mono text-[9px] uppercase tracking-micro ${
            isCurrent('/verify') ? 'text-mint font-bold' : 'text-muted'
          }`}
        >
          <ShieldCheck size={18} />
          <span>Verify</span>
        </Link>
        <Link
          to="/profile/current-user"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl font-mono text-[9px] uppercase tracking-micro ${
            isCurrent('/profile/current-user') ? 'text-mint font-bold' : 'text-muted'
          }`}
        >
          <User size={18} />
          <span>Profile</span>
        </Link>
      </nav>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* List Flat Modal */}
      <ListFlatModal isOpen={isListFlatOpen} onClose={() => setIsListFlatOpen(false)} />
    </>
  );
};

