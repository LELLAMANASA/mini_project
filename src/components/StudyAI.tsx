import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  FileText,
  HelpCircle,
  Play,
  ArrowRight,
  BookOpen,
  CheckCircle,
  XCircle,
  RefreshCw,
  Award,
  Upload,
  Info,
  Menu,
  Plus,
  Trash2,
  Image as ImageIcon,
  Video,
  Compass,
  History,
  Globe,
  Bookmark,
  ChevronDown,
  Mic,
  User,
  X,
  Send
} from "lucide-react";

interface StudyAIProps {
  theme: string;
  onExit?: () => void;
}

type ModeType = "DEEP_RESEARCH" | "MULTIMODAL_STUDY" | "INTERACTIVE_QUIZ" | "LIVE_VOICE";

interface QuizQuestion {
  id: number;
  type: "multiple-choice" | "short-answer";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface ChatTurn {
  role: "user" | "model";
  text: string;
  mode?: ModeType;
  quiz?: QuizQuestion[];
  attachedFile?: {
    name: string;
    content: string;
    pageCount?: number;
    title?: string;
    author?: string;
  } | null;
}

const getThemeStyles = (currentTheme: string) => {
  switch (currentTheme) {
    case 'light':
      return {
        outerBg: "bg-[#f0f4f9] text-[#1f1f1f] border border-[#e3e3e3] shadow-lg",
        sidebarBg: "bg-[#f8fafd] border-r border-[#e3e3e3]",
        logoText: "text-[#1f1f1f]",
        inputBg: "bg-white border-[#c4c7c5] text-[#1f1f1f] focus:border-indigo-500",
        inputText: "text-[#1f1f1f] placeholder-slate-500",
        newChatBtn: "bg-[#e3e3e3] text-slate-800 border-transparent hover:bg-[#d2d2d2]",
        recentItemActive: "bg-[#e3e3e3] text-slate-900 border border-slate-300",
        recentItemHover: "text-slate-600 hover:bg-[#e3e3e3]/70 hover:text-slate-900",
        recentTitle: "text-slate-500",
        workspaceBg: "bg-white",
        bubbleUser: "bg-[#f0f4f9] border-[#e3e3e3] text-slate-800",
        bubbleAI: "bg-[#fcfdfe] border-[#e3e3e3] text-slate-800",
        subLabel: "text-slate-500 border-[#e3e3e3]/40",
        pillActive: "bg-indigo-600 text-white border-indigo-500 shadow-md",
        pillInactive: "bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-800 hover:border-slate-300",
        cardBg: "bg-slate-50 hover:bg-slate-100 border-[#e3e3e3] text-slate-800",
        quizBg: "bg-slate-50/50 border-slate-200",
        quizInner: "bg-white border-slate-200",
        floatingBg: "bg-gradient-to-t from-white via-white/95 to-transparent",
        formBg: "bg-[#f0f4f9] hover:bg-[#e3e3e3]/70 border-transparent focus-within:border-indigo-500 focus-within:bg-[#f0f4f9]",
        formInput: "text-slate-800 placeholder-slate-500",
        pillDropdown: "bg-white border-slate-200 text-slate-700",
        dropdownMenu: "bg-white border-slate-200 text-slate-700 hover:bg-slate-100",
        sideToggleBtn: "bg-white text-slate-700 hover:bg-slate-100 border-[#e3e3e3] shadow-md"
      };
    case 'cyberpunk':
      return {
        outerBg: "bg-[#0c051a] text-[#00f0ff] border border-[#ff0055]/30 shadow-2xl",
        sidebarBg: "bg-[#140b28] border-r border-[#ff0055]/25",
        logoText: "text-[#00f0ff]",
        inputBg: "bg-[#0c051a] border-[#00f0ff]/30 text-cyan-300 focus:border-[#ff0055]",
        inputText: "text-cyan-300 placeholder-purple-500",
        newChatBtn: "bg-[#ff0055]/20 hover:bg-[#ff0055]/40 text-cyan-300 border-[#00f0ff]/40",
        recentItemActive: "bg-[#ff0055]/30 text-cyan-300 border border-[#ff0055]/50",
        recentItemHover: "text-[#ff0055]/75 hover:bg-[#ff0055]/15 hover:text-cyan-300",
        recentTitle: "text-[#ff0055]",
        workspaceBg: "bg-[#0c051a]",
        bubbleUser: "bg-[#140b28] border-[#ff0055]/35 text-cyan-300",
        bubbleAI: "bg-[#0c051a] border-[#ff0055]/20 text-cyan-200",
        subLabel: "text-[#ff0055]/80 border-[#ff0055]/20",
        pillActive: "bg-[#ff0055] text-white border-[#ff0055] shadow-md shadow-[#ff0055]/20",
        pillInactive: "bg-[#140b28] text-[#ff0055] border-[#ff0055]/30 hover:text-cyan-300 hover:border-[#ff0055]/60",
        cardBg: "bg-[#140b28] hover:bg-[#1a0e35] border-[#ff0055]/20 text-cyan-300",
        quizBg: "bg-[#140b28]/50 border-[#ff0055]/25",
        quizInner: "bg-[#0c051a] border-[#ff0055]/20",
        floatingBg: "bg-gradient-to-t from-[#0c051a] via-[#0c051a]/95 to-transparent",
        formBg: "bg-[#140b28] hover:bg-[#1e1438] border-transparent focus-within:border-[#ff0055] focus-within:bg-[#140b28]",
        formInput: "text-cyan-300 placeholder-purple-500",
        pillDropdown: "bg-[#0c051a] border-[#00f0ff]/30 text-cyan-300",
        dropdownMenu: "bg-[#140b28] border-[#ff0055]/25 text-cyan-400 hover:bg-[#1e1438]",
        sideToggleBtn: "bg-[#140b28] text-[#00f0ff] hover:bg-[#ff0055]/20 border-[#ff0055]/30 shadow-[#ff0055]/10 shadow-lg"
      };
    case 'sakura':
      return {
        outerBg: "bg-[#fff0f3] text-[#5c1d2e] border border-[#ffccd5] shadow-lg",
        sidebarBg: "bg-[#ffe3e8] border-r border-[#ffccd5]",
        logoText: "text-[#5c1d2e]",
        inputBg: "bg-white border-[#ffccd5] text-[#5c1d2e] focus:border-pink-400",
        inputText: "text-[#5c1d2e] placeholder-pink-300",
        newChatBtn: "bg-[#ffb3c1]/30 hover:bg-[#ffb3c1]/50 text-[#5c1d2e] border-transparent",
        recentItemActive: "bg-[#ffccd5] text-[#5c1d2e] border border-pink-300",
        recentItemHover: "text-[#a8576d] hover:bg-[#ffccd5]/50 hover:text-[#5c1d2e]",
        recentTitle: "text-[#a8576d]",
        workspaceBg: "bg-[#fff8f9]",
        bubbleUser: "bg-[#ffe3e8] border-[#ffccd5] text-[#5c1d2e]",
        bubbleAI: "bg-white border-[#ffccd5] text-[#5c1d2e]",
        subLabel: "text-[#a8576d] border-[#ffccd5]/40",
        pillActive: "bg-[#ff85a1] text-white border-[#ff85a1] shadow-md",
        pillInactive: "bg-[#ffe3e8] text-[#a8576d] border-[#ffccd5] hover:text-[#5c1d2e] hover:border-[#ff85a1]",
        cardBg: "bg-[#ffe3e8]/40 hover:bg-[#ffe3e8]/70 border-[#ffccd5] text-[#5c1d2e]",
        quizBg: "bg-[#ffe3e8]/30 border-[#ffccd5]",
        quizInner: "bg-white border-[#ffccd5]",
        floatingBg: "bg-gradient-to-t from-[#fff8f9] via-[#fff8f9]/95 to-transparent",
        formBg: "bg-[#ffe3e8] hover:bg-[#ffd1dc] border-transparent focus-within:border-pink-400 focus-within:bg-[#ffe3e8]",
        formInput: "text-[#5c1d2e] placeholder-pink-300",
        pillDropdown: "bg-white border-[#ffccd5] text-[#5c1d2e]",
        dropdownMenu: "bg-[#ffe3e8] border-[#ffccd5] text-[#5c1d2e] hover:bg-[#ffb3c1]/30",
        sideToggleBtn: "bg-[#ffe3e8] text-[#5c1d2e] hover:bg-[#ffb3c1]/30 border-[#ffccd5] shadow-sm"
      };
    case 'dark':
    default:
      return {
        outerBg: "bg-[#131314] text-[#e3e3e3] border border-[#2d2d30] shadow-2xl",
        sidebarBg: "bg-[#1e1f20] border-r border-[#2d2d30]",
        logoText: "text-[#e3e3e3]",
        inputBg: "bg-[#131314] border-[#2d2d30] text-slate-200 focus:border-indigo-500/50",
        inputText: "text-slate-200 placeholder-slate-500",
        newChatBtn: "bg-slate-900/60 hover:bg-slate-800 text-slate-200 border-slate-750/70",
        recentItemActive: "bg-slate-800 text-white border border-slate-700/50",
        recentItemHover: "text-slate-400 hover:bg-slate-800/40 hover:text-white",
        recentTitle: "text-slate-500",
        workspaceBg: "bg-[#131314]",
        bubbleUser: "bg-[#1e1f20] border-[#3c3c40] text-slate-100",
        bubbleAI: "bg-[#131314] border-[#2d2d30] text-[#e3e3e3]",
        subLabel: "text-slate-400 border-[#2d2d30]/30",
        pillActive: "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/15",
        pillInactive: "bg-[#1e1f20] text-slate-400 border-[#2d2d30] hover:text-white hover:border-[#3d3d40]",
        cardBg: "bg-[#1e1f20] hover:bg-[#2a2b2c] border-transparent hover:border-[#3d3d40] text-[#e3e3e3]",
        quizBg: "bg-slate-950/40 border-[#2d2d30]",
        quizInner: "bg-slate-900 border-slate-800",
        floatingBg: "bg-gradient-to-t from-[#131314] via-[#131314]/95 to-transparent",
        formBg: "bg-[#1e1f20] hover:bg-[#2a2b2c] border-transparent focus-within:border-[#3d3d40] focus-within:bg-[#1e1f20]",
        formInput: "text-[#e3e3e3] placeholder-slate-500",
        pillDropdown: "bg-[#131314] border-slate-750/40 text-slate-300",
        dropdownMenu: "bg-[#1e1f20] border-[#2d2d30] text-slate-400 hover:bg-slate-800",
        sideToggleBtn: "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border-[#2d2d30] shadow-lg"
      };
  }
};

export default function StudyAI({ theme, onExit }: StudyAIProps) {
  const styles = getThemeStyles(theme);
  const [activeMode, setActiveMode] = useState<ModeType>("DEEP_RESEARCH");
  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let prevIsMobile = window.innerWidth < 1024;
    setIsMobile(prevIsMobile);
    setSidebarOpen(!prevIsMobile);

    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      if (mobile !== prevIsMobile) {
        setIsMobile(mobile);
        setSidebarOpen(!mobile);
        prevIsMobile = mobile;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Scoped User Name logic for greeting
  const [userName, setUserName] = useState("Scholar");

  useEffect(() => {
    try {
      const savedProf = localStorage.getItem("studysphere_user") || localStorage.getItem("av_user_profile");
      if (savedProf) {
        const profile = JSON.parse(savedProf);
        if (profile && profile.name) {
          const firstName = profile.name.split(" ")[0];
          if (firstName) setUserName(firstName);
        }
      }
    } catch (e) {
      console.warn("Could not retrieve user name from profile storage", e);
    }
  }, []);

  // Conversation history to act as a proper streaming conversation!
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([]);
  
  // Current active multimodal file upload states
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    content: string;
    pageCount?: number;
    title?: string;
    author?: string;
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Interactive Quiz states (mapping current active quiz inside the output view)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [shortAnswerInput, setShortAnswerInput] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestionCount, setQuizQuestionCount] = useState<number | "auto">("auto");
  const [generateMaximum, setGenerateMaximum] = useState(false);
  const [activeQuizTurnIdx, setActiveQuizTurnIdx] = useState<number | null>(null);

  // Speech (TTS) States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  interface ChatSession {
    id: string;
    title: string;
    turns: ChatTurn[];
    mode: ModeType;
    timestamp: number;
  }

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [savedSessions, setSavedSessions] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Calculate the maximum possible questions based on file content length
  const calculateMaxQuestions = (fileContent: string | null | undefined): number => {
    if (!fileContent) return 5;
    try {
      const parsed = JSON.parse(fileContent);
      if (Array.isArray(parsed)) {
        return Math.max(3, Math.min(25, parsed.length));
      }
    } catch (e) {
      // ignore JSON error, fallback to text heuristic
    }
    const words = fileContent.trim().split(/\s+/).filter(Boolean).length;
    if (words === 0) return 5;
    // 1 question per 60 words, clamped between 3 and 25
    return Math.max(3, Math.min(25, Math.ceil(words / 60)));
  };

