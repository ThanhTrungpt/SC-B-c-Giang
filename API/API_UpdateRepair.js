// API/testUpdateRepairDn04
function testUpdateRepairDn04() {
  const params = {
    history: "* 21:49:47 13/8/2025 - Đơn Vị Can Thiệp Mạch: Cập nhật thông tin - Biên bản bàn giao nghiệm thu, đưa vào sử dụng   - Ghi chú: sdfs",
    idDevice: "TB005",
    idTeleNguoiSua: 5468165152,
    indexDevice: 5,
    indexRepair: 3,
    mrDaiDienChucVu1: "mrDaiDienChucVu1",
    mrDaiDienChucVu2: "mrDaiDienChucVu2",
    mrDaiDienChucVu3: "mrDaiDienChucVu3",
    mrDaiDienChucVu4: "mrDaiDienChucVu4",
    mrDaiDienChucVu5: "mrDaiDienChucVu5",
    mrDaiDienName1: "mrDaiDienName1",
    mrDaiDienName2: "mrDaiDienName2",
    mrDaiDienName3: "mrDaiDienName3",
    mrDaiDienName4: "mrDaiDienName4",
    mrDaiDienName5: "mrDaiDienName5",
    mrDecisionFull: " ngày undefined/undefined/",
    mrDeviceStatusBG: "sdfsdfsdf",
    mrSurveyStatus: "",
    nameHangSX: "NIHONKODEN",
    nameModel: "TEC-5631",
    nameMucDo: "Gấp",
    nameNamSD: "29/08/2019",
    nameNamSX: 2018,
    nameNguoiSua: "Phạm Thành Test",
    nameNguoiYeuCau: "Phạm Thành Trung",
    nameNuocSX: "Nhật Bản",
    nameSDTNguoiSua: "038 994 3573",
    nameSDTYeuCau: 123456790,
    nameSerial: 5314,
    nameThietbi: "Máy phá rung tim đồng bộ 2 pha có tạo nhịp",
    nameuserdv: "Đơn Vị Can Thiệp Mạch",
    ngaydonvibao: "14:44:37 10/8/2025",
    ngaykhaosat: "00:37:49 12/8/2025",
    repairID: "SC.DVCTM.250523.030.598",
    timeupdate: "21:49:47 13/8/2025",
    dvDaiDienChucVu1: "dvDaiDienChucVu1",
    dvDaiDienChucVu2: "dvDaiDienChucVu2",
    dvDaiDienName1: "dvDaiDienName1",
    dvDaiDienName2: "dvDaiDienName2"
  }
    const result = updateRepairDn04(params);
//   SendtoTelegram(params);
  console.log("Test Update Repair 04:", result);
}

// API/testUpdateRepairDn03
function testUpdateRepairDn03() {
  const params = {
    history: "* 21:28:22 13/8/2025 - Đơn Vị Can Thiệp Mạch: Cập nhật thông tin - Đề nghị sửa chữa   - Ghi chú: abc",
    idDevice: "TB001",
    idTeleNguoiSua: 5468165152,
    indexDevice: 1,
    indexRepair: 2,
    mrDecisionFull: " ngày undefined/undefined/",
    mrProposalContent: "fsdfs",
    mrRepairProposal: "",
    mrSurveyConclusion: "",
    mrSurveyStatus: "",
    nameHangSX: "Terumo",
    nameModel: "TE-SS700",
    nameMucDo: "Gấp",
    nameNamSD: "28/12/2018",
    nameNamSX: 2018,
    nameNguoiSua: "Phạm Thành Test",
    nameNguoiYeuCau: "Phạm Thành Trung",
    nameNuocSX: "Nhật Bản",
    nameSDTNguoiSua: "038 994 3573",
    nameSDTYeuCau: 123456790,
    nameSerial: 1810010532,
    nameThietbi: "Bơm tiêm điện",
    nameuserdv: "Đơn Vị Can Thiệp Mạch",
    ngaydonvibao: "14:44:37 10/8/2025",
    ngaykhaosat: "00:37:49 12/8/2025",
    repairID: "SC.DVCTM.250523.029.494",
    timeupdate: "21:28:22 13/8/2025"
  }
    const result = updateRepairDn03(params);
//   SendtoTelegram(params);
  console.log("Test Update Repair 03:", result);
}

