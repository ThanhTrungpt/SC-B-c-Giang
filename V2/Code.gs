// ===== 1. CONFIGURATION =====
const CONFIG = {
  SPREADSHEET_ID: '1AcF4se3EMZftlAoZ-YCl4GOPww9yzsIuM8CgRoleoZ0',
  MAIN_DATA_ID: '1LYBsUlDo42-DVIhbjsJ9aRTc-quVzSF1h_2BukeMikk',
  LOG_SHEET_ID: '1afHg9kN6L044ySLqZU63MB7Pc-XQ43GcdYbcowR4CO4',
  SHEET_NAMES: {
    USER_DATA: 'DSUserDV',
    DEVICE_GROUPS: 'DSNhomTB',
    DEVICES: 'DSThietBi',
    REPAIR_REPORTS: 'Main_SC',
    LOG: 'Log',
    ENUM: 'Enum Setting'
  },
  TEMPLATES: {
    REPAIR_REQUEST: '1jDqUToV79fyv3jNr_3j4HL64g_coxW3joVheIHdDWxg',
    SURVEY_REPORT: '1fGUPZNrEi2OeBsmzWqj0FWx9oZYO79z4c5c45o20pl0',
    REPAIR_PROPOSAL: '1WCtJY6wA0-fBnurYf8beZyv4PAmWtGqAPZUwoJtUntM',
    HANDOVER_REPORT: '1mWJutc5TZ7EIf1Mq8Gj1ludhoRahOrHodZa5SU6Qi6k'
  },
  STATUS: {
    NEW: 'Em001',
    IN_PROGRESS: 'Em002',
    WARRANTY: 'Em003',
    EXTERNAL: 'Em004',
    COMPLETED: 'Em005'
  }
};

// ===== 2. UTILITY FUNCTIONS =====
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getSheet(sheetId, sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet && sheetName === CONFIG.SHEET_NAMES.LOG) {
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAMES.LOG);
      sheet.appendRow(['Thời gian', 'Hàm/Biến', 'Giá trị']);
      sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    
    return sheet;
  } catch (error) {
    console.error(`Lỗi getSheet: ${error.toString()}`);
    throw new Error(`Không thể truy cập sheet ${sheetName}: ${error.message}`);
  }
}

function logMessage(functionName, variableName, value) {
  try {
    const logSheet = getSheet(CONFIG.LOG_SHEET_ID, CONFIG.SHEET_NAMES.LOG);
    if (!logSheet) {
      console.error('Không thể tạo sheet Log');
      return;
    }
    
    const timestamp = new Date();
    const message = `${functionName} - ${variableName}:`;
    const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    logSheet.appendRow([timestamp, message, valueStr]);
    logSheet.autoResizeColumns(1, 3);
  } catch (error) {
    console.error('Lỗi ghi log:', error.toString());
  }
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
}

function generateUniqueId(unitCode) {
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2);
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  
  const reportSheet = getSheet(CONFIG.MAIN_DATA_ID, CONFIG.SHEET_NAMES.REPAIR_REPORTS);
  const data = reportSheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf('ID_DataSC');
  
  const todayReports = data.slice(1).filter(row => {
    const id = row[idCol];
    return id && id.startsWith(`SC.${unitCode}.${year}${month}${day}`);
  });
  
  const sequence = (todayReports.length + 1).toString().padStart(5, '0');
  return `SC.${unitCode}.${year}${month}${day}.${sequence}`;
}

