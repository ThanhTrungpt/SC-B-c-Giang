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

function testUpdateRepairDn01() {
const params = {
    ghichu: "ádfsd",
    history: "* 11:26:58 10/8/2025 - Phạm Thành Trung: Cập nhật thông tin đề nghị báo hỏng\n   - Ghi chú: ádfsd",
    hotenYeucau: "Phạm Thành Trung",
    idDeviceNew: "TB001",
    idDeviceOld: "TB001",
    idTeleNguoiSua: 5468165152,
    iduserdv: "UDV001",
    idusersua: "USC001",
    indexRepair: "1",
    indexDeviceOld: "1",
    mucdo: "Em020",
    nameHangSX: "Terumo",
    nameModel: "TE-SS700",
    nameMucDo: "Gấp",
    nameNamSD: "28/12/2018",
    nameNamSX: "2018",
    nameNguoiSua: "Phạm Thành Test",
    nameNguoiYeuCau: "Phạm Thành Trung",
    nameNuocSX: "2018",
    nameSDTNguoiSua: "038 994 3573",
    nameSDTYeuCau: "123456790",
    nameSerial: "1810010532",
    nameThietbi: "Bơm tiêm điện",
    nameTinhTrang: "Thiết bị không chạy",
    nameuserdv: "Đơn Vị Can Thiệp Mạch",
    ngaydonvibao: "11:26:58 10/8/2025",
    repairID: "SC.DVCTM.250519.021",
    sdtYeucau: "123456790",
    timeupdate: "11:26:58 10/8/2025",
    tinhtrangtbdvbao: "Thiết bị không chạy",
    trangthai: "Em001"
}

const result = updateRepairDn01(params);
  console.log("Test Update Repair:", result);
}

// Test deleteRepair
function testDeleteRepair() {
    const params = {
        indexRepair: "1",
        repairID: "SC.DVCTM.250519.021",
        indexDevice: "1",
        history: "* 18:27:38 10/8/2025 - Đơn Vị Can Thiệp Mạch: Xóa báo hỏng\n",
        timeupdate: "18:27:38 10/8/2025",
        idDevice: "TB001",
        idTeleNguoiSua: 5468165152,
        nameThietbi: "Bơm tiêm điện",
        nameModel: "TE-SS700",
        nameSerial: "1810010532",
        nameMucDo: "Rất gấp",
        nameTinhTrang: "Em010",
        nameuserdv: "Đơn Vị Can Thiệp Mạch",
        nameNguoiSua: "Phạm Thành Test",
        nameNguoiYeuCau: "Phạm Thành test",
        phoneNguoiSua: "038 994 3573",
        phoneNguoiYeuCau: "123456790"
    };

    const result = deleteRepair(params);
    console.log("Test Delete Repair:", result);
}

