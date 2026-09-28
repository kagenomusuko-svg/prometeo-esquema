# Auditoría de interfaz con prometeо-motor-calculo

**Fecha:** 2026-09-28  
**Estado:** auditoría inicial, sin modificación del motor.

## Interfaz observada

El endpoint actual del motor recibe:

```json
{
  "formula": "string",
  "data": "object",
  "discipline": "string opcional"
}
```

La implementación actual ejecuta `Calculation().calculate(formula, data)` y añade `taxonomy_id` y `taxonomy_name` a la respuesta.

## Diferencia con el contrato Prometeo

`MotorRequest` exige además:

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

La API actual no demuestra todavía todos esos campos como contrato externo.

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

El adaptador tendrá que conservar la relación entre ambos contratos y fallar si no puede reconstruir una traza o una proveniencia suficiente.

## Próxima auditoría

Auditar las fórmulas y la estructura real de la traza del motor antes de implementar el adaptador. Hasta entonces, ningún consumidor debe afirmar que la integración ya es compatible.
