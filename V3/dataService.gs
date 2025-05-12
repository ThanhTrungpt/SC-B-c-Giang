/**
 * @fileoverview Dịch vụ quản lý dữ liệu cho ứng dụng sửa chữa thiết bị
 * Tối ưu hóa bằng caching và sử dụng ES6
 */

/**
 * Lấy dữ liệu từ cache nếu có, nếu không gọi hàm fetch và cache kết quả
 * @param {string} cacheKey - Khóa cho cache
 * @param {Function} fetchFunction - Hàm lấy dữ liệu khi cache miss
 * @param {number} expirationInSeconds - Thời gian hết hạn cache, mặc định theo cấu hình
 * @returns {Object} Dữ liệu đã cache hoặc mới lấy
 */
function getWithCache(cacheKey, fetchFunction, expirationInSeconds = CONFIG.CACHE.DEFAULT_EXPIRATION) {
  // Lấy thông tin user được lưu trong cache nếu có
  let userInfo = "System";
  try {
    const cache = CacheService.getScriptCache();
    const userCacheData = cache.get('current_user');
    if (userCacheData) {
      const userData = JSON.parse(userCacheData);
      userInfo = userData.donVi || userData.hoTen || userData.username || "System";
    }
  } catch (e) {
    // Ignore
  }
  
  const cache = CacheService.getScriptCache();
  const cachedData = cache.get(cacheKey);
  
  if (cachedData !== null) {
    try {
      // Ghi log cache hit
      saveLogData([[new Date(), 'getWithCache', `Cache hit cho khóa: ${cacheKey}`, userInfo]]);
      return JSON.parse(cachedData);
    } catch (e) {
      // Nếu parse lỗi, fetch dữ liệu mới
      saveLogData([[new Date(), 'getWithCache', `Lỗi parse cache cho khóa ${cacheKey}: ${e.message}`, userInfo]]);
      console.log(`Cache parse error for ${cacheKey}: ${e}`);
    }
  }
  
  // Cache miss hoặc parse lỗi
  saveLogData([[new Date(), 'getWithCache', `Cache miss cho khóa: ${cacheKey}`, userInfo]]);
  const freshData = fetchFunction();
  
  // Cache dữ liệu mới
  try {
    cache.put(cacheKey, JSON.stringify(freshData), expirationInSeconds);
    saveLogData([[new Date(), 'getWithCache', `Đã cache dữ liệu mới cho khóa: ${cacheKey}, hết hạn sau ${expirationInSeconds}s`, userInfo]]);
  } catch (e) {
    saveLogData([[new Date(), 'getWithCache', `Lỗi lưu cache cho khóa ${cacheKey}: ${e.message}`, userInfo]]);
    console.log(`Cache set error for ${cacheKey}: ${e}`);
  }
  
  return freshData;
}

/**
 * Xóa cache cho khóa cụ thể
 * @param {string} cacheKey - Khóa cần xóa
 */
function invalidateCache(cacheKey) {
  const cache = CacheService.getScriptCache();
  cache.remove(cacheKey);
}

/**
 * Lấy tất cả dữ liệu cần thiết cho ứng dụng
 * @returns {Object} Tất cả dữ liệu đã lấy
 */
