/**
 * Data service module for repair management operations
 */

// ===== 1. REPAIR OPERATIONS =====

/**
 * Deletes a repair record (marks as deleted)
 * @param {string} id - The repair ID to delete
 * @returns {boolean} - True if successful
 */
function SC_delete(id) {
  const msgData = [];
  msgData.push([new Date(), "[SC_delete] - Starting deletion of repair ID: " + id]);
  
  try {
    const sheet = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DataSC).getSheetByName(CONFIG_SHEET_NAMES.DataSC);
    const data = sheet.getDataRange().getValues();
    
    const row = getfilterrow(data, CONFIG_COLUMNS.DataSC.id, id);
    if (!row) {
      msgData.push([new Date(), "[SC_delete] - Repair ID not found: " + id]);
      logDebugData(msgData);
      return false;
    }
    
    const rowggsheet = data.indexOf(row) + 1;
    sheet.getRange(rowggsheet, CONFIG_COLUMNS.DataSC.trangthai + 1, 1, 1).setValue("Xóa");
    
    msgData.push([new Date(), "[SC_delete] - Successfully marked repair ID as deleted: " + id]);
    logDebugData(msgData);
    return true;
  } catch (error) {
    msgData.push([new Date(), "[SC_delete] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
}

/**
 * Gets repair data by ID
 * @param {string} id - The repair ID
 * @returns {Array} - Array with repair data
 */
function SC_getDataById(id) {
  const msgData = [];
  msgData.push([new Date(), "[SC_getDataById] - Retrieving data for repair ID: " + id]);
  
  try {
    const sheet = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DataSC).getSheetByName(CONFIG_SHEET_NAMES.DataSC);
    const data = sheet.getDataRange().getValues();
    
    const row = getfilterrow(data, CONFIG_COLUMNS.DataSC.id, id);
    if (!row) {
      msgData.push([new Date(), "[SC_getDataById] - Repair ID not found: " + id]);
      logDebugData(msgData);
      return null;
    }
    
    msgData.push([new Date(), "[SC_getDataById] - Successfully retrieved data for repair ID: " + id]);
    logDebugData(msgData);
    return row;
  } catch (error) {
    msgData.push([new Date(), "[SC_getDataById] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
}

/**
 * Updates repair data
 * @param {Object} inputdata - Object containing repair data to update
 * @returns {Array} - Updated repair data array
 */
function SC_update(inputdata) {
  const msgData = [];
  msgData.push([new Date(), "[SC_update] - Starting update for repair ID: " + inputdata.id]);
  
  try {
    const sheet = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DataSC).getSheetByName(CONFIG_SHEET_NAMES.DataSC);
    const val_DataSC = sheet.getDataRange().getValues();
    
    const rowsc = getfilterrow(val_DataSC, CONFIG_COLUMNS.DataSC.id, inputdata.id);
    if (!rowsc) {
      msgData.push([new Date(), "[SC_update] - Repair ID not found: " + inputdata.id]);
      logDebugData(msgData);
      throw new Error("Repair ID not found: " + inputdata.id);
    }
    
    const rowggsheet = val_DataSC.indexOf(rowsc) + 1;
    
    // Update repair status fields
    sheet.getRange(rowggsheet, CONFIG_COLUMNS.DataSC.tinhtrangtbdvbao + 1, 1, 1).setValue(inputdata.tinhtrangtbdvbao);
    sheet.getRange(rowggsheet, CONFIG_COLUMNS.DataSC.ghichu + 1, 1, 1).setValue(inputdata.ghichu);
    sheet.getRange(rowggsheet, CONFIG_COLUMNS.DataSC.mucdo + 1, 1, 1).setValue(inputdata.mucdo);
    
    // Format and set date
    const currentDateTime = new Date();
    const formattedDateTime = Utilities.formatDate(currentDateTime, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
    sheet.getRange(rowggsheet, CONFIG_COLUMNS.DataSC.ngaydonvibao + 1, 1, 1).setValue(formattedDateTime);
    
    // Update equipment and repair personnel
    sheet.getRange(rowggsheet, CONFIG_COLUMNS.DataSC.idthietbi + 1, 1, 1).setValue(inputdata.idthietbi);
    sheet.getRange(rowggsheet, CONFIG_COLUMNS.DataSC.idusersua + 1, 1, 1).setValue(inputdata.idusersua);
    
    // Get equipment and department data for document creation
    const rowthietbi = getfilterrow(inputdata.val_dsthietbi, CONFIG_COLUMNS.DSThietBi.id, inputdata.idthietbi);
    const rowdvyc = getfilterrow(inputdata.val_DSUserDV, CONFIG_COLUMNS.DSUserDV.id, inputdata.iduserdv);
    
    // Create repair document
    msgData.push([new Date(), "[SC_update] - Creating repair document"]);
    createfile_bm0901({
      id: inputdata.id,
      rowthietbi: rowthietbi,
      rowdvyc: rowdvyc
    });
    
    msgData.push([new Date(), "[SC_update] - Successfully updated repair ID: " + inputdata.id]);
    logDebugData(msgData);
    
    return sheet.getDataRange().getValues();
  } catch (error) {
    msgData.push([new Date(), "[SC_update] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
}

/**
 * Adds a new repair report
 * @param {Object} databaohong - Object containing repair report data
 * @returns {Array} - Updated repair data array
 * Các việc thực hiện:
 * 1. Lấy dữ liệu sheet DataSC
 * 2. Tạo ID sửa chữa
 * 3. Ghi dữ liệu vào trong sheet sửa chữa
 * 4. Gửi thông báo Telegram
 * 5. Hoàn thành và trả về kết quả
 */
function SC_thembaohong(repairData) {
  const msgData = [];
  msgData.push([new Date(), "[SC_thembaohong] - Starting new repair report creation"]);
  // Log the repair data for debugging
  msgData.push([new Date(), "[SC_thembaohong] - Repair data received: " + JSON.stringify(repairData)]);
  
  // Validate repair data structure
  if (!repairData) {
    throw new Error("Repair data is missing");
  }
  
  // Log each component of the repair data
  msgData.push([new Date(), "[SC_thembaohong] - Repair data components:"]);
  msgData.push([new Date(), "  - id_repair: " + repairData.id_repair]);
  
  // Đơn vị (Department)
  msgData.push([new Date(), "  - iduserdv: " + repairData.iduserdv]);
  msgData.push([new Date(), "  - Kyhieu_donvi: " + repairData.Kyhieu_donvi]);
  msgData.push([new Date(), "  - Ten_donvi: " + repairData.Ten_donvi]);
  
  // Người yêu cầu (Requester)
  msgData.push([new Date(), "  - Name_NguoiYeuCau: " + repairData.Name_NguoiYeuCau]);
  msgData.push([new Date(), "  - SDT_NguoiYeuCau: " + repairData.SDT_NguoiYeuCau]);
  
  // Người sửa (Repair person)
  msgData.push([new Date(), "  - ID_NguoiSua: " + repairData.ID_NguoiSua]);
  msgData.push([new Date(), "  - Name_NguoiSua: " + repairData.Name_NguoiSua]);
  msgData.push([new Date(), "  - ID_Telegram_NguoiSua: " + repairData.ID_Telegram_NguoiSua]);
  
  // Thiết bị (Equipment)
  msgData.push([new Date(), "  - ID_ThietBi: " + repairData.ID_ThietBi]);
  msgData.push([new Date(), "  - Name_ThietBi: " + repairData.Name_ThietBi]);
  msgData.push([new Date(), "  - text_Model: " + repairData.text_Model]);
  msgData.push([new Date(), "  - text_Serial: " + repairData.text_Serial]);
  msgData.push([new Date(), "  - text_Manufacturer: " + repairData.text_Manufacturer]);
  msgData.push([new Date(), "  - text_Country: " + repairData.text_Country]);
  msgData.push([new Date(), "  - text_Vitri: " + repairData.text_Vitri]);
  
  // Tình trạng và mức độ (Status and priority)
  msgData.push([new Date(), "  - TinhTrang_ThietBi: " + repairData.TinhTrang_ThietBi]);
  msgData.push([new Date(), "  - ID_MucDo_YeuCau: " + repairData.ID_MucDo_YeuCau]);
  msgData.push([new Date(), "  - text_MucDo_YeuCau: " + repairData.text_MucDo_YeuCau]);
  
  // Ghi chú và trạng thái (Notes and status)
  msgData.push([new Date(), "  - GhiChu_repair: " + repairData.GhiChu_repair]);
  msgData.push([new Date(), "  - trangThai_repair: " + repairData.trangThai_repair]);
  try {
    //1. Lấy dữ liệu sheet DataSC
    // Open spreadsheet
    const sph_DataSC = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DataSC);
    
    // Get all necessary sheets
    const sh_DataSC = sph_DataSC.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
    
    // Get data from sheets
    const val_DataSC = sh_DataSC.getDataRange().getValues();
    
    //2. Tạo ID sửa chữa
    const IDSC_New = generateRepairID(val_DataSC, repairData.iduserdv, repairData.Kyhieu_donvi);  
    msgData.push([new Date(), "[SC_thembaohong] - Generated repair ID: " + IDSC_New]);
    
    // Get current date/time
    const currentDateTime = new Date();
    const formattedDateTime = Utilities.formatDate(currentDateTime, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
    
    // Create new repair record data
    const newRow = Array(val_DataSC[0].length).fill(""); // Initialize with empty values matching the width of val_DataSC
    // Set values for required fields
    newRow[CONFIG_COLUMNS.DataSC.id] = IDSC_New;
    newRow[CONFIG_COLUMNS.DataSC.trangthai] = repairData.trangThai_repair;
    newRow[CONFIG_COLUMNS.DataSC.mucdo] = repairData.ID_MucDo_YeuCau;
    newRow[CONFIG_COLUMNS.DataSC.iduserdv] = repairData.iduserdv;
    newRow[CONFIG_COLUMNS.DataSC.idusersua] = repairData.ID_NguoiSua;
    newRow[CONFIG_COLUMNS.DataSC.idthietbi] = repairData.ID_ThietBi;
    newRow[CONFIG_COLUMNS.DataSC.tinhtrangtbdvbao] = repairData.TinhTrang_ThietBi;
    newRow[CONFIG_COLUMNS.DataSC.ngaydonvibao] = formattedDateTime;
    newRow[CONFIG_COLUMNS.DataSC.ghichu] = repairData.GhiChu_repair;
    newRow[CONFIG_COLUMNS.DataSC.hoten] = repairData.Name_NguoiYeuCau;
    newRow[CONFIG_COLUMNS.DataSC.sdt] = repairData.SDT_NguoiYeuCau;
    newRow[CONFIG_COLUMNS.DataSC.history] = `* Ngày ${formattedDateTime}\n   - ${repairData.Name_NguoiYeuCau}: Báo hỏng`;
    newRow[CONFIG_COLUMNS.DataSC.timeupdate] = currentDateTime;
    
    msgData.push([new Date(), "[SC_thembaohong] - New repair row data: " + JSON.stringify(newRow)]);
    
    //3. Ghi vào sheet DataSC
    // Append the new row to the end of the sheet
    sh_DataSC.appendRow(newRow);
    
    // Get the last row index after appending
    const lr = sh_DataSC.getLastRow();
    
    // Get the data from the newly added row - only write to the last row
    sh_DataSC.getRange(lr, 1, 1, sh_DataSC.getLastColumn()).getValues()[0];
    
    //4. Gửi thông báo Telegram
    // Update repairData with the generated repair ID
    repairData.id_repair = IDSC_New;
    msgData.push([new Date(), "[SC_thembaohong] - Updated repairData with ID: " + IDSC_New]);
    tele_sendsms_group(repairData);
    
    tele_sendsms_user(repairData);
    
    // //5. Tạo tài liệu sửa chữa
    // msgData.push([new Date(), "[SC_thembaohong] - Creating repair document"]);
    // createfile_bm0901(repairData);
    
    msgData.push([new Date(), "[SC_thembaohong] - Successfully created new repair report "]);
    logDebugData(msgData);
    
    return sh_DataSC.getDataRange().getValues();
  } catch (error) {
    msgData.push([new Date(), "[SC_thembaohong] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
}


/**
 * Generates a repair ID based on the unit code
 * @param {string} Kyhieu_donvi - The unit code
 * @returns {string} The generated repair ID
 */
function generateRepairID(val_DataSC, iduserdv, Kyhieu_donvi) {
  const msgData = [];
  msgData.push([new Date(), "[generateRepairID] - Starting ID generation for unit: " + Kyhieu_donvi]);
  
  try {
    // Default unit code
    const unit = Kyhieu_donvi || "XX";
    
    // Lọc dữ liệu theo đơn vị
    let userDeptRepairs = [];
    if (val_DataSC && val_DataSC.length > 0 && iduserdv) {
      userDeptRepairs = val_DataSC.filter(function(row) {
        return row[CONFIG_COLUMNS.DataSC.iduserdv] === iduserdv;
      });
      
      msgData.push([new Date(), "[generateRepairID] - Filtered " + userDeptRepairs.length + " repairs for user department ID: " + iduserdv]);
    } else {
      msgData.push([new Date(), "[generateRepairID] - No user department ID provided or no repair data available"]);
    }

    // Tìm giá trị lớn nhất
    let maxSequence = 0;
    
    if (userDeptRepairs.length > 0) {
      // Extract sequence numbers from existing repair IDs
      const sequenceNumbers = userDeptRepairs
        .map(function(row) {
          const repairId = row[CONFIG_COLUMNS.DataSC.id];
          if (repairId && typeof repairId === 'string') {
            // Extract the sequence part (xxx) from the ID format SC.UNIT.DATE.xxx
            const parts = repairId.split('.');
            if (parts.length === 4) {
              return parseInt(parts[3], 10);
            }
          }
          return 0;
        })
        .filter(function(num) {
          return !isNaN(num);
        });
      
      // Find the maximum sequence number
      if (sequenceNumbers.length > 0) {
        maxSequence = Math.max(...sequenceNumbers);
      }
      
      msgData.push([new Date(), "[generateRepairID] - Max sequence found: " + maxSequence]);
    } else {
      msgData.push([new Date(), "[generateRepairID] - No existing repairs for this department, starting from 0"]);
    }

    // Lấy thời gian hiện tại theo định dạng yymmdd
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const day = ("0" + now.getDate()).slice(-2);
    const datePart = year + month + day;
    
    msgData.push([new Date(), "[generateRepairID] - Date part: " + datePart]);
    
    // Tạo ID sửa chữa
    let nextSequence = maxSequence + 1;
    // Reset sequence to 1 if it exceeds 999
    if (nextSequence > 999) {
      nextSequence = 1;
    }
    const sequenceNumber = ("000" + nextSequence).slice(-3);
    const repairID = "SC." + unit + "." + datePart + "." + sequenceNumber;
    
    msgData.push([new Date(), "[generateRepairID] - Generated ID: " + repairID]);
    logDebugData(msgData);
    
    return repairID;
  } catch (error) {
    msgData.push([new Date(), "[generateRepairID] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
}

/**
 * Advances the status of a repair record to the next stage
 * @param {string} id - The repair ID
 * @returns {Array} - Updated repair data array
 */
function SC_nextstatus(id) {
  const msgData = [];
  msgData.push([new Date(), "[SC_nextstatus] - Advancing status for repair ID: " + id]);
  
  try {
    const ss = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DataSC);
    const sh_DataSC = ss.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
    const val_DataSC = sh_DataSC.getDataRange().getValues();
    
    const rowsc = getfilterrow(val_DataSC, CONFIG_COLUMNS.DataSC.id, id);
    if (!rowsc) {
      msgData.push([new Date(), "[SC_nextstatus] - Repair ID not found: " + id]);
      logDebugData(msgData);
      throw new Error("Repair ID not found: " + id);
    }
    
    const rowggsheet = val_DataSC.indexOf(rowsc) + 1;
    const currentStatus = rowsc[CONFIG_COLUMNS.DataSC.trangthai];
    const nextStatus = currentStatus + 1;
    
    sh_DataSC.getRange(rowggsheet, CONFIG_COLUMNS.DataSC.trangthai + 1, 1, 1).setValue(nextStatus);
    
    msgData.push([new Date(), "[SC_nextstatus] - Successfully advanced status from " + currentStatus + " to " + nextStatus]);
    logDebugData(msgData);
    
    return sh_DataSC.getDataRange().getValues();
  } catch (error) {
    msgData.push([new Date(), "[SC_nextstatus] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
}

/**
 * Updates repair data in the "in repair" stage
 * @param {Object} inputdata - Object containing repair data to update
 * @returns {Array} - Updated repair data array
 */
function SC_update_dangsua(inputdata) {
  const msgData = [];
  msgData.push([new Date(), "[SC_update_dangsua] - Starting update for repair ID in progress: " + inputdata.id]);
  
  try {
    // Open spreadsheets and get sheets
    const ss = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DataSC);
    const configSS = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DanhSach);
    
    const sh_DataSC = ss.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
    const sh_DSUserDV = configSS.getSheetByName(CONFIG_SHEET_NAMES.DSUserDV);
    const sh_DSUserSua = configSS.getSheetByName(CONFIG_SHEET_NAMES.DSUserSua);
    const sh_DSThietBi = configSS.getSheetByName(CONFIG_SHEET_NAMES.DSThietBi);
    
    // Get data values
    const val_DataSC = sh_DataSC.getDataRange().getValues();
    const val_DSUserDV = sh_DSUserDV.getDataRange().getValues();
    const val_DSUserSua = sh_DSUserSua.getDataRange().getValues();
    const val_dsthietbi = sh_DSThietBi.getDataRange().getValues();
    
    // Find the repair record
    const rowsc = getfilterrow(val_DataSC, CONFIG_COLUMNS.DataSC.id, inputdata.id);
    if (!rowsc) {
      msgData.push([new Date(), "[SC_update_dangsua] - Repair ID not found: " + inputdata.id]);
      logDebugData(msgData);
      throw new Error("Repair ID not found: " + inputdata.id);
    }
    
    const rowggsheettb = val_DataSC.indexOf(rowsc) + 1;
    
    // Update repair record fields
    sh_DataSC.getRange(rowggsheettb, CONFIG_COLUMNS.DataSC.tinhtrangthietbiks + 1, 1, 1).setValue(inputdata.tinhtrangthietbiks);
    sh_DataSC.getRange(rowggsheettb, CONFIG_COLUMNS.DataSC.ketluankhaosat + 1, 1, 1).setValue(inputdata.ketluankhaosat);
    sh_DataSC.getRange(rowggsheettb, CONFIG_COLUMNS.DataSC.dexuatphuongan + 1, 1, 1).setValue(inputdata.dexuatphuongan);
    sh_DataSC.getRange(rowggsheettb, CONFIG_COLUMNS.DataSC.ghichu + 1, 1, 1).setValue(inputdata.ghichu);
    sh_DataSC.getRange(rowggsheettb, CONFIG_COLUMNS.DataSC.ngaykhaosat + 1, 1, 1).setValue(inputdata.ngaykhaosat);
    sh_DataSC.getRange(rowggsheettb, CONFIG_COLUMNS.DataSC.ngaybangiao + 1, 1, 1).setValue(inputdata.ngaybangiao);
    sh_DataSC.getRange(rowggsheettb, CONFIG_COLUMNS.DataSC.ngaydenghi + 1, 1, 1).setValue(inputdata.ngaydenghi);
    
    // Get department user data
    const rowuserdv = getfilterrow(inputdata.val_DSUserDV, CONFIG_COLUMNS.DSUserDV.id, inputdata.iduserdv);
    if (rowuserdv) {
      const rowggsheet = inputdata.val_DSUserDV.indexOf(rowuserdv) + 1;
      
      // Update department representatives and positions
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.bv1_daidien + 1, 1, 1).setValue(inputdata.bv1_daidien);
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.bv1_chucvu + 1, 1, 1).setValue(inputdata.bv1_chucvu);
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.bv2_daidien + 1, 1, 1).setValue(inputdata.bv2_daidien);
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.bv2_chucvu + 1, 1, 1).setValue(inputdata.bv2_chucvu);
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.bv3_daidien + 1, 1, 1).setValue(inputdata.bv3_daidien);
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.bv3_chucvu + 1, 1, 1).setValue(inputdata.bv3_chucvu);
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.bv4_daidien + 1, 1, 1).setValue(inputdata.bv4_daidien);
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.bv4_chucvu + 1, 1, 1).setValue(inputdata.bv4_chucvu);
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.bv5_daidien + 1, 1, 1).setValue(inputdata.bv5_daidien);
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.bv5_chucvu + 1, 1, 1).setValue(inputdata.bv5_chucvu);
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.dv1_daidien + 1, 1, 1).setValue(inputdata.dv1_daidien);
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.dv1_chucvu + 1, 1, 1).setValue(inputdata.dv1_chucvu);
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.dv2_daidien + 1, 1, 1).setValue(inputdata.dv2_daidien);
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.dv2_chucvu + 1, 1, 1).setValue(inputdata.dv2_chucvu);
      sh_DSUserDV.getRange(rowggsheet, CONFIG_COLUMNS.DSUserDV.quyetdinhtokhaosat + 1, 1, 1).setValue(inputdata.quyetdinhtokhaosat);
    }
    
    // Get necessary data for document creation
    const idtb = rowsc[CONFIG_COLUMNS.DataSC.idthietbi];
    const rowthietbi = getfilterrow(val_dsthietbi, CONFIG_COLUMNS.DSThietBi.id, idtb);
    
    const iduserdv = rowsc[CONFIG_COLUMNS.DataSC.iduserdv];
    const rowuserdvData = getfilterrow(val_DSUserDV, CONFIG_COLUMNS.DSUserDV.id, iduserdv);
    
    const idusersua = rowsc[CONFIG_COLUMNS.DataSC.idusersua];
    const rowusersua = getfilterrow(val_DSUserSua, CONFIG_COLUMNS.DSUserSua.id, idusersua);
    
    // Prepare data for document creation
    const datain = {
      id: inputdata.id,
      rowthietbi: rowthietbi,
      rowdvyc: rowuserdvData,
      rowusersc: rowusersua,
      sh_DSThietBi: sh_DSThietBi,
      sh_DataSC: sh_DataSC,
      val_dsthietbi: val_dsthietbi,
      val_DataSC: val_DataSC,
      rowsc: rowsc,
      rowggsheet: rowggsheettb
    };
    
    // Create appropriate documents based on repair status
    msgData.push([new Date(), "[SC_update_dangsua] - Creating documents for status: " + inputdata.status_sc]);
    
    switch (Number(inputdata.status_sc)) {
      case 1: // Báo hỏng - Initial repair report
        createfile_bm0902(datain);
        break;
        
      case 2: // Đang sửa - In repair
        createfile_bm0903(datain);
        createfile_bm0904(datain);
        break;
        
      case 3: // Bảo hành - Under warranty
        createfile_bm0904(datain);
        break;
        
      case 4: // Sửa ngoài - External repair
        createfile_bm0904(datain);
        break;
        
      default:
        msgData.push([new Date(), "[SC_update_dangsua] - Unknown status: " + inputdata.status_sc]);
        break;
    }
    
    msgData.push([new Date(), "[SC_update_dangsua] - Successfully updated repair data for ID: " + inputdata.id]);
    logDebugData(msgData);
    
    return sh_DataSC.getDataRange().getValues();
  } catch (error) {
    msgData.push([new Date(), "[SC_update_dangsua] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
} 


/**
 * Updates the password for a repair user
 * @param {string} id - User ID
 * @param {string} newpass - New password
 * @returns {boolean} True if successful
 */
function updateUserPassword(passwordData) {
  const msgData = [];
  msgData.push([new Date(), "[updateUserPassword] - Starting password update for ID: " + passwordData.id]);
  
  try {
    const ss = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DanhSach);
    const sh_DSUserDV = ss.getSheetByName(CONFIG_SHEET_NAMES.DSUserDV);  // Thay đổi từ DSUserSua sang DSUserDV
    const val_DSUserDV = sh_DSUserDV.getDataRange().getValues();
    
    const rowuser = getfilterrow(val_DSUserDV, CONFIG_COLUMNS.DSUserDV.id, passwordData.id);
    if (!rowuser) {
      msgData.push([new Date(), "[updateUserPassword] - User not found: " + passwordData.id]);
      logDebugData(msgData);
      return false;
    }
    
    const rowggsheet = val_DSUserDV.indexOf(rowuser) + 1;
    const colpass = CONFIG_COLUMNS.DSUserDV.pass + 1;  // Sửa thành DSUserDV
    
    // Update password
    sh_DSUserDV.getRange(rowggsheet, colpass, 1, 1).setValue(passwordData.newPassword);
    
    msgData.push([new Date(), "[updateUserPassword] - Password updated successfully"]);
    logDebugData(msgData);
    return true;
  } catch (error) {
    msgData.push([new Date(), "[updateUserPassword] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
}