# Contratos iniciales

**Versión:** 0.1.0 — Fase 0.

| Objeto | Propósito | Autoridad | Ciclo de vida |
|---|---|---|---|
| Case | Expediente y objetivo explícito | prometeo-caso | draft → in_review → confirmed → calculated → reported |
| SourceDocument / SourceFragment | Material normalizado y localizable | prometeo-ingesta | draft → normalized o blocked/error |
| Proposition | Proposición con modalidad conservada | prometeo-lenguaje | proposed → accepted/rejected |
| SemanticCandidate | Actor, evento, condición o relación candidata | prometeo-lenguaje | proposed → accepted/rejected |
| Hypothesis | Alternativa de candidatos y relaciones | lenguaje + revisión humana | proposed → selected/rejected |
| AnalystDecision | Registro de promoción, rechazo o edición | humano | registrada e inmutable |
| ConfirmedModel | Estructura semántica formal confirmada | prometeo-caso | confirmed → superseded |
| MotorRequest | Parámetros matemáticos explícitos | prometeo-proyeccion | creado desde ConfirmedModel |
| CalculationTrace / MotorResult | Operaciones y resultado reproducible | prometeo-motor-calculo | calculated |
| ReportModel | Informe trazable posterior al cálculo | prometeo-informe | reported |

## Invariantes

- Una propuesta lingüística nunca es un hecho confirmado.
- Todo modelo confirmado lista las decisiones humanas que lo producen.
- Todo `MotorRequest` identifica modelo y versión; no contiene lenguaje natural.
- Todo `MotorResult` referencia una `CalculationTrace`.
- El informe distingue fuente, propuesta, decisión, derivación, cálculo e interpretación.
- Las modificaciones producen nuevas versiones; no sobrescriben silenciosamente el pasado.

Este repositorio no interpreta documentos, selecciona hipótesis, calcula magnitudes ni redacta informes.
