import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(fs.readFileSync(path.join(root, "schemas/prometeo.schema.json"), "utf8"));
const fixtures = [
  JSON.parse(fs.readFileSync(path.join(root, "tests/fixtures/canonical-minimal-case.json"), "utf8")),
  JSON.parse(fs.readFileSync(path.join(root, "tests/fixtures/canonical-vertical-slice.json"), "utf8")),
];

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const contractNames = {
  case: "Case",
  sourceDocument: "SourceDocument",
  proposition: "Proposition",
  candidate: "SemanticCandidate",
  hypothesis: "Hypothesis",
  decision: "AnalystDecision",
  model: "ConfirmedModel",
  request: "MotorRequest",
  trace: "CalculationTrace",
  result: "MotorResult",
  report: "ReportModel",
};
const validators = new Map(
  [...Object.values(contractNames), "ContextReference"].map((name) => [
    name,
    ajv.compile({ $schema: schema.$schema, $defs: schema.$defs, $ref: "#/$defs/" + name }),
  ]),
);

function validate(name, value, fixtureName) {
  const validator = validators.get(name);
  assert.ok(validator, name);
  assert.equal(validator(value), true, fixtureName + " / " + name + ": " + ajv.errorsText(validator.errors));
}

for (const [index, fixture] of fixtures.entries()) {
  const fixtureName = "fixture-" + (index + 1);
  for (const [field, name] of Object.entries(contractNames)) {
    if (fixture[field] !== undefined) validate(name, fixture[field], fixtureName);
  }
  if (fixture.report?.contextReferences) {
    for (const reference of fixture.report.contextReferences) {
      validate("ContextReference", reference, fixtureName);
    }
  }
}

console.log("PASS: JSON Schema canónico valida contratos y vertical slice");
