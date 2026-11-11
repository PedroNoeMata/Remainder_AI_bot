# Despliegue automático de Google Apps Script con GitHub Actions

El workflow `.github/workflows/deploy-apps-script.yml` publica automáticamente el código de la rama `fix/seguridad-telegram` en Google Apps Script mediante `clasp push --force`.

## 1. Autenticación (configuración única)

El repositorio debe tener el secreto `CLASPRC_JSON`:

1. En tu equipo, abre `%USERPROFILE%\\.clasprc.json` (Windows) o `~/.clasprc.json`.
2. Copia el contenido completo del archivo sin modificarlo.
3. En GitHub abre **Settings → Secrets and variables → Actions**.
4. Verifica que exista el secreto de repositorio `CLASPRC_JSON` con ese contenido.

No subas `.clasprc.json` al repositorio ni compartas su contenido. Es una credencial OAuth.

## 2. Despliegue automático

A partir de esta configuración:

1. Realiza tus cambios de código en la rama `fix/seguridad-telegram`.
2. Guarda los cambios y haz `git push` a GitHub.
3. GitHub Actions iniciará el workflow automáticamente.
4. El workflow valida `appsscript.json`, configura clasp, ejecuta `clasp status` y después `clasp push --force`.
5. Revisa **Actions → Deploy Google Apps Script with clasp** para confirmar que el trabajo terminó correctamente.

No necesitas pulsar **Run workflow** para los cambios nuevos. El disparador automático se aplica a cada push a `fix/seguridad-telegram`. El disparador manual se conserva como alternativa y requiere seleccionar `yes`.

## 3. Alcance y protección

- Solo se despliega desde `fix/seguridad-telegram`; los pushes a `main` y a `backup/original-2026-11-11` no publican en Apps Script.
- Cada push sincroniza los archivos locales con el proyecto asociado al `.clasp.json` de esa rama.
- `clasp push --force` puede sobrescribir los archivos remotos correspondientes. Verifica el Script ID antes de cambiar `.clasp.json`.
- La rama `backup/original-2026-11-11` conserva el código original.
- Las Script Properties, como `TELEGRAM_TOKEN` y `TELEGRAM_CHAT_ID`, no se guardan en Git y este push no las reemplaza.
- El workflow no crea una versión numerada ni actualiza una implementación de Web App; solo sincroniza el código fuente.

## 4. Flujo recomendado

Trabaja y prueba los cambios en `fix/seguridad-telegram`. Después de cada `git push`, espera a que el workflow termine en verde antes de dar por publicado el cambio. Si el workflow falla, revisa el log de Actions: no asumas que Apps Script recibió la actualización.