// ===== 3. AUTHENTICATION =====
function doGet(e) {
  try {
    logMessage('doGet', 'event', e);
    return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('Phần mềm quản lý sửa chữa - Bệnh viện Đa khoa Bắc Giang')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (error) {
    logMessage('doGet', 'error', error.toString());
    throw new Error('Lỗi khởi tạo ứng dụng: ' + error.message);
  }
}

function validateLogin(username, password) {
  try {
    logMessage('validateLogin', 'input', { username });
    
    const userSheet = getSheet(CONFIG.SPREADSHEET_ID, CONFIG.SHEET_NAMES.USER_DATA);
    const data = userSheet.getDataRange().getValues();
    const headers = data[0];
    
    const usernameCol = headers.indexOf('Username_UDV');
    const passwordCol = headers.indexOf('Passwork_UDV');
    const nameCol = headers.indexOf('Tên Đơn vị_UDV');
    const logoCol = headers.indexOf('Ảnh logo_UDV');
    const idCol = headers.indexOf('ID_UDV');
    
    if ([usernameCol, passwordCol, nameCol, logoCol, idCol].includes(-1)) {
      throw new Error('Không tìm thấy cột dữ liệu cần thiết');
    }
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][usernameCol] === username && data[i][passwordCol] === password) {
        const userData = {
          id: data[i][idCol],
          name: data[i][nameCol],
          logo: data[i][logoCol]
        };
        logMessage('validateLogin', 'success', userData);
        return { success: true, userData };
      }
    }
    
    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
  } catch (error) {
    logMessage('validateLogin', 'error', error.toString());
    throw new Error('Lỗi xác thực: ' + error.message);
  }
}

// ===== 4. DATA MANAGEMENT =====
function getDeviceGroups() {
  try {
    const groupSheet = getSheet(CONFIG.SPREADSHEET_ID, CONFIG.SHEET_NAMES.DEVICE_GROUPS);
    const data = groupSheet.getDataRange().getValues();
    const headers = data[0];
    
    const idCol = headers.indexOf('ID_NTB');
    const nameCol = headers.indexOf('Nhóm thiết bị_NTB');
    const codeCol = headers.indexOf('Ký hiệu nhóm_NTB');
    
    if ([idCol, nameCol, codeCol].includes(-1)) {
      throw new Error('Không tìm thấy cột dữ liệu cần thiết');
    }
    
    const groups = data.slice(1).map(row => ({
      id: row[idCol],
      name: row[nameCol],
      code: row[codeCol]
    }));
    
    logMessage('getDeviceGroups', 'success', groups);
    return groups;
  } catch (error) {
    logMessage('getDeviceGroups', 'error', error.toString());
    throw new Error('Lỗi lấy danh sách nhóm thiết bị: ' + error.message);
  }
}

function getDevicesByGroup(groupId) {
  try {
    logMessage('getDevicesByGroup', 'input', { groupId });
    
    const deviceSheet = getSheet(CONFIG.SPREADSHEET_ID, CONFIG.SHEET_NAMES.DEVICES);
    const data = deviceSheet.getDataRange().getValues();
    const headers = data[0];
    
    const requiredColumns = [
      'ID_TB', 'Nhóm thiết bị_TB', 'Mã thiết bị_TB', 'Tên thiết bị_TB',
      'Model_TB', 'Serial_TB', 'Hãng sản xuất_TB', 'Nước sản xuất_TB',
      'Năm sản xuất_TB', 'Thời gian đưa vào sử dụng_TB', 'Hạn bảo hành_TB',
      'Vị trí đặt_TB', 'Tình trạng thiết bị_TB'
    ];
    
    const cols = {};
    requiredColumns.forEach(col => {
      cols[col] = headers.indexOf(col);
      if (cols[col] === -1) throw new Error(`Không tìm thấy cột ${col}`);
    });
    
    const devices = data.slice(1)
      .filter(row => row[cols['Nhóm thiết bị_TB']] === groupId)
      .map(row => ({
        id: row[cols['ID_TB']],
        code: row[cols['Mã thiết bị_TB']],
        name: row[cols['Tên thiết bị_TB']],
        model: row[cols['Model_TB']],
        serial: row[cols['Serial_TB']],
        manufacturer: row[cols['Hãng sản xuất_TB']],
        country: row[cols['Nước sản xuất_TB']],
        year: row[cols['Năm sản xuất_TB']],
        useYear: row[cols['Thời gian đưa vào sử dụng_TB']],
        warranty: row[cols['Hạn bảo hành_TB']],
        location: row[cols['Vị trí đặt_TB']],
        status: row[cols['Tình trạng thiết bị_TB']]
      }));
    
    logMessage('getDevicesByGroup', 'success', devices);
    return devices;
  } catch (error) {
    logMessage('getDevicesByGroup', 'error', error.toString());
    throw new Error('Lỗi lấy danh sách thiết bị: ' + error.message);
  }
}

