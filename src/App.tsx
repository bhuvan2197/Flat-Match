import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './features/landing/LandingPage';
import { OnboardingFlow } from './features/onboarding/OnboardingFlow';
import { DiscoverPage } from './features/discover/DiscoverPage';
import { SafePathMatchView, MatchesListPage } from './features/matches/SafePathMatchView';
import { VerificationPage } from './features/verify/VerificationPage';
import { ShortlistPage } from './features/shortlist/ShortlistPage';
import { ExpenseSplitterPage } from './features/tools/ExpenseSplitterPage';
import { AgreementGeneratorPage } from './features/tools/AgreementGeneratorPage';
import { ChoreRotaPage } from './features/tools/ChoreRotaPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { UserProfileView } from './features/profile/UserProfileView';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/profile/:id" element={<UserProfileView />} />
          <Route path="/matches" element={<MatchesListPage />} />
          <Route path="/matches/:matchId" element={<SafePathMatchView />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/shortlist" element={<ShortlistPage />} />
          <Route path="/expenses" element={<ExpenseSplitterPage />} />
          <Route path="/agreement" element={<AgreementGeneratorPage />} />
          <Route path="/chores" element={<ChoreRotaPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