// API/deleteRepair
function deleteRepair(params) {
    try {
        const ssMainData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DataSC);
        const shDSThietBi = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DSThietBi);
        const val_DSThietBi = shDSThietBi.getDataRange().getValues();
        const shDataSC = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
        const val_DataSC = shDataSC.getDataRange().getValues();

        // Kiểm tra trạng thái Repair
        const indexRepair = Number(params.indexRepair);
        const rowRepair = val_DataSC[indexRepair];
        console.log("[deleteRepair] - indexRepair:", indexRepair, "rowRepair:", rowRepair);
        // kiểm tra repairID
        if (params.repairID !== rowRepair[CONFIG_COLUMNS.DataSC.id]) {
            console.log("[deleteRepair] - Lỗi: ID đề nghị sửa chữa không khớp với indexRepair");
            return { status: "error", message: "ID đề nghị sửa chữa không khớp với indexRepair"};
        }
        // Kiểm tra trang thai đề nghị
        if (rowRepair[CONFIG_COLUMNS.DataSC.trangthai] !== CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA) {
            console.log("[deleteRepair] - Lỗi: Đề nghị sửa chữa không ở trạng thái đã xóa");
            return { status: "error", message: "Đề nghị sửa chữa không ở trạng thái đề nghị sửa" };
        }
        // Cập nhật trang thai
        rowRepair[CONFIG_COLUMNS.DataSC.trangthai] = CONFIG_ENUM.TRANGTHAI.XOA;
        
        // Cập nhật lịch sử
        rowRepair[CONFIG_COLUMNS.DataSC.history] += "\n" + params.history;

        // Time Update
        rowRepair[CONFIG_COLUMNS.DataSC.timeupdate] = params.timeupdate;

        // Cập nhật lại dòng sửa chữa vào sheet
        shDataSC.getRange(indexRepair + 1, 1, 1, rowRepair.length).setValues([rowRepair]);
        console.log("[deleteRepair] - Cập nhật dòng sửa chữa:", rowRepair);

        const indexDevice = Number(params.indexDevice);
        const rowDevice = val_DSThietBi[indexDevice];
        console.log("[deleteRepair] - indexDevice:", indexDevice, "rowDevice:", rowDevice);
        rowDevice[CONFIG_COLUMNS.DSThietBi.tinhtrang] = CONFIG_ENUM.TINHTRANG_THIETBI.BINH_THUONG;
        shDSThietBi.getRange(indexDevice + 1, 1, 1, rowDevice.length).setValues([rowDevice]);
        console.log("[deleteRepair] - Cập nhật trạng thái thiết bị:", rowDevice);

        // Nhắn tin trên Telegram - Nhoms
        SendtoTelegram(params, TELEGRAM_CONFIG.group_chat_id_Tele, "XÓA ĐỀ NGHỊ SỬA CHỮA");
        // Nhắn tin trên Telegram - Người sửa
        if (params.idTeleNguoiSua) {
            SendtoTelegram(params, params.idTeleNguoiSua, "XÓA ĐỀ NGHỊ SỬA CHỮA");
        }

        return { 
            status: "success", 
            message: "Xóa đề nghị sửa chữa thành công",
            indexRepair: indexRepair,
            rowRepair: rowRepair,
            indexDevice: indexDevice,
            rowDevice: rowDevice
        };
    } catch (error) {
        console.error("[deleteRepair] - Lỗi khi xóa đề nghị sửa chữa:", error);
        return { status: "error", message: "Lỗi khi xóa đề nghị sửa chữa: " + error.message };
    }
}

// API/addNewRepair
function addNewRepair(params) {
    try {
        const ssMainData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DataSC);
        const shDSThietBi = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DSThietBi);
        const val_DSThietBi = shDSThietBi.getDataRange().getValues();
        const shDataSC = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
        const val_DataSC = shDataSC.getDataRange().getValues();
        // Kiểm tra trạng thái thiết bị 
        const objCheckStatusDevice = CheckStatusDeviceAdd(params, shDSThietBi, val_DSThietBi);
        if (!objCheckStatusDevice.status) {
            return { status: "error", message: "Lỗi dữ liệu trong danh sách thiết bị" };
        }
        // Tạo biên bản đề nghị sửa chữa
        objFileUrl = createfile_bm0901(params);

        // Thêm mới đề nghị sửa chữa vào sheet
        objNewRow = AddNewRepairtoSheet(params, objFileUrl, shDataSC, val_DataSC);

        // Nhắn tin trên Telegram - Nhoms
        SendtoTelegram(params, TELEGRAM_CONFIG.group_chat_id_Tele, "BÁO HỎNG THIẾT BỊ MỚI");
        // Nhắn tin trên Telegram - Người sửa
        if (params.idTeleNguoiSua) {
            SendtoTelegram(params, params.idTeleNguoiSua, "BÁO HỎNG THIẾT BỊ MỚI");
        }
    return {
        status: "success",
        message: "New repair added successfully",
        dataRowNewRepair: objNewRow.rowNewRepair,
        indexDevice: objCheckStatusDevice.indexDevice,
        dataRowDevice: objCheckStatusDevice.rowDevice,
    };
    } catch (error) {
        console.error("[addNewRepair] - Lỗi khi thêm mới đề nghị sửa chữa:", error);
        return { status: "error", message: "Lỗi khi thêm mới đề nghị sửa chữa: " + error.message };
        }
}

