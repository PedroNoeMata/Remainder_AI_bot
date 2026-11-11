function enviarRecordatorioTelegramx() {
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
    const htmlDia = tablaTextoCanal();
    const htmlMes = tablaTextoMes();

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

function tablaTextoMes() {
  const ss = SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  const hoja = ss.getSheetByName("ResumenMes");
  const datos = hoja.getDataRange().getValues();

  let txt = "<b>📈 Resumen Mensual</b>\n\n";
  txt += "<pre>";
  txt += "Mes         | PPTO Vol | Ventas Vol | % VS PPTO | $PPTO     | $Ventas   | % vs Monto\n";
  txt += "------------|----------|------------|-----------|-----------|-----------|-----------\n";

  for (let i = 1; i < datos.length; i++) {
    const mes    = String(datos[i][0]).padEnd(12, " ");
    const venta  = formatoNumero(datos[i][1]).padStart(9, " ");
    const ppto   = formatoNumero(datos[i][2]).padStart(9, " ");
    const vsPpto = formatoPorcentajeTelegram(datos[i][3]).padStart(8, " ");

    const venta1  = formatoNumero(datos[i][5]).padStart(9, " ");
    const ppto1   = formatoNumero(datos[i][4]).padStart(9, " ");
    const vsPpto1 = formatoPorcentajeTelegram(datos[i][6]).padStart(8, " ");

    txt += `${mes}| ${ppto} | ${venta} | ${vsPpto} | ${ppto1} | ${venta1} | ${vsPpto1}\n`;
  }

  txt += "</pre>";

  return txt;
}

function tablaTextoCanal() {
  const ss = SpreadsheetApp.openByUrl(URL_SHEET);
  const hoja = ss.getSheetByName(HOJA_CANAL);
  const datos = hoja.getDataRange().getValues();

  let txt = "<b>📊 Resumen por Canal</b>\n\n";
  txt += "<pre>";
  txt += "Canal               | PPTO Vol | Ventas Vol | % VS PPTO | $PPTO   | $Ventas | % vs Monto\n";
  txt += "--------------------|----------|------------|-----------|---------|---------|-----------\n";

  for (let i = 1; i < datos.length; i++) {
    const canal = String(datos[i][0]).padEnd(20, " ");

    const ppto  = formatoNumero(datos[i][2]).padStart(7, " ");
    const venta = formatoNumero(datos[i][3]).padStart(7, " ");
    const porc  = (datos[i][4] * 100).toFixed(2).padStart(6, " ") + "%";

    const ppto1  = formatoNumero(datos[i][5]).padStart(7, " ");
    const venta1 = formatoNumero(datos[i][6]).padStart(7, " ");
    const porc1  = (datos[i][7] * 100).toFixed(2).padStart(6, " ") + "%";

    txt += `${canal}| ${ppto} | ${venta} | ${porc} | ${ppto1} | ${venta1} | ${porc1}\n`;
  }

  txt += "</pre>";
  return txt;
}

function tablaTextoMes2() {
  const ss =  SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  const hoja = ss.getSheetByName("ResumenMes");
  const datos = hoja.getDataRange().getValues();

  let txt = "<b>📈 Resumen Mensual</b>\n\n";
  txt += "<pre>";
  txt += "Mes         | PPTO Vol     | Ventas Vol      | % VS PPTO | $PPTO   | $Ventas  | % vs Monto|\n";
  txt += "--------------------|---------|---------|-------|---------|---------|---------\n";

  for (let i = 1; i < datos.length; i++) {
    const mes    = String(datos[i][0]).padEnd(12, " ");
    const venta  = formatoNumero(datos[i][1]).padStart(9, " ");
    const ppto   = formatoNumero(datos[i][2]).padStart(9, " ");
    const vsPpto = formatoPorcentajeTelegram(datos[i][3]).padStart(8, " ");

    const venta1  = formatoNumero(datos[i][5]).padStart(9, " ");
    const ppto1   = formatoNumero(datos[i][4]).padStart(9, " ");
    const vsPpto1 = formatoPorcentajeTelegram(datos[i][6]).padStart(8, " ");

    txt += `${mes}| ${ppto} | ${venta} | ${vsPpto}| ${ppto1}| ${venta1}| ${vsPpto1}\n`;
  }

  txt += "</pre>";

  return txt;
}

function tablaTextoCanal2() {
  const ss = SpreadsheetApp.openByUrl(URL_SHEET);
  const hoja = ss.getSheetByName(HOJA_CANAL);
  const datos = hoja.getDataRange().getValues();
  // agregarFilasTotalYMexico()

  let txt = "<b>📊 Resumen por Canal</b>\n";
  txt += "<pre>";
  txt += "Canal               | PPTO Vol    | Ventas Vol  | % VS PPTO | $PPTO   | $Ventas  | % vs Monto|\n";
  txt += "--------------------|---------|---------|-------|---------|---------|---------\n";

  for (let i = 1; i < datos.length; i++) {
    const canal = String(datos[i][0]).padEnd(20, " ");
    const ppto  = formatoNumero(datos[i][2]).padStart(7, " ");
    const venta = formatoNumero(datos[i][3]).padStart(7, " ");
    const porc = (datos[i][4] * 100).toFixed(2).padStart(6, " ") + "%";
    const ppto1  = formatoNumero(datos[i][5]).padStart(7, " ");
    const venta1 = formatoNumero(datos[i][6]).padStart(7, " ");
    const porc1 = (datos[i][7] * 100).toFixed(2).padStart(6, " ") + "%";

    txt += `${canal}| ${ppto} | ${venta} | ${porc} | ${ppto1} | ${venta1} | ${porc1}\n`;
  }

  txt += "</pre>";
  return txt;
}

function agregarFilasTotalYMexico() {
  const ss = SpreadsheetApp.openById(ID);
  const sheet = ss.getSheetByName("Canal");

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;

  const data = sheet.getRange(1, 1, lastRow, sheet.getLastColumn()).getValues();

  const COL_CANAL = 0;
  const COL_MES = 1;
  const COL_PPTO = 2;
  const COL_VENTAS = 3;

  // 1️⃣ Eliminar filas existentes TOTAL / MEXICO (de abajo hacia arriba)
  for (let i = data.length - 1; i >= 1; i--) {
    const canal = data[i][COL_CANAL];
    if (canal === "TOTAL" || canal === "MEXICO") {
      sheet.deleteRow(i + 1);
    }
  }

  // Releer datos ya limpios
  const cleanData = sheet.getDataRange().getValues();
  if (cleanData.length <= 1) return;

  let totalPPTO = 0;
  let totalVentas = 0;
  let mexicoPPTO = 0;
  let mexicoVentas = 0;

  const mes = cleanData[1][COL_MES];

  // 2️⃣ Calcular totales
  for (let i = 1; i < cleanData.length; i++) {
    const canal = cleanData[i][COL_CANAL];
    const ppto = Number(cleanData[i][COL_PPTO]) || 0;
    const ventas = Number(cleanData[i][COL_VENTAS]) || 0;

    totalPPTO += ppto;
    totalVentas += ventas;

    if (canal === "NORTE DE MEXICO" || canal === "SUR DE MEXICO") {
      mexicoPPTO += ppto;
      mexicoVentas += ventas;
    }
  }

  const totalPct = totalPPTO ? totalVentas / totalPPTO : 0;
  const mexicoPct = mexicoPPTO ? mexicoVentas / mexicoPPTO : 0;

  // 3️⃣ Agregar filas nuevas
  const filas = [
    ["MEXICO", mes, mexicoPPTO, mexicoVentas, mexicoPct],
        ["TOTAL", mes, totalPPTO, totalVentas, totalPct]
  ];

  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, filas.length, filas[0].length)
       .setValues(filas);

  sheet.getRange(startRow, 5, filas.length, 1)
       .setNumberFormat("0.00%");
}

