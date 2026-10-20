export type WorkflowStepId = "describe" | "understand" | "generate" | "refine";

export type WorkflowLanguageId = "typescript" | "python" | "rust" | "go";

export interface WorkflowStepMeta {
  id: WorkflowStepId;
  number: string;
  marker: string;
  title: string;
  summary: string;
  detail: string;
  workspaceFocus: string;
}

export interface LanguageWorkspaceSpec {
  id: WorkflowLanguageId;
  name: string;
  shortTag: string;
  runtimeLabel: string;
  fileName: string;
  defaultPrompt: string;
  refinementPrompt: string;
  understandContext: {
    architectureNote: string;
    dependencies: string[];
    invariants: string[];
    proposedApproach: string[];
  };
  generateCode: string;
  refineCode: string;
  explanation: {
    headline: string;
    summary: string;
    decisions: {
      label: string;
      detail: string;
    }[];
  };
  validationOutput: {
    describe: string[];
    understand: string[];
    generate: string[];
    refine: string[];
  };
}

export interface PromptPreset {
  id: string;
  label: string;
  prompt: string;
}

export const WORKFLOW_STEPS: WorkflowStepMeta[] = [
  {
    id: "describe",
    number: "01",
    marker: "01 — DESCRIBE",
    title: "01 — Describe",
    summary: "Provide a requirement in natural language.",
    detail:
      'Example: "Create an API endpoint that validates incoming user data and stores records in MongoDB."',
    workspaceFocus: "User Request Panel & Prompt Specification",
  },
  {
    id: "understand",
    number: "02",
    marker: "02 — UNDERSTAND",
    title: "02 — Understand",
    summary:
      "Review the requirements and relevant code context to identify an appropriate approach.",
    detail:
      "Inspect schema boundaries, dependency graphs, and architectural invariants before code generation.",
    workspaceFocus: "Context Graph & Proposed Architecture",
  },
  {
    id: "generate",
    number: "03",
    marker: "03 — GENERATE",
    title: "03 — Generate",
    summary:
      "Explore a proposed implementation with syntax highlighting and a concise explanation.",
    detail:
      "Synthesize idiomatic, type-safe implementation code tailored to the selected runtime.",
    workspaceFocus: "Central Code Editor & Implementation Details",
  },
  {
    id: "refine",
    number: "04",
    marker: "04 — REFINE",
    title: "04 — Refine",
    summary: "Review the result, request changes, and continue iterating.",
    detail:
      "Harden edge cases, enforce idempotency keys, and verify structured validation output.",
    workspaceFocus: "Iterative Hardening & Validation Telemetry",
  },
];

export const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: "mongodb-endpoint",
    label: "MongoDB User Endpoint",
    prompt:
      "Create an API endpoint that validates incoming user data and stores records in MongoDB.",
  },
  {
    id: "event-ingestion",
    label: "Idempotent Webhook Ingestion",
    prompt:
      "Validate signed webhook payloads, enforce idempotency keys, and persist audit records in MongoDB.",
  },
  {
    id: "tenant-query",
    label: "Scoped Multi-Tenant Store",
    prompt:
      "Build a tenant-scoped repository handler that validates user records before inserting into MongoDB.",
  },
];

export const WORKFLOW_LANGUAGES: Record<
  WorkflowLanguageId,
  LanguageWorkspaceSpec
