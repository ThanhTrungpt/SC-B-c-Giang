function SC_delete(id) {
  var sheet = SpreadsheetApp.openById(myid.id_filedata).getSheetByName("DataSC"); // Đổi "RepairData" thành tên sheet của bạn
  var data = sheet.getDataRange().getValues();
  var row = getfilterrow(data,mycol.DataSC.id,id)
  var rowggsheet = data.indexOf(row)+1  
  sheet.getRange(rowggsheet,mycol.DataSC.trangthai+1,1,1).setValue("Xóa")
  return true 
}


function SC_getDataById(id) {
    var sheet = SpreadsheetApp.openById(myid.id_filedata).getSheetByName("DataSC"); // Đổi "RepairData" thành tên sheet của bạn
    const data = sheet.getDataRange().getValues();
    var row = getfilterrow(data,mycol.DataSC.id,id)
    return row
}


function SC_update(inputdata) {
  var sheet = SpreadsheetApp.openById(myid.id_filedata).getSheetByName("DataSC"); // Đổi "RepairData" thành tên sheet của bạn
  var val_DataSC = sheet.getDataRange().getValues();
  var rowsc = getfilterrow(data,mycol.DataSC.id,inputdata.id)
  var rowggsheet = val_DataSC.indexOf(rowsc)+1 
  sheet.getRange(rowggsheet,mycol.DataSC.tinhtrangtbdvbao +1,1,1).setValue(inputdata.tinhtrangtbdvbao)  
  sheet.getRange(rowggsheet,mycol.DataSC.ghichu +1,1,1).setValue(inputdata.ghichu)
  sheet.getRange(rowggsheet,mycol.DataSC.mucdo +1,1,1).setValue(inputdata.mucdo)
  const currentDateTime = new Date();  
  const formattedDateTime = Utilities.formatDate(currentDateTime, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
  sheet.getRange(rowggsheet,mycol.DataSC.ngaydonvibao +1,1,1).setValue(formattedDateTime)
  sheet.getRange(rowggsheet,mycol.DataSC.idthietbi +1,1,1).setValue(inputdata.idthietbi)
  sheet.getRange(rowggsheet,mycol.DataSC.idusersua +1,1,1).setValue(inputdata.idusersua)
  var rowthietbi = getfilterrow(inputdata.val_dsthietbi, mycol.DSThietBi.id,inputdata.idthietbi);
  Logger.log("Row thiết bị: "+ rowthietbi)
  var rowdvyc = getfilterrow( inputdata.val_DSUserDV, mycol.DSUserDV.id,inputdata.iduserdv);  
  Logger.log("rowdvyc: "+ rowdvyc)
  createfile_bm0901(inputdata.id,rowthietbi,rowdvyc)
  return sheet.getDataRange().getValues(); 
}
function SC_thembaohong(databaohong) {

  var ss = SpreadsheetApp.openById(myid.id_filedata);  // Mở file Google Sheets theo ID
  var sh_DataSC = ss.getSheetByName(myshname.DataSC);  // Lấy sheet theo tên
  var val_DataSC = sh_DataSC.getDataRange().getValues(); 
  var rowthietbi = getfilterrow( databaohong.val_dsthietbi, mycol.DSThietBi.id,databaohong.idthietbi);
  var rowdvyc = getfilterrow(databaohong.val_DSUserDV, mycol.DSUserDV.id,databaohong.iduserdv);  
  // Tạo ID báo hỏng từ các thông tin đã nhập
  var errorID = generateRepairID(databaohong.donvi);
  const currentDateTime = new Date();  
  const formattedDateTime = Utilities.formatDate(currentDateTime, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
  // Tạo dữ liệu để ghi vào Google Sheets theo đúng các cột
  var newRow = [
    errorID,                      // IDDataSC
    databaohong.trangThai,         // Trạng thái
    databaohong.mucDo,             // Mức độ
    databaohong.iduserdv,       // Đơn vị yêu cầu
    databaohong.idusersua,     // Người sửa chữa
    databaohong.idthietbi,         // idthietbi
    databaohong.tinhtrangtbdvbao,  // Tình trạng thiết bị đơn vị báo
    formattedDateTime,      // Ngày khảo sát
    "",
    "",
    "",
    "",
    "",    // Nội dung đề nghị
    "",      // Ngày bàn giao
    "",  // Tình trạng thiết bị bàn giao
    "",
    databaohong.ghichu,           // Ghi chú
    "",
    ""
  ];
  // Ghi dữ liệu vào Google Sheets (thêm vào hàng mới ở cuối)
  sh_DataSC.appendRow(newRow);
  
  //Update dữ liệu người yêu cầu 
  var sh_DSUserDV = ss.getSheetByName(myshname.DSUserDV);
  var val_DSUserDV = sh_DSUserDV.getDataRange().getValues();
  var rowuserdv = getfilterrow( val_DSUserDV, mycol.DSUserDV.id,databaohong.iduserdv);
  //User sưa
  var sh_DSUserSua = ss.getSheetByName(myshname.DSUserSua);
  var val_DSUserSua = sh_DSUserSua.getDataRange().getValues()
  var rowusersua = getfilterrow(val_DSUserSua,mycol.DSUserSua.id,databaohong.idusersua)

  //thiet bị
  var sh_DSThietBi = ss.getSheetByName(myshname.DSThietBi);
  var val_dsthietbi = sh_DSThietBi.getDataRange().getValues();
  var rowthietbi = getfilterrow(val_dsthietbi,mycol.DSThietBi.id,databaohong.idthietbi)

  var lr = sh_DataSC.getLastRow()
  //Ghi dữ liệu người yêu cầu mới 
  var rowggsheet =val_DSUserDV.indexOf(rowuserdv) +1 ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.hoten+1,1,1).setValue(databaohong.hoten);
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.sdt+1,1,1).setValue(databaohong.sdt.toString());
  val_DataSC = sh_DataSC.getDataRange().getValues();
  var rowdatasc = val_DataSC[lr-1]
  tele_sendsms_group(rowdatasc,rowthietbi,rowusersua,rowuserdv) ;
  tele_sendsms_user(rowdatasc,rowthietbi,rowusersua,rowuserdv,rowusersua[mycol.DSUserSua.usetele]) ;
  var datain ={
    id : errorID,
    rowthietbi: rowthietbi,
    rowdvyc: rowdvyc,
    rowusersc: rowusersua,
    sh_DSThietBi: sh_DSThietBi,
    sh_DataSC: sh_DataSC,
    val_dsthietbi: val_dsthietbi,
    val_DataSC: val_DataSC,
    rowsc: rowdatasc,
    rowggsheet: lr
  } 
  createfile_bm0901(datain)
  val_DataSC = sh_DataSC.getDataRange().getValues();
  return val_DataSC ; // Trả về true khi đã hoàn thành việc ghi dữ liệu
}

