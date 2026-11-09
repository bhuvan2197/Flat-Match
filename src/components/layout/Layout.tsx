import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ToastContainer } from '../ui/ToastContainer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-white relative selection:bg-mint selection:text-black">
      {/* Subtle Film Grain Noise */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

