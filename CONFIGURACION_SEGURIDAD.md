# Configuración segura de Telegram

Las credenciales de Telegram no deben almacenarse en archivos del repositorio.

## Configurar Script Properties

En el proyecto de Google Apps Script:

1. Abre **Configuración del proyecto** (icono de engranaje).
2. Busca **Propiedades del script**.
3. Selecciona **Añadir propiedad del script**.
4. Crea estas propiedades:

| Propiedad | Valor |
|---|---|
| `TELEGRAM_TOKEN` | El token nuevo entregado por BotFather |
| `TELEGRAM_CHAT_ID` | El chat ID predeterminado para el recordatorio general |

5. Guarda los cambios.

No pegues los valores en GitHub, en archivos `.js`, en capturas de pantalla ni en mensajes.

## Funciones disponibles

- `obtenerTokenTelegram_()`: lee y valida `TELEGRAM_TOKEN`.
- `obtenerChatIdTelegram_()`: lee y valida `TELEGRAM_CHAT_ID`.
- `enviarTelegramHTML(mensaje, chatId)`: envía usando el token almacenado en Script Properties.

Los envíos individualizados de `Monto.js` siguen utilizando los chat ID de la hoja `CHAT_IDS`; el token se obtiene de Script Properties.

## Importante sobre el historial de Git

Eliminar una credencial de la versión actual no la elimina de los commits anteriores. El token anterior ya fue revocado, pero se recomienda limpiar el historial Git antes de volver a hacer público o compartir el repositorio. No se debe reutilizar ese token.
