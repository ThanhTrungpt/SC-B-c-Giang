/**
 * @fileoverview Dịch vụ gửi thông báo qua Telegram
 * Bệnh viện Đa khoa Bắc Giang
 */

// Cấu hình Telegram được đọc từ cấu hình ứng dụng và được bảo mật tốt hơn
function getTelegramConfig() {
  return {
    BOT_TOKEN: PropertiesService.getScriptProperties().getProperty('TELEGRAM_BOT_TOKEN') || '',
    GROUP_CHAT_ID: PropertiesService.getScriptProperties().getProperty('TELEGRAM_GROUP_CHAT_ID') || '',
    API_URL: 'https://api.telegram.org/bot'
  };
}

/**
 * Thiết lập webhook cho Telegram Bot
 */
function setupTelegramWebhook() {
  try {
    // Lấy cấu hình Telegram
    const TELEGRAM_CONFIG = getTelegramConfig();
    
    // Kiểm tra cấu hình
    if (!TELEGRAM_CONFIG.BOT_TOKEN) {
      console.error('Thiếu cấu hình BOT_TOKEN cho Telegram');
      return;
    }
    
    // URL của ứng dụng web
    const scriptUrl = ScriptApp.getService().getUrl();
    
    // URL cho webhook Telegram
    const webhookUrl = `${TELEGRAM_CONFIG.API_URL}${TELEGRAM_CONFIG.BOT_TOKEN}/setWebhook?url=${scriptUrl}`;
    
    // Gửi yêu cầu thiết lập webhook
    const response = UrlFetchApp.fetch(webhookUrl);
    const responseData = JSON.parse(response.getContentText());
    
    if (responseData.ok) {
      console.log('Telegram webhook đã được thiết lập thành công!');
    } else {
      console.error('Không thể thiết lập Telegram webhook:', responseData.description);
    }
  } catch (error) {
    console.error('Lỗi khi thiết lập Telegram webhook:', error);
  }
}

/**
 * Xử lý webhook từ Telegram
 * @param {Object} data - Dữ liệu webhook
 */
function processTelegramWebhook(data) {
  try {
    if (!data || !data.message) return;
    
    const chatId = data.message.chat.id;
    const text = data.message.text || '';
    
    // Xử lý các lệnh từ Telegram
    if (text.startsWith('/')) {
      handleTelegramCommand(text, chatId);
    }
  } catch (error) {
    console.error('Lỗi khi xử lý webhook Telegram:', error);
  }
}

/**
 * Xử lý các lệnh từ Telegram
 * @param {string} command - Lệnh nhận được
 * @param {string} chatId - ID của chat
 */
function handleTelegramCommand(command, chatId) {
  switch (command.toLowerCase()) {
    case '/start':
      sendTelegramMessage(chatId, 'Chào mừng đến với Bot Quản lý sửa chữa thiết bị! Gõ /help để xem danh sách lệnh.');
      break;
      
    case '/help':
      sendTelegramMessage(chatId, 
        'Danh sách lệnh:\n' +
        '/start - Bắt đầu sử dụng bot\n' +
        '/help - Hiển thị trợ giúp\n' +
        '/status - Xem trạng thái hệ thống\n' +
        '/report - Xem báo cáo hôm nay'
      );
      break;
      
    case '/status':
      sendSystemStatus(chatId);
      break;
      
    case '/report':
      sendDailyReport(chatId);
      break;
      
    default:
      sendTelegramMessage(chatId, 'Lệnh không được hỗ trợ. Gõ /help để xem danh sách lệnh.');
      break;
  }
}

/**
 * Gửi tin nhắn qua Telegram
 * @param {string} chatId - ID của chat
 * @param {string} message - Nội dung tin nhắn
 * @param {Object} options - Tùy chọn bổ sung
 * @returns {Object} Kết quả gửi tin nhắn
 */
