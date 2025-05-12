/**
 * @fileoverview File điểm vào chính của ứng dụng quản lý sửa chữa thiết bị
 * Bệnh viện Đa khoa Bắc Giang
 */

/**
 * Hàm được gọi khi truy cập ứng dụng web
 * @param {Object} e - Dữ liệu GET
 * @returns {HtmlOutput|TextOutput} Trang HTML hoặc phản hồi JSON
 */
function doGet(e) {
  // Kiểm tra xem có tham số yêu cầu API không
  if (e && e.parameter && e.parameter.action) {
    // Xử lý các yêu cầu API
    switch (e.parameter.action) {
      case 'checkSetup':
        // Kiểm tra cài đặt hệ thống
        const setupStatus = checkSetup();
        return ContentService.createTextOutput(JSON.stringify(setupStatus))
          .setMimeType(ContentService.MimeType.JSON);
          
      case 'initApp':
        // Khởi tạo ứng dụng
        const initResult = initApp();
        return ContentService.createTextOutput(JSON.stringify(initResult))
          .setMimeType(ContentService.MimeType.JSON);
          
      case 'getPartialData':
        // Lấy dữ liệu từng phần
        const part = e.parameter.part || 'essential';
        try {
          const data = getPartialData(part);
          return ContentService.createTextOutput(data)
            .setMimeType(ContentService.MimeType.JSON);
        } catch (error) {
          return ContentService.createTextOutput(JSON.stringify({
            error: true, 
            message: `Lỗi khi lấy dữ liệu ${part}: ${error.message}`
          }))
            .setMimeType(ContentService.MimeType.JSON);
        }
        
      default:
        // Yêu cầu không hợp lệ
        return ContentService.createTextOutput(JSON.stringify({
          error: true, 
          message: `Yêu cầu không hợp lệ: ${e.parameter.action}`
        }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Trường hợp mặc định: trả về trang HTML
  const template = HtmlService.createTemplateFromFile('index.html');
  // Truyền CONFIG từ server xuống client
  template.CONFIG = CONFIG;
  
  return template
    .evaluate()
    .setTitle('Phần mềm quản lý sửa chữa - Bệnh viện Đa khoa Bắc Giang')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Hàm được gọi khi có dữ liệu POST được gửi tới ứng dụng
 * @param {Object} e - Dữ liệu POST
 * @returns {TextOutput|HtmlOutput} Phản hồi
 */
function doPost(e) {
  try {
    // Kiểm tra và xử lý dữ liệu webhook từ Telegram (nếu có)
    if (e && e.postData && e.postData.type === 'application/json') {
      const data = JSON.parse(e.postData.contents);
      
      // Xử lý webhook
      processTelegramWebhook(data);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Webhook processed'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Xử lý các loại POST khác
    return HtmlService.createHtmlOutput('Method not supported');
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Gọi khi ứng dụng cần thiết lập hoặc khởi tạo
 */
function setup() {
  // Tạo trigger để xử lý các sự kiện theo lịch
  const triggers = ScriptApp.getProjectTriggers();
  
  // Xóa tất cả trigger hiện có
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Thiết lập trigger hàng ngày để gửi báo cáo
  ScriptApp.newTrigger('dailyReport')
    .timeBased()
    .atHour(7)
    .everyDays(1)
    .create();
  
  // Thiết lập webhook cho Telegram bot
  setupTelegramWebhook();
}

/**
 * Hàm chạy hàng ngày để gửi báo cáo
 */
function dailyReport() {
  // Lấy dữ liệu từ sheet
  const allData = getAllData();
  
  // Lọc các báo cáo mới trong 24h qua
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const newReports = allData.val_MainSC.filter(row => {
    if (!row[CONFIG.COLUMNS.MainSC.THOI_GIAN_DV_BAO_DataSC]) return false;
    
    const reportTime = new Date(row[CONFIG.COLUMNS.MainSC.THOI_GIAN_DV_BAO_DataSC]);
    return reportTime >= oneDayAgo && reportTime <= now;
  });
  
  // Tạo báo cáo hàng ngày (giả định đã có hàm này)
  if (newReports.length > 0) {
    sendDailyReportViaTelegram(newReports);
  }
}

/**
 * Thêm nội dung HTML từ file
 * @param {string} filename - Tên file cần thêm
 * @returns {string} Nội dung HTML
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Lấy dữ liệu cho trang web
 * @returns {string} Dữ liệu dạng JSON
 */
function getWebData() {
  // Lấy thông tin user được lưu trong cache nếu có
  let userInfo = "Unknown";
  try {
    const cache = CacheService.getScriptCache();
    const userCacheData = cache.get('current_user');
    if (userCacheData) {
      const userData = JSON.parse(userCacheData);
      userInfo = userData.donVi || userData.hoTen || userData.username || "Unknown";
    }
  } catch (e) {
    // Ignore
  }
  
  // Ghi log thông tin debug
  const msgData = [
    [new Date(), 'getWebData', 'Bắt đầu lấy dữ liệu', userInfo]
  ];
  
  try {
    // Lấy tất cả dữ liệu cần thiết
    const allData = getAllData();
    
    // Ghi log thành công
    msgData.push([new Date(), 'getWebData', 'Lấy dữ liệu thành công', userInfo]);
    
    // Lưu log vào Google Sheets
    saveLogData(msgData);
    
    return JSON.stringify(allData);
  } catch (error) {
    // Ghi log lỗi
    msgData.push([new Date(), 'getWebData', `Lỗi: ${error.message}`, userInfo]);
    saveLogData(msgData);
    
    throw error;
  }
}

/**
 * Lấy dữ liệu từng phần
 * @param {string} part - Phần dữ liệu cần lấy (essential, main, secondary)
 * @returns {string} Dữ liệu dạng JSON
 */
function getPartialData(part) {
  // Lấy thông tin user được lưu trong cache nếu có
  let userInfo = "Unknown";
  try {
    const cache = CacheService.getScriptCache();
    const userCacheData = cache.get('current_user');
    if (userCacheData) {
      const userData = JSON.parse(userCacheData);
      userInfo = userData.donVi || userData.hoTen || userData.username || "Unknown";
    }
  } catch (e) {
    console.error("Lỗi khi lấy thông tin người dùng từ cache:", e);
    // Vẫn tiếp tục tiến trình, không dừng lại
  }
  
  // Ghi log thông tin debug
  const msgData = [
    [new Date(), 'getPartialData', `Bắt đầu lấy dữ liệu phần: ${part}`, userInfo]
  ];
  saveLogData(msgData);
  
  try {
    let result = {};
    const startTime = new Date().getTime();
    
    // Dựa vào phần yêu cầu, lấy dữ liệu tương ứng
    switch (part) {
      case 'essential':
        // Dữ liệu thiết yếu: Dữ liệu người dùng và danh sách người sửa
        result = getEssentialData();
        break;
      case 'main':
        // Dữ liệu chính: Dữ liệu sửa chữa và thiết bị
        result = getMainData();
        break;
      case 'secondary':
        // Dữ liệu phụ: Các cài đặt khác
        result = getSecondaryData();
        break;
      default:
        throw new Error(`Phần dữ liệu không hợp lệ: ${part}`);
    }
    
    const endTime = new Date().getTime();
    const executionTime = (endTime - startTime) / 1000;
    
    // Ghi log thành công
    msgData.push([new Date(), 'getPartialData', `Lấy dữ liệu phần ${part} thành công (${executionTime}s)`, userInfo]);
    saveLogData(msgData);
    
    return JSON.stringify(result);
  } catch (error) {
    // Ghi log lỗi
    msgData.push([new Date(), 'getPartialData', `Lỗi khi lấy dữ liệu phần ${part}: ${error.message}`, userInfo]);
    saveLogData(msgData);
    
    // Thử trả về một phần dữ liệu hoặc thông báo lỗi
    try {
      return JSON.stringify({
        error: true,
        message: `Lỗi khi lấy dữ liệu phần ${part}: ${error.message}`,
        errorDetail: error.stack
      });
    } catch (jsonError) {
      // Nếu không thể chuyển đổi lỗi sang JSON, trả về thông báo lỗi dạng string
      return `{"error":true,"message":"Lỗi khi lấy dữ liệu phần ${part}"}`;
    }
  }
}

/**
 * Lấy dữ liệu thiết yếu (cần cho đăng nhập và hiển thị ban đầu)
 * @returns {Object} Dữ liệu thiết yếu
 */
function getEssentialData() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.FILE_DATA_ID);
    
    // Kiểm tra xem có sheet hay không
    if (!ss) {
      throw new Error(`Không thể mở spreadsheet với ID: ${CONFIG.FILE_DATA_ID}`);
    }
    
    // Lấy dữ liệu người dùng
    const sh_DSUserDV = ss.getSheetByName(CONFIG.SHEET_NAMES.DSUserDV);
    if (!sh_DSUserDV) {
      throw new Error(`Không tìm thấy sheet ${CONFIG.SHEET_NAMES.DSUserDV}`);
    }
    const val_DSUserDV = sh_DSUserDV.getDataRange().getValues();
    
    const sh_DSUserSua = ss.getSheetByName(CONFIG.SHEET_NAMES.DSUserSua);
    if (!sh_DSUserSua) {
      throw new Error(`Không tìm thấy sheet ${CONFIG.SHEET_NAMES.DSUserSua}`);
    }
    const val_DSUserSua = sh_DSUserSua.getDataRange().getValues();
    
    return {
      val_DSUserDV,
      val_DSUserSua
    };
  } catch (error) {
    console.error("Lỗi trong getEssentialData:", error);
    throw error; // Re-throw để xử lý ở cấp cao hơn
  }
}

/**
 * Lấy dữ liệu chính (danh sách sửa chữa)
 * @returns {Object} Dữ liệu chính
 */
function getMainData() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.FILE_DATA_ID);
    if (!ss) {
      throw new Error(`Không thể mở spreadsheet với ID: ${CONFIG.FILE_DATA_ID}`);
    }
    
    const mainSS = SpreadsheetApp.openById(CONFIG.FILE_MAIN_DATA_ID);
    if (!mainSS) {
      throw new Error(`Không thể mở spreadsheet với ID: ${CONFIG.FILE_MAIN_DATA_ID}`);
    }
    
    // Lấy dữ liệu thiết bị
    const sh_DSThietBi = ss.getSheetByName(CONFIG.SHEET_NAMES.DSThietBi);
    if (!sh_DSThietBi) {
      throw new Error(`Không tìm thấy sheet ${CONFIG.SHEET_NAMES.DSThietBi}`);
    }
    const val_DSThietBi = sh_DSThietBi.getDataRange().getValues();
    
    // Lấy dữ liệu sửa chữa
    const sh_MainSC = mainSS.getSheetByName(CONFIG.SHEET_NAMES.MainSC);
    if (!sh_MainSC) {
      throw new Error(`Không tìm thấy sheet ${CONFIG.SHEET_NAMES.MainSC}`);
    }
    const val_MainSC = sh_MainSC.getDataRange().getValues();
    
    return {
      val_DSThietBi,
      val_MainSC
    };
  } catch (error) {
    console.error("Lỗi trong getMainData:", error);
    throw error; // Re-throw để xử lý ở cấp cao hơn
  }
}

/**
 * Lấy dữ liệu phụ (cài đặt, nhóm thiết bị)
 * @returns {Object} Dữ liệu phụ
 */
function getSecondaryData() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.FILE_DATA_ID);
    if (!ss) {
      throw new Error(`Không thể mở spreadsheet với ID: ${CONFIG.FILE_DATA_ID}`);
    }
    
    // Lấy dữ liệu nhóm thiết bị
    const sh_DSNhomTB = ss.getSheetByName(CONFIG.SHEET_NAMES.DSNhomTB);
    if (!sh_DSNhomTB) {
      throw new Error(`Không tìm thấy sheet ${CONFIG.SHEET_NAMES.DSNhomTB}`);
    }
    const val_DSNhomTB = sh_DSNhomTB.getDataRange().getValues();
    
    // Lấy dữ liệu cài đặt
    const sh_EnumSetting = ss.getSheetByName(CONFIG.SHEET_NAMES.EnumSetting);
    if (!sh_EnumSetting) {
      throw new Error(`Không tìm thấy sheet ${CONFIG.SHEET_NAMES.EnumSetting}`);
    }
    const val_EnumSetting = sh_EnumSetting.getDataRange().getValues();
    
    // Xử lý danh sách mức độ
    const mucDoList = val_EnumSetting.filter(row => row[1] === 'Mức độ YC')
      .map(row => ({ id: row[0], ten: row[2] }));
    
    return {
      val_DSNhomTB,
      val_EnumSetting,
      mucDoList
    };
  } catch (error) {
    console.error("Lỗi trong getSecondaryData:", error);
    throw error; // Re-throw để xử lý ở cấp cao hơn
  }
}

