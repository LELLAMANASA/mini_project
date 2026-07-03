import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Search, 
  Pin, 
  Tag, 
  FolderOpen, 
  Eye, 
  Edit3, 
  Save, 
  Sparkles, 
  Download,
  Copy,
  CheckCircle,
  FileDown,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { NoteType } from '../types';
import { playClickSound } from '../utils/audio';

interface NotesSuiteProps {
  notes: NoteType[];
  onAddNote: (note: Omit<NoteType, 'id'>) => void;
  onEditNote: (note: NoteType) => void;
  onDeleteNote: (id: string) => void;
  theme: string;
  onRewardXP: (xp: number, message: string) => void;
}

export default function NotesSuite({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
  theme,
  onRewardXP
}: NotesSuiteProps) {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true); // Edit vs Preview split
  const [isMaximized, setIsMaximized] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Input states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Lecture Notes');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Modal states for Note creation & editing details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [modalTitle, setModalTitle] = useState('');
  const [modalCategory, setModalCategory] = useState('Lecture Notes');
  const [modalTags, setModalTags] = useState<string[]>([]);
  const [modalTagInput, setModalTagInput] = useState('');

  // Auto-select latest added note
  const [prevNotesCount, setPrevNotesCount] = useState(notes.length);
  useEffect(() => {
    if (notes.length > prevNotesCount) {
      const newestNote = notes[0];
      if (newestNote) {
        setActiveNoteId(newestNote.id);
      }
    }
    setPrevNotesCount(notes.length);
  }, [notes.length]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  // Load active note to input states
  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setCategory(activeNote.category);
      setTags(activeNote.tags || []);
    } else {
      resetFields();
    }
  }, [activeNoteId, activeNote]);

  const resetFields = () => {
    setTitle('');
    setContent('');
    setCategory('Lecture Notes');
    setTags([]);
    setTagInput('');
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setModalTitle('');
    setModalCategory('Lecture Notes');
    setModalTags(['Study']);
    setModalTagInput('');
    setIsModalOpen(true);
    playClickSound();
  };

  const handleOpenEditModal = (note: NoteType) => {
    setModalMode('edit');
    setModalTitle(note.title);
    setModalCategory(note.category);
    setModalTags(note.tags || []);
    setModalTagInput('');
    setIsModalOpen(true);
    playClickSound();
  };

  const handleConfirmModalAction = () => {
    if (modalMode === 'create') {
      const cleanTitle = modalTitle.trim() || 'Untitled Note Summary';
      const newNote = {
        title: cleanTitle,
        content: `# ${cleanTitle}\n\nStart typing here using basic markdown syntax like:\n- **Bold text**\n- *Italics*\n- \`inline code\`\n- Bullet points`,
        category: modalCategory,
        tags: modalTags,
        pinned: false,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      onAddNote(newNote);
      onRewardXP(10, "Created a study note!");
    } else {
      if (!activeNoteId) return;
      const updated: NoteType = {
        id: activeNoteId,
        title: modalTitle.trim() || 'Untitled note',
        content,
        category: modalCategory,
        tags: modalTags,
        pinned: activeNote?.pinned || false,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      onEditNote(updated);
      onRewardXP(5, `Updated note details: "${modalTitle}"`);
    }
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (!activeNoteId) return;
    const updated: NoteType = {
      id: activeNoteId,
      title,
      content,
      category,
      tags,
      pinned: activeNote?.pinned || false,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    onEditNote(updated);
    onRewardXP(5, `Saved note: "${title}"`);
    alert('Note saved successfully!');
  };

  const handleTogglePin = (note: NoteType) => {
    onEditNote({ ...note, pinned: !note.pinned });
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tagInput.trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter(tag => tag !== t));
  };

  const handleDownloadMarkdown = (note: NoteType) => {
    const element = document.createElement("a");
    const file = new Blob([note.content], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.toLowerCase().replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Categories list
  const categoriesList = ['Lecture Notes', 'Exams prep', 'Interviews', 'Research', 'Personal'];

  // Filters
  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                          n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || n.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sort: pinned first
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.lastUpdated.localeCompare(a.lastUpdated);
  });

  // Simple Markdown Renderer
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="text-xl font-bold border-b pb-1 mb-3 text-slate-900 dark:text-slate-100">{trimmed.replace('# ', '')}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-slate-200">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-bold mt-3 mb-1 text-slate-800 dark:text-slate-300">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return <li key={idx} className="ml-4 list-disc text-xs text-slate-600 dark:text-slate-300 my-0.5">{trimmed.substring(2)}</li>;
      }
      if (trimmed.startsWith('```')) {
        if (trimmed === '```' || trimmed === '```javascript' || trimmed === '```python' || trimmed === '```typescript') {
          return null; // Ignore opening/closing blocks
        }
      }
      if (trimmed.startsWith('> ')) {
        return <blockquote key={idx} className="border-l-4 border-indigo-500 pl-3 italic text-xs text-slate-500 my-2">{trimmed.substring(2)}</blockquote>;
      }
      return <p key={idx} className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed my-1.5">{line}</p>;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]" id="notes-suite-workspace">
      
      {/* Sidebar List (4 cols) */}
      {!isMaximized && (
        <div className="lg:col-span-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col space-y-4 h-[600px] transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FolderOpen className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Notes Drawer</h3>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition cursor-pointer flex items-center justify-center"
            title="Create new empty study draft"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search bar & Category filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full p-2 pl-9 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categoriesList.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Notes Items List */}
        <div className="flex-grow overflow-y-auto space-y-2 pr-1">
          {sortedNotes.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">No lecture drafts compiled</p>
            </div>
          ) : (
            sortedNotes.map((note) => {
              const isActive = note.id === activeNoteId;
              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                    isActive 
                      ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10' 
                      : 'border-slate-100 dark:border-slate-850 bg-slate-50/30 hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="space-y-1.5 flex-grow truncate mr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold uppercase text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                        {note.category}
                      </span>
                      {note.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 rotate-45" />}
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {note.title || 'Untitled note'}
                    </h4>

                    <span className="text-[9px] font-mono text-slate-400 block">
                      Updated: {note.lastUpdated}
                    </span>
                  </div>

                  {deleteConfirmId === note.id ? (
                    <div 
                      className="flex flex-col gap-1 items-end shrink-0" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          onDeleteNote(note.id);
                          if (activeNoteId === note.id) setActiveNoteId(null);
                          setDeleteConfirmId(null);
                        }}
                        className="px-2 py-0.5 text-[9px] bg-red-600 hover:bg-red-700 text-white rounded font-extrabold uppercase transition"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          setDeleteConfirmId(null);
                        }}
                        className="px-2 py-0.5 text-[9px] bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-bold uppercase transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePin(note);
                        }}
                        className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition ${
                          note.pinned ? 'text-amber-500' : 'text-slate-400'
                        }`}
                        title={note.pinned ? 'Unpin' : 'Pin to top of list'}
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(note.id);
                        }}
                        className="p-1 rounded text-red-500 hover:bg-red-500/10 transition"
                        title="Delete note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      )}

      {/* Editor Panel (8 cols, or 12 if maximized) */}
      <div className={`${isMaximized ? 'lg:col-span-12 h-[750px]' : 'lg:col-span-8 h-[600px]'} p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300`}>
        {activeNote ? (
          <div className="flex flex-col h-full space-y-4 justify-between">
            {/* Top Toolbar Actions */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    isEditing 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editor Pane</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    !isEditing 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Interactive Live Preview</span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setIsMaximized(!isMaximized);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition cursor-pointer"
                  title={isMaximized ? "Restore split screen view" : "Maximize editor workspace"}
                >
                  {isMaximized ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 animate-pulse" />
                      <span>Split Screen</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Maximize Editor</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(content)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/20 dark:hover:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800 text-slate-500"
                  title="Copy notes markup"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleOpenEditModal(activeNote)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/20 dark:hover:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800 text-slate-500 flex items-center gap-1 text-xs"
                  title="Edit document details (Title, Category, Tags)"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Details</span>
                </button>

                <button
                  onClick={() => handleDownloadMarkdown(activeNote)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/20 dark:hover:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800 text-slate-500 flex items-center gap-1 text-xs"
                  title="Download raw markdown .md"
                >
                  <FileDown className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notes</span>
                </button>
              </div>
            </div>


            {/* Note Details Form & Input Fields */}
            {isEditing ? (
              <div className="flex-grow flex flex-col space-y-2 overflow-y-auto pr-1">
                <label className="text-[9px] font-bold font-mono tracking-wider text-slate-400 uppercase block">Raw Markdown Body</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="# Lecture Draft..."
                  className="w-full flex-grow p-4 rounded-xl border border-slate-250 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/20 text-xs font-mono focus:outline-none leading-relaxed resize-none transition-all duration-300 min-h-[300px]"
                />
              </div>
            ) : (
              /* Live compiled visual panel */
              <div className={`flex-grow p-4 rounded-xl border border-slate-150 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950/20 overflow-y-auto ${isMaximized ? 'max-h-[570px]' : 'max-h-[420px]'} prose prose-slate dark:prose-invert transition-all duration-300`}>
                {renderMarkdown(content)}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center space-y-3 flex-grow text-slate-400">
            <FileText className="w-12 h-12 text-slate-300 animate-bounce" />
            <h4 className="text-sm font-bold">No Active Document Loaded</h4>
            <p className="text-xs max-w-sm leading-relaxed">
              Select an existing notes draft from the left side panel list, or click the "+" button to begin compiling a new markdown lesson plan.
            </p>
          </div>
        )}
      </div>

      {/* Note Creation / Editing Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">
              {modalMode === 'create' ? '✨ Create New Study Note' : '✏️ Edit Note Information'}
            </h3>
            
            <div className="space-y-4">
              {/* Title input */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold font-mono tracking-wider text-slate-400 uppercase">Document Title</label>
                <input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="Enter note title..."
                  className="w-full p-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold font-mono tracking-wider text-slate-400 uppercase">Academic Category</label>
                <select
                  value={modalCategory}
                  onChange={(e) => setModalCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  {categoriesList.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Tags list & inputs */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold font-mono tracking-wider text-slate-400 uppercase block">Tags & Subjects</label>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {modalTags.map((t, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/60">
                      <span>{t}</span>
                      <button 
                        type="button" 
                        onClick={() => setModalTags(modalTags.filter(tag => tag !== t))} 
                        className="font-extrabold hover:text-red-500 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <div className="inline-flex max-w-[120px]">
                    <input
                      type="text"
                      value={modalTagInput}
                      onChange={(e) => setModalTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const clean = modalTagInput.trim();
                          if (clean && !modalTags.includes(clean)) {
                            setModalTags([...modalTags, clean]);
                          }
                          setModalTagInput('');
                        }
                      }}
                      placeholder="+ Press Enter"
                      className="p-1 bg-transparent text-[10px] text-slate-700 dark:text-slate-300 focus:outline-none border-b border-dashed border-slate-300 dark:border-slate-700 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  handleConfirmModalAction();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer"
              >
                {modalMode === 'create' ? 'Create Note' : 'Apply Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
