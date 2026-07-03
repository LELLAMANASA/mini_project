import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Clock, 
  Compass, 
  Zap,
  Coffee,
  Award
} from 'lucide-react';
import { playBellChime, playClickSound, playSuccessChime, playCountdownBeep } from '../utils/audio';

interface PomodoroProps {
  onRewardXP: (xp: number, message: string) => void;
}

export default function Pomodoro({ onRewardXP }: PomodoroProps) {
  // Configurable Session Durations
  const [focusLength, setFocusLength] = useState(25); // minutes
  const [breakLength, setBreakLength] = useState(5);   // minutes
  
  // Timer States
  const [isFocusSession, setIsFocusSession] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Audio chime settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize timer to focus/break length on setting shifts
  useEffect(() => {
    if (!isPlaying) {
      setSecondsRemaining((isFocusSession ? focusLength : breakLength) * 60);
    }
  }, [focusLength, breakLength, isFocusSession]);

  // Main countdown effect loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying]);

  // Handle session completion side effects cleanly in a separate effect
  useEffect(() => {
    if (secondsRemaining <= 0 && isPlaying) {
      setIsPlaying(false);
      
      // Finish session! trigger alarms
      if (soundEnabled) {
        playBellChime(); // Play synthesized bell
      }

      // Reward XP if focus session finished!
      if (isFocusSession) {
        playSuccessChime();
        onRewardXP(100, `Completed a deep study focus block of ${focusLength} minutes! Excellent work 🧠`);
      } else {
        onRewardXP(15, `Finished break! Hydrated and ready to continue.`);
      }

      // Toggle mode
      const nextMode = !isFocusSession;
      setIsFocusSession(nextMode);
      setSecondsRemaining((nextMode ? focusLength : breakLength) * 60);
    }
  }, [secondsRemaining, isPlaying, isFocusSession, focusLength, breakLength, soundEnabled, onRewardXP]);

  // Play a countdown beep when in the last 5 seconds (5, 4, 3, 2, 1)
  useEffect(() => {
    if (isPlaying && secondsRemaining > 0 && secondsRemaining <= 5 && soundEnabled) {
      playCountdownBeep();
    }
  }, [secondsRemaining, isPlaying, soundEnabled]);

  // Actions
  const handleTogglePlay = () => {
    playClickSound();
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    playClickSound();
    setIsPlaying(false);
    setIsFocusSession(true);
    setSecondsRemaining(focusLength * 60);
  };

  const handleModeToggle = (isFocus: boolean) => {
    playClickSound();
    setIsPlaying(false);
    setIsFocusSession(isFocus);
    setSecondsRemaining((isFocus ? focusLength : breakLength) * 60);
  };

  // Duration modifications
  const adjustFocus = (mins: number) => {
    playClickSound();
    setFocusLength(mins);
    if (isFocusSession && !isPlaying) {
      setSecondsRemaining(mins * 60);
    }
  };

  const adjustBreak = (mins: number) => {
    playClickSound();
    setBreakLength(mins);
    if (!isFocusSession && !isPlaying) {
      setSecondsRemaining(mins * 60);
    }
  };

  // Display timers format
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalDuration = (isFocusSession ? focusLength : breakLength) * 60;
  const progressRatio = secondsRemaining / totalDuration;

  // Standard supportive notes
  const focusPills = [
    "Disable notification alerts. Deep focus active.",
    "Breathe deep. Keep your spine erect.",
    "One small calculus derivative at a time.",
    "Mistakes are signs you are expanding."
  ];

  const breakPills = [
    "Stand up, stretch your arms, look outside.",
    "Drink a cool glass of water.",
    "Rest your eyes. Avoid looking at screens.",
    "Sip some tea. Ready to excel soon."
  ];

  const activePill = isFocusSession 
    ? focusPills[Math.floor((secondsRemaining / 60) % focusPills.length)] 
    : breakPills[Math.floor((secondsRemaining / 60) % breakPills.length)];

  return (
    <div className="space-y-6" id="pomodoro-clock-tab">
      
      {/* Grid: Timer on left, Settings on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* The Circular Countdown Clock Panel */}
        <div className="md:col-span-7 flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          
          {/* Mode Switcher Buttons */}
          <div className="flex gap-2 mb-6 bg-slate-105 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
            <button
              onClick={() => handleModeToggle(true)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1 ${
                isFocusSession
                  ? 'bg-gradient-to-r from-indigo-650 to-indigo-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Study Focus
            </button>
            <button
              onClick={() => handleModeToggle(false)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1 ${
                !isFocusSession
                  ? 'bg-gradient-to-r from-teal-505 to-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" /> Breath Break
            </button>
          </div>

          {/* Interactive Clock Circle */}
          <div className="relative flex items-center justify-center my-6">
            <svg className="w-60 h-60 transform -rotate-90">
              {/* Outer stroke */}
              <circle
                cx="120"
                cy="120"
                r="105"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="11"
                fill="transparent"
              />
              {/* Dynamic Inner stroke */}
              <circle
                cx="120"
                cy="120"
                r="105"
                strokeWidth="11"
                fill="transparent"
                className={`transition-all duration-300 ease-out ${
                  isFocusSession 
                    ? 'stroke-indigo-600' 
                    : 'stroke-teal-500'
                }`}
                strokeDasharray={2 * Math.PI * 105}
                strokeDashoffset={2 * Math.PI * 105 * (1 - progressRatio)}
                strokeLinecap="round"
              />
            </svg>

            {/* Absolute Timer Text */}
            <div className="absolute text-center">
              <span className="text-4xl md:text-5xl font-black font-mono tracking-tight text-slate-800 dark:text-white leading-none">
                {formatTime(secondsRemaining)}
              </span>
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mt-2">
                {isFocusSession ? 'Deep Focus Session' : 'Relaxing Break'}
              </p>
            </div>
          </div>

          {/* Mindful prompts */}
          <div className="p-3 bg-slate-500/5 dark:bg-slate-900/20 rounded-xl max-w-sm mb-6 border border-slate-200/20 text-xs italic text-slate-500 dark:text-slate-400">
            "{activePill}"
          </div>

          {/* Control Trigger buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              title="Reset timer clock"
              className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 transition"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleTogglePlay}
              className={`px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider text-white transition-all transform hover:scale-105 shadow-md flex items-center gap-2 ${
                isPlaying
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-rose-500/25'
                  : isFocusSession
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-indigo-600/25'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-500 shadow-teal-500/25'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Blocks</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Activate</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                playClickSound();
                setSoundEnabled(!soundEnabled);
              }}
              title={soundEnabled ? "Mute Bell Alarm" : "Enable Bell Alarm"}
              className={`p-3 rounded-full transition ${
                soundEnabled
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Configurations segment: Right Column */}
        <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
          
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white mb-2 flex items-center gap-1.5">
              <Clock className="w-5 h-5 text-indigo-500" /> Study Length Setup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Tailor Focus periods and Break splits to suit your active attention level.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 font-mono uppercase tracking-wider">
                  Select Focus Length
                </label>
                <div className="grid grid-cols-4 gap-1.5" id="focus-presets">
                  {[15, 25, 45, 60].map(mins => (
                    <button
                      key={mins}
                      onClick={() => adjustFocus(mins)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold font-mono transition ${
                        focusLength === mins
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 font-mono uppercase tracking-wider">
                  Select Break Length
                </label>
                <div className="grid grid-cols-4 gap-1.5" id="break-presets">
                  {[3, 5, 15, 20].map(mins => (
                    <button
                      key={mins}
                      onClick={() => adjustBreak(mins)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold font-mono transition ${
                        breakLength === mins
                          ? 'bg-emerald-650 bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reward micro status */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                Focus Session Rewards
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                Completing a deep study session grants you <strong>+100 XP</strong> to boost your StudySphere student rank level!
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
