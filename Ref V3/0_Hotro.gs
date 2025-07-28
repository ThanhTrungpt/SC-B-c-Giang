/**
 * Utility functions for the repair management system
 */

// ===== 1. DATA FILTERING FUNCTIONS =====

/**
 * Filters a row from an array of rows based on a specific column value.
 * @param {Array} values - Array containing rows of data.
 * @param {number} columfilter - Index of the column to filter by.
 * @param {string|number} valuefilter - Value to filter for.
 * @returns {Array|null} - First matching row or null if not found.
 */
function getfilterrow(values, columfilter, valuefilter) {
  const msgData = [];
  msgData.push([new Date(), "[getfilterrow] - Filtering for value: " + valuefilter + " in column: " + columfilter]);
  
  try {
    if (!values || !values.length) {
      msgData.push([new Date(), "[getfilterrow] - Empty values array provided"]);
      logDebugData(msgData);
      return null;
    }
    
    const filteredRows = values.filter(function(row) {
      // Handle undefined values and type conversions for robust comparison
      const cellValue = row[columfilter];
      const searchValue = valuefilter;
      
      if (cellValue === undefined || searchValue === undefined) {
        return false;
      }
      
      // Convert to string for comparison if both values are defined
      return String(cellValue).toLowerCase() === String(searchValue).toLowerCase();
    });
    
    if (filteredRows.length === 0) {
      msgData.push([new Date(), "[getfilterrow] - No data found for: " + valuefilter]);
      logDebugData(msgData);
      return null;
    }
    
    msgData.push([new Date(), "[getfilterrow] - Found matching row"]);
    logDebugData(msgData);
    return filteredRows[0];
  } catch (error) {
    msgData.push([new Date(), "[getfilterrow] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
}

/**
 * Gets all rows matching a filter value in a specified column.
 * @param {Array} values - Array containing rows of data.
 * @param {number} columnFilter - Index of the column to filter by.
 * @param {string|number} valueFilter - Value to filter for.
 * @returns {Array} - Array of matching rows or empty array if none found.
 */
function getFilteredValues(values, columnFilter, valueFilter) {
  const msgData = [];
  msgData.push([new Date(), "[getFilteredValues] - Filtering for value: " + valueFilter + " in column: " + columnFilter]);
  
  try {
    if (!values || !values.length) {
      msgData.push([new Date(), "[getFilteredValues] - Empty values array provided"]);
      logDebugData(msgData);
      return [];
    }
    
    const filteredRows = values.filter(function(row) {
      // Handle type conversions for robust comparison
      const cellValue = row[columnFilter];
      const searchValue = valueFilter;
      
      if (cellValue === undefined || searchValue === undefined) {
        return false;
      }
      
      // Convert to string for comparison
      return String(cellValue).toLowerCase() === String(searchValue).toLowerCase();
    });
    
    msgData.push([new Date(), "[getFilteredValues] - Found " + filteredRows.length + " matching rows"]);
    logDebugData(msgData);
    return filteredRows;
  } catch (error) {
    msgData.push([new Date(), "[getFilteredValues] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    return [];
  }
}

// ===== 2. GOOGLE DRIVE FUNCTIONS =====

/**
 * Gets a file by name within a specific folder
 * @param {string} folderId - ID of the folder to search in
 * @param {string} fileName - Name of the file to search for
 * @returns {Object|null} - File object or null if not found
 */
function getFileByNameInFolder(folderId, fileName) {
  const msgData = [];
  msgData.push([new Date(), "[getFileByNameInFolder] - Searching for file: " + fileName + " in folder: " + folderId]);
  
  try {
    const optionalArgs = {
      q: "name='" + fileName + "' and '" + folderId + "' in parents and trashed=false",
      fields: "files(id, name)"
    };
    
    const response = Drive.Files.list(optionalArgs);
    const files = response.files;
    
    if (files && files.length > 0) {
      msgData.push([new Date(), "[getFileByNameInFolder] - Found file: " + files[0].name]);
      logDebugData(msgData);
      return files[0];
    } else {
      msgData.push([new Date(), "[getFileByNameInFolder] - File not found"]);
      logDebugData(msgData);
      return null;
    }
  } catch (error) {
    msgData.push([new Date(), "[getFileByNameInFolder] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    return null;
  }
}

/**
 * Copies a sheet to a new spreadsheet
 * @param {string} sourceSpreadsheetId - ID of source spreadsheet
 * @param {string} sourceSheetName - Name of source sheet
 * @param {string} targetFolderId - ID of target folder
 * @param {string} targetFileName - Name for the target file
 * @returns {Object} - Object with ID and URL of the created file
 */
function copySheetToNewSpreadsheet(sourceSpreadsheetId, sourceSheetName, targetFolderId, targetFileName) {
  const msgData = [];
  msgData.push([new Date(), "[copySheetToNewSpreadsheet] - Copying sheet: " + sourceSheetName + " to new file: " + targetFileName]);
  
  try {
    // Open source spreadsheet and get sheet
    const sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetId);
    const sourceSheet = sourceSpreadsheet.getSheetByName(sourceSheetName);
    
    if (!sourceSheet) {
      msgData.push([new Date(), "[copySheetToNewSpreadsheet] - Source sheet not found: " + sourceSheetName]);
      logDebugData(msgData);
      throw new Error("Source sheet not found: " + sourceSheetName);
    }
    
    // Check if target file exists
    const targetFolder = DriveApp.getFolderById(targetFolderId);
    const files = targetFolder.getFilesByName(targetFileName);
    
    let targetSpreadsheet;
    let isNewFile = false;
    
    if (files.hasNext()) {
      // Open existing target file
      const file = files.next();
      targetSpreadsheet = SpreadsheetApp.openById(file.getId());
      
      // Delete sheet with same name if exists
      const sheet = targetSpreadsheet.getSheetByName(sourceSheetName);
      if (sheet) {
        targetSpreadsheet.deleteSheet(sheet);
      }
    } else {
      // Create new target file
      targetSpreadsheet = SpreadsheetApp.create(targetFileName);
      isNewFile = true;
      
      // Move to target folder
      const newSpreadsheetId = targetSpreadsheet.getId();
      const file = DriveApp.getFileById(newSpreadsheetId);
      targetFolder.addFile(file);
      DriveApp.getRootFolder().removeFile(file);
    }
    
    // Copy sheet from source to target
    sourceSheet.copyTo(targetSpreadsheet).setName(sourceSheetName);
    
    // Delete default sheet if new file
    if (isNewFile) {
      const defaultSheet = targetSpreadsheet.getSheets()[0];
      targetSpreadsheet.deleteSheet(defaultSheet);
    }
    
    // Get URL for access
    const url = targetSpreadsheet.getUrl().replace(/\/view\?usp=drivesdk$/, "/edit");
    
    const result = {
      "id": targetSpreadsheet.getId(),
      "url": url
    };
    
    msgData.push([new Date(), "[copySheetToNewSpreadsheet] - Successfully copied sheet to: " + result.url]);
    logDebugData(msgData);
    
    return result;
  } catch (error) {
    msgData.push([new Date(), "[copySheetToNewSpreadsheet] - ERROR: " + error.toString()]);
    logDebugData(msgData);
    throw error;
  }
}

// ===== 3. FORMATTING FUNCTIONS =====

/**
 * Formats a number as a money string with proper separators
 * @param {string|number} amount - The amount to format
 * @returns {string} - Formatted money string
 */
function formatMoneyString(amount) {
  // Convert to string
  const amountStr = String(amount);
  
  // Split into groups of 3 from right to left
  const parts = [];
  let tempAmount = amountStr;
  
  while (tempAmount.length > 3) {
    parts.unshift(tempAmount.slice(-3));
    tempAmount = tempAmount.slice(0, -3);
  }
  
  // Add remaining digits
  if (tempAmount) {
    parts.unshift(tempAmount);
  }
  
  // Join with period separator
  return parts.join('.');
}

/**
 * Formats a Date object to a string in dd/MM/yyyy format
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  if (!(date instanceof Date)) {
    return "";
  }
  
  const scriptTimeZone = Session.getScriptTimeZone();
  return Utilities.formatDate(date, scriptTimeZone, "dd/MM/yyyy");
}

/**
 * Converts a date string in dd/MM/yyyy format to Date object
 * @param {string} dateString - The date string to convert
 * @returns {Date} - Date object
 */
function convertStringToDate(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  
  try {
    // Parse the date parts
    const parts = dateString.split("/");
    if (parts.length !== 3) {
      return null;
    }
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Subtract 1 as months are 0-based
    const year = parseInt(parts[2], 10);
    
    // Check if parts are valid numbers
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
    }
    
    return new Date(year, month, day);
  } catch (error) {
    console.error("Error converting date string: " + error);
    return null;
  }
}

/**
 * Converts a number to Roman numerals (up to 4)
 * @param {number} number - Number to convert
 * @returns {string} - Roman numeral or original number as string
 */
function convertosolama(number) {
  const romanNumerals = ["I", "II", "III", "IV"];
  return number >= 1 && number <= 4 ? romanNumerals[number - 1] : String(number);
}

// ===== 4. SPREADSHEET UTILITIES =====

/**
 * Gets the last row with data in a specific column
 * @param {Sheet} sheet - The sheet to search in
 * @param {string} columnName - Column letter (e.g., 'A', 'B')
 * @returns {number} - The last row number with data
 */
function getlastrowincolumn(sheet, columnName) {
  const lr = sheet.getLastRow();
  let lrincolumn = sheet.getRange(columnName + lr).getNextDataCell(SpreadsheetApp.Direction.UP).getLastRow();
  
  // Check if the last row already has a value
  const value = sheet.getRange(columnName + lr).getValue();
  if (value !== "") {
    lrincolumn = lr;
  }
  
  return lrincolumn;
}

/**
 * Handles drawings in a sheet and positions them
 * @param {Sheet} sheet - The sheet containing drawings
 * @param {number} startRow - Start row for positioning
 * @param {number} endRow - End row for positioning
 * @param {number} startCol - Start column for positioning
 * @param {number} endCol - End column for positioning
 */
function drawdingSheet(sheet, startRow, endRow, startCol, endCol) {
  const drawings = sheet.getDrawings();
  
  for (let i = 0; i < drawings.length; i++) {
    const drawing = drawings[i];
    
    // Only reposition drawings without onAction
    if (drawing.getOnAction() === "") {
      drawing.setPosition(startRow, startCol, 0, 0);
      
      // Calculate and set height
      const height = getRowHeight(sheet, startRow, endRow);
      drawing.setHeight(height);
      
      // Calculate and set width
      const width = getColumnWidth(sheet, startCol, endCol);
      drawing.setWidth(width);
      
      return;
    }
  }
}

/**
 * Calculates the total height of a range of rows
 * @param {Sheet} sheet - The sheet to measure
 * @param {number} startRow - Start row
 * @param {number} endRow - End row
 * @returns {number} - Total height in pixels
 */
function getRowHeight(sheet, startRow, endRow) {
  let totalHeight = 0;
  
  for (let row = startRow; row <= endRow; row++) {
    totalHeight += sheet.getRowHeight(row);
  }
  
  return totalHeight;
}

/**
 * Calculates the total width of a range of columns
 * @param {Sheet} sheet - The sheet to measure
 * @param {number} startCol - Start column
 * @param {number} endCol - End column
 * @returns {number} - Total width in pixels
 */
function getColumnWidth(sheet, startCol, endCol) {
  let totalWidth = 0;
  
  for (let col = startCol; col <= endCol; col++) {
    if (!sheet.isColumnHiddenByUser(col)) {
      totalWidth += sheet.getColumnWidth(col);
    }
  }
  
  return totalWidth;
} 