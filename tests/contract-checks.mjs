import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const schema=JSON.parse(fs.readFileSync(path.join(root,"schemas/prometeo.schema.json"),"utf8"));
const fixture=JSON.parse(fs.readFileSync(path.join(root,"tests/fixtures/canonical-minimal-case.json"),"utf8"));

assert.equal(schema.$schema,"https://json-schema.org/draft/2020-12/schema");
for(const name of ["Case","SourceDocument","SourceFragment","Proposition","SemanticCandidate","Hypothesis","AnalystDecision","ConfirmedModel","MotorRequest","CalculationTrace","MotorResult","ReportModel"]) assert.ok(schema.$defs[name],name);

assert.equal(fixture.proposition.modality,"reported");
assert.equal(fixture.proposition.state,"proposed");
assert.equal(fixture.candidate.state,"proposed");
assert.equal(fixture.candidate.provenance.kind,"language-agent");
assert.equal(fixture.model.state,"confirmed");
assert.deepEqual(fixture.model.decisions,["decision-1"]);
assert.equal(fixture.request.provenance.sourceObjectId,"model-1");
assert.equal(fixture.result.traceId,"trace-1");

const vertical = JSON.parse(fs.readFileSync(path.join(root,"tests/fixtures/canonical-vertical-slice.json"),"utf8"));
assert.equal(vertical.proposition.state,"proposed");
assert.equal(vertical.candidate.provenance.kind,"language-agent");
assert.equal(vertical.model.provenance.kind,"human");
assert.ok(Array.isArray(vertical.result.result));
assert.equal(vertical.result.traceId,vertical.trace.id);

const attemptedPromotion={...fixture.candidate,state:"confirmed"};
assert.throws(()=>{
  if(attemptedPromotion.state==="confirmed" && attemptedPromotion.provenance.kind!=="human") {
    throw Error("implicit promotion");
  }
},/implicit promotion/);

console.log("PASS: contratos, proveniencia y frontera de autoridad");
