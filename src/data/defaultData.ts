import { TaskType, AttendanceType, AudioTrackType, AssignmentType, HabitType, ExamType, InternshipType } from '../types';

export const DEFAULT_TASKS: TaskType[] = [
  {
    id: 't-1',
    title: 'Submit Avishkar internship proposal draft',
    notes: 'Include Gantt chart, system architecture block diagram, and list of UI mockups. Must submit before midnight.',
    priority: 'high',
    category: 'Study',
    dueDate: '2026-06-21',
    dueTime: '23:59',
    completed: false,
    subtasks: [
      { id: 'st-1-1', title: 'Write Abstract & Problem Definition', completed: true },
      { id: 'st-1-2', title: 'Create Tailwind Wireframe layouts', completed: false },
      { id: 'st-1-3', title: 'Prepare GitHub README writeup', completed: false }
    ],
    recurring: 'none',
    reminder: true
  },
  {
    id: 't-2',
    title: 'Solve Calculus Chapter 4 Exercises',
    notes: 'Review definite integrals, area under curves, and standard tricks. Page 145 to 155.',
    priority: 'medium',
    category: 'Study',
    dueDate: '2026-06-23',
    dueTime: '17:00',
    completed: true,
    subtasks: [
      { id: 'st-2-1', title: 'Odd numbered questions 1-19', completed: true },
      { id: 'st-2-2', title: 'Even numbered questions 2-10', completed: true }
    ],
    recurring: 'none',
    reminder: false
  },
  {
    id: 't-3',
    title: 'Weekly Gym Weights Routine',
    notes: 'Push day routine (bench press, shoulder overhead press, tricep dips). Stay hydrated!',
    priority: 'low',
    category: 'Personal',
    dueDate: '2026-06-20',
    dueTime: '18:30',
    completed: false,
    subtasks: [
      { id: 'st-3-1', title: 'Warmup stretches', completed: true },
      { id: 'st-3-2', title: 'Main compound sets', completed: false }
    ],
    recurring: 'daily',
    reminder: false
  },
  {
    id: 't-4',
    title: 'Pre-order micro-controller kit',
    notes: 'For the IoT hardware project demo. Compare prices on Amazon and local tech store.',
    priority: 'medium',
    category: 'Personal',
    dueDate: '2026-06-25',
    dueTime: '12:00',
    completed: false,
    subtasks: [],
    recurring: 'none',
    reminder: true
  }
];

export const DEFAULT_ATTENDANCE: AttendanceType[] = [
  { id: 'sub-1', subject: 'Mathematics (Calculus & Linear Algebra)', present: 22, total: 26 }, // 84.6% (>75%)
  { id: 'sub-2', subject: 'Computer Science (Algorithms & Web Dev)', present: 27, total: 29 }, // 93.1% (>75%)
  { id: 'sub-3', subject: 'Applied Physics (Electromagnetism)', present: 19, total: 28 }, // 67.8% (<75%) (Warning status!)
  { id: 'sub-4', subject: 'Chemistry (Organic Reactions & Kinetics)', present: 24, total: 31 }  // 77.4% (>75% but close!)
];

export const AUDIO_TRACKS: AudioTrackType[] = [
  {
    id: 'track-1',
    title: 'Srivalli (Relaxing)',
    artist: 'Pushpa Instrumental',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'track-2',
    title: 'Butta Bomma (Acoustic)',
    artist: 'Ala Vaikunthapurramuloo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 'track-3',
    title: 'Nuvvu Nuvvu (Instrumental)',
    artist: 'Khaleja Vibes',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: 'track-4',
    title: 'Samajavaragamana (Flute)',
    artist: 'Ala Vaikunthapurramuloo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: 'track-5',
    title: 'Mental Madhilo (Lofi)',
    artist: 'Mental Madhilo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  }
];

export const DEFAULT_ASSIGNMENTS: AssignmentType[] = [
  {
    id: 'a-1',
    subject: 'Algorithms',
    title: 'Dynamic Programming Assignment',
    description: 'Solve the 5 classical problems on knapsack and edit distance.',
    dueDate: '2026-06-25',
    priority: 'high',
    status: 'In Progress',
    estimatedHours: 6
  },
  {
    id: 'a-2',
    subject: 'Web Development',
    title: 'React Portfolio Site',
    description: 'Design a single page React app styled with Tailwind.',
    dueDate: '2026-06-29',
    priority: 'medium',
    status: 'Not Started',
    estimatedHours: 10
  }
];

export const DEFAULT_HABITS: HabitType[] = [
  {
    id: 'h-1',
    name: 'Solve 1 LeetCode Problem',
    category: 'Coding',
    streak: 4,
    history: []
  },
  {
    id: 'h-2',
    name: 'Drink 3L of Water',
    category: 'Water',
    streak: 12,
    history: []
  }
];

export const DEFAULT_EXAMS: ExamType[] = [
  {
    id: 'e-1',
    subject: 'Algorithms Final',
    examDate: '2026-06-28',
    examType: 'Final',
    notes: 'Covers graph algorithms, DP, and greedy strategy.'
  }
];

export const DEFAULT_INTERNSHIPS: InternshipType[] = [
  {
    id: 'i-1',
    companyName: 'Google',
    position: 'SWE Summer Intern 2026',
    applicationDate: '2026-06-15',
    status: 'Interview',
    interviewDate: '2026-06-24',
    notes: 'Focus on trees, graphs, and dynamic programming questions.'
  }
];