function getAllData() {
  // Lấy thông tin user được lưu trong cache nếu có
  let userInfo = "System";
  try {
    const cache = CacheService.getScriptCache();
    const userCacheData = cache.get('current_user');
    if (userCacheData) {
      const userData = JSON.parse(userCacheData);
      userInfo = userData.donVi || userData.hoTen || userData.username || "System";
    }
  } catch (e) {
    // Ignore
  }
  
  // Tăng giới hạn thời gian thực thi (nếu có thể)
  try {
    // Lưu ý: Nếu người dùng không có quyền Script.getProjectTriggers, 
    // điều này sẽ gây ra lỗi, nhưng chúng ta bắt nó và tiếp tục
    if (ScriptApp.getScriptTimeZone()) {
      const lock = LockService.getScriptLock();
      lock.tryLock(10000); // Chờ tối đa 10 giây để lấy lock
    }
  } catch (e) {
    console.log("Không thể kéo dài thời gian thực thi:", e);
    // Tiếp tục xử lý
  }
  
  // Ghi log
  const logData = [[new Date(), 'getAllData', 'Bắt đầu lấy dữ liệu...', userInfo]];
  saveLogData(logData);
  
  console.log("Bắt đầu lấy dữ liệu...");
  
  return getWithCache('all_data', () => {
    try {
      const logData = [[new Date(), 'getAllData', 'Cache miss, đang lấy dữ liệu mới từ Google Sheets', userInfo]];
      saveLogData(logData);
      console.log("Cache miss, đang lấy dữ liệu mới từ Spreadsheet...");
      
      // Tùy chỉnh thời gian chạy tối đa
      const startTime = new Date().getTime();
      const maxExecutionTime = 300000; // 5 phút (tối đa cho Google Apps Script)
      
      // Mở các file spreadsheet
      saveLogData([[new Date(), 'getAllData', `Đang mở file dữ liệu chính: ${CONFIG.FILE_DATA_ID}`, userInfo]]);
      const ss = SpreadsheetApp.openById(CONFIG.FILE_DATA_ID);
      console.log("Đã mở Spreadsheet dữ liệu chính: " + CONFIG.FILE_DATA_ID);
      
      saveLogData([[new Date(), 'getAllData', `Đang mở file dữ liệu sửa chữa: ${CONFIG.FILE_MAIN_DATA_ID}`, userInfo]]);
      const mainSS = SpreadsheetApp.openById(CONFIG.FILE_MAIN_DATA_ID);
      console.log("Đã mở Spreadsheet dữ liệu sửa chữa: " + CONFIG.FILE_MAIN_DATA_ID);
      
      // Kiểm tra xem đã tiêu tốn quá nhiều thời gian chưa
      checkExecutionTime(startTime, maxExecutionTime);
      
      // Lấy các sheet
      const sh_DSUserDV = ss.getSheetByName(CONFIG.SHEET_NAMES.DSUserDV);
      if (!sh_DSUserDV) throw new Error(`Không tìm thấy sheet ${CONFIG.SHEET_NAMES.DSUserDV}`);
      
      const sh_DSUserSua = ss.getSheetByName(CONFIG.SHEET_NAMES.DSUserSua);
      if (!sh_DSUserSua) throw new Error(`Không tìm thấy sheet ${CONFIG.SHEET_NAMES.DSUserSua}`);
      
      const sh_DSThietBi = ss.getSheetByName(CONFIG.SHEET_NAMES.DSThietBi);
      if (!sh_DSThietBi) throw new Error(`Không tìm thấy sheet ${CONFIG.SHEET_NAMES.DSThietBi}`);
      
      const sh_DSNhomTB = ss.getSheetByName(CONFIG.SHEET_NAMES.DSNhomTB);
      if (!sh_DSNhomTB) throw new Error(`Không tìm thấy sheet ${CONFIG.SHEET_NAMES.DSNhomTB}`);
      
      const sh_MainSC = mainSS.getSheetByName(CONFIG.SHEET_NAMES.MainSC);
      if (!sh_MainSC) throw new Error(`Không tìm thấy sheet ${CONFIG.SHEET_NAMES.MainSC}`);
      
      const sh_EnumSetting = ss.getSheetByName(CONFIG.SHEET_NAMES.EnumSetting);
      if (!sh_EnumSetting) throw new Error(`Không tìm thấy sheet ${CONFIG.SHEET_NAMES.EnumSetting}`);
      
      console.log("Đã lấy các sheet thành công");
      saveLogData([[new Date(), 'getAllData', 'Đã lấy các sheet thành công', userInfo]]);
      
      // Kiểm tra xem đã tiêu tốn quá nhiều thời gian chưa
      checkExecutionTime(startTime, maxExecutionTime);
      
      // Lấy dữ liệu từ các sheet
      saveLogData([[new Date(), 'getAllData', 'Đang lấy dữ liệu từ sheet DSUserDV', userInfo]]);
      const val_DSUserDV = sh_DSUserDV.getDataRange().getValues();
      console.log(`Đã lấy dữ liệu DSUserDV: ${val_DSUserDV.length} dòng`);
      
      checkExecutionTime(startTime, maxExecutionTime);
      
      saveLogData([[new Date(), 'getAllData', 'Đang lấy dữ liệu từ sheet DSUserSua', userInfo]]);
      const val_DSUserSua = sh_DSUserSua.getDataRange().getValues();
      console.log(`Đã lấy dữ liệu DSUserSua: ${val_DSUserSua.length} dòng`);
      
      checkExecutionTime(startTime, maxExecutionTime);
      
      saveLogData([[new Date(), 'getAllData', 'Đang lấy dữ liệu từ sheet DSThietBi', userInfo]]);
      const val_DSThietBi = sh_DSThietBi.getDataRange().getValues();
      console.log(`Đã lấy dữ liệu DSThietBi: ${val_DSThietBi.length} dòng`);
      
      checkExecutionTime(startTime, maxExecutionTime);
      
      saveLogData([[new Date(), 'getAllData', 'Đang lấy dữ liệu từ sheet DSNhomTB', userInfo]]);
      const val_DSNhomTB = sh_DSNhomTB.getDataRange().getValues();
      console.log(`Đã lấy dữ liệu DSNhomTB: ${val_DSNhomTB.length} dòng`);
      
      checkExecutionTime(startTime, maxExecutionTime);
      
      saveLogData([[new Date(), 'getAllData', 'Đang lấy dữ liệu từ sheet MainSC', userInfo]]);
      const val_MainSC = sh_MainSC.getDataRange().getValues();
      console.log(`Đã lấy dữ liệu MainSC: ${val_MainSC.length} dòng`);
      
      checkExecutionTime(startTime, maxExecutionTime);
      
      saveLogData([[new Date(), 'getAllData', 'Đang lấy dữ liệu từ sheet EnumSetting', userInfo]]);
      const val_EnumSetting = sh_EnumSetting.getDataRange().getValues();
      console.log(`Đã lấy dữ liệu EnumSetting: ${val_EnumSetting.length} dòng`);
      
      checkExecutionTime(startTime, maxExecutionTime);
      
      // Xử lý danh sách độc đáo
      const lr_thietbi = sh_DSThietBi.getLastRow();
      const ds_donvi = sh_DSThietBi.getRange(`B2:B${lr_thietbi}`).getValues();
      const ds_nhomtb = sh_DSThietBi.getRange(`C2:C${lr_thietbi}`).getValues();
      
      checkExecutionTime(startTime, maxExecutionTime);
      
      const lr_suachua = sh_MainSC.getLastRow();
      const ds_trangthaisc = sh_MainSC.getRange(`B2:B${lr_suachua}`).getValues();
      
      // Chuyển đổi thành mảng 1 chiều và lọc các giá trị trống
      const lst_donvi1 = ds_donvi.flat();
      const lst_nhomtb1 = ds_nhomtb.flat();
      const lst_trangthais1 = ds_trangthaisc.flat();
      
      // Loại bỏ trùng lặp với Set
      const lst_donvi = [...new Set(lst_donvi1.filter(item => item.trim !== undefined && item.trim() !== ''))];
      const lst_nhomtb = [...new Set(lst_nhomtb1.filter(item => item.trim !== undefined && item.trim() !== ''))];
      const lst_trangthaisc = [...new Set(lst_trangthais1.filter(item => item !== ''))];
      
      // Lọc danh sách enum theo nhóm
      const mucDoList = val_EnumSetting.filter(row => row[1] === 'Mức độ YC')
        .map(row => ({ id: row[0], ten: row[2] }));
      
      console.log("Đã xử lý dữ liệu thành công");
      
      const result = {
        val_DSUserDV,
        val_DSUserSua,
        val_DSThietBi,
        val_DSNhomTB,
        val_MainSC,
        val_EnumSetting,
        lst_donvi,
        lst_nhomtb,
        lst_trangthaisc,
        mucDoList
      };
      
      // Ghi log
      saveLogData([[new Date(), 'getAllData', 'Lấy dữ liệu thành công', userInfo]]);
      console.log("Hoàn thành lấy dữ liệu");
      return result;
    } catch (error) {
      // Ghi log lỗi
      saveLogData([[new Date(), 'getAllData', `Lỗi: ${error.message}`, userInfo]]);
      console.error("Lỗi khi lấy dữ liệu:", error);
      throw error;
    }
  });
}

