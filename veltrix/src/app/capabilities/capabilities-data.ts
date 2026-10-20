export type TokenTone =
  | "keyword"
  | "ident"
  | "type"
  | "string"
  | "punct"
  | "comment";

export interface CodeToken {
  text: string;
  tone: TokenTone;
}

export interface CodeTokenLine {
  lineNumber: number;
  indent?: number;
  highlight?: "added" | "removed" | "accent";
  tokens: CodeToken[];
}

export interface CodeGenerationSample {
  id: string;
  label: string;
  language: "TypeScript" | "Python" | "Rust";
  fileName: string;
  prompt: string;
  annotation: string;
  outputLines: CodeTokenLine[];
}

export interface CodeUnderstandingNode {
  id: string;
  name: string;
  path: string;
  folder: string;
  roleTag: string;
  explanation: string;
  architecturalNote: string;
  imports: string[];
  usedBy: string[];
  codeLines: CodeTokenLine[];
}

export interface DebuggingDiffRow {
  lineNumber: string;
  kind: "context" | "removed" | "added";
  code: string;
}

export interface DebuggingScenario {
  moduleName: string;
  errorCode: string;
  errorSummary: string;
  stackTrace: string[];
  probableCause: string;
  diagnosticApproach: string;
  proposedDiff: DebuggingDiffRow[];
}

export interface CrossLanguageSide {
  fileName: string;
  runtimeNote: string;
  lines: CodeTokenLine[];
}

export interface CrossLanguagePair {
  id: string;
  label: string;
  concept: string;
  sharedInvariant: string;
  python: CrossLanguageSide;
  typescript: CrossLanguageSide;
}

export interface RefactoringComparison {
  fileName: string;
  summary: string;
  beforeLines: CodeTokenLine[];
  afterLines: CodeTokenLine[];
}

export interface ConnectedWorkflowStage {
  id: "plan" | "implement" | "debug" | "refine";
  stepNumber: string;
  title: string;
  artifact: string;
  statusLabel: string;
  summary: string;
  detailPreview: string;
  linkedCapability: string;
}