/**
 * Đăng nhập
 * @param {string} username - Tên đăng nhập
 * @param {string} password - Mật khẩu
 * @returns {Object} Kết quả đăng nhập
 */
function login(username, password) {
  const msgData = [[new Date(), 'login', `Đăng nhập với username: ${username}`, username]];
  
  try {
    const allData = getAllData();
    
    // Tìm kiếm người dùng đơn vị
    const user = allData.val_DSUserDV.find(row => 
      row[CONFIG.COLUMNS.DSUserDV.USERNAME_UDV] === username &&
      row[CONFIG.COLUMNS.DSUserDV.PASSWORK_UDV] === password
    );
    
    if (user) {
      const donVi = user[CONFIG.COLUMNS.DSUserDV.TEN_DON_VI_UDV];
      msgData.push([new Date(), 'login', `Đăng nhập thành công (Đơn vị: ${donVi})`, username]);
      saveLogData(msgData);
      
      // Lưu thông tin người dùng vào cache để sử dụng cho log
      const userData = {
        id: user[CONFIG.COLUMNS.DSUserDV.ID_UDV],
        donVi: donVi,
        username: username
      };
      
      const cache = CacheService.getScriptCache();
      cache.put('current_user', JSON.stringify(userData), 21600); // Cache 6 giờ
      
      return {
        success: true,
        userData: {
          id: user[CONFIG.COLUMNS.DSUserDV.ID_UDV],
          donVi: donVi,
          username: user[CONFIG.COLUMNS.DSUserDV.USERNAME_UDV],
          kiHieu: user[CONFIG.COLUMNS.DSUserDV.KY_HIEU_UDV]
        }
      };
    }
    
    // Kiểm tra người dùng sửa chữa
    const techUser = allData.val_DSUserSua.find(row => 
      row[CONFIG.COLUMNS.DSUserSua.USERNAME_USC] === username &&
      row[CONFIG.COLUMNS.DSUserSua.PASSWORK_USC] === password
    );
    
    if (techUser) {
      const hoTen = techUser[CONFIG.COLUMNS.DSUserSua.HO_VA_TEN_USC];
      msgData.push([new Date(), 'login', `Đăng nhập thành công (Kỹ thuật: ${hoTen})`, username]);
      saveLogData(msgData);
      
      // Lưu thông tin người dùng vào cache để sử dụng cho log
      const userData = {
        id: techUser[CONFIG.COLUMNS.DSUserSua.ID_USC],
        hoTen: hoTen,
        username: username
      };
      
      const cache = CacheService.getScriptCache();
      cache.put('current_user', JSON.stringify(userData), 21600); // Cache 6 giờ
      
      return {
        success: true,
        isTechUser: true,
        userData: {
          id: techUser[CONFIG.COLUMNS.DSUserSua.ID_USC],
          donVi: techUser[CONFIG.COLUMNS.DSUserSua.DON_VI_USC],
          hoTen: hoTen,
          username: techUser[CONFIG.COLUMNS.DSUserSua.USERNAME_USC]
        }
      };
    }
    
    // Đăng nhập thất bại
    msgData.push([new Date(), 'login', `Đăng nhập thất bại`, username]);
    saveLogData(msgData);
    
    return {
      success: false,
      message: 'Tên đăng nhập hoặc mật khẩu không đúng'
    };
  } catch (error) {
    msgData.push([new Date(), 'login', `Lỗi: ${error.message}`, username]);
    saveLogData(msgData);
    
    return {
      success: false,
      message: 'Lỗi hệ thống: ' + error.message
    };
  }
}