// API/testUpdateRepairDn02
function testUpdateRepairDn02() {
  const params = {
    dvDaiDienChucVu1: "Chức vụ ĐV 1",
    dvDaiDienChucVu2: "",
    dvDaiDienName1: "Đại diện đơn vị 1",
    dvDaiDienName2: "",
    history: "* 23:41:51 12/8/2025 - Đơn Vị Can Thiệp Mạch: Cập nhật thông tin - Khảo sát tình trạng thiết bị hỏng\n",
    idDevice: "TB001",
    idTeleNguoiSua: 5468165152,
    indexDevice: 1,
    indexRepair: 7,
    mrDaiDienChucVu1: "Chức vụ 1",
    mrDaiDienChucVu2: "",
    mrDaiDienChucVu3: "",
    mrDaiDienChucVu4: "",
    mrDaiDienChucVu5: "",
    mrDaiDienName1: "Đại diện 1",
    mrDaiDienName2: "",
    mrDaiDienName3: "",
    mrDaiDienName4: "",
    mrDaiDienName5: "",
    mrDecisionFull: "123 ngày 2025-01-11",
    mrRepairProposal: "sdfsdf",
    mrSurveyConclusion: "sdfsdf",
    mrSurveyStatus: "sdfsd",
    nameModel: "TE-SS700",
    nameMucDo: "Gấp",
    nameNguoiSua: "Phạm Thành Test",
    nameNguoiYeuCau: "Phạm Thành Trung",
    nameSDTNguoiSua: "038 994 3573",
    nameSDTYeuCau: 123456790,
    nameSerial: 1810010532,
    nameThietbi: "Bơm tiêm điện",
    nameTinhTrang: "Em011",
    nameuserdv: "Đơn Vị Can Thiệp Mạch",
    ngaydonvibao: undefined,
    repairID: "SC.DVCTM.250521.028.352",
    timeupdate: "23:41:51 12/8/2025"
  }
    const result = updateRepairDn02(params);
//   SendtoTelegram(params);
  console.log("Test Update Repair 02:", result);
}


// API/updateRepairDn02
function updateRepairDn02(params) {
  try {
    const ssMainData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DataSC);
    const shDataSC = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
    const val_DataSC = shDataSC.getDataRange().getValues();

    // Kiểm tra trạng thái Repair
    const indexRepair = Number(params.indexRepair);
    const rowRepair = val_DataSC[indexRepair];
    console.log("[updateRepairDn02] - indexRepair:", indexRepair, "rowRepair:", rowRepair);
    // kiểm tra repairID
    if (params.repairID !== rowRepair[CONFIG_COLUMNS.DataSC.id]) {
        console.log("[updateRepairDn02] - Lỗi: ID đề nghị sửa chữa không khớp với indexRepair");
        return { status: "error", message: "ID đề nghị sửa chữa không khớp với indexRepair"};
    }
    // Kiểm tra trang thai đề nghị
    if (rowRepair[CONFIG_COLUMNS.DataSC.trangthai] !== CONFIG_ENUM.TRANGTHAI.KHAO_SAT) {
        console.log("[updateRepairDn02] - Lỗi: Đề nghị sửa chữa không ở trạng thái khảo sát");
        return { status: "error", message: "Đề nghị sửa chữa không ở trạng thái khảo sát" };
    }
    // Xóa và update biên bản khảo sát tình trạng báo hỏng
    objFileUrl = createfile_bm0902(params, rowRepair);
    console.log("[updateRepairDn02] - objFileUrl:", objFileUrl);

    //mrDecisionNumber
    rowRepair[CONFIG_COLUMNS.DataSC.quyetdinhtokhaosat] = params.mrDecisionFull;
    rowRepair[CONFIG_COLUMNS.DataSC.ngaykhaosat] = params.timeupdate;
    rowRepair[CONFIG_COLUMNS.DataSC.bv1_daidien] = params.mrDaiDienName1;
    rowRepair[CONFIG_COLUMNS.DataSC.bv1_chucvu] = params.mrDaiDienChucVu1;
    rowRepair[CONFIG_COLUMNS.DataSC.bv2_daidien] = params.mrDaiDienName2;
    rowRepair[CONFIG_COLUMNS.DataSC.bv2_chucvu] = params.mrDaiDienChucVu2;
    rowRepair[CONFIG_COLUMNS.DataSC.bv3_daidien] = params.mrDaiDienName3;
    rowRepair[CONFIG_COLUMNS.DataSC.bv3_chucvu] = params.mrDaiDienChucVu3;
    rowRepair[CONFIG_COLUMNS.DataSC.bv4_daidien] = params.mrDaiDienName4;
    rowRepair[CONFIG_COLUMNS.DataSC.bv4_chucvu] = params.mrDaiDienChucVu4;
    rowRepair[CONFIG_COLUMNS.DataSC.bv5_daidien] = params.mrDaiDienName5;
    rowRepair[CONFIG_COLUMNS.DataSC.bv5_chucvu] = params.mrDaiDienChucVu5;
    rowRepair[CONFIG_COLUMNS.DataSC.dv1_daidien] = params.dvDaiDienName1;
    rowRepair[CONFIG_COLUMNS.DataSC.dv1_chucvu] = params.dvDaiDienChucVu1;
    rowRepair[CONFIG_COLUMNS.DataSC.dv2_daidien] = params.dvDaiDienName2;
    rowRepair[CONFIG_COLUMNS.DataSC.dv2_chucvu] = params.dvDaiDienChucVu2;
    rowRepair[CONFIG_COLUMNS.DataSC.tinhtrangthietbiks] = params.mrSurveyStatus;
    rowRepair[CONFIG_COLUMNS.DataSC.ketluankhaosat] = params.mrSurveyConclusion;
    rowRepair[CONFIG_COLUMNS.DataSC.dexuatphuongan] = params.mrRepairProposal;
    rowRepair[CONFIG_COLUMNS.DataSC.Word_BB02] = objFileUrl.wordFileUrl;
    rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB02] = objFileUrl.pdfFileUrl;
    // Cập nhật lịch sử
    rowRepair[CONFIG_COLUMNS.DataSC.history] += "\n" + params.history;

    // Time Update
    rowRepair[CONFIG_COLUMNS.DataSC.timeupdate] = params.timeupdate;

    // Cập nhật lại dòng sửa chữa vào sheet
    shDataSC.getRange(indexRepair + 1, 1, 1, rowRepair.length).setValues([rowRepair]);
    console.log("[updateRepairDn02] - Cập nhật dòng sửa chữa:", rowRepair);

    return {
        status: "success",
        message: "Update repair 02 successfully",
        indexRepair: indexRepair,
        rowRepair: rowRepair
    };
  } catch (error) {
    console.error("Error in updateRepairDn02:", error);
    return { status: "error", message: error.message };
  }
}

