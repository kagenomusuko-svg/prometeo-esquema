# prometeo-esquema

Contratos normativos compartidos del ecosistema Prometeo.

No contiene lógica de negocio, interpretación lingüística ni cálculos. Define objetos, estados, proveniencia y fronteras de autoridad para los repositorios consumidores.

## Contenido

- `schemas/prometeo.schema.json`: JSON Schema canónico.
- `contracts/manifest.json`: identidad, versión y compatibilidad del contrato.
- `src/index.ts`: tipos compartidos.
- `docs/CONTRACTOS_INICIALES.md`: reglas y ciclo de vida.
- `docs/VALIDACION_SCHEMA.md`: validación ejecutable Draft 2020-12.
- `tests/`: fixtures y gates contractuales.

La versión del contrato se incrementa cuando cambian sus obligaciones o la forma normativa de los objetos. Las islas consumidoras deben fijar explícitamente la versión que esperan.

```bash
npm install
npm test
```
