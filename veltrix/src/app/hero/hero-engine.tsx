"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type LanguageKey = "python" | "typescript" | "rust" | "go";

interface LanguagePanelData {
  id: LanguageKey;
  label: string;
  file: string;
  annotation: string;
  positionClass: string;
  floatDelay: string;
  nodeCoords: { x: number; y: number };
  lines: Array<{
    num: string;
    tokens: Array<{ text: string; tone: "keyword" | "ident" | "type" | "string" | "punct" | "comment" }>;
  }>;
}

const LANGUAGE_PANELS: LanguagePanelData[] = [
  {
    id: "python",
    label: "Python",
    file: "synthesizer.py",
    annotation: "CONTEXT ENGINE",
    positionClass: "top-2 left-0 sm:top-4 sm:left-2",
    floatDelay: "0s",
    nodeCoords: { x: 140, y: 120 },
    lines: [
      {
        num: "01",
        tokens: [
          { text: "async def ", tone: "keyword" },
          { text: "resolve_graph", tone: "ident" },
          { text: "(ctx: ", tone: "punct" },
          { text: "Context", tone: "type" },
          { text: ") -> ", tone: "punct" },
          { text: "IRNode", tone: "type" },
          { text: ":", tone: "punct" },
        ],
      },
      {
        num: "02",
        tokens: [
          { text: "  schema = ", tone: "punct" },
          { text: "await ", tone: "keyword" },
          { text: "ctx.infer_types()", tone: "ident" },
        ],
      },
      {
        num: "03",
        tokens: [
          { text: "  return ", tone: "keyword" },
          { text: "schema.emit(", tone: "ident" },
          { text: "\"canonical\"", tone: "string" },
          { text: ")", tone: "punct" },
        ],
      },
    ],
  },
  {
    id: "typescript",
    label: "TypeScript",
    file: "bridge.ts",
    annotation: "LANGUAGE INTERFACE",
    positionClass: "top-6 right-0 sm:top-8 sm:right-2",
    floatDelay: "-1.5s",
    nodeCoords: { x: 460, y: 130 },
    lines: [
      {
        num: "01",
        tokens: [
          { text: "export function ", tone: "keyword" },
          { text: "bindContract", tone: "ident" },
          { text: "<T extends ", tone: "punct" },
          { text: "Schema", tone: "type" },
          { text: ">(", tone: "punct" },
        ],
      },
      {
        num: "02",
        tokens: [
          { text: "  ir: ", tone: "punct" },
          { text: "IRNode", tone: "type" },
          { text: "<T>", tone: "punct" },
        ],
      },
      {
        num: "03",
        tokens: [
          { text: "): ", tone: "punct" },
          { text: "TypedClient", tone: "type" },
          { text: "<T> { ", tone: "punct" },
          { text: "return ", tone: "keyword" },
          { text: "compile(ir); }", tone: "ident" },
        ],
      },
    ],
  },
  {
    id: "rust",
    label: "Rust",
    file: "kernel.rs",
    annotation: "CODE SYNTHESIS",
    positionClass: "bottom-10 left-0 sm:bottom-8 sm:left-4",
    floatDelay: "-3s",
    nodeCoords: { x: 150, y: 420 },
    lines: [
      {
        num: "01",
        tokens: [
          { text: "pub fn ", tone: "keyword" },
          { text: "verify_bounds", tone: "ident" },
          { text: "<'a>(ir: &'a ", tone: "punct" },
          { text: "IRNode", tone: "type" },
          { text: ") -> ", tone: "punct" },
          { text: "Result", tone: "type" },
          { text: "<()> {", tone: "punct" },
        ],
      },
      {
        num: "02",
        tokens: [
          { text: "  ir.assert_zero_copy(", tone: "ident" },
          { text: "Ordering::SeqCst", tone: "type" },
          { text: ")?", tone: "punct" },
        ],
      },
      {
        num: "03",
        tokens: [
          { text: "  Ok", tone: "type" },
          { text: "(()) }", tone: "punct" },
        ],
      },
    ],
  },
  {
    id: "go",
    label: "Go",
    file: "dispatch.go",
    annotation: "RUNTIME GRAPH",
    positionClass: "bottom-2 right-0 sm:bottom-6 sm:right-2",
    floatDelay: "-4.2s",
    nodeCoords: { x: 455, y: 415 },
    lines: [
      {
        num: "01",
        tokens: [
          { text: "func ", tone: "keyword" },
          { text: "DispatchStream", tone: "ident" },
          { text: "(ctx ", tone: "punct" },
          { text: "context.Context", tone: "type" },
          { text: ") ", tone: "punct" },
          { text: "error", tone: "type" },
          { text: " {", tone: "punct" },
        ],
      },
      {
        num: "02",
        tokens: [
          { text: "   pipe := ", tone: "punct" },
          { text: "veltrix.Link", tone: "ident" },
          { text: "(", tone: "punct" },
          { text: "\"rust.kernel\"", tone: "string" },
          { text: ")", tone: "punct" },
        ],
      },
      {
        num: "03",
        tokens: [
          { text: "  return ", tone: "keyword" },
          { text: "pipe.Commit(ctx)", tone: "ident" },
          { text: " }", tone: "punct" },
        ],
      },
    ],
  },
];

