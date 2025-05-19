/**
 * Configuration and constants for the repair management system
 */

// ===== 1. FILE IDs =====
const CONFIG_FILE_IDS = {
  idSH_DanhSach: "1AcF4se3EMZftlAoZ-YCl4GOPww9yzsIuM8CgRoleoZ0", // Main data file ID
  idSH_DataSC: "1LYBsUlDo42-DVIhbjsJ9aRTc-quVzSF1h_2BukeMikk"  // Repair data file ID
};

// ===== 2. SHEET NAMES =====
const CONFIG_SHEET_NAMES = {
  DSUserDV: "DSUserDV",   // Department users sheet
  DSUserSua: "DSUserSua", // Repair users sheet
  DataSC: "Main_SC",      // Main repair data sheet
  DSThietBi: "DSThietBi", // Equipment sheet
  DSNhomTB: "DSNhomTB",   // Equipment groups sheet
  EnumSetting: "Enum Setting" // Enum settings sheet
};

// ===== 3. COLUMN DEFINITIONS =====
const CONFIG_COLUMNS = {
  // Equipment group columns
  DSNhomTB: {
    id: 0,          // ID_NTB
    nhomtb: 1,      // Nhóm thiết bị_NTB
    kihieu: 2,      // Ký hiệu nhóm_NTB
    ghichu: 3,      // Ghi chú_NTB
    history: 4,     // History_NTB
    timeupdate: 5   // TimeUpdate_NTB
  },
  
  // Equipment columns
  DSThietBi: {
    id: 0,          // ID_TB
    donvi: 1,       // Đơn vị_TB
    nhomtb: 2,      // Nhóm thiết bị_TB
    mathietbi: 3,   // Mã thiết bị_TB
    tentb: 4,       // Tên thiết bị_TB
    model: 5,       // Model_TB
    serial: 6,      // Serial_TB
    hangsx: 7,      // Hãng sản xuất_TB
    nuocsx: 8,      // Nước sản xuất_TB
    namsx: 9,       // Năm sản xuất_TB
    namsd: 10,      // Thời gian đưa vào sử dụng_TB
    hanbaohanh: 11, // Hạn bảo hành_TB
    vitridat: 12,   // Vị trí đặt_TB
    tinhtrang: 13,  // Tình trạng thiết bị_TB
    ghichu: 14,     // Ghi chú_TB
    history: 15,    // History_TB
    timeupdate: 16  // TimeUpdate_TB
  },
  
  // Main repair data columns
  DataSC: {
    id: 0,                     // ID_DataSC
    webhook: 1,                // Webhook_DataSC
    trangthai: 2,              // Trạng thái_DataSC
    mucdo: 3,                  // Mức độ_DataSC
    iduserdv: 4,               // Đơn vị_DataSC
    idusersua: 5,              // Người sửa_DataSC
    idthietbi: 6,              // Thiết bị_DataSC
    tinhtrangtbdvbao: 7,       // Tình trạng thiết bị đơn vị báo_DataSC
    ngaydonvibao: 8,           // Thời gian đơn vị báo_DataSC
    ngaykhaosat: 9,            // Ngày khảo sát_DataSC
    tinhtrangthietbiks: 10,    // Tình trang thiết bị khảo sát_DataSC
    ketluankhaosat: 11,        // Kết luận khảo sát_DataSC
    dexuatphuongan: 12,        // Đề xuất phương án_DataSC
    ngaydenghi: 13,            // Ngày đề nghi_DataSC
    noidungdenghi: 14,         // Nội dung đề nghi_DataSC
    ngaybangiao: 15,           // Ngày bàn giao_DataSC
    tinhtrangbangiao: 16,      // Tình trạng thiết bị bàn giao_DataSC
    ghichu: 17,                // Ghi chú_DataSC
    hoten: 18,                 // Họ và tên_DataSC
    sdt: 19,                   // Số điện thoại_DataSC
    quyetdinhtokhaosat: 20,    // Quyết định tổ khảo sát_DataSC
    
    // Department representatives and their positions
    bv1_daidien: 21,           // Đại diện BV 1_DataSC
    bv1_chucvu: 22,            // Chức vụ DD BV 1_DataSC
    bv2_daidien: 23,           // Đại diện BV 2_DataSC
    bv2_chucvu: 24,            // Chức vụ DD BV 2_DataSC
    bv3_daidien: 25,           // Đại diện BV 3_DataSC
    bv3_chucvu: 26,            // Chức vụ DD BV 3_DataSC
    bv4_daidien: 27,           // Đại diện BV 4_DataSC
    bv4_chucvu: 28,            // Chức vụ DD BV 4_DataSC
    bv5_daidien: 29,           // Đại diện BV 5_DataSC
    bv5_chucvu: 30,            // Chức vụ DD BV 5_DataSC
    dv1_daidien: 31,           // Đại diện ĐV1 Báo sửa 1_DataSC
    dv1_chucvu: 32,            // Chức vụ DD ĐV1 Báo sửa_DataSC
    dv2_daidien: 33,           // Đại diện ĐV2 Báo sửa _DataSC
    dv2_chucvu: 34,            // Chức vụ DD ĐV2 Báo sửa_DataSC
    
    qrcode: 35,                // QR Code_DataSC
    history: 36,               // History_DataSC
    timeupdate: 37             // TimeUpdate_DataSC
  },
  
  // Repair personnel columns
  DSUserSua: {
    id: 0,          // ID_USC
    donvi: 1,       // Đơn vị_USC
    hoten: 2,       // Họ và tên_USC
    email: 3,       // Email_USC
    sdt: 4,         // Số điện thoại_USC
    usetele: 5,     // UseTele_USC
    username: 6,    // Username_USC
    pass: 7,        // Passwork_USC
    history: 8,     // History_USC
    timeupdate: 9   // TimeUpdate_USC
  },
  
  // Department users columns
  DSUserDV: {
    id: 0,          // ID_UDV
    donvi: 1,       // Tên Đơn vị_UDV
    kihieu: 2,      // Ký hiệu_UDV
    email: 3,       // Email_UDV
    username: 4,    // Username_UDV
    pass: 5,        // Passwork_UDV
    logo: 6,        // Ảnh logo_UDV
    history: 7,     // History_UDV
    timeupdate: 8   // TimeUpdate_UDV
  },
  
  // Enum settings columns
  EnumSetting: {
    id: 0,          // ID_EnumST
    nhom: 1,        // Nhóm_EnumST
    ten: 2          // Tên_EnumST
  }
};
// ===== 3. ENUM SETTINGS =====
const CONFIG_ENUM = {
  // Status codes
  TRANGTHAI: {
    BAO_HONG: "Em001",     // 01 Báo hỏng
    DANG_SUA: "Em002",     // 02 Đang sửa
    BAO_HANH: "Em003",     // 03 Bảo hành
    SUA_NGOAI: "Em004",    // 04 Sửa ngoài
    HOAN_THANH: "Em005",   // 05 Hoàn thành
    XOA: "Em006"           // 06 Xóa
  },
  
  // Equipment status
  TINHTRANG_THIETBI: {
    HONG: "Em010",         // Hỏng
    BINH_THUONG: "Em011"   // Hoạt động bình thường
  },
  
  // Priority levels
  MUC_DO_YC: {
    GAP: "Em020",          // Gấp
    RAT_GAP: "Em021"       // Rất gấp
  }
};

