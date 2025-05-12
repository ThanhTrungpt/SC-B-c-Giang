
/**
 * Lọc hàng từ một mảng các hàng dựa trên giá trị của một cột cụ thể.
 *
 * @param {Array} values - Mảng chứa các hàng dữ liệu.
 * @param {number} columfilter - Chỉ số cột cần lọc.
 * @param {string|number} valuefilter - Giá trị cần lọc.
 * @return {Array|null} - Hàng đầu tiên khớp với giá trị lọc, hoặc null nếu không tìm thấy.
 */
function getfilterrow(values, columfilter, valuefilter) {
  var filteredRows = values.filter(function(row) {
    // So sánh không phân biệt hoa thường
    return row[columfilter].toLowerCase() === valuefilter.toLowerCase();
  });
  
  if (filteredRows.length === 0) {
    Logger.log("Không tìm thấy dữ liệu: " + valuefilter);
    return null;
  }  
  return filteredRows[0];
}

function getFilteredValues(values, columnFilter, valueFilter) {
  var filteredRows = values.filter(function(row) {
    // So sánh không phân biệt hoa thường
    return row[columfilter].toLowerCase() === valuefilter.toLowerCase();
  });

  if (filteredRows.length === 0) {
    Logger.log("Không tìm thấy dữ liệu: " + valueFilter);
    return []; // Trả về một mảng rỗng nếu không có dữ liệu được tìm thấy
  }

  return filteredRows;
}
function getFileByNameInFolder(folderId, fileName) {
  var optionalArgs = {
    q: "name='" + fileName + "' and '" + folderId + "' in parents and trashed=false",
    fields: "files(id, name)"
  };
  var response = Drive.Files.list(optionalArgs);
  var files = response.files;
  
  if (files && files.length > 0) {
    return files[0];
  } else {
    Logger.log("Không tìm thấy tệp.");
    return null;
  }
}
//Format money
function formatMoneyString(amount) {
  // Chia chuỗi số thành các cặp ba ký tự từ phải sang trái
  var parts = [];
  while (amount.length > 3) {
    parts.unshift(amount.slice(-3));
    amount = amount.slice(0, -3);
  }
  // Thêm phần còn lại của chuỗi số
  if (amount) {
    parts.unshift(amount);
  }
  // Kết hợp các phần và thêm dấu chấm phân tách
  return parts.join('.') ;
}


function getlastrowincolumn(sh, columnname) {
  var lr = sh.getLastRow()
  var lrincolumn =  sh.getRange(columnname+ lr).getNextDataCell(SpreadsheetApp.Direction.UP).getLastRow()
  var value = sh.getRange(columnname + lr).getValue()
  if (value !== "") {
    lrincolumn = lr
  }
  return lrincolumn
}



function formatDate(date) {
  var scriptTimeZone = Session.getScriptTimeZone();
  var formattedDate = Utilities.formatDate(date, scriptTimeZone, "dd/MM/yyyy");
  return formattedDate;
}

function convertStringToDate(dateString) {
  // Tách ngày, tháng, năm từ chuỗi
  var parts = dateString.split("/");
  var day = parseInt(parts[0], 10);     // Lấy ngày
  var month = parseInt(parts[1], 10) - 1; // Lấy tháng (giảm 1 do tháng trong JavaScript bắt đầu từ 0)
  var year = parseInt(parts[2], 10);   // Lấy năm

  // Tạo đối tượng Date
  return new Date(year, month, day);
}

function drawdingSheet(sheet, startRow, endRow,startcol, endcold) { 
  // Lấy danh sách các drawings trong sheet
  var drawings = sheet.getDrawings();
  for (var i=0; i<drawings.length;i++) {
    var drawing = drawings[i];
    if (drawing.getOnAction() ==="") {      
      drawing.setPosition(startRow,startcol,0,0)
      var height = getRowHeight(sheet,startRow,endRow)
      drawing.setHeight (height)  ;
      var width = getColumnWidth(sheet,startcol,endcold)
      drawing.setWidth(width);
      return;
    }
  }
}

function getRowHeight(sheet,  startRow, endRow) {
  var totalHeight = 0; // Biến để tính tổng chiều cao      
      for (var row = startRow; row <= endRow; row++) {
        var rowHeight = sheet.getRowHeight(row);
        totalHeight += rowHeight;
      }
  return totalHeight  
}

function getColumnWidth(sheet,  startcol , endcold) {
  var totalHeight = 0; // Biến để tính tổng chiều cao      
    for (var col = startcol; col <= endcold; col++) {
        var cvisible = sheet.isColumnHiddenByUser(col)
        if (cvisible !==true) {
          var rowHeight = sheet.getColumnWidth(col);
          totalHeight += rowHeight;
        }
    }
  return totalHeight 
}

function getColumnWidth1(sheet,  startcol , endcold) {
   var totalHeight = 0; // Biến để tính tổng chiều cao      
      for (var col = startcol; col <= endcold; col++) {
        var cvisible = sheet.isColumnHiddenByUser(col)
        if (cvisible !==true) {
          var rowHeight = sheet.getColumnWidth(col);
          totalHeight += rowHeight;
        }
      }
      
  return totalHeight  
}

function copySheetToNewSpreadsheet(sourceSpreadsheetId, sourceSheetName, targetFolderId, targetFileName) {
  // Mở file nguồn và lấy sheet cần sao chép
  var sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetId);
  var sourceSheet = sourceSpreadsheet.getSheetByName(sourceSheetName);
  // Kiểm tra xem file đích đã tồn tại trong thư mục đích hay chưa
  var targetFolder = DriveApp.getFolderById(targetFolderId);
  var files = targetFolder.getFilesByName(targetFileName);
  
  var targetSpreadsheet;
  var isNewFile = false;
  
  if (files.hasNext()) {
    // Mở file đích nếu đã tồn tại
    var file = files.next();
    targetSpreadsheet = SpreadsheetApp.openById(file.getId());    
    // Xóa sheet có cùng tên nếu đã tồn tại
    var sheet = targetSpreadsheet.getSheetByName(sourceSheetName);
    if (sheet) {
      targetSpreadsheet.deleteSheet(sheet);
    }
  } else {
    // Tạo file mới nếu không tồn tại
    targetSpreadsheet = SpreadsheetApp.create(targetFileName);
    isNewFile = true;
    
    // Di chuyển file mới tạo vào thư mục đích
    var newSpreadsheetId = targetSpreadsheet.getId();
    var file = DriveApp.getFileById(newSpreadsheetId);
    targetFolder.addFile(file);
    DriveApp.getRootFolder().removeFile(file); // Xóa file khỏi thư mục gốc nếu cần
  }
  
  // Sao chép sheet từ file nguồn sang file đích
  sourceSheet.copyTo(targetSpreadsheet).setName(sourceSheetName);
  
  // Xóa sheet mặc định nếu tạo file mới
  if (isNewFile) {
    var defaultSheet = targetSpreadsheet.getSheets()[0];
    targetSpreadsheet.deleteSheet(defaultSheet);
  }
  var url_download = targetSpreadsheet.getUrl().replace(/\/view\?usp=drivesdk$/, "/edit");
  var result =  {
    "id": targetSpreadsheet.getId() ,
    "url": url_download
  }
  return result
}

function convertosolama(number) {
  var romanNumerals = ["I", "II", "III", "IV"];
  return romanNumerals[number - 1] || number.toString(); // Trả về số hoặc chữ số La Mã tương ứng
}

