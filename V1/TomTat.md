# Tóm tắt Hệ thống Quản lý Sửa chữa Thiết bị

## 1. Cấu trúc Thư mục và File

### 0. Hotro.gs
- Chứa các hàm tiện ích hỗ trợ cho toàn bộ hệ thống
- Các chức năng chính:
  - Lọc dữ liệu từ mảng
  - Định dạng tiền tệ
  - Xử lý ngày tháng
  - Quản lý file và thư mục
  - Sao chép và di chuyển sheet

### 1. config.gs
- Chứa các cấu hình và hằng số cho hệ thống
- Định nghĩa:
  - ID của các file dữ liệu
  - Tên các sheet
  - Cấu trúc cột dữ liệu cho từng sheet
  - Các hàm lấy dữ liệu và cập nhật mật khẩu

### 2. Conver to Word.gs
- Xử lý việc tạo và xuất các file Word từ template
- Các chức năng chính:
  - Tạo biên bản báo hỏng (BM09_01)
  - Tạo biên bản khảo sát (BM09_02)
  - Tạo biên bản sửa chữa (BM09_03)
  - Tạo biên bản bàn giao (BM09_04)

### 3. DATASC.gs
- Quản lý dữ liệu sửa chữa
- Các chức năng chính:
  - Thêm báo hỏng mới
  - Cập nhật trạng thái sửa chữa
  - Xóa báo hỏng
  - Lấy thông tin báo hỏng theo ID
  - Cập nhật thông tin đang sửa

### 4. TELE.gs
- Xử lý tích hợp với Telegram
- Các chức năng chính:
  - Gửi thông báo đến người dùng
  - Gửi thông báo đến nhóm
  - Lấy thông tin chat ID
  - Quản lý danh sách người dùng Telegram

## 2. Luồng Xử lý Chính

1. **Báo hỏng thiết bị**:
   - Người dùng báo hỏng thiết bị
   - Hệ thống tạo ID báo hỏng mới
   - Tạo biên bản báo hỏng (BM09_01)
   - Gửi thông báo qua Telegram

2. **Khảo sát và Sửa chữa**:
   - Cập nhật trạng thái sửa chữa
   - Tạo biên bản khảo sát (BM09_02)
   - Tạo biên bản sửa chữa (BM09_03)
   - Cập nhật thông tin thiết bị

3. **Bàn giao**:
   - Tạo biên bản bàn giao (BM09_04)
   - Cập nhật trạng thái thiết bị
   - Gửi thông báo hoàn thành

## 3. Cấu trúc Dữ liệu

### Sheet DataSC
- Lưu trữ thông tin sửa chữa
- Các trường chính: ID, trạng thái, mức độ, thông tin thiết bị, ngày tháng, ghi chú

### Sheet DSUserDV
- Quản lý thông tin đơn vị yêu cầu
- Các trường chính: ID, thông tin đơn vị, người đại diện, chức vụ

### Sheet DSUserSua
- Quản lý thông tin người sửa chữa
- Các trường chính: ID, thông tin cá nhân, đơn vị, liên hệ

### Sheet DSThietBi
- Quản lý thông tin thiết bị
- Các trường chính: ID, thông tin kỹ thuật, tình trạng, vị trí

## 4. Tích hợp và Thông báo

- Sử dụng Telegram Bot để gửi thông báo
- Tự động tạo và cập nhật các biên bản Word
- Quản lý người dùng và quyền truy cập
- Theo dõi lịch sử thay đổi
