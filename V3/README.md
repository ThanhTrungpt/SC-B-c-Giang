# Phần mềm quản lý sửa chữa thiết bị - Bệnh viện Đa khoa Bắc Giang

## Giới thiệu

Phần mềm quản lý sửa chữa thiết bị (V3) là hệ thống giúp theo dõi và quản lý việc báo hỏng, sửa chữa thiết bị trong Bệnh viện Đa khoa Bắc Giang. Hệ thống được xây dựng trên nền tảng Google Apps Script và sử dụng Google Sheets làm cơ sở dữ liệu.

## Tính năng chính

- **Quản lý báo hỏng thiết bị**: Cho phép người dùng báo cáo thiết bị hỏng, theo dõi quá trình sửa chữa, và quản lý trạng thái thiết bị.
- **Tạo báo cáo tự động**: Tự động tạo các biểu mẫu báo cáo theo định dạng chuẩn (BM.VTTB.09.01, BM.VTTB.09.02, BM.VTTB.09.03, BM.VTTB.09.04).
- **Tìm kiếm và lọc**: Công cụ tìm kiếm nâng cao để dễ dàng tìm kiếm thiết bị theo nhiều tiêu chí.
- **Thông báo qua Telegram**: Hỗ trợ gửi thông báo qua Telegram khi có báo hỏng mới hoặc cập nhật trạng thái.
- **Giao diện thân thiện người dùng**: Giao diện responsive, hiện đại và dễ sử dụng.
- **Phân quyền người dùng**: Phân quyền rõ ràng giữa người dùng đơn vị và người sửa chữa.

## Cấu trúc dự án

```
V3/
├── Code.gs               # Điểm vào chính của ứng dụng
├── config.js             # Cấu hình chung
├── dataService.js        # Dịch vụ xử lý dữ liệu
├── documentService.js    # Dịch vụ tạo báo cáo
├── telegramService.js    # Dịch vụ gửi thông báo Telegram
├── index.html            # Trang web chính
├── scripts.html          # JavaScript cho giao diện người dùng
├── styles.html           # CSS cho giao diện người dùng
└── README.md             # Tài liệu hướng dẫn
```

## Cải tiến trong phiên bản V3

### Tối ưu hiệu năng
- **Caching dữ liệu**: Sử dụng CacheService để giảm số lần truy vấn Google Sheets.
- **Batch processing**: Xử lý dữ liệu theo lô để tăng hiệu suất.
- **Code splitting**: Tách mã nguồn thành các module nhỏ để dễ bảo trì.

### Cải thiện giao diện
- **Responsive design**: Giao diện tương thích với mọi thiết bị.
- **Modern UI**: Sử dụng Bootstrap 5 và Font Awesome để tạo giao diện hiện đại.
- **Improved UX**: Tối ưu trải nghiệm người dùng với các tính năng autocomplete, validation, và thông báo.

### Cải thiện code
- **ES6+ syntax**: Sử dụng cú pháp JavaScript hiện đại.
- **Modular architecture**: Kiến trúc module hóa giúp dễ bảo trì và mở rộng.
- **Documented code**: Code được viết rõ ràng với JSDoc và comments.

## Hướng dẫn cài đặt

1. Tạo một dự án Google Apps Script mới
2. Tải lên tất cả các file trong thư mục V3
3. Cấu hình các ID file trong config.js
4. Triển khai ứng dụng web

## Hướng dẫn sử dụng

### Đăng nhập
- Sử dụng tên đăng nhập và mật khẩu được cấp bởi quản trị viên.

### Báo hỏng thiết bị
1. Đăng nhập vào hệ thống
2. Nhấn nút "Thêm báo hỏng"
3. Điền thông tin vào form
4. Nhấn "Lưu" để hoàn tất

### Xuất báo cáo
1. Tìm báo cáo cần xuất trong danh sách
2. Nhấn nút "PDF" hoặc "Word" để xuất file tương ứng

## Liên hệ và hỗ trợ

Mọi thắc mắc và yêu cầu hỗ trợ, vui lòng liên hệ bộ phận CNTT - Bệnh viện Đa khoa Bắc Giang. 

## Các bước triển khai