/**
 * Kiểm tra thời gian thực thi
 * @param {number} startTime - Thời gian bắt đầu (ms)
 * @param {number} maxTime - Thời gian tối đa (ms)
 */
function checkExecutionTime(startTime, maxTime) {
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - startTime;
  
  if (elapsedTime > maxTime) {
    throw new Error(`Quá thời gian thực thi tối đa (${maxTime/1000}s). Đã chạy ${elapsedTime/1000}s.`);
  }
}

/**
 * Lấy dữ liệu thiết bị theo mã thiết bị
 * @param {string} deviceId - Mã thiết bị
 * @returns {Array|null} Dòng dữ liệu thiết bị hoặc null nếu không tìm thấy
 */
function getDeviceById(deviceId) {
  const allData = getAllData();
  return allData.val_DSThietBi.find(row => row[CONFIG.COLUMNS.DSThietBi.ID_TB] === deviceId) || null;
}

/**
 * Lấy dữ liệu sửa chữa theo ID
 * @param {string} repairId - ID sửa chữa
 * @returns {Array|null} Dòng dữ liệu sửa chữa hoặc null nếu không tìm thấy
 */
function getRepairById(repairId) {
  const allData = getAllData();
  return allData.val_MainSC.find(row => row[CONFIG.COLUMNS.MainSC.ID_DataSC] === repairId) || null;
}

