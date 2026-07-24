'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import {
  MessageSquare,
  FileText,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  Plus,
  Trophy,
  Target,
} from 'lucide-react';
import { EmptyState } from '@/components/shared-ui';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();

  const firstName = user?.firstName || user?.username || 'there';

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-text-muted">Welcome back,</p>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
              {firstName}
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              Start your first interview to see your progress here.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push('/resumes')} className="btn-secondary text-sm">
              <FileText size={16} />
              Upload resume
            </button>
            <button onClick={() => router.push('/interviews')} className="btn-ai text-sm">
              <Sparkles size={16} />
              New interview
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats — empty state */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total interviews', value: '—', icon: <MessageSquare size={18} />, accent: '#4F46E5' },
          { label: 'Average score', value: '—', icon: <Trophy size={18} />, accent: '#10B981' },
          { label: 'In progress', value: '—', icon: <Clock size={18} />, accent: '#F59E0B' },
          { label: 'Upcoming', value: '—', icon: <Target size={18} />, accent: '#22D3EE' },
        ].map((s, i) => (
          <motion.div key={s.label} initial="hidden" animate="show" custom={i + 1} variants={fadeUp}>
            <div className="card-base p-5">
              <div className="flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-btn"
                  style={{ background: `${s.accent}1a`, color: s.accent }}
                >
                  {s.icon}
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-text-muted">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent interviews empty state */}
      <motion.div initial="hidden" animate="show" custom={5} variants={fadeUp} className="card-base p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-text-primary">Recent interviews</h2>
            <p className="text-sm text-text-muted">Your latest practice sessions</p>
          </div>
          <button
            onClick={() => router.push('/interviews')}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover"
          >
            View all
            <ArrowRight size={16} />
          </button>
        </div>
        <EmptyState
          icon={<MessageSquare size={24} />}
          title="No interviews yet"
          description="Complete your first mock interview and your session history will appear here."
          action={
            <button onClick={() => router.push('/interviews')} className="btn-ai text-sm">
              <Sparkles size={16} />
              Start your first interview
            </button>
          }
        />
      </motion.div>

      {/* Quick actions */}
      <motion.div initial="hidden" animate="show" custom={6} variants={fadeUp} className="card-base p-6">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: 'Start behavioral interview',
              desc: '30 min · Medium',
              icon: <MessageSquare size={20} />,
              action: () => router.push('/interviews'),
              ai: true,
            },
            {
              title: 'Practice system design',
              desc: '45 min · Hard',
              icon: <Target size={20} />,
              action: () => router.push('/interviews'),
            },
            {
              title: 'View reports',
              desc: 'Track your progress',
              icon: <TrendingUp size={20} />,
              action: () => router.push('/reports'),
            },
            {
              title: 'Upload resume',
              desc: 'Personalize sessions',
              icon: <FileText size={20} />,
              action: () => router.push('/resumes'),
            },
          ].map((a) => (
            <button
              key={a.title}
              onClick={a.action}
              className="group flex items-center gap-3 rounded-card border border-token bg-background-secondary p-4 text-left transition-all hover:border-white/15 hover:bg-surface-hover focus-ring"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-btn ${
                  a.ai ? 'bg-ai-gradient text-white' : 'bg-primary/10 text-primary'
                }`}
              >
                {a.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">{a.title}</p>
                <p className="truncate text-xs text-text-muted">{a.desc}</p>
              </div>
              <ArrowRight
                size={16}
                className="text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-text-primary"
              />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Onboarding CTA */}
      <motion.div initial="hidden" animate="show" custom={7} variants={fadeUp}>
        <div className="relative overflow-hidden rounded-card border border-ai-primary/20 bg-ai-gradient-soft p-6">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-purple-glow opacity-40" />
          <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-ai-gradient text-white shadow-ai-glow">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-primary">Get started with IntervueX</h3>
                <p className="mt-1 max-w-xl text-sm text-text-secondary">
                  Upload your resume, configure your first session, and let AI tailor the interview to your
                  target role and experience level.
                </p>
              </div>
            </div>
            <button onClick={() => router.push('/interviews')} className="btn-ai shrink-0 text-sm">
              <Sparkles size={16} />
              Start now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
