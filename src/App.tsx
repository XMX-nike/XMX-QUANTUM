import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TradingProvider } from './context/TradingContext';
import AppLayout from './layouts/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
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

// Page transition wrapper
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.22, ease: 'easeInOut' }}
    style={{ width: '100%' }}
  >
    {children}
  </motion.div>
);

// Inner router that has access to useLocation
const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignUpPage /></PageTransition>} />
        <Route path="/performance/:username" element={<PageTransition><PublicPerformancePage /></PageTransition>} />

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
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <TradingProvider>
        <AppRoutes />
      </TradingProvider>
    </BrowserRouter>
  );
};

export default App;
