
import React, { useState, useEffect } from 'react';
import { Internship, Week } from '../types';
import { generateSummary } from '../services/gemini';
import { Sparkles, Save, Loader } from 'lucide-react';

interface WeeklySummaryProps {
  week: Week;
  internship: Internship;
  onUpdate: (internship: Internship) => void;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ week, internship, onUpdate }) => {
  const [summary, setSummary] = useState(week.summary || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSummary(week.summary || '');
    setError('');
  }, [week]);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const generatedSummary = await generateSummary(week);
      setSummary(generatedSummary);
      // Auto-save after generating
      handleSaveSummary(generatedSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSummary = (currentSummary: string) => {
    const updatedInternship = { ...internship };
    const weekIndex = updatedInternship.weeks.findIndex(w => w.weekNumber === week.weekNumber);
    if (weekIndex !== -1) {
      updatedInternship.weeks[weekIndex].summary = currentSummary;
      onUpdate(updatedInternship);
    }
  };
  
  const isUnchanged = summary === (week.summary || '');

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Week {week.weekNumber} Summary</h3>
      {error && <p className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md mb-4 text-sm">{error}</p>}
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="w-full h-40 p-3 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-900 text-sm"
        placeholder="Manually enter a summary or generate one using AI."
        disabled={isLoading}
      />
      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-4">
        <button
          onClick={handleGenerateSummary}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="animate-spin" size={16} />
          ) : (
            <Sparkles size={16} />
          )}
          {isLoading ? 'Generating...' : 'Generate with AI'}
        </button>
        <button
          onClick={() => handleSaveSummary(summary)}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-indigo-600 rounded-md hover:bg-slate-700 dark:hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
          disabled={isLoading || isUnchanged}
        >
          <Save size={16} />
          Save Summary
        </button>
      </div>
    </div>
  );
};

export default WeeklySummary;
