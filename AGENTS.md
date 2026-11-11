# AGENTS.md — Instrucciones obligatorias para asistentes de IA

> **Lee este archivo completo antes de inspeccionar, editar, crear, borrar, confirmar o publicar cualquier cambio en este repositorio.**
> Estas reglas aplican a ChatGPT, Claude, Copilot, Gemini, agentes de programación y cualquier herramienta automatizada.

## 1. Objetivo y prioridad

Este archivo define el procedimiento seguro de trabajo para mantener este proyecto de Google Apps Script. Antes de actuar:

1. Lee este archivo.
2. Revisa el estado actual del repositorio, la rama activa, los últimos commits y los cambios pendientes.
3. Lee el `README.md`, `DEPLOY_GITHUB_ACTIONS.md`, `CONFIGURACION_SEGURIDAD.md` y los archivos fuente relevantes que existan.
4. Comprueba el workflow vigente en `.github/workflows/`; no asumas que estas instrucciones sustituyen su configuración real.
5. Explica brevemente el plan y el alcance antes de ejecutar cambios que puedan afectar comportamiento, datos o despliegues.

Si una instrucción de este archivo contradice una petición explícita posterior del propietario, señala el conflicto y solicita confirmación antes de continuar. Nunca interpretes una petición de revisión como autorización para publicar.

## 2. Repositorio y ramas protegidas

- Repositorio: `PedroNoeMata/Remainder_AI_bot`.
- Rama de trabajo conocida: `fix/seguridad-telegram`.
- Rama estable: `main`.
- Respaldo del código original: `backup/original-2026-11-11`.
- Pull request de trabajo conocido: PR #1, desde `fix/seguridad-telegram` hacia `main`.

Reglas:

- No borres, sobrescribas ni reescribas la rama `backup/original-2026-11-11`.
- No hagas force-push, reset destructivo, rebase destructivo ni eliminación de ramas.
- No hagas merge del PR #1 ni de otro PR sin autorización explícita.
- No publiques cambios funcionales directamente en `main`; trabaja en una rama de desarrollo y propón un PR, salvo autorización explícita del propietario.
- Antes de editar, confirma la rama y el SHA actual. Si la rama o el estado no coinciden con lo esperado, detente y consulta.
- No asumas que los nombres de ramas, archivos o IDs siguen vigentes: verifica el estado real en GitHub.

## 3. Despliegue automático: advertencia crítica

El workflow `.github/workflows/deploy-apps-script.yml` está configurado para desplegar automáticamente cuando se hace `push` a `fix/seguridad-telegram`.

- Un commit que llegue a `fix/seguridad-telegram` puede iniciar GitHub Actions y ejecutar `clasp push --force`.
- `clasp push --force` sincroniza y puede sobrescribir archivos del proyecto remoto de Google Apps Script.
- Por tanto, **hacer commit directamente en esa rama o actualizar archivos allí mediante la API de GitHub puede provocar un despliegue real**.
- No hagas push, commit directo, actualización de archivos en la rama de despliegue ni ejecutes el workflow manual sin autorización explícita para publicar esos cambios.
- Para preparar cambios sin desplegarlos, utiliza una rama nueva que no esté incluida en los disparadores del workflow y abre un Pull Request.
- Después de una publicación autorizada, revisa el run de Actions y confirma el resultado. No afirmes que se desplegó si no hay evidencia de un run exitoso.
- El workflow actual sincroniza el código fuente; no necesariamente crea una versión numerada ni actualiza una implementación de Web App. Verifica el proceso antes de afirmar lo contrario.

## 4. Seguridad y secretos

- Nunca escribas, imprimas, registres, copies a documentación ni confirmes tokens, contraseñas, claves API, cookies, credenciales OAuth o datos privados.
- Nunca agregues `.clasprc.json`, archivos de credenciales ni secretos a Git.
- La autenticación de GitHub Actions usa el secreto del repositorio `CLASPRC_JSON`. No solicites al propietario que pegue su contenido en el chat.
- Las credenciales de Telegram deben leerse desde **Apps Script → Project Settings → Script Properties** mediante las funciones auxiliares existentes.
- Las propiedades esperadas por la implementación actual son `TELEGRAM_TOKEN` y `TELEGRAM_CHAT_ID`. Verifica las referencias en el código; nunca incluyas sus valores en archivos fuente.
- No restaures credenciales antiguas desde commits, respaldos o historial. Si una credencial pudo quedar expuesta, recomienda revocarla y sustituirla por una nueva.
- No cambies nombres de Script Properties ni el mecanismo de autenticación sin revisar todos sus consumidores y documentar una migración segura.
- No elimines protecciones, validaciones o controles de acceso para hacer que una prueba pase.