/**
 * Tạo báo cáo sửa chữa mới
 * @param {Object} repairData - Dữ liệu báo cáo
 * @returns {Object} Kết quả sau khi thêm
 */
function createRepairReport(repairData) {
  // Lấy thông tin user được lưu trong cache nếu có
  let userInfo = repairData.hoten || "Unknown";
  try {
    const cache = CacheService.getScriptCache();
    const userCacheData = cache.get('current_user');
    if (userCacheData) {
      const userData = JSON.parse(userCacheData);
      userInfo = userData.donVi || userData.hoTen || userData.username || repairData.hoten || "Unknown";
    }
  } catch (e) {
    // Ignore
  }
  
  const logData = [[new Date(), 'createRepairReport', 'Bắt đầu tạo báo cáo sửa chữa mới', userInfo]];
  saveLogData(logData);
  
  try {
    const ss = SpreadsheetApp.openById(CONFIG.FILE_MAIN_DATA_ID);
    const sheetSC = ss.getSheetByName(CONFIG.SHEET_NAMES.MainSC);
    
    // Tạo ID sửa chữa
    const repairId = generateRepairID(repairData.donvi);
    
    // Ghi log
    saveLogData([[new Date(), 'createRepairReport', `Đã tạo mã báo cáo: ${repairId}`, userInfo]]);
    
    // Lấy thời gian hiện tại
    const now = new Date();
    const formattedDateTime = Utilities.formatDate(
      now, 
      Session.getScriptTimeZone(), 
      'dd/MM/yyyy HH:mm:ss'
    );
    
    // Tạo lịch sử
    const history = `- Ngày ${formattedDateTime}\n   * ${repairData.hoten}: Báo sửa${
      repairData.ghichu ? `\n   * Ghi chú: ${repairData.ghichu}` : ''
    }`;
    
    // Tạo dữ liệu dòng mới
    const newRow = Array(CONFIG.COLUMNS.MainSC.TIME_UPDATE_DataSC + 1).fill(''); // Tạo mảng trống với đủ số cột
    
    // Cập nhật các trường quan trọng
    newRow[CONFIG.COLUMNS.MainSC.ID_DataSC] = repairId;
    newRow[CONFIG.COLUMNS.MainSC.TRANG_THAI_DataSC] = CONFIG.REPAIR_STATUS.BAO_HONG;
    newRow[CONFIG.COLUMNS.MainSC.MUC_DO_DataSC] = repairData.mucDo;
    newRow[CONFIG.COLUMNS.MainSC.DON_VI_DataSC] = repairData.iduserdv;
    newRow[CONFIG.COLUMNS.MainSC.NGUOI_SUA_DataSC] = repairData.idusersua;
    newRow[CONFIG.COLUMNS.MainSC.THIET_BI_DataSC] = repairData.idthietbi;
    newRow[CONFIG.COLUMNS.MainSC.TINH_TRANG_TB_DV_BAO_DataSC] = repairData.tinhtrangtbdvbao;
    newRow[CONFIG.COLUMNS.MainSC.THOI_GIAN_DV_BAO_DataSC] = formattedDateTime;
    newRow[CONFIG.COLUMNS.MainSC.GHI_CHU_DataSC] = repairData.ghichu;
    newRow[CONFIG.COLUMNS.MainSC.HO_TEN_DataSC] = repairData.hoten;
    newRow[CONFIG.COLUMNS.MainSC.SO_DIEN_THOAI_DataSC] = repairData.sdt;
    newRow[CONFIG.COLUMNS.MainSC.HISTORY_DataSC] = history;
    newRow[CONFIG.COLUMNS.MainSC.TIME_UPDATE_DataSC] = formattedDateTime;
    
    // Thêm dòng mới vào sheet
    sheetSC.appendRow(newRow);
    
    // Ghi log
    saveLogData([[new Date(), 'createRepairReport', `Đã thêm dữ liệu báo cáo vào sheet`, userInfo]]);
    
    // Cập nhật thông tin người dùng
    updateUserInfo(repairData.iduserdv, {
      hoten: repairData.hoten,
      sdt: repairData.sdt
    });
    
    // Làm mới cache
    invalidateCache('all_data');
    
    // Tạo file báo cáo
    try {
      createReportFile(repairId, repairData.idthietbi, repairData.iduserdv);
      saveLogData([[new Date(), 'createRepairReport', `Đã tạo file báo cáo thành công`, userInfo]]);
    } catch (fileError) {
      saveLogData([[new Date(), 'createRepairReport', `Lỗi tạo file báo cáo: ${fileError.message}`, userInfo]]);
      console.error("Lỗi khi tạo file báo cáo:", fileError);
      // Không throw lỗi tại đây để tiếp tục xử lý
    }
    
    // Ghi log thành công
    saveLogData([[new Date(), 'createRepairReport', `Tạo báo cáo thành công: ${repairId}`, userInfo]]);
    
    return {
      success: true,
      repairId,
      message: "Đã tạo báo cáo sửa chữa thành công"
    };
  } catch (error) {
    // Ghi log lỗi
    saveLogData([[new Date(), 'createRepairReport', `Lỗi: ${error.message}`, userInfo]]);
    console.error("Lỗi khi tạo báo cáo sửa chữa:", error);
    return {
      success: false,
      message: "Lỗi khi tạo báo cáo: " + error.message
    };
  }
}