export const CODE_GENERATION_SAMPLES: CodeGenerationSample[] = [
  {
    id: "ts-validator",
    label: "Schema Endpoint",
    language: "TypeScript",
    fileName: "src/ingest/validate-record.ts",
    prompt:
      "Create a typed request validator that normalizes incoming telemetry payloads and returns structured validation errors.",
    annotation: "STRUCTURED COMPONENT SYNTHESIS",
    outputLines: [
      {
        lineNumber: 1,
        tokens: [
          { text: "export interface ", tone: "keyword" },
          { text: "TelemetryRecord", tone: "type" },
          { text: " { ", tone: "punct" },
          { text: "sourceId", tone: "ident" },
          { text: ": ", tone: "punct" },
          { text: "string", tone: "type" },
          { text: "; ", tone: "punct" },
          { text: "latencyMs", tone: "ident" },
          { text: ": ", tone: "punct" },
          { text: "number", tone: "type" },
          { text: " }", tone: "punct" },
        ],
      },
      {
        lineNumber: 2,
        highlight: "accent",
        tokens: [
          { text: "export function ", tone: "keyword" },
          { text: "parseTelemetry", tone: "ident" },
          { text: "(", tone: "punct" },
          { text: "raw", tone: "ident" },
          { text: ": ", tone: "punct" },
          { text: "unknown", tone: "type" },
          { text: "): ", tone: "punct" },
          { text: "Result", tone: "type" },
          { text: "<", tone: "punct" },
          { text: "TelemetryRecord", tone: "type" },
          { text: "> {", tone: "punct" },
        ],
      },
      {
        lineNumber: 3,
        indent: 1,
        tokens: [
          { text: "const ", tone: "keyword" },
          { text: "parsed = TelemetrySchema.safeParse(raw);", tone: "ident" },
        ],
      },
      {
        lineNumber: 4,
        indent: 1,
        tokens: [
          { text: "if ", tone: "keyword" },
          { text: "(!parsed.success) ", tone: "punct" },
          { text: "return ", tone: "keyword" },
          { text: "Err(parsed.error.flatten());", tone: "ident" },
        ],
      },
      {
        lineNumber: 5,
        indent: 1,
        highlight: "added",
        tokens: [
          { text: "return ", tone: "keyword" },
          { text: "Ok(normalizeTelemetry(parsed.data));", tone: "ident" },
        ],
      },
      {
        lineNumber: 6,
        tokens: [{ text: "}", tone: "punct" }],
      },
    ],
  },
  {
    id: "py-worker",
    label: "Batch Pipeline",
    language: "Python",
    fileName: "pipeline/batch_dispatcher.py",
    prompt:
      "Implement an async batch processor that validates records against schema rules before emitting to the queue.",
    annotation: "ASYNC WORKFLOW SYNTHESIS",
    outputLines: [
      {
        lineNumber: 1,
        highlight: "accent",
        tokens: [
          { text: "async def ", tone: "keyword" },
          { text: "dispatch_batch", tone: "ident" },
          { text: "(records: ", tone: "punct" },
          { text: "list[RawEvent]", tone: "type" },
          { text: ") -> ", tone: "punct" },
          { text: "BatchReceipt", tone: "type" },
          { text: ":", tone: "punct" },
        ],
      },
      {
        lineNumber: 2,
        indent: 1,
        tokens: [
          { text: "verified = [Schema.validate(r) ", tone: "ident" },
          { text: "for ", tone: "keyword" },
          { text: "r ", tone: "ident" },
          { text: "in ", tone: "keyword" },
          { text: "records ", tone: "ident" },
          { text: "if ", tone: "keyword" },
          { text: "r.is_active]", tone: "ident" },
        ],
      },
      {
        lineNumber: 3,
        indent: 1,
        tokens: [
          { text: "if not ", tone: "keyword" },
          { text: "verified:", tone: "ident" },
        ],
      },
      {
        lineNumber: 4,
        indent: 2,
        tokens: [
          { text: "return ", tone: "keyword" },
          { text: "BatchReceipt.empty(status=", tone: "ident" },
          { text: "\"no_active_records\"", tone: "string" },
          { text: ")", tone: "punct" },
        ],
      },
      {
        lineNumber: 5,
        indent: 1,
        highlight: "added",
        tokens: [
          { text: "return await ", tone: "keyword" },
          { text: "queue.publish_many(verified)", tone: "ident" },
        ],
      },
    ],
  },
  {
    id: "rs-codec",
    label: "Frame Decoder",
    language: "Rust",
    fileName: "crates/codec/src/frame.rs",
    prompt:
      "Write a zero-allocation frame header parser that verifies protocol magic bytes and payload bounds.",
    annotation: "SYSTEMS COMPONENT SYNTHESIS",
    outputLines: [
      {
        lineNumber: 1,
        highlight: "accent",
        tokens: [
          { text: "pub fn ", tone: "keyword" },
          { text: "decode_header", tone: "ident" },
          { text: "(buf: ", tone: "punct" },
          { text: "&[u8]", tone: "type" },
          { text: ") -> ", tone: "punct" },
          { text: "Result<FrameHeader, CodecError>", tone: "type" },
          { text: " {", tone: "punct" },
        ],
      },
      {
        lineNumber: 2,
        indent: 1,
        tokens: [
          { text: "let ", tone: "keyword" },
          { text: "head = buf.get(..8).ok_or(CodecError::Truncated)?;", tone: "ident" },
        ],
      },
      {
        lineNumber: 3,
        indent: 1,
        tokens: [
          { text: "if ", tone: "keyword" },
          { text: "&head[..2] != ", tone: "punct" },
          { text: "b\"VX\"", tone: "string" },
          { text: " { ", tone: "punct" },
          { text: "return ", tone: "keyword" },
          { text: "Err(CodecError::InvalidMagic); }", tone: "ident" },
        ],
      },
      {
        lineNumber: 4,
        indent: 1,
        highlight: "added",
        tokens: [
          { text: "Ok", tone: "type" },
          { text: "(FrameHeader::from_slice(head))", tone: "ident" },
        ],
      },
      {
        lineNumber: 5,
        tokens: [{ text: "}", tone: "punct" }],
      },
    ],
  },
];

