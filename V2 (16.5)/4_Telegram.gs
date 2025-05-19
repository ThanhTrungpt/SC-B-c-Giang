/**
 * Telegram integration module for repair management system
 * Handles notifications to users and groups via Telegram bot
 */

// ===== 1. TELEGRAM API CONSTANTS =====
const TELEGRAM_CONFIG = {
  api_token: "8150634839:AAFFG7s-7zYcBsYlDWqFYybdejOAOvket1Y", // Replace with actual bot token
  group_chat_id: "-4705814679"   // Replace with actual group chat ID
};

// ===== 2. NOTIFICATION FUNCTIONS =====

/**
 * Sends a repair notification to a Telegram group
 * @param {Array} repairData - Array with repair data
 * @param {Array} equipmentData - Array with equipment data
 * @param {Array} repairPersonData - Array with repair personnel data
 * @param {Array} departmentData - Array with department data
 * @returns {Object} - Response from Telegram API
 */
function tele_sendsms_group(repairData) {
  const msgData = [];
  msgData.push([new Date(), "[tele_sendsms_group] - Sending group notification for repair ID: " + repairData[CONFIG_COLUMNS.DataSC.id]]);
  
  try {
    // Check if we have all required data
    if (!repairData) {
      msgData.push([new Date(), "[tele_sendsms_group] - Missing required data for notification"]);
      logDebugData(msgData);
      return null;
    }
    
    // Format message with emojis and proper formatting
    const message = `🔔 *BÁO HỎNG THIẾT BỊ MỚI* 🔔
━━━━━━━━━━━━━━━━━━━━━━━━
🆔 *ID:* ${repairData.id_repair}
🏥 *Đơn vị báo hỏng:* ${repairData.Ten_donvi}
🔧 *Thiết bị:* ${repairData.Name_ThietBi}
📋 *Model:* ${repairData.text_Model}
🔢 *Serial:* ${repairData.text_Serial}
⚠️ *Tình trạng:* ${repairData.TinhTrang_ThietBi}
⏱️ *Mức độ ưu tiên:* ${repairData.text_MucDo_YeuCau}
👤 *Người yêu cầu:* ${repairData.Name_NguoiYeuCau} (${repairData.SDT_NguoiYeuCau})
${repairData.Name_NguoiSua ? `👨‍🔧 *Người phụ trách:* ${repairData.Name_NguoiSua}` : ""}`;

    // Send message to group
    const response = sendTelegramMessage(TELEGRAM_CONFIG.group_chat_id, message, true);
    
    msgData.push([new Date(), "[tele_sendsms_group] - Message sent successfully"]);
    logDebugData(msgData);
    
    return response;
  } catch (error) {
    msgData.push([new Date(), "[tele_sendsms_group] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    // Don't throw error to prevent disrupting the main flow
    return null;
  }
}

/**
 * Sends a repair notification to an individual user
 * @param {Array} repairData - Array with repair data
 * @param {Array} equipmentData - Array with equipment data
 * @param {Array} repairPersonData - Array with repair personnel data
 * @param {Array} departmentData - Array with department data
 * @param {string} chatId - Telegram chat ID of the user
 * @returns {Object} - Response from Telegram API
 */
function tele_sendsms_user(repairData) {
  const msgData = [];
  msgData.push([new Date(), "[tele_sendsms_user] - Sending user notification to: " + repairData.ID_Telegram_NguoiSua]);
  
  try {
    // Check if we have all required data
    if (!repairData) {
      msgData.push([new Date(), "[tele_sendsms_user] - Missing required data for notification"]);
      logDebugData(msgData);
      return null;
    }
    
    // Get the chat ID of the repair person
    const chatId = repairData.ID_Telegram_NguoiSua;
    
    if (!chatId) {
      msgData.push([new Date(), "[tele_sendsms_user] - No Telegram ID found for repair person"]);
      logDebugData(msgData);
      return null;
    }
    
    // Format message with emojis and proper formatting
    const message = `🔔 *THÔNG BÁO NHIỆM VỤ MỚI* 🔔
━━━━━━━━━━━━━━━━━━━━━━━━
🆔 *ID:* ${repairData.id_repair}
🏢 *Đơn vị báo hỏng:* ${repairData.Ten_donvi}
🔧 *Thiết bị:* ${repairData.Name_ThietBi}
📋 *Model:* ${repairData.text_Model}
📌 *Serial:* ${repairData.text_Serial}
⚠️ *Tình trạng:* ${repairData.TinhTrang_ThietBi}
🚨 *Mức độ ưu tiên:* ${repairData.text_MucDo_YeuCau}
👤 *Người yêu cầu:* ${repairData.Name_NguoiYeuCau} (${repairData.SDT_NguoiYeuCau})
━━━━━━━━━━━━━━━━━━━━━━━━
✅ Vui lòng kiểm tra và xử lý sớm.
🙏 Cảm ơn!`;

    // Send message to user
    const response = sendTelegramMessage(chatId, message, true);
    
    msgData.push([new Date(), "[tele_sendsms_user] - Message sent successfully to: " + chatId]);
    logDebugData(msgData);
    
    return response;
  } catch (error) {
    msgData.push([new Date(), "[tele_sendsms_user] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    // Don't throw error to prevent disrupting the main flow
    return null;
  }
}

/**
 * Sends a message to a Telegram chat
 * @param {string} chatId - Telegram chat ID
 * @param {string} message - Message to send
 * @param {boolean} [markdown=false] - Whether to use Markdown formatting
 * @returns {Object} - Response from Telegram API
 */
function sendTelegramMessage(chatId, message, markdown = false) {
  if (!chatId || !message) {
    return null;
  }
  
  try {
    // Prepare API URL
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.api_token}/sendMessage`;
    
    // Prepare payload
    const payload = {
      chat_id: chatId,
      text: message,
      parse_mode: markdown ? "Markdown" : undefined
    };
    
    // Prepare options
    const options = {
      method: "POST",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    };
    
    // Send request
    const response = UrlFetchApp.fetch(apiUrl, options);
    return JSON.parse(response.getContentText());
  } catch (error) {
    console.error("Error sending Telegram message: " + error);
    return null;
  }
}

/**
 * Updates Telegram chat ID for a repair user
 * @param {string} userId - User ID
 * @param {string} chatId - Telegram chat ID
 * @returns {boolean} - True if successful
 */
function updateTelegramChatId(userId, chatId) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DanhSach);
    const sheet = ss.getSheetByName(CONFIG_SHEET_NAMES.DSUserSua);
    const data = sheet.getDataRange().getValues();
    
    const userRow = getfilterrow(data, CONFIG_COLUMNS.DSUserSua.id, userId);
    if (!userRow) {
      return false;
    }
    
    const rowIndex = data.indexOf(userRow) + 1;
    sheet.getRange(rowIndex, CONFIG_COLUMNS.DSUserSua.usetele + 1, 1, 1).setValue(chatId);
    
    return true;
  } catch (error) {
    console.error("Error updating Telegram chat ID: " + error);
    return false;
  }
}