function enviarTelegramHTML_1(mensaje, chatId) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

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