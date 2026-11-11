function enviarTelegramHTML_As(mensaje, chatId) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

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