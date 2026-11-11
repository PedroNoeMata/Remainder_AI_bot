// function probarResumenesPorAgente() {
//   const agentesPrueba = ["EDUARDO RODRIGEZ MARROQUIN"];

//   agentesPrueba.forEach(agente => {
//     Logger.log("====================================");
//     Logger.log("Probando agente: " + agente);

//     const ventasDia = resumenVentasPorDiaMesActual(agente);
//     const ventasMes = resumenVentasPorMes_1(agente);

//     Logger.log("Ventas por día (mes actual):");
//     Logger.log(JSON.stringify(ventasDia, null, 2));

//     Logger.log("Ventas por mes:");
//     Logger.log(JSON.stringify(ventasMes, null, 2));
//   });
// }



function resumenVentasPorMes_1(agenteFiltro) {
  const ss = SpreadsheetApp.openById("1BpcNCdqEsmkp0Sc96MLwXGUH_GbSU2l5bRZtXZqPXfQ");
  const hoja = ss.getSheets()[0];
  const data = hoja.getDataRange().getValues();

  const headers = data[0];
  const idxFecha  = headers.indexOf("Fecha");
  const idxVenta  = headers.indexOf("Venta");
  const idxAgente = headers.indexOf("Agente");

  if (idxFecha === -1 || idxVenta === -1 || idxAgente === -1) {
    throw new Error("No se encontraron las columnas requeridas");
  }

  const ventasPorMes = {};
  const esDibe = agenteFiltro === "DIBE";

  for (let i = 1; i < data.length; i++) {
    const agente = data[i][idxAgente];
    if (!esDibe && agente !== agenteFiltro) continue; // 👈 FILTRO ÚNICO

    const fechaRaw = data[i][idxFecha];
    const venta = Number(data[i][idxVenta]);

    if (!fechaRaw || isNaN(venta)) continue;

    const fecha = new Date(fechaRaw);
    const key = Utilities.formatDate(fecha, Session.getScriptTimeZone(), "yyyy-MM");

    ventasPorMes[key] = (ventasPorMes[key] || 0) + venta;
  }

  // ===== PARTE ORIGINAL: GUARDAR EN HOJA =====
  let hojaResumen = ss.getSheetByName("ResumenMes");
  if (!hojaResumen) hojaResumen = ss.insertSheet("ResumenMes");
  
  hojaResumen.clear();
  hojaResumen.getRange(1, 1).setValue("Mes");
  hojaResumen.getRange(1, 2).setValue("Total Venta");
  hojaResumen.getRange(1, 3).setValue("PPTO");
  hojaResumen.getRange(1, 4).setValue("% VS PPTO");

  let fila = 2;

  for (let mes in ventasPorMes) {
    hojaResumen.getRange(fila, 1).setValue(mes);
    hojaResumen.getRange(fila, 2).setValue(ventasPorMes[mes]);
    fila++;
  }

  pegarValoresYPorcentaje();

  Logger.log("✔ Resumen mensual listo");
}
