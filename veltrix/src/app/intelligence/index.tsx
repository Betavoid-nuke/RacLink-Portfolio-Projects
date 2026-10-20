export interface LanguageNode {
  id: string;
  name: string;
  shortTag: string;
  extension: string;
  paradigm: string;
  description: string;
  contextRole: string;
  codePreview: string;
  /** SVG coordinate (0..600 viewBox width, 0..460 viewBox height) */
  x: number;
  y: number;
  accentTone: "primary" | "accent";
}

export interface CapabilityBlock {
  marker: string;
  title: string;
  description: string;
  technicalNote: string;
}

export const INTELLIGENCE_CAPABILITIES: CapabilityBlock[] = [
  {
    marker: "01 // UNDERSTAND",
    title: "Understand",
    description:
      "Explore code and understand how components relate to one another.",
    technicalNote: "AST & dependency context mapping",
  },
  {
    marker: "02 // TRANSLATE",
    title: "Translate",
    description:
      "Compare implementations and examine how a solution can be expressed in different programming languages.",
    technicalNote: "Idiomatic cross-language synthesis",
  },
  {
    marker: "03 // ADAPT",
    title: "Adapt",
    description:
      "Refine an implementation as requirements, constraints, and development goals evolve.",
    technicalNote: "Constraint-aware structural refinement",
  },
];

export const LANGUAGE_NODES: LanguageNode[] = [
  {
    id: "python",
    name: "Python",
    shortTag: "PY",
    extension: ".py",
    paradigm: "Data & Backend Pipelines",
    description: "Automation, data workflows, and backend development.",
    contextRole: "Declarative data transformations and rapid service orchestration.",
    codePreview: `def dispatch_event(payload: dict[str, Any]) -> Result:
    validated = Schema.validate(payload)
    return pipeline.emit(validated.normalize())`,
    x: 135,
    y: 95,
    accentTone: "primary",
  },
  {
    id: "typescript",
    name: "TypeScript",
    shortTag: "TS",
    extension: ".ts",
    paradigm: "Typed Application Logic",
    description: "Web applications, application logic, and typed interfaces.",
    contextRole: "Strict contract boundaries across client and server runtimes.",
    codePreview: `export function dispatchEvent(payload: Payload): Result<EventRecord> {
  const validated = Schema.parse(payload);
  return pipeline.emit(normalizeRecord(validated));
}`,
    x: 310,
    y: 62,
    accentTone: "accent",
  },
  {
    id: "javascript",
    name: "JavaScript",
    shortTag: "JS",
    extension: ".js",
    paradigm: "Event-Driven Runtimes",
    description:
      "Dynamic web interfaces, asynchronous workflows, and universal scripting.",
    contextRole: "Lightweight runtime execution and event-loop composition.",
    codePreview: `export async function dispatchEvent(payload) {
  const validated = await Schema.verify(payload);
  return pipeline.emit(validated.toNormalized());
}`,
    x: 478,
    y: 112,
    accentTone: "primary",
  },
  {
    id: "rust",
    name: "Rust",
    shortTag: "RS",
    extension: ".rs",
    paradigm: "Zero-Cost Systems Safety",
    description:
      "Systems programming and performance-oriented implementations.",
    contextRole: "Ownership-verified memory layout and predictable latency.",
    codePreview: `pub fn dispatch_event(payload: &Payload) -> Result<EventRecord, Error> {
    let validated = Schema::validate(payload)?;
    pipeline::emit(validated.normalize())
}`,
    x: 505,
    y: 255,
    accentTone: "accent",
  },
  {
    id: "go",
    name: "Go",
    shortTag: "GO",
    extension: ".go",
    paradigm: "Concurrent Network Services",
    description:
      "Concurrent backend services, distributed systems, and cloud tooling.",
    contextRole: "Channel-coordinated routines and explicit error propagation.",
    codePreview: `func DispatchEvent(ctx context.Context, p Payload) (EventRecord, error) {
    v, err := schema.Validate(ctx, p)
    if err != nil { return EventRecord{}, err }
    return pipeline.Emit(v.Normalize()), nil
}`,
    x: 420,
    y: 382,
    accentTone: "primary",
  },
  {
    id: "java",
    name: "Java",
    shortTag: "JV",
    extension: ".java",
    paradigm: "Enterprise Domain Architecture",
    description:
      "Large-scale backend systems, JVM services, and structured domain models.",
    contextRole: "Typed service hierarchies and resilient runtime throughput.",
    codePreview: `public EventRecord dispatchEvent(final Payload payload) {
    final var validated = SchemaValidator.validate(payload);
    return pipeline.emit(validated.normalize());
}`,
    x: 195,
    y: 388,
    accentTone: "accent",
  },
  {
    id: "cpp",
    name: "C++",
    shortTag: "C++",
    extension: ".cpp",
    paradigm: "Deterministic Compute",
    description:
      "High-throughput engines, low-level runtime control, and native execution.",
    contextRole: "Compile-time templates and fine-grained resource control.",
    codePreview: `auto dispatch_event(const Payload& payload) -> Result<EventRecord> {
    auto validated = Schema::validate(payload);
    return pipeline::emit(validated.normalize());
}`,
    x: 92,
    y: 252,
    accentTone: "primary",
  },
];

export { IntelligenceSection, default } from "@/components/intelligence";
