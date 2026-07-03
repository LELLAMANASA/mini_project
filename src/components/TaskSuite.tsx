import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Mic, 
  MicOff, 
  Calendar, 
  Clock, 
  Check, 
  PlusCircle, 
  ChevronRight, 
  Square, 
  CheckSquare, 
  Volume2, 
  ChevronDown, 
  ArrowRight,
  FileText,
  AlertCircle,
  Clock3,
  RefreshCw,
  Bell,
  Play,
  Pause,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TaskType, SubTask } from '../types';
import { playSuccessChime, playClickSound, playBellChime } from '../utils/audio';
import { CompletedCalendarModal } from './CompletedCalendarModal';

interface FlyingCheckmark {
  id: number;
  x: number;
  y: number;
  label: string;
  color: string;
  angle: number;
  delay: number;
  duration: number;
  scaleFrom: number;
  scaleTo: number;
  yOffset: number;
  xOffset: number;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'square' | 'triangle';
}

interface RippleEffect {
  id: number;
  x: number;
  y: number;
}

interface TaskSuiteProps {
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
}

export default function TaskSuite({ tasks, setTasks }: TaskSuiteProps) {
  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activePriority, setActivePriority] = useState<string>('All');

  // Completed calendar state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Satisfying visual reward systems: particles & ripples on task completion
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [flyingCheckmarks, setFlyingCheckmarks] = useState<FlyingCheckmark[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (confetti.length === 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const updatePhysics = () => {
      setConfetti(prev => {
        const now = Date.now();
        return prev
          .map(p => {
            const vx = p.vx * 0.95;
            const vy = p.vy * 0.95 + 0.3; // Gravity pull down
            return {
              ...p,
              x: p.x + vx,
              y: p.y + vy,
              vx,
              vy,
              rotation: p.rotation + p.rotationSpeed,
            };
          })
          .filter(p => now - p.id < 1500); // Live for 1.5 seconds maximum
      });

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [confetti.length]);

  const triggerRewardEffects = (clientX: number, clientY: number) => {
    // 1. Create expanding ripples
    const newRippleId = Date.now() + Math.random();
    setRipples(prev => [...prev, { id: newRippleId, x: clientX, y: clientY }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRippleId));
    }, 1000);

    // 2. Generate multi-colored bouncing confetti explosion
    const particleCount = 45;
    const colors = [
      '#FFC107', '#4CAF50', '#00BCD4', '#E91E63', '#9C27B0', 
      '#FF5722', '#10B981', '#6366F1', '#3B82F6', '#F43F5E', 
      '#14B8A6', '#F59E0B'
    ];
    const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];

    const newParticles: ConfettiParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 2 + Math.random() * 9;
      newParticles.push({
        id: Date.now() + Math.random() * 2000,
        x: clientX,
        y: clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (1.5 + Math.random() * 3.5), // bias slightly upwards
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 11,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 18,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    setConfetti(prev => [...prev, ...newParticles]);

    // 3. Generate glorious flying checkmarks & emoji celebration labels
    const newCheckmarks: FlyingCheckmark[] = [
      // Primary checkmark floating straight up
      {
        id: Date.now() + Math.random() * 10,
        x: clientX,
        y: clientY - 30,
        label: 'check',
        color: '#10B981',
        angle: (Math.random() - 0.5) * 20,
        delay: 0,
        duration: 1.4,
        scaleFrom: 0.4,
        scaleTo: 1.5,
        yOffset: 160 + Math.random() * 50,
        xOffset: (Math.random() - 0.5) * 40
      },
      // Floating bonus reward tracker label
      {
        id: Date.now() + Math.random() * 11,
        x: clientX,
        y: clientY - 65,
        label: '✨ +15 XP',
        color: '#FBBF24',
        angle: (Math.random() - 0.5) * 15,
        delay: 0.1,
        duration: 1.5,
        scaleFrom: 0.5,
        scaleTo: 1.3,
        yOffset: 190 + Math.random() * 40,
        xOffset: (Math.random() - 0.5) * 60
      },
      // Left floating star
      {
        id: Date.now() + Math.random() * 12,
        x: clientX - 30,
        y: clientY - 15,
        label: '🌟',
        color: '#F59E0B',
        angle: -30 - Math.random() * 30,
        delay: 0.05,
        duration: 1.1,
        scaleFrom: 0.3,
        scaleTo: 1.2,
        yOffset: 100 + Math.random() * 40,
        xOffset: -70 - Math.random() * 30
      },
      // Right floating star
      {
        id: Date.now() + Math.random() * 13,
        x: clientX + 30,
        y: clientY - 15,
        label: '🌟',
        color: '#F59E0B',
        angle: 30 + Math.random() * 30,
        delay: 0.05,
        duration: 1.1,
        scaleFrom: 0.3,
        scaleTo: 1.2,
        yOffset: 100 + Math.random() * 40,
        xOffset: 70 + Math.random() * 30
      },
      // Pop popper
      {
        id: Date.now() + Math.random() * 14,
        x: clientX,
        y: clientY - 10,
        label: '🎉',
        color: '#EC4899',
        angle: (Math.random() - 0.5) * 50,
        delay: 0,
        duration: 1.2,
        scaleFrom: 0.3,
        scaleTo: 1.4,
        yOffset: 130 + Math.random() * 40,
        xOffset: (Math.random() - 0.5) * 90
      },
      // Awesome check badge
      {
        id: Date.now() + Math.random() * 15,
        x: clientX,
        y: clientY,
        label: '🏆',
        color: '#6366F1',
        angle: (Math.random() - 0.5) * 45,
        delay: 0.15,
        duration: 1.3,
        scaleFrom: 0.2,
        scaleTo: 1.1,
        yOffset: 140 + Math.random() * 40,
        xOffset: (Math.random() - 0.5) * 110
      }
    ];

    setFlyingCheckmarks(prev => [...prev, ...newCheckmarks]);

    // Safe timeout garbage collection for checkmarks
    setTimeout(() => {
      setFlyingCheckmarks(prev => prev.filter(item => !newCheckmarks.some(nc => nc.id === item.id)));
    }, 1800);
  };

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

  // Custom Alarm/Reminder States
  const [schedulingTaskId, setSchedulingTaskId] = useState<string | null>(null);
  const [customReminderTime, setCustomReminderTime] = useState<string>('');
  const [dismissedReminderIds, setDismissedReminderIds] = useState<string[]>([]);

  // Derived state: find task reminders that have fired globally but are not yet completed or dismissed in this view
  const activeFiredReminder = tasks.find(t => 
    !t.completed && 
    t.reminderTime && 
    t.reminderFired && 
    !dismissedReminderIds.includes(t.id)
  );

  const handleSaveReminder = (taskId: string) => {
    if (!customReminderTime) return;
    playClickSound();
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          reminderTime: customReminderTime,
          reminderFired: false // Reset flag if editing/setting new
        };
      }
      return t;
    }));
    setSchedulingTaskId(null);
  };

  const handleRemoveReminder = (taskId: string) => {
    playClickSound();
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = { ...t };
        delete updated.reminderTime;
        delete updated.reminderFired;
        return updated;
      }
      return t;
    }));
    if (schedulingTaskId === taskId) {
      setSchedulingTaskId(null);
    }
  };

  const handleSnoozeReminder = (taskId: string) => {
    playClickSound();
    // Snooze for 5 minutes
    const snoozeTime = new Date(Date.now() + 5 * 60 * 1000);
    // Format to local ISO (YYYY-MM-DDTHH:MM)
    const tzOffset = snoozeTime.getTimezoneOffset() * 60000;
    const localSnoozeStr = (new Date(snoozeTime.getTime() - tzOffset)).toISOString().slice(0, 16);

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          reminderTime: localSnoozeStr,
          reminderFired: false
        };
      }
      return t;
    }));
  };

  const handleDismissReminder = (taskId: string) => {
    playClickSound();
    setDismissedReminderIds(prev => [...prev, taskId]);
  };
  
  // Modal / Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  
  // New Task Details
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [category, setCategory] = useState<'Study' | 'Work' | 'Personal' | 'Shopping'>('Study');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly'>('none');
  const [reminder, setReminder] = useState(false);

  // Voice Input States
  const [isListening, setIsListening] = useState(false);
  const [isSearchListening, setIsSearchListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceToast, setVoiceToast] = useState('');

  // Audio Recorder States
  const [isRecording, setIsRecording] = useState(false);
  const [activeRecorderTaskId, setActiveRecorderTaskId] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          setVoiceSupported(true);
        }
      } catch (e) {
        console.warn("SpeechRecognition check failed", e);
      }
    }
  }, []);

  // Handle Speech recognition
  const handleVoiceInput = () => {
    playClickSound();
    let SpeechRecognition: any = null;
    try {
      SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    } catch (e) {
      console.warn("SpeechRecognition access failed", e);
    }

    if (!SpeechRecognition) {
      setVoiceToast("Speech recognition not supported in this browser.");
      setTimeout(() => setVoiceToast(''), 3000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceToast("Listening... Try: 'Study web dev tomorrow at 4 PM' or 'Buy books low priority'");
      };

      recognition.onerror = (e: any) => {
        console.error(e);
        setIsListening(false);
        setVoiceToast("Couldn't hear you clearly. Retry!");
        setTimeout(() => setVoiceToast(''), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceToast('');
        parseAndSetVoiceTask(transcript);
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition initiation failed:", err);
      setVoiceToast("Failed to initiate voice input. Check mic permissions.");
      setTimeout(() => setVoiceToast(''), 3000);
    }
  };

  const handleVoiceSearch = () => {
    playClickSound();
    let SpeechRecognition: any = null;
    try {
      SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    } catch (e) {
      console.warn("SpeechRecognition access failed", e);
    }

    if (!SpeechRecognition) {
      setVoiceToast("Speech recognition not supported in this browser.");
      setTimeout(() => setVoiceToast(''), 3000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsSearchListening(true);
        setVoiceToast("Listening... Speak search terms to filter tasks");
      };

      recognition.onerror = (e: any) => {
        console.error(e);
        setIsSearchListening(false);
        setVoiceToast("Speech input error. Please try again!");
        setTimeout(() => setVoiceToast(''), 3000);
      };

      recognition.onend = () => {
        setIsSearchListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceToast('');
        setSearchQuery(transcript);
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition search initiation failed:", err);
      setVoiceToast("Failed to initiate voice search. Check mic permissions.");
      setTimeout(() => setVoiceToast(''), 3000);
    }
  };

  // Advanced NLP parser mock logic for sound commands
  const parseAndSetVoiceTask = (text: string) => {
    const rawLower = text.toLowerCase();
    
    // Default draft values
    let draftedTitle = text;
    let draftedPriority: 'high' | 'medium' | 'low' = 'medium';
    let draftedCategory: 'Study' | 'Work' | 'Personal' | 'Shopping' = 'Study';
    let draftedDate = new Date().toISOString().split('T')[0];
    let draftedTime = '12:00';

    // Priority checks
    if (rawLower.includes('high priority') || rawLower.includes('urgent') || rawLower.includes('critical')) {
      draftedPriority = 'high';
      draftedTitle = draftedTitle.replace(/high priority|urgent|critical/i, '');
    } else if (rawLower.includes('low priority') || rawLower.includes('chill') || rawLower.includes('easy')) {
      draftedPriority = 'low';
      draftedTitle = draftedTitle.replace(/low priority|chill|easy/i, '');
    }

    // Category overrides
    if (rawLower.includes('buy') || rawLower.includes('shop') || rawLower.includes('order')) {
      draftedCategory = 'Shopping';
    } else if (rawLower.includes('gym') || rawLower.includes('workout') || rawLower.includes('exercise') || rawLower.includes('run')) {
      draftedCategory = 'Personal';
    } else if (rawLower.includes('work') || rawLower.includes('office') || rawLower.includes('interview')) {
      draftedCategory = 'Work';
    }

    // Simple date inference
    if (rawLower.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      draftedDate = tomorrow.toISOString().split('T')[0];
      draftedTitle = draftedTitle.replace(/tomorrow/i, '');
    } else if (rawLower.includes('next week')) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      draftedDate = nextWeek.toISOString().split('T')[0];
      draftedTitle = draftedTitle.replace(/next week/i, '');
    }

    // Trigger forms and preset values!
    setTitle(draftedTitle.trim());
    setPriority(draftedPriority);
    setCategory(draftedCategory);
    setDueDate(draftedDate);
    setDueTime(draftedTime);
    setNotes("Drafted automatically using smart voice transcription.");
    
    // Open Form to let customer verify
    setIsFormOpen(true);
    setEditingTask(null);
  };

  // CRUD Handlers
  const handleOpenNewForm = () => {
    playClickSound();
    setTitle('');
    setNotes('');
    setPriority('medium');
    setCategory('Study');
    setDueDate(new Date().toISOString().split('T')[0]);
    setDueTime('17:00');
    setRecurring('none');
    setReminder(false);
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (task: TaskType) => {
    playClickSound();
    setEditingTask(task);
    setTitle(task.title);
    setNotes(task.notes);
    setPriority(task.priority);
    setCategory(task.category);
    setDueDate(task.dueDate || '');
    setDueTime(task.dueTime || '');
    setRecurring(task.recurring || 'none');
    setReminder(task.reminder || false);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    playClickSound();
    setConfirmModal({
      isOpen: true,
      title: "Delete Task Log",
      message: "Are you sure you want to remove this task? This action is permanent.",
      onConfirm: () => {
        setTasks(prev => prev.filter(t => t.id !== id));
      }
    });
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    
    if (!title.trim()) return;

    if (editingTask) {
      // Edit mode
      setTasks(prev => prev.map(t => {
        if (t.id === editingTask.id) {
          return {
            ...t,
            title: title.trim(),
            notes: notes.trim(),
            priority,
            category,
            dueDate,
            dueTime,
            recurring,
            reminder
          };
        }
        return t;
      }));
    } else {
      // Add mode
      const newTask: TaskType = {
        id: `t-${Date.now()}`,
        title: title.trim(),
        notes: notes.trim(),
        priority,
        category,
        dueDate,
        dueTime,
        completed: false,
        subtasks: [],
        recurring,
        reminder
      };
      setTasks(prev => [newTask, ...prev]);
    }

    setIsFormOpen(false);
    setEditingTask(null);
  };

  // Toggle absolute check status with sound chimes
  const handleToggleCompleted = (id: string, e?: React.MouseEvent) => {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (e && e.clientX && e.clientY) {
      x = e.clientX;
      y = e.clientY;
    } else if (e && e.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          playSuccessChime(); // Play the highly rewarding synthesized chime!
          triggerRewardEffects(x, y);
        } else {
          playClickSound();
        }
        return { 
          ...t, 
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined
        };
      }
      return t;
    }));
  };

  // Subtask management
  const handleToggleSubtask = (taskId: string, subtaskId: string, e?: React.MouseEvent) => {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (e && e.clientX && e.clientY) {
      x = e.clientX;
      y = e.clientY;
    } else if (e && e.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    playClickSound();
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = t.subtasks.map(st => {
          if (st.id === subtaskId) {
            return { ...st, completed: !st.completed };
          }
          return st;
        });
        
        // If all subtasks were just completed, maybe trigger a success chime
        const previouslyCompleted = t.subtasks.every(st => st.completed);
        const nowCompleted = updatedSubtasks.every(st => st.completed);
        if (nowCompleted && !previouslyCompleted && updatedSubtasks.length > 0) {
          playSuccessChime();
          triggerRewardEffects(x, y);
        }

        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    }));
  };

  const handleAddCustomSubtask = (taskId: string, stTitle: string) => {
    if (!stTitle.trim()) return;
    playClickSound();
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newSt: SubTask = {
          id: `st-${Date.now()}`,
          title: stTitle.trim(),
          completed: false
        };
        return {
          ...t,
          subtasks: [...t.subtasks, newSt]
        };
      }
      return t;
    }));
  };

  const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
    playClickSound();
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: t.subtasks.filter(st => st.id !== subtaskId)
        };
      }
      return t;
    }));
  };

  // AI Task breakdown generation using robust rule-based parsing matching keywords
  const handleAIBreakdown = (taskId: string, tTitle: string) => {
    playClickSound();
    const titleLower = tTitle.toLowerCase();
    let generated: string[] = [];

    if (titleLower.includes('project') || titleLower.includes('avishkar') || titleLower.includes('submission') || titleLower.includes('code')) {
      generated = [
        'Outline database schema (tables/keys) & core service endpoints',
        'Build and test responsive tailwind component screens with local state',
        'Verify production compilation, write detailed readme and push to GitHub Pages'
      ];
    } else if (titleLower.includes('exam') || titleLower.includes('study') || titleLower.includes('revision') || titleLower.includes('test') || titleLower.includes('calculus') || titleLower.includes('physics')) {
      generated = [
        'Read key lecture formulas & compile a beautiful cheat sheet log',
        'Solve previous 3-year term papers with an active focus timer',
        'Explain tough core concepts out loud to a peer (Feynman technique)'
      ];
    } else if (titleLower.includes('gym') || titleLower.includes('workout') || titleLower.includes('exercise')) {
      generated = [
        'Structure target muscle groups & warmup routine',
        'Carry out core lift sets loading progressive overload',
        'Complete cooldown static stretches and hydrate with a clean snack'
      ];
    } else if (titleLower.includes('buy') || titleLower.includes('shop') || titleLower.includes('order')) {
      generated = [
        'Explore price differences relative to Amazon & offline tech vendors',
        'Skim high-rated reviews & read lower 1-star issues to check safety limits',
        'Validate payment discount channels & lock down purchase order'
      ];
    } else {
      generated = [
        `Identify first principles of "${tTitle}" and break down requirements`,
        `Complete main core action block focusing for 25 mins`,
        `Inspect final deliverables, clean up files, and document outcome`
      ];
    }

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const customSubtasks: SubTask[] = generated.map((tText, i) => ({
          id: `st-ai-${Date.now()}-${i}`,
          title: tText,
          completed: false
        }));
        return {
          ...t,
          subtasks: [...t.subtasks, ...customSubtasks]
        };
      }
      return t;
    }));
  };

  // Audio recording on Task notes
  const startRecording = async (taskId: string) => {
    playClickSound();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
              return {
                ...t,
                voiceMemo: base64String,
                voiceMemoDuration: recordingDuration
              };
            }
            return t;
          }));
        };
        
        // Stop stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      setActiveRecorderTaskId(taskId);
      setRecordingDuration(0);
      setIsRecording(true);
      mediaRecorder.start();

      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error setting up microphone stream:", err);
      alert("Please grant microphone permissions to use voice notes in student tasks.");
    }
  };

  const stopRecording = () => {
    playClickSound();
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    setActiveRecorderTaskId(null);
  };

  const deleteVoiceMemo = (taskId: string) => {
    playClickSound();
    setConfirmModal({
      isOpen: true,
      title: "Delete Voice Memo",
      message: "Are you sure you want to delete this audio study memo? This action is permanent.",
      onConfirm: () => {
        setTasks(prev => prev.map(t => {
          if (t.id === taskId) {
            const updated = { ...t };
            delete updated.voiceMemo;
            delete updated.voiceMemoDuration;
            return updated;
          }
          return t;
        }));
      }
    });
  };

  // Play audio notes back
  const playVoiceMemo = (base64Data: string) => {
    playClickSound();
    const audio = new Audio(base64Data);
    audio.play().catch(e => console.error("Playback failed", e));
  };

  // Dynamic AI Advisor on priorities
  const getAIAdvisorPrioritySuggestion = (): { task: TaskType | null, reason: string } => {
    const incompleteTasks = tasks.filter(t => !t.completed);
    if (incompleteTasks.length === 0) {
      return { task: null, reason: 'Amazing job! No pending tasks remaining on your desk!' };
    }

    // Sort by priority and deadlines
    const sorted = [...incompleteTasks].sort((a, b) => {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      const weightA = priorityWeights[a.priority];
      const weightB = priorityWeights[b.priority];
      
      // If priority is high, evaluate that first
      if (weightA !== weightB) {
        return weightB - weightA;
      }
      
      // Secondary sort: closest deadline
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    const target = sorted[0];
    let reason = "This has the highest emergency score based on your Avishkar timeline.";
    if (target.priority === 'high') {
      reason = "Flagged in RED high-priority! Address this immediately before other loose loops.";
    } else if (target.dueDate) {
      reason = `This deadline is upcoming soon (${target.dueDate}). Let us execute it first.`;
    }

    return { task: target, reason };
  };

  const adSuggestion = getAIAdvisorPrioritySuggestion();

  // Daily Progress Calculation
  const getDailyProgress = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const todayTasks = tasks.filter(t => t.dueDate === todayStr);
    const totalToday = todayTasks.length;
    const completedToday = todayTasks.filter(t => t.completed).length;
    const todayPercentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

    const totalOverall = tasks.length;
    const completedOverall = tasks.filter(t => t.completed).length;
    const overallPercentage = totalOverall > 0 ? Math.round((completedOverall / totalOverall) * 100) : 0;

    return {
      todayStr,
      todayTasks,
      totalToday,
      completedToday,
      todayPercentage,
      totalOverall,
      completedOverall,
      overallPercentage
    };
  };

  const dailyProgress = getDailyProgress();

  // Filter & Search Logic
  const filteredTasks = tasks.filter(t => {
    const textFields = `${t.title} ${t.notes || ''}`.toLowerCase();
    const matchesSearch = textFields.includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesPriority = activePriority === 'All' || t.priority === activePriority.toLowerCase();
    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="space-y-6" id="tasks-suite-workspace">

      {/* Triggered Custom Task Reminder/Notification Banner */}
      {activeFiredReminder && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-xl animate-bounce z-40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-rose-400">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-white/20 text-white mt-0.5 animate-pulse">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-100 flex items-center gap-1">
                ⏰ TASK REMINDER ALARM ACTIVE
              </span>
              <h4 className="text-md font-extrabold text-white mt-0.5">
                Remember: {activeFiredReminder.title}
              </h4>
              {activeFiredReminder.notes && (
                <p className="text-xs text-rose-100 mt-1 italic max-w-md line-clamp-1">
                  "{activeFiredReminder.notes}"
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => handleSnoozeReminder(activeFiredReminder.id)}
              className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Clock className="w-3.5 h-3.5" /> Snooze 5m
            </button>
            <button
              onClick={() => handleDismissReminder(activeFiredReminder.id)}
              className="px-3 py-1.5 rounded-lg bg-white text-rose-600 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5" /> Dismiss
            </button>
          </div>
        </div>
      )}
      
      {/* Voice Input Toast Status Indicator */}
      {voiceToast && (
        <div className="fixed top-4 right-4 bg-indigo-600 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-lg border border-indigo-400 glass-panel animate-bounce z-50 flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>{voiceToast}</span>
        </div>
      )}

      {/* Daily Progress Bar Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-sm space-y-3.5 relative overflow-hidden" id="daily-progress-bar-card">
        {dailyProgress.totalToday > 0 && dailyProgress.todayPercentage === 100 && (
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Today's Task Progress
                {dailyProgress.totalToday > 0 && dailyProgress.todayPercentage === 100 && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold animate-pulse">
                    <Sparkles className="w-3 h-3" /> All Done!
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {dailyProgress.totalToday > 0 
                  ? `You have completed ${dailyProgress.completedToday} of ${dailyProgress.totalToday} tasks scheduled for today`
                  : `No tasks scheduled for today (${dailyProgress.todayStr})`
                }
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 self-start sm:self-center">
            <span className="text-2xl font-extrabold font-mono tracking-tight text-indigo-600 dark:text-indigo-400">
              {dailyProgress.totalToday > 0 ? `${dailyProgress.todayPercentage}%` : `${dailyProgress.overallPercentage}%`}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {dailyProgress.totalToday > 0 ? "today's tasks" : "overall progress"}
            </span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-1.5">
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800/80">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                dailyProgress.totalToday > 0 && dailyProgress.todayPercentage === 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
              }`}
              style={{ width: `${dailyProgress.totalToday > 0 ? dailyProgress.todayPercentage : dailyProgress.overallPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-medium text-slate-400 dark:text-slate-500">
            {dailyProgress.totalToday > 0 ? (
              <>
                <span>0% Started</span>
                <span>{dailyProgress.completedToday}/{dailyProgress.totalToday} Tasks Completed</span>
                <span>100% Done</span>
              </>
            ) : (
              <>
                <span>No tasks scheduled today</span>
                <span>Overall: {dailyProgress.completedOverall}/{dailyProgress.totalOverall} Tasks Completed</span>
                <span>Try setting a task's due date to today!</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic AI Advisor Segment */}
      {adSuggestion.task && (
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-950 dark:text-indigo-200 glass-panel flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mt-0.5">
              <Sparkles className="w-5 h-5 animate-pulse text-indigo-500" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                AI SMART FOCUS RECOMMENDATION
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                Execute task: <span className="underline italic">"{adSuggestion.task.title}"</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {adSuggestion.reason}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => handleToggleCompleted(adSuggestion.task!.id, e)}
            className="self-end md:self-center px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" /> Mark Done
          </button>
        </div>
      )}

      {/* Workspace search header and Voice button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search student tasks, course chapters, or text logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 shadow-xs"
          />
          <button 
            type="button"
            onClick={handleVoiceSearch}
            title="Speech Dictate Search Query"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
          >
            <Mic className={`w-4 h-4 ${isSearchListening ? 'text-red-500 animate-pulse' : ''}`} />
          </button>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center gap-2">
          {/* Voice Input Trigger */}
          <button 
            onClick={handleVoiceInput}
            title="Create Task via Speech"
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition ${
              isListening 
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse' 
                : 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
            <span>Voice Command</span>
          </button>

          {/* Add Task Button */}
          <button 
            onClick={handleOpenNewForm}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white flex items-center gap-1 text-xs font-semibold uppercase tracking-wider shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

      </div>

      {/* Advanced Double Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white/40 dark:bg-slate-900/10 border border-slate-250/60 dark:border-slate-800/20 glass-panel shadow-xs">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5" id="category-pills">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">Categories:</span>
          {['All', 'Study', 'Work', 'Personal', 'Shopping'].map(cat => (
            <button
              key={cat}
              onClick={() => { playClickSound(); setActiveCategory(cat); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/15'
                  : 'bg-white/60 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 hover:bg-white/90 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Straight premium line between Category Pills and Priority Options on desktop */}
        <div className="hidden md:block w-[1.5px] h-6 bg-slate-200/80 dark:bg-slate-850 mx-2 self-center" />

        {/* Priority Filter */}
        <div className="flex items-center gap-2" id="priority-options">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Priority:</span>
          <div className="flex items-center bg-slate-50/50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200/40 dark:border-slate-850">
            {['All', 'High', 'Medium', 'Low'].map(prio => (
              <button
                key={prio}
                onClick={() => { playClickSound(); setActivePriority(prio); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activePriority === prio
                    ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'
                }`}
              >
                {prio}
              </button>
            ))}
          </div>
        </div>

        {/* Straight premium line between Priority Options and Calendar Trigger on desktop */}
        <div className="hidden md:block w-[1.5px] h-6 bg-slate-200/80 dark:bg-slate-850 mx-2 self-center" />

        {/* Completed Task Calendar Trigger Button */}
        <button
          onClick={() => { playClickSound(); setIsCalendarOpen(true); }}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-850/65 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs md:ml-0"
          id="completed-calendar-trigger"
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span>Completed History Calendar</span>
        </button>
      </div>

      {/* The Crux: Grid of Tasks */}
      <div className="grid grid-cols-1 gap-4" id="tasks-list-render">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-12 text-center text-slate-500 bg-white/20 dark:bg-slate-900/10 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl"
            >
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="font-semibold text-slate-700 dark:text-slate-300">No student tasks correspond to current filters.</div>
              <p className="text-xs text-slate-400 mt-1">Try relaxing filters, expanding the search text or creating fresh logs.</p>
            </motion.div>
          ) : (
            filteredTasks.map(t => {
              const hasDueDate = !!t.dueDate;
              // Let's formulate standard date/time tags
              const displayTime = t.dueTime || '11:59 PM';
              
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  key={t.id} 
                  className={`p-5 sleek-subcard shadow-2xs hover:shadow-xs flex flex-col justify-between transition-all duration-300 border ${
                    t.completed 
                      ? 'border-emerald-500/20 opacity-70 bg-emerald-50/5 dark:bg-emerald-950/5' 
                      : t.priority === 'high' 
                        ? 'border-rose-400/20 left-glow border-l-4 border-l-rose-500 bg-rose-50/10 dark:bg-rose-950/5' 
                        : t.priority === 'medium' 
                          ? 'border-amber-400/20 border-l-4 border-l-amber-500 bg-amber-50/10 dark:bg-amber-950/5' 
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20'
                  }`}
                >
                  {/* Header detail */}
                  <div className="flex items-start justify-between gap-4">
                    
                    {/* Title & checkbox */}
                    <div className="flex items-start gap-3 flex-1">
                      <button 
                        onClick={(e) => handleToggleCompleted(t.id, e)}
                        title={t.completed ? "Mark incomplete" : "Mark as complete"}
                        className="mt-1 flex-shrink-0 cursor-pointer text-indigo-600 focus:outline"
                      >
                        {t.completed ? (
                          <CheckSquare className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950/20" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 hover:text-indigo-500" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Title text */}
                          <h3 className={`font-semibold text-sm leading-tight text-slate-800 dark:text-slate-100 ${t.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                            {t.title}
                          </h3>
                          {/* Category badge */}
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                            {t.category}
                          </span>
                          
                          {/* Priority badge with rich indicator UI & micro-animation */}
                          {t.priority && (
                            <motion.span 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={`px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border shadow-2xs ${
                                t.priority === 'high'
                                  ? 'bg-rose-50 dark:bg-rose-950/45 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/40'
                                  : t.priority === 'medium'
                                    ? 'bg-amber-50 dark:bg-amber-950/45 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/40'
                                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-850'
                              }`}
                            >
                              {t.priority === 'high' ? (
                                <>
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                                  </span>
                                  🚨 High Priority
                                </>
                              ) : t.priority === 'medium' ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  ⚡ Medium
                                </>
                              ) : (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                  ☕ Low
                                </>
                              )}
                            </motion.span>
                          )}

                          {/* Recurring badge */}
                          {t.recurring !== 'none' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 flex items-center gap-0.5">
                              <RefreshCw className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '4s' }} /> {t.recurring}
                            </span>
                          )}
                          {/* Reminder badge */}
                          {t.reminder && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300 flex items-center gap-0.5" title="Reminder Enabled (1 hour before deadline)">
                              <Bell className="w-2.5 h-2.5" /> Alarm
                            </span>
                          )}
                        </div>
                        
                        {/* Notes Section with Voice Memo Recorder */}
                        {t.notes && (
                          <p className={`text-xs text-slate-500 dark:text-slate-400 mt-2 font-sans leading-relaxed whitespace-pre-wrap ${t.completed ? 'opacity-50' : ''}`}>
                            {t.notes}
                          </p>
                        )}

                        {/* Display study audio note if present */}
                        {t.voiceMemo && (
                          <div className="mt-3 flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/15 py-1.5 px-3 rounded-xl w-fit">
                            <button
                              onClick={() => playVoiceMemo(t.voiceMemo!)}
                              className="bg-indigo-600 text-white rounded-full p-1 hover:bg-indigo-500 transition shadow"
                              title="Play study voice note"
                            >
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </button>
                            <div className="text-left leading-none pr-3">
                              <div className="text-[10px] font-semibold text-indigo-800 dark:text-indigo-300">STUDY VOICE NOTE</div>
                              <div className="text-[9px] text-slate-500 dark:text-slate-400">{t.voiceMemoDuration}s duration</div>
                            </div>
                            <button
                              onClick={() => deleteVoiceMemo(t.id)}
                              className="text-rose-500 hover:text-rose-700 font-bold text-xs"
                              title="Delete Memo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Live Web Record triggers */}
                        {!t.voiceMemo && !t.completed && (
                          <div className="mt-3 flex items-center gap-1.5">
                            {isRecording && activeRecorderTaskId === t.id ? (
                              <button
                                onClick={stopRecording}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1 animate-pulse"
                              >
                                <MicOff className="w-3 h-3" /> STOP {recordingDuration}s
                              </button>
                            ) : (
                              <button
                                onClick={() => startRecording(t.id)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-[10px] font-bold flex items-center gap-1 transition"
                                title="Record and attach live study memo voice notes to this task"
                              >
                                <Mic className="w-3 h-3 text-indigo-500" /> RECORD VOICE MEMO
                              </button>
                            )}
                          </div>
                        )}

                      </div>
                    </div>

                    {/* Actions (Edit and Delete) */}
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEditClick(t)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300 transition"
                        title="Edit task log"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(t.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/20 text-rose-500 transition"
                        title="Delete task log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                  {/* Subtask Section */}
                  <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/40">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] font-mono tracking-wider uppercase text-slate-400 flex items-center gap-1">
                        <Layers className="w-3 h-3" /> CORE SUB-TASKS ({t.subtasks.filter(s => s.completed).length}/{t.subtasks.length})
                      </div>

                      {/* AI smart breakdown generator shortcut */}
                      {!t.completed && (
                        <button
                          onClick={() => handleAIBreakdown(t.id, t.title)}
                          className="text-[9px] font-bold text-orange-600 hover:text-orange-950 dark:text-orange-400 dark:hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-2 py-0.5 rounded-md flex items-center gap-1 transition border border-orange-500/20 cursor-pointer"
                          title="AI Task Breakdown: generates 3 structured homework sub-tasks using smart mapping."
                        >
                          <Sparkles className="w-2.5 h-2.5 animate-pulse text-orange-500" />
                          <span>AI Break Task</span>
                        </button>
                      )}
                    </div>

                    {/* Preloaded list */}
                    {t.subtasks.length > 0 && (
                      <div className="space-y-1.5 pl-5 mb-3" id={`subtasks-list-${t.id}`}>
                        {t.subtasks.map(st => (
                          <div key={st.id} className="flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300 group/subtask">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleToggleSubtask(t.id, st.id, e)}
                                className="cursor-pointer text-indigo-500 flex-shrink-0"
                              >
                                {st.completed ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950/10" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400" />
                                )}
                              </button>
                              <span className={st.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                                {st.title}
                              </span>
                            </div>

                            {/* Subtask Delete Option */}
                            <button
                              type="button"
                              onClick={() => handleDeleteSubtask(t.id, st.id)}
                              className="opacity-0 group-hover/subtask:opacity-100 text-slate-400 hover:text-rose-500 p-1 rounded transition duration-200 cursor-pointer ml-auto"
                              title="Delete sub-task"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Add manual subtasks */}
                  {!t.completed && (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const input = form.elements.namedItem('subtaskText') as HTMLInputElement;
                        handleAddCustomSubtask(t.id, input.value);
                        input.value = '';
                      }}
                      className="flex items-center gap-1.5 pl-5"
                    >
                      <input 
                        type="text" 
                        name="subtaskText"
                        placeholder="Add sub-task chapter or deliverable..."
                        className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:outline-none text-[11px] text-slate-700 dark:text-slate-300 py-0.5"
                      />
                      <button 
                        type="submit"
                        className="text-slate-400 hover:text-indigo-500 transition"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </div>

                {/* Footer and Deadline Tracker */}
                {hasDueDate && (
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/10 pt-2">
                    <span className="flex items-center gap-1 font-medium font-mono text-indigo-600 dark:text-indigo-400">
                      <Calendar className="w-3 h-3" /> Due {t.dueDate}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {displayTime}
                    </span>
                  </div>
                )}

                {/* Custom Alarm / Remember Scheduler */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/20 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Bell className={`w-3.5 h-3.5 ${t.reminderTime ? 'text-indigo-600 dark:text-indigo-400 animate-pulse' : 'text-slate-400'}`} />
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Remember Notification:</span>
                    {t.reminderTime ? (
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded text-[10px]">
                        {new Date(t.reminderTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">Not configured</span>
                    )}
                  </div>

                  {schedulingTaskId === t.id ? (
                    <div className="flex items-center gap-1.5 w-full sm:w-auto mt-1 sm:mt-0 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                      <input 
                        type="datetime-local"
                        value={customReminderTime}
                        onChange={(e) => setCustomReminderTime(e.target.value)}
                        className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        id={`datetime-picker-${t.id}`}
                      />
                      <button
                        onClick={() => handleSaveReminder(t.id)}
                        className="px-2.5 py-1 text-[10px] font-bold bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setSchedulingTaskId(null)}
                        className="px-1.5 py-1 text-[10px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          playClickSound();
                          setSchedulingTaskId(t.id);
                          const now = new Date();
                          now.setMinutes(now.getMinutes() + 5); // Default to 5 minutes from now
                          const tzOffset = now.getTimezoneOffset() * 60000;
                          const defaultTime = t.reminderTime || (new Date(now.getTime() - tzOffset)).toISOString().slice(0, 16);
                          setCustomReminderTime(defaultTime);
                        }}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        {t.reminderTime ? 'Choose Time' : 'Set Remember'}
                      </button>
                      {t.reminderTime && (
                        <button
                          onClick={() => handleRemoveReminder(t.id)}
                          className="text-[11px] font-bold text-rose-500 hover:text-rose-700 ml-1 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </motion.div>
            );
          })
        )}
        </AnimatePresence>
      </div>

      {/* MODAL DRAWER FORM FOR ADD & EDIT */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/70 glass-panel-heavy z-40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative">
            <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white mb-4">
              {editingTask ? 'Edit Lecture Task Log' : 'Launch New Student Task'}
            </h2>

            <form onSubmit={handleSaveTask} className="space-y-4">
              
              {/* Title input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  TASK NAME / STUDY TOPIC
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                  placeholder="e.g. Finish mini-project proposal or mathematics flashcards"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline text-sm text-slate-800 dark:text-slate-150"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  EXTENDED FIELD NOTES & SYLLABUS NOTES
                </label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.currentTarget.value)}
                  placeholder="Review definite integrals formulas, check syllabus page 22..."
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline text-sm text-slate-800 dark:text-slate-150"
                />
              </div>

              {/* Priority & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Priority Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                    PRIORITY LEVEL
                  </label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:border-indigo-500 focus:outline text-slate-700 dark:text-slate-100"
                  >
                    <option value="high">🚨 High Priority (Red badge)</option>
                    <option value="medium">⚡ Medium Priority (Yellow badge)</option>
                    <option value="low">☕ Low Priority (Gray badge)</option>
                  </select>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                    CATEGORY PILL
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:border-indigo-500 focus:outline text-slate-700 dark:text-slate-100"
                  >
                    <option value="Study">📚 Study / Coursework</option>
                    <option value="Work">💼 Work / Placement</option>
                    <option value="Personal">🌱 Personal / Fitness</option>
                    <option value="Shopping">🛍️ Shopping / Tech-Kits</option>
                  </select>
                </div>

              </div>

              {/* Due Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Due Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-500" /> DUE DATE
                  </label>
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:border-indigo-500 focus:outline text-slate-700 dark:text-slate-105"
                  />
                </div>

                {/* Due Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-500" /> DUE TIME
                  </label>
                  <input 
                    type="time" 
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:border-indigo-500 focus:outline text-slate-700 dark:text-slate-105"
                  />
                </div>

              </div>

              {/* Advanced controls: Recurrence & Alarm Settings */}
              <div className="p-3 bg-indigo-500/5 dark:bg-slate-800/40 rounded-xl border border-slate-200/55 dark:border-slate-700/55 space-y-3">
                <span className="text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                  Advanced Study Reminders
                </span>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Recurrence selection */}
                  <div className="flex items-center gap-1.5">
                    <select
                      value={recurring}
                      onChange={(e: any) => setRecurring(e.target.value)}
                      className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-100"
                    >
                      <option value="none">No Repeat</option>
                      <option value="daily">Daily Exercise</option>
                      <option value="weekly">Weekly Assignments</option>
                    </select>
                  </div>

                  {/* Smart Reminder alarm */}
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400">
                    <input 
                      type="checkbox" 
                      checked={reminder}
                      onChange={(e) => setReminder(e.target.checked)}
                      className="rounded text-indigo-600 accent-indigo-500 bg-white"
                    />
                    <span>Task Remember</span>
                  </label>
                </div>
              </div>

              {/* Action Save/Cancel buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => { playClickSound(); setIsFormOpen(false); }}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95 transition"
                >
                  Save Task
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

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

      {/* Completed Tasks History Calendar Modal */}
      <CompletedCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        tasks={tasks}
        onToggleTaskCompletion={handleToggleCompleted}
        playClickSound={playClickSound}
      />

      {/* Satisfying Confetti & Ripple Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {/* Ripples */}
        {ripples.map(r => (
          <div
            key={r.id}
            className="absolute rounded-full border-4 border-emerald-400 dark:border-emerald-300 animate-ping opacity-75"
            style={{
              left: r.x - 32,
              top: r.y - 32,
              width: 64,
              height: 64,
              animationDuration: '0.8s',
            }}
          />
        ))}
        {/* Confetti Particles */}
        {confetti.map(p => (
          <div
            key={p.id}
            className="absolute transition-transform duration-75"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              transform: `rotate(${p.rotation}deg)`,
              borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'triangle' ? '0%' : '2px',
              clipPath: p.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
              opacity: Math.max(0, 1 - (Date.now() - p.id) / 1200),
            }}
          />
        ))}

        {/* Flying Checkmarks & Celebrations */}
        <AnimatePresence>
          {flyingCheckmarks.map(fc => (
            <motion.div
              key={fc.id}
              initial={{ 
                opacity: 0, 
                scale: fc.scaleFrom, 
                x: fc.x - 12, 
                y: fc.y - 12 
              }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                scale: [fc.scaleFrom, fc.scaleTo, fc.scaleTo * 1.1, fc.scaleTo * 0.8],
                x: fc.x - 12 + fc.xOffset, 
                y: fc.y - 12 - fc.yOffset,
                rotate: [0, fc.angle * 0.5, fc.angle]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: fc.duration, 
                ease: "easeOut",
                times: [0, 0.15, 0.85, 1],
                delay: fc.delay
              }}
              className="absolute pointer-events-none select-none z-50 flex flex-col items-center justify-center font-bold drop-shadow-lg"
              style={{
                color: fc.color,
                textShadow: '0 0 8px rgba(255,255,255,0.9), 0 0 15px rgba(99,102,241,0.5)',
              }}
            >
              {fc.label === 'check' ? (
                <div className="p-2 bg-emerald-500 text-white rounded-full shadow-lg border-2 border-white flex items-center justify-center">
                  <Check className="w-5 h-5 stroke-[4px]" />
                </div>
              ) : (
                <span className="text-xl md:text-2xl filter drop-shadow">{fc.label}</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
