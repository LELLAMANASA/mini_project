import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Briefcase, 
  Calendar, 
  FileText, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Percent,
  ExternalLink
} from 'lucide-react';
import { InternshipType } from '../types';

interface InternshipTrackerProps {
  internships: InternshipType[];
  onAddInternship: (internship: Omit<InternshipType, 'id'>) => void;
  onEditInternship: (internship: InternshipType) => void;
  onDeleteInternship: (id: string) => void;
  theme: string;
  onRewardXP: (xp: number, message: string) => void;
}

export default function InternshipTracker({
  internships,
  onAddInternship,
  onEditInternship,
  onDeleteInternship,
  theme,
  onRewardXP
}: InternshipTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [applicationDate, setApplicationDate] = useState('');
  const [status, setStatus] = useState<InternshipType['status']>('Applied');
  const [interviewDate, setInterviewDate] = useState('');
  const [notes, setNotes] = useState('');
  const [portalLink, setPortalLink] = useState('');

  const [statusFilter, setStatusFilter] = useState<'All' | InternshipType['status']>('All');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !position || !applicationDate) {
      alert('Please fill out Company Name, Position and Application Date.');
      return;
    }

    if (editingId) {
      onEditInternship({
        id: editingId,
        companyName,
        position,
        applicationDate,
        status,
        interviewDate: interviewDate || undefined,
        notes,
        portalLink: portalLink || undefined
      });

      // Bonus XP for getting shortlisted or selected
      if (status === 'Selected') {
        onRewardXP(100, `Hired! Congratulations on your internship at ${companyName}! 🎉`);
      } else if (status === 'Interview') {
        onRewardXP(40, `Shortlisted for Interview at ${companyName}! Keep studying!`);
      }

      setEditingId(null);
    } else {
      onAddInternship({
        companyName,
        position,
        applicationDate,
        status,
        interviewDate: interviewDate || undefined,
        notes,
        portalLink: portalLink || undefined
      });
      onRewardXP(15, `Log new application to ${companyName}!`);
    }

    resetForm();
    setShowForm(false);
  };

  const handleEdit = (intern: InternshipType) => {
    setEditingId(intern.id);
    setCompanyName(intern.companyName);
    setPosition(intern.position);
    setApplicationDate(intern.applicationDate);
    setStatus(intern.status);
    setInterviewDate(intern.interviewDate || '');
    setNotes(intern.notes || '');
    setPortalLink(intern.portalLink || '');
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setCompanyName('');
    setPosition('');
    setApplicationDate('');
    setStatus('Applied');
    setInterviewDate('');
    setNotes('');
    setPortalLink('');
  };

  // Analytics
  const totalApps = internships.length;
  const interviewingCount = internships.filter(i => i.status === 'Interview').length;
  const selectedCount = internships.filter(i => i.status === 'Selected').length;
  const rejectedCount = internships.filter(i => i.status === 'Rejected').length;
  
  const successRate = totalApps > 0 
    ? Math.round(((selectedCount + internships.filter(i => i.status === 'Shortlisted').length) / totalApps) * 100)
    : 0;

  const filtered = internships.filter(i => {
    return statusFilter === 'All' || i.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Metrics widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Apps */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-600 rounded-lg">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Applied</span>
            <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{totalApps}</span>
          </div>
        </div>

        {/* Interviews scheduled */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-lg">
            <Calendar className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Interviews</span>
            <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{interviewingCount}</span>
          </div>
        </div>

        {/* Selected */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-green-500/10 text-green-600 rounded-lg">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Selected</span>
            <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{selectedCount}</span>
          </div>
        </div>

        {/* Success Score */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/10 text-teal-600 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Success Rate</span>
            <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{successRate}%</span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Internship Application Pipeline</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              {showForm ? 'Cancel' : 'Add Application'}
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-850 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
              {editingId ? 'Edit Application Record' : 'Record New Internship Application'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google, Microsoft, Stripe"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Role / Position</label>
                <input
                  type="text"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Software Engineering Intern"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Application Date</label>
                <input
                  type="date"
                  required
                  value={applicationDate}
                  onChange={(e) => setApplicationDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Application Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Interview Date (Optional)</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Website / Application Portal Link (Optional)</label>
              <input
                type="text"
                value={portalLink}
                onChange={(e) => setPortalLink(e.target.value)}
                placeholder="e.g. https://careers.google.com/jobs/... or https://stripe.com/jobs"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Followup Notes & Interview Questions</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="List HR contact details, online test scores, or topics to practice..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                {editingId ? 'Save Edits' : 'Save Record'}
              </button>
            </div>
          </form>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-350">No applications match your filter selection</h4>
            <p className="text-xs text-slate-400">Record your next corporate application to begin visualizing your interview timeline.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((intern) => {
              return (
                <div 
                  key={intern.id} 
                  className={`p-5 rounded-2xl border bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 space-y-4 transition hover:shadow-md`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50">{intern.companyName}</h4>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-amber-400">{intern.position}</p>
                    </div>

                    <span className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-full ${
                      intern.status === 'Selected'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : intern.status === 'Rejected'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : intern.status === 'Interview'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {intern.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-sans border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <div className="space-y-0.5">
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-400">APPLIED ON</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{intern.applicationDate}</span>
                    </div>

                    {intern.interviewDate && (
                      <div className="space-y-0.5">
                        <span className="block font-mono text-[9px] uppercase tracking-wider text-amber-500">INTERVIEW SCHEDULED</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">{intern.interviewDate}</span>
                      </div>
                    )}
                  </div>

                  {intern.portalLink && (
                    <div className="flex items-center gap-1.5 p-2 px-2.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/30 dark:border-indigo-900/30">
                      <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase shrink-0">PORTAL LINK:</span>
                      <a 
                        href={intern.portalLink.startsWith('http') ? intern.portalLink : `https://${intern.portalLink}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 truncate"
                        title={intern.portalLink}
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{intern.portalLink}</span>
                      </a>
                    </div>
                  )}

                  {intern.notes && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="text-[9px] font-mono font-black text-slate-400 block mb-1">NOTES / LOGS:</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {intern.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 border-t border-slate-100/50 dark:border-slate-800/40 pt-3">
                    <button
                      onClick={() => handleEdit(intern)}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition cursor-pointer"
                      title="Edit application details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteInternship(intern.id)}
                      className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg transition cursor-pointer"
                      title="Delete application record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
