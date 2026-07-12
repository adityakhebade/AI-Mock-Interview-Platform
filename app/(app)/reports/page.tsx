'use client';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Check, AlertTriangle, Trophy, Target, Brain, ChevronRight } from 'lucide-react';
import { Badge, ScoreRing, ProgressBar } from '@/components/shared-ui';
import { interviews, questions, skillBreakdown, performanceTrend } from '@/lib/data';

export default function ReportsPage() {
  const completedInterviews = interviews.filter((i) => i.status === 'completed' || i.status === 'failed');
  const selected = completedInterviews[0];
  const avgScore = Math.round(completedInterviews.reduce((a, b) => a + b.score, 0) / completedInterviews.length || 0);
  const bestScore = Math.max(...completedInterviews.map((i) => i.score));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">Reports & Analytics</h1><p className="mt-1 text-sm text-text-muted">Review your interview performance and track progress over time.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[{ label: 'Interviews completed', value: completedInterviews.length, icon: <Brain size={18} />, accent: '#4F46E5' }, { label: 'Average score', value: avgScore, icon: <TrendingUp size={18} />, accent: '#10B981' }, { label: 'Best score', value: bestScore, icon: <Trophy size={18} />, accent: '#F59E0B' }, { label: 'Improvement', value: '+24%', icon: <Target size={18} />, accent: '#22D3EE' }].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="card-base p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-btn" style={{ background: `${s.accent}1a`, color: s.accent }}>{s.icon}</div><div><p className="text-2xl font-bold text-text-primary">{s.value}</p><p className="text-xs text-text-muted">{s.label}</p></div></div></div>
          </motion.div>
        ))}
      </div>
      {selected && (<div className="space-y-4">
        <div className="flex items-center gap-2"><Badge variant="ai"><Sparkles size={14} />Latest report</Badge><span className="text-sm text-text-muted">{selected.role} · {selected.type}</span></div>
        <div className="grid gap-4 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-base flex flex-col items-center p-6">
            <p className="mb-4 text-sm font-medium text-text-muted">Overall score</p><ScoreRing score={selected.score} size={140} />
            <div className="mt-4 flex items-center gap-2"><Badge variant={selected.score >= 80 ? 'success' : selected.score >= 60 ? 'warning' : 'danger'}>{selected.score >= 80 ? 'Excellent' : selected.score >= 60 ? 'Good' : 'Needs work'}</Badge></div>
            <p className="mt-3 text-xs text-text-muted">{new Date(selected.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-base p-6 lg:col-span-2">
            <h3 className="text-base font-semibold text-text-primary">Strengths & weaknesses</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><p className="mb-3 flex items-center gap-1.5 text-sm font-medium text-success"><Check size={16} />Strengths</p><ul className="space-y-2">{questions[0].strengths?.map((s) => <li key={s} className="flex items-start gap-2 rounded-card bg-success/5 border border-success/15 p-2.5 text-sm text-text-secondary"><Check size={14} className="mt-0.5 shrink-0 text-success" />{s}</li>)}</ul></div>
              <div><p className="mb-3 flex items-center gap-1.5 text-sm font-medium text-warning"><AlertTriangle size={16} />Areas to improve</p><ul className="space-y-2">{questions[0].improvements?.map((s) => <li key={s} className="flex items-start gap-2 rounded-card bg-warning/5 border border-warning/15 p-2.5 text-sm text-text-secondary"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-warning" />{s}</li>)}</ul></div>
            </div>
          </motion.div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-base p-6">
            <h3 className="mb-4 text-base font-semibold text-text-primary">Skill breakdown</h3>
            <div className="space-y-4">{skillBreakdown.map((s) => <div key={s.skill}><div className="mb-1.5 flex items-center justify-between text-sm"><span className="text-text-secondary">{s.skill}</span><span className="font-medium text-text-primary">{s.value}</span></div><ProgressBar value={s.value} color={s.value >= 80 ? '#10B981' : s.value >= 65 ? '#4F46E5' : '#F59E0B'} /></div>)}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-base p-6">
            <h3 className="mb-4 text-base font-semibold text-text-primary">Score trend</h3>
            <div className="relative h-48">
              <svg viewBox="0 0 400 180" className="h-full w-full" preserveAspectRatio="none">
                <defs><linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" /><stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" /></linearGradient></defs>
                {[0, 1, 2, 3].map((g) => <line key={g} x1="0" y1={g * 45 + 10} x2="400" y2={g * 45 + 10} stroke="rgba(255,255,255,0.04)" />)}
                {(() => { const pts = performanceTrend.map((p, i) => ({ x: (i / (performanceTrend.length - 1)) * 380 + 10, y: 170 - (p.value / 100) * 150, ...p })); const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '); return (<><path d={`${path} L 390 170 L 10 170 Z`} fill="url(#reportGrad)" /><path d={path} fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />{pts.map((p) => <circle key={p.label} cx={p.x} cy={p.y} r="4" fill="#09090B" stroke="#8B5CF6" strokeWidth="2" />)}</>); })()}
              </svg>
            </div>
            <div className="mt-2 flex justify-between px-2 text-xs text-text-muted">{performanceTrend.map((p) => <span key={p.label}>{p.label}</span>)}</div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-base p-6">
          <h3 className="mb-4 text-base font-semibold text-text-primary">Question-wise review</h3>
          <div className="space-y-4">{questions.map((q, i) => (
            <div key={q.id} className="rounded-card border border-token bg-background-secondary p-5">
              <div className="flex items-start justify-between gap-4"><div className="flex-1"><div className="mb-2 flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-btn bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span><Badge variant="neutral">{q.difficulty}</Badge></div><p className="text-sm font-medium leading-relaxed text-text-primary">{q.prompt}</p></div><div className="shrink-0 text-right"><p className={`text-2xl font-bold ${(q.score || 0) >= 80 ? 'text-success' : (q.score || 0) >= 60 ? 'text-warning' : 'text-danger'}`}>{q.score}</p><p className="text-xs text-text-muted">/ 100</p></div></div>
              <div className="mt-4 border-t border-divider pt-4"><p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-muted">Your answer</p><p className="text-sm leading-relaxed text-text-secondary">{q.answer}</p></div>
              <div className="mt-4 flex items-start gap-2 rounded-btn bg-ai-gradient-soft p-3"><Sparkles size={16} className="mt-0.5 shrink-0 text-ai-primary" /><p className="text-sm leading-relaxed text-text-secondary">{q.feedback}</p></div>
            </div>))}
          </div>
        </motion.div>
      </div>)}
      <div className="card-base p-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Interview history</h3>
        <div className="space-y-2">{interviews.filter((i) => i.status === 'completed' || i.status === 'failed').map((iv) => (
          <button key={iv.id} className="flex w-full items-center gap-4 rounded-card border border-transparent p-3 text-left transition-colors hover:border-token hover:bg-background-secondary">
            <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-primary/10 text-primary"><Brain size={18} /></div>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-text-primary">{iv.role}</p><p className="text-xs text-text-muted">{iv.type} · {iv.difficulty} · {new Date(iv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p></div>
            <div className="flex items-center gap-3"><div className="w-24"><ProgressBar value={iv.score} color={iv.score >= 80 ? '#10B981' : iv.score >= 60 ? '#F59E0B' : '#EF4444'} /></div><span className={`w-10 text-right text-sm font-semibold ${iv.score >= 80 ? 'text-success' : iv.score >= 60 ? 'text-warning' : 'text-danger'}`}>{iv.score}</span><ChevronRight size={16} className="text-text-muted" /></div>
          </button>))}
        </div>
      </div>
    </div>
  );
}