export const CODE_UNDERSTANDING_NODES: CodeUnderstandingNode[] = [
  {
    id: "context-router",
    name: "router.ts",
    path: "src/engine/router.ts",
    folder: "src/engine",
    roleTag: "DISPATCH GRAPH",
    explanation:
      "Coordinates incoming execution requests, resolves language grammar adapters, and delegates AST normalization to the symbol resolver.",
    architecturalNote:
      "Maintains a deterministic lookup table so cross-language queries share a single request lifecycle.",
    imports: ["schema/contracts.ts", "ast/normalizer.ts"],
    usedBy: ["workspace/session.ts", "cli/inspect.ts"],
    codeLines: [
      {
        lineNumber: 12,
        highlight: "accent",
        tokens: [
          { text: "export async function ", tone: "keyword" },
          { text: "routeAnalysis", tone: "ident" },
          { text: "(ctx: ", tone: "punct" },
          { text: "EngineContext", tone: "type" },
          { text: ") {", tone: "punct" },
        ],
      },
      {
        lineNumber: 13,
        indent: 1,
        tokens: [
          { text: "const ", tone: "keyword" },
          { text: "adapter = resolveGrammar(ctx.language);", tone: "ident" },
        ],
      },
      {
        lineNumber: 14,
        indent: 1,
        tokens: [
          { text: "const ", tone: "keyword" },
          { text: "graph = ", tone: "ident" },
          { text: "await ", tone: "keyword" },
          { text: "adapter.buildSymbolGraph(ctx.source);", tone: "ident" },
        ],
      },
      {
        lineNumber: 15,
        indent: 1,
        tokens: [
          { text: "return ", tone: "keyword" },
          { text: "linkCrossModuleRefs(graph, ctx.scope);", tone: "ident" },
        ],
      },
      {
        lineNumber: 16,
        tokens: [{ text: "}", tone: "punct" }],
      },
    ],
  },
  {
    id: "ast-normalizer",
    name: "normalizer.ts",
    path: "src/ast/normalizer.ts",
    folder: "src/ast",
    roleTag: "AST BRIDGE",
    explanation:
      "Transforms language-specific syntax trees into unified semantic nodes so control flow and data contracts can be compared side by side.",
    architecturalNote:
      "Strips formatting noise while preserving ownership, mutability, and return-type invariants.",
    imports: ["ir/semantic-node.ts"],
    usedBy: ["engine/router.ts", "diff/equivalence.ts"],
    codeLines: [
      {
        lineNumber: 24,
        highlight: "accent",
        tokens: [
          { text: "export function ", tone: "keyword" },
          { text: "toSemanticNode", tone: "ident" },
          { text: "(ast: ", tone: "punct" },
          { text: "SyntaxNode", tone: "type" },
          { text: "): ", tone: "punct" },
          { text: "IRNode", tone: "type" },
          { text: " {", tone: "punct" },
        ],
      },
      {
        lineNumber: 25,
        indent: 1,
        tokens: [
          { text: "const ", tone: "keyword" },
          { text: "signature = extractSignature(ast);", tone: "ident" },
        ],
      },
      {
        lineNumber: 26,
        indent: 1,
        tokens: [
          { text: "return ", tone: "keyword" },
          { text: "{ kind: ast.kind, signature, edges: ast.refs };", tone: "ident" },
        ],
      },
      {
        lineNumber: 27,
        tokens: [{ text: "}", tone: "punct" }],
      },
    ],
  },
  {
    id: "schema-contracts",
    name: "contracts.ts",
    path: "src/schema/contracts.ts",
    folder: "src/schema",
    roleTag: "TYPE BOUNDARY",
    explanation:
      "Defines strict input and output invariants shared across language adapters and workspace diagnostics.",
    architecturalNote:
      "Acts as the single source of truth for validation rules before any code preview is synthesized.",
    imports: ["ir/types.ts"],
    usedBy: ["engine/router.ts", "ingest/validate-record.ts"],
    codeLines: [
      {
        lineNumber: 8,
        highlight: "accent",
        tokens: [
          { text: "export interface ", tone: "keyword" },
          { text: "ContractCheck", tone: "type" },
          { text: " {", tone: "punct" },
        ],
      },
      {
        lineNumber: 9,
        indent: 1,
        tokens: [
          { text: "readonly ", tone: "keyword" },
          { text: "invariants: ", tone: "ident" },
          { text: "ReadonlyArray<string>", tone: "type" },
          { text: ";", tone: "punct" },
        ],
      },
      {
        lineNumber: 10,
        indent: 1,
        tokens: [
          { text: "readonly ", tone: "keyword" },
          { text: "nullablePaths: ", tone: "ident" },
          { text: "string[]", tone: "type" },
          { text: ";", tone: "punct" },
        ],
      },
      {
        lineNumber: 11,
        tokens: [{ text: "}", tone: "punct" }],
      },
    ],
  },
];

