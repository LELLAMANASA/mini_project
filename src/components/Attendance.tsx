import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Award, 
  Percent, 
  Activity, 
  Info,
  Sparkles,
  CheckCircle2,
  ListFilter,
  Volume2,
  Bell,
  Clock,
  Calendar,
  GraduationCap,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AttendanceType } from '../types';
import { playClickSound, playSuccessChime } from '../utils/audio';

interface AttendanceProps {
  attendance: AttendanceType[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceType[]>>;
  onRewardXP: (xp: number, message: string) => void;
  voices?: SpeechSynthesisVoice[];
  selectedVoiceName?: string;
  onSetSelectedVoiceName?: (name: string) => void;
}

export default function Attendance({ 
  attendance, 
  setAttendance, 
  onRewardXP,
  voices = [],
  selectedVoiceName = '',
  onSetSelectedVoiceName
}: AttendanceProps) {
  const [newSubject, setNewSubject] = useState('');
  
  // Custom dialog state to replace browser confirm()
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  });

  // Track expanded reminder panels for each card
  const [expandedAlarms, setExpandedAlarms] = useState<Record<string, boolean>>({});

  // Track daily reminder time input values before saving
  const [tempDailyTimes, setTempDailyTimes] = useState<Record<string, string>>({});

  // Track selected subject ID for setting the daily reminder in the upper grid card
  const [selectedDailySubId, setSelectedDailySubId] = useState<string>('');

  const toggleAlarmExpand = (id: string) => {
    playClickSound();
    setExpandedAlarms(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle present classes increments
  const handleMarkPresent = (id: string, subjectName: string) => {
    playClickSound();
    setAttendance(prev => prev.map(sub => {
      if (sub.id === id) {
        const futurePercentage = ((sub.present + 1) / (sub.total + 1)) * 100;
        const currentPercentage = sub.total > 0 ? (sub.present / sub.total) * 100 : 0;
        
        if (currentPercentage < 75 && futurePercentage >= 75) {
          playSuccessChime();
          onRewardXP(50, `Crossed attendance cutoff in ${subjectName}! Safe for exams 🎉`);
        } else {
          onRewardXP(10, `Attended lecture: ${subjectName}`);
        }
        
        return {
          ...sub,
          present: sub.present + 1,
          total: sub.total + 1
        };
      }
      return sub;
    }));
  };

  // Handle missed classes increments
  const handleMarkMissed = (id: string, subjectName: string) => {
    playClickSound();
    setAttendance(prev => prev.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          total: sub.total + 1
        };
      }
      return sub;
    }));
  };

  // Decrement present/missed to edit/correct mistake
  const handleResetRecord = (id: string) => {
    playClickSound();
    setConfirmModal({
      isOpen: true,
      title: "Reset Attendance Scores",
      message: "Are you sure you want to reset attendance scores for this course? This will set present and total conducted classes to 0.",
      onConfirm: () => {
        setAttendance(prev => prev.map(sub => {
          if (sub.id === id) {
            return { ...sub, present: 0, total: 0 };
          }
          return sub;
        }));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      type: 'warning'
    });
  };

  // Delete customize subjects
  const handleDeleteSubject = (id: string) => {
    playClickSound();
    setConfirmModal({
      isOpen: true,
      title: "Delete Course Tracker",
      message: "Are you sure you want to permanently delete this course tracker? All statistics and custom settings will be lost.",
      onConfirm: () => {
        setAttendance(prev => prev.filter(sub => sub.id !== id));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      type: 'danger'
    });
  };

  // Add customized subjects
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    if (!newSubject.trim()) return;

    const newSub: AttendanceType = {
      id: `sub-${Date.now()}`,
      subject: newSubject.trim(),
      present: 0,
      total: 0
    };

    setAttendance(prev => [...prev, newSub]);
    setNewSubject('');
    onRewardXP(15, `Registered course tracker for ${newSub.subject}`);
  };

  // Updates class days/hours
  const handleUpdateClassTime = (id: string, timeStr: string) => {
    setAttendance(prev => prev.map(sub => {
      if (sub.id === id) {
        return { ...sub, classTime: timeStr };
      }
      return sub;
    }));
  };

  // Updates datetime-local reminder alarm
  const handleUpdateReminderTime = (id: string, reminderStr: string) => {
    setAttendance(prev => prev.map(sub => {
      if (sub.id === id) {
        return { ...sub, reminderTime: reminderStr, reminderFired: false };
      }
      return sub;
    }));
  };

  // Clear specific alarm
  const handleClearReminder = (id: string) => {
    playClickSound();
    setAttendance(prev => prev.map(sub => {
      if (sub.id === id) {
        return { ...sub, reminderTime: undefined, reminderFired: undefined };
      }
      return sub;
    }));
  };

  // Test current voice selection
  const handleTestVoice = () => {
    playClickSound();
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text = "Voice configuration confirmed! I will notify you when your classes begin.";
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        if (selectedVoiceName) {
          const matched = window.speechSynthesis.getVoices().find(v => v.name === selectedVoiceName);
          if (matched) {
            utterance.voice = matched;
          }
        }
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error("Voice test failed:", err);
    }
  };

  // Format 24-hour HH:MM string to readable 12-hour AM/PM format
  const formatTime12Hr = (timeStr: string) => {
    if (!timeStr) return '';
    try {
      const [hoursStr, minutesStr] = timeStr.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${displayHours}:${displayMinutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  // Set daily recurring reminder
  const handleSetDailyTime = (id: string) => {
    playClickSound();
    const targetTime = tempDailyTimes[id];
    if (!targetTime) return;

    setAttendance(prev => prev.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          dailyReminderTime: targetTime,
          dailyReminderFiredDate: undefined // Reset so it fires starting today
        };
      }
      return sub;
    }));

    playSuccessChime();
    const subjectName = attendance.find(s => s.id === id)?.subject || '';
    onRewardXP(10, `Set daily alarm for ${subjectName} at ${formatTime12Hr(targetTime)} ⏰`);
  };

  // Clear daily recurring reminder
  const handleClearDailyTime = (id: string) => {
    playClickSound();
    setAttendance(prev => prev.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          dailyReminderTime: undefined,
          dailyReminderFiredDate: undefined
        };
      }
      return sub;
    }));
    setTempDailyTimes(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // Calculations for consecutive target criteria
  const getSyllabusAnalysis = (present: number, total: number) => {
    if (total === 0) return { status: 'safe', msg: 'No lectures registered yet.', number: 0 };
    const pct = (present / total) * 100;
    
    if (pct < 75) {
      // Classes needed consecutively: (P + x) / (T + x) >= 0.75 => x >= 3T - 4P
      const needed = Math.max(0, (3 * total) - (4 * present));
      return {
        status: 'danger',
        msg: `Must attend next ${needed} classes consecutively to clear the 75% limit.`,
        number: needed
      };
    } else {
      // Classes that can be missed consecutively: P / (T + y) >= 0.75 => y <= (4P - 3T)/3
      const missable = Math.max(0, Math.floor(((4 * present) - (3 * total)) / 3));
      return {
        status: 'safe',
        msg: `You can safely skip up to ${missable} more class${missable === 1 ? '' : 'es'} without falling below 75%.`,
        number: missable
      };
    }
  };

  // Cumulative Metrics
  let grandTotal = 0;
  let grandPresent = 0;
  
  attendance.forEach(sub => {
    grandTotal += sub.total;
    grandPresent += sub.present;
  });

  const cumulativePercentage = grandTotal > 0 ? Math.round((grandPresent / grandTotal) * 100) : 0;
  const isCumulativeSafe = cumulativePercentage >= 75;

  return (
    <div className="space-y-6" id="attendance-tracker-workspace">
      
      {/* Consolidated Metrics & Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Unified Dashboard Stats & Course Registration Card */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200 min-h-[220px]">
          <div>
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase font-mono">
                  CUMULATIVE ATTENDANCE METRIC
                </span>
                <h2 className="text-2xl font-black font-display text-slate-800 dark:text-white leading-none">
                  Aggregate: {cumulativePercentage}%
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Attended: <span className="font-bold text-slate-700 dark:text-slate-300">{grandPresent}</span> of <span className="font-bold text-slate-700 dark:text-slate-300">{grandTotal}</span>
                </p>
              </div>

              <div className={`p-2 rounded-xl font-bold font-display text-[9px] tracking-wide flex items-center gap-1 shrink-0 ${
                isCumulativeSafe 
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse'
              }`}>
                {isCumulativeSafe ? (
                  <>
                    <Award className="w-3.5 h-3.5 text-emerald-500" />
                    <span>SAFE</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>SHORT</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-5">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-2.5 font-mono flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-slate-400" />
              Log New Course Subject
            </span>
            <form onSubmit={handleAddSubject} className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. Applied Thermodynamics"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-550/20 focus:border-indigo-500 focus:outline-none transition-all"
                required
              />
              <button 
                type="submit"
                className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all duration-200 cursor-pointer active:scale-95 shadow-sm flex items-center justify-center hover:shadow-indigo-500/10 hover:shadow-md shrink-0 border-0"
                title="Add Subject"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Unified Daily Course Alarms & Notification Settings Card */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200 min-h-[220px]">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase font-mono flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" />
              Daily Course Alarms
            </span>

            {attendance.length === 0 ? (
              <div className="p-3 text-center rounded-xl bg-slate-50/50 dark:bg-slate-950/10 border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  Add course subjects to program alarms.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <select
                      value={selectedDailySubId || (attendance[0]?.id || '')}
                      onChange={(e) => setSelectedDailySubId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-550/20 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer truncate"
                    >
                      {attendance.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3">
                    <input
                      type="time"
                      value={
                        tempDailyTimes[selectedDailySubId || attendance[0]?.id] !== undefined
                          ? tempDailyTimes[selectedDailySubId || attendance[0]?.id]
                          : (attendance.find((s) => s.id === (selectedDailySubId || attendance[0]?.id))?.dailyReminderTime || '')
                      }
                      onChange={(e) => {
                        const activeId = selectedDailySubId || attendance[0]?.id;
                        if (activeId) {
                          setTempDailyTimes((prev) => ({ ...prev, [activeId]: e.target.value }));
                        }
                      }}
                      className="w-full px-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-[11px] text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-550/20 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer font-mono text-center"
                    />
                  </div>

                  <div className="col-span-3">
                    <button
                      type="button"
                      onClick={() => {
                        const activeId = selectedDailySubId || attendance[0]?.id;
                        if (activeId) {
                          handleSetDailyTime(activeId);
                        }
                      }}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl transition-all duration-250 text-[10px] uppercase tracking-wider cursor-pointer shadow-sm active:scale-95 border-0 outline-none hover:shadow-indigo-500/10 hover:shadow-md"
                    >
                      Set
                    </button>
                  </div>
                </div>

                {/* Status indicator for selected subject's daily alarm */}
                {(() => {
                  const activeId = selectedDailySubId || attendance[0]?.id;
                  const activeSub = attendance.find((s) => s.id === activeId);
                  if (activeSub?.dailyReminderTime) {
                    return (
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/20 animate-fade-in">
                        <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center font-mono">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse inline-block mr-2"></span>
                          Alarm active at {formatTime12Hr(activeSub.dailyReminderTime)}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleClearDailyTime(activeId)}
                          className="text-[9px] font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 hover:underline cursor-pointer border-0 bg-transparent py-0 px-1 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    );
                  }
                  return (
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 italic px-1">
                      No active daily alarm set for this course yet.
                    </p>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Voice Settings block integrated inside this container */}
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase font-mono flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                Notification Voice
              </span>
              <p className="text-[10px] text-slate-450 dark:text-slate-500">
                Synthesis voice for daily alarm popups.
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <select
                value={selectedVoiceName}
                onChange={(e) => onSetSelectedVoiceName && onSetSelectedVoiceName(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-800 dark:text-white focus:ring-1 focus:ring-indigo-550/20 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer max-w-[150px] truncate"
              >
                <option value="">Default Voice</option>
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleTestVoice}
                title="Test preferred voice"
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 border border-indigo-200/50 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold transition-all duration-200 flex items-center gap-1 cursor-pointer shrink-0 active:scale-95"
              >
                Test
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Grid of Subjects cards with warning status indices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="attendance-subjects-cards">
        {attendance.map(sub => {
          const percent = sub.total > 0 ? Math.round((sub.present / sub.total) * 100) : 0;
          const isRed = percent < 75;
          const isYellow = percent >= 75 && percent < 80;
          const analysis = getSyllabusAnalysis(sub.present, sub.total);

          return (
            <div 
              key={sub.id}
              className={`p-5 rounded-2xl border bg-white dark:bg-slate-900/60 transition hover:shadow-md flex flex-col justify-between space-y-4 border-l-4 ${
                isRed 
                  ? 'border-red-200 dark:border-red-900/30 border-l-red-500 bg-red-500/[0.01]' 
                  : isYellow 
                  ? 'border-amber-200 dark:border-amber-900/30 border-l-amber-500 bg-amber-500/[0.01]' 
                  : 'border-slate-200 dark:border-slate-800 border-l-emerald-500'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight flex items-center gap-1.5 flex-wrap">
                    {sub.subject}
                    {sub.dailyReminderTime && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[9px] font-extrabold shadow-sm">
                        <Clock className="w-2.5 h-2.5 text-indigo-500" />
                        {formatTime12Hr(sub.dailyReminderTime)}
                      </span>
                    )}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Lectures: <strong className="text-slate-700 dark:text-slate-300">{sub.present} present</strong> of <strong className="text-slate-700 dark:text-slate-300">{sub.total} conducted</strong>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleResetRecord(sub.id)}
                    className="p-1 px-2 text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 rounded-lg transition"
                    title="Reset course metrics to 0-0"
                  >
                    Reset
                  </button>

                  <button 
                    onClick={() => handleDeleteSubject(sub.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                    title="Remove course from tracking"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Attendance metrics and visual progress bars */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Presence rate</span>
                  <span className={`font-bold font-mono text-[11px] px-2 py-0.5 rounded-md ${
                    isRed 
                    ? 'bg-red-500/15 text-red-600 dark:text-red-400 font-black animate-pulse' 
                    : isYellow 
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' 
                    : 'bg-green-500/15 text-green-600 dark:text-green-400'
                  }`}>
                    {percent}% {isRed ? 'RED ALERT' : isYellow ? 'YELLOW ALERT' : 'GREEN SAFE'}
                  </span>
                </div>

                {/* Horizontal Progress bar */}
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 bottom-0 left-[75%] border-l border-dashed border-slate-400 dark:border-slate-600 z-10" />
                  <div 
                    className={`h-full rounded-full transition-all duration-305 ${
                      isRed ? 'bg-red-500' : isYellow ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Dynamic Analysis Formula Calculations Output */}
              {sub.total > 0 && (
                <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  isRed 
                    ? 'bg-red-500/[0.04] border-red-500/15 text-red-700 dark:text-red-400' 
                    : isYellow 
                    ? 'bg-amber-500/[0.04] border-amber-500/15 text-amber-700 dark:text-amber-400' 
                    : 'bg-emerald-500/[0.04] border-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                }`}>
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-semibold">{analysis.msg}</p>
                </div>
              )}

              {/* Action present / skip checkoffs */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleMarkPresent(sub.id, sub.subject)}
                  className="flex-grow py-2 border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-450 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark Present</span>
                </button>

                <button
                  onClick={() => handleMarkMissed(sub.id, sub.subject)}
                  className="flex-grow py-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 dark:text-red-400 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Mark Missed</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* PREMIUM CUSTOM DIALOG MODAL (Bypasses window.confirm browser blockade) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 max-w-sm w-full text-center shadow-2xl relative overflow-hidden animate-scale-up">
            <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
              confirmModal.type === 'danger' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/20' : 'bg-amber-100 text-amber-600 dark:bg-amber-950/20'
            }`}>
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 font-display">
              {confirmModal.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {confirmModal.message}
            </p>

            <div className="flex gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  confirmModal.onConfirm();
                }}
                className={`flex-1 py-2.5 px-4 text-white font-extrabold rounded-xl transition text-xs shadow-md cursor-pointer ${
                  confirmModal.type === 'danger' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
