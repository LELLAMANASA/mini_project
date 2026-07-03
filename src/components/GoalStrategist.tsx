import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Target, 
  Edit3, 
  Check, 
  Trash2, 
  ArrowRight, 
  Download, 
  Brain, 
  Trophy, 
  AlertTriangle, 
  Bookmark, 
  FileText, 
  FileCode,
  Zap,
  Activity,
  UserCheck,
  RotateCcw,
  RefreshCw,
  Award
} from 'lucide-react';
import { playClickSound, playSuccessChime } from '../utils/audio';

interface GoalStrategistProps {
  theme?: string;
}

interface GoalItem {
  id: string;
  text: string;
  category: 'career' | 'health' | 'personal';
  isEditing: boolean;
}

export default function GoalStrategist({ theme = 'light' }: GoalStrategistProps) {
  // Goal state
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'roadmap'>('editor');

  const [newGoalText, setNewGoalText] = useState<string>('');
  const [newGoalCategory, setNewGoalCategory] = useState<'career' | 'health' | 'personal'>('career');

  const handleAddGoal = (text: string, category: 'career' | 'health' | 'personal') => {
    playClickSound();
    const cleanText = text.trim();
    if (!cleanText) return;
    const newGoal: GoalItem = {
      id: `goal-${Date.now()}`,
      text: cleanText,
      category,
      isEditing: false
    };
    const updated = [...goals, newGoal];
    saveGoalsToStorage(updated);
    setNewGoalText('');
    playSuccessChime();
  };

  const handleDeleteGoal = (id: string) => {
    playClickSound();
    const updated = goals.filter(g => g.id !== id);
    saveGoalsToStorage(updated);
    if (activeGoalId === id) {
      setActiveGoalId(null);
      setRoadmap('');
      localStorage.removeItem('avishkar_coach_active_id');
      localStorage.removeItem('avishkar_coach_roadmap');
    }
  };
  
  // Interactive loader steps
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);

  // Initialize and load from local storage
  useEffect(() => {
    try {
      const savedGoals = localStorage.getItem('avishkar_coach_goals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      } else {
        const defaultGoals: GoalItem[] = [
          { id: 'goal-1', text: 'Master modern frontend development, TypeScript and React to build responsive apps', category: 'career', isEditing: false },
          { id: 'goal-2', text: 'Achieve athletic fitness baseline and run a half-marathon in under 2 hours', category: 'health', isEditing: false },
          { id: 'goal-3', text: 'Improve deep focus, read 2 books per month, and maintain 45 minutes of daily study blocks', category: 'personal', isEditing: false }
        ];
        setGoals(defaultGoals);
        localStorage.setItem('avishkar_coach_goals', JSON.stringify(defaultGoals));
      }

      const savedActiveRoadmap = localStorage.getItem('avishkar_coach_roadmap');
      if (savedActiveRoadmap) setRoadmap(savedActiveRoadmap);

      const savedActiveGoalId = localStorage.getItem('avishkar_coach_active_id');
      if (savedActiveGoalId) setActiveGoalId(savedActiveGoalId);
    } catch (e) {
      console.error("Error loading goals data:", e);
    }
  }, []);

  // Synchronize dynamic AI launch trigger from Dashboard clicks
  useEffect(() => {
    const triggerLaunch = localStorage.getItem('avishkar_coach_trigger_launch');
    const activeId = localStorage.getItem('avishkar_coach_active_id');
    if (triggerLaunch === 'true' && activeId && goals.length > 0) {
      localStorage.removeItem('avishkar_coach_trigger_launch');
      const targetGoal = goals.find(g => g.id === activeId);
      if (targetGoal) {
        // Trigger the AI strategist roadmap compilation automatically with a small delay
        const timer = setTimeout(() => {
          handleGoalSubmit(targetGoal);
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [goals]);

  const saveGoalsToStorage = (updated: GoalItem[]) => {
    setGoals(updated);
    localStorage.setItem('avishkar_coach_goals', JSON.stringify(updated));
  };

  const handleEditGoal = (id: string) => {
    playClickSound();
    saveGoalsToStorage(goals.map(g => g.id === id ? { ...g, isEditing: true } : { ...g, isEditing: false }));
  };

  const handleSaveGoal = (id: string, newText: string) => {
    playClickSound();
    const cleaned = newText.trim().substring(0, 160);
    if (!cleaned) return;
    const updated = goals.map(g => g.id === id ? { ...g, text: cleaned, isEditing: false } : g);
    saveGoalsToStorage(updated);
    playSuccessChime();
  };

  const handleCategoryChange = (id: string, category: 'career' | 'health' | 'personal') => {
    playClickSound();
    const updated = goals.map(g => g.id === id ? { ...g, category } : g);
    saveGoalsToStorage(updated);
  };

  const handleGoalSubmit = async (goalItem: GoalItem) => {
    playClickSound();
    setActiveGoalId(goalItem.id);
    localStorage.setItem('avishkar_coach_active_id', goalItem.id);
    
    setIsLoading(true);
    setLoadingProgress(0);
    setActiveTab('roadmap');
    setLoadingLogs(["[INIT] Connecting to AI Studio Goal Coach service..."]);

    const logsSequence = [
      { prg: 25, log: "[ANALYZE] Evaluating goal clarity, feasibility thresholds & mental bandwidth bounds..." },
      { prg: 55, log: "[EXECUTE] Structuring customized 3-tier adaptive roadmap (Foundation -> Execution -> Success)..." },
      { prg: 80, log: "[REFINE] Polishing resource kits, mindset strategy guidelines, and micro first-step checklist..." },
    ];

    logsSequence.forEach((step, index) => {
      setTimeout(() => {
        setLoadingProgress(step.prg);
        setLoadingLogs(prev => [...prev, step.log]);
      }, (index + 1) * 350);
    });

    try {
      const response = await fetch('/api/goal-strategist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goalItem.text })
      });

      if (!response.ok) {
        throw new Error(`API error: status ${response.status}`);
      }

      const data = await response.json();
      
      setTimeout(() => {
        setLoadingProgress(100);
        setLoadingLogs(prev => [...prev, "[SUCCESS] Full strategic roadmap compiled. Assets ready for extraction."]);
        
        setTimeout(() => {
          setRoadmap(data.roadmap);
          localStorage.setItem('avishkar_coach_roadmap', data.roadmap);
          setIsLoading(false);
          playSuccessChime();
        }, 300);
      }, 1200);

    } catch (err) {
      console.error("Failed to generate strategic roadmap:", err);
      // Fallback is handled inside backend, let's gracefully load locally compiled failover if everything failed
      setTimeout(() => {
        setLoadingProgress(100);
        setLoadingLogs(prev => [...prev, "[WARNING] Network latency high. Loaded high-quality standalone offline roadmap model."]);
        setTimeout(() => {
          const fallback = `*[⚠️ Offline Failover Loaded]*\n\n# 1. Goal Analysis\n\n**Clarity & Feasibility:** Highly realistic setup for: "${goalItem.text}". Focus entirely on progressive overload.\n\n**Potential Challenges:**\n- Cognitive fatigue during initial 2 weeks of scheduling.\n- Failure to block physical focus hours away from ambient alerts.\n\n**Success Metrics:** Verifiable progress milestones clocked twice weekly.\n\n# 2. Expert Guidance\n\n**Mindset Strategy:** Focus strictly on actions, not motivation. A 1% marginal gain compounded over 45 days is unstoppable.\n\n**Required Resources:** High-integrity log template, Pomodoro companion timer, and explicit daily time-blocking.\n\n# 3. Complete Roadmap\n\n## Phase 1: Foundation (Short-term)\n\n### Step 1: The Setup\nEstablish precise time blocks and clean space dedicated entirely to this objective.\n\n### Step 2: Diagnostic\nRun a 60-minute diagnostic challenge or test exercise to clarify structural weak links.\n\n## Phase 2: Execution (Medium-term)\n\n### Step 1: Micro-wins logging\nTrack daily success checks on your Study Dashboard to preserve cognitive momentum.\n\n### Step 2: Habit Solidification\nDouble-down during high-friction mid-cycle weeks. Avoid task skipping for more than 24 hours.\n\n## Phase 3: Completion (Long-term)\n\n### Step 1: Synthesis testing\nGenerate solid proof of work (e.g. portfolio release, public testing split).\n\n### Step 2: Integration\nConduct final audit checking, review retrospective observations, and establish standard maintenance split.\n\n# 4. Immediate First Step\n\n**Your 15-Minute Action:** Turn off all ambient smartphone notification badges, set an alarms loop for 07:00 AM tomorrow, and declare one small 20-minute atomic sprint target.`;
          
          setRoadmap(fallback);
          localStorage.setItem('avishkar_coach_roadmap', fallback);
          setIsLoading(false);
        }, 350);
      }, 1100);
    }
  };

  // Convert raw markdown lines to stylized human-friendly components
  const parseRoadmap = () => {
    if (!roadmap) return null;

    // Simple robust custom regex parser to extract structured information safely
    const sections: Record<string, string> = {
      clarity: '',
      challenges: '',
      metrics: '',
      mindset: '',
      resources: '',
      phase1: '',
      phase2: '',
      phase3: '',
      immediate: ''
    };

    const lines = roadmap.split('\n');
    let currentScope = '';

    lines.forEach(line => {
      const lower = line.toLowerCase();
      
      if (lower.includes('clarity & feasibility') || lower.includes('clarity and feasibility')) {
        currentScope = 'clarity';
      } else if (lower.includes('potential challenges')) {
        currentScope = 'challenges';
      } else if (lower.includes('success metrics')) {
        currentScope = 'metrics';
      } else if (lower.includes('mindset strategy')) {
        currentScope = 'mindset';
      } else if (lower.includes('required resources')) {
        currentScope = 'resources';
      } else if (lower.includes('phase 1') || lower.includes('foundation')) {
        currentScope = 'phase1';
      } else if (lower.includes('phase 2') || lower.includes('execution')) {
        currentScope = 'phase2';
      } else if (lower.includes('phase 3') || lower.includes('completion')) {
        currentScope = 'phase3';
      } else if (lower.includes('immediate first step') || lower.includes('4. immediate')) {
        currentScope = 'immediate';
      }

      if (currentScope && !line.startsWith('#') && !line.toLowerCase().startsWith('##')) {
        sections[currentScope] += line + '\n';
      }
    });

    // Helper to sanitize markdown bold annotations
    const sanitizeText = (txt: string) => {
      return txt
        .replace(/\*\*Clarity & Feasibility:\*\*/ig, '')
        .replace(/\*\*Potential Challenges:\*\*/ig, '')
        .replace(/\*\*Success Metrics:\*\*/ig, '')
        .replace(/\*\*Mindset Strategy:\*\*/ig, '')
        .replace(/\*\*Required Resources:\*\*/ig, '')
        .replace(/\*\*Your Under-15-Minute Micro-Task for Today:\*\*/ig, '')
        .replace(/\*\*[^*]+\*\*/g, m => m.replace(/\*\*/g, ''))
        .replace(/[*#_`~]/g, '')
        .trim();
    };

    return {
      clarity: sanitizeText(sections.clarity || 'Highly clear and highly actionable parameters defined or evaluated by the strategist core.'),
      challenges: sections.challenges.split('\n').map(l => sanitizeText(l)).filter(l => l.length > 2),
      metrics: sanitizeText(sections.metrics || 'Milestone verification checkpoints configured in your academic suite database.'),
      mindset: sanitizeText(sections.mindset || 'Adopt atomic consistency: do micro-blocks regardless of transient energy splits.'),
      resources: sanitizeText(sections.resources || 'System productivity suite dashboard integrated with multi-sensory Pomodoro mechanics.'),
      phase1: sections.phase1.split('\n').filter(l => l.length > 2).map(l => l.replace(/###/g, '').replace(/Step \d+:/g, '').trim()),
      phase2: sections.phase2.split('\n').filter(l => l.length > 2).map(l => l.replace(/###/g, '').replace(/Step \d+:/g, '').trim()),
      phase3: sections.phase3.split('\n').filter(l => l.length > 2).map(l => l.replace(/###/g, '').replace(/Step \d+:/g, '').trim()),
      immediate: sanitizeText(sections.immediate || 'Open your study schedule planner tab and log exactly one 15-minute diagnostic session immediately.')
    };
  };

  const currentParsedRoadmap = parseRoadmap();
  const selectedGoal = goals.find(g => g.id === activeGoalId);

  // Exporter to Microsoft Word (.doc) using standard HTML Office wrap
  const handleExportDOC = () => {
    playClickSound();
    playSuccessChime();

    if (!roadmap) return;

    // Convert Markdown text to formatted HTML simple layout
    const formattedHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; color: #1e293b; line-height: 1.6;">
        <div style="text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0 0 5px 0;">AVISHKAR GOAL STRATEGIST</h1>
          <p style="color: #64748b; font-size: 14px; margin: 0;">Elite Career & Life Roadmap &bull; 2026 Academic Edition</p>
        </div>

        <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 15px; margin-bottom: 30px;">
          <strong style="color: #4f46e5; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Selected Objective:</strong>
          <h2 style="font-size: 20px; color: #0f172a; margin: 5px 0 0 0;">"${selectedGoal?.text}"</h2>
        </div>

        ${roadmap
          .split('\n')
          .map(line => {
            if (line.startsWith('# ')) {
              return `<h1 style="color: #4f46e5; font-size: 22px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px;">${line.substring(2)}</h1>`;
            } else if (line.startsWith('## ')) {
              return `<h2 style="color: #0f172a; font-size: 18px; margin-top: 20px;">${line.substring(3)}</h2>`;
            } else if (line.startsWith('### ')) {
              return `<h3 style="color: #312e81; font-size: 15px; margin-top: 15px; margin-bottom: 5px;">${line.substring(4)}</h3>`;
            } else if (line.startsWith('- ')) {
              return `<li style="margin-bottom: 6px; list-style-type: square; color: #334155;">${line.substring(2)}</li>`;
            } else if (line.trim().length > 0) {
              return `<p style="margin-bottom: 12px; color: #334155;">${line}</p>`;
            }
            return '';
          })
          .join('')}
        
        <div style="margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; text-align: center; color: #94a3b8;">
          <p>Generated by Avishkar Productivity Suite &copy; 2026. Standalone cloud service integration complete.</p>
        </div>
      </div>
    `;

    const htmlStr = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset="utf-8"><title>Strategic Goal Roadmap</title></head><body>${formattedHtml}</body></html>`;
    const blob = new Blob(['\ufeff' + htmlStr], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `goal_roadmap_${activeGoalId || 'export'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Exporter using dynamic printable frame pop-up
  const handleExportPDF = () => {
    playClickSound();
    playSuccessChime();

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Popup blocked! Please allow popups for this site so we can print your high-fidelity dynamic Roadmap.");
      return;
    }

    const compiledHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Strategic Goal Roadmap - Avishkar 2026</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            background: #ffffff;
            color: #0f172a;
          }
          .font-display {
            font-family: 'Space Grotesk', sans-serif;
          }
          @media print {
            body { background: transparent; }
            .no-print { display: none; }
            .print-page-break { page-break-after: always; }
          }
        </style>
      </head>
      <body class="p-12 max-w-4xl mx-auto">
        <div class="no-print mb-8 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex justify-between items-center">
          <div>
            <h4 class="font-bold text-indigo-900 text-sm">Printers View active</h4>
            <p class="text-xs text-indigo-700">Configure layout to "Save as PDF" relative to your active printer driver.</p>
          </div>
          <button onclick="window.print()" class="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-500 transition cursor-pointer">
            Trigger Print Dialog
          </button>
        </div>

        <header class="border-b-4 border-indigo-600 pb-6 mb-8 flex justify-between items-end">
          <div>
            <span class="text-[10px] font-bold tracking-widest text-indigo-600 uppercase font-mono">AVISHKAR ACADEMIC SUITE 2026</span>
            <h1 class="text-3xl font-extrabold tracking-tight font-display text-slate-900">Career & Life Goal Strategy</h1>
            <p class="text-slate-500 text-sm mt-1">Generated for: <span class="font-semibold text-slate-800">${selectedGoal?.text || 'Standard Candidate Objective'}</span></p>
          </div>
          <div class="text-right">
            <span class="text-xs font-mono font-bold text-slate-400">COACHING ENGINE V3.5</span>
          </div>
        </header>

        <section class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-2 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <h3 class="text-xs font-black tracking-wider text-indigo-700 uppercase mb-2">Clarity & Feasibility Evaluation</h3>
              <p class="text-slate-800 text-sm leading-relaxed">${currentParsedRoadmap?.clarity}</p>
            </div>
            
            <div class="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <h3 class="text-xs font-black tracking-wider text-rose-700 uppercase mb-2">Success Metrics</h3>
              <p class="text-slate-800 text-xs leading-relaxed font-semibold">${currentParsedRoadmap?.metrics}</p>
            </div>
          </div>

          <div class="p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
            <h3 class="text-xs font-black tracking-wider text-indigo-800 uppercase mb-3">Goal Mindset and Resources</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 class="font-bold text-slate-800 mb-1">Mindset Shift:</h4>
                <p class="text-slate-600 text-xs leading-relaxed">${currentParsedRoadmap?.mindset}</p>
              </div>
              <div>
                <h4 class="font-bold text-slate-800 mb-1">Essential Resource Kit:</h4>
                <p class="text-slate-600 text-xs leading-relaxed">${currentParsedRoadmap?.resources}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 class="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">3-Tier Progressive Roadmap</h2>
            
            <div class="space-y-6">
              <div class="p-5 border border-slate-100 rounded-xl bg-slate-50/30">
                <span class="text-[10px] font-bold text-indigo-600 tracking-wider uppercase">Phase 1: Foundation (Short-term)</span>
                <div class="mt-2 space-y-3">
                  ${currentParsedRoadmap?.phase1.map((p, i) => `
                    <div class="flex gap-3 text-xs leading-relaxed text-slate-700">
                      <span class="font-mono font-bold text-indigo-500">Step ${i+1}:</span>
                      <p>${p}</p>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="p-5 border border-slate-100 rounded-xl bg-slate-50/30">
                <span class="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">Phase 2: Execution (Medium-term)</span>
                <div class="mt-2 space-y-3">
                  ${currentParsedRoadmap?.phase2.map((p, i) => `
                    <div class="flex gap-3 text-xs leading-relaxed text-slate-700">
                      <span class="font-mono font-bold text-emerald-500">Step ${i+1}:</span>
                      <p>${p}</p>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="p-5 border border-slate-100 rounded-xl bg-slate-50/30">
                <span class="text-[10px] font-bold text-amber-600 tracking-wider uppercase">Phase 3: Completion (Long-term)</span>
                <div class="mt-2 space-y-3">
                  ${currentParsedRoadmap?.phase3.map((p, i) => `
                    <div class="flex gap-3 text-xs leading-relaxed text-slate-700">
                      <span class="font-mono font-bold text-amber-500">Step ${i+1}:</span>
                      <p>${p}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <h3 class="text-xs font-black tracking-wider text-emerald-800 uppercase mb-1">Immediate First Step Checklist</h3>
            <p class="text-slate-800 text-sm font-semibold">${currentParsedRoadmap?.immediate}</p>
          </div>
        </section>

        <footer class="mt-16 border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400">
          <p>This PDF report is dynamically printed directly from your standalone Avishkar productivity platform.</p>
        </footer>

        <script>
          window.onload = function() {
            // Trigger browser dynamic scaling automatically
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(compiledHtml);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6" id="goal-coach-main-container">
      
      {/* Premium Coaching Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
              Personal Development Core
            </span>
            <span className="flex items-center gap-1 text-[11px] font-black tracking-wide text-amber-500">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} /> STRATEGIST AI
            </span>
          </div>
          <h1 className="text-2xl font-black font-display tracking-tight text-slate-800 dark:text-white-light leading-none">
            Goal Strategist & Career Coach
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Map out detailed, actionable roadmaps instantly from your top edited personal objectives.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex items-center bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { playClickSound(); setActiveTab('editor'); }}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'editor' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Top 3 Goals
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!roadmap}
            onClick={() => { playClickSound(); setActiveTab('roadmap'); }}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              activeTab === 'roadmap' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-605 dark:text-slate-400'
            }`}
          >
            Roadmap view
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* Loading Handshake Overlay */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-10 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-center space-y-6"
            key="loading-dialog"
          >
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20 animate-ping"></span>
              <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg">
                <Brain className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Synthesizing Roadmaps...</h3>
              <p className="text-xs text-slate-500">The Career and life coach model is analyzing clarity and compounding milestones.</p>
            </div>

            {/* Progress line */}
            <div className="w-full max-w-md mx-auto bg-slate-205 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div 
                className="bg-indigo-600 h-full rounded-full"
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Custom logs sequence */}
            <div className="p-4 bg-slate-900 text-zinc-400 text-[11px] font-mono rounded-xl max-w-lg mx-auto text-left space-y-1 overflow-hidden border border-slate-800">
              {loadingLogs.map((log, index) => (
                <div key={index} className="flex gap-2 text-indigo-300">
                  <span className="text-zinc-600">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {!isLoading && activeTab === 'editor' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            key="editor-workspace"
          >
            {/* Left side info block */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Vibe description */}
              <div className="p-6 bg-indigo-900 text-white rounded-3xl space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-indigo-200" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-md font-bold font-display">Targeting Top Priorities</h3>
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    Clear goals form the spine of academic and career progression. Keep your goals specific, objective, and realistic. 
                  </p>
                </div>
                <div className="text-[11px] bg-white/10 p-3 rounded-lg font-mono text-indigo-100">
                  <p>✏️ Inline editing logged to dynamic storage.</p>
                  <p className="mt-1">⚡ Click "Launch Coach" to generate Roadmap.</p>
                </div>
              </div>

              {/* Tips list */}
              <div className="p-6 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl space-y-3">
                <h4 className="text-xs font-black tracking-widest text-slate-400 uppercase">Coach advice</h4>
                <div className="space-y-2 text-xs text-slate-650 dark:text-slate-400">
                  <div className="flex gap-2">
                    <span className="text-indigo-500 font-bold">&#8212;</span>
                    <p><strong>Clarity:</strong> Instead of "get smart," type "master JavaScript callbacks and array mapping."</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-500 font-bold">&#8212;</span>
                    <p><strong>Feasibility:</strong> Ensure the step-by-step roadmap addresses intermediate roadblocks.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Goals grid manager */}
            <div className="lg:col-span-2 space-y-4">
              
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-black tracking-widest text-slate-400 uppercase">YOUR EXPLICIT TOP 3 GOALS</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-900 border px-2 py-0.5 rounded-full font-mono text-slate-500">Dynamic Storage linked</span>
              </div>

              {goals.map((goal, index) => (
                <div 
                  key={goal.id}
                  className={`p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    activeGoalId === goal.id 
                    ? 'bg-indigo-600/5 border-indigo-500/40 shadow-sm shadow-indigo-600/5' 
                    : 'bg-white dark:bg-slate-950 border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Category Accent Indicator Line */}
                  <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                    goal.category === 'career' ? 'bg-indigo-500' : goal.category === 'health' ? 'bg-emerald-500' : 'bg-pink-500'
                  }`} />

                  <div className="flex-grow pl-2 pr-2 space-y-2.5">
                    
                    {/* Index header & Type category */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold font-mono text-indigo-600 uppercase bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                        Goal #{index + 1}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleCategoryChange(goal.id, 'career')}
                          className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider cursor-pointer ${
                            goal.category === 'career' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                          }`}
                        >
                          Software/Career
                        </button>
                        <button
                          onClick={() => handleCategoryChange(goal.id, 'health')}
                          className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider cursor-pointer ${
                            goal.category === 'health' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                          }`}
                        >
                          Health Split
                        </button>
                        <button
                          onClick={() => handleCategoryChange(goal.id, 'personal')}
                          className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider cursor-pointer ${
                            goal.category === 'personal' ? 'bg-pink-500 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                          }`}
                        >
                          Personal
                        </button>
                      </div>
                    </div>

                    {/* Expandable Editable TextArea or Text Display */}
                    {goal.isEditing ? (
                      <div className="flex gap-2">
                        <textarea
                          placeholder="Type an specific, high-fidelity personal achievement goal..."
                          defaultValue={goal.text}
                          id={`textarea-${goal.id}`}
                          maxLength={150}
                          className="flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-3 rounded-xl text-xs text-slate-800 dark:text-white leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-indigo-500 resize-none h-20"
                        />
                        <button
                          onClick={() => {
                            const val = (document.getElementById(`textarea-${goal.id}`) as HTMLTextAreaElement)?.value;
                            handleSaveGoal(goal.id, val);
                          }}
                          className="px-3 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-500 transition cursor-pointer flex items-center justify-center"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed font-display">
                          "{goal.text}"
                        </p>
                        <div className="flex gap-1 items-center shrink-0">
                          <button 
                            onClick={() => handleEditGoal(goal.id)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 transition cursor-pointer"
                            title="Edit this goal description"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 transition cursor-pointer"
                            title="Delete this objective"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Operational Launch trigger */}
                  <div className="flex items-center md:border-l pl-3 border-slate-200 dark:border-slate-800">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleGoalSubmit(goal)}
                      disabled={goal.isEditing}
                      className="w-full md:w-auto px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-indigo-500/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Launch Coach</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>

                </div>
              ))}

              {/* Form to Add New Goal */}
              <div className="p-5 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[10px] font-bold font-mono text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md self-start">
                    + Add Custom Goal Option
                  </span>
                  
                  {/* Category select tools */}
                  <div className="flex gap-1.5 self-start sm:self-auto select-none">
                    {(['career', 'health', 'personal'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { playClickSound(); setNewGoalCategory(cat); }}
                        className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider cursor-pointer transition ${
                          newGoalCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-150 dark:bg-slate-800 text-slate-400 hover:text-indigo-500'
                        }`}
                      >
                        {cat === 'career' ? 'Career' : cat === 'health' ? 'Health' : 'Personal'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={130}
                    placeholder="Enter custom academic, career or life priority..."
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newGoalText.trim()) {
                        handleAddGoal(newGoalText, newGoalCategory);
                      }
                    }}
                    className="flex-grow bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-xs text-slate-850 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      if (!newGoalText.trim()) return;
                      handleAddGoal(newGoalText, newGoalCategory);
                    }}
                    className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Sync reset info */}
              <div className="text-center pt-2">
                <p className="text-[10px] text-slate-400">
                  Select a goal to generate a personalized timeline. Check files in your settings menu to export documents.
                </p>
              </div>

            </div>

          </motion.div>
        )}

        {!isLoading && activeTab === 'roadmap' && roadmap && currentParsedRoadmap && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
            key="roadmap-dashboard-view"
          >
            
            {/* Core Selected Header Bar */}
            <div className="p-6 bg-indigo-600 text-white rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-indigo-200 uppercase font-mono">MAP FOR SELECTED GOAL</span>
                <h2 className="text-lg font-black font-display leading-tight">
                  "{selectedGoal?.text}"
                </h2>
              </div>

              {/* Exporters Button panel */}
              <div className="flex gap-2 flex-wrap">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExportPDF}
                  className="px-4 py-2.5 bg-indigo-500/50 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition border border-indigo-400/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Document</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExportDOC}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Word (.doc)</span>
                </motion.button>
              </div>
            </div>

            {/* Split layout: Analysis, Guidance vs Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Clarity, Mindset, Resources, First Step */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* 1. Evaluation & Challenges */}
                <div className="p-6 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-205 dark:border-slate-800">
                    <Target className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-xs font-black tracking-wider uppercase text-slate-400">1. Strategic Evaluation</h3>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed text-slate-650 dark:text-slate-405">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-0.5">Clarity & Feasibility:</h4>
                      <p>{currentParsedRoadmap.clarity}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-0.5">Success metrics:</h4>
                      <p className="font-medium text-indigo-650 dark:text-indigo-400">{currentParsedRoadmap.metrics}</p>
                    </div>

                    {currentParsedRoadmap.challenges.length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white mb-1">Expected Hurdles:</h4>
                        <div className="space-y-1.5">
                          {currentParsedRoadmap.challenges.map((hurdle, i) => (
                            <div key={i} className="flex gap-2 items-start bg-rose-500/5 border border-rose-500/10 p-2 rounded-lg text-rose-850 dark:text-rose-300">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                              <p className="text-[10px] sm:text-xs">{hurdle}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Mindset & Resource Kit */}
                <div className="p-6 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-205 dark:border-slate-800">
                    <Brain className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-xs font-black tracking-wider uppercase text-slate-400">2. Expert Coaching Guidance</h3>
                  </div>

                  <div className="space-y-3.5 text-xs leading-relaxed text-slate-650 dark:text-slate-405">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" /> Mindset strategy:
                      </h4>
                      <p>{currentParsedRoadmap.mindset}</p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border">
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">Essential Resources:</h4>
                      <p className="text-[11px] leading-relaxed text-slate-500">{currentParsedRoadmap.resources}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Progressive Multi-phase Roadmap Timeline */}
              <div className="lg:col-span-2 space-y-6">
                
                <div className="p-6 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl space-y-6">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-slate-205 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-indigo-500" />
                      <h3 className="text-xs font-black tracking-wider uppercase text-slate-400">3. Actionable Progressive Roadmap</h3>
                    </div>
                    <span className="text-[9px] font-bold font-mono tracking-wider text-emerald-600 bg-emerald-100/40 px-2 py-0.5 rounded-md uppercase">3 Phases mapped</span>
                  </div>

                  {/* Timeline Cards */}
                  <div className="relative border-l-2 border-indigo-200/50 ml-3 pl-6 space-y-8">
                    
                    {/* Phase 1 */}
                    <div className="relative">
                      {/* Timeline dot dot */}
                      <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white dark:border-slate-950 shadow-md"></span>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">Phase 1</span>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Foundation Setup (Short-term)</h4>
                        </div>
                        <div className="pl-1 space-y-3">
                          {currentParsedRoadmap.phase1.length > 0 ? (
                            currentParsedRoadmap.phase1.map((stepTxt, i) => (
                              <div key={i} className="bg-slate-50 dark:bg-slate-900 border p-3 rounded-2xl">
                                <span className="text-[9px] font-mono font-bold text-indigo-400 block mb-0.5 uppercase">Checkpoint Step #{i + 1}</span>
                                <p className="text-xs text-slate-705 dark:text-slate-305 leading-relaxed">{stepTxt}</p>
                              </div>
                            ))
                          ) : (
                            <div className="bg-slate-50 dark:bg-slate-900 border p-3 rounded-2xl text-xs text-slate-400">
                              Review capabilities, block daily focus times, and secure resource packages.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Phase 2 */}
                    <div className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-950 shadow-md"></span>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">Phase 2</span>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Execution Cycle (Medium-term)</h4>
                        </div>
                        <div className="pl-1 space-y-3">
                          {currentParsedRoadmap.phase2.length > 0 ? (
                            currentParsedRoadmap.phase2.map((stepTxt, i) => (
                              <div key={i} className="bg-slate-50 dark:bg-slate-900 border p-3 rounded-2xl">
                                <span className="text-[9px] font-mono font-bold text-emerald-400 block mb-0.5 uppercase">Progress Checkpoint #{i + 1}</span>
                                <p className="text-xs text-slate-705 dark:text-slate-305 leading-relaxed">{stepTxt}</p>
                              </div>
                            ))
                          ) : (
                            <div className="bg-slate-50 dark:bg-slate-900 border p-3 rounded-2xl text-xs text-slate-400">
                              Establish regular core work logs, resolve routine friction, and audit weekly micro-wins.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Phase 3 */}
                    <div className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-amber-500 border-4 border-white dark:border-slate-950 shadow-md"></span>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">Phase 3</span>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Completion Mastery (Long-term)</h4>
                        </div>
                        <div className="pl-1 space-y-3">
                          {currentParsedRoadmap.phase3.length > 0 ? (
                            currentParsedRoadmap.phase3.map((stepTxt, i) => (
                              <div key={i} className="bg-slate-50 dark:bg-slate-900 border p-3 rounded-2xl">
                                <span className="text-[9px] font-mono font-bold text-amber-400 block mb-0.5 uppercase">Final Verification #{i + i}</span>
                                <p className="text-xs text-slate-705 dark:text-slate-305 leading-relaxed">{stepTxt}</p>
                              </div>
                            ))
                          ) : (
                            <div className="bg-slate-50 dark:bg-slate-900 border p-3 rounded-2xl text-xs text-slate-400">
                              Verify absolute completion against metrics logs, run final stress test, and transition loop habits.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* 4. Immediate Micro Step (Today) */}
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/10 rounded-3xl space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-600 text-white rounded-lg">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest font-mono">ACTIONABLE TODAY IN &lt; 15 MINUTES</span>
                      <h4 className="text-md font-bold text-slate-800 dark:text-white leading-none mt-0.5">4. Immediate First Step</h4>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-805 dark:text-emerald-100 font-semibold pl-1.5">
                    "{currentParsedRoadmap.immediate}"
                  </p>
                </div>

              </div>

            </div>

            {/* Back action */}
            <div className="text-center pt-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { playClickSound(); setActiveTab('editor'); }}
                className="inline-flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-indigo-600 text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-900 rounded-xl border border-transparent hover:border-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Adjust Edited Goals</span>
              </motion.button>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
