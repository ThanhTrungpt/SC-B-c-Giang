const myid ={
  id_filedata : "1zKmCoyRnUtgICQtiJi8Z_IqR3ZPbu5Qb-OXEvf_o2rs"
}
const myshname={
  DSUserDV : "DSUserDV",
  DSUserSua : "DSUserSua",
  DataSC: "DataSC",
  DSThietBi:"DSThietBi",
  DSNhomTB:"DSNhomTB"
}
const mycol ={
  DSNhomTB: {
    id: 0,
    nhomtb: 1,
    kihieu: 2,
    ghichu:3,
    history:4,
    timeupdate:5
  },
  DSThietBi:{
    id: 0,
    donvi: 1,
    nhomtb: 2,
    mathietbi: 3,
    tentb: 4,
    model:5,
    serial: 6,
    hangsx: 7,
    nuocsx: 8,
    namsx:9,
    namsd: 10,
    hanbaohanh:11,
    vitridat:12,
    tinhtrang:13,
    ghichu:14,
    history:15,
    timupdate:16
  },
  DataSC : {
    id: 0,
    trangthai: 1,
    mucdo: 2,
    iduserdv: 3,
    idusersua: 4,
    idthietbi: 5,
    tinhtrangtbdvbao: 6,
    ngaydonvibao: 7,
    ngaykhaosat: 8,
    tinhtrangthietbiks: 9,
    ketluankhaosat: 10,
    dexuatphuongan: 11,
    ngaydenghi: 12,
    noidungdenghi: 13,
    ngaybangiao: 14,
    tinhtrangbangiao: 15,
    ghichu: 16,
    history: 17,
    timeupdate: 18,
    url_vttb_09_01_word: 19,
    url_vttb_09_01_pdf: 20,
    url_vttb_09_02: 21,
    url_vttb_09_03: 22,
    url_vttb_09_04: 23
  },
    DSUserSua: {
      id: 0,
      donvi:1,
      hoten:2,
      sdt:3,
      username:4,
      pass:5,
      quanlydonvi:6,
      linktele:7,
      usetele:8,
      email:9,
      namsinh:10,
      history:11,
      timeupdate:12
    },
    DSUserDV: {
      id: 0 ,
      username: 1 ,
      pass: 2 ,
      donvi: 3 ,
      kihieu: 4 ,
      hoten: 5 ,
      sdt: 6 ,
      nguoisuachua: 7 ,
      quyetdinhtokhaosat: 8,
      bv1_daidien : 9,
      bv1_chucvu : 10,
      bv2_daidien : 11,
      bv2_chucvu : 12,
      bv3_daidien : 13,
      bv3_chucvu : 14,
      bv4_daidien : 15,
      bv4_chucvu : 16,
      bv5_daidien : 17,
      bv5_chucvu : 18,
      dv1_daidien : 19,
      dv1_chucvu : 20,
      dv2_daidien : 21,
      dv2_chucvu : 22
    }
  }
  // const mytemplate :{
  //   BM_VTTB_09_02: "14OLQF8dnfHexmwNTIax6SzBUXxrxlL0NZj4_CmTgtLQ"

  // }
  function getdata() {
      var ss = SpreadsheetApp.openById(myid.id_filedata);
      var sh_DSUserDV = ss.getSheetByName(myshname.DSUserDV);
      var sh_DSUserSua = ss.getSheetByName(myshname.DSUserSua);
      var sh_DataSC = ss.getSheetByName(myshname.DataSC);
      var sh_DSThietBi = ss.getSheetByName(myshname.DSThietBi);
      var sh_DSNhomTB = ss.getSheetByName(myshname.DSNhomTB);

      var val_dsthietbi = sh_DSThietBi.getDataRange().getValues();
      var val_DSUserDV = sh_DSUserDV.getDataRange().getValues();
      var val_DSUserSua = sh_DSUserSua.getDataRange().getValues();
      var val_DataSC = sh_DataSC.getDataRange().getValues();
      var val_DSNhomTB = sh_DSNhomTB.getDataRange().getValues();

    // Chuyển đổi thành JSON
    var lr_thietbi = sh_DSThietBi.getLastRow()
    const ds_donvi = sh_DSThietBi.getRange("b2:b" + lr_thietbi).getValues(); // Lấy dữ liệu từ cột A bắt đầu từ hàng 2 đến hàng cuối cùng
    const ds_nhomtb = sh_DSThietBi.getRange("C2:c" + lr_thietbi).getValues(); // Lấy dữ liệu từ cột A bắt đầu từ hàng 2 đến hàng cuối cùng
    var lr_suachua = sh_DataSC.getLastRow() 
    const ds_trangthaisc = sh_DataSC.getRange("B2:B" + lr_suachua).getValues(); // Lấy dữ liệu từ cột A bắt đầu từ hàng 2 đến hàng cuối cùng
    const lst_donvi1 = ds_donvi.flat(); // Chuyển dữ liệu thành mảng 1 chiều
    // const lst_nhomtb1 = ds_nhomtb.flat(); // Chuyển dữ liệu thành mảng 1 chiều
    const lst_trangthais1 = ds_trangthaisc.flat(); // Chuyển dữ liệu thành mảng 1 chiều    
    const lst_donvi = [...new Set(lst_donvi1.filter(item => item.trim() !== ''))]; 
    // const lst_nhomtb = [...new Set(lst_nhomtb1.filter(item => item.trim() !== ''))]; 
    const lst_trangthaisc = [...new Set(lst_trangthais1.filter(item => item !== ''))]; 
    // Logger.log(userSuaData )
    var data = {
        val_dsthietbi: val_dsthietbi,
        val_DSUserDV: val_DSUserDV,
        val_DSUserSua: val_DSUserSua, // Đưa dữ liệu đã chuyển đổi vào đây
        val_DataSC: val_DataSC,
        val_DSNhomTB: val_DSNhomTB,
        // lst_nhomtb: lst_nhomtb,
        lst_donvi: lst_donvi,
        lst_trangthaisc: lst_trangthaisc,
        mycol: mycol
    };
    Logger.log("Load xong data: "+ data)
    return JSON.stringify(data); // Trả về dưới dạng chuỗi JSON
}

