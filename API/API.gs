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

function doPost(e) {
  const params = e.parameter;
  const action = params.action;

  let result;

  switch (action) {
    case "getdata":
      result = getdata();
      break;
    case "login":
      result = login(params);
      break;
    case "getProfile":
      result = getProfile(params);
      break;
    default:
      result = { status: "lỗi error", message: "Unknown action" };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ======= CHỨC NĂNG =======

/**
 * Gets all data needed for the repair management system
 * @returns {string} JSON string with all data
 */
function getdata() {
  console.log("[getDataWithoutProcessing] - Bắt đầu lấy dữ liệu");

  try {
    // --- BƯỚC 1: Mở các bảng tính ---
    const ssConfig = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DanhSach);
    const ssData = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DataSC);
    console.log("[getDataWithoutProcessing] - Đã mở các bảng tính");

    // --- BƯỚC 2: Lấy tất cả dữ liệu từ các sheet cần thiết ---
    const val_DSUserDV = ssConfig.getSheetByName(CONFIG_SHEET_NAMES.DSUserDV).getDataRange().getValues();
    const val_DSUserSua = ssConfig.getSheetByName(CONFIG_SHEET_NAMES.DSUserSua).getDataRange().getValues();
    const val_DSThietBi = ssConfig.getSheetByName(CONFIG_SHEET_NAMES.DSThietBi).getDataRange().getValues();
    const val_DSNhomTB = ssConfig.getSheetByName(CONFIG_SHEET_NAMES.DSNhomTB).getDataRange().getValues();
    const val_EnumSetting = ssConfig.getSheetByName(CONFIG_SHEET_NAMES.EnumSetting).getDataRange().getValues();
    const val_DataSC = ssData.getSheetByName(CONFIG_SHEET_NAMES.DataSC).getDataRange().getValues();
    console.log("[getDataWithoutProcessing] - Đã lấy tất cả giá trị từ các sheet");


    // --- BƯỚC 4: Chuẩn bị đối tượng dữ liệu để trả về ---
    // bao gồm các giá trị sheet gốc
    const data = {
      DSUserDV: val_DSUserDV,
      DSUserSua: val_DSUserSua,
      DSThietBi: val_DSThietBi,
      DSNhomTB: val_DSNhomTB,
      DataSC: val_DataSC,
      EnumSetting: val_EnumSetting
    };

    console.log("[getDataWithoutProcessing] - Hoàn tất chuẩn bị dữ liệu (không xử lý)");

    return data;
  } catch (error) {
    const errorMessage = error.message + (error.stack ? "\n" + error.stack : "");
    console.log("[getDataWithoutProcessing] - ERROR: " + errorMessage);
    
    throw new Error(`[getDataWithoutProcessing] Đã xảy ra lỗi: ${error.message}`);
  }
  }
