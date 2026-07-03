import React, { useState } from 'react';
import { 
  Award, 
  Flame, 
  Zap, 
  BookOpen, 
  UserCheck, 
  Sparkles, 
  Calculator, 
  History, 
  Check, 
  Lock, 
  Unlock, 
  Calendar, 
  Snowflake, 
  Heart, 
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  User as UserIcon,
  Cpu
} from 'lucide-react';
import { UserProfile, TaskType, AssignmentType, AttendanceType, HabitType, NoteType } from '../types';
import { playClickSound, playSuccessChime } from '../utils/audio';

interface ProfileViewProps {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  tasks: TaskType[];
  assignments: AssignmentType[];
  attendance: AttendanceType[];
  habits: HabitType[];
  streak: number;
  setStreak: React.Dispatch<React.SetStateAction<number>>;
  highestStreak: number;
  setHighestStreak: React.Dispatch<React.SetStateAction<number>>;
  streakFreezeActive: boolean;
  setStreakFreezeActive: React.Dispatch<React.SetStateAction<boolean>>;
  theme: string;
  onRewardXP: (xp: number, message: string) => void;
}

export default function ProfileView({
  user,
  setUser,
  xp,
  setXp,
  level,
  setLevel,
  tasks,
  assignments,
  attendance,
  habits,
  streak,
  setStreak,
  highestStreak,
  setHighestStreak,
  streakFreezeActive,
  setStreakFreezeActive,
  theme,
  onRewardXP
}: ProfileViewProps) {
  // Calculator Tab
  const [calcTargetLevel, setCalcTargetLevel] = useState<number>(5);
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);
  const [streakActionLog, setStreakActionLog] = useState<string[]>([]);
  const [pinnedBadges, setPinnedBadges] = useState<string[]>(['badge-streak']);

  // Editing Profile details states
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editCollege, setEditCollege] = useState(user?.college || '');
  const [editBranch, setEditBranch] = useState(user?.branch || '');
  const [editSemester, setEditSemester] = useState(user?.semester || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editGoal, setEditGoal] = useState(user?.dailyStudyGoal || 5);
  const [editPic, setEditPic] = useState(user?.profilePic || '');

  const startEditing = () => {
    playClickSound();
    if (user) {
      setEditName(user.name);
      setEditCollege(user.college || '');
      setEditBranch(user.branch || '');
      setEditSemester(user.semester || '');
      setEditEmail(user.email || '');
      setEditGoal(user.dailyStudyGoal || 5);
      setEditPic(user.profilePic || '');
    }
    setIsEditingDetails(true);
  };

  const saveDetails = () => {
    playClickSound();
    if (user) {
      const updatedUser = {
        ...user,
        name: editName,
        college: editCollege,
        branch: editBranch,
        semester: editSemester,
        email: editEmail,
        dailyStudyGoal: editGoal,
        profilePic: editPic
      };
      setUser(updatedUser);
      localStorage.setItem('studysphere_user', JSON.stringify(updatedUser));
      setIsEditingDetails(false);
      onRewardXP(10, 'Profile details updated!');
    }
  };

  // Math Scaling formula: XP needed for Level L is L * 100
  const getXPForLevel = (lvl: number) => lvl * 100;
  const currentXPThreshold = getXPForLevel(level);
  const currentLevelProgressPercent = Math.min(100, Math.round((xp / currentXPThreshold) * 100));

  // XP scaling scaling calculation for targets
  const getCumulativeXPForLevel = (targetLvl: number) => {
    let total = 0;
    for (let i = 1; i < targetLvl; i++) {
      total += getXPForLevel(i);
    }
    return total;
  };

  const xpNeededForTarget = Math.max(0, getCumulativeXPForLevel(calcTargetLevel) - getCumulativeXPForLevel(level) + (xp % currentXPThreshold));

  // Starter Badges List linked to dynamic progress
  const completedAssignmentsCount = assignments.filter(a => a.status === 'Completed' || a.status === 'Submitted').length;
  const deepWorkerStatus = localStorage.getItem('studysphere_pomodoros_completed') ? parseInt(localStorage.getItem('studysphere_pomodoros_completed') || '0') : 1; // Default 1 to guarantee showcase
  const hasPerfectAttendance = attendance.some(a => a.total > 0 && Math.round((a.present / a.total) * 100) >= 100);

  const badges = [
    {
      id: 'badge-syllabus',
      name: 'Syllabus Slayer',
      criteria: 'Finish 3 assignments or study plans.',
      target: 3,
      current: completedAssignmentsCount,
      unlocked: completedAssignmentsCount >= 3,
      icon: BookOpen,
      color: 'from-amber-500 to-orange-600',
      concept: 'A golden tome surrounded by crossing broadswords'
    },
    {
      id: 'badge-pomodoro',
      name: 'Deep Worker',
      criteria: 'Complete a focused study session.',
      target: 1,
      current: deepWorkerStatus,
      unlocked: deepWorkerStatus >= 1,
      icon: Zap,
      color: 'from-cyan-500 to-indigo-600',
      concept: 'An electrified lightning bolt inside an hourglass'
    },
    {
      id: 'badge-streak',
      name: 'Hyper-Focused',
      criteria: 'Achieve a 5-day activity streak.',
      target: 5,
      current: streak,
      unlocked: streak >= 5,
      icon: Flame,
      color: 'from-rose-500 to-red-600',
      concept: 'An azure-tinted superheated flame of relentless action'
    },
    {
      id: 'badge-attendance',
      name: 'Organized Scholar',
      criteria: 'Maintain 100% attendance in any subject.',
      target: 1,
      current: hasPerfectAttendance ? 1 : 0,
      unlocked: hasPerfectAttendance,
      icon: UserCheck,
      color: 'from-emerald-500 to-teal-600',
      concept: 'A shining shield decorated with a green checkmark laurel'
    },
    {
      id: 'badge-level',
      name: 'Apex Student',
      criteria: 'Reach Level 5.',
      target: 5,
      current: level,
      unlocked: level >= 5,
      icon: Award,
      color: 'from-fuchsia-500 to-pink-600',
      concept: 'A sparkling diamond crown centered on a platinum shield'
    }
  ];

  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  // Streak flame design colors based on streak milestones
  const getFlameStyles = (currentStreak: number) => {
    if (currentStreak >= 8) {
      return {
        bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400',
        icon: 'text-cyan-500 fill-cyan-500 animate-pulse drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]',
        label: 'Cosmic Aqua Flame (>7 Days)',
        desc: 'Relentless speed. Your flame emits superheated cosmic energy!'
      };
    } else if (currentStreak >= 4) {
      return {
        bg: 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400',
        icon: 'text-fuchsia-500 fill-fuchsia-500 animate-bounce drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]',
        label: 'Hyper Fusion Flame (4-7 Days)',
        desc: 'Relentless discipline. You are entering a state of absolute flow!'
      };
    } else {
      return {
        bg: 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400',
        icon: 'text-orange-500 fill-orange-500 animate-pulse',
        label: 'Sparks Flame (1-3 Days)',
        desc: 'Steady progress. Complete tasks daily to fuel your flame!'
      };
    }
  };

  const flame = getFlameStyles(streak);

  // Player Rank title calculation
  const getPlayerTitle = (lvl: number) => {
    if (lvl >= 10) return 'Academic Overlord';
    if (lvl >= 7) return 'Eldritch Researcher';
    if (lvl >= 5) return 'Study Archmage';
    if (lvl >= 3) return 'Discipline Sage';
    if (lvl >= 2) return 'Deep Work Apprentice';
    return 'Syllabus Novice';
  };

  // Toggle Freeze Protection
  const handleToggleFreeze = () => {
    playClickSound();
    if (!streakFreezeActive) {
      if (xp < 50) {
        alert('Insufficient XP! Activating Streak Freeze requires 50 XP.');
        return;
      }
      setXp(prev => prev - 50);
      setStreakFreezeActive(true);
      setStreakActionLog(prev => [
        `[${new Date().toLocaleTimeString()}] Activated Streak Freeze Protection (-50 XP)`,
        ...prev
      ]);
      onRewardXP(0, 'Streak protection active!');
    } else {
      setStreakFreezeActive(false);
      setStreakActionLog(prev => [
        `[${new Date().toLocaleTimeString()}] Deactivated Streak Freeze Protection (XP not refunded)`,
        ...prev
      ]);
    }
  };

  // Manual Check-in simulation for streak
  const handleSimulateCheckin = () => {
    playClickSound();
    const nextStr = streak + 1;
    setStreak(nextStr);
    if (nextStr > highestStreak) {
      setHighestStreak(nextStr);
    }
    playSuccessChime();
    setStreakActionLog(prev => [
      `[${new Date().toLocaleTimeString()}] Logged daily academic activity check-in. Streak up to ${nextStr}!`,
      ...prev
    ]);
    onRewardXP(15, 'Daily check-in streak reward!');
  };

  const handleResetStreak = () => {
    playClickSound();
    if (streakFreezeActive) {
      alert('Streak Freeze protected you! Your streak was not lost even though you missed a simulated day.');
      setStreakFreezeActive(false);
      setStreakActionLog(prev => [
        `[${new Date().toLocaleTimeString()}] Missed check-in! Streak Freeze was CONSUMED to protect your ${streak}-day streak!`,
        ...prev
      ]);
    } else {
      setStreak(0);
      setStreakActionLog(prev => [
        `[${new Date().toLocaleTimeString()}] Missed check-in! Streak reset to 0 (No Freeze Protection was active).`,
        ...prev
      ]);
      alert('Missed activity! Streak reset to 0. Purchase a Streak Freeze to safeguard next time.');
    }
  };

  const handleTogglePin = (badgeId: string) => {
    playClickSound();
    setPinnedBadges(prev => {
      if (prev.includes(badgeId)) {
        return prev.filter(id => id !== badgeId);
      } else {
        if (prev.length >= 3) {
          alert('You can pin a maximum of 3 badges to your Gamer Card showcase!');
          return prev;
        }
        return [...prev, badgeId];
      }
    });
  };

  return (
    <div className="space-y-6" id="gamification-profile-workspace">
      
      {/* Upper Grid: Gamer Card & Streaks Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gamer Card Widget (7 columns) */}
        <div className="lg:col-span-7 rounded-[2rem] border border-indigo-500/15 bg-white dark:bg-slate-900/60 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          
          {/* Subtle cosmic background grids */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 dark:bg-amber-400/5 rounded-full blur-3xl -ml-8 -mb-8 pointer-events-none"></div>

          <div>
            {/* User Profile Header details */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <img 
                    src={user?.profilePic || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60"} 
                    alt="Gamer Avatar" 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-md shadow-indigo-500/10 transition group-hover:opacity-75"
                    referrerPolicy="no-referrer"
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <span className="text-[9px] font-black uppercase text-white tracking-wider text-center px-1">
                      Edit
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string' && user) {
                              playSuccessChime();
                              setUser({
                                ...user,
                                profilePic: reader.result
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-indigo-600 text-white text-[9px] font-mono font-black border border-white dark:border-slate-900">
                    Lvl {level}
                  </span>
                </div>
                {!isEditingDetails ? (
                  <div className="text-left">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-[8px] font-black uppercase font-mono tracking-wider">
                      {getPlayerTitle(level)}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-display mt-1 leading-none">
                      {user?.name || 'Guest Student'}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-mono mt-1.5">
                      {user?.college || 'StudySphere Academy'} • {user?.branch || 'General Studies'}
                    </p>
                    {user?.semester && (
                      <p className="text-[9px] text-indigo-500 dark:text-indigo-400 font-mono mt-0.5">
                        {user.semester} • Daily Goal: {user.dailyStudyGoal || 5}h
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="text-right flex flex-col items-end justify-between min-h-[64px]">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Total XP Score</span>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono leading-none mt-1">
                    {xp} <span className="text-xs text-slate-400 font-bold">XP</span>
                  </div>
                </div>
                {!isEditingDetails && (
                  <button
                    onClick={startEditing}
                    className="mt-2.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-[10px] font-bold border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                    <span>Edit Details</span>
                  </button>
                )}
              </div>
            </div>

            {/* EDITING FORM SECTION */}
            {isEditingDetails && (
              <div className="mt-5 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800 text-left space-y-3.5 animate-fade-in">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-indigo-500 font-mono">Update Student Profile</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 font-mono">Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 font-mono">Email</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 font-mono">College / University</label>
                    <input
                      type="text"
                      value={editCollege}
                      onChange={(e) => setEditCollege(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 font-mono">Branch / Major</label>
                    <input
                      type="text"
                      value={editBranch}
                      onChange={(e) => setEditBranch(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 font-mono">Semester</label>
                    <input
                      type="text"
                      value={editSemester}
                      onChange={(e) => setEditSemester(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 font-mono">Daily Study Goal (Hours)</label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={editGoal}
                      onChange={(e) => setEditGoal(parseInt(e.target.value) || 5)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[8px] font-black uppercase text-slate-400 font-mono">Profile Picture</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={editPic}
                        onChange={(e) => setEditPic(e.target.value)}
                        placeholder="Paste image URL or upload photo"
                        className="flex-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                      <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0">
                        <span>Choose Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  setEditPic(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsEditingDetails(false);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-[10px] font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveDetails}
                    className="px-4 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold transition shadow-sm cursor-pointer"
                  >
                    Save Details
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Interactive XP Progress Bar */}
            <div className="mt-8 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-slate-400 font-mono uppercase">Level {level} Progress</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                  {xp % 100} / {currentXPThreshold} XP ({currentLevelProgressPercent}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800/20 p-[1.5px]">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${currentLevelProgressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[8px] text-slate-400 font-mono">
                <span>0 XP</span>
                <span className="text-slate-300 dark:text-slate-700">Formula: Level × 100 XP Needed</span>
                <span>{currentXPThreshold} XP</span>
              </div>
            </div>
          </div>

          {/* Unlocked Badges Mini Showcase Embedded */}
          <div className="mt-6 pt-4 border-t border-slate-150 dark:border-slate-800/60">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2.5 text-left">
              Pinned Showcase Badges ({pinnedBadges.length}/3)
            </h3>
            <div className="flex gap-2.5">
              {badges.filter(b => pinnedBadges.includes(b.id)).map(badge => {
                const IconComp = badge.icon;
                return (
                  <div 
                    key={badge.id}
                    title={`${badge.name}: ${badge.criteria}`}
                    className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border transition ${
                      badge.unlocked 
                        ? 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200' 
                        : 'bg-slate-50/20 dark:bg-slate-950/20 border-dashed border-slate-200 dark:border-slate-850 opacity-40 text-slate-400'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${badge.unlocked ? badge.color : 'from-slate-400 to-slate-500'} text-white shrink-0`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left leading-none min-w-0">
                      <div className="text-[10px] font-extrabold truncate">{badge.name}</div>
                      <div className="text-[8px] text-slate-400 mt-0.5 truncate">{badge.unlocked ? 'Unlocked ✓' : 'Locked'}</div>
                    </div>
                  </div>
                );
              })}
              {pinnedBadges.length === 0 && (
                <div className="w-full text-center py-2 text-[10px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800/50 rounded-xl">
                  No pinned showcase badges. Pin some from the badge vault below!
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Study Streaks Protection Control Widget (5 columns) */}
        <div className="lg:col-span-5 rounded-[2rem] border border-indigo-500/15 bg-white dark:bg-slate-900/60 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 text-left">Streak Vault</h3>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider font-mono ${flame.bg}`}>
                {flame.label}
              </span>
            </div>

            {/* Glowing Flame and Streak Number */}
            <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850">
              <div className="relative">
                <Flame className={`w-12 h-12 ${flame.icon}`} />
                {streakFreezeActive && (
                  <div className="absolute -top-1 -right-1 bg-cyan-500 text-white rounded-full p-1 border border-white dark:border-slate-900 animate-pulse" title="Streak Freeze Active">
                    <Snowflake className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="text-3xl font-black font-mono text-slate-800 dark:text-slate-100 leading-none">
                  {streak} <span className="text-xs text-slate-400 font-bold">Days</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  Personal Best: {highestStreak} Days Record
                </p>
                <p className="text-[9px] text-indigo-500 dark:text-indigo-400 mt-1.5 leading-snug font-sans">
                  {flame.desc}
                </p>
              </div>
            </div>

            {/* Streak Freeze purchasing / toggle */}
            <div className="p-3.5 rounded-xl border border-cyan-500/15 bg-gradient-to-r from-cyan-500/5 to-transparent text-left space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-extrabold text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                    <Snowflake className="w-3.5 h-3.5 text-cyan-500" />
                    Streak Freeze Shield
                  </div>
                  <p className="text-[8px] text-slate-400 leading-normal">
                    Missing 1 study check-in won't break your hard-earned streak. Costs 50 XP to acquire protection.
                  </p>
                </div>
                <button
                  onClick={handleToggleFreeze}
                  className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold font-mono transition shrink-0 ${
                    streakFreezeActive
                      ? 'bg-rose-500/15 text-rose-600 hover:bg-rose-500/20'
                      : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-sm shadow-cyan-500/20'
                  }`}
                >
                  {streakFreezeActive ? 'Deactivate' : 'Buy (50 XP)'}
                </button>
              </div>
              <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 font-mono">
                <span>Shield Protection status:</span>
                <span className={streakFreezeActive ? 'text-cyan-500 animate-pulse' : 'text-rose-500'}>
                  {streakFreezeActive ? '● SECURED FOR 24H' : '○ EXPOSED (NO SHIELD)'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Panel to check edge cases */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/60">
            <div className="flex justify-between items-center text-[9px] font-extrabold uppercase text-slate-400 font-mono mb-2">
              <span>Time-Zone Reset Simulators</span>
              <span className="text-indigo-500">Edge Case Check</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSimulateCheckin}
                className="py-1.5 px-2 bg-indigo-500 text-white hover:bg-indigo-600 text-[9px] font-bold rounded-lg transition"
              >
                Simulate Daily Check-In
              </button>
              <button
                onClick={handleResetStreak}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-[9px] font-bold rounded-lg transition"
              >
                Simulate Missed Day
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Middle Block: Comprehensive Badge Showcase (The 5 Starter Badges) */}
      <div className="rounded-[2rem] border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 font-display">
              Achievements Vault & Badge Vault
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Unlock distinct achievement awards by tracking and completing academic objectives.
            </p>
          </div>
          <div className="px-3.5 py-1 bg-indigo-500/15 rounded-full text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
            {unlockedBadgesCount} / 5 Unlocked
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {badges.map(badge => {
            const IconComp = badge.icon;
            const progressPercent = Math.min(100, Math.round((badge.current / badge.target) * 100));
            const isPinned = pinnedBadges.includes(badge.id);

            return (
              <div 
                key={badge.id}
                className={`p-4.5 rounded-2xl border transition relative flex flex-col justify-between ${
                  badge.unlocked 
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 shadow-xs' 
                    : 'bg-slate-100/30 dark:bg-slate-950/10 border-slate-200/50 dark:border-slate-850 opacity-65'
                }`}
              >
                {/* Lock Overlay or Pin Button */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <button
                    onClick={() => handleTogglePin(badge.id)}
                    className={`p-1 rounded-md transition text-[8px] font-bold uppercase ${
                      isPinned 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                    title={isPinned ? "Unpin Badge" : "Pin Badge"}
                  >
                    Pin
                  </button>
                  {!badge.unlocked && (
                    <span className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Badge Icon and Name */}
                <div className="text-left space-y-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${badge.unlocked ? badge.color : 'from-slate-400/40 to-slate-500/40'} text-white flex items-center justify-center shadow-md shadow-indigo-500/5`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                      {badge.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                      {badge.criteria}
                    </p>
                  </div>
                </div>

                {/* Badge progress details */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/40 space-y-1.5 text-left">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-slate-400">Progress:</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">
                      {badge.current} / {badge.target}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${badge.unlocked ? badge.color : 'from-slate-400 to-slate-500'} rounded-full transition-all`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="text-[8px] text-slate-400 font-mono italic mt-1 leading-tight truncate" title={`Visual Concept: ${badge.concept}`}>
                    Concept: {badge.concept}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Mathematical XP Calculator and Real-time Quest Logs Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Live Ledger / Quest Journal (7 columns) */}
        <div className="lg:col-span-7 rounded-[2rem] border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-500" />
                Real-Time Quest Ledger
              </h3>
              <span className="text-[9px] text-indigo-500 font-bold uppercase font-mono">Audit Trails</span>
            </div>
            
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {streakActionLog.map((log, idx) => (
                <div key={idx} className="text-[10px] font-mono text-left py-1.5 px-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-850 text-slate-600 dark:text-slate-400 leading-normal">
                  {log}
                </div>
              ))}
              {streakActionLog.length === 0 && (
                <div className="text-[10px] text-slate-400 font-mono py-8 text-center border border-dashed border-slate-200/50 dark:border-slate-800/40 rounded-xl">
                  Quests will audit logs here. Complete academic exercises to earn XP ledger entries.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-indigo-500/5 dark:bg-indigo-400/5 text-left border border-indigo-500/10">
            <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 mb-1">
              <Cpu className="w-3.5 h-3.5" />
              SaaS Anti-Exploit Shield
            </div>
            <p className="text-[9px] text-slate-400 leading-relaxed">
              Rate limiter: Standard task check-offs are capped at 50 XP/hr, and pomodoro checks require a valid token verification timer to prevent manual gaming.
            </p>
          </div>
        </div>

        {/* Mathematical Calculator Widget (5 columns) */}
        <div className="lg:col-span-5 rounded-[2rem] border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 p-6 text-left flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-500" />
                XP scaling Calculator
              </h3>
              <button 
                onClick={() => setShowFormulaInfo(!showFormulaInfo)}
                className="p-1 rounded-md text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="View scaling Formula"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            {showFormulaInfo && (
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-[9px] text-indigo-950 dark:text-indigo-300 leading-relaxed font-mono">
                Formula:<br />
                XP Needed(Level) = Level × 100 XP<br />
                Progressive Scaling ensures each milestone is progressively harder, preventing system deflation.
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[9px] font-mono text-slate-400 uppercase">Target Level Goal</label>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min={level + 1} 
                  max="100" 
                  value={calcTargetLevel}
                  onChange={(e) => {
                    playClickSound();
                    setCalcTargetLevel(parseInt(e.target.value) || (level + 1));
                  }}
                  className="flex-grow accent-indigo-500"
                />
                <span className="w-12 text-center text-xs font-bold font-mono bg-slate-100 dark:bg-slate-800 py-1 px-2 rounded-md">
                  Lvl {calcTargetLevel}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-850 space-y-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Total XP Needed:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">
                  {xpNeededForTarget} XP
                </span>
              </div>
              <div className="flex justify-between items-center text-[9px]">
                <span className="text-slate-400">Completion Estimate:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  ~{Math.ceil(xpNeededForTarget / 25)} Tasks
                </span>
              </div>
            </div>
          </div>

          <div className="text-[8px] text-slate-400 font-mono leading-normal mt-4">
            * Estimate computed using average check-in rewards of 15 XP for completed tasks and 25 XP for deep pomodoro study segments.
          </div>
        </div>

      </div>

    </div>
  );
}
