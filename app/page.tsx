"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Check,
  Brain,
  Target,
  TrendingUp,
  FileText,
  Clock,
  Shield,
  Zap,
  Star,
} from "lucide-react";
import { Logo } from "@/components/nav";
import { Badge } from "@/components/shared-ui";

const features = [
  {
    icon: <Brain size={22} />,
    title: "AI-Powered Interviews",
    desc: "Adaptive questions that mirror real interview scenarios across behavioral, technical, and system design rounds.",
  },
  {
    icon: <Target size={22} />,
    title: "Targeted Practice",
    desc: "Personalize sessions by role, difficulty, and duration. Focus on the exact skills you need to land the offer.",
  },
  {
    icon: <TrendingUp size={22} />,
    title: "Performance Analytics",
    desc: "Track progress over time with detailed reports, score trends, and skill-level breakdowns.",
  },
  {
    icon: <FileText size={22} />,
    title: "Resume-Aware Sessions",
    desc: "Upload your resume and let IntervueX tailor questions to your experience and target role.",
  },
  {
    icon: <Clock size={22} />,
    title: "Auto-Save & Resume",
    desc: "Never lose progress. Sessions auto-save and can be resumed from exactly where you left off.",
  },
  {
    icon: <Shield size={22} />,
    title: "Secure & Private",
    desc: "Your data is encrypted at rest and in transit. Resumes are stored securely in the cloud.",
  },
];

const steps = [
  { num: "01", title: "Upload your resume", desc: "Securely upload your resume to personalize the interview experience." },
  { num: "02", title: "Configure your session", desc: "Choose interview type, difficulty, duration, and target role." },
  { num: "03", title: "Practice with AI", desc: "Answer adaptive questions one by one with auto-save throughout." },
  { num: "04", title: "Review your report", desc: "Get scores, strengths, weaknesses, and a full performance breakdown." },
];

const stats = [
  { value: "12K+", label: "Mock interviews completed" },
  { value: "94%", label: "Felt more confident" },
  { value: "3.2x", label: "More likely to pass" },
  { value: "4.9/5", label: "Average user rating" },
];

