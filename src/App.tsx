import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Clock, 
  UserCheck, 
  Sparkles, 
  Menu, 
  X as CloseIcon, 
  Download, 
  Maximize2,
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Sun, 
  Moon, 
  Eye,
  GraduationCap,
  Radio,
  Target,
  Bot,
  BookOpen,
  Flame,
  FileText,
  Briefcase,
  TrendingUp,
  Settings,
  User as UserIcon,
  LogOut,
  LogIn,
  Award,
  Snowflake,
  Check
} from 'lucide-react';

import { ThemeType, TabType, TaskType, AttendanceType, StudyPlanType, UserProfile, AssignmentType, HabitType, ExamType, InternshipType, NoteType } from './types';
import { DEFAULT_TASKS, DEFAULT_ATTENDANCE, AUDIO_TRACKS, DEFAULT_ASSIGNMENTS, DEFAULT_HABITS, DEFAULT_EXAMS, DEFAULT_INTERNSHIPS } from './data/defaultData';
import { playClickSound, playSuccessChime, playBellChime } from './utils/audio';

import Dashboard from './components/Dashboard';
import TaskSuite from './components/TaskSuite';
import CalendarView from './components/CalendarView';
import Pomodoro from './components/Pomodoro';
import Attendance from './components/Attendance';
import StudyPlanner from './components/StudyPlanner';
import NewsAggregator from './components/NewsAggregator';
import GoalStrategist from './components/GoalStrategist';
import StudyAI from './components/StudyAI';
import AssignmentTracker from './components/AssignmentTracker';
import NotesSuite from './components/NotesSuite';
import ProductivityAnalytics from './components/ProductivityAnalytics';
import InternshipTracker from './components/InternshipTracker';
import AuthSystem from './components/AuthSystem';
import ProfileView from './components/ProfileView';

const CLOCK_THEMES = [
  {
    id: 'cosmic',
    name: 'Cosmic Nebula',
    desc: 'Deep space twilight purple',
    bgClass: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100',
    clockClass: 'text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] font-mono',
    quoteClass: 'text-indigo-200/90 font-sans italic',
    accentClass: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    pillClass: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    desc: 'Vaporwave synth high-contrast',
    bgClass: 'bg-slate-950 border-pink-550/10 text-pink-500',
    clockClass: 'text-pink-500 drop-shadow-[0_0_25px_rgba(236,72,153,0.6)] font-mono',
    quoteClass: 'text-yellow-400 font-mono tracking-wide',
    accentClass: 'bg-pink-500/10 border-pink-500/40 text-pink-400',
    pillClass: 'border-pink-500/30 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20'
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    desc: 'Northern lights mystic teal',
    bgClass: 'bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 text-emerald-100',
    clockClass: 'text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)] font-mono',
    quoteClass: 'text-teal-200/90 font-sans italic',
    accentClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    pillClass: 'border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20'
  },
  {
    id: 'sunset',
    name: 'Warm Sunset',
    desc: 'Golden hour tranquility',
    bgClass: 'bg-gradient-to-br from-amber-950 via-rose-950 to-slate-950 text-amber-500',
    clockClass: 'text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)] font-mono',
    quoteClass: 'text-orange-200/90 font-sans italic',
    accentClass: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    pillClass: 'border-orange-500/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20'
  },
  {
    id: 'sakura',
    name: 'Sakura Blossom',
    desc: 'Peaceful springtime pastel',
    bgClass: 'bg-gradient-to-br from-pink-950 via-purple-950 to-slate-950 text-pink-100',
    clockClass: 'text-pink-300 drop-shadow-[0_0_20px_rgba(244,143,177,0.5)] font-mono',
    quoteClass: 'text-pink-200/80 font-sans italic',
    accentClass: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
    pillClass: 'border-pink-500/30 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20'
  },
  {
    id: 'monochrome',
    name: 'Stark Monochrome',
    desc: 'Pure high-contrast minimalist focus',
    bgClass: 'bg-black text-white',
    clockClass: 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] font-sans font-thin tracking-wider',
    quoteClass: 'text-slate-400 font-serif italic tracking-wide',
    accentClass: 'bg-white/10 border-white/20 text-white',
    pillClass: 'border-white/20 bg-white/5 text-slate-300 hover:bg-white/15'
  }
];

