# Cấu trúc Giao diện Hệ thống Báo hỏng và Sửa chữa

## Tổng quan về giao diện

Hệ thống được thiết kế với 4 giao diện chính:
1. Giao diện Báo hỏng
2. Giao diện Sửa chữa
3. Giao diện Quản lý thiết bị
4. Giao diện Báo cáo

## Bố cục chung

- **Header**: Logo, tên hệ thống, thông tin người dùng, nút thông báo
- **Sidebar**: Menu điều hướng chính
- **Main Content**: Khu vực hiển thị nội dung chính
- **Footer**: Thông tin liên hệ, phiên bản hệ thống

## Các trường nhập dữ liệu chính

### Giao diện Báo hỏng
1. **Form Báo hỏng**:
   - Mã báo hỏng (tự động sinh)
   - Ngày báo hỏng (date picker)
   - Đơn vị yêu cầu (dropdown)
   - Người báo hỏng (dropdown)
   - Mã thiết bị (dropdown với tìm kiếm)
   - Mức độ ưu tiên (radio buttons: Khẩn cấp/Quan trọng/Bình thường)
   - Mô tả tình trạng (text area)
   - Ghi chú (text area)
   - Hình ảnh đính kèm (file upload)
   - Nút Gửi và Hủy

2. **Danh sách Báo hỏng**:
   - Thanh tìm kiếm (text input)
   - Bộ lọc nâng cao (dropdown)
   - Bảng dữ liệu với phân trang
   - Nút xuất báo cáo (Excel, PDF)

### Giao diện Sửa chữa
1. **Form Khảo sát**:
   - Mã báo hỏng (readonly)
   - Ngày khảo sát (date picker)
   - Người khảo sát (dropdown)
   - Tình trạng thiết bị (text area)
   - Nguyên nhân (text area)
   - Đề xuất phương án (radio buttons: Sửa chữa/Thay thế/Không xử lý)
   - Chi phí dự kiến (number input)
   - Thời gian dự kiến (number input + dropdown đơn vị)
   - Hình ảnh đính kèm (file upload)
   - Nút Lưu và Hủy

2. **Form Sửa chữa**:
   - Mã báo hỏng (readonly)
   - Ngày bắt đầu sửa (date picker)
   - Ngày hoàn thành (date picker)
   - Người sửa chữa (dropdown, multiple)
   - Phương án xử lý (text area)
   - Vật tư sử dụng (dynamic table)
   - Chi phí thực tế (number input)
   - Kết quả (text area)
   - Hình ảnh sau sửa chữa (file upload)
   - Nút Hoàn thành và Lưu tạm

3. **Form Bàn giao**:
   - Mã báo hỏng (readonly)
   - Ngày bàn giao (date picker)
   - Người bàn giao (dropdown)
   - Người nhận (dropdown)
   - Tình trạng thiết bị (text area)
   - Hướng dẫn sử dụng (text area)
   - Chữ ký điện tử (canvas input)
   - Nút Hoàn thành và Hủy

### Giao diện Quản lý thiết bị
1. **Form Thêm/Sửa thiết bị**:
   - Mã thiết bị (text input)
   - Tên thiết bị (text input)
   - Loại thiết bị (dropdown)
   - Model (text input)
   - Serial (text input)
   - Hãng sản xuất (dropdown)
   - Nước sản xuất (dropdown)
   - Năm sản xuất (number input)
   - Năm sử dụng (number input)
   - Đơn vị quản lý (dropdown)
   - Vị trí (text input)
   - Tình trạng (dropdown)
   - Thông số kỹ thuật (dynamic fields)
   - Hình ảnh thiết bị (file upload)
   - Nút Lưu và Hủy

--------------------------------------
## 1. Giao diện Báo hỏng

### 1.1 Form Báo hỏng
- **Thông tin cơ bản**:
  - Mã báo hỏng (tự động sinh)
  - Ngày báo hỏng (tự động)
  - Đơn vị yêu cầu (chọn từ danh sách)
  - Người báo hỏng (chọn từ danh sách)

