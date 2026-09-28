import { strict as assert } from "node:assert";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import schema from "../schemas/prometeo.schema.json" with { type: "json" };

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
ajv.addSchema(schema);

function assertValid(definition, value) {
  const validate = ajv.compile({ $ref: schema.$id + "#/$defs/" + definition });
  assert.equal(validate(value), true, definition + " debe aceptar la forma runtime");
}

const provenance = {
  kind: "human",
  actorId: "analyst-001",
  recordedAt: "2026-09-28T17:40:00Z",
  reason: "Confirmed by analyst",
};

assertValid("Hypothesis", {
  id: "hypothesis-001",
  caseId: "case-001",
  label: "H1",
  candidateIds: [],
  relationIds: [],
  status: "proposed",
  provenance: { ...provenance, kind: "language-agent", actorId: "prometeo-lenguaje" },
});

assertValid("ConfirmedModel", {
  id: "model-001",
  caseId: "case-001",
  version: "1.0.0",
  nodes: [],
  relations: [],
  decisions: ["decision-001"],
  state: "confirmed",
  provenance,
  history: {
    previousModelId: null,
    previousModelVersion: "0.0.0",
    decisionId: "decision-001",
  },
});

assertValid("MotorResult", {
  id: "result-001",
  requestId: "request-001",
  formulaId: "formula-001",
  formulaVersion: "1.0.0",
  inputs: { value: 1 },
  result: [{ numerator: 1, denominator: 1 }],
  traceId: "trace-001",
  motorVersion: "0.1.0",
  calculatedAt: "2026-09-28T17:40:00Z",
  provenance: { ...provenance, kind: "prometeo-motor-calculo", actorId: "prometeo-motor-calculo" },
});

console.log("PASS: formas runtime de lenguaje, caso y motor cumplen el esquema");
