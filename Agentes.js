function enviarRecordatorioTelegramAg() {
  const ss = SpreadsheetApp.openById(ID);
  const sh = ss.getSheetByName("CHAT_IDS_Agentes");

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
    // const ventasDia = resumenVentasPorDiaMesActual(agente);
    const ventasMes = resumenVentasPorMes_A(agente);
    const htmlMes = tablaTextoMes();

    // Mensaje final
    const mensaje = `
    <b>🚀 Reporte Automático de Ventas</b>
    <b>Agente:</b> ${agente}

    ${htmlMes}
    `;

    // Envío
    enviarTelegramHTML_A(mensaje, String(chatId),agente);
  });
}

function resumenVentasPorMes_A(agenteFiltro) {
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

function tablaTextoMes_A(nombreAgente) {
  const ss = SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  const hoja = ss.getSheetByName("ResumenMes");
  const datos = hoja.getDataRange().getValues();

  let txt = `<b>📊 Resumen por Cliente – ${nombreAgente}</b>\n\n`;
  txt += "<pre>";
  txt += "Cliente              | PPTO      | Ventas    | %\n";
  txt += "---------------------|-----------|-----------|----\n";

  for (let i = 1; i < datos.length; i++) {
    const agente = datos[i][2]; // C

    if (agente !== nombreAgente) continue;

    const cliente = String(datos[i][0]).padEnd(20, " ");
    const ppto    = formatoNumero(datos[i][3]).padStart(9, " ");
    const ventas  = formatoNumero(datos[i][4]).padStart(9, " ");
    const porc    = formatoPorcentajeTelegram(datos[i][5]).padStart(4, " ");

    txt += `${cliente}| ${ppto} | ${ventas} | ${porc}\n`;
  }

  txt += "</pre>";

  return txt;
}

function enviarTelegramHTML_A(mensaje, chatId,agente) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  crearCopiarYFiltrarPorM(agente);
  const xx = crearLibroSiNoExiste(agente);

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
        ],
        [
          {
            text: "📊 Reporte Ventas",
            url: xx
          }
        ]
      ]
    })
  };

  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}

function crearCopiarYFiltrarPorM(input) {
  const URL_ORIGEN = "https://docs.google.com/spreadsheets/d/1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ/edit";
  const HOJA_ORIGEN = "AX";
  const COLUMNA_M = 3; // Columna M (base 1)

  if (!input) throw new Error("El input es obligatorio");

  // 1. Crear o reutilizar libro usando el input como nombre
  const urlDestino = crearLibroSiNoExiste(input);
  const ssDestino = SpreadsheetApp.openByUrl(urlDestino);

  // 2. Abrir libro origen
  const ssOrigen = SpreadsheetApp.openByUrl(URL_ORIGEN);
  const shOrigen = ssOrigen.getSheetByName(HOJA_ORIGEN);

  // 3. Preparar hoja destino
  let shDestino;
  if (ssDestino.getSheets().length === 1) {
    shDestino = ssDestino.getSheets()[0];
    shDestino.clear();
    shDestino.setName(HOJA_ORIGEN);
  } else {
    const hojas = ssDestino.getSheets();
    shDestino = hojas[0];
    for (let i = 1; i < hojas.length; i++) {
      ssDestino.deleteSheet(hojas[i]);
    }
    shDestino.clear();
    shDestino.setName(HOJA_ORIGEN);
  }

  // 4. Copiar datos de origen en memoria
  const valoresOrigen = shOrigen.getDataRange().getValues();
  const encabezados = valoresOrigen[0];
  const datos = valoresOrigen.slice(1);

  // 5. Filtrar datos en memoria (solo filas donde columna M = input)
  const datosFiltrados = datos.filter(row => row[COLUMNA_M - 1] === input);

  // 6. Sobrescribir hoja destino con encabezados + filas filtradas
  if (datosFiltrados.length > 0) {
    shDestino.getRange(1, 1, datosFiltrados.length + 1, encabezados.length)
      .setValues([encabezados, ...datosFiltrados]);
  } else {
    // Si no hay filas que cumplan el filtro, dejar solo encabezado
    shDestino.getRange(1, 1, 1, encabezados.length).setValues([encabezados]);
  }

  Logger.log(`Proceso completado. Filtradas ${datosFiltrados.length} filas que coinciden con '${input}'.`);
}

function crearLibroSiNoExiste(nombreLibro) {
  const archivos = DriveApp.searchFiles(
    `title = '${nombreLibro.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
  );

  if (archivos.hasNext()) return archivos.next().getUrl();

  return SpreadsheetApp.create(nombreLibro).getUrl();
}

function prueba() {
  // Este es el valor que quieres usar como nombre del libro y como filtro en columna M
  const input = "EDUARDO RODRIGEZ MARROQUIN";

  // Llamamos a la función principal
  crearCopiarYFiltrarPorM(input);

  Logger.log("Proceso completado. Se creó/reutilizó el libro y se filtraron los datos.");
}
