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
    case "addnewrepair":
      result = addNewRepair(params);
      break;

    default:
      result = { status: "lỗi action error", message: "Unknown action" };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}