function tokenColorClass(tone: "keyword" | "ident" | "type" | "string" | "punct" | "comment") {
  switch (tone) {
    case "keyword":
      return "text-primary font-medium";
    case "type":
      return "text-accent";
    case "string":
      return "text-foreground/90";
    case "ident":
      return "text-foreground";
    case "comment":
      return "text-muted-foreground/70 italic";
    default:
      return "text-muted-foreground";
  }
}

export function HeroEngine() {
  const [activeLang, setActiveLang] = React.useState<LanguageKey>("rust");
  const [pointerOffset, setPointerOffset] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Cycle highlighted language node periodically unless user is interacting
  const [isUserInteracting, setIsUserInteracting] = React.useState(false);

  React.useEffect(() => {
    if (isUserInteracting) return;
    const order: LanguageKey[] = ["python", "typescript", "rust", "go"];
    const interval = window.setInterval(() => {
      setActiveLang((prev) => {
        const nextIndex = (order.indexOf(prev) + 1) % order.length;
        return order[nextIndex];
      });
    }, 3600);
    return () => window.clearInterval(interval);
  }, [isUserInteracting]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setPointerOffset({
      x: Math.max(-1, Math.min(1, normX)) * 10,
      y: Math.max(-1, Math.min(1, normY)) * 10,
    });
  };

  const handlePointerLeave = () => {
    setPointerOffset({ x: 0, y: 0 });
    setIsUserInteracting(false);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto w-full max-w-[640px] lg:max-w-none select-none"
      aria-label="VELTRIX Intelligence Engine connecting Python, TypeScript, Rust, and Go code representations"
      role="region"
    >
      {/* Background Layer: Deep atmospheric lighting & architectural frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 sm:-inset-10 rounded-3xl opacity-80"
        style={{
          background:
            "radial-gradient(circle at 54% 48%, oklch(0.675 0.195 292 / 0.16), oklch(0.795 0.135 232 / 0.08) 42%, transparent 72%)",
        }}
      />

      {/* Interactive language switcher bar for mobile and keyboard users */}
      <div className="mb-4 flex items-center justify-between gap-2 rounded-lg border border-border/80 bg-background-secondary/90 px-3 py-2 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            ACTIVE SYNTHESIS NODE
          </span>
        </div>
        <div className="flex items-center gap-1" role="tablist" aria-label="Select active language node">
          {LANGUAGE_PANELS.map((panel) => {
            const isSelected = activeLang === panel.id;
            return (
              <Button
                key={panel.id}
                type="button"
                variant={isSelected ? "default" : "ghost"}
                size="xs"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setIsUserInteracting(true);
                  setActiveLang(panel.id);
                }}
                className={`font-mono text-xs ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-medium shadow-soft"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                {panel.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Main 3D-inspired Canvas Container */}
      <div className="relative min-h-[460px] sm:min-h-[540px] w-full overflow-hidden rounded-2xl border border-border/90 bg-background-secondary/80 p-4 sm:p-6 shadow-lifted backdrop-blur-md">
        {/* Subtle internal coordinate grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-veltrix-grid opacity-55"
        />

        {/* Top engineering telemetry strip */}
        <div className="relative z-20 flex items-center justify-between border-b border-border/60 pb-3 text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="text-primary font-medium">SYS // VELTRIX-CORE-01</span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="hidden sm:inline">AST GRAPH: SYNCHRONIZED</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-border bg-surface-elevated/80 font-mono text-[10px] uppercase tracking-widest text-accent"
            >
              LANGUAGE INTERFACE
            </Badge>
          </div>
        </div>

        {/* Centerpiece SVG Intelligence Structure (Middle + Foreground layers) */}
        <div
          className="relative z-10 flex items-center justify-center py-6 sm:py-10 transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${pointerOffset.x}px, ${pointerOffset.y}px, 0)`,
          }}
        >
          <svg
            viewBox="0 0 600 520"
            className="h-[340px] w-full max-w-[560px] sm:h-[430px]"
            role="img"
            aria-labelledby="veltrix-engine-title veltrix-engine-desc"
          >
            <title id="veltrix-engine-title">VELTRIX Computational Intelligence Core</title>
            <desc id="veltrix-engine-desc">
              Interlocking geometric rings and illuminated pathways linking Python, TypeScript, Rust, and Go code structures into one semantic engine.
            </desc>

            <defs>
              <linearGradient id="veltrix-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-violet)" stopOpacity="0.85" />
                <stop offset="50%" stopColor="var(--accent-cyan)" stopOpacity="0.65" />
                <stop offset="100%" stopColor="var(--accent-violet)" stopOpacity="0.2" />
              </linearGradient>

              <linearGradient id="veltrix-beam-active" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-violet)" stopOpacity="0.95" />
                <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.95" />
              </linearGradient>

              <radialGradient id="veltrix-core-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--accent-violet)" stopOpacity="0.38" />
                <stop offset="55%" stopColor="var(--accent-cyan)" stopOpacity="0.12" />
                <stop offset="100%" stopColor="var(--accent-violet)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient Core Halo */}
            <circle cx="300" cy="260" r="165" fill="url(#veltrix-core-glow)" />

            {/* Architectural Reference Hairlines */}
            <g stroke="var(--border)" strokeWidth="1" opacity="0.65">
              <line x1="60" y1="260" x2="540" y2="260" strokeDasharray="3 6" />
              <line x1="300" y1="40" x2="300" y2="480" strokeDasharray="3 6" />
              <circle cx="300" cy="260" r="190" fill="none" strokeDasharray="2 8" />
            </g>

            {/* Outer Precision Ring (Slow Orbit) */}
            <g
              style={{
                transformOrigin: "300px 260px",
                animation: "veltrix-orbit-slow 48s linear infinite",
              }}
            >
              <circle
                cx="300"
                cy="260"
                r="148"
                fill="none"
                stroke="url(#veltrix-ring-grad)"
                strokeWidth="1.25"
                strokeDasharray="44 14 12 14"
              />
              <circle cx="300" cy="112" r="3.5" fill="var(--accent-cyan)" />
              <circle cx="448" cy="260" r="3" fill="var(--accent-violet)" />
              <circle cx="300" cy="408" r="3.5" fill="var(--accent-cyan)" />
              <circle cx="152" cy="260" r="3" fill="var(--accent-violet)" />
            </g>

            {/* Tilted Elliptical Rings (3D Gyroscopic Perspective) */}
            <g transform="translate(300 260) rotate(-28)">
              <ellipse
                cx="0"
                cy="0"
                rx="132"
                ry="58"
                fill="none"
                stroke="url(#veltrix-ring-grad)"
                strokeWidth="1.5"
              />
              <circle cx="-132" cy="0" r="3.5" fill="var(--accent-violet)" />
              <circle cx="132" cy="0" r="3.5" fill="var(--accent-cyan)" />
            </g>

            <g transform="translate(300 260) rotate(32)">
              <ellipse
                cx="0"
                cy="0"
                rx="124"
                ry="52"
                fill="none"
                stroke="var(--accent-cyan)"
                strokeOpacity="0.45"
                strokeWidth="1.2"
                strokeDasharray="18 8"
              />
            </g>

            {/* Counter-Rotating Inner Polygon Ring */}
            <g
              style={{
                transformOrigin: "300px 260px",
                animation: "veltrix-orbit-reverse 36s linear infinite",
              }}
            >
              <polygon
                points="300,168 380,214 380,306 300,352 220,306 220,214"
                fill="var(--surface-elevated)"
                fillOpacity="0.55"
                stroke="url(#veltrix-ring-grad)"
                strokeWidth="1.5"
              />
              <circle
                cx="300"
                cy="260"
                r="64"
                fill="none"
                stroke="var(--border)"
                strokeWidth="1.25"
              />
            </g>

            {/* Illuminated Pathways from Central Core to Language Panels */}
            {LANGUAGE_PANELS.map((panel) => {
              const isCurrent = activeLang === panel.id;
              const { x, y } = panel.nodeCoords;
              const midX = (300 + x) / 2;
              const pathD = `M 300 260 C ${midX} 260, ${midX} ${y}, ${x} ${y}`;
              return (
                <g key={panel.id}>
                  {/* Base structural pathway */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isCurrent ? "url(#veltrix-beam-active)" : "var(--border)"}
                    strokeWidth={isCurrent ? "2.25" : "1.2"}
                    strokeDasharray={isCurrent ? "none" : "4 4"}
                    opacity={isCurrent ? "1" : "0.65"}
                  />
                  {/* Endpoint node */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isCurrent ? "6" : "4"}
                    fill={isCurrent ? "var(--accent-cyan)" : "var(--surface-elevated)"}
                    stroke={isCurrent ? "var(--accent-violet)" : "var(--border)"}
                    strokeWidth="2"
                  />
                </g>
              );
            })}

            {/* Central Converging Geometric Core */}
            <g>
              <circle
                cx="300"
                cy="260"
                r="38"
                fill="var(--background)"
                stroke="url(#veltrix-beam-active)"
                strokeWidth="2"
              />
              {/* Precision V-Convergence Emblem inside Core */}
              <path
                d="M284 246 L300 276 L316 246"
                fill="none"
                stroke="var(--accent-violet)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M291 246 L300 263 L309 246"
                fill="none"
                stroke="var(--accent-cyan)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Foreground Engineering Micro-Annotations */}
            <g className="font-mono" fontSize="10" fill="var(--muted-foreground)">
              <line
                x1="332"
                y1="232"
                x2="368"
                y2="202"
                stroke="var(--accent-violet)"
                strokeWidth="1"
              />
              <circle cx="332" cy="232" r="2.5" fill="var(--accent-violet)" />
              <text x="373" y="205" letterSpacing="0.12em">
                CONTEXT ENGINE
              </text>

              <line
                x1="266"
                y1="290"
                x2="226"
                y2="322"
                stroke="var(--accent-cyan)"
                strokeWidth="1"
              />
              <circle cx="266" cy="290" r="2.5" fill="var(--accent-cyan)" />
              <text x="122" y="334" letterSpacing="0.12em">
                CODE SYNTHESIS
              </text>
            </g>
          </svg>

          {/* Floating Miniature Code Editor Panels (Desktop 4-corner layout) */}
          <div className="hidden sm:block">
            {LANGUAGE_PANELS.map((panel) => {
              const isSelected = activeLang === panel.id;
              return (
                <div
                  key={panel.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`Select ${panel.label} synthesis node (${panel.file})`}
                  onMouseEnter={() => {
                    setIsUserInteracting(true);
                    setActiveLang(panel.id);
                  }}
                  onClick={() => {
                    setIsUserInteracting(true);
                    setActiveLang(panel.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsUserInteracting(true);
                      setActiveLang(panel.id);
                    }
                  }}
                  style={{
                    animation: `veltrix-float 7s ease-in-out ${panel.floatDelay} infinite`,
                  }}
                  className={`absolute z-20 w-[238px] cursor-pointer rounded-xl border p-3 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                    panel.positionClass
                  } ${
                    isSelected
                      ? "border-primary/80 bg-surface-elevated/95 shadow-lifted"
                      : "border-border/85 bg-background/90 opacity-85 hover:opacity-100 hover:border-border"
                  }`}
                >
                  {/* Panel Window Chrome */}
                  <div className="mb-2 flex items-center justify-between border-b border-border/60 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isSelected ? "bg-primary" : "bg-muted-foreground/40"
                        }`}
                      />
                      <span className="font-mono text-[11px] font-medium text-foreground">
                        {panel.file}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-accent">
                      {panel.label}
                    </span>
                  </div>

                  {/* Code Lines */}
                  <div className="space-y-1 font-mono text-[10.5px] leading-relaxed">
                    {panel.lines.map((line) => (
                      <div key={line.num} className="flex items-baseline gap-2 overflow-hidden">
                        <span className="select-none text-[9px] text-muted-foreground/50">
                          {line.num}
                        </span>
                        <div className="truncate">
                          {line.tokens.map((tok, i) => (
                            <span key={i} className={tokenColorClass(tok.tone)}>
                              {tok.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Micro Annotation Footer */}
                  <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-1.5 font-mono text-[9px] tracking-widest text-muted-foreground">
                    <span>{panel.annotation}</span>
                    <span className={isSelected ? "text-primary" : "text-muted-foreground/60"}>
                      {isSelected ? "LINKED" : "READY"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Active Language Code Inspector (Clean stacked representation for <640px) */}
        <div className="relative z-20 mt-2 block sm:hidden">
          {LANGUAGE_PANELS.filter((p) => p.id === activeLang).map((panel) => (
            <div
              key={panel.id}
              className="rounded-xl border border-primary/60 bg-surface-elevated/95 p-3.5 shadow-soft"
            >
              <div className="mb-2 flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-mono text-xs font-medium text-foreground">
                    {panel.file}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  {panel.annotation}
                </span>
              </div>
              <div className="space-y-1 font-mono text-xs leading-relaxed">
                {panel.lines.map((line) => (
                  <div key={line.num} className="flex items-baseline gap-2.5 overflow-x-auto">
                    <span className="select-none text-[10px] text-muted-foreground/50">
                      {line.num}
                    </span>
                    <div className="whitespace-pre">
                      {line.tokens.map((tok, i) => (
                        <span key={i} className={tokenColorClass(tok.tone)}>
                          {tok.text}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Status Telemetry Bar inside Engine Frame */}
        <div className="relative z-20 mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              CONTEXT ENGINE
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              CODE SYNTHESIS
            </span>
          </div>
          <span className="text-foreground/80">4 LANGUAGES MAPPED</span>
        </div>
      </div>
    </div>
  );
}