// ===== 4. TEMPLATE FILE IDs =====
const CONFIG_TEMPLATES = {
  BM_VTTB_09_01: "1jDqUToV79fyv3jNr_3j4HL64g_coxW3joVheIHdDWxg", // Repair request form
  BM_VTTB_09_02: "1fGUPZNrEi2OeBsmzWqj0FWx9oZYO79z4c5c45o20pl0", // Equipment survey report
  BM_VTTB_09_03: "1WCtJY6wA0-fBnurYf8beZyv4PAmWtGqAPZUwoJtUntM", // Repair proposal
  BM_VTTB_09_04: "1mWJutc5TZ7EIf1Mq8Gj1ludhoRahOrHodZa5SU6Qi6k"  // Handover document
};

// ===== 5. LOGO URL =====
const CONFIG_LOGO_URL = "https://drive.google.com/drive/folders/1ZBHcflpz3ZqImXm5nELRD61ajZWB38zl";

/**
 * Gets all data needed for the repair management system
 * @returns {string} JSON string with all data
 */
function getdata() {
  // Create message data array for logging
  const msgData = [];
  msgData.push([new Date(), "[getdata] - Starting data retrieval"]);
  
  try {
    // Open the spreadsheet with configurations
    const ss = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DanhSach);
    msgData.push([new Date(), "[getdata] - Opened spreadsheet: " + CONFIG_FILE_IDS.idSH_DanhSach]);
    
    // Get all required sheets
    const sh_DSUserDV = ss.getSheetByName(CONFIG_SHEET_NAMES.DSUserDV);
    const sh_DSUserSua = ss.getSheetByName(CONFIG_SHEET_NAMES.DSUserSua);
    const sh_DSThietBi = ss.getSheetByName(CONFIG_SHEET_NAMES.DSThietBi);
    const sh_DSNhomTB = ss.getSheetByName(CONFIG_SHEET_NAMES.DSNhomTB);
    const sh_EnumSetting = ss.getSheetByName(CONFIG_SHEET_NAMES.EnumSetting);
    msgData.push([new Date(), "[getdata] - Retrieved all sheets from configuration file"]);
    
    // Open the main data spreadsheet
    const mainDataSS = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DataSC);
    const sh_DataSC = mainDataSS.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
    msgData.push([new Date(), "[getdata] - Retrieved repair data sheet from main data file"]);
    
    // Get all values from sheets
    const val_DSUserDV = sh_DSUserDV.getDataRange().getValues();
    const val_DSUserSua = sh_DSUserSua.getDataRange().getValues();
    const val_DSThietBi = sh_DSThietBi.getDataRange().getValues();
    const val_DSNhomTB = sh_DSNhomTB.getDataRange().getValues();
    const val_DataSC = sh_DataSC.getDataRange().getValues();
    const val_EnumSetting = sh_EnumSetting.getDataRange().getValues();
    msgData.push([new Date(), "[getdata] - Retrieved all data values from sheets"]);
    
    // Get unique lists for efficient filtering
    const lr_thietbi = sh_DSThietBi.getLastRow();
    const ds_donvi = sh_DSThietBi.getRange("B2:B" + lr_thietbi).getValues();
    const ds_nhomtb = sh_DSThietBi.getRange("C2:C" + lr_thietbi).getValues();
    
    const lr_suachua = sh_DataSC.getLastRow();
    const ds_trangthaisc = sh_DataSC.getRange("C2:C" + lr_suachua).getValues();
    
    // Convert to flat arrays and get unique values
    const lst_donvi1 = ds_donvi.flat();
    const lst_nhomtb1 = ds_nhomtb.flat();
    const lst_trangthais1 = ds_trangthaisc.flat();
    
    const lst_donvi = [...new Set(lst_donvi1.filter(item => item.trim() !== ''))];
    const lst_nhomtb = [...new Set(lst_nhomtb1.filter(item => item.trim() !== ''))];
    const lst_trangthaisc = [...new Set(lst_trangthais1.filter(item => item !== ''))];
    
    msgData.push([new Date(), "[getdata] - Created unique lists for filtering"]);
    
    // Prepare data object to return
    const data = {
      val_DSUserDV: val_DSUserDV,
      val_DSUserSua: val_DSUserSua,
      val_DSThietBi: val_DSThietBi,
      val_DSNhomTB: val_DSNhomTB,
      val_DataSC: val_DataSC,
      val_EnumSetting: val_EnumSetting,
      lst_nhomtb: lst_nhomtb,
      lst_donvi: lst_donvi,
      lst_trangthaisc: lst_trangthaisc,
      CONFIG_COLUMNS: CONFIG_COLUMNS,
      CONFIG_ENUM: CONFIG_ENUM
    };
    
    msgData.push([new Date(), "[getdata] - Data preparation complete"]);
    
    // Log to debug spreadsheet
    logDebugData(msgData);
    
    // Return JSON string of data
    return JSON.stringify(data);
  } catch (error) {
    msgData.push([new Date(), "[getdata] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
}


/**
 * Logs debug data to a spreadsheet
 * @param {Array} msgData - Array of message data to log
 */
function logDebugData(msgData) {
  try {
    // Debug spreadsheet ID
    const debugSheetId = "1afHg9kN6L044ySLqZU63MB7Pc-XQ43GcdYbcowR4CO4";
    const ss = SpreadsheetApp.openById(debugSheetId);
    const sheet = ss.getSheets()[0];
    
    // Append data to the sheet
    if (msgData && msgData.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, msgData.length, 2).setValues(msgData);
    }
  } catch (error) {
    console.error("Error logging debug data: " + error.toString());
  }
} 