/**
 * Cập nhật thông tin người dùng
 * @param {string} userId - ID người dùng
 * @param {Object} userData - Dữ liệu cần cập nhật
 */
function updateUserInfo(userId, userData) {
  const ss = SpreadsheetApp.openById(CONFIG.FILE_DATA_ID);
  const sh_DSUserDV = ss.getSheetByName(CONFIG.SHEET_NAMES.DSUserDV);
  const val_DSUserDV = sh_DSUserDV.getDataRange().getValues();
  
  // Tìm vị trí dòng của người dùng
  const rowIndex = val_DSUserDV.findIndex(row => row[CONFIG.COLUMNS.DSUserDV.ID_UDV] === userId);
  
  if (rowIndex === -1) return; // Không tìm thấy
  
  const rowNumber = rowIndex + 1; // Chuyển sang vị trí hàng trong sheet (1-indexed)
  
  // Cập nhật thông tin
  if (userData.hoten) {
    sh_DSUserDV.getRange(rowNumber, CONFIG.COLUMNS.DSUserDV.HO_TEN_UDV + 1, 1, 1)
      .setValue(userData.hoten);
  }
  
  if (userData.sdt) {
    sh_DSUserDV.getRange(rowNumber, CONFIG.COLUMNS.DSUserDV.SO_DIEN_THOAI_UDV + 1, 1, 1)
      .setValue(userData.sdt.toString());
  }
}

