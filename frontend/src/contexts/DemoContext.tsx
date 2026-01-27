import { createContext, useContext, useState, ReactNode } from 'react';

interface DemoContextType {
  isDemoMode: boolean;
  setDemoMode: (isDemo: boolean) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);

  const setDemoMode = (isDemo: boolean) => {
    setIsDemoMode(isDemo);
    // Store in localStorage for persistence across routes
    if (isDemo) {
      localStorage.setItem('quillion_demo_mode', 'true');
      // Set demo auth flag
      localStorage.setItem('quillion_auth', 'authenticated');
    } else {
      localStorage.removeItem('quillion_demo_mode');
    }
  };

  return (
    <DemoContext.Provider value={{ isDemoMode, setDemoMode }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoProvider');
  }
  return context;
}

// Helper to check if currently in demo mode
export function checkIsDemoMode(): boolean {
  return localStorage.getItem('quillion_demo_mode') === 'true';
}




