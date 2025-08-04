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
    nameuserdv: "Đơn Vị Can Thiệp Mạch",
    nameSDTNguoiSua: "0987654321",
    idTeleNguoiSua: "5468165152"
};

  const result = addNewRepair(params);
//   SendtoTelegram(params);
  console.log("Test Add New Repair:", result);
}

// API/API_AddNewRepair
function addNewRepair(params) {
    try {
        const ssMainData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DataSC);
        const shDSThietBi = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DSThietBi);
        const val_DSThietBi = shDSThietBi.getDataRange().getValues();
        const shDataSC = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
        const val_DataSC = shDataSC.getDataRange().getValues();
        // Kiểm tra trạng thái thiết bị 
        const objCheckTrangThaiThietBi = CheckTrangThaiThietBi(params.idthietbi, shDSThietBi, val_DSThietBi);
        if (!objCheckTrangThaiThietBi.status) {
            return { status: "error", message: "Thiết bị không trong tình trạng bình thường" };
        }
        // Tạo biên bản đề nghị sửa chữa
        objFileUrl = createfile_bm0901(params);

        // Thêm mới đề nghị sửa chữa vào sheet
        objNewRow = AddNewRepairtoSheet(params, objFileUrl, shDataSC, val_DataSC);

        // Nhắn tin trên Telegram
        SendtoTelegram(params);
    return {
        status: "success",
        message: "New repair added successfully",
        dataNewRow: objNewRow.dataNewRow,
        indexDevice: objCheckTrangThaiThietBi.indexDevice,
        idThietBi: params.idthietbi
    };
    } catch (error) {
        console.error("[addNewRepair] - Lỗi khi thêm mới đề nghị sửa chữa:", error);
        return { status: "error", message: "Lỗi khi thêm mới đề nghị sửa chữa: " + error.message };
        }
}

// API/objUpdateRepairDn01
function objUpdateRepairDn01(params) {
    try {
        const ssMainData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DataSC);
        const shDSThietBi = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DSThietBi);
        const val_DSThietBi = shDSThietBi.getDataRange().getValues();
        const shDataSC = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
        const val_DataSC = shDataSC.getDataRange().getValues();
        // Kiểm tra trạng thái thiết bị 
        const objUpdateTrangThaiThietBi = UpdateTrangThaiThietBi(params.rowDeviceOld, params.idthietbiNew, shDSThietBi, val_DSThietBi);
        if (!objUpdateTrangThaiThietBi.status) {
            return { status: "error", message: "Thiết bị không trong tình trạng bình thường" };
        }

        // Xóa file cu

        // Tạo biên bản đề nghị sửa chữa
        objFileUrl = createfile_bm0901(params);

        // Thêm mới đề nghị sửa chữa vào sheet
        objNewRow = UpdateRepairtoSheet(params, objFileUrl, shDataSC, val_DataSC);

    return {
        status: "success",
        message: "Update repair successfully",
        dataNewRow: objNewRow.dataNewRow,
        indexDevice: objCheckTrangThaiThietBi.indexDevice,
        idThietBi: params.idthietbi
    };
    } catch (error) {
        console.error("[addNewRepair] - Lỗi khi thêm mới đề nghị sửa chữa:", error);
        return { status: "error", message: "Lỗi khi thêm mới đề nghị sửa chữa: " + error.message };
        }
}

//UpdateTrangThaiThietBi
function UpdateTrangThaiThietBi(rowDeviceOld, idthietbiNew, shDSThietBi, val_DSThietBi) {
    try {
        let rowDevice = Number(rowDeviceOld);
        const idthietbiOld = val_DSThietBi[rowDevice][CONFIG_COLUMNS.DSThietBi.id];
        console.log("[UpdateTrangThaiThietBi] - idthietbiOld:", idthietbiOld, "idthietbiNew:", idthietbiNew);
        if (idthietbiOld !== idthietbiNew) {
            console.log("[UpdateTrangThaiThietBi] - Cập nhật thiết bị từ", idthietbiOld, "sang", idthietbiNew);
            // Cập nhật thiết bị cũ bình thường
            shDSThietBi.getRange(rowDevice + 1, CONFIG_COLUMNS.DSThietBi.tinhtrang + 1).setValue(CONFIG_ENUM.TINHTRANG_THIETBI.BINH_THUONG);
            // Tìm dòng của thiết bị mới idthietbiNew
            rowDevice = val_DSThietBi.findIndex(row => row[CONFIG_COLUMNS.DSThietBi.id] === idthietbiNew);
            if (rowDevice === -1) {
                console.log("[UpdateTrangThaiThietBi] - Thiết bị mới không tồn tại");
                return { status: "error", message: "Thiết bị mới không tồn tại" };
            } else {
                // Cập nhật thiết bị mới
                shDSThietBi.getRange(rowDevice + 1, CONFIG_COLUMNS.DSThietBi.tinhtrang + 1).setValue(CONFIG_ENUM.TINHTRANG_THIETBI.HONG);
            }
        } 
            return { 
                status: true, 
                message: "Thiết bị đã được đánh dấu là hỏng",
                indexDevice: rowDevice
            };
    } catch (error) {
        console.log("[CheckTrangThaiThietBi] - Lỗi khi kiểm tra trạng thái thiết bị:", error);
        return { status: false, message: "Lỗi khi kiểm tra trạng thái thiết bị: " + error.message };
    }
}

