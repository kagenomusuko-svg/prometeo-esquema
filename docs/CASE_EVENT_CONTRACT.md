# Contrato de CaseEvent

`CaseEvent` registra una transición ya autorizada dentro del expediente.

La función del evento es probatoria y cronológica. No decide, no promueve y no sustituye a `AnalystDecision`.

Campos obligatorios:

- objeto afectado;
- estado y versión anterior;
- acción;
- estado y versión resultante;
- fecha;
- motivo;
- proveniencia;
- secuencia dentro del caso.

Para una sustitución versionada, `previousObjectId` identifica explícitamente el objeto anterior. Es opcional en la primera creación o cuando una misma identidad conserva sus versiones.

La secuencia debe ser creciente y no puede mezclar eventos de casos distintos.