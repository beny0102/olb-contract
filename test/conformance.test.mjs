import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const ROOT = path.resolve(import.meta.dirname, "..");
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), "utf8"));

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

for (const name of ["event", "track", "realtime"]) {
  ajv.addSchema(readJson(`dist/schema/${name}.schema.json`));
}

const validators = {
  event: ajv.getSchema("urn:olb:v1:event"),
  track: ajv.getSchema("urn:olb:v1:track"),
  realtime: ajv.getSchema("urn:olb:v1:realtime"),
};

const manifest = readJson("fixtures/manifest.json");

for (const { file, schema } of manifest.valid) {
  test(`accepts ${file}`, () => {
    const document = readJson(`fixtures/valid/${file}`);
    const validate = validators[schema];
    assert.ok(validate(document), JSON.stringify(validate.errors, null, 2));
  });
}

for (const { file, schema } of manifest.invalid) {
  test(`rejects ${file}`, () => {
    const document = readJson(`fixtures/invalid/${file}`);
    assert.equal(validators[schema](document), false);
  });
}

// Whitepaper 5.8, rule 4: a consumer from contract 1.0 must accept a payload
// produced by a later minor version that added fields.
for (const { file, schema } of manifest.forward) {
  test(`accepts forward-compatible ${file}`, () => {
    const document = readJson(`fixtures/forward/${file}`);
    const validate = validators[schema];
    assert.ok(validate(document), JSON.stringify(validate.errors, null, 2));
  });
}

test("rejects an event whose contract version is unknown", () => {
  const document = readJson("fixtures/valid/event-pitch-human.json");
  document.contract = "olb.event/2";
  assert.equal(validators.event(document), false);
});
