"use client";

import * as React from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Code2,
  Loader2,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export interface EarlyAccessFormValues {
  name: string;
  email: string;
  primaryLanguage: string;
  intendedUse: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  primaryLanguage?: string;
  intendedUse?: string;
}

const PROGRAMMING_LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(
  field: keyof EarlyAccessFormValues,
  value: string
): string | undefined {
  const trimmed = value.trim();
  switch (field) {
    case "name":
      if (!trimmed) return "Please enter your full name.";
      if (trimmed.length < 2) return "Name must be at least 2 characters.";
      if (trimmed.length > 80) return "Name must be 80 characters or fewer.";
      return undefined;
    case "email":
      if (!trimmed) return "Please enter your work or developer email address.";
      if (!EMAIL_REGEX.test(trimmed))
        return "Enter a valid email address (for example, alex@domain.dev).";
      if (trimmed.length > 120) return "Email must be 120 characters or fewer.";
      return undefined;
    case "primaryLanguage":
      if (!trimmed) return "Select your primary programming language.";
      return undefined;
    case "intendedUse":
      if (!trimmed)
        return "Briefly describe how you plan to use VELTRIX in your workflow.";
      if (trimmed.length < 12)
        return "Please provide at least 12 characters of context.";
      if (trimmed.length > 500)
        return "Intended use must be 500 characters or fewer.";
      return undefined;
    default:
      return undefined;
  }
}

export interface EarlyAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultLanguage?: string;
}

