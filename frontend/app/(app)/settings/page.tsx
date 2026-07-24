'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { User, Bell, Shield, Palette, Check } from 'lucide-react';
import { Badge } from '@/components/shared-ui';
import { useTheme } from '@/lib/theme';

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { user } = useUser();
  const [notifications, setNotifications] = useState({ email: true, practice: true, reports: false });

  const displayName = user?.fullName || user?.username || '—';
  const email = user?.primaryEmailAddress?.emailAddress || '—';
  const avatarInitial = (user?.firstName?.[0] || user?.username?.[0] || '?').toUpperCase();

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-white/10'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform ${
          on ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-text-muted">Manage your account and application preferences.</p>
      </div>

      {/* Profile */}
      <div className="card-base p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-primary/10 text-primary">
            <User size={20} />
          </div>
          <h2 className="text-base font-semibold text-text-primary">Profile</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ai-gradient text-2xl font-bold text-white shadow-glow">
            {avatarInitial}
          </div>
          <div>
            <p className="text-base font-medium text-text-primary">{displayName}</p>
            <p className="text-sm text-text-muted">{email}</p>
            <p className="mt-1 text-xs text-text-muted">
              Profile details are managed through your Clerk account.
            </p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card-base p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-ai-primary/10 text-ai-primary">
            <Palette size={20} />
          </div>
          <h2 className="text-base font-semibold text-text-primary">Appearance</h2>
        </div>
        <div className="flex items-center justify-between rounded-card bg-background-secondary p-4">
          <div>
            <p className="text-sm font-medium text-text-primary">Theme</p>
            <p className="text-xs text-text-muted">Toggle between dark and light mode</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={theme === 'dark' ? 'primary' : 'neutral'}>
              {theme === 'dark' ? 'Dark' : 'Light'}
            </Badge>
            <Toggle on={theme === 'dark'} onClick={toggle} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card-base p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-warning/10 text-warning">
            <Bell size={20} />
          </div>
          <h2 className="text-base font-semibold text-text-primary">Notifications</h2>
        </div>
        <div className="space-y-1">
          {[
            { key: 'email' as const, label: 'Email notifications', desc: 'Receive emails about your account' },
            { key: 'practice' as const, label: 'Practice reminders', desc: 'Get reminded to practice regularly' },
            { key: 'reports' as const, label: 'New report alerts', desc: 'Notify when a report is ready' },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between rounded-card p-3 hover:bg-white/[0.02]">
              <div>
                <p className="text-sm font-medium text-text-primary">{n.label}</p>
                <p className="text-xs text-text-muted">{n.desc}</p>
              </div>
              <Toggle
                on={notifications[n.key]}
                onClick={() => setNotifications((s) => ({ ...s, [n.key]: !s[n.key] }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card-base p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-success/10 text-success">
            <Shield size={20} />
          </div>
          <h2 className="text-base font-semibold text-text-primary">Security</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-card bg-background-secondary p-4">
            <div>
              <p className="text-sm font-medium text-text-primary">Password &amp; authentication</p>
              <p className="text-xs text-text-muted">Managed through your Clerk account</p>
            </div>
            <Badge variant="neutral">Via Clerk</Badge>
          </div>
          <div className="flex items-center justify-between rounded-card bg-background-secondary p-4">
            <div>
              <p className="text-sm font-medium text-text-primary">Two-factor authentication</p>
              <p className="text-xs flex items-center gap-1 text-text-muted">
                <Check size={12} className="text-success" />
                Managed by Clerk
              </p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card-base border-danger/20 p-6">
        <h2 className="mb-1 text-base font-semibold text-danger">Danger zone</h2>
        <p className="mb-4 text-sm text-text-muted">
          Permanently delete your account and all associated data.
        </p>
        <button className="btn-danger text-sm">Delete account</button>
      </div>
    </div>
  );
}
