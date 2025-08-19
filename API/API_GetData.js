/**
 * Gets all data needed for the repair management system
 * @returns {string} JSON string with all data
 */
function getdata() {
  console.log("[getDataWithoutProcessing] - Bắt đầu lấy dữ liệu");

  try {
    // --- BƯỚC 1: Mở các bảng tính ---
    const ssRefData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DanhSach);
    const ssMainData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DataSC);

    // --- BƯỚC 2: Lấy tất cả dữ liệu từ các sheet cần thiết ---
    // Add error checking for each sheet
    const sheetDSUserDV = ssRefData.getSheetByName(CONFIG_SHEET_NAMES.DSUserDV);
    if (!sheetDSUserDV) throw new Error(`Sheet ${CONFIG_SHEET_NAMES.DSUserDV} not found in spreadsheet`);
    const val_DSUserDV = sheetDSUserDV.getDataRange().getValues();
    
    const sheetDSUserSua = ssRefData.getSheetByName(CONFIG_SHEET_NAMES.DSUserSua);
    if (!sheetDSUserSua) throw new Error(`Sheet ${CONFIG_SHEET_NAMES.DSUserSua} not found in spreadsheet`);
    const val_DSUserSua = sheetDSUserSua.getDataRange().getValues();
    
    const sheetDSNhomTB = ssRefData.getSheetByName(CONFIG_SHEET_NAMES.DSNhomTB);
    if (!sheetDSNhomTB) throw new Error(`Sheet ${CONFIG_SHEET_NAMES.DSNhomTB} not found in spreadsheet`);
    const val_DSNhomTB = sheetDSNhomTB.getDataRange().getValues();
    
    const sheetEnumSetting = ssRefData.getSheetByName(CONFIG_SHEET_NAMES.EnumSetting);
    if (!sheetEnumSetting) throw new Error(`Sheet ${CONFIG_SHEET_NAMES.EnumSetting} not found in spreadsheet`);
    const val_EnumSetting = sheetEnumSetting.getDataRange().getValues();
    
    const sheetDataSC = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
    if (!sheetDataSC) throw new Error(`Sheet ${CONFIG_SHEET_NAMES.DataSC} not found in spreadsheet`);
    const val_DataSC = sheetDataSC.getDataRange().getValues();
    
    const sheetDSThietBi = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DSThietBi);
    if (!sheetDSThietBi) throw new Error(`Sheet ${CONFIG_SHEET_NAMES.DSThietBi} not found in spreadsheet`);
    const val_DSThietBi = sheetDSThietBi.getDataRange().getValues();


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