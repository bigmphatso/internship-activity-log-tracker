
import React from 'react';
import { AlertTriangle, Book } from 'lucide-react';

const FirebaseNotConfigured: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-amber-500" />
        <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
          Firebase Not Configured
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          This application requires a Firebase backend to function, but it seems like it's not set up yet.
        </p>
        <div className="mt-8 text-left bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 inline-flex items-center gap-2"><Book size={20}/> To get started, follow these steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                <li>Create a project in the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">Firebase Console</a>.</li>
                <li>Create a Web App and copy the configuration object.</li>
                <li>Paste the configuration into the `firebase-config.ts` file in the project root.</li>
                <li>Enable **Email/Password** authentication in the Firebase console.</li>
                <li>Set up a **Firestore Database** and update the security rules as per the `README.md`.</li>
                 <li>Ensure your Gemini API key is also configured to enable AI features.</li>
            </ol>
        </div>
        <p className="mt-6 text-xs text-slate-500">
            Refer to the `README.md` file for detailed, step-by-step instructions.
        </p>
      </div>
    </div>
  );
};

export default FirebaseNotConfigured;
