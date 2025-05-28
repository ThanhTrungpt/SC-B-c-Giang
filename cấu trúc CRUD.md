** Chuyển các hàm sau:
// - updateRepairPersonPhone()
// - updateEquipmentList()
// - updateEquipmentDetails()
// - handleAddRepair()
// - showAddRepairModal()
// - editRepair()
// - viewRepair()
// - deleteRepair()
// - saveRepair()
// - generateRepairID()
// - populateDropdowns()
// - arr_MainSC_prepare()
// - textTelegram_prepare()
// - updateRepairTables() and related table update functions
vào RepairModalManager 
-----
# Cấu Trúc Modal CRUD (Create, Read, Edit, Delete)

## 1. Tổng Quan
Modal được thiết kế để xử lý 3 chức năng chính:
- Thêm mới báo hỏng (Create)
- Xem chi tiết báo hỏng (Read)
- Chỉnh sửa báo hỏng (Edit)

## 2. Quản Lý Trạng Thái (State Management)

### 2.1. Các Trạng Thái Cơ Bản
- isOpen: Trạng thái mở/đóng của modal
- mode: Chế độ hoạt động (ADD/EDIT/VIEW)
- formData: Dữ liệu form hiện tại
- originalData: Dữ liệu gốc (dùng cho EDIT/VIEW)

### 2.2. Các Mode Hoạt Động
- ADD (1): Thêm mới báo hỏng
- EDIT (2): Chỉnh sửa báo hỏng
- VIEW (3): Xem chi tiết báo hỏng

## 3. Luồng Hoạt Động

### 3.1. Khởi Tạo Modal
1. Đăng ký các event listeners
   - Sự kiện đóng modal (hidden.bs.modal)
   - Sự kiện mở modal (shown.bs.modal)
   - Sự kiện submit form
   - Sự kiện thay đổi các trường input

2. Khởi tạo các thành phần UI
   - Dropdown người sửa
   - Dropdown nhóm thiết bị
   - Dropdown mã thiết bị
   - Các trường input khác

### 3.2. Mở Modal
1. Cấu hình theo mode
   
   a. Mode ADD:
   - Tiêu đề: "Thêm Báo Hỏng"
   - Hiển thị: Nút "Lưu"
   - Trạng thái fields: Theo Add_EnDiable_Add
   - Dữ liệu: Khởi tạo mới

   b. Mode EDIT:
   - Tiêu đề: "Chỉnh Sửa Báo Hỏng"
   - Hiển thị: Nút "Cập Nhật"
   - Trạng thái fields: Theo Add_EnDiable_Edit
   - Dữ liệu: Load từ server

   c. Mode VIEW:
   - Tiêu đề: "Chi Tiết Báo Hỏng"
   - Ẩn: Nút thao tác
   - Trạng thái fields: Theo View_EnDiable_Add
   - Dữ liệu: Load từ server, chỉ đọc

2. Hiển thị modal
   - Sử dụng Bootstrap Modal API
   - Xử lý animation và hiệu ứng

## 4. Xử Lý Dữ Liệu

### 4.1. Thu Thập Dữ Liệu
1. Dữ liệu người yêu cầu
   - ID người dùng
   - Tên người yêu cầu
   - Số điện thoại
   - Đơn vị

2. Dữ liệu thiết bị
   - Nhóm thiết bị
   - Mã thiết bị
   - Thông tin chi tiết thiết bị

3. Dữ liệu sửa chữa
   - Người sửa
   - Tình trạng
   - Mức độ ưu tiên
   - Ghi chú

### 4.2. Validate Dữ Liệu
1. Kiểm tra bắt buộc
   - Người yêu cầu
   - Thiết bị
   - Tình trạng
   - Mức độ

2. Kiểm tra hợp lệ
   - Định dạng số điện thoại
   - Độ dài các trường
   - Giá trị hợp lệ

### 4.3. Format Dữ Liệu
1. Chuẩn bị dữ liệu cho Main_SC
   - Định dạng ngày giờ
   - Mã hóa trạng thái
   - Chuẩn hóa dữ liệu

2. Chuẩn bị text Telegram
   - Format tin nhắn
   - Thêm emoji
   - Cấu trúc thông báo

## 5. Xử Lý Lưu Dữ Liệu

### 5.1. Quy Trình Lưu
1. Thu thập dữ liệu form
2. Validate dữ liệu
3. Hiển thị loading
4. Gọi API tương ứng
5. Xử lý kết quả
6. Cập nhật UI

### 5.2. Xử Lý Lỗi
1. Lỗi validate
   - Hiển thị thông báo
   - Focus vào trường lỗi