/**
 * Đổi mật khẩu
 * @param {string} userId - ID người dùng
 * @param {string} oldPassword - Mật khẩu cũ
 * @param {string} newPassword - Mật khẩu mới
 * @param {boolean} isTechUser - Là người dùng kỹ thuật hay không
 * @returns {Object} Kết quả đổi mật khẩu
 */
function changePassword(userId, oldPassword, newPassword, isTechUser) {
  // Lấy thông tin user được lưu trong cache nếu có
  let userInfo = userId;
  try {
    const cache = CacheService.getScriptCache();
    const userCacheData = cache.get('current_user');
    if (userCacheData) {
      const userData = JSON.parse(userCacheData);
      userInfo = userData.donVi || userData.hoTen || userData.username || userId;
    }
  } catch (e) {
    // Ignore
  }
  
  const msgData = [[new Date(), 'changePassword', `Yêu cầu đổi mật khẩu của user: ${userId}`, userInfo]];
  
  try {
    const ss = SpreadsheetApp.openById(CONFIG.FILE_DATA_ID);
    const sheetName = isTechUser ? CONFIG.SHEET_NAMES.DSUserSua : CONFIG.SHEET_NAMES.DSUserDV;
    const sheet = ss.getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    
    // Tìm người dùng
    const colIndex = isTechUser ? CONFIG.COLUMNS.DSUserSua.ID_USC : CONFIG.COLUMNS.DSUserDV.ID_UDV;
    const pwdColIndex = isTechUser ? CONFIG.COLUMNS.DSUserSua.PASSWORK_USC : CONFIG.COLUMNS.DSUserDV.PASSWORK_UDV;
    
    const rowIndex = data.findIndex(row => row[colIndex] === userId);
    
    if (rowIndex === -1) {
      msgData.push([new Date(), 'changePassword', `Không tìm thấy người dùng: ${userId}`, userInfo]);
      saveLogData(msgData);
      
      return {
        success: false,
        message: 'Không tìm thấy người dùng'
      };
    }
    
    // Kiểm tra mật khẩu cũ
    if (data[rowIndex][pwdColIndex] !== oldPassword) {
      msgData.push([new Date(), 'changePassword', `Mật khẩu cũ không đúng của user: ${userId}`, userInfo]);
      saveLogData(msgData);
      
      return {
        success: false,
        message: 'Mật khẩu cũ không đúng'
      };
    }
    
    // Cập nhật mật khẩu mới
    sheet.getRange(rowIndex + 1, pwdColIndex + 1).setValue(newPassword);
    
    // Làm mới cache
    invalidateCache('all_data');
    
    msgData.push([new Date(), 'changePassword', `Đổi mật khẩu thành công cho user: ${userId}`, userInfo]);
    saveLogData(msgData);
    
    return {
      success: true,
      message: 'Đổi mật khẩu thành công'
    };
  } catch (error) {
    msgData.push([new Date(), 'changePassword', `Lỗi: ${error.message}`, userInfo]);
    saveLogData(msgData);
    
    return {
      success: false,
      message: 'Lỗi hệ thống: ' + error.message
    };
  }
}