- **Thông tin thiết bị**:
  - Mã thiết bị (chọn từ danh sách)
  - Tên thiết bị (hiển thị tự động)
  - Model (hiển thị tự động)
  - Serial (hiển thị tự động)
  - Hãng sản xuất (hiển thị tự động)
  - Nước sản xuất (hiển thị tự động)
  - Năm sản xuất (hiển thị tự động)
  - Năm sử dụng (hiển thị tự động)

- **Thông tin sự cố**:
  - Mức độ (chọn: Khẩn cấp/Quan trọng/Bình thường)
  - Tình trạng thiết bị (nhập mô tả)
  - Ghi chú (tùy chọn)

### 1.2 Danh sách Báo hỏng
- **Bộ lọc**:
  - Theo đơn vị
  - Theo trạng thái
  - Theo thời gian
  - Theo mức độ

- **Bảng hiển thị**:
  - Mã báo hỏng
  - Ngày báo
  - Đơn vị
  - Thiết bị
  - Tình trạng
  - Mức độ
  - Trạng thái xử lý
  - Người xử lý

## 2. Giao diện Sửa chữa

### 2.1 Form Khảo sát
- **Thông tin khảo sát**:
  - Ngày khảo sát
  - Người khảo sát (tự động)
  - Tình trạng thiết bị khi khảo sát
  - Kết luận khảo sát
  - Đề xuất phương án

- **Thông tin đề nghị**:
  - Ngày đề nghị
  - Nội dung đề nghị
  - Người đề nghị

### 2.2 Form Sửa chữa
- **Thông tin sửa chữa**:
  - Ngày bắt đầu sửa
  - Người sửa chữa
  - Phương án sửa chữa
  - Chi tiết công việc
  - Vật tư sử dụng
  - Ghi chú

### 2.3 Form Bàn giao
- **Thông tin bàn giao**:
  - Ngày bàn giao
  - Tình trạng thiết bị sau sửa
  - Người bàn giao
  - Người nhận bàn giao
  - Biên bản bàn giao

## 3. Giao diện Quản lý

### 3.1 Quản lý Thiết bị
- **Danh sách thiết bị**:
  - Mã thiết bị
  - Tên thiết bị
  - Model
  - Serial
  - Đơn vị sử dụng
  - Tình trạng
  - Lịch sử sửa chữa

- **Thêm/Sửa thiết bị**:
  - Thông tin cơ bản
  - Thông tin kỹ thuật
  - Thông tin bảo hành
  - Vị trí đặt

### 3.2 Quản lý Người dùng
- **Danh sách người dùng**:
  - Mã người dùng
  - Họ tên
  - Đơn vị
  - Vai trò
  - Trạng thái

- **Phân quyền**:
  - Quyền báo hỏng
  - Quyền sửa chữa
  - Quyền quản lý

## 4. Giao diện Báo cáo

### 4.1 Báo cáo Tổng hợp
- **Thống kê theo thời gian**:
  - Số lượng báo hỏng
  - Số lượng đã xử lý
  - Số lượng đang xử lý
  - Thời gian xử lý trung bình

- **Thống kê theo đơn vị**:
  - Số lượng thiết bị
  - Số lần báo hỏng
  - Tỷ lệ xử lý

### 4.2 Báo cáo Chi tiết
- **Báo cáo thiết bị**:
  - Lịch sử sửa chữa
  - Chi phí sửa chữa
  - Thời gian sửa chữa

- **Báo cáo người dùng**:
  - Số lượng xử lý
  - Hiệu suất xử lý
  - Đánh giá chất lượng

## 5. Thông báo và Cảnh báo

### 5.1 Thông báo Telegram
- **Thông báo báo hỏng**:
  - Mã báo hỏng
  - Thông tin thiết bị
  - Đơn vị báo
  - Mức độ

- **Thông báo xử lý**:
  - Cập nhật trạng thái
  - Thông báo hoàn thành
  - Thông báo bàn giao

### 5.2 Cảnh báo
- **Cảnh báo thời gian**:
  - Quá hạn xử lý
  - Sắp đến hạn
  - Cảnh báo bảo trì

- **Cảnh báo thiết bị**:
  - Tần suất hỏng cao
  - Thiết bị cũ
  - Vấn đề bảo hành
