const HOJA_CANAL = "Canal";

function pegarValoresYPorcentaje() {
  const ss =  SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  const hoja = ss.getSheetByName("ResumenMes");
  if (!hoja) throw new Error("No existe la hoja 'ResumenMes'");

  // =============================
  // 1. Valores fijos para columna C
  // =============================
  const valoresC = [
    [71515],
    [61151],
    [62072],
    [56336],
    [54408],
    [48735],
    [49934],
    [63546],
    [61351],
    [75618],
    [79395],
    [66732],
    [77662]
  ];

  // Pegar valores en C2
  hoja.getRange(2, 3, valoresC.length, 1).setValues(valoresC);

  // =============================
  // 2. Calcular porcentaje B / C
  // =============================
  const valoresB = hoja.getRange(2, 2, valoresC.length, 1).getValues();

  const salidaD = [];

  for (let i = 0; i < valoresC.length; i++) {
    const b = Number(valoresB[i][0]) || 0;
    const c = Number(valoresC[i][0]) || 0;

    salidaD.push([(c !== 0) ? b / c : ""]);
  }

  // Pegar porcentaje en D2
  hoja.getRange(2, 4, salidaD.length, 1).setValues(salidaD);
}

function formatoPorcentajeTelegram(valor, decimales = 1) {
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

function tablaTextoDia() {
  const ss = SpreadsheetApp.openByUrl(URL_SHEET);
  const hoja = ss.getSheetByName(HOJA_DIA);
  const datos = hoja.getDataRange().getValues();

  let txt = "<b>📊 Resumen del Día</b>\n";
  txt += "<pre>";
  txt += "Día         | Total Venta\n";
  txt += "------------|-------------\n";

  for (let i = 1; i < datos.length; i++) {
    const dia   = formatoFechaCorta(datos[i][0]).padEnd(12, " ");
    const venta = formatoNumero(datos[i][1]).padStart(11, " ");

    txt += `${dia}| ${venta}\n`;
  }

  txt += "</pre>";

  return txt;
}

function tablaTextoCanal1() {
  const ss = SpreadsheetApp.openByUrl(URL_SHEET);
  const hoja = ss.getSheetByName(HOJA_CANAL);
  const datos = hoja.getDataRange().getValues();

  let txt = "<b>📊 Resumen por Canal</b>\n\n";

  for (let i = 1; i < datos.length; i++) {
    const canal = datos[i][0];
    const ppto  = formatoNumero(datos[i][2]);
    const venta = formatoNumero(datos[i][3]);
    const porc  = (datos[i][4] * 100).toFixed(2);

    txt += `🏷️ ${canal}\n`;
    txt += `  📦 PPTO: ${ppto}\n`;
    txt += `  💰 VTA : ${venta}\n`;
    txt += `  📈 %   : ${porc}%\n\n`;
  }

  return txt;
}

function tablaTextoCanal3() {
  const ss = SpreadsheetApp.openByUrl(URL_SHEET);
  const hoja = ss.getSheetByName(HOJA_CANAL);
  const datos = hoja.getDataRange().getValues();

  let txt = "<b>📊 Resumen por Canal</b>\n\n";

  for (let i = 1; i < datos.length; i++) {
    const canal = datos[i][0];
    const ppto  = formatoNumero(datos[i][2]);
    const venta = formatoNumero(datos[i][3]);
    const porc  = (datos[i][4] * 100).toFixed(2);

    txt += `• ${canal}\n`;
    txt += `  - PPTO: ${ppto}\n`;
    txt += `  - VTA : ${venta}\n`;
    txt += `  - %   : ${porc}%\n\n`;
  }

  return txt;
}

function tablaTextoCanal4() {
  const ss = SpreadsheetApp.openByUrl(URL_SHEET);
  const hoja = ss.getSheetByName(HOJA_CANAL);
  const datos = hoja.getDataRange().getValues();

  let txt = "📊 Resumen por Canal\n\n";

  for (let i = 1; i < datos.length; i++) {
    const canal = datos[i][0];
    const ppto  = formatoNumero(datos[i][2]);
    const venta = formatoNumero(datos[i][3]);
    const porc  = (datos[i][4] * 100).toFixed(2);

    txt += `• *${canal}* → ${porc}%\n`;
    txt += `  Ventas: ${venta} / PPTO: ${ppto}\n\n`;
  }

  return txt;
}

function tablaTextoCanal5() {
  const ss = SpreadsheetApp.openByUrl(URL_SHEET);
  const hoja = ss.getSheetByName(HOJA_CANAL);
  const datos = hoja.getDataRange().getValues();

  let txt = "📊 *Resumen por Canal*\n\n";

  for (let i = 1; i < datos.length; i++) {
    const canal = datos[i][0];
    const ppto  = formatoNumero(datos[i][2]);
    const venta = formatoNumero(datos[i][3]);
    const porc  = (datos[i][4] * 100).toFixed(2);

    txt += `🏷️ *${canal}*\n`;
    txt += `💰 *Ventas:* ${venta}\n`;
    txt += `📦 *PPTO:* ${ppto}\n`;
    txt += `📈 *Avance:* ${porc}%\n`;
    txt += `────────────\n\n`;
  }

  return txt;
}




