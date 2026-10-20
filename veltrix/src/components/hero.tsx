"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Menu,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { HeroEngine } from "@/app/hero/hero-engine";

interface EarlyAccessFormState {
  name: string;
  email: string;
  language: string;
  intendedUse: string;
}

interface EarlyAccessFormErrors {
  name?: string;
  email?: string;
  language?: string;
  intendedUse?: string;
}

const NAV_ITEMS = [
  { label: "Platform", href: "#intelligence" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "How It Works", href: "#workflow" },
  { label: "Documentation", href: "#early-access" },
];

export interface HeroProps {
  /** Optional external callback when the Early Access modal is triggered */
  onOpenEarlyAccess?: () => void;
  /** Whether to render the top navigation bar (defaults to true) */
  showNavigation?: boolean;
}

export function Hero({ onOpenEarlyAccess, showNavigation = true }: HeroProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [earlyAccessOpen, setEarlyAccessOpen] = React.useState(false);
  const [signInOpen, setSignInOpen] = React.useState(false);

  // Early Access Form State
  const [form, setForm] = React.useState<EarlyAccessFormState>({
    name: "",
    email: "",
    language: "TypeScript",
    intendedUse: "",
  });
  const [errors, setErrors] = React.useState<EarlyAccessFormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerEarlyAccess = () => {
    if (onOpenEarlyAccess) {
      onOpenEarlyAccess();
    }
    setEarlyAccessOpen(true);
  };

  const validateField = (
    field: keyof EarlyAccessFormState,
    value: string
  ): string | undefined => {
    const trimmed = value.trim();
    if (field === "name") {
      if (!trimmed) return "Please enter your name.";
      if (trimmed.length < 2) return "Name must be at least 2 characters.";
    }
    if (field === "email") {
      if (!trimmed) return "Please enter your work or developer email.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) return "Enter a valid email address (e.g. alex@domain.dev).";
    }
    if (field === "language") {
      if (!trimmed) return "Select a primary programming language.";
    }
    if (field === "intendedUse") {
      if (!trimmed) return "Briefly describe what you want to build or explore.";
      if (trimmed.length < 10)
        return "Please share at least a short phrase (10+ characters).";
    }
    return undefined;
  };

  const handleBlur = (field: keyof EarlyAccessFormState) => {
    const err = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleEarlyAccessSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors: EarlyAccessFormErrors = {
      name: validateField("name", form.name),
      email: validateField("email", form.email),
      language: validateField("language", form.language),
      intendedUse: validateField("intendedUse", form.intendedUse),
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 550);
  };

  const handleResetEarlyAccess = () => {
    setIsSubmitted(false);
    setErrors({});
  };

  const scrollToSection = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {showNavigation && (
        <header
          className={`sticky top-0 z-50 transition-colors duration-200 ${
            isScrolled
              ? "border-b border-border/90 bg-background/85 backdrop-blur-md shadow-soft"
              : "border-b border-border/40 bg-background/60 backdrop-blur-sm"
          }`}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left: Custom VELTRIX Wordmark & Converging Geometric Symbol */}
            <Link
              href="#top"
              className="group flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-elevated shadow-soft transition-colors group-hover:border-primary/60"
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

            {/* Center: Desktop Navigation Links */}
            <nav
              aria-label="Primary"
              className="hidden md:flex items-center gap-8 text-sm text-muted-foreground"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-sm py-1 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right: Sign In & Get Early Access */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSignInOpen(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={triggerEarlyAccess}
                className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99]"
              >
                Get Early Access
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                type="button"
                size="sm"
                onClick={triggerEarlyAccess}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-3"
              >
                Early Access
              </Button>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Open navigation menu"
                    className="border-border bg-surface-elevated text-foreground"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="border-border bg-background-secondary text-foreground"
                >
                  <SheetHeader className="border-b border-border pb-4 text-left">
                    <SheetTitle className="font-heading tracking-wider text-foreground">
                      VELTRIX
                    </SheetTitle>
                    <SheetDescription className="font-mono text-xs text-muted-foreground">
                      Intelligence, Engineered.
                    </SheetDescription>
                  </SheetHeader>
                  <nav
                    aria-label="Mobile Primary"
                    className="mt-6 flex flex-col gap-2 px-2"
                  >
                    {NAV_ITEMS.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 px-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setSignInOpen(true);
                      }}
                      className="w-full border-border bg-surface-elevated text-foreground"
                    >
                      Sign In
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        triggerEarlyAccess();
                      }}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Get Early Access
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      )}

      {/* SECTION 01 — THE HERO */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden border-b border-border bg-background bg-veltrix-grid pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
      >
        {/* Subtle atmospheric lighting behind hero composition */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/4 h-[520px] w-[780px] -translate-y-1/3 rounded-full opacity-35 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.675 0.195 292 / 0.22) 0%, oklch(0.795 0.135 232 / 0.08) 50%, transparent 75%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Asymmetrical 12-column composition */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Left Column: Primary Messaging & CTAs */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-7">
              {/* Small uppercase monospace label with violet indicator */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface-elevated/90 px-3.5 py-1.5 shadow-soft">
                <span
                  className="h-2 w-2 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  A NEW STANDARD FOR INTELLIGENT CODING
                </span>
              </div>

              {/* Dominant Headline */}
              <h1
                id="hero-heading"
                className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-[3.75rem] xl:text-[4.25rem] leading-[1.04]"
              >
                One intelligence.
                <br />
                <span className="text-veltrix-gradient">Every language.</span>
              </h1>

              {/* Controlled Supporting Copy */}
              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
                VELTRIX helps developers understand code, move between programming
                languages, and turn complex ideas into working implementations.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Button
                  type="button"
                  size="lg"
                  onClick={triggerEarlyAccess}
                  className="h-12 px-6 bg-primary text-primary-foreground font-medium shadow-lifted hover:bg-primary/90 active:scale-[0.99] transition-transform"
                >
                  Get Early Access
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToSection("#intelligence")}
                  className="h-12 px-6 border-border bg-surface-elevated/75 text-foreground hover:bg-surface-elevated hover:border-primary/50 active:scale-[0.99] transition-colors"
                >
                  Explore the Platform
                  <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              {/* Subtle architectural coordinate caption */}
              <div className="flex items-center gap-6 pt-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/80">
                <span>PYTHON · TYPESCRIPT · RUST · GO</span>
                <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
                <span>UNIFIED CONTEXT</span>
              </div>
            </div>

            {/* Right Column: Custom Intelligence Engine Visual */}
            <div className="lg:col-span-6 xl:col-span-7">
              <HeroEngine />
            </div>
          </div>

          {/* Bottom of Hero: Subtle horizontal divider + positioning descriptors */}
          <Separator className="mt-16 mb-8 bg-border/80" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-heading text-sm sm:text-base font-medium text-foreground">
              Built for the way software evolves.
            </p>
            <div
              className="flex flex-wrap items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-muted-foreground"
              aria-label="Product positioning descriptors"
            >
              <span className="rounded-md border border-border bg-background-secondary px-3 py-1.5 text-foreground/90">
                MULTI-LANGUAGE
              </span>
              <span className="rounded-md border border-border bg-background-secondary px-3 py-1.5 text-foreground/90">
                CONTEXT-AWARE
              </span>
              <span className="rounded-md border border-border bg-background-secondary px-3 py-1.5 text-foreground/90">
                DEVELOPER-FOCUSED
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access Registration Modal Dialog */}
      <Dialog open={earlyAccessOpen} onOpenChange={setEarlyAccessOpen}>
        <DialogContent className="sm:max-w-lg border-border bg-surface-elevated text-foreground">
          <DialogHeader>
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background-secondary px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" />
              <span>VELTRIX EARLY ACCESS</span>
            </div>
            <DialogTitle className="font-heading text-2xl text-foreground">
              Request Early Access
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Join the developer preview for cross-language code understanding and
              context-aware implementation.
            </DialogDescription>
          </DialogHeader>

          {isSubmitted ? (
            <div className="space-y-5 py-4" role="status" aria-live="polite">
              <div className="rounded-xl border border-primary/40 bg-background-secondary p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary font-heading font-semibold">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Interactive Preview Validated</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Thank you, <span className="text-foreground font-medium">{form.name}</span>.
                  Your request for <span className="font-mono text-accent">{form.language}</span>{" "}
                  workflows (<span className="font-mono text-xs">{form.email}</span>) has been
                  validated locally.
                </p>
                <p className="rounded-md border border-border bg-background p-2.5 font-mono text-xs text-muted-foreground">
                  Note: This homepage is running in interactive preview mode without a live
                  remote backend—your details were validated in the browser and were not
                  transmitted to an external server.
                </p>
              </div>
              <DialogFooter className="flex sm:justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetEarlyAccess}
                  className="border-border bg-background-secondary text-foreground"
                >
                  Edit Details
                </Button>
                <Button
                  type="button"
                  onClick={() => setEarlyAccessOpen(false)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleEarlyAccessSubmit} noValidate className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="veltrix-ea-name" className="text-xs font-mono uppercase tracking-wider">
                  Name
                </Label>
                <Input
                  id="veltrix-ea-name"
                  value={form.name}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, name: e.target.value }));
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  onBlur={() => handleBlur("name")}
                  placeholder="Ada Lovelace"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "veltrix-ea-name-err" : undefined}
                  className="border-border bg-background text-foreground"
                />
                {errors.name && (
                  <p id="veltrix-ea-name-err" className="text-xs text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="veltrix-ea-email" className="text-xs font-mono uppercase tracking-wider">
                  Email
                </Label>
                <Input
                  id="veltrix-ea-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, email: e.target.value }));
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  onBlur={() => handleBlur("email")}
                  placeholder="developer@company.dev"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "veltrix-ea-email-err" : undefined}
                  className="border-border bg-background text-foreground"
                />
                {errors.email && (
                  <p id="veltrix-ea-email-err" className="text-xs text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="veltrix-ea-lang" className="text-xs font-mono uppercase tracking-wider">
                  Primary Programming Language
                </Label>
                <Select
                  value={form.language}
                  onValueChange={(value) => {
                    setForm((prev) => ({ ...prev, language: value }));
                    if (errors.language) setErrors((prev) => ({ ...prev, language: undefined }));
                  }}
                >
                  <SelectTrigger
                    id="veltrix-ea-lang"
                    className="border-border bg-background text-foreground"
                  >
                    <SelectValue placeholder="Select primary language" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-surface-elevated text-foreground">
                    <SelectItem value="TypeScript">TypeScript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Rust">Rust</SelectItem>
                    <SelectItem value="Go">Go</SelectItem>
                    <SelectItem value="Java">Java</SelectItem>
                    <SelectItem value="C++">C++</SelectItem>
                  </SelectContent>
                </Select>
                {errors.language && (
                  <p className="text-xs text-destructive">{errors.language}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="veltrix-ea-use" className="text-xs font-mono uppercase tracking-wider">
                  Intended Use
                </Label>
                <Textarea
                  id="veltrix-ea-use"
                  rows={3}
                  value={form.intendedUse}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, intendedUse: e.target.value }));
                    if (errors.intendedUse)
                      setErrors((prev) => ({ ...prev, intendedUse: undefined }));
                  }}
                  onBlur={() => handleBlur("intendedUse")}
                  placeholder="Cross-language service migration, understanding multi-repo architecture..."
                  aria-invalid={Boolean(errors.intendedUse)}
                  aria-describedby={errors.intendedUse ? "veltrix-ea-use-err" : undefined}
                  className="border-border bg-background text-foreground"
                />
                {errors.intendedUse && (
                  <p id="veltrix-ea-use-err" className="text-xs text-destructive">
                    {errors.intendedUse}
                  </p>
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEarlyAccessOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  aria-label="Request Early Access"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : null}
                  <span>{isSubmitting ? "Validating..." : "Request Early Access"}</span>
                  {!isSubmitting ? (
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  ) : null}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Sign In Preview Modal Dialog */}
      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent className="sm:max-w-md border-border bg-surface-elevated text-foreground">
          <DialogHeader>
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background-secondary px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-accent">
              <Terminal className="h-3 w-3" />
              <span>WORKSPACE ACCESS</span>
            </div>
            <DialogTitle className="font-heading text-xl text-foreground">
              Sign in to VELTRIX
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              VELTRIX is currently onboarding developer teams in waves. Request early
              access to reserve your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-background p-3.5 font-mono text-xs text-muted-foreground">
            Status: Early-access preview environment. No live authentication backend is
            connected in this standalone demo.
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSignInOpen(false)}
              className="border-border bg-background-secondary text-foreground"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                setSignInOpen(false);
                setEarlyAccessOpen(true);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Early Access
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Hero;
