import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TradingProvider } from './context/TradingContext';
import AppLayout from './layouts/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PositionsPage from './pages/PositionsPage';
import SignalsPage from './pages/SignalsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BotControlPage from './pages/BotControlPage';
import AlertsPage from './pages/AlertsPage';
import TradeJournalPage from './pages/TradeJournalPage';
import MLModelPage from './pages/MLModelPage';
import TelegramPage from './pages/TelegramPage';
import SettingsPage from './pages/SettingsPage';
import PublicPerformancePage from './pages/PublicPerformancePage';
import LeaderboardPage from './pages/LeaderboardPage';

// Authenticated pages wrapped in AppLayout
const AppPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppLayout>{children}</AppLayout>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <TradingProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/performance/:username" element={<PublicPerformancePage />} />

          {/* Authenticated app routes */}
          <Route path="/dashboard" element={<AppPage><DashboardPage /></AppPage>} />
          <Route path="/positions" element={<AppPage><PositionsPage /></AppPage>} />
          <Route path="/signals" element={<AppPage><SignalsPage /></AppPage>} />
          <Route path="/analytics" element={<AppPage><AnalyticsPage /></AppPage>} />
          <Route path="/bot" element={<AppPage><BotControlPage /></AppPage>} />
          <Route path="/alerts" element={<AppPage><AlertsPage /></AppPage>} />
          <Route path="/journal" element={<AppPage><TradeJournalPage /></AppPage>} />
          <Route path="/ml" element={<AppPage><MLModelPage /></AppPage>} />
          <Route path="/telegram" element={<AppPage><TelegramPage /></AppPage>} />
          <Route path="/settings" element={<AppPage><SettingsPage /></AppPage>} />
          <Route path="/leaderboard" element={<AppPage><LeaderboardPage /></AppPage>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TradingProvider>
    </BrowserRouter>
  );
};

export default App;
