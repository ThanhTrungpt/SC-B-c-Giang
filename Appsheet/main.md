// Code chạy trên appsheet 

// Danh sách các bảng:
* Main_SC
- ID_DataSC
- Webhook_DataSC
- Trạng thái_DataSC
- Mức độ_DataSC
- Đơn vị_DataSC
- Người sửa_DataSC
- Thiết bị_DataSC
- Tình trạng thiết bị đơn vị báo_DataSC
- Thời gian đơn vị báo_DataSC
- Ngày khảo sát_DataSC
- Tình trang thiết bị khảo sát_DataSC
- Kết luận khảo sát_DataSC
- Đề xuất phương án_DataSC
- Ngày đề nghi_DataSC
- Nội dung đề nghi_DataSC
- Ngày bàn giao_DataSC
- Tình trạng thiết bị bàn giao_DataSC
- Ghi chú_DataSC
- Họ và tên_DataSC
- Số điện thoại_DataSC
- Quyết định tổ khảo sát_DataSC
- Đại diện BV 1_DataSC
- Chức vụ DD BV 1_DataSC
- Đại diện BV 2_DataSC
- Chức vụ DD BV 2_DataSC
- Đại diện BV 3_DataSC
- Chức vụ DD BV 3_DataSC
- Đại diện BV 4_DataSC
- Chức vụ DD BV 4_DataSC
- Đại diện BV 5_DataSC
- Chức vụ DD BV 5_DataSC
- Đại diện ĐV1  Báo sửa 1_DataSC
- Chức vụ DD ĐV1  Báo sửa_DataSC
- Đại diện ĐV2 Báo sửa _DataSC
- Chức vụ DD ĐV2 Báo sửa_DataSC
- QR Code_DataSC
- History_DataSC
- TimeUpdate_DataSC
- Word_BB01_DataSC
- Pdf_BB01_DataSC
- Word_BB02_DataSC
- Pdf_BB02_DataSC
- Word_BB03_DataSC
- Pdf_BB03_DataSC
- Word_BB04_DataSC
- Pdf_BB04_DataSC

* DSThietBi
- ID_TB
- Đơn vị_TB
- Nhóm thiết bị_TB
- Mã thiết bị_TB
- Tên thiết bị_TB
- Model_TB
- Serial_TB
- Hãng sản xuất_TB
- Nước sản xuất_TB
- Năm sản xuất_TB
- Thời gian đưa vào sử dụng_TB
- Hạn bảo hành_TB
- Vị trí đặt_TB
- Tình trạng thiết bị_TB
- Ghi chú_TB
- History_TB
- TimeUpdate_TB

* DSUserSua
- ID_USC
- Đơn vị_USC
- Họ và tên_USC
- Email_USC
- Số điện thoại_USC
- UseTele_USC
- Username_USC
- Passwork_USC
- History_USC
- TimeUpdate_USC

* DSUserDV
- ID_UDV
- Tên Đơn vị_UDV
- Ký hiệu_UDV
- Email_UDV
- Username_UDV
- Passwork_UDV
- Ảnh logo_UDV
- History_UDV
- TimeUpdate_UDV

* DSNhomTB
- ID_NTB
- Nhóm thiết bị_NTB
- Ký hiệu nhóm_NTB
- Ghi chú_NTB
- History_NTB
- TimeUpdate_NTB

* Enum Setting
ID_EnumST   | Nhóm_EnumST   | Tên_EnumST
-----------------------------------------------
Em001       | Trạng thái    | 01 Đề nghị sửa chữa
Em002       | Trạng thái    | 02 Khảo sát tình trạng thiết bị hỏng
Em003       | Trạng thái    | 03 Đang sửa
Em004       | Trạng thái    | 04 Bảo hành
Em005       | Trạng thái    | 05 Sửa ngoài
Em006       | Trạng thái    | 06 Hoàn thành
Em007       | Trạng thái    | 07 Xóa
Em010       | TT Thiết bị   | Hỏng
Em011       | TT Thiết bị   | Hoạt động bình thường
Em012       | TT Thiết bị   | Đề nghị sửa
Em013       | TT Thiết bị   | Khảo sát tình trạng thiết bị hỏng
Em014       | TT Thiết bị   | Đang sửa
Em015       | TT Thiết bị   | Bảo hành
Em016       | TT Thiết bị   | Sửa ngoài
Em020       | Mức độ YC     | Gấp
Em021       | Mức độ YC     | Rất gấp

-------------------------------------------------------------


// Row filter for slice Lọc Khoa 
 