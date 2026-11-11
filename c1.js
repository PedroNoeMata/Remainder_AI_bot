const URL_SHEET = "https://docs.google.com/spreadsheets/d/1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ/edit#gid=1445570305";
const HOJA_DIA = "ResumenDiaMesActual";
const HOJA_MES = "ResumenMes";
const ID = "1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ";

function resumenVentasPorDiaMesActual(agenteFiltro) {

  const ss = SpreadsheetApp.openById(ID);
  const hoja = ss.getSheets()[0];

  // 🔒 Leer TODO como TEXTO
  const data = hoja.getDataRange().getDisplayValues();

  const headers = data[0];
  const idxFecha  = headers.indexOf("Fecha");
  const idxVenta  = headers.indexOf("Venta");
  const idxAgente = headers.indexOf("Agente");

  if (idxFecha === -1 || idxVenta === -1 || idxAgente === -1) {
    throw new Error("Columnas requeridas no encontradas");
  }

  const hoy = new Date();
  const currentYear  = hoy.getFullYear();
  const currentMonth = hoy.getMonth() + 1;

  let ventasPorDia = {};
  const esDibe = agenteFiltro === "DIBE";

  for (let i = 1; i < data.length; i++) {

    const agente = data[i][idxAgente];
    if (!esDibe && agente !== agenteFiltro) continue;

    const fechaTxt = data[i][idxFecha]; // yyyy-mm-dd
    const venta = Number(data[i][idxVenta].replace(/,/g, ""));

    if (!fechaTxt || isNaN(venta)) continue;

    const [y, m, d] = fechaTxt.split("-").map(Number);

    if (y !== currentYear || m !== currentMonth) continue;

    const key = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    ventasPorDia[key] = (ventasPorDia[key] || 0) + venta;
  }

  // ===== SALIDA =====
  let hojaResumen = ss.getSheetByName("ResumenDiaMesActual");
  if (!hojaResumen) hojaResumen = ss.insertSheet("ResumenDiaMesActual");
  hojaResumen.clear();

  hojaResumen.getRange(1, 1, 1, 2)
    .setValues([["Día", "Total Venta"]]);

  const resumenOrdenado = Object.entries(ventasPorDia)
    .sort((a, b) => a[0].localeCompare(b[0]));

  if (resumenOrdenado.length > 0) {
    hojaResumen
      .getRange(2, 1, resumenOrdenado.length, 2)
      .setValues(resumenOrdenado);

    // Forzar texto (evita reinterpretación)
    hojaResumen.getRange(2, 1, resumenOrdenado.length, 1)
      .setNumberFormat("@");
  }
}

function probarResumenesPorAgente() {
  const agentesPrueba = ["DIBE"];

  agentesPrueba.forEach(agente => {
    Logger.log("====================================");
    Logger.log("Probando agente: " + agente);

    const ventasDia = resumenVentasPorDiaMesActual(agente);
    // const ventasMes = resumenVentasPorMes(agente);

    Logger.log("Ventas por día (mes actual):");
    Logger.log(JSON.stringify(ventasDia, null, 2));

    // Logger.log("Ventas por mes:");
    // Logger.log(JSON.stringify(ventasMes, null, 2));
  });
}

function tablaTextoDia1() {
  const ss = SpreadsheetApp.openByUrl(URL_SHEET);
  const hoja = ss.getSheetByName(HOJA_DIA);
  const datos = hoja.getDataRange().getValues();

  let txt = "📊  Resumen del Día\n";
  txt += "──────────────\n";
  txt += "Día        | Total Venta\n";
  txt += "──────────────\n";

  for (let i = 1; i < datos.length; i++) {
    const dia = formatoFechaCorta(datos[i][0]).padEnd(11, " ");
    const venta = formatoNumero(datos[i][1]);
    txt += `${dia} | ${venta}\n`;
  }

  return txt;
}

