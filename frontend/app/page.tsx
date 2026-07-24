"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SignInButton, SignUpButton, useAuth, UserButton } from "@clerk/nextjs";
import {
  Sparkles, ArrowRight, Check,
  Brain, Target, TrendingUp, FileText, Clock, Shield, Star,
} from "lucide-react";
import { Logo } from "@/components/nav";
import { Badge } from "@/components/shared-ui";
import { CompaniesMarquee } from "@/components/home/CompaniesMarquee";

/* ─────────────────────────────────────────────────────────────────
   LAYOUT TOKENS
   All spacing, sizing, and rhythm values live here.
   8px base unit → 1 unit = 8px
───────────────────────────────────────────────────────────────── */

/**
 * Shared content container — max-w-[1280px], responsive horizontal padding.
 * Applied to every section's inner wrapper so all headings align on the
 * same vertical axis across the page.
 */
const C = "mx-auto w-full max-w-[1280px] px-6 sm:px-8 md:px-12";

/**
 * Section heading block — badge → title → subtitle, identical on every section.
 * badge mb-6 (24px) → title → mt-6 (24px) → subtitle → mt-16 (64px) → content
 */
const SectionHeading = ({
  badge,
  badgeVariant = "primary",
  title,
  subtitle,
  stars = false,
}: {
  badge: string;
  badgeVariant?: "primary" | "ai" | "neutral";
  title: string;
  subtitle: string;
  stars?: boolean;
}) => (
  <div className="mx-auto mb-16 max-w-2xl text-center">
    {stars && (
      <div className="mb-6 flex items-center justify-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={18} className="fill-warning text-warning" />
        ))}
      </div>
    )}
    {!stars && (
      <div className="mb-6 inline-flex">
        <Badge variant={badgeVariant}>{badge}</Badge>
      </div>
    )}
    {stars && (
      <div className="mb-6 inline-flex">
        <Badge variant={badgeVariant}>{badge}</Badge>
      </div>
    )}
    <h2 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">{title}</h2>
    <p className="mt-6 text-lg text-text-secondary">{subtitle}</p>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────────────────────────── */
const features = [
  { icon: <Brain size={22} />, title: "AI-Powered Interviews", desc: "Adaptive questions that mirror real interview scenarios across behavioral, technical, and system design rounds." },
  { icon: <Target size={22} />, title: "Targeted Practice", desc: "Personalize sessions by role, difficulty, and duration. Focus on the exact skills you need to land the offer." },
  { icon: <TrendingUp size={22} />, title: "Performance Analytics", desc: "Track progress over time with detailed reports, score trends, and skill-level breakdowns." },
  { icon: <FileText size={22} />, title: "Resume-Aware Sessions", desc: "Upload your resume and let IntervueX tailor questions to your experience and target role." },
  { icon: <Clock size={22} />, title: "Auto-Save & Resume", desc: "Never lose progress. Sessions auto-save and can be resumed from exactly where you left off." },
  { icon: <Shield size={22} />, title: "Secure & Private", desc: "Your data is encrypted at rest and in transit. Resumes are stored securely in the cloud." },
];

const steps = [
  { num: "01", title: "Upload your resume", desc: "Securely upload your resume to personalise the interview experience." },
  { num: "02", title: "Configure your session", desc: "Choose interview type, difficulty, duration, and target role." },
  { num: "03", title: "Practice with AI", desc: "Answer adaptive questions one by one with auto-save throughout." },
  { num: "04", title: "Review your report", desc: "Get scores, strengths, weaknesses, and a full performance breakdown." },
];

const stats = [
  { value: "12K+",  label: "Mock interviews completed" },
  { value: "94%",   label: "Felt more confident" },
  { value: "3.2×",  label: "More likely to pass" },
  { value: "4.9/5", label: "Average user rating" },
];

