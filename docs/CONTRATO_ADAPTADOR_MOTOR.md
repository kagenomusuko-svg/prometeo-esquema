# Contrato del adaptador hacia el motor

**Versión:** 0.1.0  
**Estado:** diseño contractual de Fase 0  
**Implementación prevista:** `prometeo-proyeccion` + `prometeo-puente`

## Propósito

Definir la transformación explícita entre el contrato normativo de Prometeo y la interfaz actual de `prometeo-motor-calculo`.

Este documento no implementa el adaptador ni duplica fórmulas.

## Entrada normativa

El adaptador recibe un `MotorRequest` válido:

- `id`;
- `modelId`;
- `modelVersion`;
- `formulaId`;
- `formulaVersion`;
- `parameters`;
- `discipline`;
- productor, fecha y proveniencia.

El adaptador debe rechazar la entrada si:

- el modelo no está confirmado;
- falta la versión del modelo;
- falta la versión de la fórmula;
- los parámetros contienen valores no serializables;
- la proveniencia no identifica al objeto de origen.

## Solicitud heredada

La traducción al endpoint actual es:

| MotorRequest | API actual |
|---|---|
| `formulaId` | `formula` |
| `parameters` | `data` |
| `discipline` | `discipline` |
| `modelId`, `modelVersion` | correlación y auditoría externa |
| `formulaVersion` | metadato de auditoría externa |

No se permite:

- cambiar la fórmula;
- completar parámetros ausentes;
- convertir fracciones exactas a `float`;
- enviar lenguaje natural al motor;
- confundir la disciplina con una conclusión causal.

## Respuesta heredada

La respuesta directa del motor:

```json
{
  "formula": "...",
  "inputs": {},
  "result": {},
  "trace": []
}
```

debe envolverse como `MotorResult`:

| Respuesta actual | MotorResult |
|---|---|
| `formula` | `formulaId` |
| `inputs` | `inputs` |
| `result` | `result` |
| `trace` | `CalculationTrace.steps` |
| identificador generado por el adaptador | `traceId` |
| versión declarada del despliegue | `motorVersion` |
| solicitud original | `requestId` y proveniencia |

El adaptador debe fallar si no puede obtener una versión verificable del motor. No debe inventar `motorVersion`.

## Cálculo del identificador de traza

`traceId` puede derivarse mediante un hash determinista de:

- `requestId`;
- `formulaId`;
- `formulaVersion`;
- entrada exacta;
- traza exacta.

El hash identifica la traza; no modifica sus pasos ni sustituye la autoridad del motor.

## Preservación de exactitud

Los valores deben mantenerse en las representaciones aceptadas por el motor:

- fracciones como numerador y denominador;
- decimales como cadenas;
- booleanos como booleanos;
- vectores y matrices sin aplanamiento semántico.

Toda conversión que pierda exactitud debe producir error explícito.

## Responsabilidad por repositorio

- `prometeo-esquema`: define los contratos.
- `prometeo-proyeccion`: convierte el modelo confirmado en parámetros matemáticos.
- `prometeo-puente`: coordina la llamada, correlación, errores y versiones.
- `prometeo-motor-calculo`: calcula y produce la traza matemática.
- `prometeo-informe`: comunica el resultado sin modificarlo.

## Pruebas mínimas del futuro adaptador

1. Traducción exacta de fórmula, parámetros y disciplina.
2. Rechazo de modelo no confirmado.
3. Rechazo de parámetros ausentes.
4. Rechazo de `float` cuando comprometa exactitud.
5. Conservación de la traza completa.
6. Rechazo de respuesta sin versión del motor.
7. Correspondencia entre `requestId`, `traceId` y `MotorResult`.
8. Reproducibilidad con el mismo `MotorRequest`.
9. Propagación explícita de errores del motor.
10. Ausencia de fórmulas duplicadas fuera del motor.