// API/updateRepairDn01
function updateRepairDn01(params) {
    try {
        const ssMainData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DataSC);
        const shDSThietBi = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DSThietBi);
        const val_DSThietBi = shDSThietBi.getDataRange().getValues();
        const shDataSC = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
        const val_DataSC = shDataSC.getDataRange().getValues();
        // Kiểm tra trạng thái thiết bị
        const objUpdateTrangThaiThietBi01 = UpdateTrangThaiThietBi01(params, shDSThietBi, val_DSThietBi);
        if (!objUpdateTrangThaiThietBi01.status) {
            return { status: "error", message: "Thiết bị cần sửa bị lỗi, đề nghị cập nhật dữ liệu" };
        }
        // Xóa và update biên bản đề nghị sửa chữa
        const rowRepair = val_DataSC[params.indexRepair];
        console.log("[updateRepairDn01] - rowRepair:", rowRepair);
        objFileUrl = createfile_bm0901(params, rowRepair);

        // Update đề nghị sửa chữa vào sheet
        const objUpdateRepairtoSheet01 = UpdateRepairtoSheet01(params, objFileUrl, shDataSC, val_DataSC);

        // Nhắn tin trên Telegram - Nguoi sua
        if (params.idTeleNguoiSua) {
            SendtoTelegram(params, params.idTeleNguoiSua, "CẬP NHẬT ĐỀ NGHỊ SỬA CHỮA");
        }
    return {
        status: "success",
        message: "Update repair successfully",
        indexRepair: objUpdateRepairtoSheet01.indexRepair,
        rowRepair: objUpdateRepairtoSheet01.rowRepair,
        indexDeviceOld: objUpdateTrangThaiThietBi01.indexDeviceOld,
        rowDeviceOld: objUpdateTrangThaiThietBi01.rowDeviceOld,
        indexDeviceNew: objUpdateTrangThaiThietBi01.indexDeviceNew,
        rowDeviceNew: objUpdateTrangThaiThietBi01.rowDeviceNew
    };
    } catch (error) {
        console.error("[addNewRepair] - Lỗi khi thêm mới đề nghị sửa chữa:", error);
        return { status: "error", message: "Lỗi khi thêm mới đề nghị sửa chữa: " + error.message };
        }
}

