'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Trash2, Star, Plus, X, Cloud, Shield, Clock } from 'lucide-react';
import { Badge, EmptyState } from '@/components/shared-ui';
import type { Resume } from '@/lib/data';

export default function ResumesPage() {
  // Starts empty — resumes will be fetched from the database when the backend is connected.
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const setPrimary = (id: string) =>
    setResumes((rs) => rs.map((r) => ({ ...r, isPrimary: r.id === id })));

  const remove = (id: string) => setResumes((rs) => rs.filter((r) => r.id !== id));

  // Temporary optimistic add — will be replaced by a real API call.
  const addResume = () => {
    const id = `r${Date.now()}`;
    setResumes((rs) => [
      ...rs,
      {
        id,
        name: 'Resume_Upload.pdf',
        uploadedAt: new Date().toISOString().slice(0, 10),
        size: '—',
        isPrimary: rs.length === 0,
      },
    ]);
    setShowUpload(false);
  };

  const totalSize = resumes.length > 0 ? `${resumes.length} file${resumes.length !== 1 ? 's' : ''}` : '0 files';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">Resumes</h1>
          <p className="mt-1 text-sm text-text-muted">
            Upload and manage resumes to personalize your interview sessions.
          </p>
        </div>
        <button onClick={() => setShowUpload(true)} className="btn-primary text-sm">
          <Plus size={16} />
          Upload resume
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: <Cloud size={18} />, label: 'Storage', value: totalSize, accent: '#4F46E5' },
          { icon: <Shield size={18} />, label: 'Encryption', value: 'AES-256', accent: '#10B981' },
          { icon: <FileText size={18} />, label: 'Resumes', value: `${resumes.length} uploaded`, accent: '#22D3EE' },
        ].map((s) => (
          <div key={s.label} className="card-base flex items-center gap-3 p-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-btn"
              style={{ background: `${s.accent}1a`, color: s.accent }}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{s.value}</p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {resumes.length === 0 ? (
        <div className="card-base">
          <EmptyState
            icon={<FileText size={24} />}
            title="No resumes uploaded"
            description="Upload your first resume to personalize interview questions based on your experience."
            action={
              <button onClick={() => setShowUpload(true)} className="btn-primary text-sm">
                <Upload size={16} />
                Upload resume
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {resumes.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-base p-5"
            >
              <div className="flex items-start gap-4">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-btn bg-primary/10 text-primary">
                  <FileText size={24} />
                  {r.isPrimary && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ai-gradient text-white shadow-glow">
                      <Star size={11} className="fill-white" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">{r.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {r.uploadedAt}
                    </span>
                    <span className="text-text-disabled">·</span>
                    <span>{r.size}</span>
                  </div>
                </div>
                {r.isPrimary && <Badge variant="primary">Primary</Badge>}
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-divider pt-4">
                {!r.isPrimary && (
                  <button
                    onClick={() => setPrimary(r.id)}
                    className="flex items-center gap-1.5 rounded-btn bg-white/5 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                  >
                    <Star size={14} />
                    Set as primary
                  </button>
                )}
                <button className="flex items-center gap-1.5 rounded-btn bg-white/5 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary">
                  <FileText size={14} />
                  Preview
                </button>
                <button
                  onClick={() => remove(r.id)}
                  className="ml-auto flex items-center gap-1.5 rounded-btn bg-danger/5 px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="glass w-full max-w-md rounded-dialog shadow-soft-lg"
            >
              <div className="flex items-center justify-between border-b border-token px-6 py-4">
                <h2 className="text-base font-semibold text-text-primary">Upload resume</h2>
                <button onClick={() => setShowUpload(false)} className="text-text-muted hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                  className={`flex flex-col items-center justify-center rounded-card border-2 border-dashed py-12 transition-colors ${
                    dragOver ? 'border-primary bg-primary/5' : 'border-token bg-background-secondary'
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-btn bg-primary/10 text-primary">
                    <Upload size={24} />
                  </div>
                  <p className="mt-4 text-sm font-medium text-text-primary">Drag &amp; drop your resume here</p>
                  <p className="mt-1 text-xs text-text-muted">PDF, DOCX up to 10 MB</p>
                  <button onClick={addResume} className="btn-primary mt-5 text-sm">
                    <FileText size={16} />
                    Browse files
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-btn bg-info/5 border border-info/15 p-3">
                  <Shield size={16} className="shrink-0 text-info" />
                  <p className="text-xs text-text-secondary">
                    Files are encrypted and securely stored in the cloud.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