// API/updateRepairDn03
function updateRepairDn03(params) {
  try {
    const ssMainData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DataSC);
    const shDataSC = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
    const val_DataSC = shDataSC.getDataRange().getValues();

    // Kiểm tra trạng thái Repair
    const indexRepair = Number(params.indexRepair);
    const rowRepair = val_DataSC[indexRepair];
    console.log("[updateRepairDn03] - indexRepair:", indexRepair, "rowRepair:", rowRepair);
    // kiểm tra repairID
    if (params.repairID !== rowRepair[CONFIG_COLUMNS.DataSC.id]) {
        console.log("[updateRepairDn03] - Lỗi: ID đề nghị sửa chữa không khớp với indexRepair");
        return { status: "error", message: "ID đề nghị sửa chữa không khớp với indexRepair"};
    }
    // Kiểm tra trang thai đề nghị
    if (rowRepair[CONFIG_COLUMNS.DataSC.trangthai] !== CONFIG_ENUM.TRANGTHAI.DANG_SUA) {
        console.log("[updateRepairDn03] - Lỗi: Đề nghị sửa chữa không ở trạng thái đang sửa");
        return { status: "error", message: "Đề nghị sửa chữa không ở trạng thái đang sửa" };
    }
    // Xóa và update biên bản khảo sát tình trạng báo hỏng
    objFileUrl = createfile_bm0903(params, rowRepair);
    console.log("[updateRepairDn03] - objFileUrl:", objFileUrl);

    rowRepair[CONFIG_COLUMNS.DataSC.ngaydenghi] = params.timeupdate;
    rowRepair[CONFIG_COLUMNS.DataSC.noidungdenghi] = params.mrProposalContent;
    rowRepair[CONFIG_COLUMNS.DataSC.Word_BB03] = objFileUrl.wordFileUrl;
    rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB03] = objFileUrl.pdfFileUrl;
    // Cập nhật lịch sử
    rowRepair[CONFIG_COLUMNS.DataSC.history] += "\n" + params.history;

    // Time Update
    rowRepair[CONFIG_COLUMNS.DataSC.timeupdate] = params.timeupdate;

    // Cập nhật lại dòng sửa chữa vào sheet
    shDataSC.getRange(indexRepair + 1, 1, 1, rowRepair.length).setValues([rowRepair]);
    console.log("[updateRepairDn03] - Cập nhật dòng sửa chữa:", rowRepair);

    return {
        status: "success",
        message: "Update repair 03 successfully",
        indexRepair: indexRepair,
        rowRepair: rowRepair
    };
  } catch (error) {
    console.error("Error in updateRepairDn03:", error);
    return { status: "error", message: error.message };
  }
}