// ===== 5. REPAIR REPORT MANAGEMENT =====
function createRepairReport(reportData) {
  try {
    logMessage('createRepairReport', 'input', reportData);
    
    const reportId = generateUniqueId(reportData.unitCode);
    const timestamp = new Date();
    
    const newReport = {
      'ID_DataSC': reportId,
      'Webhook_DataSC': '',
      'Trạng thái_DataSC': CONFIG.STATUS.NEW,
      'Mức độ_DataSC': reportData.level,
      'Đơn vị_DataSC': reportData.unitCode,
      'Người sửa_DataSC': reportData.repairer,
      'Thiết bị_DataSC': reportData.device,
      'Tình trạng thiết bị đơn vị báo_DataSC': reportData.deviceStatus,
      'Thời gian đơn vị báo_DataSC': timestamp,
      'Họ và tên_DataSC': reportData.requester,
      'Số điện thoại_DataSC': reportData.phone,
      'Ghi chú_DataSC': reportData.note,
      'History_DataSC': `- Ngày ${formatDate(timestamp)} <br>   * ${reportData.requester}: Báo sửa${reportData.note ? `<br>   * Ghi chú: ${reportData.note}` : ''}`,
      'TimeUpdate_DataSC': timestamp
    };
    
    const reportSheet = getSheet(CONFIG.MAIN_DATA_ID, CONFIG.SHEET_NAMES.REPAIR_REPORTS);
    const headers = reportSheet.getRange(1, 1, 1, reportSheet.getLastColumn()).getValues()[0];
    
    const rowData = headers.map(header => newReport[header] || '');
    reportSheet.appendRow(rowData);
    
    logMessage('createRepairReport', 'success', { reportId, newReport });
    return { success: true, reportId };
  } catch (error) {
    logMessage('createRepairReport', 'error', error.toString());
    throw new Error('Lỗi tạo báo sửa: ' + error.message);
  }
}

function getRepairReports(unitId) {
  try {
    logMessage('getRepairReports', 'input', { unitId });
    
    const reportSheet = getSheet(CONFIG.MAIN_DATA_ID, CONFIG.SHEET_NAMES.REPAIR_REPORTS);
    const data = reportSheet.getDataRange().getValues();
    const headers = data[0];
    
    const requiredColumns = [
      'ID_DataSC', 'Trạng thái_DataSC', 'Thiết bị_DataSC',
      'Tình trạng thiết bị đơn vị báo_DataSC', 'Họ và tên_DataSC',
      'Thời gian đơn vị báo_DataSC', 'Đơn vị_DataSC'
    ];
    
    const cols = {};
    requiredColumns.forEach(col => {
      cols[col] = headers.indexOf(col);
      if (cols[col] === -1) throw new Error(`Không tìm thấy cột ${col}`);
    });
    
    const reports = data.slice(1)
      .filter(row => row[cols['Đơn vị_DataSC']] === unitId)
      .map(row => ({
        id: row[cols['ID_DataSC']],
        status: row[cols['Trạng thái_DataSC']],
        device: row[cols['Thiết bị_DataSC']],
        deviceStatus: row[cols['Tình trạng thiết bị đơn vị báo_DataSC']],
        requester: row[cols['Họ và tên_DataSC']],
        reportTime: formatDate(row[cols['Thời gian đơn vị báo_DataSC']])
      }));
    
    logMessage('getRepairReports', 'success', reports);
    return reports;
  } catch (error) {
    logMessage('getRepairReports', 'error', error.toString());
    throw new Error('Lỗi lấy danh sách báo sửa: ' + error.message);
  }
} 