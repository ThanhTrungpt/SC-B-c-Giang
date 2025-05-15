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

### HTML_1BAOSUA.html
- Giao diện người dùng cho đơn vị báo sửa thiết bị
- Các thành phần chính:
  - Giao diện đăng nhập
  - Form báo hỏng thiết bị
  - Quản lý danh sách thiết bị đã báo hỏng
  - Theo dõi trạng thái sửa chữa
  - Đổi mật khẩu người dùng

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

## 5. Giao diện HTML_1BAOSUA.html

### Thành phần giao diện
- **Màn hình nạp dữ liệu**: Hiển thị spinner khi đang tải dữ liệu từ server
- **Form đăng nhập**: Cho phép người dùng đăng nhập với tên đăng nhập và mật khẩu
- **Modal đổi mật khẩu**: Cho phép người dùng đổi mật khẩu
- **Dashboard**: Hiển thị sau khi đăng nhập thành công

### Phân cấp Dashboard
1. **Thông tin người yêu cầu**:
   - Tên đăng nhập (readonly)
   - Đơn vị (readonly)
   - Thông tin người yêu cầu
   - Số điện thoại liên hệ

2. **Thông tin người sửa**:
   - Dropdown chọn người sửa chữa
   - Hiển thị số điện thoại của người sửa chữa

3. **Thông tin thiết bị**:
   - Dropdown chọn nhóm thiết bị
   - Dropdown chọn mã thiết bị
   - Hiển thị thông tin chi tiết thiết bị (tên, model, serial, hãng sản xuất, năm sản xuất, năm sử dụng, hạn bảo hành, vị trí đặt)

4. **Thông tin tình trạng**:
   - Mô tả tình trạng hỏng
   - Dropdown chọn mức độ ưu tiên (Thường, Gấp, Rất gấp)
   - Ghi chú bổ sung

5. **Lịch sử báo sửa**:
   - Hiển thị danh sách thiết bị đã báo hỏng theo 4 tab:
     - Báo hỏng: Các thiết bị mới báo hỏng
     - Đang sửa: Các thiết bị đang trong quá trình sửa chữa
     - Bảo hành: Các thiết bị đang bảo hành
     - Sửa ngoài: Các thiết bị đang sửa chữa bên ngoài
   - Mỗi tab có bảng hiển thị STT, Nội dung và các nút Hành động

### Chức năng chính
1. **Đăng nhập/Đổi mật khẩu**:
   - Đăng nhập bằng username/password
   - Đổi mật khẩu thông qua modal form

2. **Quản lý báo hỏng thiết bị**:
   - Thêm mới báo hỏng thiết bị
   - Chỉnh sửa thông tin báo hỏng
   - Xóa báo hỏng
   - Xem các tài liệu liên quan (PDF/Word)

3. **Theo dõi trạng thái**:
   - Hiển thị số lượng thiết bị ở mỗi trạng thái
   - Hiển thị thông tin chi tiết của từng báo hỏng
   - Hiển thị lịch sử báo hỏng theo từng đơn vị

4. **Xử lý dữ liệu**:
   - Lọc thiết bị theo nhóm và đơn vị
   - Lọc báo hỏng theo trạng thái
   - Tự động cập nhật bảng khi có thay đổi

### Kỹ thuật
- Sử dụng **Bootstrap 5.1.3** cho giao diện responsive
- Sử dụng **Font Awesome 6.0.0** cho các biểu tượng
- Sử dụng **jQuery 3.6.4** cho xử lý DOM và sự kiện
- Sử dụng **SweetAlert2** cho các hộp thoại thông báo
- Tích hợp với **Google Apps Script** thông qua google.script.run
- Áp dụng mẫu thiết kế tab để quản lý các phân vùng giao diện
- Sử dụng spinner để thông báo khi đang xử lý dữ liệu

### Chi tiết luồng xử lý HTML_1BAOSUA.html

#### 1. Khởi tạo và nạp dữ liệu
- Khi trang web được tải, hiển thị màn hình loading (spinner)
- Gọi hàm `loadulieuAll()` để lấy dữ liệu từ server thông qua `google.script.run.getdata()`
- Chuyển đổi dữ liệu JSON nhận được thành đối tượng JavaScript
- Lưu dữ liệu vào biến `mydata` và cấu trúc cột vào `mycol`
- Ẩn màn hình loading và hiển thị form đăng nhập

