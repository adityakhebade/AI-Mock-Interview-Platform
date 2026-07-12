'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, TrendingUp, Sparkles, ArrowRight, Clock, Play, Plus, Trophy, Target, ChevronRight } from 'lucide-react';
import { Badge, ProgressBar } from '@/components/shared-ui';
import { interviews, resumes, performanceTrend, skillBreakdown, type InterviewSession } from '@/lib/data';

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] as const } }) };

function statusBadge(status: InterviewSession['status']) {
  return { completed: { variant: 'success' as const, label: 'Completed' }, 'in-progress': { variant: 'warning' as const, label: 'In progress' }, upcoming: { variant: 'info' as const, label: 'Upcoming' }, failed: { variant: 'danger' as const, label: 'Failed' } }[status];
}

export default function DashboardPage() {
  const router = useRouter();
  const completed = interviews.filter((i) => i.status === 'completed');
  const avgScore = Math.round(completed.reduce((a, b) => a + b.score, 0) / completed.length || 0);
  const inProgress = interviews.filter((i) => i.status === 'in-progress');
  const upcoming = interviews.filter((i) => i.status === 'upcoming');
  const recent = [...interviews].slice(0, 4);
  const primaryResume = resumes.find((r) => r.isPrimary);

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><p className="text-sm text-text-muted">Welcome back,</p><h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">Alex Morgan</h1><p className="mt-1 text-sm text-text-muted">You've completed {completed.length} interviews. Keep the momentum going.</p></div>
          <div className="flex gap-2"><button onClick={() => router.push('/interviews')} className="btn-secondary text-sm"><FileText size={16} />Upload resume</button><button onClick={() => router.push('/interviews')} className="btn-ai text-sm"><Sparkles size={16} />New interview</button></div>
        </div>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[{ label: 'Total interviews', value: interviews.length, icon: <MessageSquare size={18} />, accent: '#4F46E5', change: '+2 this week' }, { label: 'Average score', value: avgScore, icon: <Trophy size={18} />, accent: '#10B981', change: '+6 pts' }, { label: 'In progress', value: inProgress.length, icon: <Clock size={18} />, accent: '#F59E0B', change: 'Resume now' }, { label: 'Upcoming', value: upcoming.length, icon: <Target size={18} />, accent: '#22D3EE', change: 'Scheduled' }].map((s, i) => (
          <motion.div key={s.label} initial="hidden" animate="show" custom={i + 1} variants={fadeUp}>
            <div className="card-base p-5"><div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-btn" style={{ background: `${s.accent}1a`, color: s.accent }}>{s.icon}</div><span className="text-xs text-text-muted">{s.change}</span></div><p className="mt-4 text-3xl font-bold text-text-primary">{s.value}</p><p className="mt-1 text-sm text-text-muted">{s.label}</p></div>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial="hidden" animate="show" custom={5} variants={fadeUp} className="card-base p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="text-base font-semibold text-text-primary">Performance overview</h2><p className="text-sm text-text-muted">Score trend across recent interviews</p></div><button onClick={() => router.push('/reports')} className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover">View reports<ChevronRight size={16} /></button></div>
          <div className="relative h-48">
            <svg viewBox="0 0 400 180" className="h-full w-full" preserveAspectRatio="none">
              <defs><linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" /><stop offset="100%" stopColor="#4F46E5" stopOpacity="0" /></linearGradient><linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4F46E5" /><stop offset="50%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#22D3EE" /></linearGradient></defs>
              {[0, 1, 2, 3].map((g) => <line key={g} x1="0" y1={g * 45 + 10} x2="400" y2={g * 45 + 10} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />)}
              {(() => { const pts = performanceTrend.map((p, i) => { const x = (i / (performanceTrend.length - 1)) * 380 + 10; const y = 170 - (p.value / 100) * 150; return { x, y, ...p }; }); const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '); const area = `${path} L 390 170 L 10 170 Z`; return (<><path d={area} fill="url(#perfGrad)" /><path d={path} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />{pts.map((p) => (<g key={p.label}><circle cx={p.x} cy={p.y} r="4" fill="#09090B" stroke="#8B5CF6" strokeWidth="2" /><text x={p.x} y={p.y - 12} textAnchor="middle" className="fill-text-secondary" style={{ fontSize: 10 }}>{p.value}</text></g>))}</>); })()}
            </svg>
          </div>
          <div className="mt-2 flex justify-between px-2 text-xs text-text-muted">{performanceTrend.map((p) => <span key={p.label}>{p.label}</span>)}</div>
        </motion.div>
        <motion.div initial="hidden" animate="show" custom={6} variants={fadeUp} className="card-base p-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-base font-semibold text-text-primary">Resume</h2><button onClick={() => router.push('/resumes')} className="text-text-muted hover:text-text-primary"><ChevronRight size={18} /></button></div>
          {primaryResume ? (<><div className="flex items-center gap-3 rounded-card border border-token bg-background-secondary p-4"><div className="flex h-10 w-10 items-center justify-center rounded-btn bg-primary/10 text-primary"><FileText size={20} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-text-primary">{primaryResume.name}</p><p className="text-xs text-text-muted">Uploaded {primaryResume.uploadedAt}</p></div><Badge variant="primary">Primary</Badge></div><div className="mt-3 flex items-center justify-between text-xs text-text-muted"><span>{resumes.length} resumes total</span><button onClick={() => router.push('/resumes')} className="flex items-center gap-1 text-primary hover:text-primary-hover">Manage<ArrowRight size={12} /></button></div></>) : (<div className="flex flex-col items-center py-6 text-center"><FileText size={32} className="text-text-disabled" /><p className="mt-3 text-sm text-text-muted">No resume uploaded</p><button className="btn-secondary mt-4 text-sm"><Plus size={16} />Upload resume</button></div>)}
        </motion.div>
        <motion.div initial="hidden" animate="show" custom={7} variants={fadeUp} className="card-base p-6">
          <h2 className="mb-4 text-base font-semibold text-text-primary">Skill breakdown</h2>
          <div className="space-y-4">{skillBreakdown.map((s) => (<div key={s.skill}><div className="mb-1.5 flex items-center justify-between text-sm"><span className="text-text-secondary">{s.skill}</span><span className="font-medium text-text-primary">{s.value}</span></div><ProgressBar value={s.value} color={s.value >= 80 ? '#10B981' : s.value >= 65 ? '#4F46E5' : '#F59E0B'} /></div>))}</div>
        </motion.div>
        <motion.div initial="hidden" animate="show" custom={8} variants={fadeUp} className="card-base p-6 lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-text-primary">Quick actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[{ title: 'Start behavioral interview', desc: '30 min · Medium', icon: <MessageSquare size={20} />, action: () => router.push('/interviews'), ai: true }, { title: 'Practice system design', desc: '45 min · Hard', icon: <Target size={20} />, action: () => router.push('/interviews') }, { title: 'Review last report', desc: '82 score · Behavioral', icon: <TrendingUp size={20} />, action: () => router.push('/reports') }, { title: 'Upload new resume', desc: 'Personalize sessions', icon: <FileText size={20} />, action: () => router.push('/resumes') }].map((a) => (
              <button key={a.title} onClick={a.action} className="group flex items-center gap-3 rounded-card border border-token bg-background-secondary p-4 text-left transition-all hover:border-white/15 hover:bg-surface-hover focus-ring">
                <div className={`flex h-10 w-10 items-center justify-center rounded-btn ${a.ai ? 'bg-ai-gradient text-white' : 'bg-primary/10 text-primary'}`}>{a.icon}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-text-primary">{a.title}</p><p className="truncate text-xs text-text-muted">{a.desc}</p></div>
                <ArrowRight size={16} className="text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-text-primary" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div initial="hidden" animate="show" custom={9} variants={fadeUp} className="card-base p-6">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-base font-semibold text-text-primary">Recent interviews</h2><p className="text-sm text-text-muted">Your latest practice sessions</p></div><button onClick={() => router.push('/interviews')} className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover">View all<ChevronRight size={16} /></button></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[640px]"><thead><tr className="border-b border-token text-left text-xs uppercase tracking-wider text-text-muted"><th className="pb-3 font-medium">Role</th><th className="pb-3 font-medium">Type</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Score</th><th className="pb-3 font-medium">Date</th><th className="pb-3" /></tr></thead>
          <tbody>{recent.map((iv) => { const sb = statusBadge(iv.status); return (<tr key={iv.id} className="border-b border-divider last:border-0 transition-colors hover:bg-white/[0.02]"><td className="py-3.5"><p className="text-sm font-medium text-text-primary">{iv.role}</p><p className="text-xs text-text-muted">{iv.difficulty} · {iv.duration} min</p></td><td className="py-3.5"><Badge variant="neutral">{iv.type}</Badge></td><td className="py-3.5"><Badge variant={sb.variant}>{sb.label}</Badge></td><td className="py-3.5">{iv.status === 'completed' || iv.status === 'failed' ? <div className="flex items-center gap-2"><span className={`text-sm font-semibold ${iv.score >= 80 ? 'text-success' : iv.score >= 60 ? 'text-warning' : 'text-danger'}`}>{iv.score}</span><div className="w-16"><ProgressBar value={iv.score} color={iv.score >= 80 ? '#10B981' : iv.score >= 60 ? '#F59E0B' : '#EF4444'} /></div></div> : <span className="text-sm text-text-muted">—</span>}</td><td className="py-3.5 text-sm text-text-muted">{new Date(iv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td><td className="py-3.5 text-right"><button onClick={() => router.push(iv.status === 'in-progress' ? '/interviews' : '/reports')} className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover">{iv.status === 'in-progress' ? <><Play size={14} />Resume</> : iv.status === 'upcoming' ? <>Start</> : <>View</>}</button></td></tr>); })}</tbody>
        </table></div>
      </motion.div>
      <motion.div initial="hidden" animate="show" custom={10} variants={fadeUp}>
        <div className="relative overflow-hidden rounded-card border border-ai-primary/20 bg-ai-gradient-soft p-6">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-purple-glow opacity-40" />
          <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-ai-gradient text-white shadow-ai-glow"><Sparkles size={22} /></div><div><h3 className="text-base font-semibold text-text-primary">AI Insight</h3><p className="mt-1 max-w-xl text-sm text-text-secondary">Your communication scores improved 12% over the last 3 sessions. System design remains your weakest area — schedule a focused practice session to close the gap.</p></div></div>
            <button onClick={() => router.push('/interviews')} className="btn-ai shrink-0 text-sm"><Sparkles size={16} />Practice system design</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
