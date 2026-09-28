import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(fs.readFileSync(path.join(root, "schemas/prometeo.schema.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "contracts/manifest.json"), "utf8"));
const fixture = JSON.parse(fs.readFileSync(path.join(root, "tests/fixtures/canonical-vertical-slice.json"), "utf8"));

assert.equal(manifest.contractVersion, "0.2.0");
assert.equal(manifest.compatibility.supersedes, "0.1.x");
assert.ok(manifest.compatibility.breakingChanges.length >= 2);

const report = schema.$defs.ReportModel;
for (const field of ["id", "caseId", "modelId", "motorResultId", "contextReferences", "sections", "generatedAt", "provenance"]) {
  assert.ok(report.required.includes(field), "ReportModel required field: " + field);
}
assert.deepEqual(report.properties.contextReferences.items, { $ref: "#/$defs/ContextReference" });

const context = schema.$defs.ContextReference;
assert.deepEqual(context.required, ["id", "category", "locator", "evidenceStatus", "mapVersion", "sourceRef"]);
assert.equal(context.additionalProperties, false);

const motorResult = schema.$defs.MotorResult.properties.result;
assert.deepEqual(motorResult.oneOf, [{ type: "object" }, { type: "array" }]);

assert.equal(fixture.contract.contractVersion, manifest.contractVersion);
assert.deepEqual(
  fixture.report.contextReferences,
  fixture.report.sections.find((section) => section.id === "context").references,
);

console.log("PASS: regresión contractual protege versión 0.2.0 y fronteras del vertical slice");
