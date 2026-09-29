import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(fs.readFileSync(path.join(root, "schemas/prometeo.schema.json"), "utf8"));
const fixtureNames = [
  "domain-legal.json",
  "domain-organizational.json",
  "domain-emotional.json",
  "domain-technical.json",
  "domain-institutional.json",
];

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = (name, value, fixtureName) => {
  const validator = ajv.compile({
    $schema: schema.$schema,
    $defs: schema.$defs,
    $ref: "#/$defs/" + name,
  });
  assert.equal(validator(value), true, fixtureName + " / " + name + ": " + ajv.errorsText(validator.errors));
};

for (const fixtureName of fixtureNames) {
  const fixture = JSON.parse(fs.readFileSync(path.join(root, "tests/fixtures", fixtureName), "utf8"));
  for (const name of ["Case", "Proposition", "SemanticCandidate", "Hypothesis", "AnalystDecision", "ConfirmedModel"]) {
    const key = {
      Case: "case",
      Proposition: "proposition",
      SemanticCandidate: "candidate",
      Hypothesis: "hypothesis",
      AnalystDecision: "decision",
      ConfirmedModel: "model",
    }[name];
    validate(name, fixture[key], fixtureName);
  }
  assert.equal(fixture.proposition.state, "proposed");
  assert.equal(fixture.candidate.state, "proposed");
  assert.equal(fixture.model.state, "confirmed");
  assert.equal(fixture.model.provenance.kind, "human");
}

const purposes = fixtureNames.map((name) => JSON.parse(
  fs.readFileSync(path.join(root, "tests/fixtures", name), "utf8"),
).case.purpose);
assert.equal(new Set(purposes).size, fixtureNames.length);

console.log("PASS: cinco dominios heterogéneos validan prometeocontracts@0.2.0");
