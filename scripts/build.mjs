// Builds the distributable artifacts from the JSON Schema source of truth:
//   dist/schema/*.schema.json   self-contained schemas
//   generated/ts/*.d.ts        TypeScript types
//   generated/python/olb_contract/{event,track,realtime}.py  Pydantic models
//
// Generated output is committed. CI re-runs this script and fails on a diff,
// so the published types cannot drift from the schemas.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { compile } from "json-schema-to-typescript";
import { bundle, loadRegistry } from "./lib/bundle.mjs";

const execFileP = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SCHEMA_DIR = path.join(ROOT, "schema");
const DIST_DIR = path.join(ROOT, "dist", "schema");
const TS_DIR = path.join(ROOT, "generated", "ts");
const PY_DIR = path.join(ROOT, "generated", "python", "olb_contract");
const PY_SCHEMA_DIR = path.join(PY_DIR, "schemas");

const ROOTS = [
  { name: "event", id: "urn:olb:v1:event", language: "both" },
  { name: "track", id: "urn:olb:v1:track", language: "both" },
  { name: "realtime", id: "urn:olb:v1:realtime", language: "both" },
];

const GENERATED_HEADER =
  "GENERATED FILE - do not edit.\nSource: schema/*.schema.json. Rebuild with `npm run build`.\n";

async function findCodegen() {
  try {
    await execFileP("datamodel-codegen", ["--version"]);
    return (...args) => execFileP("datamodel-codegen", args);
  } catch {
    await execFileP("uv", [
      "tool",
      "run",
      "--from",
      "datamodel-code-generator",
      "datamodel-codegen",
      "--version",
    ]);
    return (...args) =>
      execFileP("uv", [
        "tool",
        "run",
        "--from",
        "datamodel-code-generator",
        "datamodel-codegen",
        ...args,
      ]);
  }
}

async function write(file, contents) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, contents, "utf8");
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function main() {
  const registry = await loadRegistry(SCHEMA_DIR);
  await fs.rm(DIST_DIR, { recursive: true, force: true });
  await fs.mkdir(DIST_DIR, { recursive: true });
  await fs.mkdir(TS_DIR, { recursive: true });
  await fs.mkdir(PY_DIR, { recursive: true });

  const codegen = await findCodegen();

  for (const entry of ROOTS) {
    const bundled = bundle(registry, entry.id);
    const schemaPath = path.join(DIST_DIR, `${entry.name}.schema.json`);
    await write(schemaPath, json(bundled));

    // TypeScript
    const types = await compile(bundled, bundled.title ?? entry.name, {
      bannerComment: `/*\n * ${GENERATED_HEADER.replace(/\n/g, "\n * ")} */`,
      style: { singleQuote: false, bracketSpacing: true },
      enableConstEnums: true,
      format: true,
    });
    await write(path.join(TS_DIR, `${entry.name}.d.ts`), types);

    // Python
    await codegen(
      "--input",
      schemaPath,
      "--input-file-type",
      "jsonschema",
      "--output",
      path.join(PY_DIR, `${entry.name}.py`),
      "--output-model-type",
      "pydantic_v2.BaseModel",
      "--target-python-version",
      "3.11",
      "--class-name",
      bundled.title ?? entry.name,
      "--use-title-as-name",
      "--use-standard-collections",
      "--use-union-operator",
      "--use-schema-description",
      "--field-constraints",
      "--disable-timestamp",
    );

    const pyFile = path.join(PY_DIR, `${entry.name}.py`);
    const body = await fs.readFile(pyFile, "utf8");
    await write(pyFile, `# ${GENERATED_HEADER.replace(/\n/g, "\n# ")}\n${body}`);

    // Python packages carry their own copy of the schemas so that runtime
    // validation does not depend on a filesystem layout outside the wheel.
    await write(path.join(PY_SCHEMA_DIR, `${entry.name}.schema.json`), json(bundled));
  }

  await write(path.join(PY_DIR, "__init__.py"), pythonIndex());

  const bundleOnly = bundle(registry, "urn:olb:v1:common");
  await write(path.join(DIST_DIR, "common.schema.json"), json(bundleOnly));
  await write(path.join(PY_SCHEMA_DIR, "common.schema.json"), json(bundleOnly));

  console.log(`built ${ROOTS.length} schemas into dist/, generated/ts/, generated/python/`);
}

function pythonIndex() {
  return `# ${GENERATED_HEADER.replace(/\n/g, "\n# ")}
"""Typed models and runtime validation for the Open League Baseball contract."""

from __future__ import annotations

import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker

from .event import Event
from .realtime import RealtimeMessage
from .track import Track

__all__ = [
    "Event",
    "Track",
    "RealtimeMessage",
    "SCHEMA_VERSION",
    "load_schema",
    "validate",
    "parse_event",
]

SCHEMA_VERSION = "1"

_SCHEMA_DIR = Path(__file__).parent / "schemas"
_VALIDATORS: dict[str, Draft202012Validator] = {}


def load_schema(name: str = "event") -> dict:
    """Load one of the bundled, self-contained schemas: event, track, realtime, common."""
    path = _SCHEMA_DIR / f"{name}.schema.json"
    if not path.is_file():
        raise FileNotFoundError(f"unknown schema: {name}")
    return json.loads(path.read_text(encoding="utf-8"))


def validate(document: dict, schema: str = "event") -> None:
    """Raise jsonschema.ValidationError if the document does not match the wire contract."""
    validator = _VALIDATORS.get(schema)
    if validator is None:
        validator = Draft202012Validator(load_schema(schema), format_checker=FormatChecker())
        _VALIDATORS[schema] = validator
    validator.validate(document)


def parse_event(document: dict):
    """Validate and return the typed event union member."""
    validate(document, "event")
    return Event.model_validate(document).root
`;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
