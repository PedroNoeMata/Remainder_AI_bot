# Despliegue de Google Apps Script con GitHub Actions

El workflow `.github/workflows/deploy-apps-script.yml` permite enviar el código de la rama `fix/seguridad-telegram` a Google Apps Script mediante `clasp push`.

## 1. Crear el secreto de autenticación

1. En tu equipo, ejecuta `clasp login` si todavía no tienes una sesión válida.
2. Abre el archivo local `~/.clasprc.json` (en Windows suele estar en `%USERPROFILE%\.clasprc.json`).
3. Copia el contenido completo del archivo, sin modificarlo.
4. En GitHub abre **Settings → Secrets and variables → Actions → New repository secret**.
5. Crea el secreto con este nombre exacto: `CLASPRC_JSON`.
6. Pega como valor el contenido completo de `.clasprc.json` y guarda.

No subas `.clasprc.json` al repositorio, no lo agregues a un commit y no lo compartas en mensajes. Es una credencial OAuth.

## 2. Ejecutar el despliegue manual

1. Abre la pestaña **Actions** del repositorio.
2. Selecciona **Deploy Google Apps Script with clasp**.
3. Pulsa **Run workflow**.
4. Selecciona la rama `fix/seguridad-telegram`.
5. Para confirmar el envío, cambia `confirm_deploy` a `yes`.
6. Ejecuta el workflow y revisa el resultado de cada paso.

El workflow está restringido a la rama `fix/seguridad-telegram`; no despliega desde `main` ni desde la rama de respaldo. No se ejecuta automáticamente al hacer push o al abrir el PR.

## 3. Qué hace y qué no hace

- Valida que `appsscript.json` sea JSON válido.
- Instala Node.js y `@google/clasp`.
- Configura la autenticación usando el secreto `CLASPRC_JSON`.
- Ejecuta `clasp status` y después `clasp push --force`.
- No crea una nueva versión numerada ni una implementación web. Solo sincroniza los archivos fuente con el proyecto de Apps Script asociado a `.clasp.json`.
- Las Script Properties del proyecto (por ejemplo, `TELEGRAM_TOKEN` y `TELEGRAM_CHAT_ID`) no se guardan en Git y no se reemplazan con este push.

## 4. Protección del proyecto

Antes de ejecutar el workflow, verifica que el `scriptId` de `.clasp.json` corresponda al proyecto de Apps Script que quieres actualizar. El paso `clasp status` muestra los archivos que se sincronizarán. El push sobrescribe los archivos remotos correspondientes a los archivos locales incluidos por clasp.

La rama `backup/original-2026-11-11` conserva la copia original del código y `main` no se modifica con este workflow.
