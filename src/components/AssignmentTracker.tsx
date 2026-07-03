import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  Link, 
  Filter, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  FileCheck2,
  Paperclip,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { AssignmentType } from '../types';

interface AssignmentTrackerProps {
  assignments: AssignmentType[];
  onAddAssignment: (assignment: Omit<AssignmentType, 'id'>) => void;
  onEditAssignment: (assignment: AssignmentType) => void;
  onDeleteAssignment: (id: string) => void;
  theme: string;
  onRewardXP: (xp: number, message: string) => void;
}

export default function AssignmentTracker({
  assignments,
  onAddAssignment,
  onEditAssignment,
  onDeleteAssignment,
  theme,
  onRewardXP
}: AssignmentTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AssignmentType | null>(null);

  // Form Fields
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [status, setStatus] = useState<AssignmentType['status']>('Not Started');
  const [estimatedHours, setEstimatedHours] = useState<number>(3);
  const [submissionLink, setSubmissionLink] = useState('');
  const [attachment, setAttachment] = useState('');
  const [attachmentData, setAttachmentData] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | AssignmentType['status']>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'high' | 'medium' | 'low'>('All');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !title || !dueDate) {
      alert('Please fill out Subject, Title, and Due Date.');
      return;
    }

    if (editingAssignment) {
      const updated: AssignmentType = {
        ...editingAssignment,
        subject,
        title,
        description,
        dueDate,
        priority,
        status,
        estimatedHours,
        submissionLink,
        attachment,
        attachmentData
      };
      onEditAssignment(updated);

      // Reward XP if status transitioned to Submitted or Completed
      if (status === 'Submitted' || status === 'Completed') {
        if (editingAssignment.status !== 'Submitted' && editingAssignment.status !== 'Completed') {
          onRewardXP(30, `Submitted assignment: ${title}!`);
        }
      }

      setEditingAssignment(null);
    } else {
      onAddAssignment({
        subject,
        title,
        description,
        dueDate,
        priority,
        status,
        estimatedHours,
        submissionLink,
        attachment,
        attachmentData
      });

      if (status === 'Submitted' || status === 'Completed') {
        onRewardXP(30, `Created and submitted assignment: ${title}!`);
      }
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleEditClick = (assign: AssignmentType) => {
    setEditingAssignment(assign);
    setSubject(assign.subject);
    setTitle(assign.title);
    setDescription(assign.description);
    setDueDate(assign.dueDate);
    setPriority(assign.priority);
    setStatus(assign.status);
    setEstimatedHours(assign.estimatedHours);
    setSubmissionLink(assign.submissionLink || '');
    setAttachment(assign.attachment || '');
    setAttachmentData(assign.attachmentData || '');
    setShowAddForm(true);
  };

  const resetForm = () => {
    setEditingAssignment(null);
    setSubject('');
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setStatus('Not Started');
    setEstimatedHours(3);
    setSubmissionLink('');
    setAttachment('');
    setAttachmentData('');
  };

  const handleStatusChangeDirect = (assign: AssignmentType, nextStatus: AssignmentType['status']) => {
    const updated: AssignmentType = { ...assign, status: nextStatus };
    onEditAssignment(updated);

    if ((nextStatus === 'Completed' || nextStatus === 'Submitted') && 
        (assign.status !== 'Completed' && assign.status !== 'Submitted')) {
      onRewardXP(30, `Completed & Tracked: ${assign.title}!`);
    }
  };

  // Statistics Computations
  const dueTodayCount = assignments.filter(a => a.dueDate === todayStr && a.status !== 'Submitted' && a.status !== 'Completed').length;
  
  const getDaysDiff = (d1: string, d2: string) => {
    const timeDiff = new Date(d1).getTime() - new Date(d2).getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const dueThisWeekCount = assignments.filter(a => {
    const diff = getDaysDiff(a.dueDate, todayStr);
    return diff >= 0 && diff <= 7 && a.status !== 'Submitted' && a.status !== 'Completed';
  }).length;

  const overdueCount = assignments.filter(a => {
    return a.dueDate < todayStr && a.status !== 'Submitted' && a.status !== 'Completed';
  }).length;

  // Filter list
  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || a.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header Cards Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overdue Widget */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-red-500 tracking-wider">Overdue Alerts</span>
            <h3 className="text-2xl font-extrabold text-red-600 dark:text-red-400">{overdueCount}</h3>
            <p className="text-[11px] text-slate-400">Action urgently required</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-500/50" />
        </div>

        {/* Due Today Widget */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-amber-500 tracking-wider">Due Today</span>
            <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{dueTodayCount}</h3>
            <p className="text-[11px] text-slate-400">Complete before midnight</p>
          </div>
          <Clock className="w-8 h-8 text-amber-500/50" />
        </div>

        {/* Due This Week Widget */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-500/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-indigo-500 tracking-wider">Due This Week</span>
            <h3 className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{dueThisWeekCount}</h3>
            <p className="text-[11px] text-slate-400">Upcoming syllabus deadlines</p>
          </div>
          <Calendar className="w-8 h-8 text-indigo-500/50" />
        </div>
      </div>

      {/* Main Board Card */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        
        {/* Control and Filters Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-grow">
            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search assignments or subjects..."
                className="w-full p-2 pl-10 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none"
              />
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Submitted">Submitted</option>
              </select>
            </div>

            {/* Filter Priority */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowAddForm(!showAddForm);
            }}
            className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            {showAddForm ? 'Cancel' : 'Add Assignment'}
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add/Edit Form Overlay */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-850 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {editingAssignment ? 'Edit Homework Assignment' : 'Track New College Assignment'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Academic Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Linear Algebra, Chemistry III"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lab Report 2: Organic Kinetics"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Description / Syllabus Specifications</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include questions, prompt requirements, or details..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none text-slate-700 dark:text-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Priority Index</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none text-slate-700 dark:text-slate-300"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Initial Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none text-slate-700 dark:text-slate-300"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Submitted">Submitted</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Est. Completion (Hrs)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 3)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Submission / Portal Link (Optional)</label>
                <div className="relative">
                  <Link className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    placeholder="https://canvas.college.edu/submit"
                    className="w-full p-3 pl-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase flex items-center justify-between">
                  <span>Attachment Reference / Notes Upload</span>
                  {attachment && (
                    <button
                      type="button"
                      onClick={() => {
                        setAttachment('');
                        setAttachmentData('');
                      }}
                      className="text-red-500 hover:text-red-600 font-bold font-sans text-[10px] lowercase flex items-center gap-0.5 cursor-pointer"
                    >
                      Clear File
                    </button>
                  )}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="relative">
                    <Paperclip className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={attachment}
                      onChange={(e) => setAttachment(e.target.value)}
                      placeholder="e.g. physics_syllabus.pdf or URL"
                      className="w-full p-3 pl-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                    />
                  </div>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        const file = e.dataTransfer.files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setAttachment(file.name);
                          setAttachmentData(event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-2.5 flex flex-col items-center justify-center text-center transition cursor-pointer ${
                      attachmentData
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/40'
                    }`}
                    onClick={() => {
                      document.getElementById('assignment-file-input')?.click();
                    }}
                  >
                    <input
                      type="file"
                      id="assignment-file-input"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setAttachment(file.name);
                            setAttachmentData(event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div className="flex items-center gap-1.5">
                      <Paperclip className={`w-3.5 h-3.5 ${attachmentData ? 'text-emerald-500 animate-bounce' : 'text-slate-400'}`} />
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {attachmentData ? 'Uploaded!' : 'Drag & Drop or Click'}
                      </span>
                    </div>
                    {attachmentData && (
                      <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold truncate max-w-[180px] mt-0.5">
                        {attachment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Reset Fields
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>{editingAssignment ? 'Update Tracking' : 'Saves Assignment'}</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Assignments Grid Displays */}
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-350">No Assignments Match Filter Options</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your calendar is currently clear of pending exams or lab work. Click 'Add Assignment' to begin tracking homework.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAssignments.map((a) => {
              const isOverdue = a.dueDate < todayStr && a.status !== 'Completed' && a.status !== 'Submitted';
              const isSubmitted = a.status === 'Submitted' || a.status === 'Completed';

              return (
                <div 
                  key={a.id} 
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isSubmitted 
                      ? 'bg-slate-50/40 dark:bg-slate-950/10 border-slate-200/50 dark:border-slate-850 opacity-80' 
                      : isOverdue 
                      ? 'border-red-500/30 bg-red-500/[0.02] shadow-sm shadow-red-500/5' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Upper Subject Tag & Priority Icon */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        {a.subject}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          a.priority === 'high' ? 'bg-red-500' : a.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'
                        }`} />
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                          {a.priority} priority
                        </span>
                      </div>
                    </div>

                    {/* Assignment Title & Notes */}
                    <div>
                      <h4 className={`text-sm font-bold leading-tight text-slate-800 dark:text-slate-100 ${isSubmitted ? 'line-through text-slate-400' : ''}`}>
                        {a.title}
                      </h4>
                      {a.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {a.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Estimated Time and Attachment Status Badge */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className={isOverdue ? 'text-red-500 font-bold' : ''}>
                        {isOverdue ? `Overdue (${a.dueDate})` : `Due ${a.dueDate}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{a.estimatedHours} Hours Required</span>
                    </div>

                    {a.attachment && (
                      (() => {
                        if (a.attachmentData) {
                          return (
                            <a
                              href={a.attachmentData}
                              download={a.attachment}
                              className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-semibold transition border border-emerald-100/30 cursor-pointer"
                              title={`Download/Open Attachment: ${a.attachment}`}
                              id={`attachment-download-${a.id}`}
                            >
                              <Paperclip className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span className="truncate max-w-[150px] underline decoration-emerald-300">{a.attachment}</span>
                            </a>
                          );
                        }

                        const isLink = a.attachment.startsWith('http://') || 
                                       a.attachment.startsWith('https://') || 
                                       a.attachment.startsWith('www.') || 
                                       a.attachment.includes('/') || 
                                       a.attachment.includes('.com') || 
                                       a.attachment.includes('.org') || 
                                       a.attachment.includes('.net') || 
                                       a.attachment.includes('.edu');
                        
                        const href = a.attachment.startsWith('www.') 
                          ? `https://${a.attachment}` 
                          : a.attachment;

                        if (isLink) {
                          return (
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-semibold transition border border-indigo-100/30 cursor-pointer"
                              title={`Open Attachment: ${a.attachment}`}
                              id={`attachment-link-${a.id}`}
                            >
                              <Paperclip className="w-3 h-3 text-indigo-500 shrink-0" />
                              <span className="truncate max-w-[150px] underline decoration-indigo-300">{a.attachment}</span>
                            </a>
                          );
                        }
                        
                        return (
                          <div 
                            className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] text-slate-600 dark:text-slate-350"
                            title={`Attachment reference: ${a.attachment}`}
                            id={`attachment-text-${a.id}`}
                          >
                            <Paperclip className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate max-w-[150px]">{a.attachment}</span>
                          </div>
                        );
                      })()
                    )}
                  </div>

                  {/* Submission and Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100/50 dark:border-slate-800/40">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400">Status:</span>
                      <select
                        value={a.status}
                        onChange={(e) => handleStatusChangeDirect(a, e.target.value as any)}
                        className={`p-1.5 text-xs font-bold rounded-lg cursor-pointer ${
                          a.status === 'Submitted' 
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                            : a.status === 'Completed'
                            ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                            : a.status === 'In Progress'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Submitted">Submitted</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      {a.submissionLink && (
                        <a
                          href={a.submissionLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 hover:bg-indigo-500/10 text-indigo-500 rounded-lg transition"
                          title="Open Submission Portal Link"
                        >
                          <Link className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleEditClick(a)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-lg transition cursor-pointer"
                        title="Edit Assignment"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteAssignment(a.id)}
                        className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg transition cursor-pointer"
                        title="Delete Assignment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