/**
 * Tạo file báo cáo từ mẫu
 * @param {string} repairId - ID báo cáo sửa chữa
 * @param {string} deviceId - ID thiết bị
 * @param {string} unitId - ID đơn vị
 */
function createReportFile(repairId, deviceId, unitId) {
  // Lấy dữ liệu thiết bị và đơn vị
  const deviceData = getDeviceById(deviceId);
  const allData = getAllData();
  const unitData = allData.val_DSUserDV.find(row => row[CONFIG.COLUMNS.DSUserDV.ID_UDV] === unitId);
  
  if (!deviceData || !unitData) return;
  
  // Tạo dữ liệu thay thế trong mẫu
  const now = new Date();
  const templateData = {
    'Đơn vị yêu cầu': unitData[CONFIG.COLUMNS.DSUserDV.TEN_DON_VI_UDV],
    'today': now.getDate().toString(),
    'month': (now.getMonth() + 1).toString(),
    'year': now.getFullYear().toString(),
    'Tên thiết bị': deviceData[CONFIG.COLUMNS.DSThietBi.TEN_THIET_BI_TB],
    'Model': deviceData[CONFIG.COLUMNS.DSThietBi.MODEL_TB],
    'Serial': deviceData[CONFIG.COLUMNS.DSThietBi.SERIAL_TB],
    'Hãng sản xuất': deviceData[CONFIG.COLUMNS.DSThietBi.HANG_SAN_XUAT_TB],
    'Nước sản xuất': deviceData[CONFIG.COLUMNS.DSThietBi.NUOC_SAN_XUAT_TB],
    'Năm sản xuất': deviceData[CONFIG.COLUMNS.DSThietBi.NAM_SAN_XUAT_TB],
    'Năm sử dụng': deviceData[CONFIG.COLUMNS.DSThietBi.THOI_GIAN_DUA_VAO_SU_DUNG_TB],
    'QR_CODE': '',
    'id': repairId
  };
  
  // Tạo file từ mẫu
  const fileUrl = createFileFromTemplate(CONFIG.TEMPLATES.BM_VTTB_09_01, templateData, repairId);
  
  // Cập nhật URL file trong sheet
  updateFileUrlInSheet(repairId, fileUrl);
}

/**
 * Cập nhật URL file báo cáo trong sheet
 * @param {string} repairId - ID báo cáo sửa chữa
 * @param {string} fileUrl - URL của file báo cáo
 */
function updateFileUrlInSheet(repairId, fileUrl) {
  const ss = SpreadsheetApp.openById(CONFIG.FILE_MAIN_DATA_ID);
  const sheetSC = ss.getSheetByName(CONFIG.SHEET_NAMES.MainSC);
  const data = sheetSC.getDataRange().getValues();
  
  // Tìm vị trí dòng của báo cáo
  const rowIndex = data.findIndex(row => row[CONFIG.COLUMNS.MainSC.ID_DataSC] === repairId);
  
  if (rowIndex === -1) return; // Không tìm thấy
  
  const rowNumber = rowIndex + 1; // Chuyển sang vị trí hàng trong sheet (1-indexed)
  
  // Cập nhật URL file
  // Giả sử cột 20 là url_vttb_09_01_word (19 nếu 0-indexed)
  sheetSC.getRange(rowNumber, 20, 1, 1).setValue(fileUrl);
}

