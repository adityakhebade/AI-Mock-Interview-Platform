"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

interface Company {
  name: string;
  logo: string;
}

const companies: Company[] = [
  { name: "Google",    logo: "/logos/google.png" },
  { name: "Microsoft", logo: "/logos/microsoft.png" },
  { name: "Amazon",    logo: "/logos/amazon.png" },
  { name: "Meta",      logo: "/logos/meta.png" },
  { name: "Apple",     logo: "/logos/apple.png" },
  { name: "Netflix",   logo: "/logos/netflix.png" },
];

// CARD_W + gap (mx-4 = 16px each side = 32px total)
const CARD_W = 180;
const GAP    = 32;
const UNIT   = CARD_W + GAP; // pixels per card slot

function CompanyCard({ company }: { company: Company }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="
        group mx-4 flex shrink-0 flex-col items-center justify-center gap-3
        rounded-2xl
        border border-white/[0.08]
        bg-white/[0.04]
        backdrop-blur-md
        shadow-[0_2px_16px_0_rgba(0,0,0,0.25)]
        cursor-default select-none
        hover:border-purple-500/50
        hover:bg-white/[0.08]
        hover:shadow-[0_0_40px_-6px_rgba(139,92,246,0.55)]
        transition-[border-color,background-color,box-shadow] duration-300
      "
      style={{ width: CARD_W, height: 140, flexShrink: 0 }}
    >
      {/* Fixed 64×64 logo container with padding */}
      <div className="relative flex h-16 w-16 items-center justify-center p-1">
        <Image
          src={company.logo}
          alt={`${company.name} logo`}
          fill
          sizes="64px"
          className="object-contain p-1 transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <span className="text-[13px] font-semibold tracking-wide text-text-muted transition-colors duration-200 group-hover:text-text-primary">
        {company.name}
      </span>
    </motion.div>
  );
}

/** Continuously scrolling ticker using Framer Motion's useAnimationFrame.
 *  Pauses when any card is hovered by tracking mouse state on the wrapper. */
function InfiniteTrack() {
  // Total width of ONE full set of cards
  const totalW      = companies.length * UNIT;
  const x           = useMotionValue(0);
  const paused      = useRef(false);
  const SPEED       = totalW / 28; // px/sec → 28 s per full loop

  // Duplicate list so we can seamlessly reset
  const items = [...companies, ...companies];

  useAnimationFrame((_, delta) => {
    if (paused.current) return;
    const next = x.get() - (SPEED * delta) / 1000;
    // When we've scrolled one full set, snap back without a visible jump
    x.set(next <= -totalW ? next + totalW : next);
  });

  return (
    <div
      className="flex"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <motion.div className="flex" style={{ x }}>
        {items.map((company, i) => (
          <CompanyCard key={`${company.name}-${i}`} company={company} />
        ))}
      </motion.div>
    </div>
  );
}

export function CompaniesMarquee() {
  return (
    <div className="relative z-10 w-full">
      {/* Overflow clip wrapper — full width so cards bleed to edges */}
      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 md:w-56"
          style={{
            background:
              "linear-gradient(to right, var(--color-background) 0%, var(--color-background) 20%, transparent 100%)",
          }}
        />
        {/* Right fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 md:w-56"
          style={{
            background:
              "linear-gradient(to left, var(--color-background) 0%, var(--color-background) 20%, transparent 100%)",
          }}
        />

        <InfiniteTrack />
      </div>
    </div>
  );
}
