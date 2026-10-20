"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Code2,
  Copy,
  FileCode2,
  FolderTree,
  GitCompare,
  Layers,
  Loader2,
  RefreshCw,
  Sparkles,
  Terminal,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CODE_GENERATION_SAMPLES,
  CODE_UNDERSTANDING_NODES,
  CONNECTED_WORKFLOW_STAGES,
  CROSS_LANGUAGE_PAIRS,
  DEBUGGING_SCENARIO,
  REFACTORING_COMPARISON,
  type CodeTokenLine,
  type ConnectedWorkflowStage,
  type TokenTone,
} from "@/app/capabilities/capabilities-data";

function getTokenToneClass(tone: TokenTone): string {
  switch (tone) {
    case "keyword":
      return "text-primary font-medium";
    case "type":
      return "text-accent";
    case "string":
      return "text-success";
    case "comment":
      return "text-muted-foreground italic";
    case "punct":
      return "text-muted-foreground";
    case "ident":
    default:
      return "text-foreground";
  }
}

function CodeLinesRenderer({
  lines,
  compact = false,
}: {
  lines: CodeTokenLine[];
  compact?: boolean;
}) {
  return (
    <div
      className={`font-mono ${compact ? "text-[11px] leading-5" : "text-xs leading-6"} select-text`}
    >
      {lines.map((line) => {
        const rowHighlight =
          line.highlight === "added"
            ? "bg-success/10 border-l-2 border-success"
            : line.highlight === "removed"
              ? "bg-destructive/10 border-l-2 border-destructive"
              : line.highlight === "accent"
                ? "bg-primary/10 border-l-2 border-primary"
                : "border-l-2 border-transparent";

        const indentPadding =
          line.indent === 3
            ? "pl-9"
            : line.indent === 2
              ? "pl-6"
              : line.indent === 1
                ? "pl-3"
                : "pl-0";

        return (
          <div
            key={line.lineNumber}
            className={`flex items-baseline gap-3 px-2.5 py-0.5 rounded-r-sm transition-colors ${rowHighlight}`}
          >
            <span
              aria-hidden="true"
              className="w-5 shrink-0 select-none text-right text-[10px] text-muted-foreground/60"
            >
              {String(line.lineNumber).padStart(2, "0")}
            </span>
            <div className={`min-w-0 flex-1 overflow-x-auto whitespace-pre ${indentPadding}`}>
              {line.tokens.map((token, idx) => (
                <span key={idx} className={getTokenToneClass(token.tone)}>
                  {token.text}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export interface CapabilitiesSectionProps {
  onNavigateSection?: (sectionId: string) => void;
}

export function CapabilitiesSection({
  onNavigateSection,
}: CapabilitiesSectionProps = {}) {
  // Feature 01 — Code Generation state
  const [activeGenId, setActiveGenId] = React.useState<string>(
    CODE_GENERATION_SAMPLES[0].id
  );
  const [isSynthesizing, setIsSynthesizing] = React.useState<boolean>(false);
  const [copiedGen, setCopiedGen] = React.useState<boolean>(false);

  // Feature 02 — Code Understanding state
  const [activeNodeId, setActiveNodeId] = React.useState<string>(
    CODE_UNDERSTANDING_NODES[0].id
  );

  // Feature 03 — Debugging state
  const [debugTab, setDebugTab] = React.useState<string>("diagnostic");

  // Feature 04 — Cross-Language Development state
  const [activePairId, setActivePairId] = React.useState<string>(
    CROSS_LANGUAGE_PAIRS[0].id
  );

  // Feature 05 — Refactoring state
  const [refactorView, setRefactorView] = React.useState<string>("split");

  // Feature 06 — Development Workflow state
  const [activeStageId, setActiveStageId] =
    React.useState<ConnectedWorkflowStage["id"]>("implement");

  const activeGenSample =
    CODE_GENERATION_SAMPLES.find((item) => item.id === activeGenId) ??
    CODE_GENERATION_SAMPLES[0];

  const activeUnderstandingNode =
    CODE_UNDERSTANDING_NODES.find((node) => node.id === activeNodeId) ??
    CODE_UNDERSTANDING_NODES[0];

  const activeCrossPair =
    CROSS_LANGUAGE_PAIRS.find((pair) => pair.id === activePairId) ??
    CROSS_LANGUAGE_PAIRS[0];

  const activeWorkflowStage =
    CONNECTED_WORKFLOW_STAGES.find((stage) => stage.id === activeStageId) ??
    CONNECTED_WORKFLOW_STAGES[1];

  const handleSwitchGenerationSample = (sampleId: string) => {
    if (sampleId === activeGenId || isSynthesizing) return;
    setIsSynthesizing(true);
    window.setTimeout(() => {
      setActiveGenId(sampleId);
      setIsSynthesizing(false);
    }, 220);
  };

  const handleResynthesizePreview = () => {
    if (isSynthesizing) return;
    setIsSynthesizing(true);
    const nextSample =
      CODE_GENERATION_SAMPLES.find((item) => item.id !== activeGenId) ??
      CODE_GENERATION_SAMPLES[0];
    window.setTimeout(() => {
      setActiveGenId(nextSample.id);
      setIsSynthesizing(false);
    }, 260);
  };

  const handleCopyGeneratedCode = () => {
    const rawText = activeGenSample.outputLines
      .map(
        (line) =>
          `${"  ".repeat(line.indent ?? 0)}${line.tokens.map((t) => t.text).join("")}`
      )
      .join("\n");

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(rawText).catch(() => undefined);
    }
    setCopiedGen(true);
    window.setTimeout(() => setCopiedGen(false), 1800);
  };

  const handleJumpToSection = (sectionId: string) => {
    if (onNavigateSection) {
      onNavigateSection(sectionId);
      return;
    }
    if (typeof document !== "undefined") {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="relative overflow-hidden border-b border-border bg-background py-24 sm:py-32"
    >
      {/* Subtle atmospheric lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Eyebrow Bar */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-accent"
            />
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              SECTION 03 // CAPABILITIES
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-border bg-surface-elevated/80 font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
            >
              6 CORE CAPABILITIES · ASYMMETRIC INSTRUMENT GRID
            </Badge>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-14 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8 space-y-4">
            <h2
              id="capabilities-heading"
              className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.08]"
            >
              From the first line to the{" "}
              <span className="text-veltrix-gradient">
                final implementation.
              </span>
            </h2>
            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
              Explore how VELTRIX connects code generation, structural
              understanding, diagnostic inspection, cross-language adaptation,
              and refactoring inside one coherent engineering environment.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <div className="inline-flex items-center gap-3 rounded-lg border border-border bg-background-secondary px-3.5 py-2 font-mono text-xs text-muted-foreground">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-primary"
              />
              <span>INTERACTIVE PRODUCT INTERFACES</span>
            </div>
          </div>
        </div>

        {/* Asymmetrical Bento Grid:
            - Feature 01 (Code Generation): lg:col-span-8 (large ~2-column panel)
            - Feature 02 (Code Understanding): lg:col-span-4 lg:row-span-2 (tall panel)
            - Feature 03 (Debugging): lg:col-span-4 (compact panel)
            - Feature 05 (Refactoring): lg:col-span-4 (compact panel)
            - Feature 04 (Cross-Language Development): lg:col-span-7 (wide split-screen comparison)
            - Feature 06 (Development Workflow): lg:col-span-5 (compact connected workflow)
        */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:auto-rows-min">
          {/* ==================================================================
              FEATURE 01 — CODE GENERATION (Large ~2-column span: lg:col-span-8)
             ================================================================== */}
          <Card className="lg:col-span-8 flex flex-col justify-between border-border bg-surface-elevated/90 shadow-soft transition-colors hover:border-primary/40">
            <CardHeader className="space-y-3 border-b border-border/80 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
                  <Code2 className="h-4 w-4" aria-hidden="true" />
                  <span>01 // CODE GENERATION</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {CODE_GENERATION_SAMPLES.map((sample) => {
                    const isSelected = sample.id === activeGenSample.id;
                    return (
                      <Button
                        key={sample.id}
                        type="button"
                        size="xs"
                        variant={isSelected ? "default" : "outline"}
                        disabled={isSynthesizing}
                        onClick={() => handleSwitchGenerationSample(sample.id)}
                        className="font-mono text-[11px]"
                      >
                        {sample.language} · {sample.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <CardTitle className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  Ideas into implementation.
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Turn natural-language requirements into structured code and
                  reusable software components.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4 pt-5">
              {/* Natural-Language Request Bar */}
              <div className="rounded-lg border border-border bg-background-secondary p-3.5">
                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-primary">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    NATURAL-LANGUAGE REQUIREMENT
                  </span>
                  <span>{activeGenSample.annotation}</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-foreground leading-relaxed">
                  &ldquo;{activeGenSample.prompt}&rdquo;
                </p>
              </div>

              {/* Code Editor Chrome & Preview */}
              <div className="overflow-hidden rounded-lg border border-border bg-background shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 bg-background-secondary px-3.5 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="h-2 w-2 rounded-full bg-border" />
                      <span className="h-2 w-2 rounded-full bg-border" />
                      <span className="h-2 w-2 rounded-full bg-primary/70" />
                    </div>
                    <span className="font-mono text-xs text-foreground">
                      {activeGenSample.fileName}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-border bg-surface-elevated font-mono text-[10px] text-accent"
                    >
                      {activeGenSample.language}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      disabled={isSynthesizing}
                      onClick={handleResynthesizePreview}
                      aria-label="Switch code generation sample"
                      className="font-mono text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      {isSynthesizing ? (
                        <Loader2
                          className="mr-1 h-3 w-3 animate-spin text-primary"
                          aria-hidden="true"
                        />
                      ) : (
                        <RefreshCw className="mr-1 h-3 w-3" aria-hidden="true" />
                      )}
                      Switch Sample
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={handleCopyGeneratedCode}
                      aria-label={copiedGen ? "Copied generated code" : "Copy generated code"}
                      className="font-mono text-[11px]"
                    >
                      {copiedGen ? (
                        <>
                          <Check
                            className="mr-1 h-3 w-3 text-success"
                            aria-hidden="true"
                          />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1 h-3 w-3" aria-hidden="true" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div
                  aria-busy={isSynthesizing}
                  className={`p-3 transition-opacity duration-150 ${
                    isSynthesizing ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <CodeLinesRenderer lines={activeGenSample.outputLines} />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-border/80 bg-background-secondary/50 font-mono text-[11px] text-muted-foreground">
              <span>SYNTAX &amp; TYPE CONTRACTS VERIFIED</span>
              <span className="text-primary">REUSABLE COMPONENT PREVIEW</span>
            </CardFooter>
          </Card>

          {/* ==================================================================
              FEATURE 02 — CODE UNDERSTANDING (Tall panel: lg:col-span-4 lg:row-span-2)
             ================================================================== */}
          <Card className="lg:col-span-4 lg:row-span-2 flex flex-col justify-between border-border bg-surface-elevated/90 shadow-soft transition-colors hover:border-accent/40">
            <CardHeader className="space-y-3 border-b border-border/80 pb-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
                  <FolderTree className="h-4 w-4" aria-hidden="true" />
                  <span>02 // CODE UNDERSTANDING</span>
                </div>
                <Badge
                  variant="outline"
                  className="border-border bg-background-secondary font-mono text-[10px] text-muted-foreground"
                >
                  AST GRAPH
                </Badge>
              </div>

              <div className="space-y-1.5">
                <CardTitle className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  Make complex code clearer.
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  Explore unfamiliar implementations, understand component
                  relationships, and work through complicated codebases.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4 pt-5">
              {/* Connected File Explorer */}
              <div className="rounded-lg border border-border bg-background-secondary p-3">
                <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  <span>WORKSPACE FILE EXPLORER</span>
                  <span className="text-accent">3 LINKED MODULES</span>
                </div>
                <div
                  role="group"
                  aria-label="Inspect module in codebase explorer"
                  className="space-y-1.5"
                >
                  {CODE_UNDERSTANDING_NODES.map((node) => {
                    const isCurrent = node.id === activeUnderstandingNode.id;
                    return (
                      <Button
                        key={node.id}
                        type="button"
                        variant={isCurrent ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setActiveNodeId(node.id)}
                        aria-label={`Inspect ${node.path} (${node.roleTag})`}
                        className={`w-full justify-between font-mono text-xs ${
                          isCurrent
                            ? "border border-accent/40 bg-surface-elevated text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <FileCode2
                            className={`h-3.5 w-3.5 shrink-0 ${
                              isCurrent ? "text-accent" : "text-muted-foreground"
                            }`}
                            aria-hidden="true"
                          />
                          <span className="truncate">{node.path}</span>
                        </span>
                        <span className="ml-2 shrink-0 text-[10px] uppercase text-muted-foreground">
                          {node.roleTag.split(" ")[0]}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Connected Code Editor Snippet */}
              <div className="overflow-hidden rounded-lg border border-border bg-background">
                <div className="flex items-center justify-between border-b border-border/80 bg-background-secondary px-3 py-1.5 font-mono text-[11px]">
                  <span className="text-foreground">
                    {activeUnderstandingNode.name}
                  </span>
                  <span className="text-accent">
                    {activeUnderstandingNode.roleTag}
                  </span>
                </div>
                <div className="p-2.5">
                  <CodeLinesRenderer
                    lines={activeUnderstandingNode.codeLines}
                    compact
                  />
                </div>
              </div>

              {/* Connected Explanation & Component Relationships Panel */}
              <div className="space-y-3 rounded-lg border border-border bg-background-secondary p-3.5">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-primary">
                  <span>COMPONENT EXPLANATION</span>
                  <span>CONTEXT LINKED</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {activeUnderstandingNode.explanation}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeUnderstandingNode.architecturalNote}
                </p>

                <Separator className="bg-border/80" />

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="rounded border border-border/80 bg-background p-2">
                    <span className="block text-[10px] uppercase text-muted-foreground">
                      IMPORTS FROM
                    </span>
                    <span className="mt-0.5 block truncate text-foreground">
                      {activeUnderstandingNode.imports.join(", ")}
                    </span>
                  </div>
                  <div className="rounded border border-border/80 bg-background p-2">
                    <span className="block text-[10px] uppercase text-muted-foreground">
                      CONSUMED BY
                    </span>
                    <span className="mt-0.5 block truncate text-accent">
                      {activeUnderstandingNode.usedBy.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border/80 bg-background-secondary/50 font-mono text-[11px] text-muted-foreground">
              <span>SYMBOL GRAPH</span>
              <span className="text-accent">
                {activeUnderstandingNode.folder}
              </span>
            </CardFooter>
          </Card>

          {/* ==================================================================
              FEATURE 03 — DEBUGGING (Compact panel: lg:col-span-4)
             ================================================================== */}
          <Card className="lg:col-span-4 flex flex-col justify-between border-border bg-surface-elevated/90 shadow-soft transition-colors hover:border-primary/40">
            <CardHeader className="space-y-2.5 border-b border-border/80 pb-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
                  <Terminal className="h-4 w-4" aria-hidden="true" />
                  <span>03 // DEBUGGING</span>
                </div>
                <Badge
                  variant="outline"
                  className="border-border bg-background-secondary font-mono text-[10px] text-warning"
                >
                  ILLUSTRATIVE TRACE
                </Badge>
              </div>

              <div className="space-y-1">
                <CardTitle className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Understand the problem behind the error.
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Investigate possible causes, examine errors, and explore
                  practical approaches to debugging.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-3 pt-4">
              <Tabs
                value={debugTab}
                onValueChange={setDebugTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-background-secondary">
                  <TabsTrigger value="diagnostic" className="font-mono text-xs">
                    Terminal &amp; Cause
                  </TabsTrigger>
                  <TabsTrigger value="patch" className="font-mono text-xs">
                    Proposed Change
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="diagnostic" className="mt-3 space-y-3">
                  {/* Terminal Panel */}
                  <div className="rounded-lg border border-border bg-background p-3 font-mono text-[11px]">
                    <div className="mb-1.5 flex items-center justify-between text-muted-foreground">
                      <span>{DEBUGGING_SCENARIO.moduleName}</span>
                      <span className="text-warning">
                        {DEBUGGING_SCENARIO.errorCode}
                      </span>
                    </div>
                    <p className="text-destructive leading-relaxed">
                      {DEBUGGING_SCENARIO.errorSummary}
                    </p>
                    <div className="mt-2 space-y-0.5 border-t border-border/60 pt-1.5 text-[10px] text-muted-foreground">
                      {DEBUGGING_SCENARIO.stackTrace.map((frame) => (
                        <div key={frame} className="truncate">
                          {frame}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Error Explanation */}
                  <div className="rounded-lg border border-border bg-background-secondary p-3 space-y-1.5">
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-primary">
                      POSSIBLE CAUSE ANALYSIS
                    </span>
                    <p className="text-xs text-foreground leading-relaxed">
                      {DEBUGGING_SCENARIO.probableCause}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="patch" className="mt-3 space-y-3">
                  {/* Proposed Code Change */}
                  <div className="overflow-hidden rounded-lg border border-border bg-background font-mono text-[11px]">
                    <div className="border-b border-border/80 bg-background-secondary px-3 py-1.5 text-[10px] uppercase tracking-wider text-accent">
                      PROPOSED GUARD CLAUSE DIFF (PREVIEW ONLY)
                    </div>
                    <div className="divide-y divide-border/40 p-2">
                      {DEBUGGING_SCENARIO.proposedDiff.map((row, idx) => {
                        const rowStyle =
                          row.kind === "removed"
                            ? "bg-destructive/10 text-destructive"
                            : row.kind === "added"
                              ? "bg-success/10 text-success"
                              : "text-muted-foreground";
                        return (
                          <div
                            key={`${row.lineNumber}-${idx}`}
                            className={`flex items-baseline gap-2 px-2 py-0.5 ${rowStyle}`}
                          >
                            <span className="w-5 shrink-0 select-none text-[10px] opacity-70">
                              {row.lineNumber}
                            </span>
                            <code className="overflow-x-auto whitespace-pre">
                              {row.code}
                            </code>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {DEBUGGING_SCENARIO.diagnosticApproach}
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border/80 bg-background-secondary/50 font-mono text-[10px] text-muted-foreground">
              <span>STATIC DIAGNOSTIC PREVIEW</span>
              <span>NO LIVE EXECUTION CLAIMED</span>
            </CardFooter>
          </Card>

          {/* ==================================================================
              FEATURE 05 — REFACTORING (Compact panel: lg:col-span-4)
             ================================================================== */}
          <Card className="lg:col-span-4 flex flex-col justify-between border-border bg-surface-elevated/90 shadow-soft transition-colors hover:border-accent/40">
            <CardHeader className="space-y-2.5 border-b border-border/80 pb-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
                  <Wrench className="h-4 w-4" aria-hidden="true" />
                  <span>05 // REFACTORING</span>
                </div>
                <Badge
                  variant="outline"
                  className="border-border bg-background-secondary font-mono text-[10px] text-success"
                >
                  BEFORE / AFTER
                </Badge>
              </div>

              <div className="space-y-1">
                <CardTitle className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Make every line work harder.
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Explore cleaner structures, improve readability, and simplify
                  complicated implementations.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-3 pt-4">
              <Tabs
                value={refactorView}
                onValueChange={setRefactorView}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 bg-background-secondary">
                  <TabsTrigger value="split" className="font-mono text-xs">
                    Highlights
                  </TabsTrigger>
                  <TabsTrigger value="before" className="font-mono text-xs">
                    Before
                  </TabsTrigger>
                  <TabsTrigger value="after" className="font-mono text-xs">
                    After
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="split" className="mt-3 space-y-2.5">
                  <div className="rounded-lg border border-border bg-background p-2.5 space-y-2">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-1">
                      <span>BEFORE: NESTED BRANCHES</span>
                      <span className="text-destructive">3 LEVELS DEEP</span>
                    </div>
                    <CodeLinesRenderer
                      lines={REFACTORING_COMPARISON.beforeLines.slice(1, 5)}
                      compact
                    />
                    <Separator className="bg-border/70" />
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-1">
                      <span>AFTER: GUARD CLAUSE</span>
                      <span className="text-success">FLAT &amp; TYPED</span>
                    </div>
                    <CodeLinesRenderer
                      lines={REFACTORING_COMPARISON.afterLines.slice(1, 5)}
                      compact
                    />
                  </div>
                </TabsContent>

                <TabsContent value="before" className="mt-3">
                  <div className="rounded-lg border border-border bg-background p-2.5">
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] text-muted-foreground px-1">
                      <span>{REFACTORING_COMPARISON.fileName}</span>
                      <span className="text-destructive">LEGACY STRUCTURE</span>
                    </div>
                    <CodeLinesRenderer
                      lines={REFACTORING_COMPARISON.beforeLines}
                      compact
                    />
                  </div>
                </TabsContent>

                <TabsContent value="after" className="mt-3">
                  <div className="rounded-lg border border-border bg-background p-2.5">
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] text-muted-foreground px-1">
                      <span>{REFACTORING_COMPARISON.fileName}</span>
                      <span className="text-success">REFINED STRUCTURE</span>
                    </div>
                    <CodeLinesRenderer
                      lines={REFACTORING_COMPARISON.afterLines}
                      compact
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {REFACTORING_COMPARISON.summary}
              </p>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border/80 bg-background-secondary/50 font-mono text-[10px] text-muted-foreground">
              <span>{REFACTORING_COMPARISON.fileName}</span>
              <span className="text-success">GUARD CLAUSE DIFF</span>
            </CardFooter>
          </Card>

          {/* ==================================================================
              FEATURE 04 — CROSS-LANGUAGE DEVELOPMENT (Wide split panel: lg:col-span-7)
             ================================================================== */}
          <Card className="lg:col-span-7 flex flex-col justify-between border-border bg-surface-elevated/90 shadow-soft transition-colors hover:border-primary/40">
            <CardHeader className="space-y-3 border-b border-border/80 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
                  <GitCompare className="h-4 w-4" aria-hidden="true" />
                  <span>04 // CROSS-LANGUAGE DEVELOPMENT</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {CROSS_LANGUAGE_PAIRS.map((pair) => {
                    const isCurrent = pair.id === activeCrossPair.id;
                    return (
                      <Button
                        key={pair.id}
                        type="button"
                        size="xs"
                        variant={isCurrent ? "default" : "outline"}
                        onClick={() => setActivePairId(pair.id)}
                        className="font-mono text-[11px]"
                      >
                        {pair.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <CardTitle className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  Carry the logic across languages.
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Compare different implementations and adapt a solution to the
                  requirements of another programming language.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4 pt-5">
              {/* Split-Screen Comparison: Python vs TypeScript */}
              <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                {/* Python Side */}
                <div className="overflow-hidden rounded-lg border border-border bg-background">
                  <div className="flex items-center justify-between border-b border-border/80 bg-background-secondary px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full bg-primary"
                      />
                      <span className="font-mono text-xs font-medium text-foreground">
                        {activeCrossPair.python.fileName}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-border bg-surface-elevated font-mono text-[10px] text-primary"
                    >
                      PYTHON
                    </Badge>
                  </div>
                  <div className="p-2.5">
                    <CodeLinesRenderer
                      lines={activeCrossPair.python.lines}
                      compact
                    />
                  </div>
                  <div className="border-t border-border/60 bg-background-secondary/40 px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
                    {activeCrossPair.python.runtimeNote}
                  </div>
                </div>

                {/* TypeScript Side */}
                <div className="overflow-hidden rounded-lg border border-border bg-background">
                  <div className="flex items-center justify-between border-b border-border/80 bg-background-secondary px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full bg-accent"
                      />
                      <span className="font-mono text-xs font-medium text-foreground">
                        {activeCrossPair.typescript.fileName}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-border bg-surface-elevated font-mono text-[10px] text-accent"
                    >
                      TYPESCRIPT
                    </Badge>
                  </div>
                  <div className="p-2.5">
                    <CodeLinesRenderer
                      lines={activeCrossPair.typescript.lines}
                      compact
                    />
                  </div>
                  <div className="border-t border-border/60 bg-background-secondary/40 px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
                    {activeCrossPair.typescript.runtimeNote}
                  </div>
                </div>
              </div>

              {/* Shared Semantic Invariant Banner */}
              <div className="rounded-lg border border-border bg-background-secondary px-3.5 py-2.5 text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent block sm:inline sm:mr-2">
                    SHARED INVARIANT:
                  </span>
                  <span className="text-foreground/90">
                    {activeCrossPair.sharedInvariant}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-border/80 bg-background-secondary/50 font-mono text-[11px] text-muted-foreground">
              <span>PYTHON ⇄ TYPESCRIPT EQUIVALENCE</span>
              <span className="text-accent">{activeCrossPair.concept}</span>
            </CardFooter>
          </Card>

          {/* ==================================================================
              FEATURE 06 — DEVELOPMENT WORKFLOW (Compact connected workflow: lg:col-span-5)
             ================================================================== */}
          <Card className="lg:col-span-5 flex flex-col justify-between border-border bg-surface-elevated/90 shadow-soft transition-colors hover:border-accent/40">
            <CardHeader className="space-y-3 border-b border-border/80 pb-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
                  <Layers className="h-4 w-4" aria-hidden="true" />
                  <span>06 // DEVELOPMENT WORKFLOW</span>
                </div>
                <Badge
                  variant="outline"
                  className="border-border bg-background-secondary font-mono text-[10px] text-primary"
                >
                  4 CONNECTED STAGES
                </Badge>
              </div>

              <div className="space-y-1.5">
                <CardTitle className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  Keep the process connected.
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  Bring planning, implementation, debugging, and refinement into
                  a more coherent workflow.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4 pt-5">
              {/* Horizontal Workflow Connecting Four Compact Interface Panels */}
              <div
                role="group"
                aria-label="Connected development workflow stages"
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {CONNECTED_WORKFLOW_STAGES.map((stage, idx) => {
                  const isActive = stage.id === activeWorkflowStage.id;
                  return (
                    <div key={stage.id} className="relative flex items-stretch">
                      <Button
                        type="button"
                        variant={isActive ? "secondary" : "outline"}
                        onClick={() => setActiveStageId(stage.id)}
                        aria-label={`Select workflow stage ${stage.stepNumber}: ${stage.title}`}
                        className={`h-auto w-full flex-col items-start justify-between gap-1.5 p-2.5 text-left ${
                          isActive
                            ? "border-primary bg-background text-foreground shadow-soft"
                            : "border-border bg-background-secondary/70 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between font-mono text-[10px]">
                          <span
                            className={
                              isActive ? "text-primary" : "text-muted-foreground"
                            }
                          >
                            {stage.stepNumber}
                          </span>
                          {idx < CONNECTED_WORKFLOW_STAGES.length - 1 && (
                            <ArrowRight
                              className="h-3 w-3 text-muted-foreground/50"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <span className="font-heading text-xs font-semibold text-foreground">
                          {stage.title}
                        </span>
                        <span className="w-full truncate font-mono text-[10px] text-muted-foreground">
                          {stage.artifact}
                        </span>
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Active Stage Inspection Panel */}
              <div className="rounded-lg border border-border bg-background p-3.5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-2 font-mono text-[11px]">
                  <span className="text-primary">
                    {`${activeWorkflowStage.stepNumber} // ${activeWorkflowStage.title.toUpperCase()}`}
                  </span>
                  <span className="text-accent">
                    {activeWorkflowStage.statusLabel}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {activeWorkflowStage.summary}
                </p>
                <div className="rounded border border-border/80 bg-background-secondary px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground flex items-center justify-between gap-2">
                  <span className="truncate">
                    {activeWorkflowStage.detailPreview}
                  </span>
                  <span className="shrink-0 text-[10px] text-primary">
                    {activeWorkflowStage.linkedCapability}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-border/80 bg-background-secondary/50">
              <span className="font-mono text-[11px] text-muted-foreground">
                CONTINUOUS CONTEXT HANDOFF
              </span>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => handleJumpToSection("workflow")}
                className="font-mono text-xs text-primary hover:text-foreground"
              >
                Open Interactive Workspace
                <ArrowDownRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default CapabilitiesSection;