### 1. Tạo Google Apps Script Project
1. Truy cập [Google Apps Script](https://script.google.com/)
2. Tạo dự án mới
3. Đặt tên dự án (ví dụ: "Quản lý sửa chữa BVBG")

### 2. Tạo các Google Sheets cần thiết
1. Tạo 3 file Google Sheets:
   - File dữ liệu chính: Lưu danh sách đơn vị, người dùng, thiết bị
   - File dữ liệu sửa chữa: Lưu các yêu cầu sửa chữa
   - File log: Lưu nhật ký hoạt động của hệ thống
2. Lưu ID của các file (phần sau 'd/' trong URL)
3. Cập nhật các ID trong file config.js

### 3. Upload các file code
1. Upload hoặc tạo tất cả các file .gs và .html vào dự án
2. Đảm bảo rằng tên file chính xác:
   - Code.gs
   - config.gs
   - dataService.gs
   - documentService.gs
   - telegramService.gs
   - index.html
   - styles.html
   - scripts.html

### 4. Cấu hình và Triển khai
1. Cập nhật config.gs với ID của 3 file Google Sheets
2. Chạy hàm `initApp()` từ Code.gs để tạo cấu trúc ban đầu
3. Nhấn "Deploy" > "New deployment"
4. Chọn loại là "Web app"
5. Thiết lập:
   - Description: Mô tả ứng dụng
   - Execute as: "Me" (để ứng dụng có quyền truy cập vào Google Sheets)
   - Who has access: "Anyone" hoặc "Anyone with Google Account"
6. Nhấn "Deploy" và cấp quyền khi được yêu cầu
7. Lưu lại URL web app đã tạo

## Xử lý sự cố thường gặp

### Ứng dụng bị treo ở màn hình loading
Có nhiều nguyên nhân có thể gây ra vấn đề này:

1. **Kiểm tra quyền truy cập Google Sheets**
   - Đảm bảo bạn đã chọn "Execute as: Me" khi deploy
   - Đảm bảo các ID spreadsheet trong config.js chính xác
   - Người dùng của ứng dụng có quyền truy cập vào các spreadsheet

2. **Khởi tạo cấu trúc dữ liệu**
   - Chạy hàm `checkSetup()` để kiểm tra cấu trúc
   - Chạy hàm `initApp()` để tạo các sheet cần thiết nếu chưa có

3. **Xóa cache và làm mới ứng dụng**
   - Xóa cache trình duyệt
   - Thêm tham số ?nocache=1 vào URL web app

4. **Kiểm tra lỗi trong console**
   - Mở Developer Tools (F12) để xem lỗi JavaScript
   - Kiểm tra tab Network để xem các lỗi kết nối

5. **Kiểm tra quotas và giới hạn của Google Apps Script**
   - Hàm Apps Script có thời gian chạy tối đa 6 phút
   - Có giới hạn số lượng truy vấn API mỗi ngày

### Lỗi khi tạo báo cáo
1. Kiểm tra ID template trong config.js
2. Đảm bảo bạn có quyền truy cập vào các file template
3. Kiểm tra quyền truy cập Drive API

### Lỗi thông báo Telegram
1. Kiểm tra Bot Token và Chat ID trong telegramService.js
2. Thực hiện lại setup webhook bằng cách chạy hàm `setupTelegramWebhook()`

## Liên hệ hỗ trợ
Nếu bạn gặp vấn đề khác không được liệt kê ở đây, vui lòng liên hệ:
- Email: [your-email@example.com]
- Điện thoại: [your-phone-number]

---

## Cách xử lý lỗi "Đang tải dữ liệu..." cụ thể

Nếu bạn vẫn gặp lỗi treo ở màn hình loading "Đang tải dữ liệu...", hãy thực hiện các bước sau:

### Bước 1: Kiểm tra cấu trúc dữ liệu
Truy cập trực tiếp vào URL web app với đường dẫn thêm `/exec?action=checkSetup`
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=checkSetup
```

Kết quả trả về sẽ cho biết tình trạng của các file và sheet.

### Bước 2: Khởi tạo ứng dụng
Nếu phát hiện thiếu sheet hoặc cấu trúc không đúng, truy cập:
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=initApp
```

### Bước 3: Kiểm tra log
Truy cập file log trong Google Sheets để xem chi tiết lỗi hệ thống.

### Bước 4: Tải dữ liệu theo từng phần thủ công
Nếu vẫn gặp vấn đề, bạn có thể thử tải từng phần dữ liệu:
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getPartialData&part=essential
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getPartialData&part=main
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getPartialData&part=secondary
```

### Bước 5: Deploy lại ứng dụng
Nếu sau tất cả những cách trên vẫn chưa khắc phục được vấn đề:
1. Tạo một phiên bản deployment mới
2. Sử dụng URL mới để truy cập ứng dụng

---

## Ghi chú bảo trì
- Version 3.0.0 - 21/05/2023: Phiên bản ban đầu
- Version 3.1.0 - 30/06/2023: Cải thiện tải dữ liệu và xử lý lỗi 