  // Helper to normalize quiz answers to prevent letter-matching mismatches
  const normalizeQuizQuestions = (questions: QuizQuestion[]): QuizQuestion[] => {
    if (!questions || !Array.isArray(questions)) return [];
    return questions.map((q) => {
      if (!q) return q;

      // Default to multiple-choice if options are provided
      const optionsArray = Array.isArray(q.options) ? q.options : [];
      const isMCQ = q.type === "multiple-choice" || (optionsArray.length > 0 && !q.type);

      if (!isMCQ || optionsArray.length === 0) {
        return {
          ...q,
          type: q.type || "short-answer",
          correctAnswer: String(q.correctAnswer ?? "")
        };
      }

      const stringOptions = optionsArray.map(opt => String(opt ?? ""));
      const correctStr = String(q.correctAnswer ?? "").trim();

      // 1. Try exact or case-insensitive match with any option
      let correctOption = stringOptions.find(opt => opt.trim().toLowerCase() === correctStr.toLowerCase());

      if (!correctOption) {
        // 2. Try match on option letter (e.g., "A", "B", "C", "D" or "A.", "Option A")
        const matchLetter = correctStr.match(/^[a-dA-D](?:\.|\b)/i) || correctStr.match(/\b[a-dA-D]\b/i);
        if (matchLetter) {
          const letter = matchLetter[0].replace(/[^a-zA-Z]/g, "").toUpperCase();
          const index = letter.charCodeAt(0) - 65; // 'A' is 65
          if (index >= 0 && index < stringOptions.length) {
            correctOption = stringOptions[index];
          }
        }
      }

      // 3. Fallback: if correctAnswer is a single letter option (like "A", "B", "C", "D") and no direct match
      if (!correctOption && correctStr.length === 1) {
        const letter = correctStr.toUpperCase();
        const index = letter.charCodeAt(0) - 65;
        if (index >= 0 && index < stringOptions.length) {
          correctOption = stringOptions[index];
        }
      }

      return {
        ...q,
        type: "multiple-choice",
        options: stringOptions,
        correctAnswer: correctOption || (stringOptions[0] || correctStr)
      };
    });
  };

  // Keep quiz question count updated if generateMaximum toggle is enabled and attachedFile changes
  useEffect(() => {
    if (generateMaximum) {
      if (attachedFile?.content) {
        setQuizQuestionCount(calculateMaxQuestions(attachedFile.content));
      } else {
        setQuizQuestionCount("auto");
      }
    }
  }, [attachedFile, generateMaximum]);

