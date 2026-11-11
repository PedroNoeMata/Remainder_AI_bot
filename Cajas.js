function enviarRecordatorioTelegram() {
  const ss = SpreadsheetApp.openById(ID);
  const sh = ss.getSheetByName("CHAT_IDS");

  agregarOActualizarTotal()
  
  if (!sh) {
    throw new Error("No existe la hoja CHAT_IDS");
  }

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return;

  // Lee Agente y ChatId como texto
  const data = sh.getRange(2, 1, lastRow - 1, 2).getDisplayValues();

  data.forEach(([agente, chatId]) => {
    if (!agente || !chatId) return;

    // Ejecuta resúmenes por agente
    // const ventasMes = resumenVentasPorMes(agente);
    // actualizarResumenMesActual()
    const htmlCanalCajas = tablaTextoCanalCajas();
    const htmlMesCajas = tablaTextoMesCajas();
    const htmlCanalMonto = tablaTextoCanalMonto();
    const htmlMesMonto = tablaTextoMesMonto();

    // Mensaje final
    const mensaje = `
    <b>🚀 Reporte Automático de Ventas</b>
    <b>Agente:</b> ${agente}

    ${htmlMesCajas}

    ${htmlMesMonto}

    ${htmlCanalCajas}

    ${htmlCanalMonto}

    `;

    // Envío
    enviarTelegramHTML(mensaje, String(chatId));
  });
}

function tablaTextoMesCajas() {

  const ss = SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  const hoja = ss.getSheetByName("ResumenMes");
  const datos = hoja.getDataRange().getValues();

  const headers = ["Mes","PPTO Vol","Ventas Vol","% VS PPTO"];

  let filas = [];

  for (let i = 1; i < datos.length; i++) {

    filas.push([
      String(datos[i][0]),
      formatoNumero(datos[i][1]),
      formatoNumero(datos[i][2]),
      formatoPorcentajeTelegram1(datos[i][3])
    ]);

  }

  // calcular ancho máximo de cada columna
  const widths = headers.map((h,i)=>
    Math.max(
      h.length,
      ...filas.map(f => String(f[i]).length)
    )
  );

  let txt = "<b>📈 Resumen Mensual</b>\n\n";
  txt += "<pre>";

  // encabezado
  txt += headers.map((h,i)=>h.padEnd(widths[i])).join(" | ") + "\n";

  // separador
  txt += widths.map(w=>"-".repeat(w)).join("-|-") + "\n";

  // filas
  filas.forEach(f => {

    txt += [
      f[0].padEnd(widths[0]),
      f[1].padStart(widths[1]),
      f[2].padStart(widths[2]),
      f[3].padStart(widths[3])
    ].join(" | ") + "\n";

  });

  txt += "</pre>";

  return txt;
}

function tablaTextoMesMonto() {

  const ss = SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  const hoja = ss.getSheetByName("ResumenMes");
  const datos = hoja.getDataRange().getValues();

  let filas = [];

  for (let i = 1; i < datos.length; i++) {

    filas.push([
      String(datos[i][0]),
      formatoNumero1(datos[i][4]),
      formatoNumero1(datos[i][5]),
      formatoPorcentajeTelegram1(datos[i][6])
    ]);

  }

  const headers = ["Mes", "PPTO Monto", "Ventas Monto", "% VS PPTO"];

  const colWidths = headers.map((h, i) =>
    Math.max(
      h.length,
      ...filas.map(f => String(f[i]).length)
    )
  );

  let txt = "<b>📈 Resumen Mensual</b>\n\n";
  txt += "<pre>";

  txt += headers
    .map((h, i) => h.padEnd(colWidths[i]))
    .join(" | ") + "\n";

  txt += colWidths
    .map(w => "-".repeat(w))
    .join("-|-") + "\n";

  filas.forEach(f => {

    txt += [
      f[0].padEnd(colWidths[0]),
      f[1].padStart(colWidths[1]),
      f[2].padStart(colWidths[2]),
      f[3].padStart(colWidths[3])
    ].join(" | ") + "\n";

  });

  txt += "</pre>";

  return txt;
}

function tablaTextoCanalCajas() {

  const ss = SpreadsheetApp.openByUrl(URL_SHEET);
  const hoja = ss.getSheetByName(HOJA_CANAL);
  const datos = hoja.getDataRange().getValues();

  // calcular ancho máximo del canal
  let anchoCanal = "Canal".length;

  for (let i = 1; i < datos.length; i++) {
    const largo = String(datos[i][0]).length;
    if (largo > anchoCanal) anchoCanal = largo;
  }

  let txt = "<b>📊 Resumen por Canal</b>\n\n";
  txt += "<pre>";

  txt += 
  "Canal".padEnd(anchoCanal) +
  " | PPTO Vol | Ventas Vol | % VS PPTO\n";

  txt +=
  "-".repeat(anchoCanal) +
  "-|----------|------------|-----------\n";

  for (let i = 1; i < datos.length; i++) {

    const canal = String(datos[i][0]).padEnd(anchoCanal);
    const ppto  = formatoNumero(datos[i][2]).padStart(9);
    const venta = formatoNumero(datos[i][3]).padStart(9);
    const porc  = ((datos[i][4] * 100).toFixed(0) + "%").padStart(8);

    txt += `${canal} | ${ppto} | ${venta} | ${porc}\n`;
  }

  txt += "</pre>";

  return txt;
}

