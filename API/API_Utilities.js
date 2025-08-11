
// SendtoTelegram
function SendtoTelegram(params, idTelegram, strHeadMsg = "BÁO HỎNG THIẾT BỊ MỚI") {
    try {
        const message = 
    `🔔 - ${strHeadMsg} - 🔔
    ━━━━━━━━━━━━━━━━━━
    🆔 - ID: ${params.repairID}
    🏥 - Đơn vị báo hỏng: ${params.nameuserdv}
    🔧 - Thiết bị: ${params.nameThietbi}
    📋 - Model thiết bị: ${params.nameModel}
    🔢 - Serial thiết bị: ${params.nameSerial}
    ⚠️ - Tình trạng thiết bị: ${params.nameTinhTrang}
    ⏱️ - Mức độ ưu tiên: ${params.nameMucDo}
    👤 - Người yêu cầu: ${params.nameNguoiYeuCau} (Sđt: ${formatPhoneNumber(params.nameSDTYeuCau)})
    👨‍🔧 - Người phụ trách sửa: ${params.nameNguoiSua} (Sđt: ${formatPhoneNumber(params.nameSDTNguoiSua)})`;

    sendTelegramMessage(idTelegram, message);
    } catch (error) {
        console.error("[SendtoTelegram] - Lỗi khi gửi tin nhắn Telegram:", error);
        return { status: "error", message: "Lỗi khi gửi tin nhắn Telegram: " + error.message };
    }
}

// sendTelegramMessage
function sendTelegramMessage(chatId, message) {
  if (!chatId || !message) return null;

  const apiUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.api_token_Tele}/sendMessage`;

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: chatId,
      text: message,
    })
  };

  try {
    const response = UrlFetchApp.fetch(apiUrl, options);
    return JSON.parse(response.getContentText());
  } catch (error) {
    console.log('[sendTelegramMessage] Error:', error.message);
    return null;
  }
}

// Định dạng số điện thoại kiểu 038.994.3573
function formatPhoneNumber(phone) {
    try {
        if (!phone) return "";
        // Chỉ lấy các ký tự số
        const digits = phone.replace(/\D/g, '');
        // Chia thành các nhóm 3-3-4
        return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1.$2.$3');
    }
    catch (error) {
        console.error("[formatPhoneNumber] - Lỗi khi định dạng số điện thoại:", error);
        return phone; // Trả về số điện thoại gốc nếu có lỗi
    }
}