function enviarRecordatorioTelegram_1() {
  var token = "7947319144:AAE_RsZXslz5e8Z32DrZAJvdKPmTFJfa4FQ";
  var chat_id = "1318922238";
  var urlSheet = "https://docs.google.com/spreadsheets/d/1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ/edit#gid=1445570305";

  var ss = SpreadsheetApp.openByUrl(urlSheet);
  resumenVentasPorMes();
  resumenVentasPorDiaMesActual(); 

  var hojaDia = ss.getSheetByName("ResumenDiaMesActual");
  var hojaMes = ss.getSheetByName("ResumenMes");

  var dataDia = hojaDia.getDataRange().getValues();
  var dataMes = hojaMes.getDataRange().getValues();

  var textoDia = formatearDia(dataDia);
  var textoMes = formatearMes(dataMes);

  var mensaje =
    "📊 *Resumen Día (Actual)*\n```\n" +
    textoDia +
    "```\n\n📈 *Resumen Mensual*\n```\n" +
    textoMes +
    "```";

  var url = "https://api.telegram.org/bot" + token + "/sendMessage";

  UrlFetchApp.fetch(url, {
    method: "post",
    payload: {
      chat_id: chat_id,
      text: mensaje,
      parse_mode: "Markdown"
    }
  });
}

function formatearDia(matriz) {
  var out = "Día     | Total\n";
  matriz.slice(1).forEach(function(r) {
    var fecha = formatearFechaCorta(r[0]);  
    var total = formatearNumero(r[1]);
    out += fecha + " | " + total + "\n";
  });
  return out;
}

function formatearMes(matriz) {
  var out = "Mes        | Total\n";
  matriz.slice(1).forEach(function(r) {
    var mes = formatearMesCorto(r[0]);
    var total = formatearNumero(r[1]);
    out += mes + " | " + total + "\n";
  });
  return out;
}

// -------------------------
// Utilidades de formato
// -------------------------

function formatearFechaCorta(fecha) {
  return Utilities.formatDate(new Date(fecha), "GMT-6", "dd/MM");
}

function formatearMesCorto(fecha) {
  return Utilities.formatDate(new Date(fecha), "GMT-6", "MMM yyyy").toUpperCase();
}

function formatearNumero(n) {
  return Number(n).toLocaleString('es-MX');
}

function resumenVentasPorDiaMesActual1() {
  const ss = SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  const hoja = ss.getSheets()[0];
  const data = hoja.getDataRange().getValues();

  const headers = data[0];
  const idxFecha = headers.indexOf("Fecha");
  const idxVenta = headers.indexOf("Venta");

  if (idxFecha === -1 || idxVenta === -1) {
    Logger.log("❌ Columnas 'Fecha' o 'Venta' no encontradas");
    return;
  }

  let hoy = new Date();
  let currentMonth = hoy.getMonth();      // 0 = enero
  let currentYear = hoy.getFullYear();

  let ventasPorDia = {};

  for (let i = 1; i < data.length; i++) {
    let fechaRaw = data[i][idxFecha];
    let venta = Number(data[i][idxVenta]);

    if (!fechaRaw || isNaN(venta)) continue;

    let fecha = new Date(fechaRaw);
    if (isNaN(fecha)) continue;

    if (fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear) {
      let dia = fecha.getDate();
      let key = `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;

      if (!ventasPorDia[key]) ventasPorDia[key] = 0;

      ventasPorDia[key] += venta;
    }
  }

  // Crear hoja o sección de salida
  let hojaResumen = ss.getSheetByName("ResumenDiaMesActual");
  if (!hojaResumen) hojaResumen = ss.insertSheet("ResumenDiaMesActual");
  hojaResumen.clear();

  hojaResumen.getRange(1, 1).setValue("Día");
  hojaResumen.getRange(1, 2).setValue("Total Venta");

  let fila = 2;
  for (let dia in ventasPorDia) {
    hojaResumen.getRange(fila, 1).setValue(dia);
    hojaResumen.getRange(fila, 2).setValue(ventasPorDia[dia]);
    fila++;
  }

  Logger.log("✔ Resumen por día del mes actual listo");
}

function resumenVentasPorMes1() {
  const ss = SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  const hoja = ss.getSheets()[0];   // Toma la primer hoja del archivo
  const data = hoja.getDataRange().getValues();

  if (data.length < 2) {
    Logger.log("❌ No hay datos");
    return;
  }

  // Detectar columnas por nombre
  const headers = data[0];

  const idxFecha = headers.indexOf("Fecha");
  const idxVenta = headers.indexOf("Venta");

  if (idxFecha === -1 || idxVenta === -1) {
    Logger.log("❌ No se encontraron las columnas 'Fecha' o 'Venta'");
    return;
  }

  let ventasPorMes = {};

  for (let i = 1; i < data.length; i++) {
    let fechaRaw = data[i][idxFecha];
    let venta = Number(data[i][idxVenta]);

    if (!fechaRaw || isNaN(venta)) continue;

    let fecha = new Date(fechaRaw);
    if (isNaN(fecha)) {
      Logger.log("⚠ Fecha no válida:", fechaRaw);
      continue;
    }

    let mes = fecha.getMonth() + 1;
    let year = fecha.getFullYear();

    let key = `${year}-${String(mes).padStart(2, "0")}`;

    if (!ventasPorMes[key]) ventasPorMes[key] = 0;

    ventasPorMes[key] += venta;

    Logger.log(`OK: ${key} → +${venta}`);
  }

  // Crear hoja de salida
  let hojaResumen = ss.getSheetByName("ResumenMes");
  if (!hojaResumen) hojaResumen = ss.insertSheet("ResumenMes");
  hojaResumen.clear();

  hojaResumen.getRange(1, 1).setValue("Mes");
  hojaResumen.getRange(1, 2).setValue("Total Venta");

  let fila = 2;
  for (let mes in ventasPorMes) {
    hojaResumen.getRange(fila, 1).setValue(mes);
    hojaResumen.getRange(fila, 2).setValue(ventasPorMes[mes]);
    fila++;
  }

  Logger.log("✔ Proceso terminado");
}

// function enviarRecordatorioTelegram() {
//     var token = "7947319144:AAE_RsZXslz5e8Z32DrZAJvdKPmTFJfa4FQ";  // Reemplaza con el token de tu bot de Telegram
//     var chat_id = "1318922238";   // Reemplaza con tu chat ID
    
//     var calendarId = "primary";  // Usa "primary" para el calendario principal
//     var eventos = CalendarApp.getCalendarById(calendarId).getEventsForDay(new Date());
    
//     var mensaje = "📅 *Eventos de hoy:*\n";
//     if (eventos.length === 0) {
//         mensaje += "No tienes eventos programados.";
//     } else {
//         eventos.forEach(function(evento) {
//             var titulo = evento.getTitle();
//             var horaInicio = Utilities.formatDate(evento.getStartTime(), Session.getScriptTimeZone(), "HH:mm");
//             mensaje += `🔹 *${titulo}* - ⏰ ${horaInicio}\n`;
//         });
//     }
    
//     var url = "https://api.telegram.org/bot" + token + "/sendMessage";
//     var opciones = {
//         method: "post",
//         payload: {
//             chat_id: chat_id,
//             text: mensaje,
//             parse_mode: "Markdown"
//         }
//     };
    
//     UrlFetchApp.fetch(url, opciones);
// }

