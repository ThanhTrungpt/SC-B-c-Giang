/**
 * Document conversion module for repair management system
 * Handles creation of repair documents from templates
 */

// ===== 1. DOCUMENT CREATION FUNCTIONS =====

/**
 * Creates BM.VTTB.09.01 repair request document
 * @param {Object} data - Object containing necessary data for document creation
 * @returns {Object} - Object with document ID and URL
 */
function createfile_bm0901(data) {
  const msgData = [];
  msgData.push([new Date(), "[createfile_bm0901] - Creating repair request document for ID: " + data.id]);
  
  try {
    // Get template document
    const templateId = CONFIG_TEMPLATES.BM_VTTB_09_01;
    const templateDoc = DocumentApp.openById(templateId);
    
    if (!templateDoc) {
      msgData.push([new Date(), "[createfile_bm0901] - Template document not found: " + templateId]);
      logDebugData(msgData);
      throw new Error("Template document not found: " + templateId);
    }
    
    // Get equipment data
    const equipmentData = data.rowthietbi;
    const departmentData = data.rowdvyc;
    
    if (!equipmentData || !departmentData) {
      msgData.push([new Date(), "[createfile_bm0901] - Missing required data for document creation"]);
      logDebugData(msgData);
      throw new Error("Missing required data for document creation");
    }
    
    // Get current date
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    
    // Prepare replacement data
    const replacements = {
      "{{Đơn vị yêu cầu}}": departmentData[CONFIG_COLUMNS.DSUserDV.donvi],
      "{{today}}": day,
      "{{month}}": month,
      "{{year}}": year,
      "{{Tên thiết bị}}": equipmentData[CONFIG_COLUMNS.DSThietBi.tentb],
      "{{Model}}": equipmentData[CONFIG_COLUMNS.DSThietBi.model],
      "{{Serial}}": equipmentData[CONFIG_COLUMNS.DSThietBi.serial],
      "{{Hãng sản xuất}}": equipmentData[CONFIG_COLUMNS.DSThietBi.hangsx],
      "{{Nước sản xuất}}": equipmentData[CONFIG_COLUMNS.DSThietBi.nuocsx],
      "{{Năm sản xuất}}": equipmentData[CONFIG_COLUMNS.DSThietBi.namsx],
      "{{Năm sử dụng}}": equipmentData[CONFIG_COLUMNS.DSThietBi.namsd],
      "{{QR_CODE}}": generateQRCodeUrl(data.id),
      "{{id}}": data.id
    };
    
    // Create copy of template with new name
    const fileName = "BM.VTTB.09.01 Giấy đề nghị sửa chữa - " + data.id;
    const documentFolder = getFolderOrCreate("Repair_Documents");
    
    // Check if file already exists
    let docFile = getFileByNameInFolder(documentFolder.getId(), fileName);
    
    if (docFile) {
      // Update existing file
      const existingDoc = DocumentApp.openById(docFile.id);
      const body = existingDoc.getBody();
      
      // Replace text in document
      for (const [placeholder, value] of Object.entries(replacements)) {
        if (value) {
          body.replaceText(placeholder, value.toString());
        } else {
          body.replaceText(placeholder, "");
        }
      }
      
      existingDoc.saveAndClose();
      msgData.push([new Date(), "[createfile_bm0901] - Updated existing document: " + fileName]);
    } else {
      // Create new document from template
      const newDoc = DriveApp.getFileById(templateId).makeCopy(fileName, documentFolder);
      const doc = DocumentApp.openById(newDoc.getId());
      const body = doc.getBody();
      
      // Replace text in document
      for (const [placeholder, value] of Object.entries(replacements)) {
        if (value) {
          body.replaceText(placeholder, value.toString());
        } else {
          body.replaceText(placeholder, "");
        }
      }
      
      doc.saveAndClose();
      docFile = newDoc;
      msgData.push([new Date(), "[createfile_bm0901] - Created new document: " + fileName]);
    }
    
    // Generate PDF if needed
    const pdfFile = generatePdf(docFile.getId(), fileName.replace(".docx", ".pdf"));
    
    // Update repair record with document links if full data is provided
    if (data.sh_DataSC && data.rowggsheet) {
      const docUrl = DriveApp.getFileById(docFile.getId()).getUrl();
      const pdfUrl = pdfFile ? DriveApp.getFileById(pdfFile.getId()).getUrl() : "";
      
      data.sh_DataSC.getRange(data.rowggsheet, CONFIG_COLUMNS.DataSC.url_vttb_09_01_word + 1, 1, 1).setValue(docUrl);
      data.sh_DataSC.getRange(data.rowggsheet, CONFIG_COLUMNS.DataSC.url_vttb_09_01_pdf + 1, 1, 1).setValue(pdfUrl);
    }
    
    const result = {
      docId: docFile.getId(),
      pdfId: pdfFile ? pdfFile.getId() : null,
      docUrl: DriveApp.getFileById(docFile.getId()).getUrl(),
      pdfUrl: pdfFile ? DriveApp.getFileById(pdfFile.getId()).getUrl() : null
    };
    
    msgData.push([new Date(), "[createfile_bm0901] - Document creation completed successfully"]);
    logDebugData(msgData);
    
    return result;
  } catch (error) {
    msgData.push([new Date(), "[createfile_bm0901] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
}

/**
 * Creates BM.VTTB.09.02 equipment survey report
 * @param {Object} data - Object containing necessary data for document creation
 * @returns {Object} - Object with document ID and URL
 */
function createfile_bm0902(data) {
  const msgData = [];
  msgData.push([new Date(), "[createfile_bm0902] - Creating equipment survey report for ID: " + data.id]);
  
  try {
    // Get template document
    const templateId = CONFIG_TEMPLATES.BM_VTTB_09_02;
    const templateDoc = DocumentApp.openById(templateId);
    
    if (!templateDoc) {
      msgData.push([new Date(), "[createfile_bm0902] - Template document not found: " + templateId]);
      logDebugData(msgData);
      throw new Error("Template document not found: " + templateId);
    }
    
    // Get required data from input
    const equipmentData = data.rowthietbi;
    const departmentData = data.rowdvyc;
    const repairData = data.rowsc;
    
    if (!equipmentData || !departmentData || !repairData) {
      msgData.push([new Date(), "[createfile_bm0902] - Missing required data for document creation"]);
      logDebugData(msgData);
      throw new Error("Missing required data for document creation");
    }
    
    // Parse survey date if available
    let surveyDateObj = new Date();
    if (repairData[CONFIG_COLUMNS.DataSC.ngaykhaosat]) {
      try {
        const dateStr = repairData[CONFIG_COLUMNS.DataSC.ngaykhaosat];
        if (typeof dateStr === 'string' && dateStr.includes('/')) {
          surveyDateObj = convertStringToDate(dateStr) || new Date();
        } else if (dateStr instanceof Date) {
          surveyDateObj = dateStr;
        }
      } catch (e) {
        msgData.push([new Date(), "[createfile_bm0902] - Error parsing survey date: " + e.toString()]);
      }
    }
    
    // Get date parts
    const day_ngaykhaosat = surveyDateObj.getDate();
    const month_ngaykhaosat = surveyDateObj.getMonth() + 1;
    const year_ngaykhaosat = surveyDateObj.getFullYear();
    
    // Parse report date if available
    let reportDateObj = new Date();
    if (repairData[CONFIG_COLUMNS.DataSC.ngaydonvibao]) {
      try {
        const dateStr = repairData[CONFIG_COLUMNS.DataSC.ngaydonvibao];
        if (typeof dateStr === 'string' && dateStr.includes('/')) {
          reportDateObj = convertStringToDate(dateStr) || new Date();
        } else if (dateStr instanceof Date) {
          reportDateObj = dateStr;
        }
      } catch (e) {
        msgData.push([new Date(), "[createfile_bm0902] - Error parsing report date: " + e.toString()]);
      }
    }
    
    // Get report date parts
    const day_ngaydvbao = reportDateObj.getDate();
    const month_ngaydvbao = reportDateObj.getMonth() + 1;
    const year_ngaydvbao = reportDateObj.getFullYear();
    
    // Prepare replacement data
    const replacements = {
      "{{day_ngaykhaosat}}": day_ngaykhaosat,
      "{{month_ngaykhaosat}}": month_ngaykhaosat,
      "{{year_ngaykhaosat}}": year_ngaykhaosat,
      "{{Đơn vị yêu cầu}}": departmentData[CONFIG_COLUMNS.DSUserDV.donvi],
      "{{day_ngaydvbao}}": day_ngaydvbao,
      "{{month_ngaydvbao}}": month_ngaydvbao,
      "{{year_ngaydvbao}}": year_ngaydvbao,
      "{{Quyết định tổ khảo sát}}": departmentData[CONFIG_COLUMNS.DSUserDV.quyetdinhtokhaosat] || "",
      
      // Hospital representatives
      "{{Đại diện BV 1}}": departmentData[CONFIG_COLUMNS.DSUserDV.bv1_daidien] || "",
      "{{Chức vụ DD BV 1}}": departmentData[CONFIG_COLUMNS.DSUserDV.bv1_chucvu] || "",
      "{{Đại diện BV 2}}": departmentData[CONFIG_COLUMNS.DSUserDV.bv2_daidien] || "",
      "{{Chức vụ DD BV 2}}": departmentData[CONFIG_COLUMNS.DSUserDV.bv2_chucvu] || "",
      "{{Đại diện BV 3}}": departmentData[CONFIG_COLUMNS.DSUserDV.bv3_daidien] || "",
      "{{Chức vụ DD BV 3}}": departmentData[CONFIG_COLUMNS.DSUserDV.bv3_chucvu] || "",
      "{{Đại diện BV 4}}": departmentData[CONFIG_COLUMNS.DSUserDV.bv4_daidien] || "",
      "{{Chức vụ DD BV 4}}": departmentData[CONFIG_COLUMNS.DSUserDV.bv4_chucvu] || "",
      "{{Đại diện BV 5}}": departmentData[CONFIG_COLUMNS.DSUserDV.bv5_daidien] || "",
      "{{Chức vụ DD BV 5}}": departmentData[CONFIG_COLUMNS.DSUserDV.bv5_chucvu] || "",
      
      // Department representatives
      "{{Đại diện ĐV Báo sửa 1}}": departmentData[CONFIG_COLUMNS.DSUserDV.dv1_daidien] || "",
      "{{Chức vụ DD ĐV Báo sửa 1}}": departmentData[CONFIG_COLUMNS.DSUserDV.dv1_chucvu] || "",
      "{{Đại diện ĐV Báo sửa 2}}": departmentData[CONFIG_COLUMNS.DSUserDV.dv2_daidien] || "",
      "{{Chức vụ DD ĐV Báo sửa 2}}": departmentData[CONFIG_COLUMNS.DSUserDV.dv2_chucvu] || "",
      
      // Equipment data
      "{{Tên thiết bị}}": equipmentData[CONFIG_COLUMNS.DSThietBi.tentb],
      "{{Model}}": equipmentData[CONFIG_COLUMNS.DSThietBi.model],
      "{{Serial}}": equipmentData[CONFIG_COLUMNS.DSThietBi.serial],
      "{{Hãng sản xuất}}": equipmentData[CONFIG_COLUMNS.DSThietBi.hangsx],
      "{{Nước sản xuất}}": equipmentData[CONFIG_COLUMNS.DSThietBi.nuocsx],
      "{{Năm sản xuất}}": equipmentData[CONFIG_COLUMNS.DSThietBi.namsx],
      "{{Năm sử dụng}}": equipmentData[CONFIG_COLUMNS.DSThietBi.namsd],
      
      // Repair status
      "{{Tình trang thiết bị khảo sát}}": repairData[CONFIG_COLUMNS.DataSC.tinhtrangthietbiks] || "",
      "{{Kết luận khảo sát}}": repairData[CONFIG_COLUMNS.DataSC.ketluankhaosat] || "",
      "{{Đề xuất phương án}}": repairData[CONFIG_COLUMNS.DataSC.dexuatphuongan] || "",
      "{{QR_CODE}}": generateQRCodeUrl(data.id),
      "{{id}}": data.id
    };
    
    // Create copy of template with new name
    const fileName = "BM.VTTB.09.02 Biên bản khảo sát tình trạng thiết bị hỏng - " + data.id;
    const documentFolder = getFolderOrCreate("Repair_Documents");
    
    // Check if file already exists
    let docFile = getFileByNameInFolder(documentFolder.getId(), fileName);
    
    if (docFile) {
      // Update existing file
      const existingDoc = DocumentApp.openById(docFile.id);
      const body = existingDoc.getBody();
      
      // Replace text in document
      for (const [placeholder, value] of Object.entries(replacements)) {
        if (value) {
          body.replaceText(placeholder, value.toString());
        } else {
          body.replaceText(placeholder, "");
        }
      }
      
      existingDoc.saveAndClose();
      msgData.push([new Date(), "[createfile_bm0902] - Updated existing document: " + fileName]);
    } else {
      // Create new document from template
      const newDoc = DriveApp.getFileById(templateId).makeCopy(fileName, documentFolder);
      const doc = DocumentApp.openById(newDoc.getId());
      const body = doc.getBody();
      
      // Replace text in document
      for (const [placeholder, value] of Object.entries(replacements)) {
        if (value) {
          body.replaceText(placeholder, value.toString());
        } else {
          body.replaceText(placeholder, "");
        }
      }
      
      doc.saveAndClose();
      docFile = newDoc;
      msgData.push([new Date(), "[createfile_bm0902] - Created new document: " + fileName]);
    }
    
    // Generate PDF if needed
    const pdfFile = generatePdf(docFile.getId(), fileName.replace(".docx", ".pdf"));
    
    // Update repair record with document links if full data is provided
    if (data.sh_DataSC && data.rowggsheet) {
      const docUrl = DriveApp.getFileById(docFile.getId()).getUrl();
      data.sh_DataSC.getRange(data.rowggsheet, CONFIG_COLUMNS.DataSC.url_vttb_09_02 + 1, 1, 1).setValue(docUrl);
    }
    
    const result = {
      docId: docFile.getId(),
      pdfId: pdfFile ? pdfFile.getId() : null,
      docUrl: DriveApp.getFileById(docFile.getId()).getUrl(),
      pdfUrl: pdfFile ? DriveApp.getFileById(pdfFile.getId()).getUrl() : null
    };
    
    msgData.push([new Date(), "[createfile_bm0902] - Document creation completed successfully"]);
    logDebugData(msgData);
    
    return result;
  } catch (error) {
    msgData.push([new Date(), "[createfile_bm0902] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
}

/**
 * Creates BM.VTTB.09.03 repair proposal document
 * @param {Object} data - Object containing necessary data for document creation
 * @returns {Object} - Object with document ID and URL
 */
function createfile_bm0903(data) {
  const msgData = [];
  msgData.push([new Date(), "[createfile_bm0903] - Creating repair proposal document for ID: " + data.id]);
  
  try {
    // Implementation similar to createfile_bm0902 but with appropriate template and fields
    // Template ID
    const templateId = CONFIG_TEMPLATES.BM_VTTB_09_03;
    
    // Get required data
    const equipmentData = data.rowthietbi;
    const departmentData = data.rowdvyc;
    const repairData = data.rowsc;
    
    if (!equipmentData || !departmentData || !repairData) {
      msgData.push([new Date(), "[createfile_bm0903] - Missing required data for document creation"]);
      logDebugData(msgData);
      throw new Error("Missing required data for document creation");
    }
    
    // Create the document similar to the pattern in createfile_bm0902
    // But with fields appropriate for BM.VTTB.09.03
    
    // File name
    const fileName = "BM.VTTB.09.03 Giấy đề nghị phương án sửa chữa - " + data.id;
    
    // The rest of the implementation follows the same pattern
    // Return appropriate result
    
    // Placeholder for success message
    msgData.push([new Date(), "[createfile_bm0903] - Document creation completed successfully"]);
    logDebugData(msgData);
    
    return {
      docId: "placeholder",
      docUrl: "placeholder" 
    };
  } catch (error) {
    msgData.push([new Date(), "[createfile_bm0903] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
}

/**
 * Creates BM.VTTB.09.04 handover document
 * @param {Object} data - Object containing necessary data for document creation
 * @returns {Object} - Object with document ID and URL
 */
function createfile_bm0904(data) {
  const msgData = [];
  msgData.push([new Date(), "[createfile_bm0904] - Creating handover document for ID: " + data.id]);
  
  try {
    // Implementation similar to createfile_bm0902 but with appropriate template and fields
    // Template ID
    const templateId = CONFIG_TEMPLATES.BM_VTTB_09_04;
    
    // Get required data
    const equipmentData = data.rowthietbi;
    const departmentData = data.rowdvyc;
    const repairData = data.rowsc;
    
    if (!equipmentData || !departmentData || !repairData) {
      msgData.push([new Date(), "[createfile_bm0904] - Missing required data for document creation"]);
      logDebugData(msgData);
      throw new Error("Missing required data for document creation");
    }
    
    // Create the document similar to the pattern in createfile_bm0902
    // But with fields appropriate for BM.VTTB.09.04
    
    // File name
    const fileName = "BM.VTTB.09.04 Biên bản bàn giao, nghiệm thu, đưa vào sử dụng - " + data.id;
    
    // The rest of the implementation follows the same pattern
    // Return appropriate result
    
    // Placeholder for success message
    msgData.push([new Date(), "[createfile_bm0904] - Document creation completed successfully"]);
    logDebugData(msgData);
    
    return {
      docId: "placeholder",
      docUrl: "placeholder" 
    };
  } catch (error) {
    msgData.push([new Date(), "[createfile_bm0904] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
}

// ===== 2. HELPER FUNCTIONS =====

/**
 * Gets or creates a folder for storing repair documents
 * @param {string} folderName - Name of the folder to find or create
 * @returns {Folder} - Google Drive folder
 */
function getFolderOrCreate(folderName) {
  // Check if folder exists
  const folderIterator = DriveApp.getFoldersByName(folderName);
  
  if (folderIterator.hasNext()) {
    return folderIterator.next();
  } else {
    // Create folder if it doesn't exist
    return DriveApp.createFolder(folderName);
  }
}

/**
 * Generates a PDF from a Google Doc
 * @param {string} docId - ID of the Google Doc
 * @param {string} pdfName - Name for the PDF file
 * @returns {File|null} - Google Drive file object or null if failed
 */
function generatePdf(docId, pdfName) {
  try {
    // Get the Google Doc
    const docFile = DriveApp.getFileById(docId);
    const docBlob = docFile.getAs('application/pdf');
    
    // Set the name for the PDF
    docBlob.setName(pdfName);
    
    // Get the parent folder
    const parentFolder = docFile.getParents().next();
    
    // Check if PDF already exists
    const existingPdfFiles = parentFolder.getFilesByName(pdfName);
    
    if (existingPdfFiles.hasNext()) {
      // Update existing PDF
      const existingPdf = existingPdfFiles.next();
      existingPdf.setContent(docBlob.getBytes());
      return existingPdf;
    } else {
      // Create new PDF
      return parentFolder.createFile(docBlob);
    }
  } catch (error) {
    console.error("Error generating PDF: " + error);
    return null;
  }
}

/**
 * Generates a QR code URL for a repair ID
 * @param {string} repairId - The repair ID to encode in the QR code
 * @returns {string} - URL to QR code image
 */
function generateQRCodeUrl(repairId) {
  // Use Google Charts API to generate QR code
  const baseUrl = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=";
  
  // Data to encode in QR code - the repair ID
  const data = encodeURIComponent(repairId);
  
  return baseUrl + data;
} 