//UpdateTrangThaiThietBi
function UpdateTrangThaiThietBi01(params, shDSThietBi, val_DSThietBi) {
    try {
        let idDeviceOld = params.idDeviceOld;
        let indexDeviceOld = params.indexDeviceOld;
        let idDeviceNew = params.idDeviceNew;
        // TH1 Nếu thiết bị không thay đổi
        if (idDeviceOld === idDeviceNew) {
            console.log("[UpdateTrangThaiThietBi] - Thiết bị không thay đổi, không cần cập nhật trạng thái");
            return {
                status: true,
                message: "Thiết bị không thay đổi",
                indexDeviceOld: 0,
                rowDeviceOld: 0,
                indexDeviceNew: 0,
                rowDeviceNew: 0
            };
        } else { // TH2 Thiết bị thay đổi
            console.log("[UpdateTrangThaiThietBi] - Thiết bị thay đổi, cập nhật trạng thái");
            // Lấy dữ liệu thiết bị cũ và thay đổi
            const rowDeviceOld = val_DSThietBi[indexDeviceOld];
            //Kiểm tra iđeviceOld xem có đúng không
            if (rowDeviceOld[CONFIG_COLUMNS.DSThietBi.id] !== idDeviceOld) {
                console.log("[UpdateTrangThaiThietBi] - Thiết bị cũ không tồn tại, không thể cập nhật trạng thái");
                return { status: false, message: "Thiết bị cũ không tồn tại" };
            }
            console.log("[UpdateTrangThaiThietBi] - Thiết bị cũ tồn tại, cập nhật trạng thái");
            // Cập nhật trạng thái thiết bị cũ thành bình thường
            rowDeviceOld[CONFIG_COLUMNS.DSThietBi.tinhtrang] = CONFIG_ENUM.TINHTRANG_THIETBI.BINH_THUONG;

            // Tìm dòng thiết bị mới, lấy dữ liệu và thay đổi
            const indexDeviceNew = val_DSThietBi.findIndex(row => row[CONFIG_COLUMNS.DSThietBi.id] === idDeviceNew);
            if (indexDeviceNew === -1) {
                console.log("[UpdateTrangThaiThietBi] - Thiết bị mới không tồn tại, không thể cập nhật trạng thái");
                return { status: false, message: "Thiết bị mới không tồn tại" };
            }

            // Cập nhật trạng thái thiết bị mới thành hỏng
            const rowDeviceNew = val_DSThietBi[indexDeviceNew];
            rowDeviceNew[CONFIG_COLUMNS.DSThietBi.tinhtrang] = CONFIG_ENUM.TINHTRANG_THIETBI.HONG;
            console.log(rowDeviceNew);
            console.log(rowDeviceOld);

            // Cập nhật vào Google Sheets
            shDSThietBi.getRange(indexDeviceOld + 1, 1, 1, rowDeviceOld.length).setValues([rowDeviceOld]);
            shDSThietBi.getRange(indexDeviceNew + 1, 1, 1, rowDeviceNew.length).setValues([rowDeviceNew]);
            console.log("[UpdateTrangThaiThietBi] - Cập nhật trạng thái thiết bị thành công");
        
            // Return lại dữ liệu thiết bị cũ và mới (index và data)
            // Tìm dòng của thiết bị mới idthietbiNew
            return { 
                status: true,
                message: "Thiết bị đã được đánh dấu là hỏng",
                indexDeviceOld: indexDeviceOld,
                rowDeviceOld: rowDeviceOld,
                indexDeviceNew: indexDeviceNew,
                rowDeviceNew: rowDeviceNew
            };
        }
    } catch (error) {
        console.log("[CheckTrangThaiThietBi] - Lỗi khi kiểm tra trạng thái thiết bị:", error);
        return { status: false, message: "Lỗi khi kiểm tra trạng thái thiết bị: " + error.message };
    }
}

