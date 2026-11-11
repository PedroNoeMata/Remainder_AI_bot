const ID = "1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ";
const HOJA_CANAL = "Canal";

/**
 * Punto de entrada del activador horario.
 * Genera y envía los reportes consolidados de volumen y monto por canal
 * a los destinatarios registrados en la hoja CHAT_IDS.
 */
function enviarRecordatorioTelegram() {
  const ss = SpreadsheetApp.openById(ID);
  const sh = ss.getSheetByName("CHAT_IDS");

  agregarOActualizarTotal();

  if (!sh) {
    throw new Error("No existe la hoja CHAT_IDS");
  }

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return;

  const data = sh.getRange(2, 1, lastRow - 1, 2).getDisplayValues();

  data.forEach(([agente, chatId]) => {
    if (!agente || !chatId) return;

    const htmlCanalCajas = tablaTextoCanalCajas();
    const htmlMesCajas = tablaTextoMesCajas();
    const htmlCanalMonto = tablaTextoCanalMonto();
    const htmlMesMonto = tablaTextoMesMonto();

    const mensaje = `
      <b>🚀 Reporte Automático de Ventas</b>
      <b>Agente:</b> ${agente}

      ${htmlMesCajas}

      ${htmlMesMonto}

      ${htmlCanalCajas}

      ${htmlCanalMonto}
    `;

    enviarTelegramHTML(mensaje, String(chatId));
  });
}

function tablaTextoMesCajas() {
  const ss = SpreadsheetApp.openById(ID);
  const hoja = ss.getSheetByName("ResumenMes");
  if (!hoja) throw new Error("No existe la hoja ResumenMes");

  const datos = hoja.getDataRange().getValues();
  const headers = ["Mes", "PPTO Vol", "Ventas Vol", "% VS PPTO"];
  const filas = [];

  for (let i = 1; i < datos.length; i++) {
    filas.push([
      String(datos[i][0]),
      formatoNumero(datos[i][1]),
      formatoNumero(datos[i][2]),
      formatoPorcentajeTelegram1(datos[i][3])
    ]);
  }

  const widths = headers.map((h, i) =>
    Math.max(h.length, ...filas.map(f => String(f[i]).length))
  );

  let txt = "<b>📈 Resumen Mensual</b>\n\n<pre>";
  txt += headers.map((h, i) => h.padEnd(widths[i])).join(" | ") + "\n";
  txt += widths.map(w => "-".repeat(w)).join("-|-") + "\n";

  filas.forEach(f => {
    txt += [
      f[0].padEnd(widths[0]),
      f[1].padStart(widths[1]),
      f[2].padStart(widths[2]),
      f[3].padStart(widths[3])
    ].join(" | ") + "\n";
  });

  return txt + "</pre>";
}

function tablaTextoMesMonto() {
  const ss = SpreadsheetApp.openById(ID);
  const hoja = ss.getSheetByName("ResumenMes");
  if (!hoja) throw new Error("No existe la hoja ResumenMes");

  const datos = hoja.getDataRange().getValues();
  const headers = ["Mes", "PPTO Monto", "Ventas Monto", "% VS PPTO"];
  const filas = [];

  for (let i = 1; i < datos.length; i++) {
    filas.push([
      String(datos[i][0]),
      formatoNumero1(datos[i][4]),
      formatoNumero1(datos[i][5]),
      formatoPorcentajeTelegram1(datos[i][6])
    ]);
  }

  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...filas.map(f => String(f[i]).length))
  );

  let txt = "<b>📈 Resumen Mensual</b>\n\n<pre>";
  txt += headers.map((h, i) => h.padEnd(colWidths[i])).join(" | ") + "\n";
  txt += colWidths.map(w => "-".repeat(w)).join("-|-") + "\n";

  filas.forEach(f => {
    txt += [
      f[0].padEnd(colWidths[0]),
      f[1].padStart(colWidths[1]),
      f[2].padStart(colWidths[2]),
      f[3].padStart(colWidths[3])
    ].join(" | ") + "\n";
  });

  return txt + "</pre>";
}

function tablaTextoCanalCajas() {
  const ss = SpreadsheetApp.openById(ID);
  const hoja = ss.getSheetByName(HOJA_CANAL);
  if (!hoja) throw new Error("No existe la hoja " + HOJA_CANAL);

  const datos = hoja.getDataRange().getValues();
  let anchoCanal = "Canal".length;

  for (let i = 1; i < datos.length; i++) {
    const largo = String(datos[i][0]).length;
    if (largo > anchoCanal) anchoCanal = largo;
  }

  let txt = "<b>📊 Resumen por Canal</b>\n\n<pre>";
  txt += "Canal".padEnd(anchoCanal) + " | PPTO Vol | Ventas Vol | % VS PPTO\n";
  txt += "-".repeat(anchoCanal) + "-|----------|------------|-----------\n";

  for (let i = 1; i < datos.length; i++) {
    const canal = String(datos[i][0]).padEnd(anchoCanal);
    const ppto = formatoNumero(datos[i][2]).padStart(9);
    const venta = formatoNumero(datos[i][3]).padStart(9);
    const porc = ((datos[i][4] * 100).toFixed(0) + "%").padStart(8);
    txt += `${canal} | ${ppto} | ${venta} | ${porc}\n`;
  }

  return txt + "</pre>";
}

