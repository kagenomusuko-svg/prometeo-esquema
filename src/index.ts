/** Tipos normativos; no contiene inferencia, promoción ni cálculo. */
export type Id = string;
export type Modality = "asserted"|"reported"|"inferred"|"possible"|"obligatory"|"denied"|"unknown";
export type ProvenanceKind = "source"|"language-agent"|"human"|"deterministic-system"|"prometeo-motor-calculo";
export interface Provenance { kind: ProvenanceKind; actorId: Id; recordedAt: string; sourceObjectId?: Id; sourceVersion?: string; reason?: string; }
export interface SourceSpan { start: number; end: number; unit: "character"|"token"|"line"; }
export interface SourceFragment { id: Id; documentId: Id; ordinal: number; text: string; span: SourceSpan; locator: Record<string, unknown>; hash: string; provenance: Provenance; }
export interface SourceDocument { id: Id; caseId: Id; mediaType: string; originalText: string; contentHash: string; fragments: SourceFragment[]; state: "draft"|"normalized"|"blocked"|"error"; warnings: string[]; provenance: Provenance; }
export interface Proposition { id: Id; fragmentId: Id; text: string; modality: Modality; state: "proposed"|"accepted"|"rejected"; provenance: Provenance; }
export interface SemanticCandidate { id: Id; propositionId: Id; category: "actor"|"event"|"state"|"condition"|"relation"|"omission"; label: string; attributes: Record<string, unknown>; confidence?: number; ambiguity?: string[]; state: "proposed"|"accepted"|"rejected"; provenance: Provenance; }
export interface Hypothesis { id: Id; caseId: Id; label: string; candidateIds: Id[]; relationIds: Id[]; status: "proposed"|"selected"|"rejected"|"superseded"; provenance: Provenance; }
export interface AnalystDecision { id: Id; caseId: Id; action: "accept"|"reject"|"modify"|"split"|"merge"|"confirm"; targetObjectId: Id; previousVersion: string; resultingObjectId: Id; resultingVersion: string; decidedBy: Id; decidedAt: string; reason: string; provenance: Provenance; }
export interface ConfirmedModel { id: Id; caseId: Id; version: string; nodes: unknown[]; relations: unknown[]; decisions: Id[]; state: "confirmed"|"superseded"; provenance: Provenance; }
export interface MotorRequest { id: Id; modelId: Id; modelVersion: string; formulaId: string; formulaVersion: string; parameters: Record<string, unknown>; discipline: string; createdBy: Id; createdAt: string; provenance: Provenance; }
export interface CalculationTrace { id: Id; requestId: Id; steps: unknown[]; reproducibilityHash: string; provenance: Provenance; }
export interface MotorResult { id: Id; requestId: Id; formulaId: string; formulaVersion: string; inputs: Record<string, unknown>; result: Record<string, unknown>; traceId: Id; motorVersion: string; calculatedAt: string; provenance: Provenance; }
export interface ContextReference { id: Id; category: string; locator: Record<string, unknown> | null; evidenceStatus: string; mapVersion: string; sourceRef: string; }
export interface ReportModel { id: Id; caseId: Id; modelId: Id; motorResultId: Id; contextReferences: ContextReference[]; sections: unknown[]; generatedAt: string; provenance: Provenance; }
export interface Case { id: Id; title: string; purpose: string; state: "draft"|"in_review"|"confirmed"|"calculated"|"reported"|"closed"; sourceDocumentIds: Id[]; hypothesisIds: Id[]; confirmedModelIds: Id[]; decisionIds: Id[]; version: string; createdAt: string; updatedAt: string; provenance: Provenance; }