function sendTelegramMessage(chatId, message, options = {}) {
  try {
    // Lấy cấu hình Telegram
    const TELEGRAM_CONFIG = getTelegramConfig();
    
    // Kiểm tra cấu hình
    if (!TELEGRAM_CONFIG.BOT_TOKEN) {
      console.error('Thiếu cấu hình BOT_TOKEN cho Telegram');
      return { ok: false, error: 'Missing BOT_TOKEN configuration' };
    }
    
    const payload = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      ...options
    };
    
    const sendMessageUrl = `${TELEGRAM_CONFIG.API_URL}${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
    
    const response = UrlFetchApp.fetch(sendMessageUrl, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload)
    });
    
    return JSON.parse(response.getContentText());
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn Telegram:', error);
    return { ok: false, error: error.toString() };
  }
}

/**
 * Gửi thông báo báo hỏng mới
 * @param {Object} repairData - Dữ liệu báo hỏng
 * @param {Array} deviceData - Dữ liệu thiết bị
 * @param {Array} unitData - Dữ liệu đơn vị
 * @param {Array} techData - Dữ liệu người sửa
 */
function sendNewRepairNotification(repairData, deviceData, unitData, techData) {
  try {
    // Lấy cấu hình Telegram
    const TELEGRAM_CONFIG = getTelegramConfig();
    
    // Kiểm tra cấu hình
    if (!TELEGRAM_CONFIG.BOT_TOKEN || !TELEGRAM_CONFIG.GROUP_CHAT_ID) {
      console.error('Thiếu cấu hình Telegram');
      return;
    }
    
    // Format dữ liệu
    const repairId = repairData[CONFIG.COLUMNS.MainSC.ID];
    const unitName = unitData ? unitData[CONFIG.COLUMNS.DSUserDV.DON_VI] : 'Không xác định';
    const deviceName = deviceData ? deviceData[CONFIG.COLUMNS.DSThietBi.TEN_THIET_BI] : 'Không xác định';
    const deviceModel = deviceData ? deviceData[CONFIG.COLUMNS.DSThietBi.MODEL] : 'N/A';
    const issueDescription = repairData[CONFIG.COLUMNS.MainSC.TINH_TRANG_TB_DV_BAO] || 'Không có mô tả';
    const requesterName = repairData[CONFIG.COLUMNS.MainSC.HO_TEN] || 'Không xác định';
    const requesterPhone = repairData[CONFIG.COLUMNS.MainSC.SO_DIEN_THOAI] || 'N/A';
    const reportTime = repairData[CONFIG.COLUMNS.MainSC.THOI_GIAN_DV_BAO] || new Date().toLocaleString();
    const techName = techData ? techData[CONFIG.COLUMNS.DSUserSua.HO_TEN] : 'Chưa chỉ định';
    
    // Tạo tin nhắn
    const message = `
<b>🔔 BÁO HỎNG MỚI</b>
<b>Mã:</b> ${repairId}
<b>Đơn vị:</b> ${unitName}
<b>Thiết bị:</b> ${deviceName} (${deviceModel})
<b>Mô tả tình trạng:</b> ${issueDescription}
<b>Người yêu cầu:</b> ${requesterName} - ${requesterPhone}
<b>Thời gian báo:</b> ${reportTime}
<b>Phân công cho:</b> ${techName}
`;
    
    // Gửi tin nhắn đến nhóm chat
    sendTelegramMessage(TELEGRAM_CONFIG.GROUP_CHAT_ID, message);
    
    // Gửi tin nhắn đến người sửa nếu có UserName Telegram
    if (techData && techData[CONFIG.COLUMNS.DSUserSua.USE_TELE]) {
      sendTelegramMessage(techData[CONFIG.COLUMNS.DSUserSua.USE_TELE], message);
    }
  } catch (error) {
    console.error('Lỗi khi gửi thông báo báo hỏng mới:', error);
  }
}

/**
 * Gửi báo cáo hàng ngày về các báo hỏng mới
 * @param {Array} newReports - Danh sách báo hỏng mới
 */
function sendDailyReportViaTelegram(newReports) {
  if (!newReports || newReports.length === 0) return;
  
  try {
    // Lấy cấu hình Telegram
    const TELEGRAM_CONFIG = getTelegramConfig();
    
    // Kiểm tra cấu hình
    if (!TELEGRAM_CONFIG.BOT_TOKEN || !TELEGRAM_CONFIG.GROUP_CHAT_ID) {
      console.error('Thiếu cấu hình Telegram');
      return;
    }
    
    // Tạo tiêu đề báo cáo
    const today = new Date();
    const formattedDate = Utilities.formatDate(today, Session.getScriptTimeZone(), 'dd/MM/yyyy');
    
    let message = `<b>📊 BÁO CÁO HÀNG NGÀY - ${formattedDate}</b>\n`;
    message += `<b>Số báo hỏng mới:</b> ${newReports.length}\n\n`;
    
    // Thêm thông tin từng báo hỏng
    for (let i = 0; i < Math.min(newReports.length, 10); i++) {
      const report = newReports[i];
      const repairId = report[CONFIG.COLUMNS.MainSC.ID];
      const unitId = report[CONFIG.COLUMNS.MainSC.DON_VI];
      const deviceId = report[CONFIG.COLUMNS.MainSC.THIET_BI];
      
      // Lấy thông tin thiết bị và đơn vị
      const deviceData = findDeviceById(deviceId);
      const unitData = findUnitById(unitId);
      
      const deviceName = deviceData ? deviceData[CONFIG.COLUMNS.DSThietBi.TEN_THIET_BI] : 'Không xác định';
      const unitName = unitData ? unitData[CONFIG.COLUMNS.DSUserDV.DON_VI] : 'Không xác định';
      const issueDescription = report[CONFIG.COLUMNS.MainSC.TINH_TRANG_TB_DV_BAO] || 'Không có mô tả';
      
      message += `${i + 1}. <b>${repairId}</b> - ${unitName}\n`;
      message += `   Thiết bị: ${deviceName}\n`;
      message += `   Mô tả: ${issueDescription}\n\n`;
    }
    
    // Thêm thông tin nếu có quá nhiều báo hỏng
    if (newReports.length > 10) {
      message += `... và ${newReports.length - 10} báo hỏng khác\n`;
    }
    
    // Gửi tin nhắn đến nhóm chat
    sendTelegramMessage(TELEGRAM_CONFIG.GROUP_CHAT_ID, message);
  } catch (error) {
    console.error('Lỗi khi gửi báo cáo hàng ngày:', error);
  }
}

/**
 * Gửi trạng thái hệ thống qua Telegram
 * @param {string} chatId - ID của chat
 */
function sendSystemStatus(chatId) {
  try {
    const allData = getAllData();
    
    // Tính toán số lượng
    const totalDevices = allData.val_DSThietBi.length - 1; // Trừ hàng tiêu đề
    const totalRepairs = allData.val_MainSC.length - 1; // Trừ hàng tiêu đề
    const pendingRepairs = allData.val_MainSC.filter(row => 
      row[CONFIG.COLUMNS.MainSC.TRANG_THAI] === CONFIG.REPAIR_STATUS.BAO_HONG
    ).length;
    const inProgressRepairs = allData.val_MainSC.filter(row => 
      row[CONFIG.COLUMNS.MainSC.TRANG_THAI] === CONFIG.REPAIR_STATUS.DANG_SUA
    ).length;
    
    // Tạo tin nhắn trạng thái
    const message = `
<b>📈 TRẠNG THÁI HỆ THỐNG</b>
<b>Tổng số thiết bị:</b> ${totalDevices}
<b>Tổng số báo hỏng:</b> ${totalRepairs}
<b>Đang chờ xử lý:</b> ${pendingRepairs}
<b>Đang sửa chữa:</b> ${inProgressRepairs}
<b>Cập nhật lần cuối:</b> ${new Date().toLocaleString()}
`;
    
    // Gửi tin nhắn
    sendTelegramMessage(chatId, message);
  } catch (error) {
    console.error('Lỗi khi gửi trạng thái hệ thống:', error);
    sendTelegramMessage(chatId, 'Không thể lấy trạng thái hệ thống: ' + error.toString());
  }
}

/**
 * Gửi báo cáo hàng ngày tới một chat cụ thể
 * @param {string} chatId - ID của chat
 */
function sendDailyReport(chatId) {
  try {
    const allData = getAllData();
    
    // Lọc các báo cáo trong 24h qua
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const newReports = allData.val_MainSC.filter(row => {
      if (!row[CONFIG.COLUMNS.MainSC.THOI_GIAN_DV_BAO]) return false;
      
      const reportTime = new Date(row[CONFIG.COLUMNS.MainSC.THOI_GIAN_DV_BAO]);
      return reportTime >= oneDayAgo && reportTime <= now;
    });
    
    if (newReports.length === 0) {
      sendTelegramMessage(chatId, 'Không có báo hỏng mới trong 24 giờ qua.');
      return;
    }
    
    const formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd/MM/yyyy');
    
    let message = `<b>📊 BÁO CÁO HÀNG NGÀY - ${formattedDate}</b>\n`;
    message += `<b>Số báo hỏng mới:</b> ${newReports.length}\n\n`;
    
    // Thêm thông tin từng báo hỏng
    for (let i = 0; i < Math.min(newReports.length, 10); i++) {
      const report = newReports[i];
      const repairId = report[CONFIG.COLUMNS.MainSC.ID];
      const unitId = report[CONFIG.COLUMNS.MainSC.DON_VI];
      const deviceId = report[CONFIG.COLUMNS.MainSC.THIET_BI];
      
      // Lấy thông tin thiết bị và đơn vị
      const deviceData = findDeviceById(deviceId);
      const unitData = findUnitById(unitId);
      
      const deviceName = deviceData ? deviceData[CONFIG.COLUMNS.DSThietBi.TEN_THIET_BI] : 'Không xác định';
      const unitName = unitData ? unitData[CONFIG.COLUMNS.DSUserDV.DON_VI] : 'Không xác định';
      const issueDescription = report[CONFIG.COLUMNS.MainSC.TINH_TRANG_TB_DV_BAO] || 'Không có mô tả';
      
      message += `${i + 1}. <b>${repairId}</b> - ${unitName}\n`;
      message += `   Thiết bị: ${deviceName}\n`;
      message += `   Mô tả: ${issueDescription}\n\n`;
    }
    
    // Thêm thông tin nếu có quá nhiều báo hỏng
    if (newReports.length > 10) {
      message += `... và ${newReports.length - 10} báo hỏng khác\n`;
    }
    
    sendTelegramMessage(chatId, message);
  } catch (error) {
    console.error('Lỗi khi gửi báo cáo hàng ngày:', error);
    sendTelegramMessage(chatId, 'Không thể tạo báo cáo: ' + error.toString());
  }
}

/**
 * Tìm đơn vị theo ID
 * @param {string} unitId - ID đơn vị
 * @returns {Array|null} Dữ liệu đơn vị
 */
function findUnitById(unitId) {
  const allData = getAllData();
  return allData.val_DSUserDV.find(row => 
    row[CONFIG.COLUMNS.DSUserDV.ID] === unitId
  ) || null;
}

/**
 * Thiết lập cấu hình Telegram (chỉ chạy một lần hoặc khi cần cập nhật)
 * @param {string} botToken - Token của bot Telegram
 * @param {string} groupChatId - ID của nhóm chat
 */
function setTelegramConfig(botToken, groupChatId) {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('TELEGRAM_BOT_TOKEN', botToken);
  scriptProperties.setProperty('TELEGRAM_GROUP_CHAT_ID', groupChatId);
  
  // Khởi tạo lại webhook sau khi cập nhật cấu hình
  setupTelegramWebhook();
  
  return { success: true, message: 'Đã cập nhật cấu hình Telegram thành công' };
} 