export function EarlyAccessDialog({
  open,
  onOpenChange,
  defaultLanguage = "",
}: EarlyAccessDialogProps) {
  const [values, setValues] = React.useState<EarlyAccessFormValues>({
    name: "",
    email: "",
    primaryLanguage: defaultLanguage,
    intendedUse: "",
  });

  const [touched, setTouched] = React.useState<
    Partial<Record<keyof EarlyAccessFormValues, boolean>>
  >({});
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "preview-complete"
  >("idle");

  const handleFieldChange = (
    field: keyof EarlyAccessFormValues,
    nextValue: string
  ) => {
    setValues((prev) => ({ ...prev, [field]: nextValue }));
    if (touched[field]) {
      const fieldError = validateField(field, nextValue);
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
  };

  const handleFieldBlur = (field: keyof EarlyAccessFormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateField(field, values[field]);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const validateAll = (): boolean => {
    const nextErrors: FormErrors = {
      name: validateField("name", values.name),
      email: validateField("email", values.email),
      primaryLanguage: validateField(
        "primaryLanguage",
        values.primaryLanguage
      ),
      intendedUse: validateField("intendedUse", values.intendedUse),
    };
    setErrors(nextErrors);
    setTouched({
      name: true,
      email: true,
      primaryLanguage: true,
      intendedUse: true,
    });
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    if (!validateAll()) {
      return;
    }

    setStatus("submitting");
    window.setTimeout(() => {
      setStatus("preview-complete");
    }, 550);
  };

  const handleReset = () => {
    setValues({
      name: "",
      email: "",
      primaryLanguage: defaultLanguage,
      intendedUse: "",
    });
    setTouched({});
    setErrors({});
    setStatus("idle");
  };

  const selectedLanguageLabel =
    PROGRAMMING_LANGUAGES.find((l) => l.value === values.primaryLanguage)
      ?.label ?? values.primaryLanguage;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-surface-elevated p-6 text-foreground shadow-lifted sm:max-w-lg">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center justify-between gap-2 pr-6">
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 font-mono text-[11px] uppercase tracking-widest text-primary"
            >
              <Sparkles className="mr-1.5 h-3 w-3" />
              VELTRIX EARLY ACCESS
            </Badge>
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              COHORT // PREVIEW
            </span>
          </div>
          <DialogTitle className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Request Early Access
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            Explore a more connected way to work with code across programming
            languages, architectures, and implementations.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-1 bg-border/80" />

        {status === "preview-complete" ? (
          <div
            role="status"
            aria-live="polite"
            className="space-y-5 py-2"
          >
            <div className="rounded-xl border border-primary/40 bg-background/90 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-primary/15 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="font-heading text-base font-semibold text-foreground">
                    Early-access profile validated locally
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Your configuration has been verified in this interactive
                    interface preview.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs leading-relaxed text-foreground">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-warning">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                  <span>LOCAL PREVIEW NOTICE — NO LIVE REMOTE SUBMISSION</span>
                </div>
                <p className="mt-1.5 text-muted-foreground">
                  A live registration backend is not connected in this preview
                  environment. Your details have{" "}
                  <strong className="font-medium text-foreground">
                    not been transmitted or stored on a remote server
                  </strong>
                  .
                </p>
              </div>

              <div className="rounded-lg border border-border bg-background-secondary p-3.5 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-border/70 pb-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-accent">
                    <Code2 className="h-3.5 w-3.5" />
                    <span>REQUEST PAYLOAD SUMMARY</span>
                  </span>
                  <span>LOCAL ONLY</span>
                </div>
                <dl className="grid grid-cols-1 gap-1.5 pt-1 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Developer
                    </dt>
                    <dd className="truncate text-foreground">{values.name}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Email
                    </dt>
                    <dd className="truncate text-foreground">{values.email}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Primary Language
                    </dt>
                    <dd className="text-primary">{selectedLanguageLabel}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Intended Use
                    </dt>
                    <dd className="line-clamp-2 text-muted-foreground">
                      {values.intendedUse}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <DialogFooter className="border-t border-border/80 bg-transparent p-0 pt-2 sm:justify-between">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={handleReset}
                className="border-border bg-background text-foreground hover:bg-muted"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Edit or Reset Form
              </Button>
              <Button
                type="button"
                size="default"
                onClick={() => onOpenChange(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FieldGroup className="gap-4">
              <Field data-invalid={Boolean(errors.name)}>
                <FieldLabel htmlFor="early-access-name" className="text-foreground">
                  Name <span className="text-primary">*</span>
                </FieldLabel>
                <Input
                  id="early-access-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  value={values.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  onBlur={() => handleFieldBlur("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "early-access-name-error" : undefined
                  }
                  disabled={status === "submitting"}
                  className="h-9 border-border bg-background/80 text-foreground placeholder:text-muted-foreground/60"
                />
                {errors.name && (
                  <FieldError id="early-access-name-error">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.name}
                    </span>
                  </FieldError>
                )}
              </Field>

              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="early-access-email" className="text-foreground">
                  Email <span className="text-primary">*</span>
                </FieldLabel>
                <Input
                  id="early-access-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="developer@engineering.io"
                  value={values.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={() => handleFieldBlur("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "early-access-email-error" : undefined
                  }
                  disabled={status === "submitting"}
                  className="h-9 border-border bg-background/80 text-foreground placeholder:text-muted-foreground/60"
                />
                {errors.email && (
                  <FieldError id="early-access-email-error">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.email}
                    </span>
                  </FieldError>
                )}
              </Field>

              <Field data-invalid={Boolean(errors.primaryLanguage)}>
                <FieldLabel
                  htmlFor="early-access-language"
                  className="text-foreground"
                >
                  Primary programming language{" "}
                  <span className="text-primary">*</span>
                </FieldLabel>
                <Select
                  value={values.primaryLanguage}
                  onValueChange={(val) => {
                    setTouched((prev) => ({ ...prev, primaryLanguage: true }));
                    handleFieldChange("primaryLanguage", val);
                    setErrors((prev) => ({
                      ...prev,
                      primaryLanguage: validateField("primaryLanguage", val),
                    }));
                  }}
                  disabled={status === "submitting"}
                >
                  <SelectTrigger
                    id="early-access-language"
                    aria-invalid={Boolean(errors.primaryLanguage)}
                    aria-describedby={
                      errors.primaryLanguage
                        ? "early-access-language-error"
                        : undefined
                    }
                    onBlur={() => handleFieldBlur("primaryLanguage")}
                    className="h-9 w-full border-border bg-background/80 text-foreground"
                  >
                    <SelectValue placeholder="Select a primary language" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-surface-elevated text-foreground">
                    <SelectGroup>
                      <SelectLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        Supported Runtime Graph
                      </SelectLabel>
                      {PROGRAMMING_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.primaryLanguage && (
                  <FieldError id="early-access-language-error">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.primaryLanguage}
                    </span>
                  </FieldError>
                )}
              </Field>

              <Field data-invalid={Boolean(errors.intendedUse)}>
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="early-access-intended-use"
                    className="text-foreground"
                  >
                    Intended use <span className="text-primary">*</span>
                  </FieldLabel>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {values.intendedUse.length}/500
                  </span>
                </div>
                <Textarea
                  id="early-access-intended-use"
                  name="intendedUse"
                  rows={3}
                  placeholder="e.g. Translating Python data pipelines to Rust services while preserving schema validation..."
                  value={values.intendedUse}
                  onChange={(e) =>
                    handleFieldChange("intendedUse", e.target.value)
                  }
                  onBlur={() => handleFieldBlur("intendedUse")}
                  aria-invalid={Boolean(errors.intendedUse)}
                  aria-describedby={
                    errors.intendedUse
                      ? "early-access-intended-use-error"
                      : "early-access-intended-use-desc"
                  }
                  disabled={status === "submitting"}
                  className="border-border bg-background/80 text-foreground placeholder:text-muted-foreground/60"
                />
                <FieldDescription
                  id="early-access-intended-use-desc"
                  className="text-xs text-muted-foreground"
                >
                  Share the languages, repositories, or workflows you want to
                  connect.
                </FieldDescription>
                {errors.intendedUse && (
                  <FieldError id="early-access-intended-use-error">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.intendedUse}
                    </span>
                  </FieldError>
                )}
              </Field>
            </FieldGroup>

            <div className="rounded-lg border border-border/80 bg-background/60 px-3.5 py-2.5 text-xs text-muted-foreground">
              <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
                PREVIEW MODE:
              </span>{" "}
              This form validates your request locally. No data is transmitted to
              an external backend in this demonstration environment.
            </div>

            <DialogFooter className="border-t border-border/80 bg-transparent p-0 pt-3 sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={status === "submitting"}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={status === "submitting"}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating Request...
                  </>
                ) : (
                  <>
                    Verify Early Access Request
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
