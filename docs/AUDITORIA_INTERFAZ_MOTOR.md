# Auditoría de interfaz con prometeo-motor-calculo

**Fecha:** 2026-09-28  
**Estado:** auditoría inicial, sin modificación del motor.

## Interfaz observada

El endpoint actual recibe:

```json
{
  "formula": "string",
  "data": "object",
  "discipline": "string opcional"
}
```

La implementación ejecuta:

```text
Calculation().calculate(formula, data)
```

y añade `taxonomy_id` y `taxonomy_name` a la respuesta HTTP.

La salida directa del núcleo de cálculo tiene esta forma:

```json
{
  "formula": "string",
  "inputs": "objeto recibido",
  "result": "valor calculado",
  "trace": "lista de pasos"
}
```

## Forma real de la traza

Los pasos ordinarios contienen:

```json
{
  "step": 1,
  "operation": "subtract",
  "inputs": {"a": "...", "b": "..."},
  "result": "..."
}
```

Según la fórmula, pueden añadir:

- `formula`;
- `index`;
- `segment`;
- campos específicos de la operación;
- resultados booleanos;
- valores exactos representados como fracción.

La traza no tiene actualmente un identificador propio ni una versión del motor dentro de su payload.

## Exactitud numérica

El motor convierte los valores a `Fraction` o `Decimal`.

- Las fracciones se serializan como `{ "numerator": n, "denominator": d }`.
- Los decimales se serializan como cadenas.
- Los `float` JSON se rechazan para preservar exactitud.
- La entrada `data` es explícita; el motor no interpreta lenguaje natural ni completa valores ausentes.

## Familias de fórmulas observadas

La implementación contiene, entre otras, fórmulas para:

- diferencias y valores netos: `delta`, `rnet`, `delta_net`;
- normalización y distribución: `rstar`, `rstar_simple`, `allocation`;
- intervalos: `delta_interval`, `rnet_interval`, `rstar_interval`;
- integrales y acumulaciones: `ego_integral_piecewise_constant`, `alpha_integral_piecewise_constant`, `discrete_integral`;
- matrices y grafos: `weight_matrix`, `rstar`, `r0`;
- robustez, sustitución y contrafactuales;
- fórmulas de dominios específicos;
- operaciones de probabilidad, información y similitud.

La fórmula es seleccionada por un identificador textual y sus parámetros por claves de `data`. El catálogo completo debe convertirse posteriormente en un registro versionado del motor, no en reglas duplicadas dentro de `prometeo-esquema`.

## Diferencia con el contrato Prometeo

`MotorRequest` exige:

- identificador de solicitud;
- identificador y versión del `ConfirmedModel`;
- identificador y versión de fórmula;
- parámetros explícitos;
- disciplina;
- productor;
- fecha;
- proveniencia.

`MotorResult` exige:

- referencia a la solicitud;
- fórmula y versión;
- entradas;
- resultado;
- identificador de `CalculationTrace`;
- versión del motor;
- fecha de cálculo;
- proveniencia.

La API actual no demuestra todavía esos campos como contrato externo.

## Decisión arquitectónica

No se modifica `prometeo-esquema` para imitar la interfaz heredada y no se copia el cálculo aquí.

La adaptación deberá vivir en `prometeo-puente` o en el límite explícito de `prometeo-proyeccion`:

```text
MotorRequest normativo
        ↓
adaptador explícito y trazable
        ↓
{ formula, data, discipline }
        ↓
prometeo-motor-calculo
        ↓
adaptador de respuesta
        ↓
MotorResult normativo
```

El adaptador tendrá que:

1. verificar que `modelId` y `modelVersion` corresponden al modelo confirmado;
2. traducir parámetros a `data` sin inventar valores;
3. conservar la fórmula exacta y su versión;
4. incorporar la traza real sin alterar sus pasos;
5. asignar `traceId`, `motorVersion` y proveniencia;
6. fallar si no puede reconstruir alguno de esos vínculos;
7. preservar fracciones y cadenas decimales sin convertirlas a `float`.

Hasta que exista ese adaptador, ningún consumidor debe afirmar que la integración ya es compatible.