  // Load saved sessions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("omnimind_ai_sessions");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedSessions(parsed);
        }
      } else {
        // Seed with some default dummy chats so there is search history to begin with!
        const defaultSessions: ChatSession[] = [
          {
            id: "seed-1",
            title: "WebAssembly GC optimization",
            mode: "DEEP_RESEARCH",
            timestamp: Date.now() - 3600000 * 24,
            turns: [
              { role: "user", text: "Explain WebAssembly Garbage Collection optimization", mode: "DEEP_RESEARCH" },
              { role: "model", text: "WebAssembly Garbage Collection (WasmGC) optimizes execution of garbage-collected languages (like Kotlin, Java, Dart) by integrating directly with the host's (e.g., V8) garbage collector instead of shipping their own GC in the binary. This results in significantly smaller binary sizes and better performance due to optimized VM-level heap management.", mode: "DEEP_RESEARCH" }
            ]
          },
          {
            id: "seed-2",
            title: "React render loops & useEffect",
            mode: "INTERACTIVE_QUIZ",
            timestamp: Date.now() - 3600000 * 2,
            turns: [
              { role: "user", text: "Generate an interactive exam on React render loops", mode: "INTERACTIVE_QUIZ" },
              { role: "model", text: "Here is your customized practice challenge! Read the question and options below to evaluate your master score.", mode: "INTERACTIVE_QUIZ" }
            ]
          },
          {
            id: "seed-3",
            title: "Photosynthesis simply explained",
            mode: "LIVE_VOICE",
            timestamp: Date.now() - 1800000,
            turns: [
              { role: "user", text: "Explain photosynthesis to a layperson simply", mode: "LIVE_VOICE" },
              { role: "model", text: "Photosynthesis is essentially nature's solar power. Plants take in sunlight, water from the ground, and carbon dioxide from the air, and turn them into sugar (their food) and oxygen (which they release for us to breathe). It is a beautiful recipe of light, water, and air!", mode: "LIVE_VOICE" }
            ]
          }
        ];
        setSavedSessions(defaultSessions);
        localStorage.setItem("omnimind_ai_sessions", JSON.stringify(defaultSessions));
      }
    } catch (e) {
      console.warn("Could not retrieve sessions from storage", e);
    }
  }, []);

  // Save/Sync active session to history whenever chatTurns changes
  useEffect(() => {
    if (chatTurns.length === 0) return;

    const firstUserTurn = chatTurns.find(t => t.role === "user");
    if (!firstUserTurn) return;

    const title = firstUserTurn.text.length > 35 
      ? firstUserTurn.text.substring(0, 35) + "..." 
      : firstUserTurn.text;

    setSavedSessions((prev) => {
      let updated: ChatSession[];
      const exists = prev.some(s => s.id === currentSessionId);
      
      if (currentSessionId && exists) {
        // Update existing session
        updated = prev.map((s) => 
          s.id === currentSessionId 
            ? { ...s, turns: chatTurns, mode: activeMode, timestamp: Date.now() } 
            : s
        );
      } else {
        // Create new session
        const newId = currentSessionId || "session_" + Date.now();
        if (!currentSessionId) {
          setCurrentSessionId(newId);
        }
        const newSession: ChatSession = {
          id: newId,
          title,
          turns: chatTurns,
          mode: activeMode,
          timestamp: Date.now()
        };
        // Avoid duplicate entry if session ID was pre-allocated but not in prev list
        const filteredPrev = prev.filter(s => s.id !== newId);
        updated = [newSession, ...filteredPrev];
      }
      localStorage.setItem("omnimind_ai_sessions", JSON.stringify(updated));
      return updated;
    });
  }, [chatTurns, activeMode, currentSessionId]);

  const handleLoadSession = (session: ChatSession) => {
    stopSpeaking();
    setChatTurns(session.turns);
    setCurrentSessionId(session.id);
    setActiveMode(session.mode);
    setAttachedFile(null);
    setInputPrompt("");
    
    // If it's a quiz mode session, try to restore quiz questions
    const quizTurnIdx = session.turns.findIndex(t => t.quiz && t.quiz.length > 0);
    if (quizTurnIdx !== -1 && session.turns[quizTurnIdx].quiz) {
      setQuizQuestions(normalizeQuizQuestions(session.turns[quizTurnIdx].quiz || []));
      setCurrentQuizIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuizCompleted(false);
      setQuizScore(0);
      setQuizAnswers({});
      setActiveQuizTurnIdx(quizTurnIdx);
    } else {
      setQuizQuestions([]);
      setActiveQuizTurnIdx(null);
    }
  };

  const filteredSessions = savedSessions.filter((session) => {
    if (!session) return false;
    const titleMatch = (session.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const turnsMatch = Array.isArray(session.turns) && session.turns.some((turn) => 
      turn && typeof turn.text === 'string' && turn.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return titleMatch || turnsMatch;
  });

  // Suggestions prompt mapping to help the user start instantly
  const suggestions: Record<ModeType, { label: string; text: string }[]> = {
    DEEP_RESEARCH: [
      { label: "WebAssembly GC", text: "Explain WebAssembly Garbage Collection optimization" },
      { label: "Spaced Repetition", text: "Longitudinal studies on the Spaced Repetition learning curve" },
      { label: "Irrigation Thermodynamic", text: "Moisture calibration Penman-Monteith transpiration index variables" }
    ],
    MULTIMODAL_STUDY: [
      { label: "Operating Systems", text: "Analyze standard cognitive virtual address routing algorithms" },
      { label: "Feynman Technique", text: "Summarize the Feynman Technique learning milestones" },
      { label: "Complexity Big-O", text: "Break down big-O time complexity with real code examples" }
    ],
    INTERACTIVE_QUIZ: [
      { label: "Calculus Limits", text: "Test my knowledge on Limits and Derivatives calculus" },
      { label: "React Rendering", text: "Generate an interactive exam on React render loops" },
      { label: "General AI Wisdom", text: "Challenge me with a general academic wisdom quiz" }
    ],
    LIVE_VOICE: [
      { label: "Circuit Breakers", text: "Give me an everyday analogy for a circuit breaker pattern" },
      { label: "Photosynthesis simply", text: "Explain photosynthesis to a layperson simply" },
      { label: "V8 Pointer compression", text: "Why do compilers compress heap pointers in JS?" }
    ]
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const parsePdfMetadata = (base64Str: string) => {
    try {
      const binaryString = atob(base64Str);
      let pageCount: number | undefined = undefined;
      
      const regex1 = /\/Type\s*\/Pages[\s\S]*?\/Count\s*(\d+)/g;
      const regex2 = /\/Count\s*(\d+)[\s\S]*?\/Type\s*\/Pages/g;
      
      let match = regex1.exec(binaryString);
      if (match) {
        pageCount = parseInt(match[1], 10);
      } else {
        match = regex2.exec(binaryString);
        if (match) {
          pageCount = parseInt(match[1], 10);
        }
      }
      
      if (!pageCount || pageCount <= 0 || pageCount > 50000) {
        const countRegex = /\/Count\s*(\d+)/g;
        let maxCount = 0;
        let m;
        while ((m = countRegex.exec(binaryString)) !== null) {
          const val = parseInt(m[1], 10);
          if (val > maxCount && val < 50000) {
            maxCount = val;
          }
        }
        if (maxCount > 0) {
          pageCount = maxCount;
        }
      }

      let title: string | undefined = undefined;
      let author: string | undefined = undefined;
      
      const titleRegex = /\/Title\s*\(([^)]+)\)/;
      const authorRegex = /\/Author\s*\(([^)]+)\)/;
      
      const titleMatch = binaryString.match(titleRegex);
      if (titleMatch) {
        title = titleMatch[1].replace(/\\([0-7]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8))).trim();
      }
      
      const authorMatch = binaryString.match(authorRegex);
      if (authorMatch) {
        author = authorMatch[1].replace(/\\([0-7]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8))).trim();
      }
      
      if (!title) {
        const xmpTitleRegex = /<dc:title>[\s\S]*?<rdf:li[^>]*>([\s\S]*?)<\/rdf:li>/;
        const xmpTitleMatch = binaryString.match(xmpTitleRegex);
        if (xmpTitleMatch) {
          title = xmpTitleMatch[1].trim().replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
        }
      }
      
      if (!author) {
        const xmpCreatorRegex = /<dc:creator>[\s\S]*?<rdf:li[^>]*>([\s\S]*?)<\/rdf:li>/;
        const xmpCreatorMatch = binaryString.match(xmpCreatorRegex);
        if (xmpCreatorMatch) {
          author = xmpCreatorMatch[1].trim().replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
        }
      }

      if (title && (title.includes("Untitled") || title.toLowerCase() === "untitled" || title.startsWith("Adobe Illustrator") || title.startsWith("Microsoft Word"))) {
        title = undefined;
      }
      if (author && (author.toLowerCase() === "unknown" || author.toLowerCase() === "user" || author.startsWith("macintosh") || author.startsWith("windows"))) {
        author = undefined;
      }

      return { pageCount, title, author };
    } catch (err) {
      console.error("Failed to parse PDF metadata on client side:", err);
      return {};
    }
  };

  const triggerPdfQuizGeneration = async (fileName: string, content: string) => {
    setLoading(true);
    stopSpeaking();
    
    const userPrompt = `Generate a comprehensive practice quiz from PDF: ${fileName}`;
    const userTurn: ChatTurn = {
      role: "user",
      text: userPrompt,
      mode: "INTERACTIVE_QUIZ",
      attachedFile: {
        name: fileName,
        content: content || ""
      }
    };
    
    setChatTurns((prev) => [...prev, userTurn]);
    
    // Reset attached file after submit
    setAttachedFile(null);
    
    try {
      const res = await fetch("/api/study-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Generate a comprehensive practice quiz from the provided material.",
          routingTag: "INTERACTIVE_QUIZ",
          questionCount: "auto",
          fileContent: content,
          fileName: fileName
        })
      });
      
      const data = await res.json();
      let questionsList: any[] = [];
      if (data) {
        if (Array.isArray(data)) {
          questionsList = data;
        } else if (data.quiz) {
          if (Array.isArray(data.quiz)) {
            questionsList = data.quiz;
          } else if (typeof data.quiz === "object") {
            if (Array.isArray(data.quiz.quiz)) {
              questionsList = data.quiz.quiz;
            } else if (Array.isArray(data.quiz.questions)) {
              questionsList = data.quiz.questions;
            } else {
              const arrKey = Object.keys(data.quiz).find(k => Array.isArray((data.quiz as any)[k]));
              if (arrKey) {
                questionsList = (data.quiz as any)[arrKey];
              }
            }
          }
        } else if (typeof data === "object") {
          if (Array.isArray(data.questions)) {
            questionsList = data.questions;
          } else {
            const arrKey = Object.keys(data).find(k => Array.isArray((data as any)[k]));
            if (arrKey) {
              questionsList = (data as any)[arrKey];
            }
          }
        }
      }
      
      const normalized = normalizeQuizQuestions(questionsList);
      setQuizQuestions(normalized);
      setCurrentQuizIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuizCompleted(false);
      setQuizScore(0);
      setQuizAnswers({});
      setShortAnswerInput("");
      
      setChatTurns((prev) => {
        const nextTurns: ChatTurn[] = [
          ...prev,
          {
            role: "model",
            text: `I have extracted the core educational content from **${fileName}** and designed an interactive, tailored practice challenge for you. Below is your custom-structured quiz. Good luck!`,
            mode: "INTERACTIVE_QUIZ",
            quiz: normalized
          }
        ];
        setActiveQuizTurnIdx(nextTurns.length - 1);
        return nextTurns;
      });
    } catch (err) {
      console.error("PDF Quiz generation failed", err);
      setChatTurns((prev) => [
        ...prev,
        {
          role: "model",
          text: "Failed to generate practice quiz from PDF due to an unexpected connection error. Please try again.",
          mode: "INTERACTIVE_QUIZ"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfQuizGenerate = (file: File) => {
    // Retained for backward-compatibility alias but routes to general file processor
    processFile(file);
  };

  const processFile = (file: File) => {
    const isPdf = file.name.toLowerCase().endsWith(".pdf");
    const reader = new FileReader();
    reader.onload = (event) => {
      let content = event.target?.result as string;
      if (isPdf) {
        const base64Index = content.indexOf(";base64,");
        if (base64Index !== -1) {
          content = content.substring(base64Index + 8);
        }
        
        // Parse metadata
        const meta = parsePdfMetadata(content);
        setAttachedFile({
          name: file.name,
          content: content || "",
          pageCount: meta.pageCount,
          title: meta.title,
          author: meta.author
        });
      } else {
        setAttachedFile({
          name: file.name,
          content: content || ""
        });
      }
      
      // Switch mode to MULTIMODAL automatically if not currently in INTERACTIVE_QUIZ or LIVE_VOICE
      if (activeMode !== "INTERACTIVE_QUIZ" && activeMode !== "LIVE_VOICE") {
        setActiveMode("MULTIMODAL_STUDY");
      }
    };
    
    if (isPdf) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const stopSpeaking = () => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {
      console.warn("speechSynthesis.cancel failed", e);
    }
    setIsSpeaking(false);
  };

  const speakResponse = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Browser speech synthesis is not supported on your system.");
      return;
    }

    stopSpeaking();

    const cleanText = text
      .replace(/[#*`_~]/g, "")
      .replace(/\[\d+\]/g, "")
      .substring(0, 1500);

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith("en-") && v.name.includes("Google")
      ) || voices.find((v) => v.lang.startsWith("en-"));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.rate = 1.0;
      speechUtteranceRef.current = utterance;
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("speechSynthesis.speak failed", err);
      setIsSpeaking(false);
    }
  };

  const handleNewChat = () => {
    stopSpeaking();
    setChatTurns([]);
    setCurrentSessionId(null);
    setAttachedFile(null);
    setInputPrompt("");
    setQuizQuestions([]);
    setQuizCompleted(false);
    setActiveQuizTurnIdx(null);
  };

  const handleQuerySubmit = async (promptOverride?: string) => {
    const targetPrompt = promptOverride || inputPrompt;
    if (!targetPrompt.trim() && !attachedFile) return;

    setLoading(true);
    stopSpeaking();
    setInputPrompt("");

    // Add user's turn to chat
    const userTurn: ChatTurn = {
      role: "user",
      text: targetPrompt,
      mode: activeMode,
      attachedFile: attachedFile ? { ...attachedFile } : null
    };
    
    setChatTurns((prev) => [...prev, userTurn]);
    
    // Reset attached file after submit
    setAttachedFile(null);

    try {
      const res = await fetch("/api/study-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: targetPrompt,
          routingTag: activeMode,
          questionCount: quizQuestionCount,
          fileContent: userTurn.attachedFile?.content || null,
          fileName: userTurn.attachedFile?.name || null
        })
      });

      const data = await res.json();

      if (activeMode === "INTERACTIVE_QUIZ") {
        let questionsList: any[] = [];
        if (data) {
          if (Array.isArray(data)) {
            questionsList = data;
          } else if (data.quiz) {
            if (Array.isArray(data.quiz)) {
              questionsList = data.quiz;
            } else if (typeof data.quiz === "object") {
              if (Array.isArray(data.quiz.quiz)) {
                questionsList = data.quiz.quiz;
              } else if (Array.isArray(data.quiz.questions)) {
                questionsList = data.quiz.questions;
              } else {
                const arrKey = Object.keys(data.quiz).find(k => Array.isArray((data.quiz as any)[k]));
                if (arrKey) {
                  questionsList = (data.quiz as any)[arrKey];
                }
              }
            }
          } else if (typeof data === "object") {
            if (Array.isArray(data.questions)) {
              questionsList = data.questions;
            } else {
              const arrKey = Object.keys(data).find(k => Array.isArray((data as any)[k]));
              if (arrKey) {
                questionsList = (data as any)[arrKey];
              }
            }
          }
        }
        const normalized = normalizeQuizQuestions(questionsList);
        setQuizQuestions(normalized);
        setCurrentQuizIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setQuizCompleted(false);
        setQuizScore(0);
        setQuizAnswers({});
        setShortAnswerInput("");
        
        // Add model turn with quiz questions and set active turn index
        setChatTurns((prev) => {
          const nextTurns: ChatTurn[] = [
            ...prev,
            {
              role: "model",
              text: "Here is your customized practice challenge! Read the question and options below to evaluate your master score.",
              mode: activeMode,
              quiz: normalized
            }
          ];
          setActiveQuizTurnIdx(nextTurns.length - 1);
          return nextTurns;
        });
      } else {
        const textReply = data.reply || "";
        setChatTurns((prev) => [
          ...prev,
          {
            role: "model",
            text: textReply,
            mode: activeMode
          }
        ]);

        if (activeMode === "LIVE_VOICE") {
          speakResponse(textReply);
        }
      }
    } catch (err) {
      console.error("StudyAI Fetch failed", err);
      setChatTurns((prev) => [
        ...prev,
        {
          role: "model",
          text: "An operational connection timeout or internal processing error occurred. Please verify model keys or check system state.",
          mode: activeMode
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Interactive Quiz Functions
  const handleOptionSelect = (option: string) => {
    if (showExplanation) return;
    setSelectedAnswer(option);
  };

  const handleEvaluateAnswer = () => {
    if (!quizQuestions[currentQuizIndex]) return;
    const currentQuestion = quizQuestions[currentQuizIndex];
    let isCorrect = false;

    if (currentQuestion.type === "multiple-choice") {
      if (!selectedAnswer) return;
      isCorrect = selectedAnswer === (currentQuestion.correctAnswer || "");
      setQuizAnswers((prev) => ({ ...prev, [currentQuizIndex]: selectedAnswer }));
    } else {
      if (!shortAnswerInput.trim()) return;
      const cleanAnswer = shortAnswerInput.trim().toLowerCase();
      const cleanCorrect = (currentQuestion.correctAnswer || "").trim().toLowerCase();
      isCorrect = cleanAnswer.includes(cleanCorrect) || (cleanCorrect && cleanCorrect.includes(cleanAnswer));
      setQuizAnswers((prev) => ({ ...prev, [currentQuizIndex]: shortAnswerInput }));
    }

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }

    setShowExplanation(true);
  };

  const handleNextQuizQuestion = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    setShortAnswerInput("");

    if (currentQuizIndex + 1 < quizQuestions.length) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShortAnswerInput("");
    setShowExplanation(false);
    setQuizCompleted(false);
    setQuizScore(0);
    setQuizAnswers({});
  };

  // Mode descriptors
  const modeData = {
    DEEP_RESEARCH: {
      name: "Research",
      tagline: "Flash",
      icon: <Search className="w-4 h-4" />,
      placeholder: "Ask Gemini anything about research..."
    },
    MULTIMODAL_STUDY: {
      name: "Multimodal Study",
      tagline: "Pro",
      icon: <FileText className="w-4 h-4" />,
      placeholder: "Ask about your attached files..."
    },
    INTERACTIVE_QUIZ: {
      name: "Quiz Challenger",
      tagline: "Practice",
      icon: <HelpCircle className="w-4 h-4" />,
      placeholder: "Request a topic quiz (e.g. 'linear algebra exam')..."
    },
    LIVE_VOICE: {
      name: "Live Vocal Tutor",
      tagline: "Voice",
      icon: <Volume2 className="w-4 h-4" />,
      placeholder: "Ask for speech-friendly analogies..."
    }
  };

  // Speech-to-text trigger for Gemini input bar
  const triggerMicInput = () => {
    let SpeechReg: any = null;
    try {
      SpeechReg = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    } catch (e) {
      console.warn("SpeechRecognition access failed", e);
    }

    if (!SpeechReg) {
      alert("Browser Speech recognition is not supported in this frame. Try Chrome or Safari.");
      return;
    }
    try {
      const rec = new SpeechReg();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";
      rec.onstart = () => {
        showGlobalToast("Gemini listening...", "info");
      };
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        if (text) {
          setInputPrompt(text);
        }
      };
      rec.start();
    } catch (err) {
      console.warn("Speech API failed", err);
    }
  };

  const showGlobalToast = (message: string, type: string = "info") => {
    console.log(`[Toast] [${type}] ${message}`);
  };

  return (
    <div className={`flex h-[calc(100vh-140px)] md:h-[calc(100vh-110px)] min-h-[650px] rounded-3xl overflow-hidden shadow-2xl font-sans relative ${styles.outerBg}`} id="gemini-redesign-workspace">
      
      {/* Mobile/Tablet Backdrop overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity duration-300 cursor-pointer" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. LEFT SIDEBAR: Styled exactly like Gemini.com */}
      <aside className={`transition-all duration-300 ${
        sidebarOpen 
          ? isMobile 
            ? 'absolute left-0 top-0 bottom-0 z-40 w-64 p-4 border-r shadow-2xl h-full' 
            : 'w-64 p-4 border-r' 
          : 'w-0 p-0 overflow-hidden border-r-0'
      } ${styles.sidebarBg} flex flex-col justify-between shrink-0 h-full`}>
        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Logo Brand area */}
          <div className="flex items-center justify-between px-1 shrink-0">
            <div className="flex items-center gap-2.5 select-none">
              <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
              <span className={`font-semibold text-base tracking-wide font-display ${styles.logoText}`}>OmniMind AI</span>
            </div>
            
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer shrink-0 border border-slate-750/10 ${styles.newChatBtn}`}
          >
            <Plus className="w-4 h-4 text-slate-300" />
            <span>New chat</span>
          </button>

          {/* Search Chats Input */}
          <div className="relative px-1 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl pl-9 pr-8 py-1.5 text-xs transition-all border focus:outline-none ${styles.inputBg}`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-350"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Recent/History Container */}
          <div className="flex-grow overflow-hidden flex flex-col space-y-2 mt-2 min-h-0">
            <div className="flex items-center justify-between px-2 select-none shrink-0">
              <span className={`text-[10px] font-bold font-mono tracking-widest uppercase ${styles.recentTitle}`}>
                {searchQuery ? "Search Results" : "Recent Chats"}
              </span>
              {savedSessions.length > 0 && !searchQuery && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {showClearConfirm ? (
                    <div className="flex items-center gap-1 font-mono text-[10px]">
                      <span className="text-slate-500">Sure?</span>
                      <button
                        onClick={() => {
                          setSavedSessions([]);
                          localStorage.removeItem("omnimind_ai_sessions");
                          handleNewChat();
                          setShowClearConfirm(false);
                        }}
                        className="text-rose-400 hover:text-rose-300 font-bold transition px-1"
                        title="Confirm clear all history"
                      >
                        Yes
                      </button>
                      <span className="text-slate-600">/</span>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="text-slate-400 hover:text-slate-350 transition px-1"
                        title="Cancel clearing history"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="text-[10px] text-slate-500 hover:text-rose-400 font-mono transition"
                      title="Clear history"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-6 text-slate-600 text-xs italic select-none">
                  {searchQuery ? "No matches found" : "No recent chats"}
                </div>
              ) : (
                filteredSessions.map((session) => {
                  const isActive = session.id === currentSessionId;
                  return (
                    <div 
                      key={session.id}
                      className={`group flex items-center justify-between p-2 rounded-xl transition-all text-xs cursor-pointer select-none ${
                        isActive 
                          ? styles.recentItemActive 
                          : styles.recentItemHover
                      }`}
                      onClick={() => handleLoadSession(session)}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <History className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-350 shrink-0" />
                        <span className="truncate">{session.title}</span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSavedSessions((prev) => {
                            const updated = prev.filter((s) => s.id !== session.id);
                            localStorage.setItem("omnimind_ai_sessions", JSON.stringify(updated));
                            return updated;
                          });
                          if (isActive) {
                            handleNewChat();
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer User detail / Exit control */}
        <div className="border-t border-[#2d2d30] pt-4 flex flex-col gap-2.5">
          {onExit && (
            <button
              onClick={onExit}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700/40 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <XCircle className="w-4 h-4 text-rose-455" />
              <span>Exit to Suite</span>
            </button>
          )}
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE AREA */}
      <section className={`flex-1 flex flex-col h-full overflow-hidden relative ${styles.workspaceBg}`}>
        
        {/* Toggle sidebar trigger when closed */}
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className={`absolute top-4 left-4 p-2 rounded-xl transition-all z-30 flex items-center justify-center border cursor-pointer ${styles.sideToggleBtn}`}
            title="Open sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Hidden native input for files upload */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".txt,.md,.json,.js,.ts,.pdf"
          onChange={handleFileChange}
        />

        {/* Mid Container: Welcoming landing or list of chat bubbles */}
        <div className={`flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 ${activeQuizTurnIdx !== null && quizQuestions.length > 0 && !quizCompleted ? "pb-12" : "pb-36"}`}>
          
          {chatTurns.length === 0 ? (
            /* BRAND WELCOMING SCREEN: Clean, interactive starting dashboard */
            <div className="h-full flex flex-col justify-center max-w-2xl mx-auto space-y-6 animate-fade-in py-12">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>OmniMind AI Sandbox</span>
                </div>
                <h2 className="text-xl font-medium opacity-90">
                  Select a mode or enter a question to start learning
                </h2>
              </div>

              {/* Mode Selector Buttons */}
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto py-2">
                {(["DEEP_RESEARCH", "MULTIMODAL_STUDY", "INTERACTIVE_QUIZ"] as ModeType[]).map((mode) => {
                  const isActive = activeMode === mode;
                  const labelMap: Record<ModeType, string> = {
                    DEEP_RESEARCH: "🔍 Deep Research",
                    MULTIMODAL_STUDY: "📂 Syllabus Pro",
                    INTERACTIVE_QUIZ: "✍️ Practice Quiz",
                    LIVE_VOICE: "🗣️ Speech Voice"
                  };
                  return (
                    <button
                      key={mode}
                      onClick={() => {
                        setActiveMode(mode);
                        stopSpeaking();
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer border ${
                        isActive 
                          ? styles.pillActive 
                          : styles.pillInactive
                      }`}
                    >
                      {labelMap[mode]}
                    </button>
                  );
                })}
              </div>

              {/* PDF/Study Material Verification & Launch Panel or Direct Upload Card */}
              {activeMode === "INTERACTIVE_QUIZ" ? (
                attachedFile ? (
                  <div className={`p-6 border border-indigo-500/20 rounded-3xl space-y-4 shadow-xl ${styles.cardBg} animate-fade-in`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-5 h-5 animate-pulse" />
                        </div>
                        <div className="text-left leading-normal">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                            <span>Document Attached & Verified</span>
                          </h3>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-450 font-bold uppercase tracking-wider font-mono">
                            Review metadata below before generating quiz
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeAttachedFile}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        title="Remove attached document"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-slate-900/10 dark:bg-slate-950/40 border border-slate-750/30 text-left text-xs">
                      <div className="space-y-0.5 animate-fade-in">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Document Title</p>
                        <p className="font-bold text-slate-750 dark:text-slate-200 truncate" title={attachedFile.title || attachedFile.name}>
                          {attachedFile.title || attachedFile.name}
                        </p>
                      </div>
                      <div className="space-y-0.5 animate-fade-in">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Document Author</p>
                        <p className="font-bold text-slate-750 dark:text-slate-200 truncate" title={attachedFile.author || "Not specified"}>
                          {attachedFile.author || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-0.5 animate-fade-in">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Total Page Count</p>
                        <p className="font-bold text-slate-750 dark:text-slate-200">
                          {attachedFile.pageCount ? `${attachedFile.pageCount} pages` : "Plain text / Unstructured"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-left">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>
                          Please confirm this is the correct material. Clicking below will instantly construct a personalized interactive quiz.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => triggerPdfQuizGeneration(attachedFile.name, attachedFile.content)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition cursor-pointer text-xs shadow-md shadow-indigo-600/10 inline-flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-200" />
                        <span>Start Interactive Quiz</span>
                      </button>
                    </div>

                    {/* Alternate Study Tools section within the validation card */}
                    <div className="pt-3.5 border-t border-slate-500/10 text-left space-y-2 animate-fade-in">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-extrabold flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-450" />
                        <span>Or process with Quick Study Tools:</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          {
                            id: "summarize",
                            label: "📝 Summarize Material",
                            prompt: "Provide a comprehensive, beautifully structured executive summary of this study document. Highlight the main thesis, core arguments, and critical bullet-point takeaways.",
                            hoverStyle: "hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 text-emerald-600 dark:text-emerald-450"
                          },
                          {
                            id: "flashcards",
                            label: "🃏 Create Flashcards",
                            prompt: "Based on this document, create a set of highly effective flashcards (Questions and Answers) covering all the key concepts for active recall study.",
                            hoverStyle: "hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 text-amber-600 dark:text-amber-450"
                          },
                          {
                            id: "explain",
                            label: "💡 Explain Concepts",
                            prompt: "Identify the most complex or advanced theories in this document and break them down into simple terms with clear, real-world analogies.",
                            hoverStyle: "hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-400 text-indigo-600 dark:text-indigo-450"
                          },
                          {
                            id: "definitions",
                            label: "📖 Extract Glossary",
                            prompt: "Extract a concise dictionary/glossary of all critical terms, vocabulary, jargon, and mathematical formulas mentioned in this document along with clear definitions.",
                            hoverStyle: "hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400 text-cyan-600 dark:text-cyan-450"
                          }
                        ].map((chip) => (
                          <button
                            key={chip.id}
                            type="button"
                            onClick={() => {
                              // Automatically switch mode to MULTIMODAL_STUDY if running a non-quiz action
                              setActiveMode("MULTIMODAL_STUDY");
                              handleQuerySubmit(chip.prompt);
                            }}
                            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold bg-slate-900/15 dark:bg-slate-950/25 border-slate-750/30 hover:scale-102 active:scale-98 transition-all cursor-pointer ${chip.hoverStyle}`}
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* PDF Practice Quiz Generator Card */
                  <div className={`p-6 border-2 border-dashed border-indigo-500/20 dark:border-indigo-500/35 rounded-3xl text-center space-y-4 hover:border-indigo-500/50 transition-all duration-300 ${styles.cardBg}`}>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto text-indigo-500">
                      <FileText className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Upload Study Material PDF</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Select a textbook chapter, study notes, or research PDF to instantly generate a fully customized practice test.
                      </p>
                    </div>
                    <div className="pt-1">
                      <input
                        type="file"
                        id="welcome-pdf-quiz-upload"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            processFile(e.target.files[0]);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById("welcome-pdf-quiz-upload")?.click()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition cursor-pointer text-xs shadow-md inline-flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Choose PDF File
                      </button>
                    </div>
                  </div>
                )
              ) : null}

              {/* Suggestions grid matching the aesthetic cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
                {suggestions[activeMode].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputPrompt(item.text);
                      handleQuerySubmit(item.text);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer active:scale-98 group flex flex-col justify-between min-h-32 ${styles.cardBg}`}
                  >
                    <p className="text-xs font-medium leading-relaxed opacity-85 group-hover:opacity-100">
                      "{item.text}"
                    </p>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-500/10">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* CHAT BUBBLES CONVERSATION LOGS VIEW */
            <div className="max-w-2xl mx-auto space-y-6">
              {chatTurns.map((turn, tIdx) => {
                const isUser = turn.role === "user";
                const isModeVoice = turn.mode === "LIVE_VOICE";

                return (
                  <div key={tIdx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start gap-3.5 max-w-full animate-fade-in`}>
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-orange-600 text-white font-mono text-[10px] font-black flex items-center justify-center shrink-0 uppercase select-none shadow-md">
                        AI
                      </div>
                    )}

                    <div className={`p-5 rounded-2xl max-w-[85%] border shadow-sm space-y-3 ${
                      isUser
                        ? styles.bubbleUser
                        : styles.bubbleAI
                    }`}>
                      
                      {/* Sub-label indicators */}
                      <div className={`flex items-center justify-between text-[10px] font-mono tracking-wider select-none border-b pb-1.5 mb-1 ${styles.subLabel}`}>
                        <span className="font-bold uppercase">{isUser ? "You" : `OmniMind (${turn.mode || "Flash"})`}</span>
                        {!isUser && (
                          <div className="flex items-center gap-2 text-indigo-400 uppercase font-black text-[9px]">
                            <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                            <span>Structured Analysis</span>
                          </div>
                        )}
                      </div>

                      {/* Attached file thumbnail */}
                      {turn.attachedFile && (
                        <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl max-w-xs text-xs">
                          <FileText className="w-4 h-4 text-emerald-500" />
                          <div className="min-w-0 flex-1 leading-normal">
                            <p className="font-bold truncate text-slate-200">{turn.attachedFile.name}</p>
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Pasted file contents</p>
                          </div>
                        </div>
                      )}

                      {/* Main reply text parsed simply with markdown-like elements */}
                      <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap select-text font-normal font-sans prose prose-invert">
                        {turn.text.split("\n").map((line, lIdx) => {
                          const cleanLine = line.trim();
                          if (cleanLine.startsWith("###")) {
                            return <h3 key={lIdx} className="text-sm font-black text-indigo-400 mt-3 mb-1.5 uppercase font-mono">{cleanLine.replace("###", "").trim()}</h3>;
                          }
                          if (cleanLine.startsWith("##")) {
                            return <h2 key={lIdx} className="text-base font-bold text-slate-100 mt-4 mb-2 border-b border-[#2d2d30]/60 pb-0.5">{cleanLine.replace("##", "").trim()}</h2>;
                          }
                          if (cleanLine.startsWith("#")) {
                            return <h1 key={lIdx} className="text-lg font-black text-slate-100 mt-5 mb-3">{cleanLine.replace("#", "").trim()}</h1>;
                          }
                          if (cleanLine.startsWith("-") || cleanLine.startsWith("*")) {
                            return <li key={lIdx} className="ml-4 list-disc text-slate-355 my-1 font-sans">{cleanLine.substring(1).trim()}</li>;
                          }
                          return <p key={lIdx} className="my-1.5">{cleanLine}</p>;
                        })}
                      </div>

                      {/* Display Box: Interactive Quiz Panel inside chat stream */}
                      {turn.quiz && turn.quiz.length > 0 && (
                        <div className={`p-5 rounded-2xl border space-y-5 my-3 shadow-xl text-xs transition-all duration-300 ${styles.quizBg}`}>
                          {activeQuizTurnIdx !== tIdx || quizQuestions.length === 0 || !quizQuestions[currentQuizIndex] ? (
                            <div className="text-center py-6 text-slate-500">
                              <p className="font-semibold text-sm">Interactive Quiz Available</p>
                              <p className="text-[11px] mt-1 text-slate-400">Click below to load and play this customized practice challenge.</p>
                              <button
                                onClick={() => {
                                  setQuizQuestions(normalizeQuizQuestions(turn.quiz || []));
                                  setCurrentQuizIndex(0);
                                  setSelectedAnswer(null);
                                  setShowExplanation(false);
                                  setQuizCompleted(false);
                                  setQuizScore(0);
                                  setQuizAnswers({});
                                  setShortAnswerInput("");
                                  setActiveQuizTurnIdx(tIdx);
                                }}
                                className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition cursor-pointer text-xs"
                              >
                                Load Practice Quiz
                              </button>
                            </div>
                          ) : !quizCompleted ? (
                            <div className="space-y-4">
                              {/* Question info */}
                              <div className={`p-4 border rounded-xl shadow-xs ${styles.quizInner}`}>
                                <span className="text-[10px] font-mono font-extrabold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider block w-max mb-2">
                                  Question {currentQuizIndex + 1} of {quizQuestions.length}
                                </span>
                                <p className="text-sm font-bold leading-relaxed text-slate-800 dark:text-slate-100">
                                  {quizQuestions[currentQuizIndex]?.question}
                                </p>
                              </div>

                              {/* MCQ choices */}
                              {quizQuestions[currentQuizIndex]?.type === "multiple-choice" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                  {quizQuestions[currentQuizIndex]?.options?.map((option, idx) => {
                                    const isSelected = selectedAnswer === option;
                                    let optionClass = "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800";
                                    
                                    if (isSelected) {
                                      optionClass = "border-indigo-500 bg-indigo-50 dark:bg-indigo-550/10 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm";
                                    }
                                    if (showExplanation) {
                                      const isCorrectChoice = option === quizQuestions[currentQuizIndex]?.correctAnswer;
                                      if (isCorrectChoice) {
                                        optionClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold";
                                      } else if (isSelected) {
                                        optionClass = "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 line-through";
                                      } else {
                                        optionClass = "opacity-50 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600";
                                      }
                                    }
                                    return (
                                      <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(option)}
                                        disabled={showExplanation}
                                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${optionClass}`}
                                      >
                                        <span className="font-mono text-slate-400 mr-1.5">{String.fromCharCode(65 + idx)}.</span>
                                        {option}
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                /* Short answer input */
                                <input
                                  type="text"
                                  value={shortAnswerInput}
                                  onChange={(e) => setShortAnswerInput(e.target.value)}
                                  disabled={showExplanation}
                                  placeholder="Type your exact solution here..."
                                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-inner"
                                />
                              )}

                              {/* Evaluation triggers */}
                              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3 text-[11px]">
                                <div>
                                  {showExplanation && (
                                    <div className="font-bold flex items-center gap-1">
                                      {selectedAnswer === quizQuestions[currentQuizIndex]?.correctAnswer || 
                                       (quizQuestions[currentQuizIndex]?.correctAnswer && shortAnswerInput.trim().toLowerCase().includes(quizQuestions[currentQuizIndex]?.correctAnswer?.toLowerCase() || "")) ? (
                                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">✓ Correct Answer!</span>
                                      ) : (
                                        <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-bold">✗ Incorrect Choice</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  {!showExplanation ? (
                                    <button
                                      onClick={handleEvaluateAnswer}
                                      disabled={quizQuestions[currentQuizIndex]?.type === "multiple-choice" ? !selectedAnswer : !shortAnswerInput.trim()}
                                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-lg cursor-pointer transition"
                                    >
                                      Submit Answer
                                    </button>
                                  ) : (
                                    <button
                                      onClick={handleNextQuizQuestion}
                                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg cursor-pointer transition"
                                    >
                                      {currentQuizIndex + 1 < quizQuestions.length ? "Next Question" : "Finish Quiz"}
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Step breakdown */}
                              {showExplanation && (
                                <div className="p-4 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 dark:border-amber-500/20 rounded-xl text-[11px] leading-relaxed animate-fade-in">
                                  <p className="font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Logic Breakdown:</span>
                                  </p>
                                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                                    {quizQuestions[currentQuizIndex]?.explanation}
                                  </p>
                                  <p className="font-mono text-indigo-700 dark:text-indigo-400 mt-2 text-xs">
                                    <strong>Correct Answer:</strong> <span className="underline decoration-indigo-400 decoration-2 font-bold">{quizQuestions[currentQuizIndex]?.correctAnswer}</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            /* Score details completed */
                            <div className="text-center py-6 space-y-4 max-w-sm mx-auto animate-fade-in">
                              <div className="inline-flex p-3 bg-amber-500/10 rounded-full text-amber-500">
                                <Award className="w-10 h-10" />
                              </div>
                              <div className="space-y-2 leading-normal">
                                <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">Practice Quiz Completed!</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                  Your final mastery grade is: 
                                  <span className="block text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                                    {quizQuestions.length > 0 ? Math.round((quizScore / quizQuestions.length) * 100) : 0}%
                                  </span>
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5 block">
                                    ({quizScore} out of {quizQuestions.length} correct)
                                  </span>
                                </p>
                              </div>
                              <button
                                onClick={handleRestartQuiz}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/10 rounded-xl font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer transition hover:scale-102 active:scale-98"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Restart Quiz</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Interactive audio player controls for Gemini replies */}
                      {!isUser && (
                        <div className="flex gap-4 items-center pt-2.5 border-t border-[#2d2d30]/40 text-[10px] text-slate-455 font-bold uppercase tracking-wide select-none">
                          <button
                            onClick={() => speakResponse(turn.text)}
                            className="hover:text-amber-500 cursor-pointer flex items-center gap-1 transition"
                            title="Play Voice Synthesis of reply"
                          >
                            <Volume2 className="w-4 h-4 text-slate-400 hover:text-amber-400" />
                            <span>Voice Speak</span>
                          </button>
                          
                          {isSpeaking && (
                            <button
                              onClick={stopSpeaking}
                              className="hover:text-red-500 cursor-pointer flex items-center gap-1 transition"
                            >
                              <VolumeX className="w-4 h-4 text-red-500" />
                              <span>Stop Speech</span>
                            </button>
                          )}
                        </div>
                      )}

                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 uppercase select-none border border-slate-700/60 shadow-sm">
                        ME
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Simulated loading bubble */}
          {loading && (
            <div className="flex justify-start items-start gap-3.5 max-w-2xl mx-auto animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white font-mono text-[10px] font-black flex items-center justify-center shrink-0 uppercase select-none shadow-md">
                AI
              </div>
              <div className={`p-4 rounded-2xl space-y-2.5 max-w-sm border ${styles.bubbleAI}`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce" />
                  <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-black">OmniMind AI is formulating response...</span>
                </div>
                <p className="text-xs italic opacity-80">
                  {activeMode === "DEEP_RESEARCH" && "Searching scholarly indices & live Google grounding..."}
                  {activeMode === "MULTIMODAL_STUDY" && "Reading pasted text note or dropped file details..."}
                  {activeMode === "INTERACTIVE_QUIZ" && "Structuring practice test questions matrix..."}
                  {activeMode === "LIVE_VOICE" && "Crafting speech-optimized analogy paragraph..."}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* 3. CENTER FLOATING ASK GEMINI CONTAINER: Styled exactly like Gemini.com */}
        {!(activeQuizTurnIdx !== null && quizQuestions.length > 0 && !quizCompleted) && (
          <div className={`absolute bottom-2 md:bottom-4 right-0 left-0 p-4 md:p-6 select-none z-10 ${styles.floatingBg}`}>
            <div className="max-w-2xl mx-auto space-y-2 relative">
              
              {/* Attached File Indicator & Quick Actions row inside input block */}
              {attachedFile && (
                <div className={`p-3 border border-slate-750/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg animate-fade-in ${styles.formBg}`}>
                  <div className="flex items-center gap-2.5 shrink-0 max-w-full">
                    <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="flex flex-col text-left leading-tight min-w-0">
                      <span className="font-bold max-w-[130px] md:max-w-[180px] truncate text-slate-800 dark:text-slate-100 text-xs" title={attachedFile.name}>
                        {attachedFile.name}
                      </span>
                      {attachedFile.pageCount && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-450 font-semibold font-mono">
                          {attachedFile.pageCount} pages {attachedFile.title ? `• ${attachedFile.title.substring(0, 16)}...` : ""}
                        </span>
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={removeAttachedFile}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer ml-1 select-none p-1 rounded-lg hover:bg-slate-500/10 transition"
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Horizontal Scrollable Quick Actions container */}
                  <div className="flex items-center gap-2 overflow-x-auto w-full scrollbar-none pb-1 md:pb-0">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 font-mono shrink-0 whitespace-nowrap">
                      Quick Study:
                    </span>
                    <div className="flex gap-1.5 shrink-0">
                      {[
                        {
                          id: "summarize",
                          label: "📝 Summarize",
                          prompt: "Provide a comprehensive, beautifully structured executive summary of this study document. Highlight the main thesis, core arguments, and critical bullet-point takeaways.",
                          hoverStyle: "hover:bg-emerald-500/10 hover:border-emerald-500/35 hover:text-emerald-400 text-emerald-600 dark:text-emerald-450"
                        },
                        {
                          id: "flashcards",
                          label: "🃏 Flashcards",
                          prompt: "Based on this document, create a set of highly effective flashcards (Questions and Answers) covering all the key concepts for active recall study.",
                          hoverStyle: "hover:bg-amber-500/10 hover:border-amber-500/35 hover:text-amber-400 text-amber-600 dark:text-amber-450"
                        },
                        {
                          id: "explain",
                          label: "💡 Explain Concepts",
                          prompt: "Identify the most complex or advanced theories in this document and break them down into simple terms with clear, real-world analogies.",
                          hoverStyle: "hover:bg-indigo-500/10 hover:border-indigo-500/35 hover:text-indigo-400 text-indigo-600 dark:text-indigo-450"
                        },
                        {
                          id: "definitions",
                          label: "📖 Definitions",
                          prompt: "Extract a concise dictionary/glossary of all critical terms, vocabulary, jargon, and mathematical formulas mentioned in this document along with clear definitions.",
                          hoverStyle: "hover:bg-cyan-500/10 hover:border-cyan-500/35 hover:text-cyan-400 text-cyan-600 dark:text-cyan-450"
                        }
                      ].map((chip) => (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => {
                            // Automatically switch mode to MULTIMODAL_STUDY if running a study action
                            if (activeMode !== "MULTIMODAL_STUDY") {
                              setActiveMode("MULTIMODAL_STUDY");
                            }
                            handleQuerySubmit(chip.prompt);
                          }}
                          className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold bg-slate-900/15 dark:bg-slate-950/20 border-slate-750/30 hover:scale-102 active:scale-98 transition-all cursor-pointer whitespace-nowrap ${chip.hoverStyle}`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Capsule style Input block */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleQuerySubmit(); }}
                className={`w-full border p-2 pl-4 pr-3 flex items-center justify-between gap-3 shadow-2xl transition rounded-full ${styles.formBg}`}
              >
                {/* Attachment selector */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 rounded-full bg-slate-900/10 hover:bg-slate-900/25 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-400 border border-slate-750/30 flex items-center justify-center transition cursor-pointer shrink-0 select-none"
                  title="Attach text notes, markdown, or JSON files"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Text Input prompt */}
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder={modeData[activeMode].placeholder}
                  className={`flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-xs md:text-sm py-1.5 font-medium ${styles.formInput}`}
                />

                {/* Mode indicator drop down (simulating model selector Flash) */}
                <div className="relative group shrink-0">
                  <button
                    type="button"
                    className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold font-mono tracking-wider flex items-center gap-1.5 cursor-pointer uppercase border ${styles.pillDropdown}`}
                    title="Switch study operational mode"
                  >
                    <span>{modeData[activeMode].tagline}</span>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </button>
                  {/* Dropdown list */}
                  <div className={`absolute bottom-11 right-0 w-44 border rounded-2xl shadow-2xl p-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition duration-150 z-50 text-[11px] font-sans ${styles.dropdownMenu}`}>
                    {(["DEEP_RESEARCH", "MULTIMODAL_STUDY", "INTERACTIVE_QUIZ"] as ModeType[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          setActiveMode(mode);
                          stopSpeaking();
                        }}
                        className="w-full text-left p-2 rounded-lg font-bold transition flex items-center gap-2 cursor-pointer hover:bg-slate-500/10 hover:text-indigo-400"
                      >
                        <span className="capitalize">{mode.toLowerCase().replace("_", " ")}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice microphone recorder dictation */}
                <button
                  type="button"
                  onClick={triggerMicInput}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition cursor-pointer shrink-0 select-none ${styles.pillDropdown}`}
                  title="Dictate query via voice transcript"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Submit Trigger */}
                <button
                  type="submit"
                  disabled={loading || (!inputPrompt.trim() && !attachedFile)}
                  className="w-9 h-9 rounded-full bg-orange-600 hover:bg-orange-550 text-white flex items-center justify-center transition disabled:opacity-30 disabled:scale-100 shrink-0 cursor-pointer shadow-md select-none active:scale-95"
                  title="Send query to OmniMind AI"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>
        )}

      </section>

    </div>
  );
}
