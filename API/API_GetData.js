/**
 * Gets all data needed for the repair management system
 * @returns {string} JSON string with all data
 */
function getdata() {
  console.log("[getDataWithoutProcessing] - Bắt đầu lấy dữ liệu");

  try {
    // --- BƯỚC 1: Mở các bảng tính ---
    const ssRefData = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DanhSach);
    const ssMainData = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DataSC);

    // --- BƯỚC 2: Lấy tất cả dữ liệu từ các sheet cần thiết ---
    const val_DSUserDV = ssRefData.getSheetByName(CONFIG_SHEET_NAMES.DSUserDV).getDataRange().getValues();
    const val_DSUserSua = ssRefData.getSheetByName(CONFIG_SHEET_NAMES.DSUserSua).getDataRange().getValues();
    const val_DSNhomTB = ssRefData.getSheetByName(CONFIG_SHEET_NAMES.DSNhomTB).getDataRange().getValues();
    const val_EnumSetting = ssRefData.getSheetByName(CONFIG_SHEET_NAMES.EnumSetting).getDataRange().getValues();
    // 
    const val_DataSC = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DataSC).getDataRange().getValues();
    const val_DSThietBi = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DSThietBi).getDataRange().getValues();


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
    return {
        status: "success",
        message: "Dữ liệu đã được lấy thành công",
        data: data
    };
  } catch (error) {
    const errorMessage = error.message + (error.stack ? "\n" + error.stack : "");
    console.log("[getDataWithoutProcessing] - ERROR: " + errorMessage);
    return {
      status: "error",
      message: "Lỗi khi lấy dữ liệu: " + errorMessage
    };
  }
}