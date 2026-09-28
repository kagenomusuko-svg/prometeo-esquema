import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chain = JSON.parse(
  fs.readFileSync(path.join(root, "tests/fixtures/canonical-vertical-slice.json"), "utf8"),
);

function required(object, fields, name) {
  for (const field of fields) {
    assert.ok(Object.hasOwn(object, field), name + "." + field);
  }
}

required(chain.sourceDocument, [
  "id", "caseId", "mediaType", "originalText", "contentHash",
  "fragments", "state", "warnings", "provenance",
], "SourceDocument");
required(chain.sourceDocument.fragments[0], [
  "id", "documentId", "ordinal", "text", "span", "locator", "hash", "provenance",
], "SourceFragment");
required(chain.proposition, [
  "id", "fragmentId", "text", "modality", "state", "provenance",
], "Proposition");
required(chain.candidate, [
  "id", "propositionId", "category", "label", "attributes", "state", "provenance",
], "SemanticCandidate");
required(chain.hypothesis, [
  "id", "caseId", "label", "candidateIds", "relationIds", "status", "provenance",
], "Hypothesis");
required(chain.decision, [
  "id", "caseId", "action", "targetObjectId", "previousVersion",
  "resultingObjectId", "resultingVersion", "decidedBy", "decidedAt",
  "reason", "provenance",
], "AnalystDecision");
required(chain.model, [
  "id", "caseId", "version", "nodes", "relations", "decisions", "state", "provenance",
], "ConfirmedModel");
required(chain.request, [
  "id", "modelId", "modelVersion", "formulaId", "formulaVersion",
  "parameters", "discipline", "createdBy", "createdAt", "provenance",
], "MotorRequest");
required(chain.trace, [
  "id", "requestId", "steps", "reproducibilityHash", "provenance",
], "CalculationTrace");
required(chain.report, [
  "id", "caseId", "modelId", "motorResultId", "contextReferences", "sections", "generatedAt", "provenance",
], "ReportModel");
required(chain.result, [
  "id", "requestId", "formulaId", "formulaVersion", "inputs", "result",
  "traceId", "motorVersion", "calculatedAt", "provenance",
], "MotorResult");

assert.equal(chain.contract.contractId, "prometeo-contracts");
assert.equal(chain.contract.contractVersion, "0.2.0");
assert.equal(chain.contract.sourceRepository, "kagenomusuko-svg/prometeo-esquema");
assert.equal(chain.contract.manifestRef, "contracts/manifest.json@0.2.0");
assert.equal(chain.sourceDocument.state, "normalized");
assert.equal(chain.proposition.state, "proposed");
assert.equal(chain.candidate.state, "proposed");
assert.equal(chain.hypothesis.status, "proposed");
assert.equal(chain.decision.provenance.kind, "human");
assert.equal(chain.model.provenance.kind, "human");
assert.equal(chain.request.provenance.sourceObjectId, chain.model.id);
assert.equal(chain.trace.requestId, chain.request.id);
assert.equal(chain.result.requestId, chain.request.id);
assert.equal(chain.result.traceId, chain.trace.id);
assert.ok(Array.isArray(chain.result.result));
assert.equal(chain.report.caseId, chain.sourceDocument.caseId);
assert.equal(chain.report.modelId, chain.model.id);
assert.equal(chain.report.motorResultId, chain.result.id);
assert.equal(chain.report.contextReferences[0].sourceRef, "kagenomusuko-svg/Paradigma@map-commit");
assert.deepEqual(chain.report.sections.find((section) => section.id === "context").references, chain.report.contextReferences);
assert.equal(chain.report.provenance.sourceObjectId, chain.result.id);
assert.deepEqual(chain.report.sections.map((section) => section.id).slice(0, 5), ["source", "proposals", "decision", "model", "context"]);
assert.equal(chain.report.sections.find((section) => section.id === "context").references[0].sourceRef, "kagenomusuko-svg/Paradigma@map-commit");

console.log("PASS: gate transversal de contratos Prometeo");