2. Lỗi API
   - Retry logic
   - Thông báo người dùng
   - Log lỗi

3. Lỗi hệ thống
   - Fallback logic
   - Báo cáo lỗi

## 6. Cập Nhật UI

### 6.1. Sau Khi Lưu
1. Đóng modal
2. Refresh dữ liệu
3. Cập nhật bảng
4. Hiển thị thông báo
-------------
1. Cấu trúc dạng RepairModalManager, tham khảo
const RepairModalManager = {
    // Quản lý trạng thái của modal
    state: {
        isOpen: false,      // Trạng thái mở/đóng modal
        mode: null,         // Chế độ hoạt động (ADD/EDIT/VIEW)
        formData: null,     // Dữ liệu form hiện tại
        originalData: null  // Dữ liệu gốc (dùng cho EDIT/VIEW)
    },
    // Định nghĩa các mode
    MODE: {
        ADD: 1,
        EDIT: 2,
        VIEW: 3
    }
};
2. Luồng hoạt động chính:
// A. Khởi tạo
initialize() {
    // 1. Lắng nghe sự kiện đóng modal
    modalElement.addEventListener('hidden.bs.modal', () => {
        this.handleModalHidden();  // Reset state khi đóng
    });
    // 2. Lắng nghe sự kiện mở modal
    modalElement.addEventListener('shown.bs.modal', () => {
        this.handleModalShown();   // Set focus và state khi mở
    });
}
// B. Mở modal với mode tương ứng
open(mode, repairId = null) {
    // 1. Set mode
    this.state.mode = mode;
    // 2. Cấu hình UI theo mode
    switch (mode) {
        case this.MODE.ADD:    // Thêm mới
            // - Set tiêu đề "Thêm báo hỏng mới"
            // - Hiện nút "Lưu"
            // - Tạo ID mới: generateRepairID()
            // - Điền dữ liệu mặc định cho thêm mới
            // - Disable và enable fields theo hàm Add_EnDiable_Add
            break;
        case this.MODE.EDIT:   // Chỉnh sửa
            // - Set tiêu đề "Chỉnh sửa báo hỏng"
            // - Hiện nút "Cập nhật"
            // - Load và điền dữ liệu
            // - Disable và enable fields theo hàm Add_EnDiable_Edit
            break;
        case this.MODE.VIEW:   // Xem
            // - Set tiêu đề "Chi tiết báo hỏng"
            // - Ẩn nút lưu
            // - Load dữ liệu và điền dữ liệu
            // - Disable và enable fields theo hàm View_EnDiable_Add
            break;
    }
    // 3. Hiển thị modal
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}
3. Hỗ trợ hiển thị
 - function generateRepairID() (chuyển từ ngoài vào đây)
 - function updateRepairPersonPhone() (chuyển từ ngoài vào đây)
 - function updateEquipmentList() (chuyển từ ngoài vào đây)
 - function updateEquipmentDetails() (chuyển từ ngoài vào đây)
		 
4. Xử lý dữ liệu:
// A. Lấy dữ liệu báo hỏng
getRepairData(repairId) {
    return new Promise((resolve, reject) => {
        // 1. Tìm trong appData.val_DataSC
        const repair = appData.val_DataSC.find(item => 
            item[CONFIG_COLUMNS.DataSC.id] === repairId
        );
        
        // 2. Format và trả về dữ liệu
        if (repair) {
            resolve(this.formatRepairData(repair));
        } else {
            reject(new Error("Không tìm thấy dữ liệu"));
        }
    });
}

// Thu thâp dữ liệu từ Element
collectFormData

//Hàm chuẩn bị dữ liệu cho mảng Main_SC
function arr_MainSC_prepare(repairDataForm)

//Hàm chuẩn bị dữ liệu cho text Telegram
function textTelegram_prepare(repairDataForm)

5. Xử lý lưu dữ liệu:
function saveRepair() {
    try {
        // 1. Thu thập dữ liệu form
        const formData = RepairModalManager.collectFormData();
        
        // 2. Validate
        if (!validateRepairData(formData)) {
            return;
        }
        // 3. Show loading
        showLoading();
        // 4. Xử lý theo mode
        switch (RepairModalManager.state.mode) {
            case RepairModalManager.MODE.ADD:
                // Add new repair
				google.script.run
				  .withSuccessHandler(handleAddRepair)
				  .withFailureHandler(handleScriptError)
				  .SC_thembaohong(repairData);
                break;
            case RepairModalManager.MODE.EDIT:
               // Tương tự
        }
    } catch (error) {
        showError("Lỗi khi lưu dữ liệu: " + error.message);
    }
}
