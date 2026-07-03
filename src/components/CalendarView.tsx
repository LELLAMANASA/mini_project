import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckSquare, 
  Square,
  X,
  PlusCircle,
  GraduationCap,
  Sparkles,
  Trash2,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TaskType, ExamType } from '../types';
import { playSuccessChime, playClickSound } from '../utils/audio';

interface CalendarViewProps {
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  exams: ExamType[];
  setExams: React.Dispatch<React.SetStateAction<ExamType[]>>;
  onRewardXP: (xp: number, message: string) => void;
}

export default function CalendarView({ tasks, setTasks, exams, setExams, onRewardXP }: CalendarViewProps) {
  // Current Calendar Context default to June 2026 (matching default dates)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Dialog trackers
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showExamAdd, setShowExamAdd] = useState(false);

  // Custom Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Quick task form state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPrio, setQuickPrio] = useState<'high' | 'medium' | 'low'>('medium');
  const [quickCat, setQuickCat] = useState<'Study' | 'Personal' | 'Project'>('Study');

  // Exam form state
  const [examSubject, setExamSubject] = useState('');
  const [examType, setExamType] = useState<'Midterm' | 'Final' | 'Quiz' | 'Practical'>('Final');
  const [examNotes, setExamNotes] = useState('');

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    playClickSound();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    playClickSound();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleCellClick = (dayNum: number) => {
    playClickSound();
    const formattedMonth = (month + 1).toString().padStart(2, '0');
    const formattedDay = dayNum.toString().padStart(2, '0');
    const targetDateStr = `${year}-${formattedMonth}-${formattedDay}`;
    setSelectedDateStr(targetDateStr);
    
    setQuickTitle('');
    setShowQuickAdd(true);
  };

  // Generate cells
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const daysArr: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArr.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArr.push(i);
  }

  const getTasksForDate = (dateStr: string) => {
    return tasks.filter(t => t.dueDate === dateStr);
  };

  const getExamsForDate = (dateStr: string) => {
    return exams.filter(e => e.examDate === dateStr);
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    if (!quickTitle.trim()) return;

    const newTask: TaskType = {
      id: `t-${Date.now()}`,
      title: quickTitle.trim(),
      notes: 'Quickly logged via Month Calendar view.',
      priority: quickPrio,
      category: quickCat === 'Study' ? 'Study' : quickCat === 'Project' ? 'Project' : 'Personal',
      dueDate: selectedDateStr,
      dueTime: '17:00',
      completed: false,
      subtasks: [],
      recurring: 'none',
      reminder: false
    };

    setTasks(prev => [newTask, ...prev]);
    onRewardXP(15, `Scheduled: ${quickTitle}`);
    setQuickTitle('');
    setShowQuickAdd(false);
  };

  const handleExamAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    if (!examSubject.trim()) return;

    const newExam: ExamType = {
      id: `exam-${Date.now()}`,
      subject: examSubject.trim(),
      examDate: selectedDateStr,
      examType: examType,
      notes: examNotes.trim()
    };

    setExams(prev => [...prev, newExam]);
    onRewardXP(40, `Logged upcoming ${examType} exam in ${examSubject}!`);
    setExamSubject('');
    setExamNotes('');
    setShowExamAdd(false);
  };

  const handleToggleCompleted = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) {
          playSuccessChime();
        } else {
          playClickSound();
        }
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const handleDeleteExam = (id: string) => {
    playClickSound();
    setConfirmModal({
      isOpen: true,
      title: "Delete Exam from Calendar",
      message: "Are you sure you want to delete this scheduled exam? This action is permanent.",
      onConfirm: () => {
        setExams(prev => prev.filter(e => e.id !== id));
      }
    });
  };

  const focusedTasks = getTasksForDate(selectedDateStr);
  const focusedExams = getExamsForDate(selectedDateStr);

  return (
    <div className="space-y-6" id="calendar-workspace">
      
      {/* Calendar & Exams split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left main Calendar widget */}
        <div className="xl:col-span-8 p-6 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-md">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" /> {monthNames[month]} {year}
            </h2>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/40 p-1 rounded-xl">
              <button 
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => { 
                  playClickSound(); 
                  const today = new Date();
                  setCurrentDate(today); 
                  setSelectedDateStr(today.toISOString().split('T')[0]);
                }}
                className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-750"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Week column labels */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 dark:text-slate-500 mb-3 font-mono uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Cell structures with fluid page transition on month change */}
          <div className="overflow-hidden min-h-[350px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${month}-${year}`}
                initial={{ opacity: 0, x: 20, scale: 0.99 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.99 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-7 gap-2.5"
                id="calendar-cells-grid"
              >
                {daysArr.map((dayVal, cellIdx) => {
                  if (dayVal === null) {
                    return (
                      <div 
                        key={`empty-${cellIdx}`} 
                        className="h-20 bg-slate-50/5 dark:bg-slate-900/5 rounded-2xl border border-dashed border-slate-200/40 dark:border-slate-800/40 opacity-40" 
                      />
                    );
                  }

                  const formattedMonth = (month + 1).toString().padStart(2, '0');
                  const formattedDay = dayVal.toString().padStart(2, '0');
                  const cellDateStr = `${year}-${formattedMonth}-${formattedDay}`;
                  
                  const cellTasks = getTasksForDate(cellDateStr);
                  const cellExams = getExamsForDate(cellDateStr);
                  const isSelected = selectedDateStr === cellDateStr;
                  const isToday = year === new Date().getFullYear() && month === new Date().getMonth() && dayVal === new Date().getDate();
                  const isWeekend = cellIdx % 7 === 0 || cellIdx % 7 === 6;

                  const totalTasks = cellTasks.length;
                  const completedTasks = cellTasks.filter(t => t.completed).length;
                  const allTasksCompleted = totalTasks > 0 && completedTasks === totalTasks;
                  const hasExams = cellExams.length > 0;
                  const hasTasks = totalTasks > 0;

                  // High quality visual styles
                  let cellBgClass = "";
                  let borderClass = "";
                  let textClass = "";

                  if (isSelected) {
                    cellBgClass = "bg-gradient-to-br from-indigo-500/15 to-indigo-600/5 dark:from-indigo-500/25 dark:to-indigo-500/5 shadow-md shadow-indigo-500/10";
                    borderClass = "border-indigo-500 ring-2 ring-indigo-500/30 dark:ring-indigo-500/40";
                    textClass = "text-indigo-600 dark:text-indigo-400 font-extrabold";
                  } else if (isToday) {
                    cellBgClass = "bg-gradient-to-br from-orange-500/10 to-transparent dark:from-orange-500/15 dark:to-transparent";
                    borderClass = "border-orange-500 ring-2 ring-orange-500/20";
                    textClass = "text-orange-600 dark:text-orange-400 font-extrabold";
                  } else if (hasExams) {
                    cellBgClass = "bg-gradient-to-br from-pink-500/8 to-pink-500/2 dark:from-pink-500/15 dark:to-transparent";
                    borderClass = "border-pink-300 dark:border-pink-900/40 hover:border-pink-400 dark:hover:border-pink-750";
                    textClass = "text-pink-600 dark:text-pink-400 font-bold";
                  } else if (allTasksCompleted) {
                    cellBgClass = "bg-gradient-to-br from-emerald-500/8 to-emerald-500/2 dark:from-emerald-500/15 dark:to-transparent";
                    borderClass = "border-emerald-300 dark:border-emerald-900/40 hover:border-emerald-400 dark:hover:border-emerald-750";
                    textClass = "text-emerald-600 dark:text-emerald-400 font-bold";
                  } else if (hasTasks) {
                    cellBgClass = "bg-gradient-to-br from-indigo-500/4 to-transparent dark:from-indigo-500/8 dark:to-transparent";
                    borderClass = "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800";
                    textClass = "text-slate-800 dark:text-slate-200 font-semibold";
                  } else if (isWeekend) {
                    cellBgClass = "bg-slate-50/40 dark:bg-slate-900/20";
                    borderClass = "border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700";
                    textClass = "text-slate-500 dark:text-slate-400";
                  } else {
                    cellBgClass = "bg-white dark:bg-slate-900/40";
                    borderClass = "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700";
                    textClass = "text-slate-700 dark:text-slate-300";
                  }

                  return (
                    <motion.div
                      key={`day-${dayVal}`}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      onClick={() => handleCellClick(dayVal)}
                      className={`relative h-20 p-2 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all duration-300 ${cellBgClass} ${borderClass}`}
                    >
                      {/* Top Row inside cell */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${textClass}`}>
                          {dayVal}
                        </span>
                        
                        {/* Live breathing beacon if today */}
                        {isToday && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                          </span>
                        )}

                        {/* Special accents */}
                        {!isToday && hasExams && (
                          <Sparkles className="w-3 h-3 text-pink-500 animate-pulse" />
                        )}
                        {!isToday && !hasExams && allTasksCompleted && (
                          <CheckSquare className="w-3 h-3 text-emerald-500" />
                        )}
                      </div>

                      {/* Bottom row inside cell */}
                      <div className="w-full space-y-1">
                        {hasExams && (
                          <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400 px-1.5 py-0.5 rounded-md border border-pink-200/40 dark:border-pink-900/30">
                            <GraduationCap className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">Exam</span>
                          </div>
                        )}

                        {hasTasks && (
                          <div className="flex items-center justify-between gap-1 w-full">
                            <div className="flex items-center gap-0.5 shrink-0">
                              {cellTasks.slice(0, 3).map(t => (
                                <span 
                                  key={t.id} 
                                  className={`w-1 h-1 rounded-full ${t.completed ? 'bg-emerald-400 shadow-xs' : 'bg-indigo-500 shadow-xs'}`} 
                                />
                              ))}
                              {totalTasks > 3 && (
                                <span className="text-[6px] text-slate-400 dark:text-slate-500 font-mono">+{totalTasks - 3}</span>
                              )}
                            </div>
                            <span className={`text-[8px] font-mono font-bold ${allTasksCompleted ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-400 dark:text-slate-500'}`}>
                              {completedTasks}/{totalTasks}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/40 flex flex-wrap gap-4 text-[10px] font-mono uppercase text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 block" /> Academic Exam scheduled
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 block" /> Study Task scheduled
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-orange-500 block" /> {`Today (${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })})`}
            </span>
          </div>

        </div>

        {/* Right agenda panel & rapid tools */}
        <div className="xl:col-span-4 space-y-4">
          
          {/* Selected day logs list */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400">
                Agenda: {selectedDateStr}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500">
                {focusedTasks.length + focusedExams.length} items
              </span>
            </div>

            {/* List with smooth popLayout animation */}
            <div className="max-h-[290px] overflow-y-auto pr-1 no-scrollbar">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={selectedDateStr}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="space-y-3"
                >
                  {/* Exams */}
                  {focusedExams.map((ex, exIdx) => (
                    <motion.div 
                      key={ex.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: exIdx * 0.04 }}
                      className="p-3.5 bg-gradient-to-r from-pink-500/10 to-pink-500/2 border border-pink-500/20 rounded-2xl flex items-start justify-between gap-3 shadow-xs hover:border-pink-400/40 transition-all duration-300 group"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <span className="px-1.5 py-0.5 rounded bg-pink-500/10 dark:bg-pink-950/50 text-[8px] font-black uppercase text-pink-600 dark:text-pink-400 font-mono tracking-widest border border-pink-500/10">
                          {ex.examType} Exam
                        </span>
                        <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">{ex.subject}</h4>
                        {ex.notes && <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans leading-relaxed">{ex.notes}</p>}
                      </div>
                      <button 
                        onClick={() => handleDeleteExam(ex.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition shrink-0"
                        title="Remove Exam"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}

                  {/* Tasks */}
                  {focusedTasks.map((tk, tkIdx) => (
                    <motion.div 
                      key={tk.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (focusedExams.length + tkIdx) * 0.04 }}
                      className="p-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-indigo-450 dark:hover:border-indigo-500/30 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button 
                          onClick={() => handleToggleCompleted(tk.id)}
                          className="p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0"
                        >
                          {tk.completed ? (
                            <CheckSquare className="w-5 h-5 text-emerald-500 animate-scale-up" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition" />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-bold ${tk.completed ? 'line-through text-slate-400 dark:text-slate-500 font-medium' : 'text-slate-800 dark:text-slate-100'} truncate`}>
                            {tk.title}
                          </p>
                          <span className="text-[8px] font-mono font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-md mt-1 inline-block border border-indigo-500/10">
                            {tk.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {focusedTasks.length === 0 && focusedExams.length === 0 && (
                    <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                      <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-700 animate-pulse" />
                      <span>No exams or homework scheduled on this date.</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Selection quick creation controls */}
            <div className="flex items-center gap-2 pt-1.5">
              <button
                onClick={() => { playClickSound(); setShowQuickAdd(true); setShowExamAdd(false); }}
                className="flex-grow py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Task</span>
              </button>

              <button
                onClick={() => { playClickSound(); setShowExamAdd(true); setShowQuickAdd(false); }}
                className="flex-grow py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Log Exam</span>
              </button>
            </div>
          </div>

          {/* Quick Task add overlay */}
          <AnimatePresence>
            {showQuickAdd && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-slate-900/40 dark:to-slate-800/40 border border-indigo-200/30 dark:border-slate-800/60 shadow-xs relative overflow-hidden"
              >
                <button 
                  onClick={() => setShowQuickAdd(false)}
                  className="absolute right-4 top-4 p-1 text-slate-400 hover:text-rose-500"
                >
                  <X className="w-4 h-4" />
                </button>
                <h4 className="text-xs font-mono font-bold uppercase text-indigo-700 dark:text-indigo-400 flex items-center gap-1 mb-3">
                  <PlusCircle className="w-4 h-4" /> Quick Schedule Study Task
                </h4>
                <form onSubmit={handleQuickAddSubmit} className="space-y-3">
                  <input 
                    type="text" 
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    placeholder="e.g. Study calculus chapters..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={quickCat}
                      onChange={(e: any) => setQuickCat(e.target.value)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    >
                      <option value="Study">📚 Study</option>
                      <option value="Project">💼 Project</option>
                      <option value="Personal">🌱 Personal</option>
                    </select>
                    <select
                      value={quickPrio}
                      onChange={(e: any) => setQuickPrio(e.target.value)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    >
                      <option value="high">🚨 High</option>
                      <option value="medium">⚡ Medium</option>
                      <option value="low">☕ Low</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition">
                    Keep Schedule
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Exam add overlay */}
          <AnimatePresence>
            {showExamAdd && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="p-5 rounded-3xl bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-slate-900/40 dark:to-slate-850/40 border border-pink-200/30 dark:border-slate-800/60 shadow-xs relative overflow-hidden"
              >
                <button 
                  onClick={() => setShowExamAdd(false)}
                  className="absolute right-4 top-4 p-1 text-slate-400 hover:text-rose-500"
                >
                  <X className="w-4 h-4" />
                </button>
                <h4 className="text-xs font-mono font-bold uppercase text-pink-700 dark:text-pink-400 flex items-center gap-1.5 mb-3">
                  <GraduationCap className="w-4.5 h-4.5 text-pink-500" /> Log Academic Course Exam
                </h4>
                <form onSubmit={handleExamAddSubmit} className="space-y-3">
                  <div>
                    <label className="text-[9px] font-bold uppercase text-slate-400 font-mono block mb-1">Subject Title</label>
                    <input 
                      type="text" 
                      value={examSubject}
                      onChange={(e) => setExamSubject(e.target.value)}
                      placeholder="e.g. Digital Logic & Microprocessors"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold uppercase text-slate-400 font-mono block mb-1">Exam Type</label>
                      <select
                        value={examType}
                        onChange={(e: any) => setExamType(e.target.value)}
                        className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      >
                        <option value="Midterm">Midterm</option>
                        <option value="Final">Final Examination</option>
                        <option value="Quiz">Surprise Quiz</option>
                        <option value="Practical">Lab Practical</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase text-slate-400 font-mono block mb-1">Due date presets</label>
                      <div className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 font-bold dark:text-white">
                        {selectedDateStr}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase text-slate-400 font-mono block mb-1">Syllabus details / notes</label>
                    <input 
                      type="text" 
                      value={examNotes}
                      onChange={(e) => setExamNotes(e.target.value)}
                      placeholder="Chapters 1-5, carry scientific calculator..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                    />
                  </div>

                  <button type="submit" className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs font-bold cursor-pointer transition">
                    Schedule Exam Index
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Custom Confirmation Modal overlay */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 text-center animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">
              {confirmModal.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {confirmModal.message}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  playClickSound();
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-150 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  confirmModal.onConfirm();
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer shadow-md shadow-rose-600/15"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