function usersua_update_password(id, newpass){
  var ss = SpreadsheetApp.openById(myid.id_filedata);
  var sh_DSUserSua = ss.getSheetByName(myshname.DSUserSua);
  var val_DSUserSua = sh_DSUserSua.getDataRange().getValues();
  var rowuser = getfilterrow(val_DSUserSua, mycol.DSUserSua.id,id)
  var rowggsheet = val_DSUserSua.indexOf(rowuser) +1
  var colpass= mycol.DSUserSua.pass +1
  //Ghi dữ liệu 
  sh_DSUserSua.getRange(rowggsheet,colpass,1,1).setValue(newpass)
  return true 

}

function generateRepairID(unitCode) {
  // Mã đơn vị (xx)
  var unit = unitCode || "XX";  // Nếu không truyền vào, mặc định là "XX"

  // Ngày hiện tại theo định dạng yymmdd
  var now = new Date();
  var year = now.getFullYear().toString().slice(-2);  // Lấy 2 số cuối của năm
  var month = ("0" + (now.getMonth() + 1)).slice(-2); // Tháng định dạng 2 chữ số
  var day = ("0" + now.getDate()).slice(-2);          // Ngày định dạng 2 chữ số
  var datePart = year + month + day;                  // Kết hợp thành yymmdd

  // Kiểm tra Google Sheets để tìm số lượng ID đã tạo trong ngày và tăng dần
  var ss = SpreadsheetApp.openById(myid.id_filedata); // Thay bằng ID của bạn
  var sh = ss.getSheetByName(myshname.DataSC);           // Thay bằng tên sheet
  var range = sh.getRange("A:A");                          // Cột chứa ID sửa chữa
  var values = range.getValues().flat();                   // Lấy tất cả ID trong cột
  
  // Lọc ID theo ngày hiện tại và đếm số lượng
  var todayCount = values.filter(function(id) {
    return id && id.includes("SC." + unit + "." + datePart);
  }).length;

  // Tạo chuỗi số thứ tự với định dạng 3 chữ số
  var sequence = ("000" + todayCount).slice(-3);

  // Tạo ID hoàn chỉnh
  var repairID = "SC." + unit + "." + datePart + "." + sequence;
  
  return repairID;
}