function tablaTextoCanalMonto() {
  const ss = SpreadsheetApp.openById(ID);
  const hoja = ss.getSheetByName(HOJA_CANAL);
  if (!hoja) throw new Error("No existe la hoja " + HOJA_CANAL);

  const datos = hoja.getDataRange().getValues();
  const headers = ["Canal", "PPTO Monto", "Ventas Monto", "% VS PPTO"];
  const filas = [];

  for (let i = 1; i < datos.length; i++) {
    filas.push([
      String(datos[i][0]),
      formatoNumero1(datos[i][5]),
      formatoNumero1(datos[i][6]),
      (datos[i][7] * 100).toFixed(0) + "%"
    ]);
  }

  const widths = headers.map((h, i) =>
    Math.max(h.length, ...filas.map(f => String(f[i]).length))
  );

  let txt = "<b>📊 Resumen por Canal</b>\n\n<pre>";
  txt += headers.map((h, i) => h.padEnd(widths[i])).join(" | ") + "\n";
  txt += widths.map(w => "-".repeat(w)).join("-|-") + "\n";

  filas.forEach(f => {
    txt += [
      f[0].padEnd(widths[0]),
      f[1].padStart(widths[1]),
      f[2].padStart(widths[2]),
      f[3].padStart(widths[3])
    ].join(" | ") + "\n";
  });

  return txt + "</pre>";
}

function formatoNumero(valor) {
  if (valor === null || valor === "" || valor === undefined) return "0";

  const num = Number(valor);
  if (isNaN(num)) return valor.toString();

  return num.toLocaleString("en-US");
}

function formatoNumero1(valor) {
  if (valor === "" || valor == null) return "";
  return Number(valor).toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
}

function formatoPorcentajeTelegram1(valor, decimales = 0) {
  if (valor === null || valor === "" || isNaN(valor)) {
    return "   -   ";
  }

  const porcentaje = valor * 100;
  return porcentaje >= 100
    ? `▲ ${porcentaje.toFixed(decimales)}%`
    : `▼ ${porcentaje.toFixed(decimales)}%`;
}

function agregarOActualizarTotal() {
  const ss = SpreadsheetApp.openById(ID);
  const sheet = ss.getSheetByName("ResumenMes");
  if (!sheet) throw new Error("No existe la hoja ResumenMes");

  const lastRow = sheet.getLastRow();
  if (lastRow === 0) throw new Error("La hoja ResumenMes está vacía");

  const lastCellValue = sheet.getRange(lastRow, 1).getValue();
  const targetRow = (lastCellValue === "Total") ? lastRow : lastRow + 1;

  sheet.getRange(targetRow, 1).setValue("Total");
  sheet.getRange(targetRow, 2).setFormula("=SUM(B2:B" + (targetRow - 1) + ")");
  sheet.getRange(targetRow, 3).setFormula("=SUM(C2:C" + (targetRow - 1) + ")");
  sheet.getRange(targetRow, 5).setFormula("=SUM(E2:E" + (targetRow - 1) + ")");
  sheet.getRange(targetRow, 6).setFormula("=SUM(F2:F" + (targetRow - 1) + ")");
  sheet.getRange(targetRow, 4).setFormula("=C" + targetRow + "/B" + targetRow);
  sheet.getRange(targetRow, 7).setFormula("=F" + targetRow + "/E" + targetRow);
  sheet.getRange(targetRow, 1, 1, 7).setFontWeight("bold");
}

function obtenerPropiedadTelegram_(clave) {
  const valor = PropertiesService.getScriptProperties().getProperty(clave);
  if (!valor) {
    throw new Error("Falta configurar la propiedad de Script Properties: " + clave);
  }
  return valor.trim();
}

function obtenerTokenTelegram_() {
  return obtenerPropiedadTelegram_("TELEGRAM_TOKEN");
}

/**
 * Envía un mensaje HTML a Telegram.
 * Reintenta errores transitorios de red, HTTP 429 y errores 5xx.
 * Nunca incluye el token ni la URL autenticada en los mensajes de error.
 */
function enviarTelegramHTML(mensaje, chatId) {
  const token = obtenerTokenTelegram_();
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const maxIntentos = 3;

  const opciones = {
    method: "post",
    payload: {
      chat_id: String(chatId),
      text: mensaje,
      parse_mode: "HTML"
    },
    muteHttpExceptions: true
  };

  let ultimoError = null;

  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      const respuesta = UrlFetchApp.fetch(url, opciones);
      const codigo = respuesta.getResponseCode();
      const cuerpo = respuesta.getContentText();

      let resultado;
      try {
        resultado = JSON.parse(cuerpo);
      } catch (errorParseo) {
        resultado = null;
      }

      if (codigo >= 200 && codigo < 300 && resultado && resultado.ok === true) {
        return resultado;
      }

      const descripcion = resultado && resultado.description
        ? resultado.description
        : "Respuesta no válida del servicio de Telegram";

      const esTransitorio = codigo === 429 || codigo >= 500;

      if (!esTransitorio || intento === maxIntentos) {
        throw new Error(
          "Telegram rechazó el envío. HTTP " + codigo + ": " + descripcion
        );
      }

      ultimoError = new Error("Telegram respondió HTTP " + codigo);
    } catch (error) {
      ultimoError = error;

      // Los errores HTTP definitivos no se deben reintentar.
      if (/Telegram rechazó el envío/.test(String(error)) ||
          intento === maxIntentos) {
        throw new Error(
          "No se pudo enviar el mensaje a Telegram después de " +
          intento + " intento(s): " + String(error.message || error)
        );
      }
    }

    Utilities.sleep(1000 * Math.pow(2, intento - 1));
  }

  throw new Error(
    "No se pudo enviar el mensaje a Telegram: " +
    String(ultimoError && (ultimoError.message || ultimoError) || "error desconocido")
  );
}
