import Billing from '@/components/dashboard/Billing';
import { SeenIncidents } from '@/components/dashboard/incidents/SeenIncidents';
import { UnseenIncidents } from '@/components/dashboard/incidents/UnseenIncidents';
import ClosedIssues from '@/components/dashboard/issues/ClosedIssues';
import { OpenIssues } from '@/components/dashboard/issues/OpenIssues';
import { UnseenIssues } from '@/components/dashboard/issues/UnseenIssues';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/ProtectedRoute';
import ConfigurationSection from './components/settings/configuration/ConfigurationSection';
import ProfileSection from './components/settings/profile/ProfileSection';
import ProjectDetail from './components/settings/project/projectDetails/ProjectDetailsSection';
import ProjectSection from './components/settings/project/ProjectSection';
import TeamSection from './components/settings/team/TeamSection';
import { ThemeProvider } from './components/theme-provider';
import Authentication from './pages/Authentication';
import Dashboard from './pages/Dashboard';
import Getip from './pages/Getip';
import Home from './pages/Home';
import PaymentConfirmation from './pages/PaymentConfirmation';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster theme="dark" />
      <Router>
        <AppLayout />
      </Router>
    </ThemeProvider>
  );
}

export default App;

function AppLayout() {
  const location = useLocation();

  let backgroundClr;

  if (location.pathname.startsWith('/dashboard')) {
    backgroundClr = 'bg-sidebar'; // Dashboard background
  } else if (location.pathname === '/') {
    backgroundClr = 'bg-[#0d0b0e]'; // Home background
  } else {
    backgroundClr = 'bg-background'; // Other pages
  }

  return (
    <div className={`${backgroundClr} flex min-h-screen`}>
      <div className={`${backgroundClr} w-full max-w-500 mx-auto`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/getmyip" element={<Getip />} />
          <Route path="/paymentconfirmation" element={<PaymentConfirmation />} />

          {/* Protected dashboard with nested routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* Dashboard pages */}
            <Route path="unseen-incidents" element={<UnseenIncidents />} />
            <Route path="seen-incidents" element={<SeenIncidents />} />
            <Route path="unseen-issues" element={<UnseenIssues />} />
            <Route path="open-issues" element={<OpenIssues />} />
            <Route path="closed-issues" element={<ClosedIssues />} />

            {/* Settings with nested tabs */}
            <Route path="settings" element={<Settings />}>
              <Route index element={<ProfileSection />} />
              <Route path="profile" element={<ProfileSection />} />
              <Route path="team" element={<TeamSection />} />
              <Route path="projects" element={<ProjectSection />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              <Route path="configurations" element={<ConfigurationSection />} />
            </Route>

            {/* Billing page */}
            <Route path="billing" element={<Billing />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