function resumenVentasPorMes(agenteFiltro) {

  const ID_SS = "1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ";
  const HOJA_VENTAS = "Hoja 1";        // Ajusta si cambia
  const HOJA_PPTO = "PPTO Agentes";
  const HOJA_RESUMEN = "ResumenMes";

  const ss = SpreadsheetApp.openById(ID_SS);
  const tz = Session.getScriptTimeZone();

  // ================= UTILIDADES =================
  const normalizar = v => String(v).trim().toUpperCase();

  const obtenerFecha = v => {
    if (v instanceof Date && !isNaN(v)) return v;
    const d = new Date(v);
    return isNaN(d) ? null : d;
  };

  const obtenerMes = v => {
    if (v instanceof Date && !isNaN(v)) {
      return new Date(v.getFullYear(), v.getMonth(), 1);
    }
    if (typeof v === "string") {
      const p = v.trim().split("-");
      if (p.length === 2) {
        const y = Number(p[0]);
        const m = Number(p[1]) - 1;
        if (!isNaN(y) && !isNaN(m)) return new Date(y, m, 1);
      }
    }
    return null;
  };

  const agenteBuscar = normalizar(agenteFiltro);
  const esDibe = agenteBuscar === "DIBE";

  // ================= VENTAS =================
  const hojaVentas = ss.getSheetByName(HOJA_VENTAS);
  if (!hojaVentas) throw new Error(`No existe la hoja '${HOJA_VENTAS}'`);

  const dataVentas = hojaVentas.getDataRange().getValues();
  const headersV = dataVentas[0];

  const idxFecha  = headersV.indexOf("Fecha");
  const idxVenta  = headersV.indexOf("Venta");
  const idxAgente = headersV.indexOf("Agente");

  if (idxFecha === -1 || idxVenta === -1 || idxAgente === -1) {
    throw new Error("Encabezados inválidos en hoja Ventas");
  }

  const ventasPorMes = {};

  for (let i = 1; i < dataVentas.length; i++) {
    const agenteFila = normalizar(dataVentas[i][idxAgente]);

    // ✅ SOLO filtrar si NO es DIBE
    if (!esDibe && agenteFila !== agenteBuscar) continue;

    const fecha = obtenerFecha(dataVentas[i][idxFecha]);
    const venta = Number(dataVentas[i][idxVenta]);

    if (!fecha || isNaN(venta)) continue;

    const mesKey = Utilities.formatDate(fecha, tz, "yyyy-MM");
    ventasPorMes[mesKey] = (ventasPorMes[mesKey] || 0) + venta;
  }

  if (Object.keys(ventasPorMes).length === 0) {
    throw new Error("No se encontraron ventas para el filtro aplicado");
  }

  // ================= PPTO =================
  const hojaPPTO = ss.getSheetByName(HOJA_PPTO);
  if (!hojaPPTO) throw new Error(`No existe la hoja '${HOJA_PPTO}'`);

  const dataPPTO = hojaPPTO.getDataRange().getValues();
  const headersP = dataPPTO[0];

  const idxPAgente = headersP.indexOf("Agente");
  const idxPMes    = headersP.indexOf("Mes");
  const idxPPTO    = headersP.indexOf("PPTO");

  if (idxPAgente === -1 || idxPMes === -1 || idxPPTO === -1) {
    throw new Error("Encabezados inválidos en hoja PPTO Agentes");
  }

  const mapaPPTO = {};

  for (let i = 1; i < dataPPTO.length; i++) {
    const agente = normalizar(dataPPTO[i][idxPAgente]);
    const fechaMes = obtenerMes(dataPPTO[i][idxPMes]);
    const ppto = Number(dataPPTO[i][idxPPTO]);

    if (!agente || !fechaMes || isNaN(ppto)) continue;

    const mesKey = Utilities.formatDate(fechaMes, tz, "yyyy-MM");
    mapaPPTO[`${agente}|${mesKey}`] = ppto;
  }

  // ================= RESUMEN =================
  let hojaResumen = ss.getSheetByName(HOJA_RESUMEN);
  if (!hojaResumen) hojaResumen = ss.insertSheet(HOJA_RESUMEN);
  hojaResumen.clear();

  const salida = [["Mes", "Total Venta", "PPTO", "% VS PPTO"]];

  Object.keys(ventasPorMes).sort().forEach(mes => {
    const totalVenta = ventasPorMes[mes];
    const ppto = mapaPPTO[`${agenteBuscar}|${mes}`] || 0;
    const pct = ppto > 0 ? totalVenta / ppto : 0;
    salida.push([mes, totalVenta, ppto, pct]);
  });

  hojaResumen
    .getRange(1, 1, salida.length, salida[0].length)
    .setValues(salida);

  hojaResumen
    .getRange(2, 4, salida.length - 1, 1)
    .setNumberFormat("0.00%");

  Logger.log(`✔ Resumen mensual generado para ${agenteFiltro}`);
}

