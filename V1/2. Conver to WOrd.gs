const mytemplateid={
  nguoibao :{
    mau09_01 : "1nB10YeqeTNCiRgObnerq52M4dfv13ryNEInMwhf1UnI",      //id file google dco
    mau09_02: "1mlLGJYjR_P5iW0CSuTWt7F5lrq1k_7BuIUfty3lLZk8",       //
    mau09_03: "1pB7KHZ7_SRm4jl2mJ6Y1N9DDDL5yGGoxjCxs6MoYw8c",
    mau09_04: "1sqJwbpTinmONW7zMB58yw6Kx4Woptfk4SUuiudnaMoI"
  }

}

const myfoldertemplate={
  nguoibao :{
    mau09_01 : "1WBMQ_V-nIbOTrIINwqFhlRiR8q9w9fzR",
    mau09_02: "1FFVyXmtmY4ADrL-cHu14rOhGToqRC3Qd",
    mau09_03: "1Owz6xYCCnk6EhrJPi4AYppfMi1eYZeAK",
    mau09_04: "156XELREKCoiDk6dT67diDM_mvW_xJhS6"
  }

}

function testword(){
  var id = "SC.XX.241123.003";
  var ss = SpreadsheetApp.openById(myid.id_filedata);
  var sh_DataSC = ss.getSheetByName(myshname.DataSC);
  var val_DataSC = sh_DataSC.getDataRange().getValues();
  var rowsc = getfilterrow(val_DataSC,mycol.DataSC.id, id)
  var sh_DSThietBi = ss.getSheetByName(myshname.DSThietBi);
  var val_dsthietbi = sh_DSThietBi.getDataRange().getValues()
  var idtb = rowsc[mycol.DataSC.idthietbi];
  var rowthietbi = getfilterrow(val_dsthietbi,mycol.DSThietBi.id,idtb)

  var iduserdv = rowsc[mycol.DataSC.iduserdv];
  var sh_DSUserDV = ss.getSheetByName(myshname.DSUserDV)
  var val_DSUserDV = sh_DSUserDV.getDataRange().getValues();
  var rowuserdv = getfilterrow(val_DSUserDV, mycol.DSUserDV.id,iduserdv)
  var idusersua = rowsc[mycol.DataSC.idusersua];
  var sh_DSUserSua = ss.getSheetByName(myshname.DSUserSua)
  var val_DSUserSua = sh_DSUserSua.getDataRange().getValues();
  var rowusersua = getfilterrow(val_DSUserSua, mycol.DSUserSua.id,idusersua)
  createfile_bm0903(id,rowthietbi,rowuserdv,rowusersua)
}
function createfile_bm0901(data) {
  // Lấy dữ liệu sửa chữa dựa vào id test
  var sh_DataSC = data.sh_DataSC
  var val_DataSC = data.val_DataSC;
  var rowsc = data.rowsc;
  var id = data.id;
  var rowthietbi = data.rowthietbi ;
  var rowdvyc = data.rowdvyc;
  var rowusersc = data.rowusersc;
  var rowggsheet = data.rowggsheet;
  // Tạo file mới, replace data

  var docId = mytemplateid.nguoibao.mau09_01;
  var folderId = myfoldertemplate.nguoibao.mau09_01; 
  var folder = DriveApp.getFolderById(folderId);

  var fileName = "BM09_01_ " + id;
  
  // Tạo một bản sao của tài liệu gốc
  var copiedDoc = DriveApp.getFileById(docId).makeCopy();
  copiedDoc.setName(fileName);
  var copiedDocId = copiedDoc.getId();

  // Di chuyển bản sao tài liệu vào thư mục mong muốn
  var copiedFile = DriveApp.getFileById(copiedDocId);
  folder.addFile(copiedFile);
  
  // Lấy body của tài liệu
  var copiedDocBody = DocumentApp.openById(copiedDocId).getBody();
  // Thay thế nội dung của tài liệu copy
  copiedDocBody.replaceText("{{Đơn vị yêu cầu}}", rowdvyc[mycol.DSUserDV.donvi]);
  copiedDocBody.replaceText("{{Tên thiết bị}}", rowthietbi[mycol.DSThietBi.tentb]);
  copiedDocBody.replaceText("{{Hãng sản xuất}}", rowthietbi[mycol.DSThietBi.hangsx]);
  copiedDocBody.replaceText("{{Model}}", rowthietbi[mycol.DSThietBi.model]);
  copiedDocBody.replaceText("{{Serial}}", rowthietbi[mycol.DSThietBi.serial]);
  copiedDocBody.replaceText("{{Nước sản xuất}}", rowthietbi[mycol.DSThietBi.serial]);
  copiedDocBody.replaceText("{{Năm sản xuất}}", rowthietbi[mycol.DSThietBi.namsx]);
  let namsx = rowthietbi[mycol.DSThietBi.namsd];
  // Chuyển đổi giá trị thành đối tượng ngày nếu cần
  let dateObj = new Date(namsx);

  // Kiểm tra nếu dateObj là hợp lệ
  if (!isNaN(dateObj)) {
    // Định dạng ngày/tháng/năm
    let formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/` +
                        `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/` +
                        `${dateObj.getFullYear()}`;    
    // Thay thế trong tài liệu
    copiedDocBody.replaceText("{{Năm sử dụng}}", formattedDate);
  } else {
    // Nếu giá trị không phải là ngày hợp lệ, dùng giá trị mặc định hoặc hiển thị lỗi
  copiedDocBody.replaceText("{{Năm sử dụng}}", rowthietbi[mycol.DSThietBi.namsd]);  }

  // Lấy ngày tháng năm hiện tại
  var ngayHomNay = new Date();
  var ngay = ngayHomNay.getDate();
  var thang = ngayHomNay.getMonth() + 1;
  var nam = ngayHomNay.getFullYear();
  copiedDocBody.replaceText("{{today}}", ngay);
  copiedDocBody.replaceText("{{month}}", thang);
  copiedDocBody.replaceText("{{year}}", nam);
  copiedDocBody.replaceText("{{id}}", id);
  //thay mã qr 
  var imageUrl = "https://quickchart.io/qr?text="+ id +"&size=100";
  var imageBlob = UrlFetchApp.fetch(imageUrl).getBlob();
  var doc = DocumentApp.openById(copiedDocId);

  var footer = doc.getFooter();


  if (!footer) {
    // Nếu tài liệu chưa có footer, tạo mới footer
    footer = doc.addFooter();
  }
  // Tìm vị trí ký hiệu {{qr_code}} và thay thế bằng hình ảnh
  var searchPattern = "{{QR_CODE}}";
  var foundElement = footer.findText(searchPattern);

  if (foundElement) {
    var element = foundElement.getElement();
    var startOffset = foundElement.getStartOffset();
    var endOffset = foundElement.getEndOffsetInclusive();

    // Xóa ký hiệu {{qr_code}} và chèn hình ảnh QR code
    element.asText().deleteText(startOffset, endOffset);
    element.getParent().asParagraph().insertInlineImage(startOffset, imageBlob);
  } else {
    Logger.log("Không tìm thấy ký hiệu {{qr_code}} trong footer.");
  }

  var idPattern = "{{id}}";
  var idElement = footer.findText(idPattern);

  if (idElement) {
    var element = idElement.getElement();
    var startOffset = idElement.getStartOffset();
    var endOffset = idElement.getEndOffsetInclusive();

    // Xóa ký hiệu {{id}} và chèn văn bản ID thiết bị
    element.asText().deleteText(startOffset, endOffset);
    element.asText().insertText(startOffset, id);
  } else {
    Logger.log("Không tìm thấy ký hiệu {{id}} trong footer.");
  }
  DocumentApp.openById(copiedDocId).saveAndClose();
  
  // Chuyển đổi tài liệu sang PDF
  var pdfFile = DriveApp.getFileById(copiedDocId).getAs("application/pdf");
  var pdf = folder.createFile(pdfFile);
  pdf.setName(fileName + ".pdf");
  //Ghi dữ liệu vào 
  var lr = sh_DataSC.getLastRow();  // Chuyển đến dòng tiếp theo sau dòng cuối cùng
  var url_download = copiedFile.getUrl().replace(/\/view\?usp=drivesdk$/, "/edit");
  sh_DataSC.getRange(lr, mycol.DataSC.url_vttb_09_01_word +1, 1, 1).setValue(url_download);
  url_download = pdf.getUrl().replace(/\/view\?usp=drivesdk$/, "/edit");
  sh_DataSC.getRange(lr, mycol.DataSC.url_vttb_09_01_pdf +1 , 1, 1).setValue(url_download);
}

function createfile_bm0902(data) {
  // Lấy dữ liệu sửa chữa dựa vào id test
  var sh_DataSC = data.sh_DataSC
  var val_DataSC = data.val_DataSC;
  var rowsc = data.rowsc;
  var id = data.id;
  var rowthietbi = data.rowthietbi ;
  var rowdvyc = data.rowdvyc;
  var rowusersc = data.rowusersc;
  var rowggsheet = data.rowggsheet;

  // Tạo file mới, replace data
  var docId = mytemplateid.nguoibao.mau09_02;
  var folderId = myfoldertemplate.nguoibao.mau09_02;

  // Mở tài liệu bằng ID   
  var folder = DriveApp.getFolderById(folderId);

  
  // Lấy dữ liệu

  var fileName = "BM09_02_ " + id;
  
  // Tạo một bản sao của tài liệu gốc
  var copiedDoc = DriveApp.getFileById(docId).makeCopy();
  copiedDoc.setName(fileName);
  var copiedDocId = copiedDoc.getId();

  // Di chuyển bản sao tài liệu vào thư mục mong muốn
  var copiedFile = DriveApp.getFileById(copiedDocId);
  folder.addFile(copiedFile);
  
  // Lấy body của tài liệu
  var copiedDocBody = DocumentApp.openById(copiedDocId).getBody();
  // Thay thế nội dung của tài liệu copy
  var date_denghi = convertStringToDate(rowsc[mycol.DataSC.ngaydenghi]);  
  copiedDocBody.replaceText("{{day_ngaydenghi}}", date_denghi.getDate());
  copiedDocBody.replaceText("{{month_ngaydenghi}}", date_denghi.getMonth());
  copiedDocBody.replaceText("{{year_ngaydenghi}}", date_denghi.getFullYear());

  //ngày yêu cầu 
  var date_yeucau =convertStringToDate(rowsc[mycol.DataSC.ngaydonvibao]);  
  copiedDocBody.replaceText("{{Đơn vị yêu cầu}}", rowdvyc[mycol.DSUserDV.donvi]);
  copiedDocBody.replaceText("{{day_ngaydvbao}}", date_yeucau.getDate());
  copiedDocBody.replaceText("{{month_ngaydvbao}}", date_yeucau.getMonth());
  copiedDocBody.replaceText("{{year_ngaydvbao}}", date_yeucau.getFullYear());
  copiedDocBody.replaceText("{{Quyết định tổ khảo sát}}", rowdvyc[mycol.DSUserDV.quyetdinhtokhaosat]);
  //Ngày khảo sát 
  var date_khaosat = convertStringToDate(rowsc[mycol.DataSC.ngaykhaosat]);  
  copiedDocBody.replaceText("{{day_ngaykhaosat}}", date_khaosat.getDate());
  copiedDocBody.replaceText("{{month_ngaykhaosat}}", date_khaosat.getMonth());
  copiedDocBody.replaceText("{{year_ngaykhaosat}}", date_khaosat.getFullYear());

  var date_bangiao = convertStringToDate(rowsc[mycol.DataSC.ngaybangiao]);  
  copiedDocBody.replaceText("{{day_ngaybangiao}}", date_bangiao.getDate());
  copiedDocBody.replaceText("{{month_ngaybangiao}}", date_bangiao.getMonth());
  copiedDocBody.replaceText("{{year_ngaybangiao}}", date_bangiao.getFullYear());
  //Nọi dung bên trong 

  copiedDocBody.replaceText("{{Tên thiết bị}}", rowthietbi[mycol.DSThietBi.tentb]);
  copiedDocBody.replaceText("{{Model}}", rowthietbi[mycol.DSThietBi.model]);
  copiedDocBody.replaceText("{{Serial}}", rowthietbi[mycol.DSThietBi.serial]);
  copiedDocBody.replaceText("{{Hãng sản xuất}}", rowthietbi[mycol.DSThietBi.hangsx]); 
  copiedDocBody.replaceText("{{Nước sản xuất}}", rowthietbi[mycol.DSThietBi.nuocsx]);
  copiedDocBody.replaceText("{{Năm sản xuất}}", rowthietbi[mycol.DSThietBi.namsx]);
  copiedDocBody.replaceText("{{Năm sử dụng}}", rowthietbi[mycol.DSThietBi.namsd]);

  copiedDocBody.replaceText("{{Tình trang thiết bị khảo sát}}", rowsc[mycol.DataSC.tinhtrangthietbiks]);
  copiedDocBody.replaceText("{{Kết luận khảo sát}}", rowsc[mycol.DataSC.ketluankhaosat]);
  copiedDocBody.replaceText("{{Đề xuất phương án}}", rowsc[mycol.DataSC.dexuatphuongan]);
  copiedDocBody.replaceText("{{Nội dung đề nghi}}", rowsc[mycol.DataSC.noidungdenghi]);

  copiedDocBody.replaceText("{{Người sửa chữa}}", rowusersc[mycol.DSUserSua.hoten]);

  copiedDocBody.replaceText("{{Đại diện BV 1}}", rowdvyc[mycol.DSUserDV.bv1_daidien]);
  copiedDocBody.replaceText("{{Chức vụ DD BV 1}}", rowdvyc[mycol.DSUserDV.bv1_chucvu]);
  copiedDocBody.replaceText("{{Đại diện BV 2}}", rowdvyc[mycol.DSUserDV.bv2_daidien]);
  copiedDocBody.replaceText("{{Chức vụ DD BV 2}}", rowdvyc[mycol.DSUserDV.bv2_chucvu]);
  copiedDocBody.replaceText("{{Đại diện BV 3}}", rowdvyc[mycol.DSUserDV.bv3_daidien]);
  copiedDocBody.replaceText("{{Chức vụ DD BV 3}}", rowdvyc[mycol.DSUserDV.bv3_chucvu]);
  copiedDocBody.replaceText("{{Đại diện BV 4}}", rowdvyc[mycol.DSUserDV.bv4_daidien]);
  copiedDocBody.replaceText("{{Chức vụ DD BV 4}}", rowdvyc[mycol.DSUserDV.bv4_chucvu]);
  copiedDocBody.replaceText("{{Đại diện BV 5}}", rowdvyc[mycol.DSUserDV.bv5_daidien]);
  copiedDocBody.replaceText("{{Chức vụ DD BV 5}}", rowdvyc[mycol.DSUserDV.bv5_chucvu]);

  copiedDocBody.replaceText("{{Đại diện ĐV Báo sửa 1}}", rowdvyc[mycol.DSUserDV.dv1_daidien]);
  copiedDocBody.replaceText("{{Chức vụ DD ĐV Báo sửa 1}}", rowdvyc[mycol.DSUserDV.dv1_chucvu]);
  copiedDocBody.replaceText("{{Đại diện ĐV Báo sửa 2}}", rowdvyc[mycol.DSUserDV.dv2_daidien]);
  copiedDocBody.replaceText("{{Chức vụ DD ĐV Báo sửa 2}}", rowdvyc[mycol.DSUserDV.dv2_chucvu]);

  copiedDocBody.replaceText("{{quyetdinhtokhaosat}}", rowdvyc[mycol.DSUserDV.quyetdinhtokhaosat]);

  // Lấy ngày tháng năm hiện tại
  var ngayHomNay = new Date();
  var ngay = ngayHomNay.getDate();
  var thang = ngayHomNay.getMonth() + 1;
  var nam = ngayHomNay.getFullYear();
  copiedDocBody.replaceText("{{today}}", ngay);
  copiedDocBody.replaceText("{{month}}", thang);
  copiedDocBody.replaceText("{{year}}", nam);
  copiedDocBody.replaceText("{{id}}", id);
  //thay mã qr 
  var imageUrl = "https://quickchart.io/qr?text="+ id +"&size=100";
  var imageBlob = UrlFetchApp.fetch(imageUrl).getBlob();
  var doc = DocumentApp.openById(copiedDocId);

  var footer = doc.getFooter();


  if (!footer) {
    // Nếu tài liệu chưa có footer, tạo mới footer
    footer = doc.addFooter();
  }
  // Tìm vị trí ký hiệu {{qr_code}} và thay thế bằng hình ảnh
  var searchPattern = "{{QR_CODE}}";
  var foundElement = footer.findText(searchPattern);

  if (foundElement) {
    var element = foundElement.getElement();
    var startOffset = foundElement.getStartOffset();
    var endOffset = foundElement.getEndOffsetInclusive();

    // Xóa ký hiệu {{qr_code}} và chèn hình ảnh QR code
    element.asText().deleteText(startOffset, endOffset);
    element.getParent().asParagraph().insertInlineImage(startOffset, imageBlob);
  } else {
    Logger.log("Không tìm thấy ký hiệu {{qr_code}} trong footer.");
  }

  var idPattern = "{{id}}";
  var idElement = footer.findText(idPattern);

  if (idElement) {
    var element = idElement.getElement();
    var startOffset = idElement.getStartOffset();
    var endOffset = idElement.getEndOffsetInclusive();

    // Xóa ký hiệu {{id}} và chèn văn bản ID thiết bị
    element.asText().deleteText(startOffset, endOffset);
    element.asText().insertText(startOffset, id);
  } else {
    Logger.log("Không tìm thấy ký hiệu {{id}} trong footer.");
  }
  DocumentApp.openById(copiedDocId).saveAndClose();
  //Ghi dữ liệu vào 
  var url_download = copiedFile.getUrl().replace(/\/view\?usp=drivesdk$/, "/edit");
  sh_DataSC.getRange(rowggsheet, mycol.DataSC.url_vttb_09_02 +1, 1, 1).setValue(url_download);
}
//XONG



function createfile_bm0903(data) {
  // Lấy dữ liệu sửa chữa dựa vào id test
  var sh_DataSC = data.sh_DataSC
  var val_DataSC = data.val_DataSC;
  var rowsc = data.rowsc;
  var id = data.id;
  var rowthietbi = data.rowthietbi ;
  var rowdvyc = data.rowdvyc;
  var rowusersc = data.rowusersc;
  var rowggsheet = data.rowggsheet;
  // id, rowthietbi, rowdvyc, rowusersc

  var docId = mytemplateid.nguoibao.mau09_03;
  var folderId = myfoldertemplate.nguoibao.mau09_03;

  // Mở tài liệu bằng ID   
  var folder = DriveApp.getFolderById(folderId);
  // Lấy dữ liệu
  
  var rowggsheet = val_DataSC.indexOf(rowsc)+1  
  var fileName = "BM09_03_ " + id;
  // Tạo một bản sao của tài liệu gốc
  var copiedDoc = DriveApp.getFileById(docId).makeCopy();
  copiedDoc.setName(fileName);
  var copiedDocId = copiedDoc.getId();

  // Di chuyển bản sao tài liệu vào thư mục mong muốn
  var copiedFile = DriveApp.getFileById(copiedDocId);
  folder.addFile(copiedFile);
  
  // Lấy body của tài liệu
  var copiedDocBody = DocumentApp.openById(copiedDocId).getBody();
  var date_denghi = convertStringToDate(rowsc[mycol.DataSC.ngaydenghi]);  
  copiedDocBody.replaceText("{{day_ngaydenghi}}", date_denghi.getDate());
  copiedDocBody.replaceText("{{month_ngaydenghi}}", date_denghi.getMonth());
  copiedDocBody.replaceText("{{year_ngaydenghi}}", date_denghi.getFullYear());

  //ngày yêu cầu 
  var date_yeucau =convertStringToDate(rowsc[mycol.DataSC.ngaydonvibao]);  
  copiedDocBody.replaceText("{{Đơn vị yêu cầu}}", rowdvyc[mycol.DSUserDV.donvi]);
  copiedDocBody.replaceText("{{day_ngaydvbao}}", date_yeucau.getDate());
  copiedDocBody.replaceText("{{month_ngaydvbao}}", date_yeucau.getMonth());
  copiedDocBody.replaceText("{{year_ngaydvbao}}", date_yeucau.getFullYear());
  copiedDocBody.replaceText("{{Quyết định tổ khảo sát}}", rowdvyc[mycol.DSUserDV.quyetdinhtokhaosat]);
  //Ngày khảo sát 
  var date_khaosat = convertStringToDate(rowsc[mycol.DataSC.ngaykhaosat]);  
  copiedDocBody.replaceText("{{day_ngaykhaosat}}", date_khaosat.getDate());
  copiedDocBody.replaceText("{{month_ngaykhaosat}}", date_khaosat.getMonth());
  copiedDocBody.replaceText("{{year_ngaykhaosat}}", date_khaosat.getFullYear());
  //Nọi dung bên trong 

  copiedDocBody.replaceText("{{Tên thiết bị}}", rowthietbi[mycol.DSThietBi.tentb]);
  copiedDocBody.replaceText("{{Model}}", rowthietbi[mycol.DSThietBi.model]);
  copiedDocBody.replaceText("{{Serial}}", rowthietbi[mycol.DSThietBi.serial]);
  copiedDocBody.replaceText("{{Hãng sản xuất}}", rowthietbi[mycol.DSThietBi.hangsx]); 
  copiedDocBody.replaceText("{{Nước sản xuất}}", rowthietbi[mycol.DSThietBi.nuocsx]);
  copiedDocBody.replaceText("{{Năm sản xuất}}", rowthietbi[mycol.DSThietBi.namsx]);
  copiedDocBody.replaceText("{{Năm sử dụng}}", rowthietbi[mycol.DSThietBi.namsd]);

  copiedDocBody.replaceText("{{Tình trang thiết bị khảo sát}}", rowsc[mycol.DataSC.tinhtrangthietbiks]);
  copiedDocBody.replaceText("{{Kết luận khảo sát}}", rowsc[mycol.DataSC.ketluankhaosat]);
  copiedDocBody.replaceText("{{Đề xuất phương án}}", rowsc[mycol.DataSC.dexuatphuongan]);
  copiedDocBody.replaceText("{{Nội dung đề nghi}}", rowsc[mycol.DataSC.noidungdenghi]);

  copiedDocBody.replaceText("{{Người sửa chữa}}", rowusersc[mycol.DSUserSua.hoten]);


  //thay mã qr 
  var imageUrl = "https://quickchart.io/qr?text="+ id +"&size=100";
  var imageBlob = UrlFetchApp.fetch(imageUrl).getBlob();
  var doc = DocumentApp.openById(copiedDocId);

  var footer = doc.getFooter();


  if (!footer) {
    // Nếu tài liệu chưa có footer, tạo mới footer
    footer = doc.addFooter();
  }
  // Tìm vị trí ký hiệu {{qr_code}} và thay thế bằng hình ảnh
  var searchPattern = "{{QR_CODE}}";
  var foundElement = footer.findText(searchPattern);

  if (foundElement) {
    var element = foundElement.getElement();
    var startOffset = foundElement.getStartOffset();
    var endOffset = foundElement.getEndOffsetInclusive();

    // Xóa ký hiệu {{qr_code}} và chèn hình ảnh QR code
    element.asText().deleteText(startOffset, endOffset);
    element.getParent().asParagraph().insertInlineImage(startOffset, imageBlob);
  } else {
    Logger.log("Không tìm thấy ký hiệu {{qr_code}} trong footer.");
  }

  var idPattern = "{{id}}";
  var idElement = footer.findText(idPattern);

  if (idElement) {
    var element = idElement.getElement();
    var startOffset = idElement.getStartOffset();
    var endOffset = idElement.getEndOffsetInclusive();

    // Xóa ký hiệu {{id}} và chèn văn bản ID thiết bị
    element.asText().deleteText(startOffset, endOffset);
    element.asText().insertText(startOffset, id);
  } else {
    Logger.log("Không tìm thấy ký hiệu {{id}} trong footer.");
  }
  DocumentApp.openById(copiedDocId).saveAndClose();
  var url_download = copiedFile.getUrl().replace(/\/view\?usp=drivesdk$/, "/edit");
  sh_DataSC.getRange(rowggsheet, mycol.DataSC.url_vttb_09_03 +1, 1, 1).setValue(url_download);
}
//Biểu 04
function createfile_bm0904(data) {
  // Lấy dữ liệu sửa chữa dựa vào id test
  var sh_DataSC = data.sh_DataSC
  var val_DataSC = data.val_DataSC;
  var rowsc = data.rowsc;
  var id = data.id;
  var rowthietbi = data.rowthietbi ;
  var rowdvyc = data.rowdvyc;
  var rowusersc = data.rowusersc;
  var rowggsheet = data.rowggsheet;

  // Tạo file mới, replace data
  var docId = mytemplateid.nguoibao.mau09_04;
  var folderId = myfoldertemplate.nguoibao.mau09_04;

  // Mở tài liệu bằng ID   
  var folder = DriveApp.getFolderById(folderId);
  var fileName = "BM09_04_ " + id;
  
  // Tạo một bản sao của tài liệu gốc
  var copiedDoc = DriveApp.getFileById(docId).makeCopy();
  copiedDoc.setName(fileName);
  var copiedDocId = copiedDoc.getId();

  // Di chuyển bản sao tài liệu vào thư mục mong muốn
  var copiedFile = DriveApp.getFileById(copiedDocId);
  folder.addFile(copiedFile);
  
  // Lấy body của tài liệu
  var copiedDocBody = DocumentApp.openById(copiedDocId).getBody();


  // Lấy body của tài liệu
  var copiedDocBody = DocumentApp.openById(copiedDocId).getBody();

  var date_denghi = convertStringToDate(rowsc[mycol.DataSC.ngaydenghi]);  
  copiedDocBody.replaceText("{{day_ngaydenghi}}", date_denghi.getDate());
  copiedDocBody.replaceText("{{month_ngaydenghi}}", date_denghi.getMonth());
  copiedDocBody.replaceText("{{year_ngaydenghi}}", date_denghi.getFullYear());

  //ngày yêu cầu 
  var date_yeucau =convertStringToDate(rowsc[mycol.DataSC.ngaydonvibao]);  
  copiedDocBody.replaceText("{{Đơn vị yêu cầu}}", rowdvyc[mycol.DSUserDV.donvi]);
  copiedDocBody.replaceText("{{day_ngaydvbao}}", date_yeucau.getDate());
  copiedDocBody.replaceText("{{month_ngaydvbao}}", date_yeucau.getMonth());
  copiedDocBody.replaceText("{{year_ngaydvbao}}", date_yeucau.getFullYear());
  copiedDocBody.replaceText("{{Quyết định tổ khảo sát}}", rowdvyc[mycol.DSUserDV.quyetdinhtokhaosat]);
  //Ngày khảo sát 
  var date_khaosat = convertStringToDate(rowsc[mycol.DataSC.ngaykhaosat]);  
  copiedDocBody.replaceText("{{day_ngaykhaosat}}", date_khaosat.getDate());
  copiedDocBody.replaceText("{{month_ngaykhaosat}}", date_khaosat.getMonth());
  copiedDocBody.replaceText("{{year_ngaykhaosat}}", date_khaosat.getFullYear());

  var date_bangiao = convertStringToDate(rowsc[mycol.DataSC.ngaybangiao]);  
  copiedDocBody.replaceText("{{day_ngaybangiao}}", date_bangiao.getDate());
  copiedDocBody.replaceText("{{month_ngaybangiao}}", date_bangiao.getMonth());
  copiedDocBody.replaceText("{{year_ngaybangiao}}", date_bangiao.getFullYear());
  //Nọi dung bên trong 

  copiedDocBody.replaceText("{{Tên thiết bị}}", rowthietbi[mycol.DSThietBi.tentb]);
  copiedDocBody.replaceText("{{Model}}", rowthietbi[mycol.DSThietBi.model]);
  copiedDocBody.replaceText("{{Serial}}", rowthietbi[mycol.DSThietBi.serial]);
  copiedDocBody.replaceText("{{Hãng sản xuất}}", rowthietbi[mycol.DSThietBi.hangsx]); 
  copiedDocBody.replaceText("{{Nước sản xuất}}", rowthietbi[mycol.DSThietBi.nuocsx]);
  copiedDocBody.replaceText("{{Năm sản xuất}}", rowthietbi[mycol.DSThietBi.namsx]);
  copiedDocBody.replaceText("{{Năm sử dụng}}", rowthietbi[mycol.DSThietBi.namsd]);

  copiedDocBody.replaceText("{{Tình trang thiết bị khảo sát}}", rowsc[mycol.DataSC.tinhtrangthietbiks]);
  copiedDocBody.replaceText("{{Kết luận khảo sát}}", rowsc[mycol.DataSC.ketluankhaosat]);
  copiedDocBody.replaceText("{{Đề xuất phương án}}", rowsc[mycol.DataSC.dexuatphuongan]);
  copiedDocBody.replaceText("{{Nội dung đề nghi}}", rowsc[mycol.DataSC.noidungdenghi]);

  copiedDocBody.replaceText("{{Người sửa chữa}}", rowusersc[mycol.DSUserSua.hoten]);

  copiedDocBody.replaceText("{{Đại diện BV 1}}", rowdvyc[mycol.DSUserDV.bv1_daidien]);
  copiedDocBody.replaceText("{{Chức vụ DD BV 1}}", rowdvyc[mycol.DSUserDV.bv1_chucvu]);
  copiedDocBody.replaceText("{{Đại diện BV 2}}", rowdvyc[mycol.DSUserDV.bv2_daidien]);
  copiedDocBody.replaceText("{{Chức vụ DD BV 2}}", rowdvyc[mycol.DSUserDV.bv2_chucvu]);
  copiedDocBody.replaceText("{{Đại diện BV 3}}", rowdvyc[mycol.DSUserDV.bv3_daidien]);
  copiedDocBody.replaceText("{{Chức vụ DD BV 3}}", rowdvyc[mycol.DSUserDV.bv3_chucvu]);
  copiedDocBody.replaceText("{{Đại diện BV 4}}", rowdvyc[mycol.DSUserDV.bv4_daidien]);
  copiedDocBody.replaceText("{{Chức vụ DD BV 4}}", rowdvyc[mycol.DSUserDV.bv4_chucvu]);
  copiedDocBody.replaceText("{{Đại diện BV 5}}", rowdvyc[mycol.DSUserDV.bv5_daidien]);
  copiedDocBody.replaceText("{{Chức vụ DD BV 5}}", rowdvyc[mycol.DSUserDV.bv5_chucvu]);

  copiedDocBody.replaceText("{{Đại diện ĐV Báo sửa 1}}", rowdvyc[mycol.DSUserDV.dv1_daidien]);
  copiedDocBody.replaceText("{{Chức vụ DD ĐV Báo sửa 1}}", rowdvyc[mycol.DSUserDV.dv1_chucvu]);
  copiedDocBody.replaceText("{{Đại diện ĐV Báo sửa 2}}", rowdvyc[mycol.DSUserDV.dv2_daidien]);
  copiedDocBody.replaceText("{{Chức vụ DD ĐV Báo sửa 2}}", rowdvyc[mycol.DSUserDV.dv2_chucvu]);

  copiedDocBody.replaceText("{{quyetdinhtokhaosat}}", rowdvyc[mycol.DSUserDV.quyetdinhtokhaosat]);



  //thay mã qr 
  var imageUrl = "https://quickchart.io/qr?text="+ id +"&size=100";
  var imageBlob = UrlFetchApp.fetch(imageUrl).getBlob();
  var doc = DocumentApp.openById(copiedDocId);

  var footer = doc.getFooter();


  if (!footer) {
    // Nếu tài liệu chưa có footer, tạo mới footer
    footer = doc.addFooter();
  }
  // Tìm vị trí ký hiệu {{qr_code}} và thay thế bằng hình ảnh
  var searchPattern = "{{QR_CODE}}";
  var foundElement = footer.findText(searchPattern);

  if (foundElement) {
    var element = foundElement.getElement();
    var startOffset = foundElement.getStartOffset();
    var endOffset = foundElement.getEndOffsetInclusive();

    // Xóa ký hiệu {{qr_code}} và chèn hình ảnh QR code
    element.asText().deleteText(startOffset, endOffset);
    element.getParent().asParagraph().insertInlineImage(startOffset, imageBlob);
  } else {
    Logger.log("Không tìm thấy ký hiệu {{qr_code}} trong footer.");
  }

  var idPattern = "{{id}}";
  var idElement = footer.findText(idPattern);

  if (idElement) {
    var element = idElement.getElement();
    var startOffset = idElement.getStartOffset();
    var endOffset = idElement.getEndOffsetInclusive();

    // Xóa ký hiệu {{id}} và chèn văn bản ID thiết bị
    element.asText().deleteText(startOffset, endOffset);
    element.asText().insertText(startOffset, id);
  } else {
    Logger.log("Không tìm thấy ký hiệu {{id}} trong footer.");
  }
  DocumentApp.openById(copiedDocId).saveAndClose();
  //Ghi dữ liệu vào 
  var url_download = copiedFile.getUrl().replace(/\/view\?usp=drivesdk$/, "/edit");
  sh_DataSC.getRange(rowggsheet, mycol.DataSC.url_vttb_09_04 +1, 1, 1).setValue(url_download);
}
function generateQRCode(id) {
  var qrUrl = "https://quickchart.io/qr?text=" + encodeURIComponent(id);  // Tạo URL mã QR

  // Lưu mã QR vào Google Drive
  var response = UrlFetchApp.fetch(qrUrl);
  var blob = response.getBlob().setName(id + ".png");

  // Lưu ảnh vào Google Drive và trả về ID file
  var folder = DriveApp.getFolderById('YOUR_FOLDER_ID');  // Thư mục lưu ảnh QR
  var file = folder.createFile(blob);
  return file.getId();  // Trả về ID file QR
}

function convToMicrosoft(fileId) {
  if (fileId == null) throw new Error("No file ID.");
  // if (folderId == null) throw new Error("No folder ID.");  
  var file = DriveApp.getFileById(fileId);
  var mime = file.getMimeType();
  var format = "";
  var ext = "";
  
  switch (mime) {
    case "application/vnd.google-apps.document":
      format = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      ext = ".docx";
      break;
    case "application/vnd.google-apps.spreadsheet":
      format = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      ext = ".xlsx";
      break;
    case "application/vnd.google-apps.presentation":
      format = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      ext = ".pptx";
      break;
    default:
      throw new Error("Unsupported file type.");
  }
  
  var url = "https://www.googleapis.com/drive/v3/files/" + fileId + "/export?mimeType=" + format;
  var blob = UrlFetchApp.fetch(url, {
    method: "get",
    headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true
  }).getBlob();
  
  var filename = file.getName();
  if (!filename.endsWith(ext)) {
    filename += ext;
  }
  
  // Tạo file và thêm vào thư mục có ID cho sẵn
  var folder = DriveApp.getFolderById(myen_pushemail.idfldexportword);
  var newFile = folder.createFile(blob).setName(filename);
  
  return newFile;
}
function convToGoogle(fileId) {
  if (fileId == null) throw new Error("No file ID.");
  var file = DriveApp.getFileById(fileId);
  var filename = file.getName();
  var mime = file.getMimeType();
  var ToMime = "";
  switch (mime) {
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      ToMime = "application/vnd.google-apps.document";
      break;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      ToMime = "application/vnd.google-apps.spreadsheet";
      break;
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      ToMime = "application/vnd.google-apps.presentation";
      break;
    default:
      return null;
  }
  var metadata = {
    name: filename,
    mimeType: ToMime
  };
  var fields = "id,mimeType,name";
  var url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=" + encodeURIComponent(fields);
  var boundary = "xxxxxxxxxx";
  var data = "--" + boundary + "\r\n";
  data += "Content-Type: application/json; charset=UTF-8\r\n\r\n";
  data += JSON.stringify(metadata) + "\r\n";
  data += "--" + boundary + "\r\n";
  data += "Content-Type: " + mime + "\r\n\r\n";
  var payload = Utilities.newBlob(data).getBytes().concat(file.getBlob().getBytes()).concat(Utilities.newBlob("\r\n--" + boundary + "--").getBytes());
  var res = UrlFetchApp.fetch(url, {
    method: "post",
    headers: {
      "Authorization": "Bearer " + ScriptApp.getOAuthToken(),
      "Content-Type": "multipart/related; boundary=" + boundary
    },
    payload: payload,
    muteHttpExceptions: true
  }).getContentText();
  var id = JSON.parse(res).id;
  return id;
};

