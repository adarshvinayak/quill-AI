import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ReportPage from './pages/ReportPage';
import { DemoProvider } from './contexts/DemoContext';
import { checkIsDemoMode } from './contexts/DemoContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('quill_auth') === 'authenticated';
  const isDemoMode = checkIsDemoMode();
  
  // Allow access in demo mode or if authenticated
  return (isAuthenticated || isDemoMode) ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report/:id"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-black mb-4">404</h1>
                  <p className="text-2xl font-bold mb-8">PAGE NOT FOUND</p>
                  <a
                    href="/"
                    className="brutal-border brutal-shadow px-8 py-4 bg-electricBlue text-white font-black uppercase inline-block"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </DemoProvider>
  );
}

export default App;
