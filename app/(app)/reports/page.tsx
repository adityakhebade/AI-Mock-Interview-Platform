'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Trophy, Target, Brain } from 'lucide-react';
import { EmptyState } from '@/components/shared-ui';
import { useRouter } from 'next/navigation';

export default function ReportsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
          Reports &amp; Analytics
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Review your interview performance and track progress over time.
        </p>
      </div>

      {/* Stats — empty until real data is available */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Interviews completed', value: '—', icon: <Brain size={18} />, accent: '#4F46E5' },
          { label: 'Average score', value: '—', icon: <TrendingUp size={18} />, accent: '#10B981' },
          { label: 'Best score', value: '—', icon: <Trophy size={18} />, accent: '#F59E0B' },
          { label: 'Improvement', value: '—', icon: <Target size={18} />, accent: '#22D3EE' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="card-base p-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-btn"
                  style={{ background: `${s.accent}1a`, color: s.accent }}
                >
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{s.value}</p>
                  <p className="text-xs text-text-muted">{s.label}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      <div className="card-base">
        <EmptyState
          icon={<Sparkles size={24} />}
          title="No reports yet"
          description="Complete your first mock interview and your detailed performance report will appear here."
          action={
            <button onClick={() => router.push('/interviews')} className="btn-ai text-sm">
              <Sparkles size={16} />
              Start your first interview
            </button>
          }
        />
      </div>
    </div>
  );
}