## 5. Reglas para modificar Google Apps Script

- Inspecciona las dependencias entre archivos `.js`; Apps Script comparte el ámbito global entre archivos del mismo proyecto.
- Antes de añadir o renombrar funciones globales, busca colisiones y referencias en todo el proyecto.
- Conserva los nombres, parámetros, contratos de retorno y efectos secundarios de las funciones públicas, salvo que el cambio requiera explícitamente modificarlos.
- Revisa cuidadosamente `appsscript.json`, zonas horarias, scopes OAuth, triggers instalables y configuración de runtime antes de cambiarlos.
- Evita duplicar funciones, constantes o helpers globales.
- No cambies IDs de hojas, nombres de pestañas, encabezados, rangos, fórmulas, estructura de datos ni destinos de Telegram sin verificar sus consumidores.
- Mantén separada la lógica de negocio de los mecanismos de envío y configuración cuando sea posible.
- No introduzcas dependencias externas sin justificar compatibilidad, seguridad y mantenimiento.

## 6. Procedimiento obligatorio de cambio

Para cada solicitud:

1. **Diagnóstico:** identifica archivos y funciones implicados; revisa el código completo relevante y las llamadas relacionadas.
2. **Plan:** describe el problema, la solución propuesta, los riesgos y los archivos que cambiarían.
3. **Respaldo:** confirma que el estado previo está disponible en Git. No sustituyas el respaldo histórico.
4. **Cambio mínimo:** modifica solo lo necesario. Evita refactorizaciones no solicitadas.
5. **Revisión:** inspecciona el diff completo; busca secretos, cambios accidentales, duplicados, referencias rotas y efectos colaterales.
6. **Pruebas:** ejecuta las validaciones disponibles y agrega pruebas cuando sea viable. No simules una prueba real de Google Sheets o Telegram si solo se usaron mocks.
7. **Reporte:** indica archivos cambiados, comportamiento afectado, pruebas ejecutadas, limitaciones y si el cambio está publicado o solo preparado.
8. **Publicación:** solicita autorización explícita antes de cualquier commit/push a la rama de despliegue o ejecución manual del workflow.

## 7. Validaciones mínimas

Cuando aplique, verifica:

- Todos los archivos JavaScript modificados compilan o pasan una validación sintáctica.
- `appsscript.json` es JSON válido.
- No existen definiciones globales duplicadas de funciones activas.
- No hay tokens ni credenciales literales en los archivos fuente o documentación.
- Las referencias a helpers y funciones renombradas están actualizadas.
- El diff no contiene cambios no relacionados.
- Los tests distinguen claramente entre mocks y llamadas reales a servicios externos.

Si una prueba requiere acceso real a Google Sheets, Telegram u otro servicio, no la ejecutes sin autorización y configuración segura. Informa qué no pudo verificarse.

## 8. Documentación y entrega

- Actualiza la documentación cuando cambie el proceso de instalación, configuración, seguridad, pruebas o despliegue.
- Mantén las instrucciones en español, claras y accionables.
- No documentes valores secretos ni datos personales.
- En la entrega final, incluye:
  - resumen de cambios;
  - archivos modificados;
  - validaciones y resultados;
  - riesgos o pendientes;
  - rama y commit;
  - estado de publicación (no publicado / despliegue en curso / desplegado y verificado).

## 9. Prohibiciones por defecto

Sin autorización explícita, no:

- despliegues a Google Apps Script;
- ejecutes `clasp push`, `clasp deploy` o ejecuciones manuales del workflow;
- hagas merge de Pull Requests;
- cambies secretos, Script Properties, permisos OAuth o accesos;
- borres datos, hojas, archivos, ramas, versiones o implementaciones;
- alteres el respaldo original;
- afirmes que una prueba o despliegue fue exitoso sin evidencia.

**Regla final:** prioriza la integridad del proyecto, la seguridad de credenciales y la reversibilidad. Si no puedes verificar un supuesto importante, detente y pregunta en lugar de adivinar.
