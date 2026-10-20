"use client";

import * as React from "react";
import { ArrowUpRight, Code2, Cpu, GitBranch, Layers, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  INTELLIGENCE_CAPABILITIES,
  LANGUAGE_NODES,
  type LanguageNode,
} from "@/app/intelligence";

const CENTER_X = 300;
const CENTER_Y = 225;

const CAPABILITY_ICONS = [Layers, GitBranch, Cpu] as const;

export function IntelligenceSection() {
  const [selectedId, setSelectedId] = React.useState<string>("python");
  const [CompareId, setCompareId] = React.useState<string>("rust");

  const activeNode: LanguageNode =
    LANGUAGE_NODES.find((node) => node.id === selectedId) ?? LANGUAGE_NODES[0];

  const compareNode: LanguageNode =
    LANGUAGE_NODES.find((node) => node.id === CompareId) ?? LANGUAGE_NODES[3];

  const handleSelectLanguage = (id: string) => {
    if (id === selectedId) return;
    setCompareId(selectedId);
    setSelectedId(id);
  };

  return (
    <section
      id="intelligence"
      aria-labelledby="intelligence-heading"
      className="relative overflow-hidden border-b border-border bg-background-secondary bg-veltrix-grid py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Eyebrow */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-primary"
            />
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              SECTION 02 // THE INTELLIGENCE SECTION
            </span>
          </div>
          <Badge
            variant="outline"
            className="border-border bg-surface-elevated/80 font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
          >
            7 LANGUAGES · UNIFIED LOGIC GRAPH
          </Badge>
        </div>

        {/* Immersive Split Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* Left Column: Headline, Supporting Paragraph, and Three Compact Editorial Blocks */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-5">
              <h2
                id="intelligence-heading"
                className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem] lg:leading-[1.1]"
              >
                The language changes.{" "}
                <span className="text-veltrix-gradient">
                  The logic connects.
                </span>
              </h2>

              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                Move between programming languages without losing sight of the
                problem you&apos;re solving. VELTRIX is designed to help
                developers understand implementations, explore alternative
                approaches, and work with code in context.
              </p>
            </div>

            {/* Three Compact Editorial Blocks (Avoiding generic identical cards) */}
            <div
              role="list"
              aria-label="Core intelligence capabilities"
              className="divide-y divide-border/80 border-y border-border/80"
            >
              {INTELLIGENCE_CAPABILITIES.map((block, index) => {
                const Icon = CAPABILITY_ICONS[index] ?? Code2;
                const isMiddle = index === 1;
                return (
                  <div
                    key={block.title}
                    role="listitem"
                    className="group py-5 transition-colors first:pt-5 last:pb-5"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        aria-hidden="true"
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface-elevated ${
                          isMiddle ? "text-accent" : "text-primary"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span
                            className={`font-mono text-[11px] uppercase tracking-widest ${
                              isMiddle ? "text-accent" : "text-primary"
                            }`}
                          >
                            {block.marker}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {block.technicalNote}
                          </span>
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                          {block.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {block.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Keyboard / Click Language Selector Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  INSPECT LANGUAGE NODE
                </span>
                <span className="font-mono text-xs text-primary">
                  ACTIVE: {activeNode.name.toUpperCase()}
                </span>
              </div>
              <div
                role="group"
                aria-label="Select programming language node"
                className="flex flex-wrap gap-2"
              >
                {LANGUAGE_NODES.map((node) => {
                  const isSelected = node.id === activeNode.id;
                  return (
                    <Button
                      key={node.id}
                      type="button"
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handleSelectLanguage(node.id)}
                      onMouseEnter={() => setSelectedId(node.id)}
                      onFocus={() => setSelectedId(node.id)}
                      aria-pressed={isSelected}
                      className={
                        isSelected
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs"
                          : "border-border bg-surface-elevated/80 text-muted-foreground hover:bg-surface-elevated hover:text-foreground font-mono text-xs"
                      }
                    >
                      <span className="mr-1.5 opacity-75">{node.shortTag}</span>
                      {node.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Primary Interactive Language-Connection Visualization */}
          <div className="lg:col-span-7 space-y-5">
            <Card className="border-border bg-surface-elevated/95 shadow-lifted overflow-hidden">
              <CardHeader className="border-b border-border/80 bg-background/60 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Terminal className="h-4 w-4 text-primary" aria-hidden="true" />
                    <CardTitle className="font-mono text-xs uppercase tracking-widest text-foreground">
                      VELTRIX // CROSS-LANGUAGE LOGIC TOPOLOGY
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-border bg-background-secondary font-mono text-[11px] text-accent"
                    >
                      CORE → {activeNode.name.toUpperCase()} ({activeNode.extension})
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-xs text-muted-foreground pt-1">
                  Hover, focus, or select any language node to inspect how VELTRIX connects implementation logic across ecosystems.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                {/* Interactive SVG Node Topology */}
                <div className="relative bg-background/80 px-3 py-4 sm:px-6 sm:py-6">
                  <svg
                    viewBox="0 0 600 450"
                    role="img"
                    aria-labelledby="veltrix-language-graph-title veltrix-language-graph-desc"
                    className="w-full h-auto max-h-[410px] select-none"
                  >
                    <title id="veltrix-language-graph-title">
                      VELTRIX cross-language connection graph
                    </title>
                    <desc id="veltrix-language-graph-desc">
                      A central geometric VELTRIX node connected to seven programming languages: Python, TypeScript, JavaScript, Rust, Go, Java, and C++.
                    </desc>

                    {/* Subtle Architectural Reference Rings */}
                    <circle
                      cx={CENTER_X}
                      cy={CENTER_Y}
                      r="92"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="3 5"
                      className="text-border/70"
                    />
                    <circle
                      cx={CENTER_X}
                      cy={CENTER_Y}
                      r="168"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-border/50"
                    />
                    <circle
                      cx={CENTER_X}
                      cy={CENTER_Y}
                      r="210"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.75"
                      strokeDasharray="2 8"
                      className="text-border/40"
                    />

                    {/* Secondary Cross-Language Comparison Link */}
                    <line
                      x1={activeNode.x}
                      y1={activeNode.y}
                      x2={compareNode.x}
                      y2={compareNode.y}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      className="text-accent/45 transition-all duration-300"
                    />

                    {/* Thin Connection Lines from Central VELTRIX Node to Each Language */}
                    {LANGUAGE_NODES.map((node) => {
                      const isSelected = node.id === activeNode.id;
                      const isCompared = node.id === compareNode.id;
                      return (
                        <g key={`edge-${node.id}`}>
                          <line
                            x1={CENTER_X}
                            y1={CENTER_Y}
                            x2={node.x}
                            y2={node.y}
                            stroke="currentColor"
                            strokeWidth={isSelected ? "2" : "1"}
                            className={
                              isSelected
                                ? "text-primary transition-all duration-200"
                                : isCompared
                                  ? "text-accent/60 transition-all duration-200"
                                  : "text-border transition-all duration-200"
                            }
                          />
                          {/* Midpoint technical marker on active connection */}
                          {isSelected ? (
                            <circle
                              cx={(CENTER_X + node.x) / 2}
                              cy={(CENTER_Y + node.y) / 2}
                              r="3.5"
                              fill="currentColor"
                              className="text-accent"
                            />
                          ) : null}
                        </g>
                      );
                    })}

                    {/* Central VELTRIX Geometric Node (Simple geometric symbol, not a glowing sphere) */}
                    <g transform={`translate(${CENTER_X}, ${CENTER_Y})`}>
                      {/* Outer octagon/diamond geometric frame */}
                      <polygon
                        points="0,-44 38,-22 38,22 0,44 -38,22 -38,-22"
                        fill="currentColor"
                        className="text-surface-elevated"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <polygon
                        points="0,-44 38,-22 38,22 0,44 -38,22 -38,-22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-primary"
                      />
                      {/* Inner precision diamond */}
                      <polygon
                        points="0,-28 28,0 0,28 -28,0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-border"
                      />
                      {/* VELTRIX Geometric V Emblem */}
                      <path
                        d="M-11 -9L0 11L11 -9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-foreground"
                      />
                      <path
                        d="M-5.5 -9L0 1L5.5 -9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-accent"
                      />
                      <text
                        y="58"
                        textAnchor="middle"
                        fill="currentColor"
                        className="font-mono text-[10px] tracking-widest text-foreground"
                      >
                        VELTRIX CORE
                      </text>
                    </g>

                    {/* Language Nodes */}
                    {LANGUAGE_NODES.map((node) => {
                      const isSelected = node.id === activeNode.id;
                      return (
                        <g
                          key={node.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`${node.name}: ${node.description}`}
                          aria-pressed={isSelected}
                          transform={`translate(${node.x}, ${node.y})`}
                          onClick={() => handleSelectLanguage(node.id)}
                          onMouseEnter={() => setSelectedId(node.id)}
                          onFocus={() => setSelectedId(node.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              handleSelectLanguage(node.id);
                            }
                          }}
                          className="cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                        >
                          {/* Outer active frame */}
                          {isSelected ? (
                            <rect
                              x="-52"
                              y="-26"
                              width="104"
                              height="52"
                              rx="9"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.25"
                              strokeDasharray="3 3"
                              className="text-accent"
                            />
                          ) : null}

                          {/* Node Pill Box */}
                          <rect
                            x="-46"
                            y="-20"
                            width="92"
                            height="40"
                            rx="6"
                            fill="currentColor"
                            className={
                              isSelected
                                ? "text-surface-elevated"
                                : "text-background-secondary"
                            }
                          />
                          <rect
                            x="-46"
                            y="-20"
                            width="92"
                            height="40"
                            rx="6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={isSelected ? "1.75" : "1"}
                            className={
                              isSelected ? "text-primary" : "text-border"
                            }
                          />

                          {/* Status dot */}
                          <circle
                            cx="-32"
                            cy="-5"
                            r="3"
                            fill="currentColor"
                            className={
                              isSelected
                                ? "text-accent"
                                : "text-muted-foreground/60"
                            }
                          />

                          {/* Language Tag */}
                          <text
                            x="4"
                            y="-2"
                            textAnchor="middle"
                            fill="currentColor"
                            className={
                              isSelected
                                ? "font-heading text-[12px] font-semibold text-foreground"
                                : "font-heading text-[11px] font-medium text-muted-foreground"
                            }
                          >
                            {node.name}
                          </text>

                          {/* Extension label */}
                          <text
                            x="0"
                            y="12"
                            textAnchor="middle"
                            fill="currentColor"
                            className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
                          >
                            {node.extension} · {node.shortTag}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <Separator className="bg-border/80" />

                {/* Active Node Inspection Panel */}
                <div
                  aria-live="polite"
                  className="bg-surface-elevated p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <Badge className="bg-primary/15 text-primary border border-primary/30 font-mono text-xs">
                          {activeNode.shortTag}
                        </Badge>
                        <h3 className="font-heading text-xl font-semibold text-foreground">
                          {activeNode.name}
                        </h3>
                        <span className="font-mono text-xs text-muted-foreground">
                          ({activeNode.paradigm})
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        {activeNode.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs text-accent">
                      <span>VELTRIX</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{activeNode.name.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Contextual Code Representation */}
                  <div className="rounded-md border border-border bg-background p-3.5 font-mono text-xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-2 text-[11px] text-muted-foreground">
                      <span>
                        SHARED LOGIC PATTERN // dispatch_event{activeNode.extension}
                      </span>
                      <span className="text-primary">
                        {activeNode.contextRole}
                      </span>
                    </div>
                    <pre className="overflow-x-auto text-foreground/90 leading-relaxed pt-1">
                      <code>{activeNode.codePreview}</code>
                    </pre>
                  </div>

                  {/* Spec Honesty Requirement Note */}
                  <p className="font-mono text-[11px] text-muted-foreground">
                    Illustrative examples of cross-language representations, not verified claims of product compatibility.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntelligenceSection;