#### 2. Xác thực người dùng
- Người dùng nhập thông tin đăng nhập (username/password)
- Hệ thống kiểm tra thông tin trong `mydata.val_DSUserDV`
- Nếu xác thực thành công:
  - Lưu ID người dùng vào biến `id_user`
  - Điền thông tin người dùng vào các trường (tên, SĐT, đơn vị)
  - Nạp danh sách người sửa chữa và nhóm thiết bị
  - Ẩn form đăng nhập, hiển thị dashboard
  - Gọi `updatetable_all()` để hiển thị lịch sử báo hỏng
- Nếu xác thực thất bại: Hiển thị thông báo lỗi

#### 3. Chọn và hiển thị thiết bị
- Người dùng chọn nhóm thiết bị từ dropdown (`cb_nhomthietbi`)
- Hệ thống gọi `updateMaThietBi()` để lọc và hiển thị thiết bị thuộc nhóm
- Khi chọn mã thiết bị, gọi `showDeviceDetails()` hiển thị thông tin chi tiết
- Thông tin thiết bị được lấy từ `mydata.val_dsthietbi` và hiển thị trong các trường

#### 4. Thêm báo hỏng mới
- Người dùng điền thông tin (tình trạng, mức độ, ghi chú) và chọn thiết bị
- Nhấn nút "Thêm Báo Hỏng" gọi hàm `addErrorReport()`
- Hệ thống kiểm tra dữ liệu đầu vào
- Hiển thị loading modal
- Tạo đối tượng dữ liệu chứa thông tin báo hỏng
- Gửi dữ liệu qua `google.script.run.SC_thembaohong()`
- Khi nhận kết quả:
  - Cập nhật `mydata.val_DataSC` 
  - Cập nhật bảng hiển thị
  - Hiển thị thông báo thành công

#### 5. Quản lý báo hỏng hiện có
- **Xem danh sách**: 
  - Hiển thị dữ liệu từ `mydata.val_DataSC` được lọc theo trạng thái và đơn vị (`id_user`)
  - Mỗi trạng thái hiển thị trong tab tương ứng

- **Chỉnh sửa báo hỏng**:
  - Người dùng nhấn nút Sửa (icon edit)
  - Gọi `editreport(id)` lấy dữ liệu từ server qua `SC_getDataById()`
  - Điền dữ liệu vào form
  - Chuyển sang chế độ chỉnh sửa với hàm `editMode(true)`

- **Cập nhật báo hỏng**:
  - Người dùng sửa thông tin và nhấn "Cập nhật"
  - Hệ thống xác nhận qua dialog
  - Gửi dữ liệu qua `google.script.run.SC_update()`
  - Cập nhật giao diện và thoát chế độ chỉnh sửa

- **Xóa báo hỏng**:
  - Người dùng nhấn nút Xóa
  - Hiển thị dialog xác nhận với `showyesno()`
  - Gọi `google.script.run.SC_delete(id)`
  - Xóa dòng từ bảng hiển thị
  - Cập nhật số lượng hiển thị trên tab

- **Xem biên bản**:
  - Người dùng nhấn nút PDF/Word
  - Mở URL tài liệu trong tab mới

#### 6. Đổi mật khẩu
- Người dùng nhấn "Đổi mật khẩu"
- Hiển thị modal form
- Người dùng điền thông tin (tên đăng nhập, mật khẩu cũ/mới)
- Hệ thống kiểm tra mật khẩu mới và xác nhận
- Kiểm tra tên đăng nhập và mật khẩu cũ
- Gọi `google.script.run.usersua_update_password()`
- Hiển thị thông báo kết quả

#### 7. Xử lý UI và thông báo
- **Chuyển tab**: Sử dụng `showTab()` để chuyển đổi giữa các tab
- **Hiển thị/Ẩn mật khẩu**: Các hàm toggle cho trường mật khẩu
- **Thông báo**: 
  - `showerror()`: Hiển thị thông báo lỗi
  - `showwarning()`: Hiển thị cảnh báo
  - `showinfor()`: Hiển thị thông tin
  - `showsucces()`: Hiển thị thành công
  - `showyesno()`: Hiển thị xác nhận với lựa chọn Yes/No

Luồng xử lý này kết nối với backend thông qua `google.script.run` để giao tiếp với các hàm trong Code.gs, DATASC.gs và các file khác trong hệ thống.
