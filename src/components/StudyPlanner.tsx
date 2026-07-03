import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  BookOpen, 
  CheckSquare, 
  Square, 
  Trash2, 
  Activity, 
  Flame, 
  FileText,
  AlertCircle,
  TrendingUp,
  Bookmark,
  Camera,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Zap,
  ClipboardList,
  Send,
  Check
} from 'lucide-react';
import { StudyPlanType, StudyDaySchedule, TaskType } from '../types';
import { playClickSound, playSuccessChime } from '../utils/audio';

interface StudyPlannerProps {
  studyPlans: StudyPlanType[];
  setStudyPlans: React.Dispatch<React.SetStateAction<StudyPlanType[]>>;
  setTasks?: React.Dispatch<React.SetStateAction<TaskType[]>>;
}

export default function StudyPlanner({ studyPlans, setStudyPlans, setTasks }: StudyPlannerProps) {
  // Input fields
  const [courseName, setCourseName] = useState('');
  const [syllabusText, setSyllabusText] = useState('');
  const [examDate, setExamDate] = useState('');

  // AI Generation states
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [exportedPlans, setExportedPlans] = useState<Record<string, boolean>>({});

  // Scanning features
  const [inputMethod, setInputMethod] = useState<'text' | 'image'>('text');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Inline deletion confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    playClickSound();
    setAnalysisError(null);
    try {
      setIsCameraActive(true);
      // Let React render the video node
      setTimeout(async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch (err) {
          console.error("Camera access failed", err);
          setAnalysisError("Could not access device camera. Please make sure camera permissions are enabled, or select/upload a photo file instead.");
          setIsCameraActive(false);
        }
      }, 150);
    } catch (err) {
      console.error(err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    playClickSound();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    playClickSound();
    if (!videoRef.current) return;
    
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      // Set canvas dimension based on stream size
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(dataUrl);
        setImageMimeType('image/jpeg');
      }
      stopCamera();
    } catch (err) {
      console.error("Capture failed", err);
      setAnalysisError("Failed to capture image frame from video stream.");
    }
  };

  const processSyllabusFile = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setAnalysisError("Please choose a valid image file (PNG, JPG, JPEG, or WEBP) or a PDF syllabus document.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setImageMimeType(file.type || 'application/pdf');
      setSelectedFileName(file.name);
      setAnalysisError(null);
    };
    reader.onerror = () => {
      setAnalysisError("Failed to read selected file.");
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    playClickSound();
    const file = e.target.files?.[0];
    if (file) {
      processSyllabusFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    playClickSound();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSyllabusFile(file);
    }
  };

  const analyzeSyllabusPhoto = async () => {
    if (!selectedImage || !imageMimeType) return;
    
    playClickSound();
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Extract pure base64 characters from dataURL
      const base64Data = selectedImage.split(',')[1];
      
      const response = await fetch('/api/study-planner/analyze-syllabus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageFile: base64Data,
          imageMimeType
        })
      });

      if (!response.ok) {
        throw new Error('Syllabus analysis failed server-side');
      }

      const data = await response.json();
      if (data.topics && Array.isArray(data.topics)) {
        if (data.courseName) {
          setCourseName(data.courseName);
        }
        setSyllabusText(data.topics.join(', '));
        setInputMethod('text'); // Switch back to text input view so they can review and edit
        playSuccessChime();
      } else {
        throw new Error('Invalid response format received from AI');
      }
    } catch (err) {
      console.error(err);
      setAnalysisError("AI syllabus scanning failed. Loaded our premium offline syllabus template into the fields instead.");
      
      // Load fallback values
      setCourseName("Applied Systems Engineering");
      setSyllabusText("Introduction & Fundamental Architecture, Core Process Management & Multi-threading, Memory Allocation & Virtualization Protocols, Input-Output Systems & Storage Calibration, Network Distribution & IPC Mechanics, Full Mock Review & Synthesis Exercises");
      setInputMethod('text');
      playSuccessChime();
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate syllabus topics with Gemini AI
  const generateSyllabusTopicsWithAI = async () => {
    if (!courseName.trim()) {
      setAnalysisError("Please enter a Course Subject Name first!");
      return;
    }
    
    playClickSound();
    setIsGeneratingTopics(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/study-planner/generate-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseName: courseName.trim() })
      });

      if (!response.ok) {
        throw new Error('Syllabus generation failed');
      }

      const data = await response.json();
      if (data.topics && Array.isArray(data.topics)) {
        setSyllabusText(data.topics.join(', '));
        playSuccessChime();
      } else {
        throw new Error('Invalid format returned from AI');
      }
    } catch (err) {
      console.error(err);
      setAnalysisError("Could not generate syllabus topics using AI. Try typing them instead.");
    } finally {
      setIsGeneratingTopics(false);
    }
  };

  // Generate intelligent day-by-day study plan with Gemini AI
  const handleAIGeneratePlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!courseName.trim() || !syllabusText.trim() || !examDate) return;

    playClickSound();
    setIsGeneratingPlan(true);
    setAnalysisError(null);

    // Calculate days remaining
    const targetDate = new Date(examDate);
    const today = new Date();
    targetDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    const diffMs = targetDate.getTime() - today.getTime();
    let daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const planDays = Math.min(daysRemaining, 7);

    try {
      const response = await fetch('/api/study-planner/generate-ai-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName: courseName.trim(),
          syllabusText: syllabusText.trim(),
          daysRemaining: planDays
        })
      });

      if (!response.ok) {
        throw new Error('AI Plan generation failed, falling back to local generation');
      }

      const data = await response.json();
      if (data.schedule && Array.isArray(data.schedule)) {
        const dailySchedules: StudyDaySchedule[] = data.schedule.map((dayItem: any, idx: number) => {
          const loopDate = new Date();
          loopDate.setDate(today.getDate() + idx);
          const formattedLoopDate = loopDate.toISOString().split('T')[0];

          const topics = Array.isArray(dayItem.topics) 
            ? dayItem.topics.map((t: string, tIdx: number) => ({
                id: `ai-topic-${idx}-${tIdx}-${Date.now()}`,
                title: t,
                completed: false
              }))
            : [{ id: `ai-topic-${idx}-0-${Date.now()}`, title: String(dayItem.topics || "General study session"), completed: false }];

          return {
            date: formattedLoopDate,
            dayNumber: dayItem.dayNumber || (idx + 1),
            topics
          };
        });

        const newPlan: StudyPlanType = {
          id: `plan-${Date.now()}`,
          courseName: courseName.trim(),
          syllabus: syllabusText.trim(),
          examDate,
          daysRemaining,
          schedule: dailySchedules
        };

        setStudyPlans(prev => [newPlan, ...prev]);
        playSuccessChime();

        // Reset inputs
        setCourseName('');
        setSyllabusText('');
        setExamDate('');
        setSelectedImage(null);
        setImageMimeType(null);
        setSelectedFileName(null);
        setAnalysisError(null);
      } else {
        throw new Error('Invalid schedule format returned from AI');
      }
    } catch (err) {
      console.warn("AI Study planner generation failed. Executing fallback mathematical allocator.", err);
      // Fallback directly to local generation
      const eventMock = { preventDefault: () => {} } as React.FormEvent;
      handleAutoGenerate(eventMock);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Export full day-by-day plan to the Task Manager suite
  const sendPlanToTaskManager = (plan: StudyPlanType) => {
    if (!setTasks) return;
    playClickSound();

    const newTasks: TaskType[] = plan.schedule.map((day, index) => {
      return {
        id: `study-task-${plan.id}-${day.date}-${index}-${Date.now()}`,
        title: `📖 Study: ${plan.courseName} - Day ${day.dayNumber}`,
        notes: `Automated study schedule for ${plan.courseName}.\nTarget Date: ${day.date}\nSyllabus reference: ${plan.syllabus}`,
        priority: 'high',
        category: 'Study',
        dueDate: day.date,
        dueTime: '18:00',
        completed: false,
        subtasks: day.topics.map((topic, tIdx) => ({
          id: `study-sub-${topic.id}-${tIdx}-${Date.now()}`,
          title: topic.title,
          completed: topic.completed
        })),
        recurring: 'none',
        reminder: true,
        reminderTime: `${day.date}T18:00`
      };
    });

    setTasks(prev => {
      const filteredPrev = prev.filter(pTask => 
        !newTasks.some(nTask => nTask.title === pTask.title && nTask.dueDate === pTask.dueDate)
      );
      const updated = [...newTasks, ...filteredPrev];
      try {
        localStorage.setItem('avishkar_tasks', JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save exported tasks:", err);
      }
      return updated;
    });

    setExportedPlans(prev => ({ ...prev, [plan.id]: true }));
    playSuccessChime();
    
    // Auto-reset checkmark feedback after 3 seconds
    setTimeout(() => {
      setExportedPlans(prev => ({ ...prev, [plan.id]: false }));
    }, 3000);
  };

  // Auto-generate comprehensive planner
  const handleAutoGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    if (!courseName.trim() || !syllabusText.trim() || !examDate) return;

    // Calculate days remaining
    const targetDate = new Date(examDate);
    const today = new Date();
    // Flush time for pure date comparisons
    targetDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    const diffMs = targetDate.getTime() - today.getTime();
    let daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    // Parse syllabus topics from text using robust separator (commas, semicolons, and newlines)
    const topicsList = syllabusText
      .split(/[,;\n\r]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (topicsList.length === 0) {
      setAnalysisError("Please enter some syllabus topics (comma-separated or on separate lines) to break them down!");
      return;
    }

    // Allocate topics mathematically across remaining days (max 7 days to keep interface elegant)
    const planDays = Math.min(daysRemaining, 7);
    const dailySchedules: StudyDaySchedule[] = [];

    // Simple distribution grouping
    const topicsPerDay = Math.ceil(topicsList.length / planDays);

    for (let dayNum = 1; dayNum <= planDays; dayNum++) {
      const startIndex = (dayNum - 1) * topicsPerDay;
      const dayTopicsText = topicsList.slice(startIndex, startIndex + topicsPerDay);
      
      if (dayTopicsText.length > 0) {
        const topics = dayTopicsText.map((t, idx) => ({
          id: `topic-${dayNum}-${idx}-${Date.now()}`,
          title: t,
          completed: false
        }));

        // Build elegant target calendar date
        const loopDate = new Date();
        loopDate.setDate(today.getDate() + (dayNum - 1));
        const formattedLoopDate = loopDate.toISOString().split('T')[0];

        dailySchedules.push({
          date: formattedLoopDate,
          dayNumber: dayNum,
          topics
        });
      }
    }

    // Add a final core Revision & Mock testing block on the day before the exam if space permits
    if (planDays > 1) {
      const finalRevisionDate = new Date(targetDate);
      finalRevisionDate.setDate(targetDate.getDate() - 1);
      const formattedRevisionDate = finalRevisionDate.toISOString().split('T')[0];
      
      // Ensure we don't have exact duplicates
      if (!dailySchedules.some(d => d.date === formattedRevisionDate)) {
        dailySchedules.push({
          date: formattedRevisionDate,
          dayNumber: planDays + 1,
          topics: [
            { id: `final-rev-${Date.now()}`, title: "Complete high-energy full mock prep exam block", completed: false },
            { id: `final-cheat-${Date.now()}`, title: "Review critical syllabus cheat sheet formulas", completed: false }
          ]
        });
      }
    }

    const newPlan: StudyPlanType = {
      id: `plan-${Date.now()}`,
      courseName: courseName.trim(),
      syllabus: syllabusText.trim(),
      examDate,
      daysRemaining,
      schedule: dailySchedules
    };

    setStudyPlans(prev => [newPlan, ...prev]);
    
    // Play celebratory sound
    playSuccessChime();

    // Reset inputs
    setCourseName('');
    setSyllabusText('');
    setExamDate('');
    setSelectedImage(null);
    setImageMimeType(null);
    setSelectedFileName(null);
    setAnalysisError(null);
  };

  // Toggle topics checkboxes

  // Toggle topics checkboxes
  const handleToggleTopic = (planId: string, dateStr: string, topicId: string) => {
    playClickSound();
    setStudyPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const updatedSchedule = p.schedule.map(day => {
          if (day.date === dateStr) {
            const updatedTopics = day.topics.map(t => {
              if (t.id === topicId) {
                const nextComp = !t.completed;
                if (nextComp) playSuccessChime();
                return { ...t, completed: nextComp };
              }
              return t;
            });
            return { ...day, topics: updatedTopics };
          }
          return day;
        });
        return { ...p, schedule: updatedSchedule };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6" id="study-planner-workspace">
      
      {/* Grid: Creation inputs vs Active plans */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Creation parameters: Left Box */}
        <div className="lg:col-span-12 xl:col-span-5 p-6 sleek-card">
          <h2 className="text-lg font-bold font-display text-slate-800 dark:text-white mb-2 flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-indigo-500" /> Syllabus To Calendar Scheduler
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Enter syllabus components and exam thresholds. Use manual typing or snap/upload a syllabus photo to automatically analyze and schedule with Gemini.
          </p>

          {/* Segmented Control for input method */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl mb-4">
            <button
              type="button"
              onClick={() => { setInputMethod('text'); playClickSound(); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                inputMethod === 'text'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              ⌨️ Type Syllabus
            </button>
            <button
              type="button"
              onClick={() => { setInputMethod('image'); playClickSound(); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                inputMethod === 'image'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              📸 Scan Syllabus Photo
            </button>
          </div>

          {inputMethod === 'image' ? (
            <div className="space-y-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/65">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-indigo-500" /> Syllabus Photo Analysis
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Take a live photo of your syllabus sheet or upload an image of a textbook table of contents. Gemini AI will extract and organize the topics for scheduling!
              </p>

              {analysisError && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-250 dark:border-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400 text-xs flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{analysisError}</span>
                </div>
              )}

              {/* Camera view or image display */}
              {isCameraActive ? (
                <div className="relative rounded-xl overflow-hidden border border-indigo-500 bg-black">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1 transition"
                    >
                      <Camera className="w-3.5 h-3.5" /> Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1 transition border border-slate-700"
                    >
                      <X className="w-3.5 h-3.5" /> Close
                    </button>
                  </div>
                </div>
              ) : selectedImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-4 flex flex-col items-center justify-center min-h-48 text-center">
                  {imageMimeType === 'application/pdf' ? (
                    <div className="flex flex-col items-center justify-center p-6 space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <FileText className="w-10 h-10" />
                      </div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white truncate max-w-xs">
                        {selectedFileName || 'syllabus.pdf'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Syllabus PDF Document loaded
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={selectedImage} 
                      alt="Syllabus snapshot" 
                      className="w-full h-40 object-contain"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => { setSelectedImage(null); setImageMimeType(null); setSelectedFileName(null); playClickSound(); }}
                    className="absolute top-2 right-2 p-1 bg-slate-950/70 hover:bg-slate-950 text-white rounded-full transition"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {/* File Upload Zone */}
                  <label 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/40 dark:bg-slate-900/10 ${
                      isDragging 
                        ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/20 scale-[1.02]' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Choose / Drag Syllabus File</span>
                    <span className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, JPEG, WEBP, PDF</span>
                    <input 
                      type="file" 
                      accept="image/*,application/pdf" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>

                  {/* Camera Launcher */}
                  <button
                    type="button"
                    onClick={startCamera}
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Camera className="w-4 h-4 text-indigo-500" /> Use Webcam / Camera
                  </button>
                </div>
              )}

              {selectedImage && !isCameraActive && (
                <button
                  type="button"
                  onClick={analyzeSyllabusPhoto}
                  disabled={isAnalyzing}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-indigo-500/15 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gemini Analysing Syllabus...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span>Analyze with Gemini AI 🧠</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleAutoGenerate} className="space-y-4">
              {/* Subject name */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                    COURSE SUBJECT NAME
                  </label>
                  {courseName.trim() && (
                    <button
                      type="button"
                      onClick={generateSyllabusTopicsWithAI}
                      disabled={isGeneratingTopics}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold disabled:opacity-50 cursor-pointer"
                    >
                      {isGeneratingTopics ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
                          <span>✨ Generate syllabus topics with Gemini AI</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <input 
                  type="text" 
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. Advanced Operating Systems"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:border-indigo-500 focus:outline text-slate-800 dark:text-white"
                  required
                />
              </div>

              {/* Syllabus Topics */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  SYLLABUS TOPICS (Comma-separated or lines)
                </label>
                <textarea 
                  value={syllabusText}
                  onChange={(e) => setSyllabusText(e.target.value)}
                  placeholder="e.g. CPU Scheduling, Semaphores, Deadlocks, Paging, Virtual Memory"
                  rows={4}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:border-indigo-500 focus:outline text-slate-800 dark:text-white leading-relaxed placeholder-slate-400"
                  required
                />
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Type topics segmented by commas or separate lines.
                </span>
              </div>

              {/* Exam Target Date */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  EXAM DATE
                </label>
                <input 
                  type="date" 
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:border-indigo-500 focus:outline text-slate-700 dark:text-slate-200"
                  required
                />
              </div>

              {/* Submit options */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>Auto-Generate Plan (Local Allocation)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAIGeneratePlan()}
                  disabled={isGeneratingPlan || !courseName.trim() || !syllabusText.trim() || !examDate}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-95 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-indigo-500/10 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isGeneratingPlan ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gemini building smart plan...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
                      <span>✨ Generate Smart Plan with Gemini AI</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Generated Active Plans Timeline: Right Column */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          {studyPlans.length === 0 ? (
            <div className="p-12 text-center text-slate-550 border border-dashed border-slate-300 dark:border-slate-800 bg-white/20 dark:bg-slate-900/10 rounded-2xl h-full flex flex-col items-center justify-center">
              <BookOpen className="w-8 h-8 text-slate-400 mb-2" />
              <div className="font-semibold text-slate-750 dark:text-slate-300">No Generated Study Timelines Present.</div>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Enter your course outline details in the parameter panel to generate comprehensive, day-by-day task lists automatically.
              </p>
            </div>
          ) : (
            studyPlans.map(plan => {
              // Calculate topic progress ratios
              let totalTopics = 0;
              let checkedTopics = 0;

              plan.schedule.forEach(day => {
                totalTopics += day.topics.length;
                checkedTopics += day.topics.filter(t => t.completed).length;
              });

              const planProgress = totalTopics > 0 ? Math.round((checkedTopics / totalTopics) * 100) : 0;

              return (
                <div 
                  key={plan.id}
                  className="p-6 sleek-card space-y-4"
                >
                  {/* Subject details */}
                  <div className="flex items-start justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
                    <div>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 px-2.5 py-0.5 rounded-full font-bold uppercase font-mono">
                        Study Plan Target
                      </span>
                      <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white mt-1">
                        {plan.courseName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Exam Date: <strong>{plan.examDate}</strong> ({plan.daysRemaining} days leftover)
                      </p>
                    </div>

                    {deleteConfirmId === plan.id ? (
                      <div className="flex items-center gap-1.5 animate-fade-in shrink-0">
                        <button
                          onClick={() => {
                            setStudyPlans(prev => prev.filter(p => p.id !== plan.id));
                            setDeleteConfirmId(null);
                            playSuccessChime();
                          }}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold uppercase transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => {
                            playClickSound();
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold uppercase transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          playClickSound();
                          setDeleteConfirmId(plan.id);
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/20 dark:hover:bg-rose-900/20 rounded-lg transition shrink-0"
                        title="Remove study timeline"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Syllabus progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Preparation milestones met</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{planProgress}% completed ({checkedTopics}/{totalTopics})</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${planProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Send to Task Manager Option */}
                  {setTasks && (
                    <button
                      onClick={() => sendPlanToTaskManager(plan)}
                      className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        exportedPlans[plan.id]
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10"
                          : "border-slate-200 hover:border-indigo-200 bg-indigo-50/5 hover:bg-indigo-50/25 dark:border-slate-800 dark:hover:border-indigo-950/20 dark:bg-indigo-950/5 dark:hover:bg-indigo-950/10 text-indigo-600 dark:text-indigo-400"
                      }`}
                    >
                      {exportedPlans[plan.id] ? (
                        <>
                          <Check className="w-4 h-4 text-white animate-bounce" />
                          <span>Sent to Task Manager! 📋</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Export full plan to Task Manager 📋</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Day by Day timelines */}
                  <div className="space-y-4 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                      DAILY DISCIPLINE TIMELINE
                    </span>

                    <div className="space-y-3 pl-2 border-l border-slate-250 dark:border-slate-800">
                      {plan.schedule.map(day => (
                        <div key={day.date} className="relative pl-6">
                          
                          {/* Left node dot */}
                          <div className="absolute left-0 scroll-mt-2.5 -translate-x-[21px] top-1 h-3.5 w-3.5 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900 shadow"></div>

                          {/* Day title info */}
                          <div className="text-xs text-slate-500 font-bold font-mono uppercase tracking-wide">
                            Day {day.dayNumber} • <span className="font-sans lowercase">{day.date}</span>
                          </div>

                          {/* Checkable topic details */}
                          <div className="space-y-2 mt-1.5">
                            {day.topics.map(t => (
                              <div key={t.id} className="flex items-start gap-2 text-xs">
                                <button
                                  onClick={() => handleToggleTopic(plan.id, day.date, t.id)}
                                  className="mt-0.5 text-indigo-500 cursor-pointer"
                                  title="Toggle topic revision status"
                                >
                                  {t.completed ? (
                                    <CheckSquare className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950/20" />
                                  ) : (
                                    <Square className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                </button>
                                <span className={`${t.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
                                  {t.title}
                                </span>
                              </div>
                            ))}
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
