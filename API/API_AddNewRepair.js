// Test API_AddNewRepair
function testAddNewRepair() {
const params = {
    repairID: "SC.DVCTM.250731.038.839",
    trangthai: "Em001",
    mucdo: "Em020",
    iduserdv: "UDV001",
    idusersua: "USC001",
    idthietbi: "TB001",
    tinhtrangtbdvbao: "Thiết bị không chạy",
    ngaydonvibao: "23:55:39 31/7/2025",
    ghichu: "abc",
    hotenYeucau: "Phạm Thành Trung",
    sdtYeucau: "123456790",
    qrcode: "",
    history: "* 23:55:39 31/7/2025 - Phạm Thành Trung: Thêm đề nghị báo hỏng mới\n\n   - Ghi chú: abc",
    timeupdate: "23:55:39 31/7/2025",
    nameHangSX: "Terumo",
    nameModel: "TE-SS700",
    nameMucDo: "Gấp",
    nameNamSD: "28/12/2018",
    nameNamSX: "2018",
    nameNguoiSua: "Phạm Thành Test",
    nameNguoiYeuCau: "Phạm Thành Trung",
    nameNuocSX: "2018",
    nameSDTYeuCau: "123456790",
    nameSerial: "1810010532",
    nameThietbi: "Bơm tiêm điện",
    nameTinhTrang: "Thiết bị không chạy",
    nameuserdv: "Đơn Vị Can Thiệp Mạch"
};

  const result = addnewrepair(params);
  console.log("Test Add New Repair:", result);
}

// API/API_AddNewRepair
function addnewrepair(params) {
    // Kiểm tra trạng thái thiết bị
    const isTrangThaiTB = CheckTrangThaiThietBi(params.idthietbi);
    if (isTrangThaiTB !== CONFIG_ENUM.TINHTRANG_THIETBI.BINH_THUONG) {
        return { status: "error", message: "Thiết bị không trong tình trạng bình thường" };
    }
    // Tạo biên bản đề nghị sửa chữa
    objFileUrl = createfile_bm0901(params);

    // Thêm mới đề nghị sửa chữa vào sheet
    objNewRow = AddNewRepairtoSheet(params, objFileUrl);

    // Nhắn tin trên Telegram
    SendtoTelegram(params);

    return { 
        status: "success",
        message: "New repair added successfully",
        dataNewRow: objNewRow.dataNewRow 
    };
}

//CheckTrangThaiThietBi
function CheckTrangThaiThietBi(idthietbi) {
    try {
        const ssMainData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DataSC);
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
    
    const templateFile = DriveApp.getFileById(CONFIG_TEMPLATES.IDFile_09_01);
    const FolderWord = DriveApp.getFolderById(CONFIG_TEMPLATES.IDFolder_Word_01);
    const newWordFile = templateFile.makeCopy(`BB01_${params.repairID}_${params.ngaydonvibao}`, FolderWord);
    const DocNewWordFile = DocumentApp.openById(newWordFile.getId());
    const bodyNewWordFile = DocNewWordFile.getBody();

    // Replace placeholders in the document

    const [time, date] = params.ngaydonvibao.split(' ');
    const [day, month, year] = date.split('/');
    // Prepare replacement data
    const replacements = {
      "{{Đơn vị yêu cầu}}": params.nameuserdv,
      "{{today}}": day,
      "{{month}}": month,
      "{{year}}": year,
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
    console.log("[createfile_bm0901] - Replacements data:", replacements);
    // Replace placeholders in the document body
    for (const [placeholder, value] of Object.entries(replacements)) {
        bodyNewWordFile.replaceText(placeholder, value.toString());
    }
    DocNewWordFile.saveAndClose();

    // Convert to PDF
    const pdfFile = DriveApp.getFileById(DocNewWordFile.getId()).getBlob().getAs('application/pdf');
    const FolderPdf = DriveApp.getFolderById(CONFIG_TEMPLATES.IDFolder_Pdf_01);
    const pdfFileName = `BB01_${params.repairID}_${params.ngaydonvibao}.pdf`;
    const newPdfFile = FolderPdf.createFile(pdfFile.setName(pdfFileName));

    // Gán quyên truy cập cho người dùng, ai có link đều có thể xem
    newPdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const pdfFileUrl = newPdfFile.getUrl();
    const wordFileUrl = newWordFile.getUrl();
    console.log("[createfile_bm0901] - Đã tạo biên bản đề nghị sửa chữa:", pdfFileUrl, wordFileUrl);
    return {
        status: "success",
        pdfFileUrl: pdfFileUrl,
        wordFileUrl: wordFileUrl,
    }

    } catch (error) {
        console.error("[createfile_bm0901] - Lỗi khi tạo biên bản đề nghị sửa chữa:", error);
        return { status: "error", message: "Lỗi khi tạo biên bản đề nghị sửa chữa: " + error.message };
    }
}

// AddNewRepairtoSheet
function AddNewRepairtoSheet(params, objFileUrl) {
    try {
            // Get Data Spreadsheet
    const ssMainData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DataSC);
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
      params.qrcode,               // QR Code_DataSC
      params.history,                    // History_DataSC
      params.timeupdate,                  // TimeUpdate_DataSC

      objFileUrl.wordFileUrl,    // Word_BB01_DataSC (col 38)
      objFileUrl.pdfFileUrl,     // Pdf_BB01_DataSC (col 39)
      "",                              // Word_BB02_DataSC (col 40)
      "",                              // Pdf_BB02_DataSC (col 41)
      "",                              // Word_BB03_DataSC (col 42)
      "",                              // Pdf_BB03_DataSC (col 43)
      "",                              // Word_BB04_DataSC (col 44)
      ""                               // Pdf_BB04_DataSC (col 45)
    ];

    shDataSC.appendRow(newRow);
    return { 
        status: "success", 
        message: "Dòng mới đã được thêm vào DataSC",
        dataNewRow: newRow
    };

    } catch (error) {
        console.error("[AddNewRepairtoSheet] - Lỗi khi lấy dữ liệu từ DataSC:", error);
        return { status: "error", message: "Lỗi khi lấy dữ liệu từ DataSC: " + error.message };
    }

}

// SendtoTelegram
function SendtoTelegram(params) {
    
}