function enviarRecordatorioTelegramMonto() {
  const ss = SpreadsheetApp.openById(ID);
  const sh = ss.getSheetByName("CHAT_IDS");

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
    const htmlDia = tablaTextoCanalMontox();
    const htmlMes = tablaTextoMesMontox();

    // Mensaje final
    const mensaje = `
    <b>🚀 Reporte Automático de Ventas</b>
    <b>Agente:</b> ${agente}

    ${htmlMes}

    ${htmlDia}
    `;

    // Envío
    enviarTelegramHTML(mensaje, String(chatId));
  });
}

function tablaTextoMesMontox() {

  const ss = SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  const hoja = ss.getSheetByName("ResumenMes");
  const datos = hoja.getDataRange().getValues();

  let filas = [];

  for (let i = 1; i < datos.length; i++) {

    filas.push([
      String(datos[i][0]),
      formatoNumero1(datos[i][4]),
      formatoNumero1(datos[i][5]),
      formatoPorcentajeTelegram(datos[i][6])
    ]);

  }

  const headers = ["Mes", "PPTO Vol", "Ventas Vol", "% VS PPTO"];

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

function tablaTextoCanalMontox() {

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
      (datos[i][7] * 100).toFixed(2) + "%"
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





