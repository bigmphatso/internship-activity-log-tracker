
import React, { useState, useEffect } from 'react';
import { Internship, User } from './types';
import UserProfileSetup from './components/UserProfileSetup';
import InternshipSetup from './components/InternshipSetup';
import Dashboard from './components/Dashboard';
import Modal from './components/Modal';
import Notification from './components/Notification';
import Auth from './components/Auth';
import Spinner from './components/Spinner';
import FirebaseNotConfigured from './components/FirebaseNotConfigured';
import { useAuth, AuthProvider } from './hooks/useAuth';
import { useFirestore } from './hooks/useFirestore';
import { checkFirebaseConfig, signOutUser } from './services/firebase';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Sun, Moon, BookUser, LogOut } from 'lucide-react';

type Theme = 'light' | 'dark';

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { internship, userProfile, loading: firestoreLoading, setInternship, setUserProfile } = useFirestore(user?.uid);
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'warning' | 'error' | 'success' } | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleProfileSetupComplete = (fullName: string, username: string) => {
    if (!user) return;
    const newUserProfile: User = { uid: user.uid, fullName, username, email: user.email };
    setUserProfile(newUserProfile);
  };

  const handleInternshipSetupComplete = (location: string, totalWeeks: number, startDateString: string, logFields: string[]) => {
    const startDate = new Date(`${startDateString}T00:00:00`);
    
    // Initialize the log structure for each day based on the custom fields
    const initialLog = logFields.reduce((acc, field) => {
        acc[field] = '';
        return acc;
    }, {} as Record<string, string>);

    const newInternship: Internship = {
      location,
      totalWeeks,
      startDate: startDate.toISOString(),
      logFields,
      weeks: Array.from({ length: totalWeeks }, (_, weekIndex) => ({
        weekNumber: weekIndex + 1,
        days: Array.from({ length: 7 }, (_, dayIndex) => {
          const dayDate = new Date(startDate.getTime());
          dayDate.setDate(dayDate.getDate() + (weekIndex * 7) + dayIndex);
          return { date: dayDate.toISOString(), log: { ...initialLog } };
        }),
      })),
    };
    setInternship(newInternship);
  };
  
  const handleResetConfirm = async () => {
    await setInternship(null);
    await setUserProfile(null);
    setIsResetModalOpen(false);
  };

  const renderContent = () => {
    if (authLoading || firestoreLoading) {
      return <Spinner />;
    }
    if (!user) {
      return <Auth setNotification={setNotification} />;
    }
    if (!userProfile) {
      return <UserProfileSetup onComplete={handleProfileSetupComplete} />;
    }
    if (!internship) {
      return <InternshipSetup onComplete={handleInternshipSetupComplete} />;
    }
    return <Dashboard internship={internship} user={userProfile} onUpdate={setInternship} />;
  }

  if (!checkFirebaseConfig()) {
    return <FirebaseNotConfigured />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
      {notification && <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification(null)} />}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfirm}
        title="Confirm Reset"
      >
        <p>Are you sure you want to reset all your internship data? This will clear your profile and internship details from the cloud. This action cannot be undone.</p>
      </Modal>

      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookUser className="text-indigo-600 dark:text-indigo-400" size={28} />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Internship Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            {userProfile && (
              <>
                <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">Welcome, {userProfile.fullName}</span>
                <button onClick={() => setIsResetModalOpen(true)} className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-md hover:bg-red-200 dark:hover:bg-red-900">Reset</button>
                <button onClick={signOutUser} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><LogOut size={20} /></button>
              </>
            )}
            {/* <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button> */}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {renderContent()}
      </main>
      <footer className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
        <p>Securely stored in the cloud with Firebase.</p>
      </footer>
    </div>
  );
};


const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