/**
 * Kiểm tra và tạo cấu trúc sheet nếu cần
 * @param {boolean} repairMissingSheets - Có tạo các sheet bị thiếu không
 * @returns {Object} Kết quả kiểm tra
 */
function verifyAndCreateSheets(repairMissingSheets = false) {
  const results = {
    dataFile: { exists: false, sheets: {} },
    mainFile: { exists: false, sheets: {} },
    logFile: { exists: false, sheets: {} },
    missingSheets: [],
    errors: []
  };
  
  try {
    // Kiểm tra file dữ liệu chính
    try {
      const ss = SpreadsheetApp.openById(CONFIG.FILE_DATA_ID);
      results.dataFile.exists = true;
      
      // Kiểm tra từng sheet trong file dữ liệu
      for (const sheetName of [CONFIG.SHEET_NAMES.DSUserDV, CONFIG.SHEET_NAMES.DSUserSua, 
                              CONFIG.SHEET_NAMES.DSThietBi, CONFIG.SHEET_NAMES.DSNhomTB, 
                              CONFIG.SHEET_NAMES.EnumSetting]) {
        const sheet = ss.getSheetByName(sheetName);
        results.dataFile.sheets[sheetName] = !!sheet;
        
        if (!sheet) {
          results.missingSheets.push({ file: 'dataFile', name: sheetName });
          
          // Tạo sheet nếu cần
          if (repairMissingSheets) {
            try {
              const newSheet = ss.insertSheet(sheetName);
              
              // Thêm header tùy theo loại sheet
              switch (sheetName) {
                case CONFIG.SHEET_NAMES.DSUserDV:
                  newSheet.getRange(1, 1, 1, 10).setValues([
                    ['ID', 'Đơn vị', 'Họ tên', 'Email', 'Số điện thoại', 'Use Tele', 'Username', 'Password', 'History', 'Time Update']
                  ]);
                  break;
                case CONFIG.SHEET_NAMES.DSUserSua:
                  newSheet.getRange(1, 1, 1, 10).setValues([
                    ['ID', 'Đơn vị', 'Họ tên', 'Email', 'Số điện thoại', 'Use Tele', 'Username', 'Password', 'History', 'Time Update']
                  ]);
                  break;
                case CONFIG.SHEET_NAMES.DSThietBi:
                  newSheet.getRange(1, 1, 1, 17).setValues([
                    ['ID', 'Đơn vị', 'Nhóm thiết bị', 'Mã thiết bị', 'Tên thiết bị', 'Model', 'Serial', 'Hãng SX', 'Nước SX', 'Năm SX', 'Thời gian SD', 'Hạn BH', 'Vị trí đặt', 'Tình trạng TB', 'Ghi chú', 'History', 'Time Update']
                  ]);
                  break;
                case CONFIG.SHEET_NAMES.DSNhomTB:
                  newSheet.getRange(1, 1, 1, 6).setValues([
                    ['ID', 'Nhóm thiết bị', 'Ký hiệu nhóm', 'Ghi chú', 'History', 'Time Update']
                  ]);
                  break;
                case CONFIG.SHEET_NAMES.EnumSetting:
                  newSheet.getRange(1, 1, 1, 4).setValues([
                    ['ID', 'Loại', 'Giá trị', 'Ghi chú']
                  ]);
                  break;
              }
              
              // Format header
              newSheet.getRange(1, 1, 1, newSheet.getLastColumn()).setFontWeight('bold');
              newSheet.setFrozenRows(1);
              
              // Cập nhật kết quả
              results.dataFile.sheets[sheetName] = true;
            } catch (sheetError) {
              results.errors.push(`Không thể tạo sheet ${sheetName}: ${sheetError.message}`);
            }
          }
        }
      }
    } catch (dataFileError) {
      results.errors.push(`Lỗi khi mở file dữ liệu: ${dataFileError.message}`);
    }
    
    // Kiểm tra file dữ liệu sửa chữa
    try {
      const mainSS = SpreadsheetApp.openById(CONFIG.FILE_MAIN_DATA_ID);
      results.mainFile.exists = true;
      
      // Kiểm tra sheet sửa chữa
      const mainScSheet = mainSS.getSheetByName(CONFIG.SHEET_NAMES.MainSC);
      results.mainFile.sheets[CONFIG.SHEET_NAMES.MainSC] = !!mainScSheet;
      
      if (!mainScSheet) {
        results.missingSheets.push({ file: 'mainFile', name: CONFIG.SHEET_NAMES.MainSC });
        
        // Tạo sheet nếu cần
        if (repairMissingSheets) {
          try {
            const newSheet = mainSS.insertSheet(CONFIG.SHEET_NAMES.MainSC);
            
            // Thêm header cho sheet sửa chữa
            newSheet.getRange(1, 1, 1, 39).setValues([
              ['ID', 'Webhook', 'Trạng thái', 'Mức độ', 'Đơn vị', 'Người sửa', 'Thiết bị', 'Tình trạng TB ĐV báo', 'Thời gian ĐV báo', 'Ngày khảo sát', 'Tình trạng TB khảo sát', 'Kết luận khảo sát', 'Đề xuất phương án', 'Ngày đề nghị', 'Nội dung đề nghị', 'Ngày bàn giao', 'Tình trạng TB bàn giao', 'Ghi chú', 'Họ tên', 'Số điện thoại', 'Người sửa chữa', 'QĐ tổ khảo sát', 'ĐD BV 1', 'Chức vụ ĐD BV 1', 'ĐD BV 2', 'Chức vụ ĐD BV 2', 'ĐD BV 3', 'Chức vụ ĐD BV 3', 'ĐD BV 4', 'Chức vụ ĐD BV 4', 'ĐD BV 5', 'Chức vụ ĐD BV 5', 'ĐD ĐV1 báo sửa', 'Chức vụ ĐD ĐV1 báo sửa', 'ĐD ĐV2 báo sửa', 'Chức vụ ĐD ĐV2 báo sửa', 'QR Code', 'History', 'Time Update']
            ]);
            
            // Format header
            newSheet.getRange(1, 1, 1, newSheet.getLastColumn()).setFontWeight('bold');
            newSheet.setFrozenRows(1);
            
            // Cập nhật kết quả
            results.mainFile.sheets[CONFIG.SHEET_NAMES.MainSC] = true;
          } catch (sheetError) {
            results.errors.push(`Không thể tạo sheet ${CONFIG.SHEET_NAMES.MainSC}: ${sheetError.message}`);
          }
        }
      }
    } catch (mainFileError) {
      results.errors.push(`Lỗi khi mở file dữ liệu sửa chữa: ${mainFileError.message}`);
    }
    
    // Kiểm tra file log
    try {
      const logSS = SpreadsheetApp.openById(CONFIG.FILE_LOG_ID);
      results.logFile.exists = true;
      
      // Kiểm tra sheet log
      const logSheet = logSS.getSheetByName(CONFIG.SHEET_NAMES.Log);
      results.logFile.sheets[CONFIG.SHEET_NAMES.Log] = !!logSheet;
      
      if (!logSheet) {
        results.missingSheets.push({ file: 'logFile', name: CONFIG.SHEET_NAMES.Log });
        
        // Tạo sheet nếu cần
        if (repairMissingSheets) {
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
            
            // Cập nhật kết quả
            results.logFile.sheets[CONFIG.SHEET_NAMES.Log] = true;
          } catch (sheetError) {
            results.errors.push(`Không thể tạo sheet ${CONFIG.SHEET_NAMES.Log}: ${sheetError.message}`);
          }
        }
      }
    } catch (logFileError) {
      results.errors.push(`Lỗi khi mở file log: ${logFileError.message}`);
    }
    
    return results;
  } catch (error) {
    results.errors.push(`Lỗi tổng thể: ${error.message}`);
    return results;
  }
}