function tablaTextoCanalMonto() {

  const ss = SpreadsheetApp.openByUrl(URL_SHEET);
  const hoja = ss.getSheetByName(HOJA_CANAL);
  const datos = hoja.getDataRange().getValues();

  const headers = ["Canal","PPTO Monto","Ventas Monto","% VS PPTO"];

  let filas = [];

  for (let i = 1; i < datos.length; i++) {

    filas.push([
      String(datos[i][0]),
      formatoNumero1(datos[i][5]),
      formatoNumero1(datos[i][6]),
      (datos[i][7] * 100).toFixed(0) + "%"
    ]);

  }

  // calcular ancho máximo por columna
  const widths = headers.map((h,i)=>
    Math.max(
      h.length,
      ...filas.map(f=>String(f[i]).length)
    )
  );

  let txt = "<b>📊 Resumen por Canal</b>\n\n";
  txt += "<pre>";

  // encabezado
  txt += headers.map((h,i)=>h.padEnd(widths[i])).join(" | ") + "\n";

  // separador
  txt += widths.map(w=>"-".repeat(w)).join("-|-") + "\n";

  // filas
  filas.forEach(f=>{
    txt += [
      f[0].padEnd(widths[0]),
      f[1].padStart(widths[1]),
      f[2].padStart(widths[2]),
      f[3].padStart(widths[3])
    ].join(" | ") + "\n";
  });

  txt += "</pre>";

  return txt;
}

function formatoNumero1(valor){
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

  if (porcentaje >= 100) {
    return `▲ ${porcentaje.toFixed(decimales)}%`;
  } else {
    return `▼ ${porcentaje.toFixed(decimales)}%`;
  }
}

function agregarFilaTotalConFormulas1() {
  var ss = SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  var sheet = ss.getSheetByName("ResumenMes");
  var lastRow = sheet.getLastRow();
  
  // Definimos la fila donde irá el total
  var totalRow = lastRow + 1;
  sheet.getRange(totalRow, 1).setValue("Total");
  
  // Fórmulas para las columnas de volúmenes (sumas)
  // B: VolVentas, C: VolPPTO, E: PPTO$, F: Ventas$
  sheet.getRange(totalRow, 2).setFormula("=SUM(B2:B" + lastRow + ")");
  sheet.getRange(totalRow, 3).setFormula("=SUM(C2:C" + lastRow + ")");
  sheet.getRange(totalRow, 5).setFormula("=SUM(E2:E" + lastRow + ")");
  sheet.getRange(totalRow, 6).setFormula("=SUM(F2:F" + lastRow + ")");
  
  // Fórmulas de porcentaje solicitadas
  // Columna D (VolPorcentaje) = C/B
  sheet.getRange(totalRow, 4).setFormula("=C" + totalRow + "/B" + totalRow);
  // Columna G (Porcentaje$) = F/E
  sheet.getRange(totalRow, 7).setFormula("=F" + totalRow + "/E" + totalRow);
  
  // Formato: Negrita
  sheet.getRange(totalRow, 1, 1, 7).setFontWeight("bold");
}

function agregarOActualizarTotal() {
  var ss = SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  var sheet = ss.getSheetByName("ResumenMes");
  var lastRow = sheet.getLastRow();
  
  // 1. Detectar si existe una fila llamada "Total"
  var lastCellValue = sheet.getRange(lastRow, 1).getValue();
  var targetRow = (lastCellValue === "Total") ? lastRow : lastRow + 1;
  
  // 2. Insertar/Preparar la fila
  sheet.getRange(targetRow, 1).setValue("Total");
  
  // 3. Aplicar sumas (Ajusta los rangos si tus datos terminan antes)
  sheet.getRange(targetRow, 2).setFormula("=SUM(B2:B" + (targetRow - 1) + ")");
  sheet.getRange(targetRow, 3).setFormula("=SUM(C2:C" + (targetRow - 1) + ")");
  sheet.getRange(targetRow, 5).setFormula("=SUM(E2:E" + (targetRow - 1) + ")");
  sheet.getRange(targetRow, 6).setFormula("=SUM(F2:F" + (targetRow - 1) + ")");
  
  // 4. Aplicar fórmulas de porcentaje
  sheet.getRange(targetRow, 4).setFormula("=C" + targetRow + "/B" + targetRow);
  sheet.getRange(targetRow, 7).setFormula("=F" + targetRow + "/E" + targetRow);
  
  // 5. Formato
  sheet.getRange(targetRow, 1, 1, 7).setFontWeight("bold");
}