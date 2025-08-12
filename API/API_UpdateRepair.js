// API/testUpdateRepairDn02
function testUpdateRepairDn02() {
  const params = {
    dvDaiDienChucVu1: "Chức vụ ĐV 1",
    dvDaiDienChucVu2: "Chức vụ ĐV 2",
    dvDaiDienName1: "Đại diện đơn vị 1",
    dvDaiDienName2: "Đại diện đơn vị 2",
    history: "* 00:37:49 12/8/2025 - Đơn Vị Can Thiệp Mạch: Cập nhật thông tin - Khảo sát tình trạng thiết bị hỏng\n   - Ghi chú: ghi chú abc",
    idDevice: "TB003",
    idTeleNguoiSua: 5468165152,
    indexDevice: 3,
    indexRepair: 2,
    mrDaiDienChucVu1: "Chức vụ 1",
    mrDaiDienChucVu2: "Chức vụ 2",
    mrDaiDienChucVu3: "Chức vụ 3",
    mrDaiDienChucVu4: "Chức vụ 4",
    mrDaiDienChucVu5: "Chức vụ 5",
    mrDaiDienName1: "Đại diện 1",
    mrDaiDienName2: "Đại diện 2",
    mrDaiDienName3: "Đại diện 3",
    mrDaiDienName4: "Đại diện 4",
    mrDaiDienName5: "Đại diện 5",
    ngaydonvibao: "23:55:39 31/7/2025",
    mrDecisionFull: "Số quyết định ngày 2025-11-10",
    mrRepairProposal: "Phương án áldfl",
    mrSurveyConclusion: "Kết luântj",
    mrSurveyStatus: "Tình trạng kháo sants...",
    nameModel: "GC-03",
    nameMucDo: "Gấp",
    nameNguoiSua: "Phạm Thành Test",
    nameNguoiYeuCau: "Phạm Thành Trung",
    nameSDTNguoiSua: "038 994 3573",
    nameSDTYeuCau: 987726236,
    nameSerial: "Không có",
    nameThietbi: "Giường bệnh nhân 3 tay quay",
    nameTinhTrang: "Em011",
    nameuserdv: "Đơn Vị Can Thiệp Mạch",
    repairID: "SC.DVCTM.250519.022",
    timeupdate: "00:37:49 12/8/2025"
  }
    const result = updateRepairDn02(params);
//   SendtoTelegram(params);
  console.log("Test Update Repair 02:", result);
}

// API/testUpdateRepairDn03
function testUpdateRepairDn03() {
  const params = {
  }
    const result = updateRepairDn03(params);
//   SendtoTelegram(params);
  console.log("Test Update Repair 03:", result);
}

// API/testUpdateRepairDn04
function testUpdateRepairDn04() {
  const params = {
  }
    const result = updateRepairDn04(params);
//   SendtoTelegram(params);
  console.log("Test Update Repair 04:", result);
}



// API/updateRepairDn02
function updateRepairDn02(params) {
  try {
    const ssMainData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DataSC);
    const shDSThietBi = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DSThietBi);
    const val_DSThietBi = shDSThietBi.getDataRange().getValues();
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

    // Nhắn tin trên Telegram - Nhoms
    SendtoTelegram(params, TELEGRAM_CONFIG.group_chat_id_Tele, "CẬP NHẬT ĐỀ NGHỊ SỬA CHỮA");
    // Nhắn tin trên Telegram - Người sửa
    if (params.idTeleNguoiSua) {
        SendtoTelegram(params, params.idTeleNguoiSua, "CẬP NHẬT ĐỀ NGHỊ SỬA CHỮA");
    }

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
function updateRepairDn03() {
  console.log("updateRepairDn03");
}

// API/updateRepairDn04
function updateRepairDn04() {
  console.log("updateRepairDn04");
}