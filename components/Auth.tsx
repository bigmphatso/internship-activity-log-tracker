
import React, { useState } from 'react';
import { signIn, signUp } from '../services/firebase';
import { Mail, Key, User as UserIcon } from 'lucide-react';

interface AuthProps {
  setNotification: (notification: { message: string, type: 'info' | 'success' | 'warning' | 'error' }) => void;
}

const Auth: React.FC<AuthProps> = ({ setNotification }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setNotification({ message: "Passwords do not match.", type: 'error' });
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signIn(email, password);
        setNotification({ message: "Successfully logged in!", type: 'success' });
      } else {
        await signUp(email, password);
        setNotification({ message: "Account created successfully! Please log in.", type: 'success' });
        setIsLogin(true); // Switch to login view after successful signup
      }
    } catch (error) {
      if (error instanceof Error) {
          setNotification({ message: error.message, type: 'error' });
      } else {
          setNotification({ message: "An unknown error occurred.", type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const InputField: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>
      {children}
    </div>
  );

  return (
    <div className="max-w-sm mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
      <p className="text-center text-slate-600 dark:text-slate-400 mb-8">{isLogin ? 'Sign in to continue' : 'Get started by creating an account'}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
          <InputField icon={<Mail className="h-5 w-5 text-slate-400" />}>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </InputField>
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <InputField icon={<Key className="h-5 w-5 text-slate-400" />}>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </InputField>
        </div>
        {!isLogin && (
          <div>
            <label htmlFor="confirmPassword"className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
            <InputField icon={<Key className="h-5 w-5 text-slate-400" />}>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </InputField>
          </div>
        )}
        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-slate-800">
          {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>
      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline ml-1">
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default Auth;