function enviarTelegramHTML(mensaje, chatId) {
  const url = `https://api.telegram.org/bot${obtenerTokenTelegram_()}/sendMessage`;

  const payload = {
    chat_id: String(chatId),
    text: mensaje,
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: "🍬 Inventario Dulces Beny",
            url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRrVcF0wbhkbE2IRQVkr1_gV2HKMLICXhN4rjPRi07iu2ADM8cEPqFTthh0YR8cy0rtE_zn0UZgFiUB/pubhtml?gid=0&single=true"
          }
        ]
      ]
    })
  };

  const opciones = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, opciones);
}

function actualizarResumenMesActual() {
  const ss =  SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  const hojaCanal = ss.getSheetByName("Canal");
  const hojaResumen = ss.getSheetByName("ResumenMes");

  const canalesObjetivo = [
    "CENTROAMERICA",
    "CLIENTES DIRECTOS",
    "CUENTAS ESPECIALES",
    "ESTADOS UNIDOS",
    "MAQUILAS",
    "NORTE DE MEXICO",
    "SUR DE MEXICO"
  ];

  const datos = hojaCanal.getDataRange().getValues();

  let sumaPPTO = 0;
  let sumaVentas = 0;

  for (let i = 1; i < datos.length; i++) {
    const canal = String(datos[i][0]).trim();
    const ppto = Number(datos[i][2]) || 0;
    const ventas = Number(datos[i][3]) || 0;

    if (canalesObjetivo.includes(canal)) {
      sumaPPTO += ppto;
      sumaVentas += ventas;
    }
  }

  const porcentaje = sumaPPTO === 0 ? 0 : sumaVentas / sumaPPTO;

  const hoy = new Date();
  const mesActual = Utilities.formatDate(
    hoy,
    Session.getScriptTimeZone(),
    "yyyy-MM"
  );

  const datosResumen = hojaResumen.getDataRange().getValues();

  let filaEncontrada = null;

  for (let i = 1; i < datosResumen.length; i++) {
    let mesHoja = datosResumen[i][0];

    if (mesHoja instanceof Date) {
      mesHoja = Utilities.formatDate(
        mesHoja,
        Session.getScriptTimeZone(),
        "yyyy-MM"
      );
    } else {
      mesHoja = String(mesHoja).trim();
    }

    if (mesHoja === mesActual) {
      filaEncontrada = i + 1;
      break;
    }
  }

  // Si no existe, crear
  if (!filaEncontrada) {
    filaEncontrada = hojaResumen.getLastRow() + 1;
    hojaResumen.getRange(filaEncontrada, 1).setValue(mesActual);
  }

  // Actualizar valores
  hojaResumen.getRange(filaEncontrada, 2).setValue(sumaVentas);
  hojaResumen.getRange(filaEncontrada, 3).setValue(sumaPPTO);
  hojaResumen.getRange(filaEncontrada, 4).setValue(porcentaje);

  // Eliminar duplicados por mes (seguridad)
  const rango = hojaResumen.getRange(2, 1, hojaResumen.getLastRow() - 1, 4);
  rango.removeDuplicates([1]);
}