function SC_nextstatus(id) {
  var ss = SpreadsheetApp.openById(myid.id_filedata);
  var sh_DataSC =ss.getSheetByName(myshname.DataSC); // Đổi "RepairData" thành tên sheet của bạn
  var val_DataSC = sh_DataSC.getDataRange().getValues();
  var rowsc = getfilterrow(val_DataSC,mycol.DataSC.id,id)
  var rowggsheet = val_DataSC.indexOf(rowsc)+1;
  var trangthai = rowsc[mycol.DataSC.trangthai]+1
  sh_DataSC.getRange(rowggsheet,mycol.DataSC.trangthai+1,1,1).setValue(trangthai)
 return sh_DataSC.getDataRange().getValues(); 
}
function SC_update_dangsua(inputdata) {
  var ss = SpreadsheetApp.openById(myid.id_filedata);
  var sh_DataSC =ss.getSheetByName(myshname.DataSC); // Đổi "RepairData" thành tên sheet của bạn
  var val_DataSC = sh_DataSC.getDataRange().getValues();
  var rowsc = getfilterrow(val_DataSC,mycol.DataSC.id,inputdata.id)
  var rowggsheettb = val_DataSC.indexOf(rowsc)+1  

  sh_DataSC.getRange(rowggsheettb,mycol.DataSC.tinhtrangthietbiks +1,1,1).setValue(inputdata.tinhtrangthietbiks)  ;
  // sh_DataSC.getRange(rowggsheettb,mycol.DataSC.trangthai +1,1,1).setValue(inputdata.status_sc) ;
  sh_DataSC.getRange(rowggsheettb,mycol.DataSC.ketluankhaosat +1,1,1).setValue(inputdata.ketluankhaosat) ;
  sh_DataSC.getRange(rowggsheettb,mycol.DataSC.dexuatphuongan +1,1,1).setValue(inputdata.dexuatphuongan) ;
  sh_DataSC.getRange(rowggsheettb,mycol.DataSC.ghichu +1,1,1).setValue(inputdata.ghichu) ;
  sh_DataSC.getRange(rowggsheettb,mycol.DataSC.ngaykhaosat +1,1,1).setValue(inputdata.ngaykhaosat) ;
  sh_DataSC.getRange(rowggsheettb,mycol.DataSC.ngaybangiao +1,1,1).setValue(inputdata.ngaybangiao) ;
  sh_DataSC.getRange(rowggsheettb,mycol.DataSC.ngaydenghi +1,1,1).setValue(inputdata.ngaydenghi) ;
  Logger.log("Lấy thông tin user dv: "+ inputdata.iduserdv)
  //Cập nhật dữ liệu người sửa chửa 
  var rowuserdv = getfilterrow( inputdata.val_DSUserDV, mycol.DSUserDV.id,inputdata.iduserdv);
  var rowggsheet =  inputdata.val_DSUserDV.indexOf(rowuserdv)+1 
  Logger.log("Cập nhật thông tin user dv: "+ inputdata.iduserdv)
  sh_DSUserDV = SpreadsheetApp.openById(myid.id_filedata).getSheetByName(myshname.DSUserDV) 
  // Logger.log("Đơn vị yêu cầu: "+ rowdvyc)
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.bv1_daidien +1,1,1).setValue(inputdata.bv1_daidien) ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.bv1_chucvu +1,1,1).setValue(inputdata.bv1_chucvu) ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.bv2_daidien +1,1,1).setValue(inputdata.bv2_daidien) ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.bv2_chucvu +1,1,1).setValue(inputdata.bv2_chucvu) ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.bv3_daidien +1,1,1).setValue(inputdata.bv3_daidien) ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.bv3_chucvu +1,1,1).setValue(inputdata.bv3_chucvu) ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.bv4_daidien +1,1,1).setValue(inputdata.bv4_daidien) ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.bv4_chucvu +1,1,1).setValue(inputdata.bv4_chucvu) ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.bv5_daidien +1,1,1).setValue(inputdata.bv5_daidien) ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.bv5_chucvu +1,1,1).setValue(inputdata.bv5_chucvu) ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.dv1_daidien +1,1,1).setValue(inputdata.dv1_daidien) ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.dv1_chucvu +1,1,1).setValue(inputdata.dv1_chucvu) ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.dv2_daidien +1,1,1).setValue(inputdata.dv2_daidien) ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.dv2_chucvu +1,1,1).setValue(inputdata.dv2_chucvu) ;
  sh_DSUserDV.getRange(rowggsheet,mycol.DSUserDV.quyetdinhtokhaosat +1,1,1).setValue(inputdata.quyetdinhtokhaosat) ;
  

  //Lấy dữ liệu truyền vào 

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
  // id, rowthietbi, rowdvyc, rowusersc
  var datain ={
    id : inputdata.id,
    rowthietbi: rowthietbi,
    rowdvyc: rowuserdv,
    rowusersc: rowusersua,
    sh_DSThietBi: sh_DSThietBi,
    sh_DataSC: sh_DataSC,
    val_dsthietbi: val_dsthietbi,
    val_DataSC: val_DataSC,
    rowsc: rowsc,
    rowggsheet: rowggsheettb
  }  
  Logger.log("Input data trạng thái:"+ inputdata.status_sc)
  switch (Number(inputdata.status_sc)) {
    case 1: // Nếu status_sc === 1
      console.log("Trạng thái: Báo hỏng");
      createfile_bm0902(datain)
      break;
      
    case 2: // Nếu status_sc === 2
      Logger.log("Trạng thái số 2")
      createfile_bm0903(datain)
      createfile_bm0904(datain)
      console.log("Trạng thái: Đang sửa");
      break;
    case 3: // Nếu status_sc === 3
      console.log("Trạng thái: Bảo hành");
      createfile_bm0904(datain)
      break;
    case 4: // Nếu status_sc === 4
      console.log("Trạng thái: Sửa ngoài");
      createfile_bm0904(datain)
      break;
    default: // Nếu không khớp với bất kỳ case nào    
      console.log("Trạng thái không xác định");
      break;
  }
  var val_DataSC = sh_DataSC.getDataRange().getValues(); 
  return val_DataSC;
}