function tablaTextoMes1() {
  const ss = SpreadsheetApp.openByUrl(URL_SHEET);
  const hoja = ss.getSheetByName(HOJA_MES);
  const datos = hoja.getDataRange().getValues();

  let txt = "\n📈  Resumen Mensual\n";
  txt += "────────────────────────────\n";
  txt += "Mes        | Venta | PPTO | % VS PPTO\n";
  txt += "────────────────────────────\n";

  for (let i = 1; i < datos.length; i++) {
    const mes = formatoMesAnio(datos[i][0]).padEnd(11, " ");
    const venta = formatoNumero(datos[i][1]);
    const ppto = formatoNumero(datos[i][2]);
    // const vsPpto = formatoNumero(datos[i][3]);
    const vsPpto = (datos[i][3] * 100).toFixed(1) + "%";

    txt += `${mes} | ${venta} | ${ppto} | ${vsPpto}\n`;
  }

  return txt;
}

function tablaTextoMes2() {
  const ss = SpreadsheetApp.openByUrl(URL_SHEET);
  const hoja = ss.getSheetByName(HOJA_MES);
  const datos = hoja.getDataRange().getValues();

  let txt = "\n📈  Resumen Mensual\n";
  txt += "──────────────\n";
  txt += "Mes        | Total Venta\n";
  txt += "──────────────\n";

  for (let i = 1; i < datos.length; i++) {
    const mes = formatoMesAnio(datos[i][0]).padEnd(11, " ");
    const venta = formatoNumero(datos[i][1]);
    txt += `${mes} | ${venta}\n`;
  }

  return txt;
}

function formatoFechaCorta1(fecha) {
  return Utilities.formatDate(new Date(fecha), "GMT-6", "EEE dd MMM");
}

function formatoFechaCorta(fecha) {
  const f = new Date(fecha);

  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  const diaSemana = dias[f.getDay()];
  const diaMes = String(f.getDate()).padStart(2, "0");
  const mes = meses[f.getMonth()];

  return `${diaSemana} ${diaMes} ${mes}`;
}

function formatoMesAnio1(fecha) {
  return Utilities.formatDate(new Date(fecha), "GMT-6", "MMM yyyy");
}

function formatoMesAnio(fecha) {
  const f = new Date(fecha);

  const meses = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ];

  const mes = meses[f.getMonth()];
  const anio = f.getFullYear();

  return `${mes} ${anio}`;
}

function formatoNumero(valor) {
  if (valor === null || valor === "" || valor === undefined) return "0";

  let num = Number(valor);
  if (isNaN(num)) return valor.toString();  // Si no es número, lo deja tal cual

  return num.toLocaleString("en-US");  // 1,234,567
}

function obtenerPropiedadTelegram_(clave) {
  const valor = PropertiesService.getScriptProperties().getProperty(clave);
  if (!valor) throw new Error(`Falta configurar la propiedad de Script Properties: ${clave}`);
  return valor.trim();
}

function obtenerTokenTelegram_() {
  return obtenerPropiedadTelegram_("TELEGRAM_TOKEN");
}

function obtenerChatIdTelegram_() {
  return obtenerPropiedadTelegram_("TELEGRAM_CHAT_ID");
}

function enviarTelegramHTML(mensaje, chatId) {
  const token = obtenerTokenTelegram_();
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const opciones = {
    method: "post",
    payload: {
      chat_id: String(chatId),
      text: mensaje,
      parse_mode: "HTML"
    }
  };

  UrlFetchApp.fetch(url, opciones);
}

function enviarTelegramHTML1(mensaje, chatId) {
  const token = obtenerTokenTelegram_();
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  // Lista de chat_id (usuarios, grupos o canales)
  const CHAT_IDS = chatId;

  CHAT_IDS.forEach(chatId => {
    const opciones = {
      method: "post",
      payload: {
        chat_id: chatId,
        text: mensaje,
        parse_mode: "HTML"
      },
      muteHttpExceptions: true
    };

    UrlFetchApp.fetch(url, opciones);
  });
}






