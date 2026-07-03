import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  Target, 
  Key, 
  ShieldCheck, 
  ArrowRight, 
  Info, 
  CheckCircle2, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthSystemProps {
  onAuthSuccess: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
  onBrowseAsGuest?: () => void;
}

export default function AuthSystem({ onAuthSuccess, initialProfile, onBrowseAsGuest }: AuthSystemProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('venkatappaiahlella54215@gmail.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States
  const [regName, setRegName] = useState('Venkatappaiah Lella');
  const [regEmail, setRegEmail] = useState('venkatappaiahlella54215@gmail.com');
  const [regPassword, setRegPassword] = useState('password123');
  const [regCollege, setRegCollege] = useState('IIT Madras');
  const [regBranch, setRegBranch] = useState('Computer Science & Engineering');
  const [regSemester, setRegSemester] = useState('Semester 5');
  const [regDailyGoal, setRegDailyGoal] = useState<number>(6);
  const [regPic, setRegPic] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');

  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    // Load existing profile or build a new high-fidelity one
    const profile: UserProfile = {
      name: regName || 'Scholar Pro',
      email: loginEmail,
      college: regCollege || 'National Institute of Technology',
      branch: regBranch || 'Electrical Engineering',
      semester: regSemester || 'Semester 5',
      profilePic: regPic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      dailyStudyGoal: regDailyGoal || 5,
      xp: 450,
      level: 2,
      achievements: ['ach-1', 'ach-2']
    };

    onAuthSuccess(profile);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName || !regEmail || !regCollege || !regBranch || !regPassword) {
      setErrorMessage('Please fill out all academic fields and choose a password.');
      return;
    }

    const profile: UserProfile = {
      name: regName,
      email: regEmail,
      college: regCollege,
      branch: regBranch,
      semester: regSemester,
      profilePic: regPic,
      dailyStudyGoal: regDailyGoal,
      xp: 100, // starting bonus
      level: 1, // beginner
      achievements: []
    };

    onAuthSuccess(profile);
  };

  const handleGoogleSignIn = () => {
    // Elegant simulation of secure OAuth popup
    const profile: UserProfile = {
      name: 'Google Scholar',
      email: 'venkatappaiahlella54215@gmail.com',
      college: 'Indian Institute of Technology',
      branch: 'Artificial Intelligence',
      semester: 'Semester 7',
      profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      dailyStudyGoal: 6,
      xp: 300,
      level: 2,
      achievements: ['ach-1']
    };
    onAuthSuccess(profile);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Branding Logo */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-2xl text-white shadow-lg mb-2">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-display text-slate-950 dark:text-white" id="brand-auth-h2">
            OMNIMIND AI
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to synchronize your academic suite and track assignments
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
          <button
            onClick={() => setActiveTab('login')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'register'
                ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Forgot Password Sub-View */}
        {showForgot ? (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Reset Your Security Password</h3>
            <p className="text-xs text-slate-400">
              Enter your verified email. We will dispatch a 6-digit verification code to refresh your session keys.
            </p>
            {emailSent ? (
              <div className="p-3 bg-green-500/10 text-green-600 dark:text-green-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5" />
                <span>Verification code sent successfully to {forgotEmail}! Check your inbox.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your student email"
                    className="w-full p-3.5 pl-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => forgotEmail && setEmailSent(true)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition"
                >
                  Send Verification Link
                </button>
              </div>
            )}
            <button
              onClick={() => {
                setShowForgot(false);
                setEmailSent(false);
              }}
              className="text-xs text-indigo-600 dark:text-amber-400 block mx-auto hover:underline"
            >
              Back to Login
            </button>
          </div>
        ) : activeTab === 'login' ? (
          /* Login View Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className="w-full p-3.5 pl-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-none text-slate-800 dark:text-slate-100 font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-3.5 pl-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-none text-slate-800 dark:text-slate-100 font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-indigo-600 dark:text-amber-400 hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/10 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Authenticate Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Register View Form with Expanded Academic Fields */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-3.5 pl-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400">SaaS Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@college.edu"
                    className="w-full p-3.5 pl-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Choose a strong password"
                  className="w-full p-3.5 pl-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400">College / Uni</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={regCollege}
                    onChange={(e) => setRegCollege(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full p-3.5 pl-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400">Academic Branch</label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={regBranch}
                    onChange={(e) => setRegBranch(e.target.value)}
                    placeholder="e.g. Bio-engineering"
                    className="w-full p-3.5 pl-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400">Current Semester</label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <select
                    value={regSemester}
                    onChange={(e) => setRegSemester(e.target.value)}
                    className="w-full p-3.5 pl-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-none text-slate-800 dark:text-slate-100 cursor-pointer appearance-none"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400">Daily Study Goal (Hours)</label>
                <div className="relative">
                  <Target className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={regDailyGoal}
                    onChange={(e) => setRegDailyGoal(parseInt(e.target.value) || 5)}
                    className="w-full p-3.5 pl-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400 block text-left">Profile Picture</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={regPic}
                  onChange={(e) => setRegPic(e.target.value)}
                  placeholder="Paste picture URL or choose photo"
                  className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs focus:outline-none text-slate-800 dark:text-slate-100"
                />
                <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0">
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
                            setRegPic(reader.result);
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

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Build Professional Profile</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Divider and Google Sign-in */}
        {!showForgot && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow" />
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Or Continue With</span>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full py-3 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.14-5.136 4.14A5.94 5.94 0 0 1 8 12.6a5.94 5.94 0 0 1 5.99-5.94c1.614 0 3.08.64 4.156 1.67l3.056-3.056C19.352 3.515 16.792 2.22 13.99 2.22c-5.4 0-9.78 4.38-9.78 9.78s4.38 9.78 9.78 9.78c5.442 0 9.78-4.38 9.78-9.78 0-.64-.06-1.285-.18-1.92H12.24Z" />
              </svg>
              <span>Authenticate with Google Student Profile</span>
            </button>

            {onBrowseAsGuest && (
              <button
                type="button"
                onClick={onBrowseAsGuest}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer border border-transparent hover:border-slate-300/30 dark:hover:border-slate-700/30"
              >
                <span>Browse as Guest Student</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
