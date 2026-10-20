import * as React from "react";

/**
 * Restrained geometric horizon composition inspired by the VELTRIX hero.
 * Features:
 * - A geometric structure partially emerging from the background
 * - Thin violet and icy-blue light paths
 * - A subtle illuminated horizon
 * - Delicate surface gradients
 */
export function CtaHorizonVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full select-none overflow-hidden"
    >
      <svg
        viewBox="0 0 1200 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto h-auto w-full max-w-6xl opacity-95"
      >
        <defs>
          <radialGradient
            id="cta-horizon-glow"
            cx="50%"
            cy="88%"
            r="58%"
            fx="50%"
            fy="88%"
          >
            <stop offset="0%" stopColor="var(--accent-violet)" stopOpacity="0.28" />
            <stop offset="45%" stopColor="var(--accent-cyan)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--background)" stopOpacity="0" />
          </radialGradient>

          <linearGradient
            id="cta-horizon-line"
            x1="100"
            y1="272"
            x2="1100"
            y2="272"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--border)" stopOpacity="0" />
            <stop offset="24%" stopColor="var(--accent-violet)" stopOpacity="0.65" />
            <stop offset="50%" stopColor="var(--accent-cyan)" stopOpacity="0.95" />
            <stop offset="76%" stopColor="var(--accent-violet)" stopOpacity="0.65" />
            <stop offset="100%" stopColor="var(--border)" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="cta-violet-arc"
            x1="260"
            y1="272"
            x2="940"
            y2="70"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--accent-violet)" stopOpacity="0.05" />
            <stop offset="50%" stopColor="var(--accent-violet)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient
            id="cta-cyan-arc"
            x1="330"
            y1="120"
            x2="870"
            y2="272"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--accent-cyan)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--accent-violet)" stopOpacity="0.08" />
          </linearGradient>

          <linearGradient
            id="cta-core-facet"
            x1="600"
            y1="96"
            x2="600"
            y2="272"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--surface-elevated)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--background)" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Subtle atmospheric glow above the horizon */}
        <ellipse cx="600" cy="272" rx="540" ry="190" fill="url(#cta-horizon-glow)" />

        {/* Perspective architectural grid rays converging toward central apex */}
        <g stroke="var(--border)" strokeOpacity="0.42" strokeWidth="1">
          <line x1="600" y1="140" x2="180" y2="272" />
          <line x1="600" y1="140" x2="320" y2="272" />
          <line x1="600" y1="140" x2="460" y2="272" />
          <line x1="600" y1="140" x2="600" y2="272" />
          <line x1="600" y1="140" x2="740" y2="272" />
          <line x1="600" y1="140" x2="880" y2="272" />
          <line x1="600" y1="140" x2="1020" y2="272" />
        </g>

        {/* Emerging concentric geometric arcs (partially rising from the horizon) */}
        <path
          d="M 210 272 A 390 215 0 0 1 990 272"
          stroke="var(--border)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <path
          d="M 280 272 A 320 175 0 0 1 920 272"
          stroke="url(#cta-violet-arc)"
          strokeWidth="1.5"
        />
        <path
          d="M 365 272 A 235 130 0 0 1 835 272"
          stroke="url(#cta-cyan-arc)"
          strokeWidth="1.25"
        />
        <path
          d="M 445 272 A 155 85 0 0 1 755 272"
          stroke="var(--accent-violet)"
          strokeOpacity="0.38"
          strokeWidth="1"
        />

        {/* Central architectural polyhedron emerging from the horizon */}
        <polygon
          points="600,104 696,216 600,272 504,216"
          fill="url(#cta-core-facet)"
          stroke="var(--accent-violet)"
          strokeOpacity="0.55"
          strokeWidth="1.25"
        />
        <polygon
          points="600,132 664,216 600,256 536,216"
          fill="none"
          stroke="var(--accent-cyan)"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
        <line
          x1="600"
          y1="104"
          x2="600"
          y2="272"
          stroke="var(--accent-cyan)"
          strokeOpacity="0.65"
          strokeWidth="1.2"
        />
        <line
          x1="504"
          y1="216"
          x2="696"
          y2="216"
          stroke="var(--accent-violet)"
          strokeOpacity="0.45"
          strokeWidth="1"
        />

        {/* Thin violet and icy-blue light pathways connecting language nodes into the horizon */}
        <path
          d="M 150 226 C 310 226, 420 168, 536 216"
          stroke="url(#cta-violet-arc)"
          strokeWidth="1.5"
        />
        <path
          d="M 1050 226 C 890 226, 780 168, 664 216"
          stroke="url(#cta-cyan-arc)"
          strokeWidth="1.5"
        />
        <path
          d="M 270 168 C 390 168, 490 132, 600 132"
          stroke="var(--accent-cyan)"
          strokeOpacity="0.42"
          strokeWidth="1"
        />
        <path
          d="M 930 168 C 810 168, 710 132, 600 132"
          stroke="var(--accent-violet)"
          strokeOpacity="0.42"
          strokeWidth="1"
        />

        {/* Luminous convergence nodes */}
        <circle cx="600" cy="104" r="4" fill="var(--accent-cyan)" />
        <circle
          cx="600"
          cy="104"
          r="9"
          stroke="var(--accent-cyan)"
          strokeOpacity="0.45"
          strokeWidth="1"
        />
        <circle cx="504" cy="216" r="3" fill="var(--accent-violet)" />
        <circle cx="696" cy="216" r="3" fill="var(--accent-cyan)" />
        <circle cx="365" cy="272" r="3" fill="var(--accent-cyan)" />
        <circle cx="835" cy="272" r="3" fill="var(--accent-violet)" />
        <circle cx="270" cy="168" r="2.5" fill="var(--accent-cyan)" />
        <circle cx="930" cy="168" r="2.5" fill="var(--accent-violet)" />

        {/* Subtle technical coordinate markers */}
        <g
          fill="var(--muted-foreground)"
          fillOpacity="0.65"
          fontFamily="var(--font-mono)"
          fontSize="9"
          letterSpacing="1.6"
        >
          <text x="152" y="214">
            SYS.SYNTH // 01
          </text>
          <text x="966" y="214">
            AST.HORIZON // 05
          </text>
          <text x="556" y="88">
            VELTRIX // CORE
          </text>
        </g>

        {/* Illuminated Horizon Baseline */}
        <line
          x1="60"
          y1="272"
          x2="1140"
          y2="272"
          stroke="url(#cta-horizon-line)"
          strokeWidth="2"
        />
        <line
          x1="240"
          y1="286"
          x2="960"
          y2="286"
          stroke="var(--border)"
          strokeOpacity="0.55"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
