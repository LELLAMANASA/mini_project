import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Music, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  Sparkles,
  Flame,
  Target,
  ChevronRight,
  Plus,
  Briefcase,
  Award,
  Calendar as CalendarIcon,
  HelpCircle,
  Activity,
  Zap,
  ArrowRight,
  X
} from 'lucide-react';
import { TaskType, AssignmentType, AttendanceType, HabitType, ExamType, InternshipType, AudioTrackType } from '../types';
import { playClickSound } from '../utils/audio';

interface DashboardProps {
  tasks: TaskType[];
  assignments: AssignmentType[];
  attendance: AttendanceType[];
  habits: HabitType[];
  exams: ExamType[];
  internships: InternshipType[];
  activeTab: string;
  setActiveTab: (tab: any) => void;
  // Actions
  onAddTask: (task: Omit<TaskType, 'id'>) => void;
  onAddAssignment: (assign: Omit<AssignmentType, 'id'>) => void;
  onRewardXP: (xp: number, msg: string) => void;
  // Global Audio
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTrackIndex: number;
  setCurrentTrackIndex: (idx: number) => void;
  volume: number;
  setVolume: (vol: number) => void;
  tracks: AudioTrackType[];
  dailyGoalTarget: number;
  setDailyGoalTarget: (target: number) => void;
  username?: string;
  xp?: number;
  level?: number;
  streak?: number;
}

