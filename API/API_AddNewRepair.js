// Test API_AddNewRepair
function testAddNewRepair() {
const params = {
    repairID: "SC.DVCTM.250731.038.073",
    trangthai: "Em001",
    mucdo: "Em020",
    iduserdv: "UDV001",
    idusersua: "USC001",
    idthietbi: "TB001",
    tinhtrangtbdvbao: "Thiết bị không chạy",
    ngaydonvibao: "17:36:43 31/7/2025",
    ghichu: "sd",
    hotenYeucau: "Phạm Thành Trung",
    sdtYeucau: "123456790",
    qrcode: "",
    history: "* 17:36:43 31/7/2025 - Phạm Thành Trung: Thêm đề nghị báo hỏng mới\n\n   - Ghi chú: sd",
    timeupdate: "17:36:43 31/7/2025"
};

  const result = addnewrepair(params);
  console.log("Test Add New Repair:", result);
}

// API/API_AddNewRepair
function addnewrepair(params) {
    // Kiểm tra trạng thái thiết bị
    const isTrangThaiTB = CheckTrangThaiThietBi(params.idthietbi);
    if (isTrangThaiTB !== CONFIG_ENUM.TRANGTHAI.BINH_THUONG) {
        return { status: "error", message: "Thiết bị không trong tình trạng bình thường" };
    }
    // Tạo biên bản đề nghị sửa chữa
    createfile_bm0901(params);

    // Thêm mới đề nghị sửa chữa vào sheet
    AddNewRepairtoSheet(params);

    // Nhắn tin trên Telegram
    SendtoTelegram(params);

    return { status: "success", message: "New repair added successfully" };
}

//CheckTrangThaiThietBi
function CheckTrangThaiThietBi(idthietbi) {
    console.log("[CheckTrangThaiThietBi] - Kiểm tra trạng thái thiết bị:", idthietbi);
    try {
        const ssMainData = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DataSC);
        const val_DSThietBi = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DSThietBi).getDataRange().getValues();

        const thietbiIndex = val_DSThietBi.findIndex(row => row[CONFIG_COLUMNS.DSThietBi.id] === idthietbi);
        if (thietbiIndex === -1) {
            console.log("[CheckTrangThaiThietBi] - Thiết bị không tồn tại");
        return { status: "error", message: "Thiết bị không tồn tại" };
        }
        return val_DSThietBi[thietbiIndex][CONFIG_COLUMNS.DSThietBi.tinhtrang];
    } catch (error) {
        console.log("[CheckTrangThaiThietBi] - Lỗi khi kiểm tra trạng thái thiết bị:", error);
        return { status: "error", message: "Lỗi khi kiểm tra trạng thái thiết bị: " + error.message };
    }
}

// createfile_bm0901
function createfile_bm0901(params) {
    try{
    // Get template document
    const templateId = CONFIG_TEMPLATES.BM_VTTB_09_01;
    const templateDoc = DocumentApp.openById(templateId);
    if (!templateDoc) {
      throw new Error("Template document not found: " + templateId);
    }

    const timeDVBao = new Date(params.ngaydonvibao);
    // Prepare replacement data
    const replacements = {
      "{{Đơn vị yêu cầu}}": params.nameuserdv,
      "{{today}}": timeDVBao.getDate(),
      "{{month}}": timeDVBao.getMonth() + 1,
      "{{year}}": timeDVBao.getFullYear(),
      "{{Tên thiết bị}}": params.nameThietbi,
      "{{Model}}": params.nameModel,
      "{{Serial}}": params.nameSerial,
      "{{Hãng sản xuất}}": params.nameHangSX,
      "{{Nước sản xuất}}": params.nameNuocSX,
      "{{Năm sản xuất}}": params.nameNamSX,
      "{{Năm sử dụng}}": params.nameNamSD,
    //   "{{QR_CODE}}": generateQRCodeUrl(params.repairID),
      "{{id}}": params.repairID
    };
    // Create copy of template with new name
    const fileName = "BM.VTTB.09.01 Giấy đề nghị sửa chữa - " + params.repairID;
    const documentFolder = getFolderOrCreate("Word_BM0901");



    } catch (error) {
        console.error("[createfile_bm0901] - Lỗi khi tạo biên bản đề nghị sửa chữa:", error);
        return { status: "error", message: "Lỗi khi tạo biên bản đề nghị sửa chữa: " + error.message };
    }
}

// AddNewRepairtoSheet
function AddNewRepairtoSheet(params) {
    try {
            // Get Data Spreadsheet
    const ssMainData = SpreadsheetApp.openById(CONFIG_FILE_IDS.idSH_DataSC);
    const shDataSC = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
    const val_DataSC = shDataSC.getDataRange().getValues();

    // Tạo mảng mới là dòng sheet để add vào shDataSC
    const newRow = [
      params.repairID,                   // ID_DataSC
      "",                                // Webhook_DataSC
      params.trangthai,                  // Trạng thái_DataSC
      params.mucdo,                      // Mức độ_DataSC
      params.iduserdv,                   // Đơn vị_DataSC
      params.idusersua,                  // Người sửa_DataSC
      params.idthietbi,                  // Thiết bị_DataSC
      params.tinhtrangtbdvbao,           // Tình trạng thiết bị đơn vị báo_DataSC
      params.ngaydonvibao,               // Thời gian đơn vị báo_DataSC
      "",                                // Ngày khảo sát_DataSC
      "",                                // Tình trạng thiết bị khảo sát_DataSC
      "",                                // Kết luận khảo sát_DataSC
      "",                                // Đề xuất phương án_DataSC
      "",                                // Ngày đề nghi_DataSC
      "",                                // Nội dung đề nghi_DataSC
      "",                                // Ngày bàn giao_DataSC
      "",                                // Tình trạng thiết bị bàn giao_DataSC
      params.ghichu,                     // Ghi chú_DataSC
      params.hotenYeucau,                // Họ và tên_DataSC
      params.sdtYeucau,                  // Số điện thoại_DataSC
      "",                                // Quyết định tổ khảo sát_DataSC
      "",                                // Đại diện BV 1_DataSC
      "",                                // Chức vụ DD BV 1_DataSC
      "",                                // Đại diện BV 2_DataSC
      "",                                // Chức vụ DD BV 2_DataSC
      "",                                // Đại diện BV 3_DataSC
      "",                                // Chức vụ DD BV 3_DataSC
      "",                                // Đại diện BV 4_DataSC
      "",                                // Chức vụ DD BV 4_DataSC
      "",                                // Đại diện BV 5_DataSC
      "",                                // Chức vụ DD BV 5_DataSC
      "",                                // Đại diện ĐV1 Báo sửa 1_DataSC
      "",                                // Chức vụ DD ĐV1 Báo sửa_DataSC
      "",                                // Đại diện ĐV2 Báo sửa _DataSC
      "",                                // Chức vụ DD ĐV2 Báo sửa_DataSC
      params.qrcode || "",               // QR Code_DataSC
      params.history,                    // History_DataSC
      params.timeupdate                  // TimeUpdate_DataSC
    ];

    shDataSC.appendRow(newRow);
    console.log("[AddNewRepairtoSheet] - Dòng mới đã được thêm vào DataSC:", newRow);
    return { status: "success", message: "Dòng mới đã được thêm vào DataSC" };
    } catch (error) {
        console.error("[AddNewRepairtoSheet] - Lỗi khi lấy dữ liệu từ DataSC:", error);
        return { status: "error", message: "Lỗi khi lấy dữ liệu từ DataSC: " + error.message };
    }

}

// SendtoTelegram
function SendtoTelegram(params) {}