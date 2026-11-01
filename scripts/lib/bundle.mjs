// Resolves the multi-document schema set into self-contained documents.
//
// Source schemas reference each other by absolute identifier, either to a
// definition or to a whole document:
//   { "$ref": "urn:olb:v1:common#/$defs/uuid" }
//   { "$ref": "urn:olb:v1:realtime" }        // not used today, supported anyway
//
// A published schema must be usable on its own, so every external reference is
// rewritten to a local one and the referenced content is copied into the root
// `$defs` table. Whole-document imports are namespaced (`Event__Envelope`) so
// that their internal references keep resolving inside the copy instead of
// colliding with the root document's definitions.

import fs from "node:fs/promises";
import path from "node:path";

export async function loadRegistry(schemaDir) {
  const files = (await fs.readdir(schemaDir)).filter((f) => f.endsWith(".schema.json"));
  const registry = new Map();

  for (const file of files) {
    const doc = JSON.parse(await fs.readFile(path.join(schemaDir, file), "utf8"));
    if (typeof doc.$id !== "string") {
      throw new Error(`${file}: missing $id`);
    }
    if (registry.has(doc.$id)) {
      throw new Error(`${file}: duplicate $id ${doc.$id}`);
    }
    registry.set(doc.$id, doc);
  }

  return registry;
}

const DEF_POINTER = /^\/\$defs\/([A-Za-z0-9_-]+)$/;

function aliasFor(doc) {
  const title = doc.title ?? "Anonymous";
  return title.replace(/[^A-Za-z0-9]/g, "");
}

export function bundle(registry, rootId) {
  const source = registry.get(rootId);
  if (!source) throw new Error(`unknown schema id: ${rootId}`);

  const root = structuredClone(source);
  root.$defs ??= {};

  const origin = new Map(); // local def name -> source doc id
  const pending = [];
  const scheduled = new Set();

  const schedule = (docId, name) => {
    if (name in root.$defs) return;
    const key = `${docId}#${name}`;
    if (scheduled.has(key)) return;
    scheduled.add(key);
    pending.push({ kind: "def", docId, name, key });
  };

  const rewrite = (node, ownerId, prefix = "") => {
    if (Array.isArray(node)) return node.map((item) => rewrite(item, ownerId, prefix));

    if (node && typeof node === "object") {
      if (typeof node.$ref === "string") {
        const ref = node.$ref;

        if (ref.startsWith("#")) {
          const match = DEF_POINTER.exec(ref.slice(1));
          if (match && prefix) return { $ref: `#/$defs/${prefix}${match[1]}` };
          return node;
        }

        const hash = ref.indexOf("#");
        const docId = hash === -1 ? ref : ref.slice(0, hash);
        const pointer = hash === -1 ? "" : ref.slice(hash + 1);
        const targetDoc = registry.get(docId);
        if (!targetDoc) throw new Error(`${ownerId}: unknown document ${docId}`);

        if (pointer === "") {
          const alias = aliasFor(targetDoc);
          if (!(alias in root.$defs)) {
            const key = `${docId}#`;
            if (!scheduled.has(key)) {
              scheduled.add(key);
              pending.push({ kind: "doc", docId, alias, key });
            }
          }
          return { $ref: `#/$defs/${alias}` };
        }

        const match = DEF_POINTER.exec(pointer);
        if (!match) throw new Error(`${ownerId}: unsupported external reference ${ref}`);

        const name = match[1];
        if (!targetDoc.$defs?.[name]) throw new Error(`${docId}: unknown definition ${name}`);
        if (origin.has(name) && origin.get(name) !== docId) {
          throw new Error(
            `definition name collision for "${name}": ${origin.get(name)} and ${docId}`,
          );
        }
        origin.set(name, docId);
        schedule(docId, name);
        return { $ref: `#/$defs/${name}` };
      }

      const out = {};
      for (const [key, value] of Object.entries(node)) {
        out[key] = rewrite(value, ownerId, prefix);
      }
      return out;
    }

    return node;
  };

  const result = rewrite(root, rootId);

  while (pending.length > 0) {
    const item = pending.pop();

    if (item.kind === "def") {
      if (item.name in result.$defs) continue;
      const definition = structuredClone(registry.get(item.docId).$defs[item.name]);
      result.$defs[item.name] = rewrite(definition, item.docId);
      continue;
    }

    // Whole-document import: copy the document root and its definitions under
    // a namespace so that internal references stay inside the copy.
    const doc = registry.get(item.docId);
    const prefix = `${item.alias}__`;
    for (const [name, definition] of Object.entries(doc.$defs ?? {})) {
      const namespaced = prefix + name;
      if (namespaced in result.$defs) continue;
      result.$defs[namespaced] = rewrite(
        structuredClone(definition),
        item.docId,
        prefix,
      );
    }
    const { $id, $schema, $defs, title, description, ...body } = doc;
    result.$defs[item.alias] = {
      ...rewrite(structuredClone(body), item.docId, prefix),
      title: title ?? item.alias,
      ...(description ? { description } : {}),
    };
  }

  // Keep the definitions table readable and diff-friendly.
  const ordered = {};
  for (const key of Object.keys(result.$defs).sort()) {
    ordered[key] = result.$defs[key];
  }
  result.$defs = ordered;

  return result;
}