export const DEBUGGING_SCENARIO: DebuggingScenario = {
  moduleName: "src/sync/cursor-store.ts:42",
  errorCode: "ERR_NULL_CURSOR_DEREF",
  errorSummary:
    "TypeError: Cannot read properties of undefined (reading 'nextOffset') during pagination resume.",
  stackTrace: [
    "at resumeStream (src/sync/cursor-store.ts:42:19)",
    "at pollBatchWindow (src/sync/poller.ts:88:11)",
  ],
  probableCause:
    "When an upstream partition resets, getCheckpoint() returns undefined for uninitialized shards before the fallback cursor is constructed.",
  diagnosticApproach:
    "Introduce an explicit guard clause that initializes a zero-offset cursor when no prior checkpoint exists for the shard key.",
  proposedDiff: [
    {
      lineNumber: "40",
      kind: "context",
      code: "const checkpoint = store.getCheckpoint(shardId);",
    },
    {
      lineNumber: "41",
      kind: "removed",
      code: "- return fetchWindow(shardId, checkpoint.nextOffset);",
    },
    {
      lineNumber: "41",
      kind: "added",
      code: "+ const offset = checkpoint?.nextOffset ?? 0;",
    },
    {
      lineNumber: "42",
      kind: "added",
      code: "+ return fetchWindow(shardId, offset);",
    },
  ],
};

