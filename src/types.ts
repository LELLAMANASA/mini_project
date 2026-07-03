export type ThemeType = 'light' | 'dark' | 'cyberpunk' | 'sakura';

export type TabType = 
  | 'dashboard' 
  | 'tasks' 
  | 'assignments' 
  | 'calendar' 
  | 'analytics' 
  | 'notes' 
  | 'internships' 
  | 'profile' 
  | 'settings' 
  | 'study-ai'
  | 'pomodoro'
  | 'attendance'
  | 'planner'
  | 'goals'
  | 'news'
  | 'habits';

export interface UserProfile {
  name: string;
  email: string;
  college: string;
  branch: string;
  semester: string;
  profilePic: string;
  dailyStudyGoal: number; // in hours
  xp: number;
  level: number;
  achievements: string[]; // unlocked achievement IDs
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskType {
  id: string;
  title: string;
  notes: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: 'Study' | 'Personal' | 'Internship' | 'Project' | 'Exam';
  dueDate: string;
  dueTime: string;
  completed: boolean;
  subtasks: SubTask[];
  recurring: 'none' | 'daily' | 'weekly';
  reminder: boolean;
  reminderTime?: string; // custom notification reminder time, e.g. "2026-06-25T14:30"
  reminderFired?: boolean; // track if the custom notification alarm has run
  completedAt?: string; // ISO date-time of when task was completed
  estimatedMinutes?: number;
  voiceMemo?: string;
  voiceMemoDuration?: number;
}

export interface AssignmentType {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Submitted';
  attachment?: string;
  attachmentData?: string;
  estimatedHours: number;
  submissionLink?: string;
}

export interface AttendanceType {
  id: string;
  subject: string;
  present: number;
  total: number;
  classTime?: string; // e.g. "Monday 10:00 AM" or custom class hours
  reminderTime?: string; // custom class alarm reminder time, e.g. "2026-06-25T14:30"
  reminderFired?: boolean; // track if the alarm has fired
  dailyReminderTime?: string; // e.g. "14:30" (HH:MM format for daily repeating alarms)
  dailyReminderFiredDate?: string; // track the last date (YYYY-MM-DD) the daily alarm was fired
}

export interface StudyDaySchedule {
  date: string;
  dayNumber: number;
  topics: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface StudyPlanType {
  id: string;
  courseName: string;
  syllabus: string;
  examDate: string;
  daysRemaining: number;
  schedule: StudyDaySchedule[];
}

export interface NoteType {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  pinned: boolean;
  lastUpdated: string;
}

export interface HabitType {
  id: string;
  name: string;
  category: 'Coding' | 'Reading' | 'Exercise' | 'Sleep' | 'Water';
  streak: number;
  history: string[]; // Date strings (YYYY-MM-DD) when completed
}

export interface ExamType {
  id: string;
  subject: string;
  examDate: string;
  examType: 'Midterm' | 'Final' | 'Quiz' | 'Practical';
  notes?: string;
}

export interface InternshipType {
  id: string;
  companyName: string;
  position: string;
  applicationDate: string;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Rejected' | 'Selected';
  interviewDate?: string;
  notes?: string;
  portalLink?: string;
}

export interface AchievementType {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  iconName: string;
  targetCount: number;
  currentProgress: number;
  unlocked: boolean;
}

export interface AudioTrackType {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export interface NotificationType {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'task' | 'assignment' | 'exam' | 'attendance' | 'system';
}
