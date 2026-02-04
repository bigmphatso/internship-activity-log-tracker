
import React, { useState } from 'react';
import { User as UserIcon } from 'lucide-react';

interface UserProfileSetupProps {
  onComplete: (fullName: string, username: string) => void;
}

const UserProfileSetup: React.FC<UserProfileSetupProps> = ({ onComplete }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && username.trim()) {
      onComplete(fullName, username);
    }
  };

  const InputField: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {icon}
      </div>
      {children}
    </div>
  );

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">Tell us about you!</h2>
      <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
        Let's create your profile first.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
          <InputField icon={<UserIcon className="h-5 w-5 text-slate-400" />}>
            <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Jane Doe" required />
          </InputField>
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
          <InputField icon={<UserIcon className="h-5 w-5 text-slate-400" />}>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., janedoe" required />
          </InputField>
        </div>
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-slate-800 transition-colors">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfileSetup;