//UpdateRepairtoSheet01
function UpdateRepairtoSheet01(params, objFileUrl, shDataSC, val_DataSC) {
    try {
    // Lấy dòng sửa chữa từ val_DataSC theo indexRepair
    const indexRepair = Number(params.indexRepair);
    const rowRepairUpdate = val_DataSC[indexRepair];
    console.log("[UpdateRepairtoSheet01] - indexRepair:", indexRepair, "rowRepairUpdate:", rowRepairUpdate);
    
    // Cập nhật các giá trị trong rowRepairUpdate
    rowRepairUpdate[CONFIG_COLUMNS.DataSC.mucdo] = params.mucdo;
    rowRepairUpdate[CONFIG_COLUMNS.DataSC.idusersua] = params.idusersua;
    rowRepairUpdate[CONFIG_COLUMNS.DataSC.idthietbi] = params.idDeviceNew;
    rowRepairUpdate[CONFIG_COLUMNS.DataSC.tinhtrangtbdvbao] = params.tinhtrangtbdvbao;
    rowRepairUpdate[CONFIG_COLUMNS.DataSC.ngaydonvibao] = params.ngaydonvibao;
    rowRepairUpdate[CONFIG_COLUMNS.DataSC.ghichu] = params.ghichu;
    rowRepairUpdate[CONFIG_COLUMNS.DataSC.hotenYeucau] = params.hotenYeucau;
    rowRepairUpdate[CONFIG_COLUMNS.DataSC.sdtYeucau] = params.sdtYeucau;
    rowRepairUpdate[CONFIG_COLUMNS.DataSC.qrcode] = params.qrcode;
    rowRepairUpdate[CONFIG_COLUMNS.DataSC.history] += "\n" + params.history;
    rowRepairUpdate[CONFIG_COLUMNS.DataSC.timeupdate] = params.timeupdate;
    rowRepairUpdate[CONFIG_COLUMNS.DataSC.Word_BB01] = objFileUrl.wordFileUrl;
    rowRepairUpdate[CONFIG_COLUMNS.DataSC.Pdf_BB01] = objFileUrl.pdfFileUrl;
    console.log("[UpdateRepairtoSheet01] - Cập nhật các giá trị trong rowRepairUpdate:", rowRepairUpdate);


    // Cập nhật giá trị tại vị trí indexRepair
    console.log("[UpdateRepairtoSheet01] - rowRepairUpdate:", rowRepairUpdate);
    // Ghi lại vào Google Sheets
    shDataSC.getRange(indexRepair + 1, 1, 1, rowRepairUpdate.length).setValues([rowRepairUpdate]);
    return { 
        status: "success", 
        message: "Dòng mới đã được thêm vào DataSC",
        indexRepair: params.indexRepair,
        rowRepair: rowRepairUpdate
    };

    } catch (error) {
        console.error("[AddNewRepairtoSheet] - Lỗi khi lấy dữ liệu từ DataSC:", error);
        return { status: "error", message: "Lỗi khi lấy dữ liệu từ DataSC: " + error.message };
    }
}
//CheckTrangThaiThietBi
function CheckStatusDeviceAdd(params, shDSThietBi, val_DSThietBi) {
    try {
        const indexDevice = val_DSThietBi.findIndex(row => row[CONFIG_COLUMNS.DSThietBi.id] === params.idthietbi);
        console.log("[CheckTrangThaiThietBi] - indexDevice:", indexDevice, "params.idthietbi:", params.idthietbi);
        if (indexDevice === -1) {
            console.log("[CheckTrangThaiThietBi] - Thiết bị không tồn tại");
        return { status: "error", message: "Thiết bị không tồn tại" };
        }
        const TinhtrangThietBi = val_DSThietBi[indexDevice][CONFIG_COLUMNS.DSThietBi.tinhtrang];
        console.log("[CheckTrangThaiThietBi] - Tình trạng thiết bị:", TinhtrangThietBi);
        // Kiểm tra tình trạng thiết bị
        if (TinhtrangThietBi === CONFIG_ENUM.TINHTRANG_THIETBI.BINH_THUONG) {
            // Row Device, lấy từ index val_DSThietBi
            console.log("[CheckTrangThaiThietBi] - Thiết bị đang bình thường, lấy từ index:", indexDevice);
            const rowDevice = val_DSThietBi[indexDevice];
            console.log("[CheckTrangThaiThietBi] - rowDevice:", rowDevice);
            // Cập nhật trạng thái thiết bị thành hỏng
            rowDevice[CONFIG_COLUMNS.DSThietBi.tinhtrang] = CONFIG_ENUM.TINHTRANG_THIETBI.HONG;
            // Ghi chú cập nhật
            rowDevice[CONFIG_COLUMNS.DSThietBi.ghichu] = params.ghichu;
            // History cập nhật
            rowDevice[CONFIG_COLUMNS.DSThietBi.history] += params.history + "\n";
            // Time cập nhật
            rowDevice[CONFIG_COLUMNS.DSThietBi.timeupdate] = params.timeupdate;
            console.log("[CheckTrangThaiThietBi] - Cập nhật rowDevice:", rowDevice);
            // Cập nhật trạng thái thiết bị thành hỏng - sử dụng rowDevice
            shDSThietBi.getRange(indexDevice + 1, 1, 1, rowDevice.length).setValues([rowDevice]);
            return {
                status: true, 
                message: "Thiết bị đã được đánh dấu thành công",
                indexDevice: indexDevice,
                rowDevice: rowDevice
            };
        } else {
            return {
                status: false, 
                message: "Dữ liệu thiết bị lỗi, thiết bị đang sửa", 
            };
        }
    } catch (error) {
        console.log("[CheckTrangThaiThietBi] - Lỗi khi kiểm tra trạng thái thiết bị:", error);
        return { status: false, message: "Lỗi khi kiểm tra trạng thái thiết bị: " + error.message };
    }
}

