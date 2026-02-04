
import React, { useState } from 'react';
import { Briefcase, Calendar, Hash, Plus, X } from 'lucide-react';

interface InternshipSetupProps {
  onComplete: (location: string, totalWeeks: number, startDate: string, logFields: string[]) => void;
}

const InternshipSetup: React.FC<InternshipSetupProps> = ({ onComplete }) => {
  const [location, setLocation] = useState('');
  const [totalWeeks, setTotalWeeks] = useState(12);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [logFields, setLogFields] = useState<string[]>(['Tasks Completed', 'Notes']);

  const handleFieldChange = (index: number, value: string) => {
    const newFields = [...logFields];
    newFields[index] = value;
    setLogFields(newFields);
  };

  const addField = () => {
    setLogFields([...logFields, `New Field ${logFields.length + 1}`]);
  };

  const removeField = (index: number) => {
    const newFields = logFields.filter((_, i) => i !== index);
    setLogFields(newFields);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFields = logFields.map(f => f.trim()).filter(f => f); // Clean up fields
    if (location.trim() && totalWeeks > 0 && startDate && finalFields.length > 0) {
      onComplete(location, totalWeeks, startDate, finalFields);
    }
  };

  const InputField: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="relative">{icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>}{children}</div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">Internship Details</h2>
      <p className="text-center text-slate-600 dark:text-slate-400 mb-8">Just one more step! Tell us about your internship and how you'd like to structure your logs.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Internship Location / Company</label>
          <InputField icon={<Briefcase className="h-5 w-5 text-slate-400" />}><input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Google, Remote" required /></InputField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="totalWeeks" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of Weeks</label>
            <InputField icon={<Hash className="h-5 w-5 text-slate-400" />}><input type="number" id="totalWeeks" value={totalWeeks} onChange={(e) => setTotalWeeks(parseInt(e.target.value, 10))} className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" min="1" max="52" required /></InputField>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
            <InputField icon={<Calendar className="h-5 w-5 text-slate-400" />}><input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required /></InputField>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Customize Your Log Fields</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Define the categories you'll use for your daily entries. These will become the columns in your reports.</p>
            <div className="space-y-3 mt-4">
                {logFields.map((field, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <InputField icon={null}>
                            <input type="text" value={field} onChange={(e) => handleFieldChange(index, e.target.value)} className="block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Field Name" />
                        </InputField>
                        <button type="button" onClick={() => removeField(index)} className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400"><X size={18} /></button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={addField} className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900">
                <Plus size={16} /> Add Field
            </button>
        </div>

        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-slate-800 transition-colors">Start Tracking</button>
      </form>
    </div>
  );
};

export default InternshipSetup;
