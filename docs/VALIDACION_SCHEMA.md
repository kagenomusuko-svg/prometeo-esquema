# Validación contractual con JSON Schema

`prometeo-esquema` valida los objetos normativos con JSON Schema Draft 2020-12 mediante Ajv.

El gate `tests/schema-validation.mjs`:

- compila las definiciones del esquema canónico;
- valida los objetos presentes en los fixtures mínimo y vertical;
- valida explícitamente cada `ContextReference`;
- no promueve propuestas ni calcula resultados.

La validación es contractual: el esquema describe la forma y los estados permitidos, mientras que las autoridades de lenguaje, decisión humana, proyección y cálculo permanecen en sus repositorios respectivos.

Para ejecutar el conjunto completo:

```bash
npm install
npm test
```