const testimonials = [
  { quote: "IntervueX felt like a real interview. The AI feedback caught things I never noticed — I landed my dream role at Stripe.", name: "Priya Sharma", role: "Senior PM at Stripe" },
  { quote: "The performance analytics are unreal. I could see exactly which skills were weak and practiced until they were sharp. Game changer.", name: "Marcus Chen", role: "Backend Engineer at Linear" },
  { quote: "I went from failing system design rounds to getting offers at two FAANG companies. The structured practice made all the difference.", name: "Elena Vasquez", role: "Staff Engineer at Meta" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = (i: number) => ({ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const });

/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const goToDashboard = () => router.push("/dashboard");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">

      {/* Background glows — fixed so they don't scroll */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] bg-indigo-glow opacity-50" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] bg-cyan-glow opacity-30" />
        <div className="absolute left-1/2 top-2/3 h-[500px] w-[500px] -translate-x-1/2 bg-purple-glow opacity-25" />
        <div className="absolute inset-0 bg-grid-texture opacity-30" />
      </div>

      {/* ══════════════════════════════════════════
          1. NAVBAR
          Height: 72px. Same container as all sections.
      ══════════════════════════════════════════ */}
      <header className="relative z-20">
        <div className={`${C} flex h-[72px] items-center justify-between`}>
          <Logo size="lg" />

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features"      className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">Features</a>
            <a href="#how"           className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">How it works</a>
            <a href="#testimonials"  className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">Testimonials</a>
          </nav>

          <div className="flex items-center gap-3">
            {isLoaded && isSignedIn ? (
              <UserButton />
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="btn-ghost text-sm">Sign in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-primary text-sm">
                    Get started <ArrowRight size={15} />
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          2. HERO
          Full viewport height (minus navbar).
          Internal spacing: badge → 24px → h1 → 24px → p → 32px → CTAs → 24px → pills
      ══════════════════════════════════════════ */}
      <section className="relative z-10 flex min-h-[calc(100vh-72px)] flex-col items-center justify-center">
        <div className={`${C} py-16 text-center`}>
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="mx-auto max-w-4xl">

            {/* Badge */}
            <div className="mb-6 inline-flex">
              <Badge variant="ai" className="glass">
                <Sparkles size={14} />
                AI-powered interview preparation
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-text-primary md:text-[72px]">
              Master every interview.
              <br />
              <span className="text-ai-gradient">Powered by AI.</span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary md:text-xl">
              Practice with adaptive mock interviews that feel like the real thing. Get instant
              feedback, detailed reports, and track your progress to land your dream role.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {isLoaded && isSignedIn ? (
                <>
                  <button onClick={goToDashboard} className="btn-ai w-full sm:w-auto">
                    <Sparkles size={18} /> Start a mock interview
                  </button>
                  <button onClick={goToDashboard} className="btn-secondary w-full sm:w-auto">
                    View dashboard <ArrowRight size={16} />
                  </button>
                </>
              ) : (
                <>
                  <SignUpButton mode="modal">
                    <button className="btn-ai w-full sm:w-auto">
                      <Sparkles size={18} /> Start a mock interview
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button className="btn-secondary w-full sm:w-auto">
                      View dashboard <ArrowRight size={16} />
                    </button>
                  </SignInButton>
                </>
              )}
            </div>

            {/* Trust pills */}
            <div className="mt-6 flex items-center justify-center gap-8 text-xs text-text-muted">
              {["No credit card", "Free to start", "Cancel anytime"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check size={13} className="text-success" /> {t}
                </span>
              ))}
            </div>

          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. STATISTICS
          Spacing above: 120px from hero bottom (mt-[120px] on outer section
          achieved via the section's top padding).
          4 equal columns, numbers + labels perfectly centered.
      ══════════════════════════════════════════ */}
      <section className="relative z-10 border-y border-token bg-background-secondary/60">
        <div className={C}>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center justify-center gap-2 border-r border-token px-8 py-10 text-center last:border-r-0 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r"
              >
                <p className="text-4xl font-bold tracking-tight text-text-primary">{s.value}</p>
                <p className="text-sm text-text-muted">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. COMPANIES MARQUEE
          120px above (section py-[120px] split as pt-[120px]).
          Marquee is full-width so overflow is on its own container.
      ══════════════════════════════════════════ */}
      <section className="relative z-10 pt-[120px] pb-[140px]">
        {/* Heading uses the same container/rhythm as all other sections */}
        <div className={C}>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-6 inline-flex">
              <Badge variant="ai">Supported Companies</Badge>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
              Practice for the companies that matter
            </h2>
            <p className="mt-6 text-lg text-text-secondary">
              Tailored interview sessions for the world&apos;s most competitive tech companies.
            </p>
          </div>
        </div>
        {/* Marquee is intentionally full-width (no container) for the infinite scroll effect */}
        <CompaniesMarquee />
      </section>

      {/* ══════════════════════════════════════════
          5. FEATURES
          140px above. 3-col grid, 32px gap, equal card height.
      ══════════════════════════════════════════ */}
      <section id="features" className="relative z-10 pb-[140px]">
        <div className={C}>
          <SectionHeading
            badge="Features"
            badgeVariant="primary"
            title="Everything you need to ace the interview"
            subtitle="A complete preparation platform built for serious candidates who want to perform at their best."
          />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={stagger(i)}
                className="card-base group flex flex-col p-8"
              >
                {/* Icon — same position on every card */}
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-btn bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  {f.icon}
                </div>
                {/* Title — same vertical position on every card */}
                <h3 className="text-base font-semibold text-text-primary">{f.title}</h3>
                {/* Desc — grows to push nothing, cards align via grid */}
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. HOW IT WORKS
          140px above. 4 equal-height cards, 32px gap.
      ══════════════════════════════════════════ */}
      <section id="how" className="relative z-10 border-y border-token bg-background-secondary/50">
        <div className={`${C} py-[140px]`}>
          <SectionHeading
            badge="How it works"
            badgeVariant="ai"
            title="Four steps to interview readiness"
            subtitle="From setup to report in under an hour."
          />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={stagger(i)}
                className="relative"
              >
                <div className="card-base flex h-full flex-col p-8">
                  <span className="text-ai-gradient mb-4 text-sm font-bold">{s.num}</span>
                  <h3 className="text-base font-semibold text-text-primary">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight
                    size={18}
                    className="absolute -right-[18px] top-1/2 hidden -translate-y-1/2 text-text-disabled lg:block"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. TESTIMONIALS
          140px above. 3 equal-height cards, stars + quote + avatar aligned.
      ══════════════════════════════════════════ */}
      <section id="testimonials" className="relative z-10 pb-[140px] pt-[140px]">
        <div className={C}>
          <SectionHeading
            badge="Testimonials"
            badgeVariant="neutral"
            title="Loved by ambitious candidates"
            subtitle="Join thousands of candidates who improved their interview performance with IntervueX."
            stars
          />
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={stagger(i)}
                className="card-base flex flex-col p-8"
              >
                {/* Stars — always at top */}
                <div className="mb-5 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="fill-warning text-warning" />
                  ))}
                </div>
                {/* Quote — flex-1 pushes avatar to bottom */}
                <p className="flex-1 text-sm leading-relaxed text-text-secondary">
                  &ldquo;{t.quote}&rdquo;
                </p>
                {/* Avatar row — always at bottom */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ai-gradient text-sm font-semibold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. FINAL CTA
          140px above, 100px above footer.
          Same container width as all sections.
          Equal internal padding (64px all sides on desktop).
      ══════════════════════════════════════════ */}
      <section className="relative z-10 pb-[100px]">
        <div className={C}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[32px] border border-white/[0.08] p-16 text-center md:p-20"
            style={{
              background: "linear-gradient(135deg, rgba(79,70,229,0.18) 0%, rgba(139,92,246,0.14) 50%, rgba(34,211,238,0.08) 100%)",
              boxShadow: "0 0 0 1px rgba(139,92,246,0.12), 0 40px 80px -20px rgba(79,70,229,0.25)",
            }}
          >
            {/* Glows inside CTA */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 bg-indigo-glow opacity-40" />
              <div className="absolute bottom-0 left-1/2 h-[200px] w-[500px] -translate-x-1/2 bg-purple-glow opacity-30" />
            </div>

            <div className="relative mx-auto max-w-2xl">
              {/* Badge */}
              <div className="mb-6 inline-flex">
                <Badge variant="ai">
                  <Sparkles size={13} />
                  Start for free today
                </Badge>
              </div>

              {/* Headline */}
              <h2 className="text-3xl font-bold tracking-tight text-text-primary md:text-5xl">
                Ready to land your next offer?
              </h2>

              {/* Description */}
              <p className="mt-6 text-lg text-text-secondary">
                Start your first mock interview in minutes. No credit card required. Cancel anytime.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {isLoaded && isSignedIn ? (
                  <button onClick={goToDashboard} className="btn-ai px-8 py-3 text-base">
                    <Sparkles size={18} /> Go to dashboard <ArrowRight size={16} />
                  </button>
                ) : (
                  <>
                    <SignUpButton mode="modal">
                      <button className="btn-ai px-8 py-3 text-base">
                        <Sparkles size={18} /> Get started free <ArrowRight size={16} />
                      </button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                      <button className="btn-secondary px-8 py-3 text-base">Sign in</button>
                    </SignInButton>
                  </>
                )}
              </div>

              {/* Social proof */}
              <p className="mt-6 text-sm text-text-muted">
                Join{" "}
                <span className="font-semibold text-text-secondary">12,000+</span>{" "}
                candidates already preparing with IntervueX
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. FOOTER
          100px above (padding handled by CTA section).
          Logo left · copyright center · links right.
      ══════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-token">
        <div className={`${C} flex flex-col items-center justify-between gap-4 py-8 md:flex-row`}>
          <Logo />
          <p className="text-sm text-text-muted">© 2026 IntervueX. All rights reserved.</p>
          <nav className="flex gap-6 text-sm text-text-muted">
            <a href="#" className="transition-colors hover:text-text-primary">Privacy</a>
            <a href="#" className="transition-colors hover:text-text-primary">Terms</a>
            <a href="#" className="transition-colors hover:text-text-primary">Contact</a>
          </nav>
        </div>
      </footer>

    </div>
  );
}
