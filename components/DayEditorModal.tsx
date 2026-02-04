
import React, { useState } from 'react';
import { Day } from '../types';

interface DayEditorModalProps {
    day: Day;
    logFields: string[];
    onSave: (log: Record<string, string>) => void;
    onClose: () => void;
}

const DayEditorModal: React.FC<DayEditorModalProps> = ({ day, logFields, onSave, onClose }) => {
    const [logData, setLogData] = useState(day.log || {});

    const handleInputChange = (field: string, value: string) => {
        setLogData(prev => ({...prev, [field]: value}));
    };

    const handleSave = () => {
        onSave(logData);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300"
             aria-modal="true"
             role="dialog"
        >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                        Log for {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h3>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {logFields.map(field => (
                            <div key={field}>
                                <label htmlFor={field} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{field}</label>
                                <textarea
                                    id={field}
                                    value={logData[field] || ''}
                                    onChange={(e) => handleInputChange(field, e.target.value)}
                                    className="w-full h-32 p-3 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-900 text-sm"
                                    placeholder={`Describe ${field.toLowerCase()}...`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Save Log</button>
                </div>
                <style>{`
                    @keyframes scale-in {
                        from { transform: scale(0.95); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                    .animate-scale-in {
                        animation: scale-in 0.2s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default DayEditorModal;
