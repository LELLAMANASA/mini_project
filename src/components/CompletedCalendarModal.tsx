import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  Clock, 
  Tag, 
  AlertCircle,
  Undo2
} from 'lucide-react';
import { TaskType } from '../types';

interface CompletedCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskType[];
  onToggleTaskCompletion: (id: string) => void;
  playClickSound: () => void;
}

export function CompletedCalendarModal({
  isOpen,
  onClose,
  tasks,
  onToggleTaskCompletion,
  playClickSound
}: CompletedCalendarModalProps) {
  if (!isOpen) return null;

  // Track calendar navigation
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Helper to extract the local YYYY-MM-DD string from a Date object
  const getLocalDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Helper to extract the completion date from a task
  const getTaskCompletionDateStr = (task: TaskType): string | null => {
    if (!task.completed) return null;
    if (task.completedAt && typeof task.completedAt === 'string') {
      return task.completedAt.split('T')[0];
    }
    // Fallback: If no completedAt timestamp but task is completed, default to its dueDate or today
    return task.dueDate || new Date().toISOString().split('T')[0];
  };

  // Group completed tasks by completion date
  const completedTasksMap: Record<string, TaskType[]> = {};
  if (Array.isArray(tasks)) {
    tasks.forEach(t => {
      if (t && t.completed) {
        const dateStr = getTaskCompletionDateStr(t);
        if (dateStr) {
          if (!completedTasksMap[dateStr]) {
            completedTasksMap[dateStr] = [];
          }
          completedTasksMap[dateStr].push(t);
        }
      }
    });
  }

  // Month navigation handlers
  const handlePrevMonth = () => {
    playClickSound();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    playClickSound();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar grid info
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Calendar dates grid array
  const calendarDays: (Date | null)[] = [];
  
  // Fill prefix empty spaces
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }

  // Fill actual month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Selected date info
  const selectedDateStr = getLocalDateString(selectedDate);
  const selectedCompletedTasks = completedTasksMap[selectedDateStr] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CalendarIcon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-850 dark:text-white">
                Completed Tasks Calendar
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Browse and check tasks accomplished day by day
              </p>
            </div>
          </div>
          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Close Calendar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Grid: Left is Calendar Grid, Right/Bottom is Tasks details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Calendar Widget (7 Cols on desktop) */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Month Switcher Header */}
              <div className="flex items-center justify-between bg-slate-100/50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-200/40 dark:border-slate-700/30">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {monthNames[month]} {year}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 text-center gap-1">
                {daysOfWeek.map(d => (
                  <span key={d} className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-1 font-mono">
                    {d}
                  </span>
                ))}
              </div>

              {/* Calendar Days Matrix */}
              <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${idx}`} className="aspect-square" />;
                  }

                  const dateStr = getLocalDateString(day);
                  const completedTasksCount = (completedTasksMap[dateStr] || []).length;
                  const isSelected = selectedDateStr === dateStr;
                  const isToday = getLocalDateString(new Date()) === dateStr;

                  return (
                    <button
                      key={dateStr}
                      onClick={() => { playClickSound(); setSelectedDate(day); }}
                      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition cursor-pointer p-1 border group ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/25'
                          : isToday
                            ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-350 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'bg-slate-50/40 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      {/* Day number */}
                      <span className="text-xs font-bold font-mono">
                        {day.getDate()}
                      </span>

                      {/* Completed Badge Indicator */}
                      {completedTasksCount > 0 && (
                        <div className={`absolute bottom-1 px-1 rounded-md text-[8px] font-black leading-none ${
                          isSelected 
                            ? 'bg-white text-indigo-700' 
                            : 'bg-emerald-500 text-white'
                        }`}>
                          {completedTasksCount}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-[10px] text-slate-450 dark:text-slate-400 justify-center pt-2 border-t border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-indigo-600" /> Selected Day
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-emerald-500" /> Completed Tasks
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded border border-slate-350 bg-slate-150" /> Today
                </div>
              </div>

            </div>

            {/* List Panel for Selected Date Tasks (5 Cols on desktop) */}
            <div className="md:col-span-5 flex flex-col justify-start bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-800/40 p-4 min-h-[300px]">
              
              {/* Selected Header */}
              <div className="pb-3 border-b border-slate-200/50 dark:border-slate-700/50 mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
                  DAILY LOG REPORT
                </span>
                <h3 className="text-sm font-black text-slate-800 dark:text-white mt-0.5">
                  {selectedDate.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] pr-1">
                {selectedCompletedTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                    <AlertCircle className="w-8 h-8 mb-2 opacity-60 text-slate-400" />
                    <span className="text-xs font-bold">No Completed Tasks</span>
                    <p className="text-[11px] mt-1 text-slate-450 max-w-[180px]">
                      Select another day or tick tasks as done to build your learning logs.
                    </p>
                  </div>
                ) : (
                  selectedCompletedTasks.map(task => {
                    const priorityColor = {
                      urgent: 'from-rose-500 to-rose-600 text-rose-50',
                      high: 'from-orange-500 to-orange-600 text-orange-50',
                      medium: 'from-amber-500 to-amber-600 text-amber-50',
                      low: 'from-emerald-500 to-emerald-600 text-emerald-50'
                    }[task.priority || 'medium'];

                    const categoryColor = {
                      Study: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/50',
                      Personal: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/50',
                      Internship: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/50',
                      Project: 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border-pink-200/50',
                      Exam: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/50'
                    }[task.category || 'Study'];

                    return (
                      <div 
                        key={task.id} 
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col gap-2 hover:border-slate-200 dark:hover:border-slate-750 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-2 leading-snug">
                                {task.title}
                              </h4>
                              {task.notes && (
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 italic max-w-[220px] line-clamp-2">
                                  "{task.notes}"
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Revert / Re-open Task Button */}
                          <button
                            onClick={() => onToggleTaskCompletion(task.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition cursor-pointer flex-shrink-0"
                            title="Re-open task / Mark incomplete"
                          >
                            <Undo2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Badges footer */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-50 dark:border-slate-800/40 text-[9px]">
                          {/* Category */}
                          <span className={`px-2 py-0.5 rounded-md border font-medium ${categoryColor}`}>
                            {task.category}
                          </span>

                          {/* Priority */}
                          <span className={`px-2 py-0.5 rounded-md bg-gradient-to-r font-black tracking-wider uppercase ${priorityColor}`}>
                            {task.priority}
                          </span>

                          {/* Completion time indicator */}
                          {task.completedAt && (
                            <span className="text-slate-450 dark:text-slate-500 ml-auto font-mono flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end">
          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100 text-white transition cursor-pointer shadow-sm"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
}
