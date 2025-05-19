function doGet() {
  // e.type = "clickbt"
  // e.data ="idxxx"
  // e.eventaction = "Phê duỵet"
  //trả ngược kết quả 
  return HtmlService.createHtmlOutputFromFile('HTML_2Sua');
}
//bao sua: https://script.google.com/macros/s/AKfycbzgJgJldZ8gBy3REohj9kAUMoq1T6qieMIg9bhg6anc-OqRafF-ucAtf-Qe-WTTsMra/exec
//2: Nguoi sua: https://script.google.com/macros/s/AKfycbw3WKuyw-v0r3RFt8lMdzHJKnb5C08uPh8gsEB2rm-IUdkCPLnU00w6azu9syM-6c3j/exec
//nut: (Accept): url (Url : truyền tham số ggo...?type=clickt_data=idxxxx+ev...)

function extractTextboxIDs() {
  // Tên file HTML
  const htmlFileName = "HTML_2Sua.html";
  
  // ID của sheet
  const sheetId = "1zKmCoyRnUtgICQtiJi8Z_IqR3ZPbu5Qb-OXEvf_o2rs";

  // Lấy nội dung HTML
  const htmlContent = HtmlService.createHtmlOutputFromFile(htmlFileName).getContent();

  // Biểu thức chính quy để tìm ID của các textbox
  const regex = /<input[^>]*type=["']?text["']?[^>]*id=["']([^"']+)["']/gi;

  // Tạo mảng chứa các ID
  let ids = [];
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    ids.push(match[1]); // match[1] là ID
  }

  // Mở sheet và ghi dữ liệu
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName("html");
  if (!sheet) {
    throw new Error("Sheet với tên 'html' không tồn tại!");
  }

  // Xóa dữ liệu cũ và ghi danh sách ID mới
  sheet.clear();
  sheet.getRange(1, 1, ids.length, 1).setValues(ids.map(id => [id])); // Ghi ID vào cột A
}