// createfile_bm0901
function createfile_bm0901(params, rowRepair = null) {
    try{
    // Get template document
    
    const templateFile = DriveApp.getFileById(CONFIG_TEMPLATES.IDFile_09_01);
    const FolderWord = DriveApp.getFolderById(CONFIG_TEMPLATES.IDFolder_Word_01);
    const newWordFile = templateFile.makeCopy(`BB01_${params.repairID}_${params.ngaydonvibao}`, FolderWord);
    const DocNewWordFile = DocumentApp.openById(newWordFile.getId());
    const bodyNewWordFile = DocNewWordFile.getBody();

    // Kiểm tra xem có dữ liệu rowRepair không
    if (rowRepair) { // Xóa file trong link
        console.log("[createfile_bm0901] - Có dữ liệu rowRepair, sử dụng rowRepair để tạo biên bản");
        // Xóa file cũ nếu có
        const oldWordFileUrl = rowRepair[CONFIG_COLUMNS.DataSC.Word_BB01];
        console.log("[createfile_bm0901] - oldWordFileUrl:", oldWordFileUrl);
        const oldPdfFileUrl = rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB01];
        console.log("[createfile_bm0901] - oldPdfFileUrl:", oldPdfFileUrl);
        if (oldWordFileUrl) {
            const oldWordFileId = oldWordFileUrl.match(/[-\w]{25,}/)[0];
            const oldWordFile = DriveApp.getFileById(oldWordFileId);
            oldWordFile.setTrashed(true);
            console.log("[createfile_bm0901] - Đã xóa file Word cũ:", oldWordFile.getName());
        }
        if (oldPdfFileUrl) {
            const oldPdfFileId = oldPdfFileUrl.match(/[-\w]{25,}/)[0];
            const oldPdfFile = DriveApp.getFileById(oldPdfFileId);
            oldPdfFile.setTrashed(true);
            console.log("[createfile_bm0901] - Đã xóa file PDF cũ:", oldPdfFile.getName());
        }
    }

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
    const rowNewRepair = [
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

    shDataSC.appendRow(rowNewRepair);
    return { 
        status: "success", 
        message: "Dòng mới đã được thêm vào DataSC",
        rowNewRepair: rowNewRepair
    };

    } catch (error) {
        console.error("[AddNewRepairtoSheet] - Lỗi khi lấy dữ liệu từ DataSC:", error);
        return { status: "error", message: "Lỗi khi lấy dữ liệu từ DataSC: " + error.message };
    }

}

// SendtoTelegram
function SendtoTelegram(params, idTelegram, strHeadMsg = "BÁO HỎNG THIẾT BỊ MỚI") {
    try {
        const message = 
    `🔔 - ${strHeadMsg} - 🔔
    ━━━━━━━━━━━━━━━━━━
    🆔 - ID: ${params.repairID}
    🏥 - Đơn vị báo hỏng: ${params.nameuserdv}
    🔧 - Thiết bị: ${params.nameThietbi}
    📋 - Model thiết bị: ${params.nameModel}
    🔢 - Serial thiết bị: ${params.nameSerial}
    ⚠️ - Tình trạng thiết bị: ${params.nameTinhTrang}
    ⏱️ - Mức độ ưu tiên: ${params.nameMucDo}
    👤 - Người yêu cầu: ${params.nameNguoiYeuCau} (Sđt: ${formatPhoneNumber(params.nameSDTYeuCau)})
    👨‍🔧 - Người phụ trách sửa: ${params.nameNguoiSua} (Sđt: ${formatPhoneNumber(params.nameSDTNguoiSua)})`;

    sendTelegramMessage(idTelegram, message);
    } catch (error) {
        console.error("[SendtoTelegram] - Lỗi khi gửi tin nhắn Telegram:", error);
        return { status: "error", message: "Lỗi khi gửi tin nhắn Telegram: " + error.message };
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
    try {
        if (!phone) return "";
        // Chỉ lấy các ký tự số
        const digits = phone.replace(/\D/g, '');
        // Chia thành các nhóm 3-3-4
        return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1.$2.$3');
    }
    catch (error) {
        console.error("[formatPhoneNumber] - Lỗi khi định dạng số điện thoại:", error);
        return phone; // Trả về số điện thoại gốc nếu có lỗi
    }
}