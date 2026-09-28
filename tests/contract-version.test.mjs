import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "contracts/manifest.json"), "utf8"));
const schema = JSON.parse(fs.readFileSync(path.join(root, manifest.schemaPath), "utf8"));

assert.equal(packageJson.version, manifest.contractVersion);
assert.equal(manifest.contractId, "prometeo-contracts");
assert.equal(manifest.schemaDialect, schema.$schema);
assert.equal(manifest.sourceRepository, "kagenomusuko-svg/prometeo-esquema");
assert.equal(manifest.compatibility.supersedes, "0.1.x");
assert.ok(manifest.compatibility.breakingChanges.length > 0);

console.log("PASS: versión contractual y compatibilidad identificables");