export default function Dashboard({
  tasks,
  assignments,
  attendance,
  habits,
  exams,
  internships,
  setActiveTab,
  onAddTask,
  onAddAssignment,
  onRewardXP,
  isPlaying,
  setIsPlaying,
  currentTrackIndex,
  setCurrentTrackIndex,
  volume,
  setVolume,
  tracks,
  dailyGoalTarget,
  setDailyGoalTarget,
  username = 'Venkatappaiah Lella',
  xp = 120,
  level = 2,
  streak = 5
}: DashboardProps) {

  // Goal config states
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [tempGoalValue, setTempGoalValue] = useState(dailyGoalTarget);

  // Quick Add states
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskCategory, setQuickTaskCategory] = useState<'Study' | 'Personal' | 'Project'>('Study');
  const [quickTaskPriority, setQuickTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const [quickAssignTitle, setQuickAssignTitle] = useState('');
  const [quickAssignSubject, setQuickAssignSubject] = useState('');
  const [quickAssignHours, setQuickAssignHours] = useState(3);

  // Audio Handlers
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIdx);
  };

  // Stats Calculations
  const todayStr = new Date().toISOString().split('T')[0];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;

  const overdueAssignments = assignments.filter(a => a.dueDate < todayStr && a.status !== 'Submitted' && a.status !== 'Completed').length;
  const dueTodayAssignments = assignments.filter(a => a.dueDate === todayStr && a.status !== 'Submitted' && a.status !== 'Completed').length;
  const dueThisWeekAssignments = assignments.filter(a => {
    const timeDiff = new Date(a.dueDate).getTime() - new Date(todayStr).getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff >= 0 && daysDiff <= 7 && a.status !== 'Submitted' && a.status !== 'Completed';
  }).length;

  const attendancePercent = attendance.length > 0
    ? Math.round((attendance.reduce((acc, a) => acc + a.present, 0) / attendance.reduce((acc, a) => acc + a.total, 0)) * 100)
    : 0;

  const attendanceWarning = attendance.some(a => (a.present / a.total) * 100 < 75);

  // Compute Streak
  const topStreak = streak !== undefined ? streak : (habits.length > 0 ? Math.max(...habits.map(h => h.streak), 0) : 0);

  // Compute Productivity Score
  const taskRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const assignRate = assignments.length > 0 ? (assignments.filter(a => a.status === 'Submitted' || a.status === 'Completed').length / assignments.length) * 100 : 0;
  
  const rawScore = Math.round((taskRate * 0.35) + (attendancePercent * 0.35) + (assignRate * 0.3));
  const productivityScore = isNaN(rawScore) || rawScore === 0 ? 76 : rawScore;

  // Handle Quick Add Task
  const handleQuickAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;

    onAddTask({
      title: quickTaskTitle,
      notes: 'Quick logged via StudySphere Dashboard',
      priority: quickTaskPriority === 'high' ? 'high' : quickTaskPriority === 'low' ? 'low' : 'medium',
      category: quickTaskCategory === 'Study' ? 'Study' : quickTaskCategory === 'Project' ? 'Project' : 'Personal',
      dueDate: todayStr,
      dueTime: '17:00',
      completed: false,
      subtasks: [],
      recurring: 'none',
      reminder: false
    });

    onRewardXP(10, `Logged Task: ${quickTaskTitle}!`);
    setQuickTaskTitle('');
    alert('Task added successfully!');
  };

  // Handle Quick Add Assignment
  const handleQuickAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAssignTitle.trim() || !quickAssignSubject.trim()) return;

    onAddAssignment({
      subject: quickAssignSubject,
      title: quickAssignTitle,
      description: 'Quick logged via StudySphere Dashboard',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days from now default
      priority: 'medium',
      status: 'Not Started',
      estimatedHours: quickAssignHours
    });

    onRewardXP(15, `Tracked Assignment: ${quickAssignTitle}!`);
    setQuickAssignTitle('');
    setQuickAssignSubject('');
    alert('Assignment added successfully!');
  };

  // Music details
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  const getAIAdvice = () => {
    const advice = [];
    if (attendanceWarning) {
      advice.push("Urgent: Some subjects fall below the 75% bar! Attend the next lecture to reset safety.");
    }
    if (overdueAssignments > 0) {
      advice.push(`You have ${overdueAssignments} overdue assignments. Tackle high priority work today.`);
    }
    if (productivityScore > 80) {
      advice.push("Exceptional pace! You are on track to unlock 'Master' rank achievements this week.");
    } else {
      advice.push("Try scheduling a 25-minute Pomodoro study block to jumpstart your pending assignments.");
    }
    return advice;
  };

  return (
    <div className="space-y-6">
      
      {/* SaaS Welcome Ribbon Banner */}
      <div className="p-6 rounded-[2rem] bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-indigo-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300">
              SaaS Pro Academic OS
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5 animate-spin" /> StudySphere Live
            </span>
          </div>
          <h1 className="text-3xl font-extrabold font-display text-slate-800 dark:text-white leading-tight">
            Welcome back, {username} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track, prioritize, and automate your coursework in our unified glassmorphic workspace.
          </p>

          {/* Real-time Level Progress Ribbon bar inside the banner to highlight the new feature! */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 max-w-lg">
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-1 rounded bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase font-mono tracking-wider">
                Lvl {level} Scholar
              </span>
              <span className="text-[10px] font-mono text-slate-400">({xp % 100}/100 XP)</span>
            </div>
            <div className="w-full sm:w-48 h-2 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden p-[1px] border border-slate-200/50 dark:border-slate-800/20">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
                style={{ width: `${xp % 100}%` }}
              ></div>
            </div>
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('profile');
              }}
              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
            >
              Open Gamer Card <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-500 fill-current animate-pulse" />
            <div className="text-left">
              <span className="text-[9px] text-slate-400 block font-mono leading-none"> streak tracker </span>
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100">{topStreak} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Core Dashboard Cards Grid (8 items!) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="saas-core-metrics-grid">
        
        {/* Card 1: Today's Tasks */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800/85 bg-white dark:bg-slate-900/40 hover:border-indigo-500 hover:shadow-sm transition cursor-pointer space-y-2 select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Today's Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{totalTasks}</h2>
          <div className="flex justify-between text-[10px] font-semibold text-slate-400 font-mono">
            <span className="text-green-500">{completedTasks} Done</span>
            <span>{pendingTasks} Pending</span>
          </div>
        </div>

        {/* Card 2: Assignments Status */}
        <div 
          onClick={() => setActiveTab('assignments')}
          className="p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800/85 bg-white dark:bg-slate-900/40 hover:border-indigo-500 hover:shadow-sm transition cursor-pointer space-y-2 select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Assignments</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{assignments.length}</h2>
          <div className="flex justify-between text-[10px] font-semibold font-mono">
            {overdueAssignments > 0 ? (
              <span className="text-red-500 font-bold">⚠️ {overdueAssignments} Overdue</span>
            ) : (
              <span className="text-slate-400">{dueTodayAssignments} Due Today</span>
            )}
            <span className="text-slate-400">{dueThisWeekAssignments} This Week</span>
          </div>
        </div>

        {/* Card 3: Attendance tracker */}
        <div 
          onClick={() => setActiveTab('attendance')}
          className="p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800/85 bg-white dark:bg-slate-900/40 hover:border-indigo-500 hover:shadow-sm transition cursor-pointer space-y-2 select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Attendance</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <h2 className={`text-2xl font-black ${attendanceWarning ? 'text-rose-500' : 'text-emerald-500'}`}>
            {attendancePercent}%
          </h2>
          <div className="text-[10px] font-semibold text-slate-400">
            {attendanceWarning ? (
              <span className="text-rose-500 font-bold">⚠️ Risk: below 75% cutoff</span>
            ) : (
              <span className="text-emerald-500 font-bold">✓ Satisfies university criteria</span>
            )}
          </div>
        </div>

        {/* Card 4: Study Hours Target */}
        <div 
          onClick={() => {
            playClickSound();
            setTempGoalValue(dailyGoalTarget);
            setIsGoalModalOpen(true);
          }}
          className="p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800/85 bg-white dark:bg-slate-900/40 hover:border-indigo-500 hover:shadow-sm transition cursor-pointer space-y-2 select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Daily Study Goal</span>
            <Clock className="w-4 h-4 text-purple-500 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{dailyGoalTarget} Hrs</h2>
          <div className="text-[10px] font-semibold text-indigo-500">
            Click to set daily study goal
          </div>
        </div>

        {/* Card 5: Productivity Score */}
        <div 
          onClick={() => setActiveTab('analytics')}
          className="p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800/85 bg-white dark:bg-slate-900/40 hover:border-indigo-500 hover:shadow-sm transition cursor-pointer space-y-2 select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Productivity Score</span>
            <Award className="w-4 h-4 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{productivityScore}%</h2>
          <div className="text-[10px] text-slate-400">
            Computed across 3 study metrics
          </div>
        </div>

        {/* Card 6: Upcoming Exams */}
        <div 
          onClick={() => setActiveTab('calendar')}
          className="p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800/85 bg-white dark:bg-slate-900/40 hover:border-indigo-500 hover:shadow-sm transition cursor-pointer space-y-2 select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Upcoming Exams</span>
            <CalendarIcon className="w-4 h-4 text-pink-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{exams.length} Exams</h2>
          <div className="text-[10px] text-slate-400">
            Nearest date: {exams.length > 0 ? exams[0].examDate : 'None Scheduled'}
          </div>
        </div>

        {/* Card 7: Active Habits */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800/85 bg-white dark:bg-slate-900/40 hover:border-indigo-500 hover:shadow-sm transition cursor-pointer space-y-2 select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Active Habits</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{habits.length} Habits</h2>
          <div className="text-[10px] text-emerald-500 font-semibold">
            Streaks active: {topStreak} days
          </div>
        </div>

        {/* Card 8: Internship application pipeline progress */}
        <div 
          onClick={() => setActiveTab('internships')}
          className="p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800/85 bg-white dark:bg-slate-900/40 hover:border-indigo-500 hover:shadow-sm transition cursor-pointer space-y-2 select-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Internship Apps</span>
            <Briefcase className="w-4 h-4 text-teal-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{internships.length} Filed</h2>
          <div className="text-[10px] text-teal-600 font-semibold">
            Interviews: {internships.filter(i => i.status === 'Interview').length} Scheduled
          </div>
        </div>

      </div>

      {/* Widgets & Interactive Tools Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick Add Task & Assignment Widgets (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Quick Actions Portal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Quick Add Task Form */}
              <form onSubmit={handleQuickAddTaskSubmit} className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">Quick Add Action Task</h4>
                <input
                  type="text"
                  required
                  value={quickTaskTitle}
                  onChange={(e) => setQuickTaskTitle(e.target.value)}
                  placeholder="e.g. Bring physics notebook..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/25 text-xs focus:outline-none"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={quickTaskCategory}
                    onChange={(e) => setQuickTaskCategory(e.target.value as any)}
                    className="p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer"
                  >
                    <option value="Study">Study</option>
                    <option value="Project">Project</option>
                    <option value="Personal">Personal</option>
                  </select>

                  <select
                    value={quickTaskPriority}
                    onChange={(e) => setQuickTaskPriority(e.target.value as any)}
                    className="p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Task</span>
                </button>
              </form>

              {/* Quick Add Assignment Form */}
              <form onSubmit={handleQuickAssignSubmit} className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">Quick Track Assignment</h4>
                <input
                  type="text"
                  required
                  value={quickAssignTitle}
                  onChange={(e) => setQuickAssignTitle(e.target.value)}
                  placeholder="e.g. Midterm Lab Assignment 3"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/25 text-xs focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={quickAssignSubject}
                    onChange={(e) => setQuickAssignSubject(e.target.value)}
                    placeholder="Subject: e.g. Math III"
                    className="p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                  />

                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={quickAssignHours}
                    onChange={(e) => setQuickAssignHours(parseInt(e.target.value) || 3)}
                    className="p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                    placeholder="Hours required"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-650 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Homework</span>
                </button>
              </form>

            </div>
          </div>

          {/* AI Suggestions & Calendar Preview Info Widget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* AI Suggestions Box */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                <h4 className="text-xs font-bold font-mono text-slate-500 dark:text-slate-350 uppercase">StudySphere AI Tutor Advice</h4>
              </div>
              <div className="space-y-2 flex-grow mt-2">
                {getAIAdvice().map((adv, i) => (
                  <div key={i} className="p-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 text-slate-600 dark:text-slate-350 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('study-ai')}
                className="w-full text-center py-2 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-950 dark:hover:bg-slate-850 rounded-xl text-xs font-bold text-indigo-600 dark:text-amber-400 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Interact with OmniMind AI Tutor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Calendar Preview Details */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-500" />
                <h4 className="text-xs font-bold font-mono text-slate-500 dark:text-slate-350 uppercase">Calendar Preview</h4>
              </div>
              <div className="flex-grow space-y-2 mt-2">
                <div className="p-2 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="block font-bold">Today's Focus Block</span>
                    <span className="text-[10px] text-slate-400">09:00 - 11:30 Linear Algebra Review</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-[9px] font-mono text-indigo-500 font-bold uppercase">Syllabus</span>
                </div>

                <div className="p-2 bg-amber-500/5 rounded-xl border border-amber-500/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="block font-bold">Homework Due Tomorrow</span>
                    <span className="text-[10px] text-slate-400">Calc Chapter 4 Problems submission</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-[9px] font-mono text-amber-500 font-bold uppercase">Work</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('calendar')}
                className="w-full text-center py-2 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-950 dark:hover:bg-slate-850 rounded-xl text-xs font-bold text-indigo-600 dark:text-amber-400 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Launch Shared Calendar view</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Continuous Lo-Fi Radio Controls Card (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col justify-between h-auto space-y-4">
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Music className="w-3.5 h-3.5 animate-pulse" /> continuous ambient soundscape
            </span>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">StudySphere Radio Station</h3>
          </div>

          {/* Disc view */}
          <div className="flex flex-col items-center justify-center my-4">
            <div className={`w-32 h-32 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center relative shadow-xl ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
              <div className="w-10 h-10 rounded-full bg-indigo-500 border-4 border-white flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              </div>
              {isPlaying && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500"></span>
                </span>
              )}
            </div>

            <div className="text-center mt-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{currentTrack.title}</h4>
              <p className="text-[11px] text-slate-400">by {currentTrack.artist}</p>
            </div>
          </div>

          {/* Controls button drawer */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <button 
                onClick={handlePrev}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button 
                onClick={handlePlayPause}
                className={`p-3.5 rounded-full text-white transition-all transform hover:scale-105 shadow-md ${
                  isPlaying 
                    ? 'bg-gradient-to-r from-rose-500 to-pink-505 shadow-rose-500/20' 
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-indigo-600/20'
                }`}
                title={isPlaying ? "Pause study music" : "Play study music"}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button 
                onClick={handleNext}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Slider volume */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950/45 py-2 px-3 rounded-xl">
              <button 
                onClick={() => setVolume(volume > 0 ? 0 : 0.4)}
                className="text-slate-400 hover:text-indigo-500 transition"
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 accent-indigo-600 dark:accent-indigo-400 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Configure Daily Study Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in" id="daily-study-goal-modal">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500 animate-pulse" />
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-display">Configure Daily Study Goal</h3>
              </div>
              <button 
                onClick={() => { playClickSound(); setIsGoalModalOpen(false); }}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                id="close-study-goal-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Set a realistic, focused target for your daily academic hours. StudySphere automatically compares your actual progress against this benchmark to determine your level multiplier and academic health!
            </p>

            <div className="p-4 bg-slate-50/55 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Current Daily Target</span>
                <span className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">{tempGoalValue} Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { playClickSound(); setTempGoalValue(prev => Math.max(1, prev - 1)); }}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold hover:border-purple-500 transition cursor-pointer text-slate-700 dark:text-slate-300"
                  title="Decrease hours"
                  id="decrease-study-goal-btn"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => { playClickSound(); setTempGoalValue(prev => Math.min(16, prev + 1)); }}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold hover:border-purple-500 transition cursor-pointer text-slate-700 dark:text-slate-300"
                  title="Increase hours"
                  id="increase-study-goal-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Fine-tune Slider</label>
              <input 
                type="range"
                min="1"
                max="16"
                step="1"
                value={tempGoalValue}
                onChange={(e) => setTempGoalValue(parseInt(e.target.value) || 5)}
                className="w-full h-1.5 accent-purple-600 dark:accent-purple-400 bg-slate-200 dark:bg-slate-850 rounded-lg cursor-pointer"
                id="study-goal-range-slider"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>1 Hr (Light study)</span>
                <span>16 Hrs (Hardcore exam prep)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => { playClickSound(); setIsGoalModalOpen(false); }}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                id="cancel-study-goal-modal-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setDailyGoalTarget(tempGoalValue);
                  setIsGoalModalOpen(false);
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/10 cursor-pointer"
                id="save-study-goal-modal-btn"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
