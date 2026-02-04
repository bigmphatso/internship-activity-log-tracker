
import React, { useState } from 'react';
import { Week, Internship, Day, User } from '../types';
import { generateWeeklyPdf, generateWeeklyExcel } from '../services/reportGenerator';
import DayEditorModal from './DayEditorModal';
import { Download, Edit } from 'lucide-react';

const WeekView: React.FC<{
  week: Week;
  internship: Internship;
  user: User;
  onUpdate: (internship: Internship) => void;
}> = ({ week, internship, user, onUpdate }) => {
  const [editingDay, setEditingDay] = useState<Day | null>(null);

  const handleSaveActivity = (dayDate: string, newLog: Record<string, string>) => {
    const updatedInternship = { ...internship };
    const weekIndex = updatedInternship.weeks.findIndex(w => w.weekNumber === week.weekNumber);
    if (weekIndex === -1) return;
    
    const dayIndex = updatedInternship.weeks[weekIndex].days.findIndex(d => d.date === dayDate);
    if (dayIndex === -1) return;

    updatedInternship.weeks[weekIndex].days[dayIndex].log = newLog;
    onUpdate(updatedInternship);
  };
  
  const isDayEmpty = (day: Day) => {
    return Object.values(day.log).every(value => value.trim() === '');
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Daily Logs for Week {week.weekNumber}</h3>
        <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => generateWeeklyPdf(internship, week.weekNumber, user)} className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 inline-flex items-center gap-1.5">
                <Download size={14} /> PDF
            </button>
            <button onClick={() => generateWeeklyExcel(internship, week.weekNumber, user)} className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 inline-flex items-center gap-1.5">
                <Download size={14} /> Excel
            </button>
        </div>
      </div>
      <div className="space-y-4">
        {week.days.map(day => (
          <div key={day.date} className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-start gap-4 group transition-all duration-200 hover:border-indigo-500 hover:shadow-sm">
            <div className="flex-grow">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              
              {isDayEmpty(day) ? (
                 <p className="text-sm text-slate-400 dark:text-slate-500 italic mt-2">No activity logged.</p>
              ) : (
                <div className="mt-2 space-y-2 prose prose-sm dark:prose-invert max-w-none">
                  {internship.logFields.map(field => day.log[field] && (
                    <div key={field}>
                      <h4 className="font-semibold text-slate-600 dark:text-slate-300 !mb-0.5">{field}</h4>
                      <p className="!mt-0 line-clamp-3">{day.log[field]}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
                onClick={() => setEditingDay(day)}
                className="flex-shrink-0 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-slate-800 inline-flex items-center gap-2 transition-transform duration-200 sm:translate-x-4 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100"
            >
              <Edit size={14} />
              {isDayEmpty(day) ? 'Add' : 'Edit'} Log
            </button>
          </div>
        ))}
      </div>

       {editingDay && (
        <DayEditorModal
          day={editingDay}
          logFields={internship.logFields}
          onClose={() => setEditingDay(null)}
          onSave={(log) => {
            handleSaveActivity(editingDay.date, log);
          }}
        />
      )}
    </div>
  );
};

export default WeekView;