export const CROSS_LANGUAGE_PAIRS: CrossLanguagePair[] = [
  {
    id: "rate-window",
    label: "Token Bucket Limiter",
    concept: "Deterministic Rate Window",
    sharedInvariant:
      "Both implementations enforce identical token replenishment math and atomic quota deduction per caller key.",
    python: {
      fileName: "limiter/window.py",
      runtimeNote: "Python 3.12 · Dataclass State",
      lines: [
        {
          lineNumber: 1,
          tokens: [
            { text: "def ", tone: "keyword" },
            { text: "consume_quota", tone: "ident" },
            { text: "(bucket: ", tone: "punct" },
            { text: "Bucket", tone: "type" },
            { text: ", cost: ", tone: "punct" },
            { text: "int", tone: "type" },
            { text: ") -> ", tone: "punct" },
            { text: "bool", tone: "type" },
            { text: ":", tone: "punct" },
          ],
        },
        {
          lineNumber: 2,
          indent: 1,
          highlight: "accent",
          tokens: [
            { text: "if ", tone: "keyword" },
            { text: "bucket.available < cost:", tone: "ident" },
          ],
        },
        {
          lineNumber: 3,
          indent: 2,
          tokens: [
            { text: "return ", tone: "keyword" },
            { text: "False", tone: "type" },
          ],
        },
        {
          lineNumber: 4,
          indent: 1,
          tokens: [
            { text: "bucket.available -= cost", tone: "ident" },
          ],
        },
        {
          lineNumber: 5,
          indent: 1,
          tokens: [
            { text: "return ", tone: "keyword" },
            { text: "True", tone: "type" },
          ],
        },
      ],
    },
    typescript: {
      fileName: "limiter/window.ts",
      runtimeNote: "TypeScript 5 · Strict Type Guard",
      lines: [
        {
          lineNumber: 1,
          tokens: [
            { text: "export function ", tone: "keyword" },
            { text: "consumeQuota", tone: "ident" },
            { text: "(bucket: ", tone: "punct" },
            { text: "Bucket", tone: "type" },
            { text: ", cost: ", tone: "punct" },
            { text: "number", tone: "type" },
            { text: "): ", tone: "punct" },
            { text: "boolean", tone: "type" },
            { text: " {", tone: "punct" },
          ],
        },
        {
          lineNumber: 2,
          indent: 1,
          highlight: "accent",
          tokens: [
            { text: "if ", tone: "keyword" },
            { text: "(bucket.available < cost) ", tone: "ident" },
            { text: "return ", tone: "keyword" },
            { text: "false", tone: "type" },
            { text: ";", tone: "punct" },
          ],
        },
        {
          lineNumber: 3,
          indent: 1,
          tokens: [
            { text: "bucket.available -= cost;", tone: "ident" },
          ],
        },
        {
          lineNumber: 4,
          indent: 1,
          tokens: [
            { text: "return ", tone: "keyword" },
            { text: "true", tone: "type" },
            { text: ";", tone: "punct" },
          ],
        },
        {
          lineNumber: 5,
          tokens: [{ text: "}", tone: "punct" }],
        },
      ],
    },
  },
  {
    id: "signature-verify",
    label: "Webhook HMAC Check",
    concept: "Constant-Time Signature Verification",
    sharedInvariant:
      "Preserves constant-time digest comparison and timestamp drift bounds across Python and TypeScript runtimes.",
    python: {
      fileName: "security/webhook.py",
      runtimeNote: "Python · hmac.compare_digest",
      lines: [
        {
          lineNumber: 1,
          tokens: [
            { text: "def ", tone: "keyword" },
            { text: "verify_sig", tone: "ident" },
            { text: "(payload: ", tone: "punct" },
            { text: "bytes", tone: "type" },
            { text: ", sig: ", tone: "punct" },
            { text: "str", tone: "type" },
            { text: ") -> ", tone: "punct" },
            { text: "bool", tone: "type" },
            { text: ":", tone: "punct" },
          ],
        },
        {
          lineNumber: 2,
          indent: 1,
          tokens: [
            { text: "expected = compute_hmac(payload)", tone: "ident" },
          ],
        },
        {
          lineNumber: 3,
          indent: 1,
          highlight: "accent",
          tokens: [
            { text: "return ", tone: "keyword" },
            { text: "hmac.compare_digest(expected, sig)", tone: "ident" },
          ],
        },
      ],
    },
    typescript: {
      fileName: "security/webhook.ts",
      runtimeNote: "TypeScript · timingSafeEqual",
      lines: [
        {
          lineNumber: 1,
          tokens: [
            { text: "export function ", tone: "keyword" },
            { text: "verifySig", tone: "ident" },
            { text: "(payload: ", tone: "punct" },
            { text: "Uint8Array", tone: "type" },
            { text: ", sig: ", tone: "punct" },
            { text: "string", tone: "type" },
            { text: "): ", tone: "punct" },
            { text: "boolean", tone: "type" },
            { text: " {", tone: "punct" },
          ],
        },
        {
          lineNumber: 2,
          indent: 1,
          tokens: [
            { text: "const ", tone: "keyword" },
            { text: "expected = computeHmac(payload);", tone: "ident" },
          ],
        },
        {
          lineNumber: 3,
          indent: 1,
          highlight: "accent",
          tokens: [
            { text: "return ", tone: "keyword" },
            { text: "timingSafeEqual(expected, Buffer.from(sig));", tone: "ident" },
          ],
        },
        {
          lineNumber: 4,
          tokens: [{ text: "}", tone: "punct" }],
        },
      ],
    },
  },
];