// API/updateRepairDn04
function updateRepairDn04(params) {
  console.log("updateRepairDn04");
  try {
    const ssMainData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DataSC);
    const shDataSC = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
    const val_DataSC = shDataSC.getDataRange().getValues();

    // Kiểm tra trạng thái Repair
    const indexRepair = Number(params.indexRepair);
    const rowRepair = val_DataSC[indexRepair];
    console.log("[updateRepairDn04] - indexRepair:", indexRepair, "rowRepair:", rowRepair);
    // kiểm tra repairID
    if (params.repairID !== rowRepair[CONFIG_COLUMNS.DataSC.id]) {
        console.log("[updateRepairDn04] - Lỗi: ID đề nghị sửa chữa không khớp với indexRepair");
        return { status: "error", message: "ID đề nghị sửa chữa không khớp với indexRepair"};
    }
    
    // Xóa và update biên bản khảo sát tình trạng báo hỏng
    objFileUrl = createfile_bm0904(params, rowRepair);
    console.log("[updateRepairDn04] - objFileUrl:", objFileUrl);

    //mrDecisionNumber
    rowRepair[CONFIG_COLUMNS.DataSC.bv1_daidien] = params.mrDaiDienName1;
    rowRepair[CONFIG_COLUMNS.DataSC.bv1_chucvu] = params.mrDaiDienChucVu1;
    rowRepair[CONFIG_COLUMNS.DataSC.bv2_daidien] = params.mrDaiDienName2;
    rowRepair[CONFIG_COLUMNS.DataSC.bv2_chucvu] = params.mrDaiDienChucVu2;
    rowRepair[CONFIG_COLUMNS.DataSC.bv3_daidien] = params.mrDaiDienName3;
    rowRepair[CONFIG_COLUMNS.DataSC.bv3_chucvu] = params.mrDaiDienChucVu3;
    rowRepair[CONFIG_COLUMNS.DataSC.bv4_daidien] = params.mrDaiDienName4;
    rowRepair[CONFIG_COLUMNS.DataSC.bv4_chucvu] = params.mrDaiDienChucVu4;
    rowRepair[CONFIG_COLUMNS.DataSC.bv5_daidien] = params.mrDaiDienName5;
    rowRepair[CONFIG_COLUMNS.DataSC.bv5_chucvu] = params.mrDaiDienChucVu5;
    rowRepair[CONFIG_COLUMNS.DataSC.dv1_daidien] = params.dvDaiDienName1;
    rowRepair[CONFIG_COLUMNS.DataSC.dv1_chucvu] = params.dvDaiDienChucVu1;
    rowRepair[CONFIG_COLUMNS.DataSC.dv2_daidien] = params.dvDaiDienName2;
    rowRepair[CONFIG_COLUMNS.DataSC.dv2_chucvu] = params.dvDaiDienChucVu2;

    rowRepair[CONFIG_COLUMNS.DataSC.ngaybangiao] = params.timeupdate;
    rowRepair[CONFIG_COLUMNS.DataSC.tinhtrangbangiao] = params.mrDeviceStatusBG;
    rowRepair[CONFIG_COLUMNS.DataSC.Word_BB04] = objFileUrl.wordFileUrl;
    rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB04] = objFileUrl.pdfFileUrl;
    // Cập nhật lịch sử
    rowRepair[CONFIG_COLUMNS.DataSC.history] += "\n" + params.history;

    // Time Update
    rowRepair[CONFIG_COLUMNS.DataSC.timeupdate] = params.timeupdate;

    // Cập nhật lại dòng sửa chữa vào sheet
    shDataSC.getRange(indexRepair + 1, 1, 1, rowRepair.length).setValues([rowRepair]);
    console.log("[updateRepairDn04] - Cập nhật dòng sửa chữa:", rowRepair);

    return {
        status: "success",
        message: "Update repair 04 successfully",
        indexRepair: indexRepair,
        rowRepair: rowRepair
    };
  } catch (error) {
    console.error("Error in updateRepairDn04:", error);
    return { status: "error", message: error.message };
  }
}