/**
 * Lưu log vào Google Sheets
 * @param {Array} logData - Dữ liệu log
 */
function saveLogData(logData) {
  if (!logData || !Array.isArray(logData) || logData.length === 0) {
    // Bỏ qua nếu không có dữ liệu log
    return;
  }
  
  try {
    // Sử dụng spreadsheet ID từ CONFIG
    const logSS = SpreadsheetApp.openById(CONFIG.FILE_LOG_ID);
    if (!logSS) {
      console.error('Không thể mở spreadsheet log:', CONFIG.FILE_LOG_ID);
      return;
    }
    
    const logSheet = logSS.getSheetByName(CONFIG.SHEET_NAMES.Log);
    
    // Nếu không có sheet Log, tạo sheet mới
    if (!logSheet) {
      try {
        const newSheet = logSS.insertSheet(CONFIG.SHEET_NAMES.Log);
        
        // Tạo header cho sheet Log
        newSheet.getRange(1, 1, 1, 4).setValues([['Thời gian', 'Hành động', 'Nội dung', 'Người dùng']]);
        newSheet.getRange(1, 1, 1, 4).setFontWeight('bold');
        newSheet.setFrozenRows(1);
        
        // Format các cột
        newSheet.setColumnWidth(1, 180); // Thời gian
        newSheet.setColumnWidth(2, 150); // Hành động
        newSheet.setColumnWidth(3, 400); // Nội dung
        newSheet.setColumnWidth(4, 150); // Người dùng
        
        // Thêm dữ liệu log vào dòng 2
        newSheet.getRange(2, 1, logData.length, logData[0].length).setValues(logData);
      } catch (sheetError) {
        console.error('Lỗi khi tạo sheet log mới:', sheetError);
      }
    } else {
      // Giới hạn số lượng log để ghi trong một lần để tránh timeout
      const maxBatchSize = 50;
      const totalRows = logData.length;
      
      for (let i = 0; i < totalRows; i += maxBatchSize) {
        const batchEnd = Math.min(i + maxBatchSize, totalRows);
        const currentBatch = logData.slice(i, batchEnd);
        
        try {
          // Thêm dữ liệu log vào cuối sheet
          logSheet.getRange(logSheet.getLastRow() + 1, 1, currentBatch.length, currentBatch[0].length).setValues(currentBatch);
        } catch (batchError) {
          console.error(`Lỗi khi ghi batch log (${i}-${batchEnd}):`, batchError);
          // Tiếp tục với batch tiếp theo
        }
      }
      
      // Kiểm tra số lượng log và dọn dẹp nếu cần
      try {
        const lastRow = logSheet.getLastRow();
        if (lastRow > CONFIG.LOG.MAX_ENTRIES) {
          // Nếu quá số lượng tối đa, xóa các log cũ
          const numRowsToDelete = lastRow - CONFIG.LOG.CLEAN_THRESHOLD;
          if (numRowsToDelete > 0) {
            logSheet.deleteRows(2, numRowsToDelete); // Giữ lại header (dòng 1)
            
            // Ghi log về việc dọn dẹp
            const cleanupMessage = [[new Date(), 'cleanupLogs', `Đã xóa ${numRowsToDelete} log cũ`, 'System']];
            logSheet.getRange(logSheet.getLastRow() + 1, 1, 1, 4).setValues(cleanupMessage);
          }
        }
      } catch (cleanupError) {
        console.error('Lỗi khi dọn dẹp log cũ:', cleanupError);
      }
    }
  } catch (error) {
    console.error('Error saving log data:', error);
    
    // Thử ghi log lỗi vào sheet gốc, nhưng không để lỗi ngăn chặn chương trình
    try {
      // Lưu log về lỗi vào sheet khác
      const fallbackSheet = SpreadsheetApp.openById(CONFIG.FILE_DATA_ID).getSheetByName('ErrorLog');
      if (fallbackSheet) {
        fallbackSheet.appendRow([new Date(), 'saveLogData_error', error.message, 'System']);
      }
    } catch (e) {
      // Không làm gì nếu lỗi khi ghi log lỗi
      console.error('Không thể ghi log lỗi vào sheet dự phòng:', e);
    }
  }
}