function tablaTextoCanal1() {
  const ss = SpreadsheetApp.openByUrl(URL_SHEET);
  const hoja = ss.getSheetByName(HOJA_CANAL);
  const datos = hoja.getDataRange().getValues();

  let txt = "<b>📊 RESUMEN EJECUTIVO POR CANAL</b>\n";
  txt += "<i>Cifras comparativas vs Presupuesto</i>\n";
  txt += "━━━━━━━━━━━━━━━━━━━━\n";

  // Empezamos en i = 1 para saltar encabezados
  for (let i = 1; i < datos.length; i++) {
    const row = datos[i];
    
    // Asignación de variables por posición de columna
    const canal    = String(row[0]).toUpperCase();
    const pptoVol  = row[2];
    const ventVol  = row[3];
    const porcVol  = row[4]; 
    const pptoMto  = row[5];
    const ventMto  = row[6];
    const porcMto  = row[7];

    // Lógica de Indicador (KPI Salud)
    // 🟢 >= 95%, 🟡 >= 80%, 🔴 < 80%
    const status = porcVol >= 0.95 ? "🟢" : porcVol >= 0.80 ? "🟡" : "🔴";

    // Construcción del bloque de canal
    txt += `\n${status} <b>${canal}</b>\n`;
    txt += `📦 <b>Vol:</b> ${formatoCifra(ventVol)} / ${formatoCifra(pptoVol)} (<b>${(porcVol * 100).toFixed(1)}%</b>)\n`;
    txt += `💰 <b>Mto:</b> $${formatoCifra(ventMto)} / $${formatoCifra(pptoMto)} (<b>${(porcMto * 100).toFixed(1)}%</b>)\n`;
    txt += "────────────────────\n";
  }

  return txt;
}