const testimonials = [
  {
    quote:
      "IntervueX felt like a real interview. The AI feedback caught things I never noticed about my answers — I landed my dream role at Stripe.",
    name: "Priya Sharma",
    role: "Senior PM at Stripe",
  },
  {
    quote:
      "The performance analytics are unreal. I could see exactly which skills were weak and practiced until they were sharp. Game changer.",
    name: "Marcus Chen",
    role: "Backend Engineer at Linear",
  },
  {
    quote:
      "I went from failing system design rounds to getting offers at two FAANG companies. The structured practice made all the difference.",
    name: "Elena Vasquez",
    role: "Staff Engineer at Meta",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function LandingPage() {
  const router = useRouter();
  const goToDashboard = () => router.push("/dashboard");

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] bg-indigo-glow opacity-60" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] bg-cyan-glow opacity-40" />
        <div className="absolute left-1/2 top-2/3 h-[450px] w-[450px] -translate-x-1/2 bg-purple-glow opacity-30" />
        <div className="absolute inset-0 bg-grid-texture opacity-[0.4]" />
      </div>
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
        <Logo size="lg" />
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-text-secondary hover:text-text-primary">
            Features
          </a>
          <a href="#how" className="text-sm font-medium text-text-secondary hover:text-text-primary">
            How it works
          </a>
          <a href="#testimonials" className="text-sm font-medium text-text-secondary hover:text-text-primary">
            Testimonials
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={goToDashboard} className="btn-ghost text-sm">
            Sign in
          </button>
          <button onClick={goToDashboard} className="btn-primary text-sm">
            Get started
            <ArrowRight size={16} />
          </button>
        </div>
      </header>
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-16 md:px-8 md:pt-24">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex">
            <Badge variant="ai" className="glass">
              <Sparkles size={14} />
              AI-powered interview preparation
            </Badge>
          </div>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-text-primary md:text-6xl">
            Master every interview.
            <br />
            <span className="text-ai-gradient">Powered by AI.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
            Practice with adaptive mock interviews that feel like the real thing. Get instant feedback,
            detailed reports, and track your progress to land your dream role.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={goToDashboard} className="btn-ai w-full sm:w-auto">
              <Sparkles size={18} />
              Start a mock interview
            </button>
            <button onClick={goToDashboard} className="btn-secondary w-full sm:w-auto">
              View dashboard
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-success" />
              No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-success" />
              Free to start
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-success" />
              Cancel anytime
            </span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="glass rounded-dialog shadow-soft-lg">
            <div className="flex items-center gap-2 border-b border-token px-5 py-3.5">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-danger/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <span className="ml-2 text-xs text-text-muted">intervuex.ai/session/behavioral</span>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-[1.4fr_1fr] md:p-6">
              <div className="rounded-card border border-token bg-surface p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="ai">Question 3 of 8</Badge>
                  <Badge variant="neutral">Behavioral</Badge>
                </div>
                <p className="text-sm font-medium leading-relaxed text-text-primary">
                  Tell me about a time you had to influence a team decision without direct authority. What was
                  the situation and outcome?
                </p>
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-full rounded-full bg-white/5" />
                  <div className="h-2 w-full rounded-full bg-white/5" />
                  <div className="h-2 w-3/4 rounded-full bg-white/5" />
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Clock size={14} />
                    18:42 remaining
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-success">
                    <Check size={14} />
                    Auto-saved
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="rounded-card border border-token bg-surface p-4">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Zap size={14} className="text-ai-primary" />
                    AI Insight
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">
                    Lead with the quantified impact to hook the interviewer faster. Strong STAR structure
                    detected.
                  </p>
                </div>
                <div className="rounded-card border border-token bg-surface p-4">
                  <p className="text-xs text-text-muted">Current score</p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-3xl font-bold text-text-primary">82</span>
                    <span className="mb-1 text-xs text-success">+6 from last</span>
                  </div>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-white/5">
                    <div className="h-full w-[82%] rounded-full bg-ai-gradient" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      <section className="relative z-10 border-y border-token bg-background-secondary/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 md:grid-cols-4 md:px-8">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-8 text-center">
              <p className="text-3xl font-bold text-text-primary md:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="primary">Features</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Everything you need to ace the interview
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            A complete preparation platform built for serious candidates who want to perform at their best.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card-base group p-6"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-btn bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-text-primary">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section id="how" className="relative z-10 border-y border-token bg-background-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="ai">How it works</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
              Four steps to interview readiness
            </h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative"
              >
                <div className="card-base h-full p-6">
                  <span className="text-ai-gradient text-sm font-bold">{s.num}</span>
                  <h3 className="mt-3 text-base font-semibold text-text-primary">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight
                    size={18}
                    className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-text-disabled lg:block"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="testimonials" className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-warning text-warning" />
            ))}
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Loved by ambitious candidates
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card-base p-6"
            >
              <p className="text-sm leading-relaxed text-text-secondary">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ai-gradient text-sm font-semibold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="relative overflow-hidden rounded-dialog border border-token bg-background-secondary p-10 text-center md:p-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 bg-indigo-glow opacity-50" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
              Ready to land your next offer?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
              Start your first mock interview in minutes. No credit card required.
            </p>
            <button onClick={goToDashboard} className="btn-ai mt-8">
              <Sparkles size={18} />
              Get started free
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
      <footer className="relative z-10 border-t border-token">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-8">
          <Logo />
          <p className="text-sm text-text-muted">© 2026 IntervueX. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-text-muted">
            <a href="#" className="hover:text-text-primary">
              Privacy
            </a>
            <a href="#" className="hover:text-text-primary">
              Terms
            </a>
            <a href="#" className="hover:text-text-primary">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
