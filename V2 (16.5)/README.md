# Phần mềm Quản lý Sửa chữa - Bệnh viện Đa khoa Bắc Giang

## Giới thiệu

Ứng dụng Web được xây dựng bằng Google Apps Script, sử dụng dữ liệu từ Google Sheet để quản lý việc báo hỏng và sửa chữa thiết bị trong bệnh viện. Hệ thống cho phép người dùng nhập và chỉnh sửa thông báo sửa chữa thông qua giao diện dạng Modal, hỗ trợ thao tác tìm kiếm, tạo, xem, cập nhật, xóa và tạo file báo cáo.

## Cấu trúc mã nguồn

### 1. Modules chính

- **Code.gs**: Điểm vào chính của ứng dụng, cung cấp hàm `doGet()` trả về giao diện HTML.
- **0_Hotro.gs**: Chứa các hàm tiện ích và hỗ trợ cho toàn bộ hệ thống.
- **1_config.gs**: Chứa các hằng số, cấu hình và hàm quản lý dữ liệu chung.
- **2_ConvertToWord.gs**: Xử lý việc tạo và xuất các biểu mẫu báo cáo từ template.
- **3_DataSC.gs**: Quản lý dữ liệu báo sửa, cung cấp các hàm CRUD cho báo sửa.
- **4_Telegram.gs**: Xử lý tích hợp với Telegram để gửi thông báo.
- **HTML_1BAOSUA.html**: Giao diện người dùng cho việc quản lý báo sửa thiết bị.

### 2. Luồng xử lý dữ liệu

1. Người dùng truy cập ứng dụng và đăng nhập với tài khoản đơn vị.
2. Dữ liệu từ các Google Sheet được tải để hiển thị các danh sách thiết bị, người sửa chữa, và báo sửa hiện có.
3. Người dùng có thể:
   - Thêm báo hỏng mới
   - Xem danh sách báo hỏng theo trạng thái
   - Chỉnh sửa thông tin báo hỏng
   - Xóa báo hỏng
   - Tạo và tải các biểu mẫu báo cáo

## Cấu hình và triển khai

### Yêu cầu hệ thống

- Tài khoản Google với quyền truy cập Google Drive, Sheets và Apps Script
- Các bảng dữ liệu đã thiết lập theo cấu trúc yêu cầu

### Các file dữ liệu

1. **File Danh sách SC Bắc Giang**: Chứa thông tin về người dùng, đơn vị, nhóm thiết bị, và thiết bị
   - ID: `1AcF4se3EMZftlAoZ-YCl4GOPww9yzsIuM8CgRoleoZ0`
   - Các sheet: DSUserSua, DSUserDV, DSNhomTB, DSThietBi, Enum Setting

2. **File Main Data SC Bắc Giang**: Chứa dữ liệu chính về các báo sửa
   - ID: `1LYBsUlDo42-DVIhbjsJ9aRTc-quVzSF1h_2BukeMikk`
   - Sheet: Main_SC

### Các biểu mẫu báo cáo

1. **BM.VTTB.09.01 Giấy đề nghị sửa chữa**
   - ID: `1jDqUToV79fyv3jNr_3j4HL64g_coxW3joVheIHdDWxg`

2. **BM.VTTB.09.02 Biên bản khảo sát tình trạng thiết bị hỏng**
   - ID: `1fGUPZNrEi2OeBsmzWqj0FWx9oZYO79z4c5c45o20pl0`

3. **BM.VTTB.09.03 Giấy đề nghị phương án sửa chữa**
   - ID: `1WCtJY6wA0-fBnurYf8beZyv4PAmWtGqAPZUwoJtUntM`

4. **BM.VTTB.09.04 Biên bản bàn giao, nghiệm thu, đưa vào sử dụng**
   - ID: `1mWJutc5TZ7EIf1Mq8Gj1ludhoRahOrHodZa5SU6Qi6k`

## Triển khai

1. Tạo mới một dự án Google Apps Script
2. Sao chép các file mã nguồn vào dự án
3. Cập nhật các ID của các file dữ liệu và template trong file `1_config.gs` nếu cần
4. Cấp quyền truy cập cần thiết cho ứng dụng
5. Triển khai ứng dụng dưới dạng Web App

## Ghi chú

- Mọi hành động đều được ghi log để dễ dàng gỡ lỗi
- Các biểu mẫu báo cáo được tạo tự động khi có thay đổi trạng thái
- Hệ thống gửi thông báo qua Telegram khi có báo hỏng mới

---

Copyright © 2025 Bệnh viện Đa khoa Bắc Giang 