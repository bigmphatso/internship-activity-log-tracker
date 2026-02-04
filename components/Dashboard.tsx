
import React, { useState, useEffect } from 'react';
import { Internship, User } from '../types';
import WeekView from './WeekView';
import WeeklySummary from './WeeklySummary';
import { generateOverallPdf, generateOverallExcel } from '../services/reportGenerator';
import Modal from './Modal';
import { Download } from 'lucide-react';

interface DashboardProps {
  internship: Internship;
  user: User;
  onUpdate: (internship: Internship) => void;
}

const InternshipProgressBar: React.FC<{ startDate: string; totalWeeks: number }> = ({ startDate, totalWeeks }) => {
  const [progress, setProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const start = new Date(startDate);
    const totalDuration = totalWeeks * 7;
    const today = new Date();
    
    // To calculate the difference in days, ignoring the time part
    const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const daysPassed = Math.floor((startOfDay(today).getTime() - startOfDay(start).getTime()) / (1000 * 3600 * 24));
    
    const currentProgress = Math.min(Math.max((daysPassed / totalDuration) * 100, 0), 100);
    setProgress(currentProgress);
    setDaysLeft(Math.max(totalDuration - daysPassed, 0));
  }, [startDate, totalWeeks]);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Internship Progress</span>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{daysLeft} days left</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
        <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};


const Dashboard: React.FC<DashboardProps> = ({ internship, user, onUpdate }) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [showCongrats, setShowCongrats] = useState(false);

  const startDate = new Date(internship.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + internship.totalWeeks * 7 - 1);
  
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const internshipEndDate = new Date(internship.startDate);
    internshipEndDate.setDate(internshipEndDate.getDate() + internship.totalWeeks * 7); // Check day after last day
    internshipEndDate.setHours(0, 0, 0, 0);

    const isCompleted = today >= internshipEndDate;
    const isAcknowledged = localStorage.getItem('internship-completed-acknowledged') === 'true';

    if (isCompleted && !isAcknowledged) {
      setShowCongrats(true);
    }
  }, [internship.startDate, internship.totalWeeks]);

  const handleAcknowledgeCompletion = () => {
    localStorage.setItem('internship-completed-acknowledged', 'true');
    setShowCongrats(false);
  };
  
  const currentWeekData = internship.weeks.find(w => w.weekNumber === selectedWeek);

  return (
    <div className="space-y-8">
      <Modal
        isOpen={showCongrats}
        onClose={handleAcknowledgeCompletion}
        onConfirm={handleAcknowledgeCompletion}
        title="🎉 Congratulations! 🎉"
        confirmText="Awesome!"
        cancelText={null}
        confirmButtonClass="bg-green-600 hover:bg-green-700"
      >
        <div className="text-center space-y-4">
          <p>You've successfully completed your internship! This is a huge accomplishment.</p>
          <p>Don't forget to export your final report for your records. Well done!</p>
        </div>
      </Modal>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Internship at {internship.location}</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()} ({internship.totalWeeks} weeks)
                </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => generateOverallPdf(internship, user)} className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-slate-800 inline-flex items-center gap-2">
                    <Download size={16} /> PDF
                </button>
                <button onClick={() => generateOverallExcel(internship, user)} className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-slate-800 inline-flex items-center gap-2">
                    <Download size={16} /> Excel
                </button>
            </div>
        </div>
        <InternshipProgressBar startDate={internship.startDate} totalWeeks={internship.totalWeeks} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Weeks</h3>
            <ul className="space-y-1">
                {internship.weeks.map(week => (
                <li key={week.weekNumber}>
                    <button
                    onClick={() => setSelectedWeek(week.weekNumber)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        selectedWeek === week.weekNumber
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    >
                    Week {week.weekNumber}
                    </button>
                </li>
                ))}
            </ul>
        </div>
        <div className="md:col-span-9 lg:col-span-10">
            {currentWeekData && (
              <div className="space-y-8">
                <WeeklySummary
                  key={`summary-${currentWeekData.weekNumber}`}
                  week={currentWeekData}
                  internship={internship}
                  onUpdate={onUpdate}
                />
                <WeekView
                    key={currentWeekData.weekNumber}
                    week={currentWeekData}
                    internship={internship}
                    user={user}
                    onUpdate={onUpdate}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