export const REFACTORING_COMPARISON: RefactoringComparison = {
  fileName: "src/permissions/evaluate-access.ts",
  summary:
    "Replaces deeply nested conditional branches with explicit guard clauses and a declarative permission lookup.",
  beforeLines: [
    {
      lineNumber: 1,
      tokens: [
        { text: "function ", tone: "keyword" },
        { text: "canDeploy", tone: "ident" },
        { text: "(u: ", tone: "punct" },
        { text: "User", tone: "type" },
        { text: ", env: ", tone: "punct" },
        { text: "Env", tone: "type" },
        { text: ") {", tone: "punct" },
      ],
    },
    {
      lineNumber: 2,
      indent: 1,
      highlight: "removed",
      tokens: [
        { text: "if ", tone: "keyword" },
        { text: "(u && u.active) {", tone: "ident" },
      ],
    },
    {
      lineNumber: 3,
      indent: 2,
      highlight: "removed",
      tokens: [
        { text: "if ", tone: "keyword" },
        { text: "(env.locked === false) {", tone: "ident" },
      ],
    },
    {
      lineNumber: 4,
      indent: 3,
      highlight: "removed",
      tokens: [
        { text: "return ", tone: "keyword" },
        { text: "u.roles.includes(", tone: "ident" },
        { text: "\"release\"", tone: "string" },
        { text: ");", tone: "punct" },
      ],
    },
    {
      lineNumber: 5,
      indent: 1,
      tokens: [{ text: "} }", tone: "punct" }],
    },
    {
      lineNumber: 6,
      indent: 1,
      tokens: [
        { text: "return ", tone: "keyword" },
        { text: "false", tone: "type" },
        { text: ";", tone: "punct" },
      ],
    },
    {
      lineNumber: 7,
      tokens: [{ text: "}", tone: "punct" }],
    },
  ],
  afterLines: [
    {
      lineNumber: 1,
      tokens: [
        { text: "export function ", tone: "keyword" },
        { text: "canDeploy", tone: "ident" },
        { text: "(u?: ", tone: "punct" },
        { text: "User", tone: "type" },
        { text: ", env?: ", tone: "punct" },
        { text: "Env", tone: "type" },
        { text: "): ", tone: "punct" },
        { text: "boolean", tone: "type" },
        { text: " {", tone: "punct" },
      ],
    },
    {
      lineNumber: 2,
      indent: 1,
      highlight: "added",
      tokens: [
        { text: "if ", tone: "keyword" },
        { text: "(!u?.active || env?.locked) ", tone: "ident" },
        { text: "return ", tone: "keyword" },
        { text: "false", tone: "type" },
        { text: ";", tone: "punct" },
      ],
    },
    {
      lineNumber: 3,
      indent: 1,
      highlight: "added",
      tokens: [
        { text: "return ", tone: "keyword" },
        { text: "u.roles.includes(", tone: "ident" },
        { text: "\"release\"", tone: "string" },
        { text: ");", tone: "punct" },
      ],
    },
    {
      lineNumber: 4,
      tokens: [{ text: "}", tone: "punct" }],
    },
  ],
};

export const CONNECTED_WORKFLOW_STAGES: ConnectedWorkflowStage[] = [
  {
    id: "plan",
    stepNumber: "01",
    title: "Plan",
    artifact: "spec.contract.ts",
    statusLabel: "REQUIREMENTS MAPPED",
    summary:
      "Define architectural boundaries, target languages, and schema invariants before writing implementation code.",
    detailPreview: "invariants: [\"idempotent_write\", \"strict_schema\"]",
    linkedCapability: "Links to Code Understanding",
  },
  {
    id: "implement",
    stepNumber: "02",
    title: "Implement",
    artifact: "validate-record.ts",
    statusLabel: "COMPONENT SYNTHESIZED",
    summary:
      "Generate structured, idiomatic modules that adhere to the project's existing type definitions and conventions.",
    detailPreview: "export function parseTelemetry(raw: unknown): Result<...>",
    linkedCapability: "Links to Code Generation",
  },
  {
    id: "debug",
    stepNumber: "03",
    title: "Debug",
    artifact: "cursor-store.diff",
    statusLabel: "CAUSE ISOLATED",
    summary:
      "Inspect stack traces alongside component relationships to isolate edge-case failures and evaluate guard clauses.",
    detailPreview: "+ const offset = checkpoint?.nextOffset ?? 0;",
    linkedCapability: "Links to Debugging",
  },
  {
    id: "refine",
    stepNumber: "04",
    title: "Refine",
    artifact: "evaluate-access.ts",
    statusLabel: "STRUCTURE SIMPLIFIED",
    summary:
      "Simplify control flow and adapt verified logic across Python, TypeScript, and Rust modules without losing context.",
    detailPreview: "if (!u?.active || env?.locked) return false;",
    linkedCapability: "Links to Refactoring & Cross-Language",
  },
];