//CheckTrangThaiThietBi
function CheckTrangThaiThietBi(idthietbi, shDSThietBi, val_DSThietBi) {
    try {
        const thietbiIndex = val_DSThietBi.findIndex(row => row[CONFIG_COLUMNS.DSThietBi.id] === idthietbi);
        if (thietbiIndex === -1) {
            console.log("[CheckTrangThaiThietBi] - Thiết bị không tồn tại");
        return { status: "error", message: "Thiết bị không tồn tại" };
        }
        const TinhtrangThietBi = val_DSThietBi[thietbiIndex][CONFIG_COLUMNS.DSThietBi.tinhtrang];
        if (TinhtrangThietBi === CONFIG_ENUM.TINHTRANG_THIETBI.BINH_THUONG) {
            shDSThietBi.getRange(thietbiIndex + 1, CONFIG_COLUMNS.DSThietBi.tinhtrang + 1).setValue(CONFIG_ENUM.TINHTRANG_THIETBI.HONG);
            return { 
                status: true, 
                message: "Thiết bị đã được đánh dấu là hỏng",
                indexDevice: thietbiIndex
            };
        } else {
            return { 
                status: false, 
                message: "Thiết bị không trong tình trạng bình thường" 
            };
        }
    } catch (error) {
        console.log("[CheckTrangThaiThietBi] - Lỗi khi kiểm tra trạng thái thiết bị:", error);
        return { status: false, message: "Lỗi khi kiểm tra trạng thái thiết bị: " + error.message };
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
function AddNewRepairtoSheet(params, objFileUrl, shDataSC, val_DataSC) {
    try {
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
    const message = 
    `🔔 - BÁO HỎNG THIẾT BỊ MỚI - 🔔
    ━━━━━━━━━━━━━━━━━━━━━━━━
    🆔 - ID: ${params.repairID}
    🏥 - Đơn vị báo hỏng: ${params.nameuserdv}
    🔧 - Thiết bị: ${params.nameThietbi}
    📋 - Model thiết bị: ${params.nameModel}
    🔢 - Serial thiết bị: ${params.nameSerial}
    ⚠️ - Tình trạng thiết bị: ${params.nameTinhTrang}
    ⏱️ - Mức độ ưu tiên: ${params.nameMucDo}
    👤 - Người yêu cầu: ${params.nameNguoiYeuCau} (sđt:${formatPhoneNumber(params.nameSDTYeuCau)})
    👨‍🔧 - Người phụ trách sửa: ${params.nameNguoiSua} (sđt:${formatPhoneNumber(params.nameSDTNguoiSua)})`;

    sendTelegramMessage(TELEGRAM_CONFIG.group_chat_id_Tele, message);
    if (params.idTeleNguoiSua) {
        sendTelegramMessage(params.idTeleNguoiSua, message);
    }
}

// sendTelegramMessage
function sendTelegramMessage(chatId, message) {
  if (!chatId || !message) return null;

  const apiUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.api_token_Tele}/sendMessage`;

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: chatId,
      text: message,
    })
  };

  try {
    const response = UrlFetchApp.fetch(apiUrl, options);
    return JSON.parse(response.getContentText());
  } catch (error) {
    console.log('[sendTelegramMessage] Error:', error.message);
    return null;
  }
}

// Định dạng số điện thoại kiểu 038.994.3573
    function formatPhoneNumber(phone) {
        // Chỉ lấy số, loại bỏ ký tự không phải số
        const digits = phone.replace(/\D/g, "");
        return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,digits.length)}`;
    }