function formatoCifra(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function tablaTextoMes1() {
  const ss = SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  const hoja = ss.getSheetByName("ResumenMes");
  const datos = hoja.getDataRange().getValues();

  let txt = "<b>📈 RESUMEN MENSUAL</b>\n━━━━━━━━━━━━━━━━━━━━\n";

  for (let i = 1; i < datos.length; i++) {
    // Orden ajustado según tu especificación:
    // [0]Mes, [1]PPTO Vol, [2]Ventas Vol, [3]Porcentaje, [4]$ PPTO, [5]$ Ventas, [6]$ Porcentaje
    const [mes, pptoVol, vtaVol, vsPptoVol, pptoMto, vtaMto, vsPptoMto] = datos[i];
    
    if (!mes) continue;

    // Semáforo basado en cumplimiento de Volumen (columna índice 3)
    const icon = vsPptoVol >= 1 ? "✅" : (vsPptoVol >= 0.85 ? "🟡" : "🚨");

    txt += `\n${icon} <b>${String(mes).toUpperCase()}</b>\n`;
    
    // Volumen (Venta / Ppto)
    txt += `📦 <b>VOL:</b> ${formatoNumero(Math.round(vtaVol))} / ${formatoNumero(Math.round(pptoVol))} (<b>${Math.round(vsPptoVol * 100)}%</b>)\n`;
    
    // Monto ($ Venta / $ Ppto)
    txt += `💰 <b>MTO:</b> $${formatoNumero(Math.round(vtaMto))} / $${formatoNumero(Math.round(pptoMto))} (<b>${Math.round(vsPptoMto * 100)}%</b>)\n`;
    
    txt += "────────────────────\n";
  }

  return txt;
}

function tablaTextoMes2() {
  const ss = SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  const hoja = ss.getSheetByName("ResumenMes");
  const datos = hoja.getDataRange().getValues();

  let txt = "<b>📈 RESUMEN MENSUAL</b>\n━━━━━━━━━━━━━━━━━━━━\n";

  for (let i = 1; i < datos.length; i++) {
    const [mes, vtaVol, pptoVol, vsPptoVol, pptoMto, vtaMto, vsPptoMto] = datos[i];
    if (!mes) continue;

    const icon = vsPptoVol >= 1 ? "✅" : (vsPptoVol >= 0.85 ? "🟡" : "🚨");

    txt += `\n${icon} <b>${String(mes).toUpperCase()}</b>\n`;
    // Volumen sin decimales
    txt += `📦 <b>VOL:</b> ${formatoNumero(Math.round(vtaVol))} / ${formatoNumero(Math.round(pptoVol))} (<b>${Math.round(vsPptoVol * 100)}%</b>)\n`;
    // Monto sin decimales
    txt += `💰 <b>MTO:</b> $${formatoNumero(Math.round(vtaMto))} / $${formatoNumero(Math.round(pptoMto))} (<b>${Math.round(vsPptoMto * 100)}%</b>)\n`;
    txt += "────────────────────\n";
  }
  return txt;
}