/**
 * Kiểm tra ứng dụng đã được cài đặt đúng cách chưa
 * @returns {Object} Thông tin kiểm tra
 */
function checkSetup() {
  try {
    // Kiểm tra cấu trúc Google Sheets
    const sheetStructure = verifyAndCreateSheets(false);
    
    // Thiết lập các trigger nếu cần
    const triggers = ScriptApp.getProjectTriggers();
    const hasDailyTrigger = triggers.some(trigger => 
      trigger.getHandlerFunction() === 'dailyReport' && 
      trigger.getEventType() === ScriptApp.EventType.CLOCK
    );
    
    return {
      success: true,
      sheetStructure,
      triggers: {
        count: triggers.length,
        hasDailyTrigger
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
}

/**
 * Khởi tạo ứng dụng - tạo dữ liệu ban đầu và các trigger cần thiết
 * @returns {Object} Kết quả khởi tạo
 */
function initApp() {
  try {
    // Tạo cấu trúc sheet nếu thiếu
    const sheetStructure = verifyAndCreateSheets(true);
    
    // Thiết lập trigger
    const triggers = ScriptApp.getProjectTriggers();
    
    // Xóa tất cả trigger hiện có
    triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
    
    // Thiết lập trigger hàng ngày để gửi báo cáo
    ScriptApp.newTrigger('dailyReport')
      .timeBased()
      .atHour(7)
      .everyDays(1)
      .create();
    
    // Thiết lập cấu hình Telegram
    try {
      if (CONFIG.TELEGRAM && CONFIG.TELEGRAM.BOT_TOKEN && CONFIG.TELEGRAM.GROUP_CHAT_ID) {
        setTelegramConfig(CONFIG.TELEGRAM.BOT_TOKEN, CONFIG.TELEGRAM.GROUP_CHAT_ID);
      }
    } catch (telegramError) {
      console.error('Lỗi khi thiết lập Telegram:', telegramError);
      // Không dừng quá trình khởi tạo nếu có lỗi Telegram
    }
    
    // Ghi log
    saveLogData([[new Date(), 'initApp', 'Khởi tạo ứng dụng thành công', 'System']]);
    
    return {
      success: true,
      message: 'Khởi tạo ứng dụng thành công',
      sheetStructure,
      triggersCreated: 1
    };
  } catch (error) {
    saveLogData([[new Date(), 'initApp', `Lỗi khi khởi tạo ứng dụng: ${error.message}`, 'System']]);
    
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
}

// Thêm hàm setup để thiết lập cấu hình Telegram
function setupTelegramConfig() {
  // Cài đặt cấu hình Telegram từ file config.gs
  // Giá trị token và chat id được khai báo trong config.gs
  try {
    // Đặt cấu hình an toàn
    setTelegramConfig(CONFIG.TELEGRAM.BOT_TOKEN, CONFIG.TELEGRAM.GROUP_CHAT_ID);
    return {
      success: true,
      message: 'Thiết lập cấu hình Telegram thành công!'
    };
  } catch (error) {
    console.error('Lỗi khi thiết lập cấu hình Telegram:', error);
    return {
      success: false,
      message: 'Lỗi khi thiết lập cấu hình Telegram: ' + error.toString()
    };
  }
} 