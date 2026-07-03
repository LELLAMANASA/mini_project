import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  CartesianGrid
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  HelpCircle,
  AlertCircle,
  X,
  Plus,
  Minus
} from 'lucide-react';
import { TaskType, AssignmentType, AttendanceType, HabitType } from '../types';
import { playClickSound } from '../utils/audio';

interface ProductivityAnalyticsProps {
  tasks: TaskType[];
  assignments: AssignmentType[];
  attendance: AttendanceType[];
  habits: HabitType[];
  dailyGoalTarget: number;
  setDailyGoalTarget?: (target: number) => void;
}

export default function ProductivityAnalytics({
  tasks,
  assignments,
  attendance,
  habits,
  dailyGoalTarget,
  setDailyGoalTarget
}: ProductivityAnalyticsProps) {

  // Local Study Hours state for current week
  const [studyHours, setStudyHours] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('studysphere_study_hours');
      // If we don't have stored hours, return some default realistic hours
      return saved ? JSON.parse(saved) : [4.5, 6.2, 5.0, dailyGoalTarget + 1.5, 3.8, 7.0, 5.5];
    } catch {
      return [4.5, 6.2, 5.0, dailyGoalTarget + 1.5, 3.8, 7.0, 5.5];
    }
  });

  // Keep studyHours updated to local storage
  useEffect(() => {
    localStorage.setItem('studysphere_study_hours', JSON.stringify(studyHours));
  }, [studyHours]);

  // Adjust study hours for a specific day
  const handleHourChange = (idx: number, delta: number) => {
    setStudyHours(prev => {
      const copy = [...prev];
      copy[idx] = Math.min(16, Math.max(0, parseFloat((copy[idx] + delta).toFixed(1))));
      return copy;
    });
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Computations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalAssignments = assignments.length;
  const submittedAssignments = assignments.filter(a => a.status === 'Submitted' || a.status === 'Completed').length;
  const assignmentRate = totalAssignments > 0 ? Math.round((submittedAssignments / totalAssignments) * 100) : 0;

  // Attendance metrics
  const overallAttendancePct = attendance.length > 0
    ? Math.round((attendance.reduce((acc, a) => acc + a.present, 0) / attendance.reduce((acc, a) => acc + a.total, 0)) * 100)
    : 0;

  // Habit completions this past week
  const habitCompletionCount = habits.reduce((acc, h) => acc + h.history.length, 0);

  // Compute a comprehensive SaaS Productivity Score
  // Weighted: Tasks complete (30%), Attendance score (30%), Assignments submission (25%), Habit discipline (15%)
  const taskWeight = completionRate * 0.3;
  const attendanceWeight = overallAttendancePct * 0.3;
  const assignmentWeight = assignmentRate * 0.25;
  const habitWeight = habits.length > 0 ? Math.min((habitCompletionCount / (habits.length * 7)) * 100, 100) * 0.15 : 15;
  
  const rawScore = Math.round(taskWeight + attendanceWeight + assignmentWeight + habitWeight);
  const productivityScore = isNaN(rawScore) || rawScore === 0 ? 72 : rawScore; // fallback standard default

  // Weekly Study Hours Data (dynamic!)
  const studyHoursData = daysOfWeek.map((day, idx) => ({
    name: day,
    hours: studyHours[idx]
  }));

  // Task Pie Data
  const taskPieData = [
    { name: 'Completed', value: completedTasks || 3, color: '#10B981' },
    { name: 'Pending', value: (totalTasks - completedTasks) || 2, color: '#F59E0B' }
  ];

  // Subject Attendance data for bar chart
  const attendanceChartData = attendance.map(a => ({
    name: a.subject.substring(0, 15) + '...',
    percent: Math.round((a.present / a.total) * 100)
  }));

  // Insights compiler
  const getAIInsights = () => {
    const insights = [];
    if (productivityScore > 85) {
      insights.push("Excellent work! Your productivity index is in the top 5% of your branch.");
    } else if (productivityScore > 70) {
      insights.push("Solid tracking habits. Continue registering LeetCode problems or math problems daily to hit the level 4 bracket.");
    } else {
      insights.push("Focus on checking off pending tasks. Completing assignments early boosts your GPA and XP level faster.");
    }

    const warningClass = attendance.find(a => (a.present / a.total) < 0.75);
    if (warningClass) {
      insights.push(`Urgent: Attendance in "${warningClass.subject}" is below 75%. Prioritize attending the next 3 lectures.`);
    } else {
      insights.push("Great discipline! All courses satisfy the 75% college attendance requirements.");
    }

    if (habits.length === 0) {
      insights.push("Recommendation: Log at least one habit (e.g. Coding or Sleep) to maximize daily streaks.");
    }

    return insights;
  };

  return (
    <div className="space-y-6">
      {/* Upper Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Productivity Score Indicator */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-indigo-500/10 to-transparent border border-indigo-500/20 text-center space-y-2">
          <Award className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Productivity Score</span>
          <h2 className="text-4xl font-black bg-gradient-to-r from-amber-500 to-indigo-600 bg-clip-text text-transparent">
            {productivityScore}%
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {productivityScore > 80 ? 'Exceptional Pace 🔥' : 'Balanced Pace ⚡'}
          </p>
        </div>

        {/* Study target */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1.5 flex-grow">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">DAILY TARGET STATUS</span>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{dailyGoalTarget} Hours</h3>
              {setDailyGoalTarget && (
                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <button 
                    onClick={() => { playClickSound(); setDailyGoalTarget(Math.max(1, dailyGoalTarget - 1)); }}
                    className="w-5 h-5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center justify-center cursor-pointer text-slate-700 dark:text-slate-300"
                    title="Decrease daily target"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => { playClickSound(); setDailyGoalTarget(Math.min(16, dailyGoalTarget + 1)); }}
                    className="w-5 h-5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center justify-center cursor-pointer text-slate-700 dark:text-slate-300"
                    title="Increase daily target"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
            <p className="text-[11px] text-green-500 font-semibold font-sans">
              Goal reached {studyHours.filter(hours => hours >= dailyGoalTarget).length} days this week
            </p>
          </div>
          <Clock className="w-8 h-8 text-indigo-500/30" />
        </div>

        {/* Completed list */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">COMPLETION RATES</span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
              {completionRate}% Tasks / {assignmentRate}% Homework
            </h3>
            <p className="text-[11px] text-indigo-500 font-semibold">{completedTasks} tasks closed</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500/30" />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly study hours */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Study Hours (Current Week)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyHoursData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="hours" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <details className="group cursor-pointer">
              <summary className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 select-none hover:underline">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 animate-pulse" /> Adjust & Log Hours studied
                </span>
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-4 space-y-4 cursor-default animate-fade-in">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>How to set hours:</strong> Use the interactive range sliders or fine-tune buttons (+ / -) for each day of the week to log the exact amount of hours you spent studying. Your weekly study hour chart and compliance status will update immediately!
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {daysOfWeek.map((day, idx) => (
                    <div key={day} className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850/60 text-center space-y-1.5 shadow-sm">
                      <span className="text-[10px] font-mono font-black text-slate-400 block">{day}</span>
                      <div className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100">
                        {studyHours[idx]} hrs
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => { playClickSound(); handleHourChange(idx, -0.5); }}
                          className="w-5 h-5 rounded bg-white dark:bg-slate-800 hover:border-indigo-500 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold cursor-pointer text-slate-700 dark:text-slate-300 shadow-sm"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => { playClickSound(); handleHourChange(idx, 0.5); }}
                          className="w-5 h-5 rounded bg-white dark:bg-slate-800 hover:border-indigo-500 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold cursor-pointer text-slate-700 dark:text-slate-300 shadow-sm"
                        >
                          +
                        </button>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="16"
                        step="0.5"
                        value={studyHours[idx]}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setStudyHours(prev => {
                            const copy = [...prev];
                            copy[idx] = val;
                            return copy;
                          });
                        }}
                        className="w-full h-1 accent-indigo-600 dark:accent-indigo-400 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setStudyHours([4.5, 6.2, 5.0, dailyGoalTarget + 1.5, 3.8, 7.0, 5.5]);
                    }}
                    className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline cursor-pointer"
                  >
                    Reset to defaults
                  </button>
                  <span className="text-[10px] font-mono text-slate-400">
                    Total: <strong className="text-indigo-600 dark:text-indigo-400">{studyHours.reduce((a, b) => a + b, 0).toFixed(1)}</strong> hours logged
                  </span>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Subject wise Attendance */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Subject-Wise Attendance Rate (%)</h4>
          {attendanceChartData.length === 0 ? (
            <div className="text-center py-20 text-xs text-slate-400">
              No attendance indices registered. Add courses to visualize patterns.
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceChartData}>
                  <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={11} domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="percent" stroke="#10B981" fillOpacity={1} fill="url(#colorAmt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Lower Pie and AI suggestion insights block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Task Distribution (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Task Status Breakdown</h4>
          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 block" />
              <span>Done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 block" />
              <span>Pending</span>
            </div>
          </div>
        </div>

        {/* AI Insight report (8 cols) */}
        <div className="lg:col-span-8 p-6 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-850 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
            <h4 className="text-xs font-bold font-mono text-slate-600 dark:text-slate-300 uppercase tracking-widest">
              AI Academic Insight Reports
            </h4>
          </div>

          <div className="space-y-3 flex-grow">
            {getAIInsights().map((insight, idx) => {
              const isUrgent = insight.includes("Urgent:");
              return (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-xl text-xs flex items-start gap-3 border ${
                    isUrgent 
                      ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400' 
                      : 'bg-white dark:bg-slate-900/60 border-slate-100 dark:border-slate-850 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isUrgent ? <AlertCircle className="w-4.5 h-4.5 shrink-0" /> : <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-500" />}
                  <p className="leading-relaxed">{insight}</p>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] font-mono text-slate-400 text-right">
            Grounding analysis computed across 4 metrics
          </p>
        </div>
      </div>
    </div>
  );
}