> = {
  typescript: {
    id: "typescript",
    name: "TypeScript",
    shortTag: "TS",
    runtimeLabel: "Node.js 20 · Strict TS",
    fileName: "src/routes/users.endpoint.ts",
    defaultPrompt:
      "Create an API endpoint that validates incoming user data and stores records in MongoDB.",
    refinementPrompt:
      "Enforce unique email index handling, normalize timestamps in UTC, and return structured RFC 7807 validation errors.",
    understandContext: {
      architectureNote:
        "Maps incoming HTTP JSON body through a strict Zod schema allow-list before executing a parameterized MongoDB collection insertOne operation.",
      dependencies: [
        "zod@3.24 (Schema Validation)",
        "mongodb@6.12 (Collection Driver)",
        "src/lib/db/mongo.ts (Connection Pool)",
      ],
      invariants: [
        "Reject unknown payload keys via .strict()",
        "Normalize email to lowercase + trim before persistence",
        "Never expose internal database driver stack traces",
      ],
      proposedApproach: [
        "Define UserCreateSchema with explicit field caps and role enum",
        "Parse request payload and return 422 with field-level diagnostics on failure",
        "Insert validated document into users collection with UTC createdAt metadata",
      ],
    },
    generateCode: `import { z } from "zod";
import { Collection, Db } from "mongodb";

export const UserCreateSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
    fullName: z.string().trim().min(2).max(120),
    role: z.enum(["developer", "architect", "viewer"]).default("developer"),
    orgId: z.string().trim().min(3).max(64),
  })
  .strict();

export type UserRecord = z.infer<typeof UserCreateSchema> & {
  createdAt: Date;
};

export async function createUserEndpoint(
  db: Db,
  rawPayload: unknown
): Promise<{ status: number; body: Record<string, unknown> }> {
  const parsed = UserCreateSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return {
      status: 422,
      body: { error: "VALIDATION_FAILED", issues: parsed.error.flatten() },
    };
  }

  const users: Collection<UserRecord> = db.collection("users");
  const record: UserRecord = { ...parsed.data, createdAt: new Date() };
  const result = await users.insertOne(record);

  return {
    status: 201,
    body: { id: result.insertedId.toHexString(), email: record.email },
  };
}`,
    refineCode: `import { z } from "zod";
import { Collection, Db, MongoServerError } from "mongodb";

export const UserCreateSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
    fullName: z.string().trim().min(2).max(120),
    role: z.enum(["developer", "architect", "viewer"]).default("developer"),
    orgId: z.string().trim().min(3).max(64),
    idempotencyKey: z.string().uuid(),
  })
  .strict();

export type UserRecord = z.infer<typeof UserCreateSchema> & {
  createdAt: string;
};

export async function createUserEndpoint(
  db: Db,
  rawPayload: unknown
): Promise<{ status: number; body: Record<string, unknown> }> {
  const parsed = UserCreateSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return {
      status: 422,
      body: {
        type: "https://veltrix.dev/errors/validation",
        title: "Invalid user payload",
        issues: parsed.error.flatten().fieldErrors,
      },
    };
  }

  const users: Collection<UserRecord> = db.collection("users");
  const record: UserRecord = {
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };

  try {
    const result = await users.updateOne(
      { orgId: record.orgId, idempotencyKey: record.idempotencyKey },
      { $setOnInsert: record },
      { upsert: true }
    );
    return {
      status: result.upsertedCount > 0 ? 201 : 200,
      body: {
        idempotent: result.upsertedCount === 0,
        email: record.email,
        createdAt: record.createdAt,
      },
    };
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      return { status: 409, body: { error: "DUPLICATE_USER_EMAIL" } };
    }
    throw err;
  }
}`,
    explanation: {
      headline: "Strict Schema Boundary & Typed MongoDB Persistence",
      summary:
        "Enforces compile-time and runtime contract parity using Zod .strict() validation before touching the MongoDB collection handle.",
      decisions: [
        {
          label: "Input Allow-Listing",
          detail:
            "Rejects undeclared fields and trims/lowercases email addresses at the boundary so downstream queries stay canonical.",
        },
        {
          label: "Parameterized Driver Operations",
          detail:
            "Uses typed Collection<UserRecord> methods without string interpolation to prevent NoSQL operator injection.",
        },
        {
          label: "Refinement: Idempotent Upsert",
          detail:
            "Step 04 upgrades insertOne to an org-scoped $setOnInsert upsert with duplicate-key (E11000) conflict recovery.",
        },
      ],
    },
    validationOutput: {
      describe: [
        "[INTENT PARSED] Target: HTTP Endpoint -> Schema Validation -> MongoDB Persistence",
        "[LANGUAGE] TypeScript (Node.js 20 · Strict Type Checking enabled)",
        "[STATUS] Ready to inspect architectural approach in Step 02.",
      ],
      understand: [
        "[CONTEXT GRAPH] Linked 3 modules: zod schema, mongodb collection, tenant boundary",
        "[SECURITY CHECK] Strict key allow-list verified; NoSQL injection surface = 0",
        "[APPROACH READY] Proceed to Step 03 Generate to synthesize endpoint.",
      ],
      generate: [
        "[BUILD PREVIEW] tsc --noEmit · 0 errors · UserCreateSchema inferred cleanly",
        "[SCHEMA TEST] Valid payload -> 201 Created { id: '65f1...9a2c', email: 'dev@veltrix.io' }",
        "[BOUNDARY TEST] Unknown field '__proto__' -> 422 VALIDATION_FAILED (Rejected)",
      ],
      refine: [
        "[REFINEMENT APPLIED] Added UUID idempotencyKey + E11000 duplicate index guard",
        "[IDEMPOTENCY TEST] Replay request with same key -> 200 OK (idempotent: true)",
        "[VERIFIED] Simulated workspace check passed across all 3 invariants.",
      ],
    },
  },
  python: {
    id: "python",
    name: "Python",
    shortTag: "PY",
    runtimeLabel: "Python 3.12 · Pydantic v2",
    fileName: "app/endpoints/users_endpoint.py",
    defaultPrompt:
      "Create an API endpoint that validates incoming user data and stores records in MongoDB.",
    refinementPrompt:
      "Add idempotent upsert semantics on (org_id, idempotency_key) and catch PyMongo DuplicateKeyError cleanly.",
    understandContext: {
      architectureNote:
        "Uses Pydantic v2 ConfigDict(extra='forbid') for deterministic validation before persisting via Motor async MongoDB collection.",
      dependencies: [
        "pydantic>=2.9 (Strict Data Models)",
        "motor>=3.6 (AsyncIO MongoDB Driver)",
        "app/db/mongo.py (Async Database Client)",
      ],
      invariants: [
        "Forbid undeclared fields via extra='forbid'",
        "Normalize email and validate length constraints",
        "Return structured status and payload dictionary",
      ],
      proposedApproach: [
        "Declare UserCreatePayload(BaseModel) with strict field validators",
        "Validate raw dict input and capture ValidationError diagnostics",
        "Persist normalized document asynchronously into db.users",
      ],
    },
    generateCode: `from datetime import datetime, timezone
from typing import Any, Literal
from pydantic import BaseModel, ConfigDict, EmailStr, Field, ValidationError
from motor.motor_asyncio import AsyncIOMotorDatabase

class UserCreatePayload(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)
    role: Literal["developer", "architect", "viewer"] = "developer"
    org_id: str = Field(min_length=3, max_length=64)

async def create_user_endpoint(
    db: AsyncIOMotorDatabase,
    raw_payload: dict[str, Any],
) -> tuple[int, dict[str, Any]]:
    try:
        validated = UserCreatePayload.model_validate(raw_payload)
    except ValidationError as exc:
        return 422, {"error": "VALIDATION_FAILED", "issues": exc.errors()}

    doc = validated.model_dump()
    doc["email"] = doc["email"].lower()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()

    result = await db.users.insert_one(doc)
    return 201, {"id": str(result.inserted_id), "email": doc["email"]}`,
    refineCode: `from datetime import datetime, timezone
from typing import Any, Literal
from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, Field, ValidationError
from pymongo.errors import DuplicateKeyError
from motor.motor_asyncio import AsyncIOMotorDatabase

class UserCreatePayload(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)
    role: Literal["developer", "architect", "viewer"] = "developer"
    org_id: str = Field(min_length=3, max_length=64)
    idempotency_key: UUID

async def create_user_endpoint(
    db: AsyncIOMotorDatabase,
    raw_payload: dict[str, Any],
) -> tuple[int, dict[str, Any]]:
    try:
        validated = UserCreatePayload.model_validate(raw_payload)
    except ValidationError as exc:
        return 422, {"error": "VALIDATION_FAILED", "issues": exc.errors()}

    doc = validated.model_dump(mode="json")
    doc["email"] = doc["email"].lower()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()

    try:
        result = await db.users.update_one(
            {"org_id": doc["org_id"], "idempotency_key": doc["idempotency_key"]},
            {"$setOnInsert": doc},
            upsert=True,
        )
        status = 201 if result.upserted_id is not None else 200
        return status, {
            "idempotent": result.upserted_id is None,
            "email": doc["email"],
            "created_at": doc["created_at"],
        }
    except DuplicateKeyError:
        return 409, {"error": "DUPLICATE_USER_EMAIL"}`,
    explanation: {
      headline: "Pydantic v2 Strict Models & Async Motor Persistence",
      summary:
        "Combines Pydantic v2 zero-overhead Rust validators with asynchronous Motor collection operations for predictable Python backend throughput.",
      decisions: [
        {
          label: "Extra Field Rejection",
          detail:
            "ConfigDict(extra='forbid') guarantees mass-assignment attempts fail immediately before reaching MongoDB.",
        },
        {
          label: "Timezone-Aware UTC Serialization",
          detail:
            "Stores ISO-8601 UTC timestamps explicitly using datetime.now(timezone.utc) to avoid naive timestamp drift.",
        },
        {
          label: "Refinement: Atomic Upsert & Conflict Handling",
          detail:
            "Step 04 introduces UUID idempotency keys and catches DuplicateKeyError to return deterministic 409 responses.",
        },
      ],
    },
    validationOutput: {
      describe: [
        "[INTENT PARSED] Target: Async Python Endpoint -> Pydantic v2 -> MongoDB Motor",
        "[LANGUAGE] Python 3.12 (Type Hints + Pydantic Rust Core)",
        "[STATUS] Ready to inspect architectural approach in Step 02.",
      ],
      understand: [
        "[CONTEXT GRAPH] Linked Pydantic BaseModel, AsyncIOMotorDatabase, UTC serializer",
        "[SECURITY CHECK] extra='forbid' active; whitespace stripping enabled",
        "[APPROACH READY] Proceed to Step 03 Generate to synthesize Python module.",
      ],
      generate: [
        "[BUILD PREVIEW] mypy --strict · 0 issues · UserCreatePayload validated",
        "[SCHEMA TEST] Valid payload -> (201, {'id': '65f1...9a2c', 'email': 'dev@veltrix.io'})",
        "[BOUNDARY TEST] Invalid email format -> 422 VALIDATION_FAILED",
      ],
      refine: [
        "[REFINEMENT APPLIED] Added UUID idempotency_key + DuplicateKeyError guard",
        "[IDEMPOTENCY TEST] Retry with identical UUID -> (200, {'idempotent': True})",
        "[VERIFIED] Simulated workspace check passed across all 3 invariants.",
      ],
    },
  },
  rust: {
    id: "rust",
    name: "Rust",
    shortTag: "RS",
    runtimeLabel: "Rust 1.84 · Serde + MongoDB",
    fileName: "src/handlers/users_endpoint.rs",
    defaultPrompt:
      "Create an API endpoint that validates incoming user data and stores records in MongoDB.",
    refinementPrompt:
      "Enforce idempotent BSON upsert by (org_id, idempotency_key) and map duplicate key errors to Conflict.",
    understandContext: {
      architectureNote:
        "Deserializes incoming JSON with #[serde(deny_unknown_fields)] and validates invariants before inserting a typed BSON document.",
      dependencies: [
        "serde@1.0 (Zero-Copy Deserialization)",
        "mongodb@3.1 (Typed Collection<UserDoc>)",
        "chrono@0.4 (UTC Timestamp Serialization)",
      ],
      invariants: [
        "Compile-time #[serde(deny_unknown_fields)] enforcement",
        "Explicit email format and length verification without regex backtracking",
        "Zero-cost ownership transfer into MongoDB BSON encoder",
      ],
      proposedApproach: [
        "Define UserCreateInput with Serde deny_unknown_fields attribute",
        "Run deterministic domain validation returning Result<UserDoc, ApiError>",
        "Execute typed collection.insert_one(doc) with BSON ObjectId response",
      ],
    },
    generateCode: `use chrono::{DateTime, Utc};
use mongodb::{bson::oid::ObjectId, Collection, Database};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct UserCreateInput {
    pub email: String,
    pub full_name: String,
    pub role: String,
    pub org_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserDoc {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub email: String,
    pub full_name: String,
    pub role: String,
    pub org_id: String,
    pub created_at: DateTime<Utc>,
}

pub async fn create_user_endpoint(
    db: &Database,
    input: UserCreateInput,
) -> Result<String, &'static str> {
    let email = input.email.trim().to_ascii_lowercase();
    if !email.contains('@') || email.len() > 254 {
        return Err("INVALID_EMAIL");
    }
    if input.full_name.trim().len() < 2 || input.org_id.trim().len() < 3 {
        return Err("INVALID_FIELD_LENGTH");
    }

    let users: Collection<UserDoc> = db.collection("users");
    let doc = UserDoc {
        id: None,
        email,
        full_name: input.full_name.trim().to_string(),
        role: input.role,
        org_id: input.org_id,
        created_at: Utc::now(),
    };

    let res = users.insert_one(doc).await.map_err(|_| "DB_WRITE_ERROR")?;
    Ok(res.inserted_id.to_string())
}`,
    refineCode: `use chrono::{DateTime, Utc};
use mongodb::{
    bson::{doc, to_bson},
    options::UpdateOptions,
    Collection, Database,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct UserCreateInput {
    pub email: String,
    pub full_name: String,
    pub role: String,
    pub org_id: String,
    pub idempotency_key: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserDoc {
    pub email: String,
    pub full_name: String,
    pub role: String,
    pub org_id: String,
    pub idempotency_key: String,
    pub created_at: DateTime<Utc>,
}

pub async fn create_user_endpoint(
    db: &Database,
    input: UserCreateInput,
) -> Result<(u16, String), &'static str> {
    let email = input.email.trim().to_ascii_lowercase();
    if !email.contains('@') || email.len() > 254 {
        return Err("INVALID_EMAIL");
    }
    if input.idempotency_key.len() < 16 || input.org_id.trim().len() < 3 {
        return Err("INVALID_IDEMPOTENCY_SCOPE");
    }

    let users: Collection<UserDoc> = db.collection("users");
    let record = UserDoc {
        email: email.clone(),
        full_name: input.full_name.trim().to_string(),
        role: input.role,
        org_id: input.org_id.clone(),
        idempotency_key: input.idempotency_key.clone(),
        created_at: Utc::now(),
    };

    let filter = doc! { "org_id": &record.org_id, "idempotency_key": &record.idempotency_key };
    let update = doc! { "$setOnInsert": to_bson(&record).map_err(|_| "BSON_ENCODE_ERR")? };
    let opts = UpdateOptions::builder().upsert(true).build();

    let res = users.update_one(filter, update).with_options(opts).await.map_err(|_| "DB_CONFLICT")?;
    let status = if res.upserted_id.is_some() { 201 } else { 200 };
    Ok((status, email))
}`,
    explanation: {
      headline: "Zero-Cost Serde Contracts & Typed BSON Storage",
      summary:
        "Leverages Rust's type system and Serde attributes to reject malformed payloads during deserialization before allocating BSON documents.",
      decisions: [
        {
          label: "Compile-Time Deserialization Guards",
          detail:
            "#[serde(deny_unknown_fields)] rejects unexpected JSON keys at zero runtime reflection cost.",
        },
        {
          label: "Explicit Error Propagation",
          detail:
            "Returns deterministic Result types without panicking or leaking driver internals to callers.",
        },
        {
          label: "Refinement: Scoped BSON Upsert",
          detail:
            "Step 04 builds a typed BSON filter on (org_id, idempotency_key) with UpdateOptions::builder().upsert(true).",
        },
      ],
    },
    validationOutput: {
      describe: [
        "[INTENT PARSED] Target: Rust Handler -> Serde + Domain Check -> MongoDB BSON",
        "[LANGUAGE] Rust 1.84 (Ownership & Borrow Checker verified)",
        "[STATUS] Ready to inspect architectural approach in Step 02.",
      ],
      understand: [
        "[CONTEXT GRAPH] Linked serde::Deserialize, mongodb::Collection<UserDoc>, chrono::Utc",
        "[SECURITY CHECK] #[serde(deny_unknown_fields)] active; linear-time validation",
        "[APPROACH READY] Proceed to Step 03 Generate to synthesize Rust handler.",
      ],
      generate: [
        "[BUILD PREVIEW] cargo check --all-targets · 0 warnings · 0 errors",
        "[SCHEMA TEST] Valid UserCreateInput -> Ok(ObjectId('65f1...9a2c'))",
        "[BOUNDARY TEST] Empty org_id -> Err('INVALID_FIELD_LENGTH')",
      ],
      refine: [
        "[REFINEMENT APPLIED] Added idempotency_key + $setOnInsert BSON upsert",
        "[IDEMPOTENCY TEST] Duplicate delivery -> Ok((200, 'dev@veltrix.io'))",
        "[VERIFIED] Simulated workspace check passed across all 3 invariants.",
      ],
    },
  },
  go: {
    id: "go",
    name: "Go",
    shortTag: "GO",
    runtimeLabel: "Go 1.23 · mongo-driver v2",
    fileName: "internal/users/endpoint.go",
    defaultPrompt:
      "Create an API endpoint that validates incoming user data and stores records in MongoDB.",
    refinementPrompt:
      "Add context timeout deadline, DisallowUnknownFields decoder, and idempotent MongoDB UpdateOne upsert.",
    understandContext: {
      architectureNote:
        "Decodes request streams with json.Decoder.DisallowUnknownFields() and executes context-bounded MongoDB collection writes.",
      dependencies: [
        "encoding/json (Strict Stream Decoder)",
        "go.mongodb.org/mongo-driver/v2/mongo",
        "context (Bounded Request Deadlines)",
      ],
      invariants: [
        "Enforce json.Decoder.DisallowUnknownFields()",
        "Bound database operations with context.WithTimeout",
        "Normalize email strings and verify required tenant scope",
      ],
      proposedApproach: [
        "Decode JSON body strictly into UserCreateRequest struct",
        "Validate email, fullName, and orgId constraints explicitly",
        "Insert UserDocument into MongoDB with context cancellation support",
      ],
    },
    generateCode: `package users

import (
	"context"
	"errors"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type UserCreateRequest struct {
	Email    string \`json:"email"\`
	FullName string \`json:"fullName"\`
	Role     string \`json:"role"\`
	OrgID    string \`json:"orgId"\`
}

type UserDocument struct {
	ID        bson.ObjectID \`bson:"_id,omitempty"\`
	Email     string        \`bson:"email"\`
	FullName  string        \`bson:"full_name"\`
	Role      string        \`bson:"role"\`
	OrgID     string        \`bson:"org_id"\`
	CreatedAt time.Time     \`bson:"created_at"\`
}

func CreateUserEndpoint(ctx context.Context, db *mongo.Database, req UserCreateRequest) (string, error) {
	email := strings.ToLower(strings.TrimSpace(req.Email))
	if !strings.Contains(email, "@") || len(email) > 254 {
		return "", errors.New("invalid email address")
	}
	if len(strings.TrimSpace(req.FullName)) < 2 || len(strings.TrimSpace(req.OrgID)) < 3 {
		return "", errors.New("missing required user or org fields")
	}

	doc := UserDocument{
		Email:     email,
		FullName:  strings.TrimSpace(req.FullName),
		Role:      req.Role,
		OrgID:     strings.TrimSpace(req.OrgID),
		CreatedAt: time.Now().UTC(),
	}

	res, err := db.Collection("users").InsertOne(ctx, doc)
	if err != nil {
		return "", err
	}
	oid, _ := res.InsertedID.(bson.ObjectID)
	return oid.Hex(), nil
}`,
    refineCode: `package users

import (
	"context"
	"errors"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type UserCreateRequest struct {
	Email          string \`json:"email"\`
	FullName       string \`json:"fullName"\`
	Role           string \`json:"role"\`
	OrgID          string \`json:"orgId"\`
	IdempotencyKey string \`json:"idempotencyKey"\`
}

func CreateUserEndpoint(ctx context.Context, db *mongo.Database, req UserCreateRequest) (int, error) {
	writeCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	email := strings.ToLower(strings.TrimSpace(req.Email))
	if !strings.Contains(email, "@") || len(req.IdempotencyKey) < 16 {
		return 422, errors.New("validation failed: email or idempotencyKey invalid")
	}

	filter := bson.M{
		"org_id":          strings.TrimSpace(req.OrgID),
		"idempotency_key": strings.TrimSpace(req.IdempotencyKey),
	}
	update := bson.M{
		"$setOnInsert": bson.M{
			"email":      email,
			"full_name":  strings.TrimSpace(req.FullName),
			"role":       req.Role,
			"created_at": time.Now().UTC(),
		},
	}

	res, err := db.Collection("users").UpdateOne(writeCtx, filter, update, options.UpdateOne().SetUpsert(true))
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return 409, errors.New("duplicate user email")
		}
		return 500, err
	}
	if res.UpsertedCount > 0 {
		return 201, nil
	}
	return 200, nil
}`,
    explanation: {
      headline: "Context-Bounded Go Handler & BSON Upsert",
      summary:
        "Writes explicit, allocation-light Go service logic with strict struct tags, UTC normalization, and bounded context deadlines.",
      decisions: [
        {
          label: "Explicit Field Normalization",
          detail:
            "Trims and lowercases identifiers before building the BSON document so index lookups remain deterministic.",
        },
        {
          label: "Context Propagation",
          detail:
            "Threads context.Context directly into mongo.Collection operations for clean cancellation and tracing.",
        },
        {
          label: "Refinement: 3s Write Deadline & Duplicate Detection",
          detail:
            "Step 04 wraps the upsert in context.WithTimeout(ctx, 3*time.Second) and checks mongo.IsDuplicateKeyError(err).",
        },
      ],
    },
    validationOutput: {
      describe: [
        "[INTENT PARSED] Target: Go Package Handler -> Struct Validation -> MongoDB v2",
        "[LANGUAGE] Go 1.23 (Explicit error handling & context propagation)",
        "[STATUS] Ready to inspect architectural approach in Step 02.",
      ],
      understand: [
        "[CONTEXT GRAPH] Linked internal/users, mongo.Database, bson.ObjectID",
        "[SECURITY CHECK] Explicit BSON keys; zero dynamic query concatenation",
        "[APPROACH READY] Proceed to Step 03 Generate to synthesize Go implementation.",
      ],
      generate: [
        "[BUILD PREVIEW] go vet ./... && go build ./... · 0 errors",
        "[SCHEMA TEST] Valid UserCreateRequest -> '65f1a8c2e4b09a2c110042f1', nil",
        "[BOUNDARY TEST] Missing OrgID -> error: 'missing required user or org fields'",
      ],
      refine: [
        "[REFINEMENT APPLIED] Added 3s context timeout + SetUpsert(true) + IsDuplicateKeyError",
        "[IDEMPOTENCY TEST] Replayed request -> status 200, nil",
        "[VERIFIED] Simulated workspace check passed across all 3 invariants.",
      ],
    },
  },
};

export const WORKFLOW_LANGUAGE_LIST: LanguageWorkspaceSpec[] = [
  WORKFLOW_LANGUAGES.typescript,
  WORKFLOW_LANGUAGES.python,
  WORKFLOW_LANGUAGES.rust,
  WORKFLOW_LANGUAGES.go,
];
