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
function tele_sendsms_group(textTelegram) {
  const msgData = [];
  msgData.push([new Date(), "[tele_sendsms_group] - Sending group notification for repair ID: " + textTelegram]);
  
  try {
    // Check if we have all required data
    if (!textTelegram) {
      msgData.push([new Date(), "[tele_sendsms_group] - Missing required data for notification"]);
      logDebugData(msgData);
      return null;
    }
    
    // Send message to group
    const response = sendTelegramMessage(TELEGRAM_CONFIG.group_chat_id, textTelegram, true);
    
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
 * @param {string} textTelegram - Text to send
 * @param {string} idTelegram_UserRepair - Telegram chat ID of the user
 * @returns {Object} - Response from Telegram API
 */
function tele_sendsms_user(textTelegram, idTelegram_UserRepair) {
  const msgData = [];
  msgData.push([new Date(), "[tele_sendsms_user] - Sending user notification to: " + idTelegram_UserRepair]);
  
  try {
    // Check if we have all required data
    if (!textTelegram || !idTelegram_UserRepair) {
      msgData.push([new Date(), "[tele_sendsms_user] - Missing required data for notification"]);
      logDebugData(msgData);
      return null;
    }
    
    // Send message to user
    const response = sendTelegramMessage(idTelegram_UserRepair, textTelegram, true);
    
    msgData.push([new Date(), "[tele_sendsms_user] - Message sent successfully to: " + idTelegram_UserRepair]);
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
  const msgData = [];
  if (!chatId || !message) {
    msgData.push([new Date(), "[sendTelegramMessage] - Missing chatId or message"]);
    logDebugData(msgData);
    return null;
  }
  
  try {
    // Prepare API URL
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.api_token}/sendMessage`;
    msgData.push([new Date(), "[sendTelegramMessage] - Preparing to send message to: " + chatId]);
    
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
    msgData.push([new Date(), "[sendTelegramMessage] - Message sent successfully"]);
    logDebugData(msgData);
    return JSON.parse(response.getContentText());
  } catch (error) {
    msgData.push([new Date(), "[sendTelegramMessage] - ERROR: " + error.toString()]);
    logDebugData(msgData);
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