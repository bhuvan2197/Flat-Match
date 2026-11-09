import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-line bg-surface/40 mt-20 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-mint text-bg flex items-center justify-center font-black text-xs">
                FM
              </span>
              <span className="font-heading font-black tracking-tight text-white text-base">
                FLAT<span className="text-mint">MATCH</span>
              </span>
            </div>
            <p className="text-xs text-muted max-w-sm mt-1">
              "Because 'chill person' isn't a personality match." Find flatmates who actually live like you.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 font-mono text-xs uppercase tracking-micro text-muted">
            <Link to="/discover" className="hover:text-mint transition-colors">
              Discover
            </Link>
            <Link to="/onboarding" className="hover:text-mint transition-colors">
              Living Archetype Quiz
            </Link>
            <Link to="/verify" className="hover:text-mint transition-colors">
              Trust & Verification
            </Link>
            <Link to="/agreement" className="hover:text-mint transition-colors">
              Agreement PDF
            </Link>
            <Link to="/expenses" className="hover:text-mint transition-colors">
              Splitter
            </Link>
          </div>

          <div className="text-xs text-muted font-mono flex items-center gap-1.5">
            <span>Built for India with</span>
            <Heart size={13} className="text-pink fill-pink" />
            <span>Zero Brokerage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

