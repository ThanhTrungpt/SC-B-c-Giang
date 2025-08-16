// Test switchStateRepair_Device
function testswitchStateRepair_Device() {
const params = {
    history: "* 19:11:30 16/8/2025 - Phạm Thành Test: Chuyển trạng thái sửa chữa từ 01 Đề nghị sửa chữa sang 02 Khảo sát tình trạng thiết bị hỏng",
    idDevice: "TB002",
    idTeleNguoiSua: 5468165152,
    idUserSua: "USC001",
    indexDevice: "2",
    indexRepair: "15",
    indexUserSua: "1",
    nameModel: "TE-SS700",
    nameMucDo: "Gấp",
    nameNguoiSua: "Phạm Thành Test",
    nameNguoiYeuCau: "Phạm Thành Trung",
    nameSDTNguoiSua: "038 994 3573",
    nameSDTYeuCau: 123456790,
    nameSerial: 1810010845,
    nameThietbi: "Bơm tiêm điện",
    nameTinhTrang: "Em011",
    nameuserdv: "Phạm Thành Trung",
    repairID: "SC.DVCTM.250810.040.022",
    stateDevice_New: "Em013",
    stateRepair_New: "Em002",
    stateRepair_Old: "Em001",
    timeupdate: new Date("2025-08-16T19:11:30+07:00")
    };

  const result = switchStateRepair_Device(params);
//   SendtoTelegram(params);
  console.log("Test switchStateRepair_Device:", result);
}

// API/switchStateRepair_Device
function switchStateRepair_Device(params) {
    try {
        const ssMainData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DataSC);
        const shDSThietBi = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DSThietBi);
        const val_DSThietBi = shDSThietBi.getDataRange().getValues();
        const shDataSC = ssMainData.getSheetByName(CONFIG_SHEET_NAMES.DataSC);
        const val_DataSC = shDataSC.getDataRange().getValues();

        // Kiểm tra trạng thái Repair
        const indexRepair = Number(params.indexRepair);
        const rowRepair = val_DataSC[indexRepair];
        console.log("[switchStateRepair_Device] - indexRepair:", indexRepair, "rowRepair:", rowRepair);
        // kiểm tra repairID
        if (params.repairID !== rowRepair[CONFIG_COLUMNS.DataSC.id]) {
            console.log("[switchStateRepair_Device] - Lỗi: ID đề nghị sửa chữa không khớp với indexRepair");
            return { status: "error", message: "ID đề nghị sửa chữa không khớp với indexRepair"};
        }
        // Kiểm tra trang thai đề nghị
        if (rowRepair[CONFIG_COLUMNS.DataSC.trangthai] !== params.stateRepair_Old) {
            console.log("[switchStateRepair_Device] - Lỗi: Trạng thái Repair không khớp");
            return { status: "error", message: "Trạng thái Repair không khớp" };
        }
        // Cập nhật trang thai
        rowRepair[CONFIG_COLUMNS.DataSC.trangthai] = params.stateRepair_New;
        
        // Cập nhật lịch sử
        rowRepair[CONFIG_COLUMNS.DataSC.history] += "\n" + params.history;

        // Time Update
        rowRepair[CONFIG_COLUMNS.DataSC.timeupdate] = params.timeupdate;

        // Cập nhật lại dòng sửa chữa vào sheet
        shDataSC.getRange(indexRepair + 1, 1, 1, rowRepair.length).setValues([rowRepair]);
        console.log("[switchStateRepair_Device] - Cập nhật dòng sửa chữa:", rowRepair);

        const indexDevice = Number(params.indexDevice);
        const rowDevice = val_DSThietBi[indexDevice];
        console.log("[switchStateRepair_Device] - indexDevice:", indexDevice, "rowDevice:", rowDevice);
        rowDevice[CONFIG_COLUMNS.DSThietBi.tinhtrang] = params.stateDevice_New;
        shDSThietBi.getRange(indexDevice + 1, 1, 1, rowDevice.length).setValues([rowDevice]);
        console.log("[switchStateRepair_Device] - Cập nhật trạng thái thiết bị:", rowDevice);

        // Nhắn tin trên Telegram - Nhoms
        SendtoTelegram(params, TELEGRAM_CONFIG.group_chat_id_Tele, "CẬP NHẬT TRẠNG THÁI SỬA CHỮA");
        // Nhắn tin trên Telegram - Người sửa
        if (params.idTeleNguoiSua) {
            SendtoTelegram(params, params.idTeleNguoiSua, "CẬP NHẬT TRẠNG THÁI SỬA CHỮA");
        }

        return {
            status: "success",
            message: "Cập nhật trạng thái sửa chữa thành công",
            indexRepair: indexRepair,
            rowRepair: rowRepair,
            indexDevice: indexDevice,
            rowDevice: rowDevice
        };
    } catch (error) {
        console.error("[switchStateRepair_Device] - Lỗi khi cập nhật trạng thái sửa chữa:", error);
        return { status: "error", message: "Lỗi khi cập nhật trạng thái sửa chữa: " + error.message };
    }
}