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
    mrDecisionDate: "2025-11-10",
    mrDecisionNumber: "Số quyết định",
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
function updateRepairDn02   (params) {
    try {
        // Kiểm tra các tham số bắt buộc
        if (!params.dvDaiDienChucVu1 || !params.dvDaiDienName1 || !params.history || !params.idDevice || !params.idTeleNguoiSua) {
        return { status: "error", message: "Thiếu thông tin bắt buộc" };
        }
    
        // Thực hiện cập nhật dữ liệu
        const result = updateRepairDn02(params);
        
        // Gửi thông báo đến Telegram
        SendtoTelegram(params, params.idTeleNguoiSua, "Cập nhật thông tin và tạo biên bản khảo sát tình trạng trang thiết bị hỏng");
    
        return { status: "success", message: "Cập nhật thành công", data: result };
    } catch (error) {
        return { status: "error", message: error.message };
    }
    }