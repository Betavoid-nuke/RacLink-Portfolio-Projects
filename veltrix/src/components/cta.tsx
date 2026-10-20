"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  FileText,
  Layers,
  Mail,
  Sparkles,
  Terminal,
} from "lucide-react";
import { CtaHorizonVisual } from "@/app/cta/cta-horizon-visual";
import { EarlyAccessDialog } from "@/app/cta/early-access-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type FooterDocKey =
  | "documentation"
  | "getting-started"
  | "contact"
  | "about"
  | "privacy"
  | "terms";

interface FooterDocItem {
  key: FooterDocKey;
  category: string;
  title: string;
  subtitle: string;
  sections: {
    heading: string;
    body: string;
  }[];
}

const FOOTER_DOCS: Record<FooterDocKey, FooterDocItem> = {
  documentation: {
    key: "documentation",
    category: "RESOURCES // DOCUMENTATION",
    title: "VELTRIX Architecture & Language Reference",
    subtitle:
      "How VELTRIX connects syntax trees, type constraints, and execution semantics across programming languages.",
    sections: [
      {
        heading: "Unified Semantic Representation",
        body: "VELTRIX models code structure across Python, TypeScript, JavaScript, Rust, Go, Java, and C++ so developers can inspect how logic behaves before committing to a target implementation.",
      },
      {
        heading: "Context-Preserving Translation",
        body: "When moving between languages, VELTRIX maps idioms—such as Python iterators to Rust Result pipelines or Go concurrency channels—rather than performing line-by-line lexical substitution.",
      },
      {
        heading: "Interactive Workspace Controls",
        body: "Use the Intelligence Graph (#intelligence) and the Interactive Workflow (#workflow) on this page to inspect cross-language relationships directly in your browser.",
      },
    ],
  },
  "getting-started": {
    key: "getting-started",
    category: "RESOURCES // GETTING STARTED",
    title: "Getting Started with VELTRIX",
    subtitle:
      "Move from problem definition to cross-language implementation in four structured steps.",
    sections: [
      {
        heading: "01. Describe the Engineering Goal",
        body: "Start with natural-language requirements or an existing module. Specify constraints such as memory safety, async throughput, or schema validation.",
      },
      {
        heading: "02. Inspect the Language Graph",
        body: "Compare how your core logic maps across runtime environments in the Intelligence section before generating code.",
      },
      {
        heading: "03. Generate & Refine",
        body: "Synthesize clean, idiomatic code and iterate on edge cases or architectural boundaries. Request Early Access to join the developer preview.",
      },
    ],
  },
  contact: {
    key: "contact",
    category: "RESOURCES // CONTACT",
    title: "Connect with the VELTRIX Engineering Team",
    subtitle:
      "Reach out regarding early-access onboarding, language runtime support, or technical feedback.",
    sections: [
      {
        heading: "Early Access & Developer Onboarding",
        body: "Use the Request Early Access modal on this page to configure your primary programming language and intended workflow use case.",
      },
      {
        heading: "Preview Environment Notice",
        body: "This web experience is a self-contained product demonstration. Interactive forms validate locally in your browser without transmitting data to external servers.",
      },
    ],
  },
  about: {
    key: "about",
    category: "COMPANY // ABOUT VELTRIX",
    title: "VELTRIX — Intelligence, Engineered.",
    subtitle:
      "Intelligent coding assistance for developers working across languages, ideas, and implementations.",
    sections: [
      {
        heading: "Our Focus",
        body: "Modern software rarely lives in a single language. VELTRIX is built for engineers who design, debug, and evolve systems across polyglot codebases.",
      },
      {
        heading: "Design Philosophy",
        body: "We prioritize structural clarity, honest developer tooling, and deep language comprehension over superficial autocomplete.",
      },
    ],
  },
  privacy: {
    key: "privacy",
    category: "LEGAL // PRIVACY POLICY",
    title: "Privacy Policy",
    subtitle:
      "Transparent handling of developer inputs and local browser state.",
    sections: [
      {
        heading: "Zero Remote Data Collection in Preview",
        body: "In this interactive preview environment, inputs entered into the Early Access form or workflow workspace are processed strictly within your local browser session.",
      },
      {
        heading: "No Third-Party Tracking Payloads",
        body: "We do not sell developer prompts, source snippets, or email addresses. Any data entered into the demonstration modal remains on your device and is cleared when you reset or close the session.",
      },
    ],
  },
  terms: {
    key: "terms",
    category: "LEGAL // TERMS OF SERVICE",
    title: "Terms of Service",
    subtitle:
      "Usage guidelines for the VELTRIX platform preview and code synthesis interface.",
    sections: [
      {
        heading: "Developer Preview Scope",
        body: "The VELTRIX interface and cross-language code examples are provided for technical evaluation and workflow exploration.",
      },
      {
        heading: "Code Verification Responsibility",
        body: "Developers remain responsible for reviewing, testing, and validating generated or translated implementations prior to production deployment.",
      },
    ],
  },
};

