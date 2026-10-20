"use client";

import * as React from "react";
import {
  CheckCircle2,
  Code2,
  Cpu,
  FileCode2,
  GitCompare,
  Layers,
  Loader2,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  PROMPT_PRESETS,
  WORKFLOW_LANGUAGE_LIST,
  WORKFLOW_LANGUAGES,
  WORKFLOW_STEPS,
  type WorkflowLanguageId,
  type WorkflowStepId,
} from "@/app/workflow/workflow-data";

const DEFAULT_PROMPT =
  "Create an API endpoint that validates incoming user data and stores records in MongoDB.";

const SYNTAX_KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "const",
  "let",
  "type",
  "async",
  "function",
  "if",
  "return",
  "await",
  "try",
  "catch",
  "throw",
  "new",
  "def",
  "class",
  "except",
  "as",
  "use",
  "pub",
  "struct",
  "fn",
  "mut",
  "package",
  "func",
  "defer",
  "else",
  "true",
  "false",
  "None",
  "True",
  "False",
  "nil",
]);

function highlightCodeLine(line: string): React.ReactNode {
  if (!line) return " ";
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//") || trimmed.startsWith("#")) {
    return <span className="text-muted-foreground italic">{line}</span>;
  }
  const parts = line.split(/("[^"]*"|'[^']*'|`[^`]*`|\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+\b)/g);
  return parts.map((part, idx) => {
    if (!part) return null;
    if (
      (part.startsWith('"') && part.endsWith('"')) ||
      (part.startsWith("'") && part.endsWith("'")) ||
      (part.startsWith("`") && part.endsWith("`"))
    ) {
      return (
        <span key={idx} className="text-accent">
          {part}
        </span>
      );
    }
    if (SYNTAX_KEYWORDS.has(part)) {
      return (
        <span key={idx} className="text-primary font-medium">
          {part}
        </span>
      );
    }
    if (/^[A-Z][A-Za-z0-9_]*$/.test(part) || /^\d+$/.test(part)) {
      return (
        <span key={idx} className="text-accent/90">
          {part}
        </span>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export function WorkflowSection() {
  const [activeStep, setActiveStep] = React.useState<WorkflowStepId>("generate");
  const [languageId, setLanguageId] =
    React.useState<WorkflowLanguageId>("typescript");
  const [promptText, setPromptText] = React.useState<string>(DEFAULT_PROMPT);
  const [promptError, setPromptError] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [hasSimulatedRun, setHasSimulatedRun] = React.useState<boolean>(false);
  const [activePresetId, setActivePresetId] = React.useState<string>(
    PROMPT_PRESETS[0].id
  );

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const currentLang = WORKFLOW_LANGUAGES[languageId];
  const currentStepMeta =
    WORKFLOW_STEPS.find((step) => step.id === activeStep) ?? WORKFLOW_STEPS[2];

  const validatePromptInput = (value: string): boolean => {
    const trimmed = value.trim();
    if (trimmed.length < 12) {
      setPromptError(
        "Provide a requirement of at least 12 characters so the simulated workspace can map your intent."
      );
      return false;
    }
    if (trimmed.length > 360) {
      setPromptError("Keep the requirement concise (under 360 characters).");
      return false;
    }
    setPromptError(null);
    return true;
  };

  const handleSelectStep = (stepId: WorkflowStepId) => {
    if (isGenerating) return;
    setActiveStep(stepId);
  };

  const handleLanguageChange = (value: string) => {
    if (isGenerating) return;
    if (
      value === "typescript" ||
      value === "python" ||
      value === "rust" ||
      value === "go"
    ) {
      setLanguageId(value);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    if (isGenerating) return;
    const found = PROMPT_PRESETS.find((item) => item.id === presetId);
    if (!found) return;
    setActivePresetId(found.id);
    setPromptText(found.prompt);
    setPromptError(null);
  };

  const handleGeneratePreview = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isGenerating) return;
    if (!validatePromptInput(promptText)) return;

    setIsGenerating(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsGenerating(false);
      setHasSimulatedRun(true);
      if (activeStep === "describe" || activeStep === "understand") {
        setActiveStep("generate");
      }
    }, 520);
  };

  const handleApplyRefinement = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsGenerating(false);
      setHasSimulatedRun(true);
      setActiveStep("refine");
    }, 420);
  };

  const handleResetWorkspace = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsGenerating(false);
    setHasSimulatedRun(false);
    setPromptError(null);
    setActivePresetId(PROMPT_PRESETS[0].id);
    setPromptText(DEFAULT_PROMPT);
    setLanguageId("typescript");
    setActiveStep("describe");
  };

  const displayedCode =
    activeStep === "refine"
      ? currentLang.refineCode
      : currentLang.generateCode;

  const codeLines = React.useMemo(
    () => displayedCode.split("\n"),
    [displayedCode]
  );

  const activeLogs = currentLang.validationOutput[activeStep];

  return (
    <section
      id="workflow"
      aria-labelledby="workflow-heading"
      className="relative overflow-hidden border-b border-border bg-background-secondary bg-veltrix-grid py-24 sm:py-32"
    >
      {/* Subtle ambient illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Eyebrow */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-accent"
            />
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              SECTION 04 // HOW IT WORKS — FROM INTENT TO IMPLEMENTATION
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-border bg-surface-elevated/80 font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
            >
              SIMULATED PRODUCT PREVIEW · PREDEFINED EXAMPLES
            </Badge>
          </div>
        </div>

        {/* Section Header Copy */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">
              From intent to implementation.
            </p>
            <h2
              id="workflow-heading"
              className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.08]"
            >
              Start with a problem.{" "}
              <span className="text-veltrix-gradient">
                Build toward a solution.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
              Describe what you need, explore an implementation, and refine the
              result through a more connected coding workflow.
            </p>
          </div>
        </div>

        {/* Four-Step Interactive Process Rail (Architectural Step Selector, Not Generic Numbered Circles) */}
        <Tabs
          value={activeStep}
          onValueChange={(value) => handleSelectStep(value as WorkflowStepId)}
          className="mb-8"
        >
          <TabsList
            variant="line"
            aria-label="Development workflow stages"
            className="grid h-auto w-full grid-cols-1 gap-3 bg-transparent p-0 sm:grid-cols-2 lg:grid-cols-4"
          >
            {WORKFLOW_STEPS.map((step) => {
              const isSelected = step.id === activeStep;
              return (
                <TabsTrigger
                  key={step.id}
                  value={step.id}
                  id={`workflow-tab-${step.id}`}
                  disabled={isGenerating}
                  className={`group relative flex h-full flex-col items-stretch justify-between rounded-xl border p-5 text-left whitespace-normal transition-colors after:hidden ${
                    isSelected
                      ? "border-primary/70 bg-surface-elevated shadow-lifted"
                      : "border-border bg-background/85 hover:border-border/90 hover:bg-surface-elevated/60"
                  }`}
                >
                  {/* Top Accent Line */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-4 top-0 h-0.5 rounded-full transition-opacity ${
                      isSelected
                        ? "bg-gradient-to-r from-primary to-accent opacity-100"
                        : "opacity-0 group-hover:opacity-40 bg-border"
                    }`}
                  />

                  <div className="w-full space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-mono text-xs font-medium uppercase tracking-widest ${
                          isSelected ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {step.marker}
                      </span>
                      <span
                        className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${
                          isSelected
                            ? "border-primary/40 bg-primary/15 text-foreground"
                            : "border-border bg-background-secondary text-muted-foreground"
                        }`}
                      >
                        {isSelected ? "ACTIVE" : "STAGE " + step.number}
                      </span>
                    </div>

                    <p className="text-sm font-normal leading-relaxed text-foreground/90">
                      {step.summary}
                    </p>
                  </div>

                  <div className="mt-4 w-full border-t border-border/60 pt-3">
                    <p className="font-mono text-[11px] font-normal text-muted-foreground line-clamp-2">
                      {step.detail}
                    </p>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Layered Developer Workspace Container */}
        <Card
          id="workflow-workspace-panel"
          role="tabpanel"
          aria-labelledby={`workflow-tab-${activeStep}`}
          className="overflow-hidden border-border bg-background shadow-lifted py-0 gap-0"
        >
          {/* Compact Top Bar: Selected Language, Active File, Step Status & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-elevated px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
              </div>
              <Separator orientation="vertical" className="h-4 bg-border" />
              <div className="flex items-center gap-2 font-mono text-xs text-foreground">
                <FileCode2 className="h-3.5 w-3.5 text-primary" />
                <span>{currentLang.fileName}</span>
              </div>
              <Badge
                variant="outline"
                className="border-border bg-background font-mono text-[11px] text-accent"
              >
                {currentLang.runtimeLabel}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="workflow-language-select"
                  className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                >
                  Language
                </Label>
                <Select
                  value={languageId}
                  onValueChange={handleLanguageChange}
                  disabled={isGenerating}
                >
                  <SelectTrigger
                    id="workflow-language-select"
                    aria-label="Select programming language"
                    size="sm"
                    className="min-w-36 border-border bg-background font-mono text-xs text-foreground"
                  >
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-surface-elevated text-foreground">
                    {WORKFLOW_LANGUAGE_LIST.map((lang) => (
                      <SelectItem
                        key={lang.id}
                        value={lang.id}
                        className="font-mono text-xs"
                      >
                        {lang.name} ({lang.shortTag})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isGenerating}
                onClick={handleResetWorkspace}
                className="border-border bg-background text-muted-foreground hover:bg-background-secondary hover:text-foreground font-mono text-xs"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset Preview
              </Button>
            </div>
          </div>

          {/* Three-Column Layered Workspace Body (Stacks cleanly on mobile) */}
          <div className="grid grid-cols-1 divide-y divide-border lg:grid-cols-12 lg:divide-x lg:divide-y-0">
            {/* Left Panel: User's Request & Interactive Prompt Controls */}
            <div className="lg:col-span-4 flex flex-col justify-between bg-background-secondary/60 p-5 sm:p-6 space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                      01 // USER REQUEST PANEL
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-border bg-background font-mono text-[10px] uppercase text-muted-foreground"
                  >
                    NATURAL LANGUAGE
                  </Badge>
                </div>

                <form onSubmit={handleGeneratePreview} className="space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label
                      htmlFor="workflow-prompt-input"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Requirement Prompt
                    </Label>
                    <Textarea
                      id="workflow-prompt-input"
                      value={promptText}
                      disabled={isGenerating}
                      onChange={(e) => {
                        setPromptText(e.target.value);
                        if (promptError) validatePromptInput(e.target.value);
                      }}
                      onBlur={(e) => validatePromptInput(e.target.value)}
                      aria-invalid={Boolean(promptError)}
                      aria-describedby={
                        promptError
                          ? "workflow-prompt-error"
                          : "workflow-prompt-hint"
                      }
                      rows={4}
                      placeholder="Describe the endpoint, service, or transformation you want to build..."
                      className="resize-none border-border bg-background font-sans text-sm leading-relaxed text-foreground"
                    />
                    {promptError ? (
                      <p
                        id="workflow-prompt-error"
                        role="alert"
                        className="text-xs text-destructive"
                      >
                        {promptError}
                      </p>
                    ) : (
                      <p
                        id="workflow-prompt-hint"
                        className="font-mono text-[11px] text-muted-foreground"
                      >
                        Simulated preview uses curated multi-language engineering
                        templates.
                      </p>
                    )}
                  </div>

                  {/* Predefined Scenario Switcher */}
                  <div className="space-y-2">
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Predefined Example Prompts
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PROMPT_PRESETS.map((preset) => {
                        const isPresetActive = preset.id === activePresetId;
                        return (
                          <Button
                            key={preset.id}
                            type="button"
                            variant="outline"
                            size="xs"
                            disabled={isGenerating}
                            onClick={() => handleSelectPreset(preset.id)}
                            className={`font-mono text-[11px] ${
                              isPresetActive
                                ? "border-primary/60 bg-primary/15 text-foreground"
                                : "border-border bg-background text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {preset.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Primary Generate & Refine Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <Button
                      type="submit"
                      disabled={isGenerating}
                      aria-label={
                        isGenerating
                          ? "Synthesizing Preview"
                          : "Generate Implementation"
                      }
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                    >
                      {isGenerating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="mr-2 h-3.5 w-3.5" />
                      )}
                      <span>
                        {isGenerating
                          ? "Synthesizing Preview..."
                          : "Generate Implementation"}
                      </span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={isGenerating}
                      onClick={handleApplyRefinement}
                      className={`border-border font-mono text-xs ${
                        activeStep === "refine"
                          ? "border-accent/60 bg-accent/15 text-foreground"
                          : "bg-background text-foreground hover:bg-surface-elevated"
                      }`}
                    >
                      <GitCompare className="mr-1.5 h-3.5 w-3.5 text-accent" />
                      04 Refine
                    </Button>
                  </div>
                </form>
              </div>

              {/* Step 04 Refinement Note Box */}
              <div className="rounded-lg border border-border/90 bg-background p-3.5 space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="uppercase tracking-wider text-accent">
                    ITERATION DIRECTIVE (STEP 04)
                  </span>
                  <span className="text-muted-foreground">
                    {activeStep === "refine" ? "APPLIED" : "READY"}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {currentLang.refinementPrompt}
                </p>
              </div>
            </div>

            {/* Central Panel: Code Editor & Proposed Approach Inspection */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-background">
              <div className="border-b border-border/80 bg-surface-elevated/40 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-accent" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                    {activeStep === "understand"
                      ? "02 // PROPOSED APPROACH & CONTEXT"
                      : activeStep === "refine"
                        ? "04 // REFINED IMPLEMENTATION"
                        : "03 // CENTRAL CODE EDITOR"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasSimulatedRun && !isGenerating && (
                    <Badge
                      variant="outline"
                      className="border-primary/50 bg-primary/10 font-mono text-[10px] text-primary"
                    >
                      PREVIEW UPDATED
                    </Badge>
                  )}
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {codeLines.length} lines · UTF-8
                  </span>
                </div>
              </div>

              {/* Workspace Main Content Area with Loading State & Step-Aware View */}
              <div className="relative flex-1 p-5 sm:p-6">
                {isGenerating ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-border/80 bg-background-secondary/50 p-8 text-center space-y-4"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <div className="space-y-1">
                      <p className="font-heading text-base font-semibold text-foreground">
                        Building {currentLang.name} implementation preview...
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        Mapping schema invariants and MongoDB collection types
                      </p>
                    </div>
                  </div>
                ) : activeStep === "understand" ? (
                  <div className="space-y-5">
                    <div className="rounded-lg border border-primary/40 bg-surface-elevated/60 p-4 space-y-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                        ARCHITECTURAL APPROACH
                      </span>
                      <p className="text-sm leading-relaxed text-foreground">
                        {currentLang.understandContext.architectureNote}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Execution Plan
                      </span>
                      <ol className="space-y-2">
                        {currentLang.understandContext.proposedApproach.map(
                          (item, idx) => (
                            <li
                              key={item}
                              className="flex items-start gap-3 rounded-md border border-border bg-background-secondary/70 p-3 text-xs leading-relaxed text-foreground/90"
                            >
                              <span className="font-mono text-primary font-semibold">
                                0{idx + 1}
                              </span>
                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ol>
                    </div>

                    <div className="rounded-lg border border-border bg-background-secondary/40 p-3.5 space-y-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
                        Context Dependencies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentLang.understandContext.dependencies.map(
                          (dep) => (
                            <span
                              key={dep}
                              className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                            >
                              {dep}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeStep === "describe" && (
                      <div className="rounded-md border border-primary/40 bg-primary/10 px-3.5 py-2.5 flex items-center justify-between gap-2">
                        <span className="font-mono text-xs text-foreground">
                          Step 01 active: Inspecting target {currentLang.name}{" "}
                          template for your prompt.
                        </span>
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          onClick={() => setActiveStep("understand")}
                          className="border-border bg-background font-mono text-[11px]"
                        >
                          Next: 02 Understand
                        </Button>
                      </div>
                    )}

                    <div className="overflow-x-auto rounded-lg border border-border bg-background-secondary/90 p-4">
                      <pre className="font-mono text-xs leading-relaxed text-foreground/95">
                        <code>
                          {codeLines.map((line, index) => (
                            <span
                              key={`${index}-${line.slice(0, 12)}`}
                              className="table-row"
                            >
                              <span
                                aria-hidden="true"
                                className="table-cell select-none pr-4 text-right font-mono text-[11px] text-muted-foreground/60"
                              >
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span className="table-cell whitespace-pre">
                                {highlightCodeLine(line)}
                              </span>
                            </span>
                          ))}
                        </code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stage Bar inside Central Editor */}
              <div className="border-t border-border/80 bg-surface-elevated/30 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
                <span>
                  FOCUS: {currentStepMeta.workspaceFocus.toUpperCase()}
                </span>
                <span className="text-accent">
                  {activeStep === "refine"
                    ? "IDEMPOTENT + NORMALIZED"
                    : "SCHEMA VALIDATED"}
                </span>
              </div>
            </div>

            {/* Right Panel: Explanations & Implementation Details */}
            <div className="lg:col-span-3 flex flex-col justify-between bg-background-secondary/60 p-5 sm:p-6 space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                      IMPLEMENTATION DETAILS
                    </h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-heading text-base font-semibold text-foreground">
                    {currentLang.explanation.headline}
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {currentLang.explanation.summary}
                  </p>
                </div>

                <Separator className="bg-border/80" />

                <div className="space-y-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Key Engineering Decisions
                  </span>
                  <div className="space-y-2.5">
                    {currentLang.explanation.decisions.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg border border-border bg-background p-3 space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-3.5 w-3.5 text-accent shrink-0" />
                          <span className="font-heading text-xs font-semibold text-foreground">
                            {item.label}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enforced Invariants List */}
              <div className="rounded-lg border border-border bg-background p-3.5 space-y-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-primary">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Verified Invariants</span>
                </div>
                <ul className="space-y-1.5">
                  {currentLang.understandContext.invariants.map((inv) => (
                    <li
                      key={inv}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                      <span>{inv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Panel: Output & Illustrative Validation Results */}
          <div className="border-t border-border bg-surface-elevated px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-foreground">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="uppercase tracking-wider">
                  VALIDATION &amp; OUTPUT CONSOLE ({currentStepMeta.marker})
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                <span>
                  PROMPT: &ldquo;{promptText.slice(0, 48)}
                  {promptText.length > 48 ? "..." : ""}&rdquo;
                </span>
                <Badge
                  variant="outline"
                  className="border-border bg-background font-mono text-[10px] text-accent"
                >
                  SIMULATED PREVIEW
                </Badge>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
              {activeLogs.map((logLine) => (
                <div
                  key={logLine}
                  className="rounded border border-border/80 bg-background px-3 py-2 font-mono text-[11px] text-muted-foreground"
                >
                  {logLine}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export { WorkflowSection as Workflow };
export default WorkflowSection;