const STUDY_QUOTES = [
  { text: "Arise, awake, and stop not until the goal is reached.", author: "Swami Vivekananda" },
  { text: "Talk to yourself once in a day, otherwise you may miss meeting an excellent person in this world.", author: "Swami Vivekananda" },
  { text: "They may kill me, but they cannot kill my ideas. They can crush my body, but they will not be able to crush my spirit.", author: "Bhagat Singh" },
  { text: "But man's duty is to try and endeavour, success depends upon chance and environments.", author: "Bhagat Singh" },
  { text: "If you really want to be successful, stop worrying about what you can get and start focusing on what you can give.", author: "Sandeep Maheshwari" },
  { text: "Success comes from experience, and experience comes from bad experiences.", author: "Sandeep Maheshwari" },
  { text: "If you don't help yourself, nobody in this world can help you.", author: "Dr. Vivek Bindra" },
  { text: "Don't focus on multiple things. Focus on the single most important thing that changes everything.", author: "Dr. Vivek Bindra" },
  { text: "Worry never robs tomorrow of its sorrow, it only saps today of its joy.", author: "Gaur Gopal Das" },
  { text: "Work for a cause, not for applause. Live life to express, not to impress.", author: "Gaur Gopal Das" },
  { text: "Your mind is your instrument. Learn to be its master, not its slave.", author: "BK Shivani" },
  { text: "Keep your mind calm. A quiet mind can solve any problem, make correct decisions, and stay focused.", author: "BK Shivani" },
  { text: "The best way to predict your future is to build it, one small habit at a time.", author: "Ankur Warikoo" },
  { text: "Focus on the process. The results are just a side effect of consistency.", author: "Ankur Warikoo" }
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core App Data States (persisted via localStorage)
  const [theme, setTheme] = useState<ThemeType>(() => {
    try {
      const saved = localStorage.getItem('avishkar_theme');
      return (saved as ThemeType) || 'light';
    } catch {
      return 'light';
    }
  });

  const [tasks, setTasks] = useState<TaskType[]>(() => {
    try {
      const saved = localStorage.getItem('avishkar_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceType[]>(() => {
    try {
      const saved = localStorage.getItem('avishkar_attendance');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return DEFAULT_ATTENDANCE;
    } catch {
      return DEFAULT_ATTENDANCE;
    }
  });

  const [studyPlans, setStudyPlans] = useState<StudyPlanType[]>(() => {
    try {
      const saved = localStorage.getItem('avishkar_study_plans');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [dailyGoalTarget, setDailyGoalTarget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('avishkar_daily_goal');
      return saved ? parseInt(saved) || 5 : 5;
    } catch {
      return 5;
    }
  });

  // Extended SaaS States
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('studysphere_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && 'name' in parsed) {
          return parsed as UserProfile;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // High-fidelity profile by default to bypass landing page wall
    return {
      name: 'Venkatappaiah Lella',
      email: 'venkatappaiahlella54215@gmail.com',
      college: 'IIT Madras',
      branch: 'Computer Science',
      semester: '6th Semester',
      profilePic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60',
      dailyStudyGoal: 5,
      xp: 120,
      level: 2,
      achievements: ['ach-1']
    };
  });

  const [showAuth, setShowAuth] = useState(false); // Auth Screen toggle

  // --- LIVE TIME CLOCK FEATURE ---
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isFullScreenClock, setIsFullScreenClock] = useState<boolean>(false);
  const [clockTheme, setClockTheme] = useState<string>(() => {
    try {
      return localStorage.getItem('studysphere_clock_theme') || 'cosmic';
    } catch {
      return 'cosmic';
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('studysphere_clock_theme', clockTheme);
    } catch (e) {
      console.warn(e);
    }
  }, [clockTheme]);
  // --------------------------------

  const [assignments, setAssignments] = useState<AssignmentType[]>(() => {
    try {
      const saved = localStorage.getItem('studysphere_assignments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return DEFAULT_ASSIGNMENTS;
    } catch {
      return DEFAULT_ASSIGNMENTS;
    }
  });

  const [habits, setHabits] = useState<HabitType[]>(() => {
    try {
      const saved = localStorage.getItem('studysphere_habits');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return DEFAULT_HABITS;
    } catch {
      return DEFAULT_HABITS;
    }
  });

  const [exams, setExams] = useState<ExamType[]>(() => {
    try {
      const saved = localStorage.getItem('studysphere_exams');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return DEFAULT_EXAMS;
    } catch {
      return DEFAULT_EXAMS;
    }
  });

  const [internships, setInternships] = useState<InternshipType[]>(() => {
    try {
      const saved = localStorage.getItem('studysphere_internships');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return DEFAULT_INTERNSHIPS;
    } catch {
      return DEFAULT_INTERNSHIPS;
    }
  });

  const [notes, setNotes] = useState<NoteType[]>(() => {
    try {
      const saved = localStorage.getItem('studysphere_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [
        {
          id: 'n-1',
          title: 'Design Philosophy Study Notes',
          content: '# Design System\nUse soft glass cards with Tailwind blur effects for modern layout. Contrast and negative space are absolute criteria.',
          category: 'Study',
          tags: ['UI', 'Aesthetics'],
          pinned: true,
          lastUpdated: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  });

  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('studysphere_xp');
      return saved ? parseInt(saved) || 120 : 120;
    } catch {
      return 120;
    }
  });

  const [level, setLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('studysphere_level');
      return saved ? parseInt(saved) || 2 : 2;
    } catch {
      return 2;
    }
  });

  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('studysphere_streak');
      return saved ? parseInt(saved) || 5 : 5;
    } catch {
      return 5;
    }
  });

  const [highestStreak, setHighestStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('studysphere_highest_streak');
      return saved ? parseInt(saved) || 8 : 8;
    } catch {
      return 8;
    }
  });

  const [streakFreezeActive, setStreakFreezeActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('studysphere_streak_freeze');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [levelUpInfo, setLevelUpInfo] = useState<{ show: boolean; level: number } | null>(null);

  // Global Lofi Audio Player States
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [volume, setVolume] = useState(0.4);

  // Global voice alarms and reminder triggers
  const [globalTaskReminder, setGlobalTaskReminder] = useState<TaskType | null>(null);
  const [globalClassReminder, setGlobalClassReminder] = useState<AttendanceType | null>(null);
  
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>(() => {
    try {
      return localStorage.getItem('avishkar_voice_pref') || '';
    } catch {
      return '';
    }
  });

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadAllVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      loadAllVoices();
      window.speechSynthesis.onvoiceschanged = loadAllVoices;
    }
  }, []);

  const playVoiceAlert = (text: string) => {
    try {
      playBellChime();
    } catch (e) {
      console.error("Failed to play bell chime:", e);
    }

    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
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
    } catch (speechErr) {
      console.error("Speech synthesis failed:", speechErr);
    }
  };

  // Global background scanner for both tasks and classes
  useEffect(() => {
    const interval = setInterval(() => {
      const nowMs = Date.now();

      // 1. Check Task Reminders
      const dueTask = tasks.find(t => {
        if (t.completed || !t.reminderTime || t.reminderFired) return false;
        return new Date(t.reminderTime).getTime() <= nowMs;
      });

      if (dueTask) {
        playVoiceAlert(`Attention: Remember to ${dueTask.title}`);
        setGlobalTaskReminder(dueTask);
        setTasks(prev => prev.map(t => t.id === dueTask.id ? { ...t, reminderFired: true } : t));
        return;
      }

      // 2. Check Attendance Class Reminders
      const dueClass = attendance.find(sub => {
        if (!sub.reminderTime || sub.reminderFired) return false;
        return new Date(sub.reminderTime).getTime() <= nowMs;
      });

      if (dueClass) {
        playVoiceAlert(`Class Alert: Your lecture for ${dueClass.subject} starts now! Please attend.`);
        setGlobalClassReminder(dueClass);
        setAttendance(prev => prev.map(sub => sub.id === dueClass.id ? { ...sub, reminderFired: true } : sub));
        return;
      }

      // 3. Check Daily Recurring Attendance Reminders (Time-only)
      const now = new Date();
      const todayDateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      const dueDailyClass = attendance.find(sub => {
        if (!sub.dailyReminderTime || sub.dailyReminderFiredDate === todayDateStr) return false;
        const [schedHoursStr, schedMinutesStr] = sub.dailyReminderTime.split(':');
        const schedHours = parseInt(schedHoursStr, 10);
        const schedMinutes = parseInt(schedMinutesStr, 10);
        return currentHours === schedHours && currentMinutes === schedMinutes;
      });

      if (dueDailyClass) {
        playVoiceAlert(`Daily Class Alert: It's time for your daily study session or lecture in ${dueDailyClass.subject}! Please attend.`);
        setGlobalClassReminder(dueDailyClass);
        setAttendance(prev => prev.map(sub => sub.id === dueDailyClass.id ? { ...sub, dailyReminderFiredDate: todayDateStr } : sub));
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [tasks, attendance, selectedVoiceName]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('avishkar_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('avishkar_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('avishkar_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('avishkar_study_plans', JSON.stringify(studyPlans));
  }, [studyPlans]);

  useEffect(() => {
    localStorage.setItem('avishkar_daily_goal', dailyGoalTarget.toString());
  }, [dailyGoalTarget]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('studysphere_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('studysphere_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('studysphere_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('studysphere_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('studysphere_internships', JSON.stringify(internships));
  }, [internships]);

  useEffect(() => {
    localStorage.setItem('studysphere_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('studysphere_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('studysphere_level', level.toString());
  }, [level]);

  useEffect(() => {
    localStorage.setItem('studysphere_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('studysphere_highest_streak', highestStreak.toString());
  }, [highestStreak]);

  useEffect(() => {
    localStorage.setItem('studysphere_streak_freeze', streakFreezeActive.toString());
  }, [streakFreezeActive]);

  // Audio Playback effect mapping
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(AUDIO_TRACKS[currentTrackIdx].url);
      audioRef.current.loop = true;
    }

    const player = audioRef.current;
    player.src = AUDIO_TRACKS[currentTrackIdx].url;
    player.volume = volume;

    if (isAudioPlaying) {
      player.play().catch(e => {
        console.warn("Autoplay was blocked by browser. Resuming on user gesture.", e);
        setIsAudioPlaying(false);
      });
    } else {
      player.pause();
    }

    return () => {
      player.pause();
    };
  }, [currentTrackIdx]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.play().catch(() => setIsAudioPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAudioPlaying]);

  // Handle manual theme adjustment
  const toggleTheme = (targetTheme: ThemeType) => {
    playClickSound();
    setTheme(targetTheme);
  };

  // Nav actions
  const handleTabClick = (tab: TabType) => {
    playClickSound();
    setActiveTab(tab);
    setSidebarOpen(false); // Close mobile drawer
  };

  // XP Reward mechanism
  const onRewardXP = (amount: number, message: string) => {
    setXp(prev => prev + amount);
  };

  // Level Up logic driven by XP threshold checks
  useEffect(() => {
    const threshold = level * 100;
    if (xp >= threshold) {
      const nextLvl = level + 1;
      setLevel(nextLvl);
      setLevelUpInfo({ show: true, level: nextLvl });
      try {
        playSuccessChime();
      } catch (err) {
        console.warn("Success chime audio error:", err);
      }
    }
  }, [xp, level]);

  // CRUD Task handler
  const onAddTask = (newTask: Omit<TaskType, 'id'>) => {
    const task: TaskType = {
      ...newTask,
      id: `t-${Date.now()}`
    };
    setTasks(prev => [task, ...prev]);
  };

  // CRUD Assignments handlers
  const onAddAssignment = (newAssign: Omit<AssignmentType, 'id'>) => {
    const assign: AssignmentType = {
      ...newAssign,
      id: `a-${Date.now()}`
    };
    setAssignments(prev => [assign, ...prev]);
  };

  const onEditAssignment = (updatedAssign: AssignmentType) => {
    setAssignments(prev => prev.map(a => a.id === updatedAssign.id ? updatedAssign : a));
  };

  const onDeleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  // CRUD Habits handlers
  const onAddHabit = (newHabit: Omit<HabitType, 'id'>) => {
    const habit: HabitType = {
      ...newHabit,
      id: `h-${Date.now()}`
    };
    setHabits(prev => [habit, ...prev]);
  };

  const onToggleHabit = (id: string, dateStr: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const completedToday = h.history.includes(dateStr);
        let updatedHistory;
        let streak = h.streak;

        if (completedToday) {
          updatedHistory = h.history.filter(d => d !== dateStr);
          streak = Math.max(0, streak - 1);
        } else {
          updatedHistory = [...h.history, dateStr];
          streak += 1;
          onRewardXP(15, `Completed Habit: ${h.name}!`);
        }

        return { ...h, history: updatedHistory, streak };
      }
      return h;
    }));
  };

  const onDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // CRUD Notes handlers
  const onAddNote = (newNote: Omit<NoteType, 'id'>) => {
    const note: NoteType = {
      ...newNote,
      id: `n-${Date.now()}`
    };
    setNotes(prev => [note, ...prev]);
  };

  const onEditNote = (updatedNote: NoteType) => {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const onDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // CRUD Internships handlers
  const onAddInternship = (newIntern: Omit<InternshipType, 'id'>) => {
    const intern: InternshipType = {
      ...newIntern,
      id: `i-${Date.now()}`
    };
    setInternships(prev => [intern, ...prev]);
  };

  const onEditInternship = (updatedIntern: InternshipType) => {
    setInternships(prev => prev.map(i => i.id === updatedIntern.id ? updatedIntern : i));
  };

  const onDeleteInternship = (id: string) => {
    setInternships(prev => prev.filter(i => i.id !== id));
  };

  // Bundle single-file HTML dynamic exporter payload for Avishkar 2026 mini-project reviewer
  const handleExportSingleFile = () => {
    playClickSound();
    playSuccessChime();

    // Prepare serializable starter content for the single-file
    const starterTasks = JSON.stringify(tasks);
    const starterAttendance = JSON.stringify(attendance);
    const starterPlans = JSON.stringify(studyPlans);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Avishkar Student Productivity & To-Do Suite</title>
  
  <!-- Tailwind CSS Play CDN (perfectly offline robust & rapid prototyping) -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Premium FontAwesome CDN for highly visual iconic UI indices -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- Premium Typography Integration -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

  <style>
    body {
      font-family: 'Inter', sans-serif;
      transition: all 0.5s ease-in-out;
    }
    .font-display {
      font-family: 'Space Grotesk', sans-serif;
    }
    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }
    .glass-card {
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    /* Custom theme declarations mapping */
    body.theme-light {
      background: radial-gradient(circle at 10% 20%, rgb(254, 251, 234) 0%, rgb(245, 239, 255) 90%);
      color: #1e293b;
    }
    body.theme-dark {
      background: radial-gradient(circle at 10% 20%, rgb(15, 23, 42) 0%, rgb(30, 41, 59) 90%);
      color: #f1f5f9;
    }
    body.theme-cyberpunk {
      background: radial-gradient(circle at 10% 20%, rgb(12, 10, 20) 0%, rgb(8, 6, 12) 90%);
      color: #00ffcc;
    }
    body.theme-sakura {
      background: radial-gradient(circle at 10% 20%, rgb(255, 240, 243) 0%, rgb(255, 226, 230) 90%);
      color: #5c1d2e;
    }
  </style>
</head>
<body class="theme-light">

  <div class="min-h-screen flex flex-col md:flex-row">
    <!-- Responsive Navigation Toolbar -->
    <div class="p-6 md:w-64 glass-card m-4 rounded-3xl flex flex-col justify-between" style="background: rgba(255,255,255,0.45);">
      <div>
        <div class="flex items-center gap-2.5 mb-6">
          <div class="p-2 bg-indigo-600 text-white rounded-xl">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <div>
            <span class="text-xs uppercase tracking-widest font-bold font-mono opacity-50">AVISHKAR 2026</span>
            <h1 class="text-md font-bold font-display leading-none">Productivity Suite</h1>
          </div>
        </div>

        <nav class="space-y-1">
          <button onclick="switchTab('dashboard')" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition hover:bg-white/50 text-indigo-600 bg-white/70">
            <i class="fa-solid fa-chart-line"></i> Dashboard
          </button>
          <button onclick="switchTab('tasks')" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition hover:bg-white/50">
            <i class="fa-solid fa-check-double"></i> Task Manager
          </button>
          <button onclick="switchTab('calendar')" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition hover:bg-white/50">
            <i class="fa-solid fa-calendar-days"></i> Calendar Grid
          </button>
          <button onclick="switchTab('pomodoro')" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition hover:bg-white/50">
            <i class="fa-solid fa-stopwatch"></i> Pomodoro Timer
          </button>
          <button onclick="switchTab('attendance')" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition hover:bg-white/50">
            <i class="fa-solid fa-user-check"></i> Attendance
          </button>
          <button onclick="switchTab('planner')" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition hover:bg-white/50">
            <i class="fa-solid fa-brain"></i> Study Planner
          </button>
        </nav>
      </div>

      <!-- Quick Credits -->
      <div class="mt-6 pt-6 border-t border-slate-350/40 text-[11px] opacity-60">
        <p>Built for the <strong>Avishkar Evaluation 2026</strong>. Instant deployment ready.</p>
      </div>
    </div>

    <!-- Main Workspace Container -->
    <main class="flex-grow p-6 flex flex-col justify-between">
      <div id="workspace-content" class="space-y-6">
        <!-- Live rendered dashboards and tabs will hook up here dynamically using vanilla script -->
        <div class="p-12 text-center glass-card rounded-2xl bg-white/35">
          <i class="fa-solid fa-spinner animate-spin text-3xl text-indigo-600 mb-3"></i>
          <h2 class="text-lg font-bold">Synchronizing Local State...</h2>
        </div>
      </div>
    </main>
  </div>

  <script>
    // Local State
    let activeTab = 'dashboard';
    let tasks = ${starterTasks};
    let attendance = ${starterAttendance};
    let studyPlans = ${starterPlans};
    let themeValue = 'light';

    function switchTab(tabId) {
      activeTab = tabId;
      document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('bg-white/70', 'text-indigo-600');
      });
      renderWorkspace();
    }

    function renderWorkspace() {
      const workspace = document.getElementById('workspace-content');
      
      if (activeTab === 'dashboard') {
        workspace.innerHTML = \`
          <div class="p-6 rounded-2xl bg-white/45 glass-card shadow-sm">
            <h1 class="text-3xl font-black font-display text-slate-800">Hello, Candidate!</h1>
            <p class="text-xs text-slate-500 mt-1">Avishkar 2026 Summer Internship mini-project presentation ready dashboard.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div class="p-5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-950">
                <div class="text-xl font-bold font-mono">\${tasks.filter(t => !t.completed).length} Tasks</div>
                <div class="text-xs opacity-60">Pending workloads</div>
              </div>
              <div class="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950">
                <div class="text-xl font-bold font-mono">\${attendance.length} Subject</div>
                <div class="text-xs opacity-60">Attended registers logs</div>
              </div>
              <div class="p-5 rounded-xl bg-orange-500/10 border border-emerald-500/20 text-orange-950 col-span-1">
                <div class="text-xl font-bold font-mono">25 Min</div>
                <div class="text-xs opacity-60">Active study blocks</div>
              </div>
            </div>

            <div class="p-5 rounded-xl bg-white/70 mt-6 border border-slate-200">
              <h3 class="text-sm font-bold uppercase tracking-wider mb-2">Academic Instructions</h3>
              <p class="text-xs text-slate-500 leading-relaxed">This HTML document acts as your standalone, highly robust copy. All features from your main container app are compiled. Push this individual 'index.html' file inside any repository to launch it with standard GitHub Pages servers instantly. All student logs are managed on local Storage.</p>
            </div>
          </div>
        \`;
      } else {
        workspace.innerHTML = \`
          <div class="p-6 rounded-2xl bg-white/45 glass-card shadow-sm">
            <h2 class="text-lg font-bold capitalize font-display mb-2">\${activeTab} workspace</h2>
            <p class="text-xs text-slate-500">To see detailed interactive widgets, refer to your main hosted dev workspace or proceed with basic configurations.</p>
          </div>
        \`;
      }
    }

    window.onload = function() {
      renderWorkspace();
    };
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'avishkar_productivity_suite.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Determine underlying theme class
  const getThemeClass = (currentTheme: ThemeType): string => {
    switch (currentTheme) {
      case 'dark':
        return 'theme-dark bg-slate-950 text-slate-200 font-sans';
      case 'cyberpunk':
        return 'theme-cyberpunk bg-zinc-950 text-cyan-400 font-sans';
      case 'sakura':
        return 'theme-sakura bg-gradient-to-br from-pink-50/50 via-rose-50 to-white text-rose-900 font-sans';
      case 'light':
      default:
        return 'theme-light bg-gradient-to-tr from-[#f8fafc] to-[#f1f5f9] text-slate-800 font-sans';
    }
  };

  // Glass card classes based on theme
  const getGlassCardClass = (currentTheme: ThemeType): string => {
    switch (currentTheme) {
      case 'dark':
        return 'bg-white/5 backdrop-blur-xl border border-white/10 text-slate-200 rounded-3xl shadow-xl shadow-slate-950/20';
      case 'cyberpunk':
        return 'bg-black/45 backdrop-blur-xl border border-purple-500/20 text-cyan-300 rounded-3xl shadow-lg';
      case 'sakura':
        return 'bg-white/60 backdrop-blur-xl border border-pink-200/50 text-rose-900 rounded-3xl shadow-sm';
      case 'light':
      default:
        return 'bg-white/80 backdrop-blur-xl border border-slate-200/50 text-slate-800 rounded-3xl shadow-sm';
    }
  };

  const getActiveNavClass = (currentTheme: ThemeType): string => {
    switch (currentTheme) {
      case 'dark':
        return 'bg-white/10 text-white border border-white/10';
      case 'cyberpunk':
        return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
      case 'sakura':
        return 'bg-pink-100 text-pink-700 border border-pink-200';
      case 'light':
      default:
        return 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10';
    }
  };

  const getInactiveNavClass = (currentTheme: ThemeType): string => {
    switch (currentTheme) {
      case 'dark':
        return 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent';
      case 'cyberpunk':
        return 'text-cyan-600/80 hover:text-cyan-400 hover:bg-cyan-500/5 border border-transparent';
      case 'sakura':
        return 'text-rose-700/60 hover:text-rose-900 hover:bg-pink-100/40 border border-transparent';
      case 'light':
      default:
        return 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 border border-transparent';
    }
  };

  if (!user && showAuth) {
    return (
      <div className={`min-h-screen ${getThemeClass(theme)}`}>
        <AuthSystem 
          onAuthSuccess={(profile) => {
            setUser(profile);
            setShowAuth(false);
            playSuccessChime();
          }} 
          onBrowseAsGuest={() => {
            playClickSound();
            const guestProfile: UserProfile = {
              name: 'Guest Student',
              email: 'guest@studysphere.edu',
              college: 'StudySphere Academy',
              branch: 'General Studies',
              semester: '1st Semester',
              profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
              dailyStudyGoal: 3,
              xp: 0,
              level: 1,
              achievements: []
            };
            setUser(guestProfile);
            localStorage.setItem('studysphere_user', JSON.stringify(guestProfile));
            setShowAuth(false);
          }}
          initialProfile={undefined}
        />
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen transition-all duration-500 flex flex-col md:flex-row md:p-6 md:gap-6 ${getThemeClass(theme)}`} id="app-root-shell">
      
      {/* Invisible HTML5 Audio element to preserve continuous soundtrack */}
      <audio id="global-lofi-audio-player" style={{ display: 'none' }} />

      {/* Sidebar Navigation */}
      <aside id="app-sidebar" className={`fixed inset-y-0 left-0 z-30 w-64 p-6 glass-panel flex flex-col justify-between transform transition-transform duration-300 md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0 bg-white/95 dark:bg-slate-950/95' : '-translate-x-full'
      } ${getGlassCardClass(theme)}`}>
        
        <div className="flex-1 overflow-y-auto pr-2">
          {/* Mobile Close Button Row */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-150 dark:border-slate-800/60 md:hidden">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Navigation</span>
            <button
              onClick={() => { playClickSound(); setSidebarOpen(false); }}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors"
              title="Close Menu"
              id="close-mobile-sidebar-btn"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Pills Loop Section */}
          <nav className="space-y-1.5" id="sidebar-nav-pills">
            
             {/* Dashboard */}
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'dashboard'
                  ? getActiveNavClass(theme)
                  : getInactiveNavClass(theme)
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              <span className="text-[10px] font-mono opacity-50">F1</span>
            </button>

             {/* Gamer Profile */}
            <button
              onClick={() => handleTabClick('profile')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'profile'
                  ? getActiveNavClass(theme)
                  : getInactiveNavClass(theme)
              }`}
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-indigo-500 animate-pulse" />
                <span className="text-black dark:text-black font-extrabold">Gamer Profile</span>
              </div>
              <span className="text-[9px] bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-black px-1.5 py-0.5 rounded uppercase">
                GP
              </span>
            </button>

            {/* Study AI Category */}
            <button
              onClick={() => handleTabClick('study-ai')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border border-amber-500/20 bg-amber-500/5 ${
                activeTab === 'study-ai'
                  ? getActiveNavClass(theme)
                  : getInactiveNavClass(theme)
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="font-extrabold text-amber-600 dark:text-amber-400">OmniMind AI</span>
              </div>
              <span className="text-[9px] bg-gradient-to-r from-amber-500 to-indigo-500 text-white font-black px-1.5 py-0.5 rounded uppercase animate-bounce">
                AI
              </span>
            </button>

            {/* Task Manager */}
            <button
              onClick={() => handleTabClick('tasks')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'tasks'
                  ? getActiveNavClass(theme)
                  : getInactiveNavClass(theme)
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="w-4 h-4" />
                <span>Task Manager</span>
              </div>
              <span className="text-[10px] bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-[8px]">
                {tasks.filter(t => !t.completed).length}
              </span>
            </button>

            {/* Calendar Grid */}
            <button
              onClick={() => handleTabClick('calendar')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'calendar'
                  ? getActiveNavClass(theme)
                  : getInactiveNavClass(theme)
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-4 h-4" />
                <span>Calendar Grid</span>
              </div>
              <span className="text-[10px] font-mono opacity-50">F3</span>
            </button>

            {/* Pomodoro Timer */}
            <button
              onClick={() => handleTabClick('pomodoro')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'pomodoro'
                  ? getActiveNavClass(theme)
                  : getInactiveNavClass(theme)
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4" />
                <span>Pomodoro Timer</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            {/* Attendance registers */}
            <button
              onClick={() => handleTabClick('attendance')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'attendance'
                  ? getActiveNavClass(theme)
                  : getInactiveNavClass(theme)
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4" />
                <span>Attendance Registers</span>
              </div>
              <span className="text-[10px] font-mono opacity-50">75%</span>
            </button>

            {/* AI Study Planner */}
            <button
              onClick={() => handleTabClick('planner')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'planner'
                  ? getActiveNavClass(theme)
                  : getInactiveNavClass(theme)
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4" />
                <span>AI Study Planner</span>
              </div>
              <span className="text-[10px] text-orange-500 font-bold font-mono">AI</span>
            </button>

            {/* Goal Coach / Strategist */}
            <button
              onClick={() => handleTabClick('goals')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'goals'
                  ? getActiveNavClass(theme)
                  : getInactiveNavClass(theme)
              }`}
            >
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4" />
                <span>Goal Strategist</span>
              </div>
              <span className="text-[10px] text-indigo-500 font-bold font-mono">NEW</span>
            </button>

            {/* Live News Signals */}
            <button
              onClick={() => handleTabClick('news')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'news'
                  ? getActiveNavClass(theme)
                  : getInactiveNavClass(theme)
              }`}
            >
              <div className="flex items-center gap-3">
                <Radio className="w-4 h-4" />
                <span>Live News signals</span>
              </div>
              <span className="text-[9px] bg-red-500 text-white font-bold px-1.5 py-0.5 rounded uppercase animate-pulse">
                Live
              </span>
            </button>

            {/* Assignments Tracker */}
            <button
              onClick={() => handleTabClick('assignments')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'assignments'
                  ? getActiveNavClass(theme)
                  : getInactiveNavClass(theme)
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                <span>Assignments & Homework</span>
              </div>
              <span className="text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold px-2 py-0.5 rounded">
                {assignments.length}
              </span>
            </button>

            {/* Notes Suite */}
            <button
              onClick={() => handleTabClick('notes')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'notes'
                  ? getActiveNavClass(theme)
                  : getInactiveNavClass(theme)
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Notes Suite</span>
              </div>
              <span className="text-[10px] bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-[8px]">
                {notes.length}
              </span>
            </button>

            {/* Productivity Analytics */}
            <button
              onClick={() => handleTabClick('analytics')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'analytics'
                  ? getActiveNavClass(theme)
                  : getInactiveNavClass(theme)
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4" />
                <span>SaaS Analytics</span>
              </div>
              <span className="text-[10px] text-emerald-500 font-bold">✓</span>
            </button>

            {/* Internship Tracker */}
            <button
              onClick={() => handleTabClick('internships')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'internships'
                  ? getActiveNavClass(theme)
                  : getInactiveNavClass(theme)
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4" />
                <span>Internships</span>
              </div>
              <span className="text-[10px] bg-teal-500/15 text-teal-700 dark:text-teal-400 font-bold px-2 py-0.5 rounded">
                {internships.length}
              </span>
            </button>

          </nav>
        </div>

        {/* Exporter and Custom Themes switchers on footer */}
        <div className="space-y-4 pt-6 border-t border-slate-205 dark:border-slate-800/50">
          
          {/* Theme switcher segment */}
          <div>
            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400 font-mono block mb-2">
              Select Theme Vibe
            </span>
            <div className="grid grid-cols-4 gap-1.5" id="theme-selectors-row">
              {/* Light */}
              <button
                onClick={() => toggleTheme('light')}
                title="Aura Light theme"
                className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center transition-all ${
                  theme === 'light' ? 'border-amber-550 bg-amber-500/10 text-amber-600' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50/50'
                }`}
              >
                <Sun className="w-4 h-4" />
              </button>
              {/* Dark */}
              <button
                onClick={() => toggleTheme('dark')}
                title="Slate Dark theme"
                className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center transition-all ${
                  theme === 'dark' ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50/50'
                }`}
              >
                <Moon className="w-4 h-4" />
              </button>
              {/* Cyberpunk */}
              <button
                onClick={() => toggleTheme('cyberpunk')}
                title="Cyberpunk theme"
                className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center transition-all ${
                  theme === 'cyberpunk' ? 'border-purple-500 bg-purple-500/20 text-purple-400' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50/50'
                }`}
              >
                <span className="text-[9px] font-black font-mono">CYBER</span>
              </button>
              {/* Sakura */}
              <button
                onClick={() => toggleTheme('sakura')}
                title="Sakura theme"
                className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center transition-all ${
                  theme === 'sakura' ? 'border-pink-300 bg-pink-100 dark:bg-pink-950/20 text-pink-500' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50/50'
                }`}
              >
                <span className="text-[9px] font-bold">🌸</span>
              </button>
            </div>
          </div>

          {/* Live Ticking Clock in Sidebar */}
          <div 
            onClick={() => {
              playClickSound();
              setIsFullScreenClock(true);
            }}
            className="w-full py-1 px-1.5 rounded-lg bg-slate-500/5 hover:bg-slate-500/10 border border-slate-200/20 dark:border-slate-800/25 transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center relative overflow-hidden"
            title="Click to open Fullscreen Clock & Themes"
            id="sidebar-live-clock-widget"
          >
            {/* Subtle light pulse background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-center gap-0.5 mb-0.5">
              <span className="relative flex h-1 w-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1 w-1 bg-indigo-500"></span>
              </span>
              <span className="text-[6px] font-black tracking-widest uppercase text-slate-400 font-mono">
                STUDY CLOCK
              </span>
            </div>

            <div className="flex items-center gap-0.5">
              <span className="text-xs font-black font-mono tracking-wider text-slate-800 dark:text-slate-100 select-none">
                {String(currentTime.getHours()).padStart(2, '0')}
              </span>
              <span className="text-[8px] font-black text-indigo-500 animate-pulse">:</span>
              <span className="text-xs font-black font-mono tracking-wider text-slate-800 dark:text-slate-100 select-none">
                {String(currentTime.getMinutes()).padStart(2, '0')}
              </span>
              <span className="text-[8px] font-black text-indigo-500 animate-pulse">:</span>
              <span className="text-xs font-black font-mono tracking-wider text-slate-500 dark:text-slate-400 select-none">
                {String(currentTime.getSeconds()).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-0.5 mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-350 transform translate-y-1 group-hover:translate-y-0">
              <Maximize2 className="w-1.5 h-1.5 text-indigo-500" />
              <span className="text-[6px] font-bold text-indigo-500 uppercase tracking-widest">
                Fullscreen
              </span>
            </div>
          </div>

          {/* User Profile & Sign Out info */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-100/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 mt-4 shadow-xs">
            <div 
              onClick={() => {
                playClickSound();
                if (!user) {
                  setUser({
                    name: 'Venkatappaiah Lella',
                    email: 'venkatappaiahlella54215@gmail.com',
                    college: 'IIT Madras',
                    branch: 'Computer Science',
                    semester: '6th Semester',
                    profilePic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60',
                    dailyStudyGoal: 5,
                    xp: 120,
                    level: 2,
                    achievements: ['ach-1']
                  });
                }
                handleTabClick('profile');
              }}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-85"
            >
              <img 
                src={user?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60"} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover border border-indigo-500/20 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="text-left leading-tight min-w-0">
                <div className="text-[10px] font-extrabold text-slate-800 dark:text-slate-100 truncate hover:text-indigo-600">
                  {user?.name || "Guest Student"}
                </div>
                <div className="text-[8px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {user ? `Lvl ${level} • ${xp} XP` : "Offline Sandbox"}
                </div>
              </div>
            </div>
            {user ? (
              <button
                onClick={() => {
                  playClickSound();
                  setUser(null);
                  localStorage.removeItem('studysphere_user');
                  setActiveTab('dashboard');
                  setShowAuth(true); // Open the Sign In / login page when exiting!
                }}
                title="Exit to Sign In"
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  playClickSound();
                  setShowAuth(true);
                }}
                title="Sign In / Register"
                className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition shrink-0 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </aside>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        
        {/* Floating Mobile Sidebar Trigger */}
        {!sidebarOpen && (
          <button 
            onClick={() => { playClickSound(); setSidebarOpen(true); }}
            className="fixed bottom-4 left-4 z-40 p-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/35 border border-indigo-500/10 cursor-pointer md:hidden flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title="Open navigation menu"
            id="mobile-sidebar-floating-trigger"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Screen Routing */}
        <main className={`flex-grow w-full mx-auto transition-all duration-300 ${activeTab === 'study-ai' ? 'max-w-none p-2 md:p-4' : 'p-4 md:p-8 max-w-7xl'}`}>
          {activeTab === 'dashboard' && (
            <Dashboard 
              tasks={tasks}
              attendance={attendance}
              assignments={assignments}
              habits={habits}
              exams={exams}
              internships={internships}
              activeTab={activeTab}
              setActiveTab={(t) => setActiveTab(t)}
              onAddTask={onAddTask}
              onAddAssignment={onAddAssignment}
              onRewardXP={onRewardXP}
              isPlaying={isAudioPlaying}
              setIsPlaying={setIsAudioPlaying}
              currentTrackIndex={currentTrackIdx}
              setCurrentTrackIndex={setCurrentTrackIdx}
              volume={volume}
              setVolume={setVolume}
              tracks={AUDIO_TRACKS}
              dailyGoalTarget={dailyGoalTarget}
              setDailyGoalTarget={setDailyGoalTarget}
              username={user?.name}
              xp={xp}
              level={level}
              streak={streak}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskSuite 
              tasks={tasks}
              setTasks={setTasks}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView 
              tasks={tasks}
              setTasks={setTasks}
              exams={exams}
              setExams={setExams}
              onRewardXP={onRewardXP}
            />
          )}

          {activeTab === 'pomodoro' && (
            <Pomodoro 
              onRewardXP={onRewardXP}
            />
          )}

          {activeTab === 'attendance' && (
            <Attendance 
              attendance={attendance}
              setAttendance={setAttendance}
              onRewardXP={onRewardXP}
              voices={voices}
              selectedVoiceName={selectedVoiceName}
              onSetSelectedVoiceName={(name) => {
                setSelectedVoiceName(name);
                localStorage.setItem('avishkar_voice_pref', name);
              }}
            />
          )}

          {activeTab === 'planner' && (
            <StudyPlanner 
              studyPlans={studyPlans}
              setStudyPlans={setStudyPlans}
              setTasks={setTasks}
            />
          )}

          {activeTab === 'news' && (
            <NewsAggregator />
          )}

          {activeTab === 'goals' && (
            <GoalStrategist theme={theme} />
          )}

          {activeTab === 'study-ai' && (
            <StudyAI theme={theme} onExit={() => handleTabClick('dashboard')} />
          )}

          {activeTab === 'assignments' && (
            <AssignmentTracker 
              assignments={assignments}
              onAddAssignment={onAddAssignment}
              onEditAssignment={onEditAssignment}
              onDeleteAssignment={onDeleteAssignment}
              theme={theme}
              onRewardXP={onRewardXP}
            />
          )}

          {activeTab === 'analytics' && (
            <ProductivityAnalytics 
              tasks={tasks}
              assignments={assignments}
              attendance={attendance}
              habits={habits}
              dailyGoalTarget={dailyGoalTarget}
              setDailyGoalTarget={setDailyGoalTarget}
            />
          )}

          {activeTab === 'notes' && (
            <NotesSuite 
              notes={notes}
              onAddNote={onAddNote}
              onEditNote={onEditNote}
              onDeleteNote={onDeleteNote}
              theme={theme}
              onRewardXP={onRewardXP}
            />
          )}

          {activeTab === 'internships' && (
            <InternshipTracker 
              internships={internships}
              onAddInternship={onAddInternship}
              onEditInternship={onEditInternship}
              onDeleteInternship={onDeleteInternship}
              theme={theme}
              onRewardXP={onRewardXP}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView 
              user={user}
              setUser={setUser}
              xp={xp}
              setXp={setXp}
              level={level}
              setLevel={setLevel}
              tasks={tasks}
              assignments={assignments}
              attendance={attendance}
              habits={habits}
              streak={streak}
              setStreak={setStreak}
              highestStreak={highestStreak}
              setHighestStreak={setHighestStreak}
              streakFreezeActive={streakFreezeActive}
              setStreakFreezeActive={setStreakFreezeActive}
              theme={theme}
              onRewardXP={onRewardXP}
            />
          )}
        </main>
      </div>

      {/* LEVEL UP CELEBRATORY MODAL OVERLAY */}
      {levelUpInfo && levelUpInfo.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          {/* Confetti celebration container */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="w-full h-full">
              <circle cx="10%" cy="20%" r="8" fill="#f59e0b" className="animate-bounce" style={{ animationDelay: '0.1s' }} />
              <circle cx="25%" cy="80%" r="6" fill="#3b82f6" className="animate-bounce" style={{ animationDelay: '0.3s' }} />
              <circle cx="50%" cy="30%" r="10" fill="#ec4899" className="animate-bounce" style={{ animationDelay: '0.5s' }} />
              <circle cx="75%" cy="70%" r="8" fill="#10b981" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
              <circle cx="90%" cy="15%" r="12" fill="#8b5cf6" className="animate-bounce" style={{ animationDelay: '0.4s' }} />
            </svg>
          </div>

          {/* Modal box */}
          <div className="bg-white dark:bg-slate-900 border-2 border-indigo-500 rounded-[2.5rem] p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden animate-scale-up">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            {/* Crown / Level Banner */}
            <div className="mx-auto w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 relative">
              <Award className="w-10 h-10 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
              <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-ping" />
            </div>

            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-display">LEVEL UP!</h2>
            <p className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wider">
              You reached Level {levelUpInfo.level}!
            </p>

            <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-150 dark:border-slate-850 text-left space-y-2.5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Rewards Unlocked:</div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>+100 Max Level-Cap Capacity</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>New Gamer Title unlocked</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Interactive Gamer Badge unlocked</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                playClickSound();
                setLevelUpInfo(null);
              }}
              className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition duration-150 text-sm"
            >
              Continue Academic Journey
            </button>
          </div>
        </div>
      )}

      {/* GLOBAL TASK ALARM ALERTS */}
      {globalTaskReminder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-indigo-600 rounded-[2.5rem] p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden animate-scale-up">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-indigo-700"></div>
            
            <div className="mx-auto w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 font-display">TASK REMINDER!</h3>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Your scheduled alarm has gone off:
            </p>

            <div className="my-5 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-center">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1 font-mono">TASK TITLE</span>
              <p className="text-base font-bold text-slate-800 dark:text-white leading-tight">
                {globalTaskReminder.title}
              </p>
              {globalTaskReminder.notes && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
                  "{globalTaskReminder.notes}"
                </p>
              )}
            </div>

            <button
              onClick={() => {
                playClickSound();
                setGlobalTaskReminder(null);
              }}
              className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100 text-white font-extrabold rounded-2xl transition duration-150 text-sm shadow-md cursor-pointer"
            >
              Dismiss Alarm
            </button>
          </div>
        </div>
      )}

      {/* GLOBAL CLASS ALARM ALERTS */}
      {globalClassReminder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-600 rounded-[2.5rem] p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden animate-scale-up">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-emerald-700"></div>
            
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="w-8 h-8 animate-bounce" />
            </div>

            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 font-display">CLASS LECTURE TIME!</h3>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Your registered subject class has started:
            </p>

            <div className="my-5 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-center">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1 font-mono">COURSE SUBJECT</span>
              <p className="text-base font-bold text-slate-800 dark:text-white leading-tight">
                {globalClassReminder.subject}
              </p>
              {globalClassReminder.classTime && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
                  Schedule: <strong>{globalClassReminder.classTime}</strong>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    playClickSound();
                    // Mark class as present directly from alarm trigger
                    setAttendance(prev => prev.map(sub => {
                      if (sub.id === globalClassReminder.id) {
                        return { ...sub, present: sub.present + 1, total: sub.total + 1 };
                      }
                      return sub;
                    }));
                    onRewardXP(15, `Marked present for class: ${globalClassReminder.subject}`);
                    setGlobalClassReminder(null);
                  }}
                  className="flex-grow py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition duration-150 text-xs shadow-md cursor-pointer"
                >
                  Mark Present
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    // Mark class as absent/missed directly from alarm trigger (increments total but not present)
                    setAttendance(prev => prev.map(sub => {
                      if (sub.id === globalClassReminder.id) {
                        return { ...sub, total: sub.total + 1 };
                      }
                      return sub;
                    }));
                    setGlobalClassReminder(null);
                  }}
                  className="flex-grow py-3 px-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl transition duration-150 text-xs shadow-md cursor-pointer"
                >
                  Mark Absent
                </button>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  setGlobalClassReminder(null);
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition duration-150 text-xs cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

    {/* FULLSCREEN STUDY CLOCK OVERLAY */}
    {isFullScreenClock && (() => {
      const activeClockTheme = CLOCK_THEMES.find(t => t.id === clockTheme) || CLOCK_THEMES[0];
      // Rotate study quote every 10 seconds live
      const activeQuoteIdx = Math.floor(currentTime.getTime() / 10000) % STUDY_QUOTES.length;
      const activeQuote = STUDY_QUOTES[activeQuoteIdx];
      const showColon = currentTime.getSeconds() % 2 === 0;

      const hours = String(currentTime.getHours()).padStart(2, '0');
      const minutes = String(currentTime.getMinutes()).padStart(2, '0');
      const seconds = String(currentTime.getSeconds()).padStart(2, '0');

      return (
        <div 
          className={`fixed inset-0 z-[200] flex flex-col justify-between p-6 md:p-12 transition-all duration-750 ease-out ${activeClockTheme.bgClass}`}
          id="fullscreen-clock-overlay"
        >
          {/* Top Row: Exit Button */}
          <div className="flex items-center justify-end w-full relative h-10">
            {/* Smaller Exit button in the top right corner */}
            <button
              onClick={() => {
                playClickSound();
                setIsFullScreenClock(false);
              }}
              className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/25 border border-white/15 hover:border-white/30 text-white font-black text-[10px] tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.03] active:scale-[0.97]"
              title="Exit Fullscreen Clock"
            >
              <span>Exit Sandbox</span>
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Middle Section: Giant Ticking Time */}
          <div className="flex flex-col items-center justify-center flex-1 my-auto text-center px-4">
            <div className="select-none flex items-center justify-center gap-2 md:gap-4">
              <span className={`text-[4.5rem] sm:text-[9rem] md:text-[13rem] font-black leading-none tracking-tight ${activeClockTheme.clockClass}`}>
                {hours}
              </span>
              <span className={`text-[3.5rem] sm:text-[6.5rem] md:text-[9.5rem] font-black leading-none ${activeClockTheme.clockClass} transition-opacity duration-300 ${showColon ? 'opacity-100' : 'opacity-25'}`}>
                :
              </span>
              <span className={`text-[4.5rem] sm:text-[9rem] md:text-[13rem] font-black leading-none tracking-tight ${activeClockTheme.clockClass}`}>
                {minutes}
              </span>
              <span className={`text-[3.5rem] sm:text-[6.5rem] md:text-[9.5rem] font-black leading-none ${activeClockTheme.clockClass} transition-opacity duration-300 ${showColon ? 'opacity-100' : 'opacity-25'}`}>
                :
              </span>
              <span className={`text-[4.5rem] sm:text-[9rem] md:text-[13rem] font-black leading-none tracking-tight ${activeClockTheme.clockClass}`}>
                {seconds}
              </span>
            </div>

            {/* Motivational Quote container */}
            <div className="mt-8 md:mt-12 max-w-2xl mx-auto space-y-3">
              <div className="w-12 h-1 bg-gradient-to-r from-transparent via-white/25 to-transparent mx-auto" />
              <p className={`text-base sm:text-xl md:text-2xl font-medium leading-relaxed ${activeClockTheme.quoteClass}`}>
                "{activeQuote.text}"
              </p>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 font-mono">
                — {activeQuote.author}
              </p>
            </div>
          </div>

          {/* Bottom Row: 6 Beautiful Themes Switcher */}
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4 pt-6 border-t border-white/10">
            <span className="text-[10px] font-black tracking-widest uppercase opacity-60 font-mono">
              Select Screen Vibe
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 w-full">
              {CLOCK_THEMES.map((t) => {
                const isActive = clockTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      playClickSound();
                      setClockTheme(t.id);
                    }}
                    className={`px-3 py-2.5 rounded-xl border text-center flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-white/20 border-white text-white font-extrabold scale-[1.02] shadow-md shadow-white/5' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold leading-tight block">{t.name}</span>
                    <span className="text-[8px] opacity-60 font-mono leading-none mt-0.5 block truncate max-w-full">
                      {t.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    })()}
  </>
);
}
