'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  Check,
  Play,
  Pause,
  Send,
  Brain,
  Code,
  Layers,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import { Badge, ProgressBar, EmptyState } from '@/components/shared-ui';
import { interviews, resumes, type InterviewType, type Difficulty, type InterviewSession } from '@/lib/data';

type View = 'list' | 'setup' | 'session';

const typeIcons: Record<InterviewType, React.ReactNode> = {
  Behavioral: <Brain size={20} />,
  Technical: <Code size={20} />,
  'System Design': <Layers size={20} />,
  'Case Study': <Briefcase size={20} />,
};

function statusBadge(status: InterviewSession['status']) {
  return {
    completed: { variant: 'success' as const, label: 'Completed' },
    'in-progress': { variant: 'warning' as const, label: 'In progress' },
    upcoming: { variant: 'info' as const, label: 'Upcoming' },
    failed: { variant: 'danger' as const, label: 'Failed' },
  }[status];
}

export default function InterviewsPage() {
  const router = useRouter();
  const [view, setView] = useState<View>('list');
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'upcoming'>('all');
  const filtered = filter === 'all' ? interviews : interviews.filter((i) => i.status === filter);

  if (view === 'setup') return <SetupView onBack={() => setView('list')} onStart={() => setView('session')} />;
  if (view === 'session')
    return (
      <SessionView
        onBack={() => setView('list')}
        onComplete={() => {
          setView('list');
          router.push('/reports');
        }}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">Interviews</h1>
          <p className="mt-1 text-sm text-text-muted">Create, resume, and review your mock interview sessions.</p>
        </div>
        <button onClick={() => setView('setup')} className="btn-ai text-sm">
          <Sparkles size={16} />
          New interview
        </button>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {(['all', 'completed', 'in-progress', 'upcoming'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-badge px-3.5 py-1.5 text-sm font-medium transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-white/5 text-text-secondary hover:bg-surface-hover'}`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="card-base">
          <EmptyState
            icon={<Sparkles size={24} />}
            title="No interviews yet"
            description="Start your first mock interview to see it here. It only takes a few minutes to set up."
            action={
              <button onClick={() => setView('setup')} className="btn-ai text-sm">
                <Sparkles size={16} />
                New interview
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((iv, i) => {
            const sb = statusBadge(iv.status);
            return (
              <motion.div
                key={iv.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="card-base group p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-primary/10 text-primary">
                    {typeIcons[iv.type]}
                  </div>
                  <Badge variant={sb.variant}>{sb.label}</Badge>
                </div>
                <h3 className="mt-4 text-base font-semibold text-text-primary">{iv.role}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                  <span>{iv.type}</span>
                  <span className="text-text-disabled">·</span>
                  <span>{iv.difficulty}</span>
                  <span className="text-text-disabled">·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {iv.duration} min
                  </span>
                </div>
                {(iv.status === 'completed' || iv.status === 'failed') && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="text-text-muted">Score</span>
                      <span
                        className={`font-semibold ${iv.score >= 80 ? 'text-success' : iv.score >= 60 ? 'text-warning' : 'text-danger'}`}
                      >
                        {iv.score}/100
                      </span>
                    </div>
                    <ProgressBar
                      value={iv.score}
                      color={iv.score >= 80 ? '#10B981' : iv.score >= 60 ? '#F59E0B' : '#EF4444'}
                    />
                  </div>
                )}
                {iv.status === 'in-progress' && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="text-text-muted">Progress</span>
                      <span className="text-text-secondary">
                        {iv.questionsAnswered}/{iv.totalQuestions}
                      </span>
                    </div>
                    <ProgressBar value={(iv.questionsAnswered / iv.totalQuestions) * 100} color="#F59E0B" />
                  </div>
                )}
                <button
                  onClick={() => {
                    if (iv.status === 'completed' || iv.status === 'failed') {
                      router.push('/reports');
                    } else {
                      setView('session');
                    }
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-btn border border-token bg-background-secondary py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                >
                  {iv.status === 'in-progress' ? (
                    <>
                      <Play size={14} />
                      Resume
                    </>
                  ) : iv.status === 'upcoming' ? (
                    <>Start now</>
                  ) : (
                    <>View report</>
                  )}
                  <ChevronRight size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SetupView({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  const [type, setType] = useState<InterviewType>('Behavioral');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [duration, setDuration] = useState(30);
  const [role, setRole] = useState('Senior Product Manager');
  const [resumeId, setResumeId] = useState(resumes[0]?.id || '');
  const types: { label: InterviewType; icon: React.ReactNode; desc: string }[] = [
    { label: 'Behavioral', icon: <Brain size={20} />, desc: 'STAR-based questions about past experiences' },
    { label: 'Technical', icon: <Code size={20} />, desc: 'Domain-specific technical questions' },
    { label: 'System Design', icon: <Layers size={20} />, desc: 'Scalable architecture design problems' },
    { label: 'Case Study', icon: <Briefcase size={20} />, desc: 'Business strategy and analytical cases' },
  ];
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary">
        <ArrowLeft size={16} />
        Back to interviews
      </button>
      <div>
        <div className="mb-2 inline-flex">
          <Badge variant="ai">
            <Sparkles size={14} />
            New interview
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">Configure your session</h1>
        <p className="mt-1 text-sm text-text-muted">Tailor the interview to your target role and skill level.</p>
      </div>
      <div className="card-base p-6">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Interview type</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {types.map((t) => (
            <button
              key={t.label}
              onClick={() => setType(t.label)}
              className={`flex items-start gap-3 rounded-card border p-4 text-left transition-all ${type === t.label ? 'border-primary bg-primary/5 shadow-glow' : 'border-token bg-background-secondary hover:border-white/15 hover:bg-surface-hover'}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-btn ${type === t.label ? 'bg-ai-gradient text-white' : 'bg-white/5 text-text-muted'}`}
              >
                {t.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{t.label}</p>
                <p className="mt-0.5 text-xs text-text-muted">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-base p-6">
          <label className="mb-2 block text-sm font-semibold text-text-primary">Target role</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input-base w-full"
            placeholder="e.g. Senior Product Manager"
          />
          <p className="mt-2 text-xs text-text-muted">Questions will be tailored to this role.</p>
        </div>
        <div className="card-base p-6">
          <label className="mb-2 block text-sm font-semibold text-text-primary">Resume</label>
          <select value={resumeId} onChange={(e) => setResumeId(e.target.value)} className="input-base w-full">
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
                {r.isPrimary ? ' (Primary)' : ''}
              </option>
            ))}
            <option value="">No resume</option>
          </select>
          <p className="mt-2 text-xs text-text-muted">Personalize questions based on your resume.</p>
        </div>
      </div>
      <div className="card-base p-6">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Difficulty</h2>
        <div className="grid grid-cols-3 gap-3">
          {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`rounded-card border py-3 text-sm font-medium transition-all ${difficulty === d ? (d === 'Easy' ? 'border-success bg-success/5 text-success' : d === 'Medium' ? 'border-warning bg-warning/5 text-warning' : 'border-danger bg-danger/5 text-danger') : 'border-token bg-background-secondary text-text-secondary hover:bg-surface-hover'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      <div className="card-base p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Duration</h2>
          <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <Clock size={16} />
            {duration} min
          </span>
        </div>
        <input
          type="range"
          min={15}
          max={60}
          step={15}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="mt-2 flex justify-between text-xs text-text-muted">
          <span>15 min</span>
          <span>30 min</span>
          <span>45 min</span>
          <span>60 min</span>
        </div>
      </div>
      <div className="card-base p-6">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Session summary</h2>
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div className="rounded-card bg-background-secondary p-3">
            <p className="text-xs text-text-muted">Type</p>
            <p className="mt-1 font-medium text-text-primary">{type}</p>
          </div>
          <div className="rounded-card bg-background-secondary p-3">
            <p className="text-xs text-text-muted">Difficulty</p>
            <p className="mt-1 font-medium text-text-primary">{difficulty}</p>
          </div>
          <div className="rounded-card bg-background-secondary p-3">
            <p className="text-xs text-text-muted">Duration</p>
            <p className="mt-1 font-medium text-text-primary">{duration} min</p>
          </div>
          <div className="rounded-card bg-background-secondary p-3">
            <p className="text-xs text-text-muted">Questions</p>
            <p className="mt-1 font-medium text-text-primary">{Math.round(duration / 5)}</p>
          </div>
        </div>
        <button onClick={onStart} className="btn-ai mt-5 w-full">
          <Sparkles size={18} />
          Start interview
        </button>
      </div>
    </div>
  );
}

function SessionView({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const sessionQuestions = [
    'Tell me about a time you had to influence a team decision without direct authority. What was the situation and outcome?',
    'Describe a project where you had to balance competing priorities. How did you decide what to focus on?',
    'Walk me through a situation where you received critical feedback. How did you respond and what changed?',
    'Tell me about a time you failed at something important. What did you learn?',
    'Describe a moment when you had to make a decision with incomplete information.',
    'How do you handle working with a difficult stakeholder or teammate?',
  ];
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(sessionQuestions.length).fill(''));
  const [saved, setSaved] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      if (!paused) setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [paused]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const isLast = current === sessionQuestions.length - 1;
  const progress = ((current + 1) / sessionQuestions.length) * 100;

  const updateAnswer = (val: string) => {
    setAnswers((a) => a.map((ans, i) => (i === current ? val : ans)));
    setSaved(false);
    setTimeout(() => setSaved(true), 800);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary">
          <ArrowLeft size={16} />
          Exit
        </button>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1.5 text-xs ${saved ? 'text-success' : 'text-text-muted'}`}>
            <Check size={14} className={saved ? '' : 'opacity-40'} />
            {saved ? 'Auto-saved' : 'Saving...'}
          </span>
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex items-center gap-1.5 rounded-btn border border-token bg-background-secondary px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-hover"
          >
            {paused ? (
              <>
                <Play size={14} />
                Resume
              </>
            ) : (
              <>
                <Pause size={14} />
                Pause
              </>
            )}
          </button>
          <span
            className={`flex items-center gap-1.5 rounded-btn px-3 py-1.5 text-sm font-medium ${secondsLeft < 60 ? 'bg-danger/10 text-danger' : 'bg-white/5 text-text-secondary'}`}
          >
            <Clock size={14} />
            {mm}:{ss}
          </span>
        </div>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-text-muted">
            Question {current + 1} of {sessionQuestions.length}
          </span>
          <span className="text-text-muted">{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} color="#8B5CF6" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="card-base p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="ai">
              <Sparkles size={14} />
              Behavioral
            </Badge>
            <Badge variant="neutral">Medium</Badge>
          </div>
          <p className="text-lg font-medium leading-relaxed text-text-primary">{sessionQuestions[current]}</p>
          <textarea
            value={answers[current]}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder="Type your answer here... Use the STAR method for behavioral questions."
            className="input-base mt-5 min-h-[200px] w-full resize-y leading-relaxed"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
            <span>{answers[current].split(/\s+/).filter(Boolean).length} words</span>
            <span>Aim for 150-300 words</span>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="btn-secondary text-sm disabled:opacity-40"
        >
          <ArrowLeft size={16} />
          Previous
        </button>
        {isLast ? (
          <button onClick={onComplete} className="btn-ai text-sm">
            <Send size={16} />
            Submit interview
          </button>
        ) : (
          <button
            onClick={() => setCurrent((c) => Math.min(sessionQuestions.length - 1, c + 1))}
            className="btn-primary text-sm"
          >
            Next
            <ArrowRight size={16} />
          </button>
        )}
      </div>
      <div className="card-base p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Question navigator</p>
        <div className="flex flex-wrap gap-2">
          {sessionQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex h-8 w-8 items-center justify-center rounded-btn text-xs font-medium transition-all ${i === current ? 'bg-ai-gradient text-white' : answers[i]?.length > 0 ? 'bg-success/10 text-success border border-success/20' : 'bg-white/5 text-text-muted hover:bg-surface-hover'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