export interface FinalCtaSectionProps {
  /**
   * Whether to also render the complete VELTRIX footer beneath Section 05.
   * Defaults to true so standalone usage includes the spec's closing narrative + footer.
   */
  includeFooter?: boolean;
}

export function FinalCtaSection({ includeFooter = true }: FinalCtaSectionProps) {
  const [earlyAccessOpen, setEarlyAccessOpen] = React.useState(false);
  const [activeDocKey, setActiveDocKey] = React.useState<FooterDocKey | null>(
    null
  );

  const activeDoc = activeDocKey ? FOOTER_DOCS[activeDocKey] : null;
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* SECTION 05 — FINAL CTA */}
      <section
        id="early-access"
        aria-labelledby="final-cta-heading"
        className="relative overflow-hidden border-t border-border bg-background pt-24 pb-16 sm:pt-32 sm:pb-24"
      >
        {/* Subtle background grid & top radial vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-veltrix-grid opacity-45"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background via-background/70 to-transparent"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section eyebrow label */}
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface-elevated/90 px-4 py-1.5 shadow-soft">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-primary"
              />
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                SECTION 05 // BUILD BEYOND THE FAMILIAR
              </span>
            </div>

            {/* Large, confident headline */}
            <h2
              id="final-cta-heading"
              className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.06]"
            >
              Your next breakthrough{" "}
              <span className="text-veltrix-gradient">
                starts with an idea.
              </span>
            </h2>

            {/* Supporting copy from spec */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Explore a more connected way to work with code, move between
              technologies, and turn ambitious ideas into software.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button
                type="button"
                size="lg"
                onClick={() => setEarlyAccessOpen(true)}
                className="h-11 bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lifted hover:bg-primary/90"
              >
                Get Early Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 border-border bg-surface-elevated/80 px-6 text-sm font-medium text-foreground hover:bg-surface-elevated"
              >
                <Link
                  href="#intelligence"
                  onClick={(e) => {
                    const el = document.getElementById("intelligence");
                    if (el) {
                      e.preventDefault();
                      scrollToSection("intelligence");
                    }
                  }}
                >
                  <Compass className="mr-2 h-4 w-4 text-accent" />
                  Explore the Platform
                </Link>
              </Button>
            </div>

            {/* Subtle technical metadata pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <Badge
                variant="outline"
                className="border-border/80 bg-background-secondary/80 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                7 CORE LANGUAGES
              </Badge>
              <span aria-hidden="true" className="text-border">
                /
              </span>
              <Badge
                variant="outline"
                className="border-border/80 bg-background-secondary/80 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                CONTEXT-AWARE SYNTHESIS
              </Badge>
              <span aria-hidden="true" className="text-border">
                /
              </span>
              <Badge
                variant="outline"
                className="border-border/80 bg-background-secondary/80 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                INSTANT INTERACTIVE PREVIEW
              </Badge>
            </div>
          </div>

          {/* Restrained geometric structure partially emerging from the horizon */}
          <div className="mt-8 sm:mt-10">
            <CtaHorizonVisual />
          </div>
        </div>
      </section>

      {/* COMPLETE POLISHED FOOTER */}
      {includeFooter && (
        <footer
          aria-label="Site footer"
          className="border-t border-border bg-background-secondary text-foreground"
        >
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              {/* Brand Column */}
              <div className="space-y-4 lg:col-span-5">
                <Link
                  href="#top"
                  className="inline-flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-elevated shadow-soft"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4.5 6L12 19L19.5 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      />
                      <path
                        d="M8.5 6L12 12L15.5 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-accent"
                      />
                    </svg>
                  </span>
                  <span className="font-heading text-base font-semibold tracking-wider text-foreground">
                    VELTRIX
                  </span>
                </Link>

                <p className="font-mono text-xs uppercase tracking-widest text-primary">
                  Intelligence, Engineered.
                </p>

                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Intelligent coding assistance for developers working across
                  languages, ideas, and implementations.
                </p>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEarlyAccessOpen(true)}
                    className="border-border bg-surface-elevated text-xs text-foreground hover:bg-muted"
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
                    Get Early Access
                  </Button>
                </div>
              </div>

              {/* Navigation Columns: Platform, Resources, Company */}
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
                {/* Platform */}
                <div className="space-y-3.5">
                  <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-foreground">
                    Platform
                  </h3>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    <li>
                      <Link
                        href="#intelligence"
                        className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-xs"
                      >
                        Overview
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#capabilities"
                        className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-xs"
                      >
                        Capabilities
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#workflow"
                        className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-xs"
                      >
                        How It Works
                      </Link>
                    </li>
                    <li>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setEarlyAccessOpen(true)}
                        className="h-auto p-0 text-sm font-normal text-muted-foreground hover:text-foreground"
                      >
                        Get Early Access
                      </Button>
                    </li>
                  </ul>
                </div>

                {/* Resources */}
                <div className="space-y-3.5">
                  <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-foreground">
                    Resources
                  </h3>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    <li>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setActiveDocKey("documentation")}
                        className="h-auto p-0 text-sm font-normal text-muted-foreground hover:text-foreground"
                      >
                        Documentation
                      </Button>
                    </li>
                    <li>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setActiveDocKey("getting-started")}
                        className="h-auto p-0 text-sm font-normal text-muted-foreground hover:text-foreground"
                      >
                        Getting Started
                      </Button>
                    </li>
                    <li>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setActiveDocKey("contact")}
                        className="h-auto p-0 text-sm font-normal text-muted-foreground hover:text-foreground"
                      >
                        Contact
                      </Button>
                    </li>
                  </ul>
                </div>

                {/* Company */}
                <div className="space-y-3.5">
                  <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-foreground">
                    Company
                  </h3>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    <li>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setActiveDocKey("about")}
                        className="h-auto p-0 text-sm font-normal text-muted-foreground hover:text-foreground"
                      >
                        About
                      </Button>
                    </li>
                    <li>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setActiveDocKey("privacy")}
                        className="h-auto p-0 text-sm font-normal text-muted-foreground hover:text-foreground"
                      >
                        Privacy Policy
                      </Button>
                    </li>
                    <li>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setActiveDocKey("terms")}
                        className="h-auto p-0 text-sm font-normal text-muted-foreground hover:text-foreground"
                      >
                        Terms of Service
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator className="my-10 bg-border/80" />

            {/* Bottom Row */}
            <div className="flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-heading font-semibold text-foreground">
                  VELTRIX
                </span>
                <span aria-hidden="true" className="text-border">
                  —
                </span>
                <span>Intelligence, Engineered.</span>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                © {currentYear} VELTRIX. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Early Access Registration Modal */}
      <EarlyAccessDialog
        open={earlyAccessOpen}
        onOpenChange={setEarlyAccessOpen}
      />

      {/* Interactive Resource & Legal Documentation Modal (ensures zero dead links) */}
      <Dialog
        open={Boolean(activeDoc)}
        onOpenChange={(open) => {
          if (!open) setActiveDocKey(null);
        }}
      >
        {activeDoc && (
          <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-surface-elevated p-6 text-foreground shadow-lifted sm:max-w-lg">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-border bg-background/80 font-mono text-[10px] uppercase tracking-widest text-accent"
                >
                  {activeDoc.category}
                </Badge>
              </div>
              <DialogTitle className="font-heading text-xl font-bold text-foreground">
                {activeDoc.title}
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {activeDoc.subtitle}
              </DialogDescription>
            </DialogHeader>

            <Separator className="my-1 bg-border/80" />

            <div className="space-y-4 py-2">
              {activeDoc.sections.map((sec, idx) => (
                <div
                  key={sec.heading}
                  className="rounded-lg border border-border/80 bg-background/70 p-4 space-y-1.5"
                >
                  <div className="flex items-center gap-2 font-mono text-xs text-primary">
                    {idx === 0 ? (
                      <BookOpen className="h-3.5 w-3.5" />
                    ) : idx === 1 ? (
                      <Layers className="h-3.5 w-3.5" />
                    ) : (
                      <Terminal className="h-3.5 w-3.5" />
                    )}
                    <span className="font-semibold text-foreground">
                      {sec.heading}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>

            <DialogFooter className="border-t border-border/80 bg-transparent p-0 pt-3 sm:justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveDocKey(null);
                  setEarlyAccessOpen(true);
                }}
                className="border-border bg-background text-foreground hover:bg-muted"
              >
                <Mail className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Request Early Access
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setActiveDocKey(null)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                Close Reference
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

export { CtaHorizonVisual, EarlyAccessDialog };
export default FinalCtaSection;
