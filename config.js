// ===== 3. COLUMN DEFINITIONS =====
export const CONFIG_COLUMNS = {
  // Equipment group columns
  DSNhomTB: {
    id: 0,          // ID_NTB
    nhomtb: 1,      // Nhóm thiết bị_NTB
    kihieu: 2,      // Ký hiệu nhóm_NTB
    ghichu: 3,      // Ghi chú_NTB
    history: 4,     // History_NTB
    timeupdate: 5   // TimeUpdate_NTB
  },
  
  // Equipment columns
  DSThietBi: {
    id: 0,          // ID_TB
    donvi: 1,       // Đơn vị_TB
    nhomtb: 2,      // Nhóm thiết bị_TB
    mathietbi: 3,   // Mã thiết bị_TB
    tentb: 4,       // Tên thiết bị_TB
    model: 5,       // Model_TB
    serial: 6,      // Serial_TB
    hangsx: 7,      // Hãng sản xuất_TB
    nuocsx: 8,      // Nước sản xuất_TB
    namsx: 9,       // Năm sản xuất_TB
    namsd: 10,      // Thời gian đưa vào sử dụng_TB
    hanbaohanh: 11, // Hạn bảo hành_TB
    vitridat: 12,   // Vị trí đặt_TB
    tinhtrang: 13,  // Tình trạng thiết bị_TB
    ghichu: 14,     // Ghi chú_TB
    history: 15,    // History_TB
    timeupdate: 16  // TimeUpdate_TB
  },
  
  // Main repair data columns
  DataSC: {
    id: 0,                     // ID_DataSC
    webhook: 1,                // Webhook_DataSC
    trangthai: 2,              // Trạng thái_DataSC
    mucdo: 3,                  // Mức độ_DataSC
    iduserdv: 4,               // Đơn vị_DataSC
    idusersua: 5,              // Người sửa_DataSC
    idthietbi: 6,              // Thiết bị_DataSC
    tinhtrangtbdvbao: 7,       // Tình trạng thiết bị đơn vị báo_DataSC
    ngaydonvibao: 8,           // Thời gian đơn vị báo_DataSC
    ngaykhaosat: 9,            // Ngày khảo sát_DataSC
    tinhtrangthietbiks: 10,    // Tình trang thiết bị khảo sát_DataSC
    ketluankhaosat: 11,        // Kết luận khảo sát_DataSC
    dexuatphuongan: 12,        // Đề xuất phương án_DataSC
    ngaydenghi: 13,            // Ngày đề nghi_DataSC
    noidungdenghi: 14,         // Nội dung đề nghi_DataSC
    ngaybangiao: 15,           // Ngày bàn giao_DataSC
    tinhtrangbangiao: 16,      // Tình trạng thiết bị bàn giao_DataSC
    ghichu: 17,                // Ghi chú_DataSC
    hotenYeucau: 18,                 // Họ và tên_DataSC
    sdtYeucau: 19,                   // Số điện thoại_DataSC
    quyetdinhtokhaosat: 20,    // Quyết định tổ khảo sát_DataSC
    
    // Department representatives and their positions
    bv1_daidien: 21,           // Đại diện BV 1_DataSC
    bv1_chucvu: 22,            // Chức vụ DD BV 1_DataSC
    bv2_daidien: 23,           // Đại diện BV 2_DataSC
    bv2_chucvu: 24,            // Chức vụ DD BV 2_DataSC
    bv3_daidien: 25,           // Đại diện BV 3_DataSC
    bv3_chucvu: 26,            // Chức vụ DD BV 3_DataSC
    bv4_daidien: 27,           // Đại diện BV 4_DataSC
    bv4_chucvu: 28,            // Chức vụ DD BV 4_DataSC
    bv5_daidien: 29,           // Đại diện BV 5_DataSC
    bv5_chucvu: 30,            // Chức vụ DD BV 5_DataSC
    dv1_daidien: 31,           // Đại diện ĐV1 Báo sửa 1_DataSC
    dv1_chucvu: 32,            // Chức vụ DD ĐV1 Báo sửa_DataSC
    dv2_daidien: 33,           // Đại diện ĐV2 Báo sửa _DataSC
    dv2_chucvu: 34,            // Chức vụ DD ĐV2 Báo sửa_DataSC
    
    qrcode: 35,                // QR Code_DataSC
    history: 36,               // History_DataSC
    timeupdate: 37,             // TimeUpdate_DataSC

    Word_BB01: 38,              // Word_BB01_DataSC
    Pdf_BB01: 39,               // Pdf_BB01_DataSC
    Word_BB02: 40,              // Word_BB02_DataSC
    Pdf_BB02: 41,               // Pdf_BB02_DataSC
    Word_BB03: 42,              // Word_BB03_DataSC
    Pdf_BB03: 43,               // Pdf_BB03_DataSC
    Word_BB04: 44,              // Word_BB04_DataSC
    Pdf_BB04: 45                // Pdf_BB04_DataSC
  },
  
  // Repair personnel columns
  DSUserSua: {
    id: 0,          // ID_USC
    donvi: 1,       // Đơn vị_USC
    hoten: 2,       // Họ và tên_USC
    email: 3,       // Email_USC
    sdt: 4,         // Số điện thoại_USC
    usetele: 5,     // UseTele_USC
    username: 6,    // Username_USC
    pass: 7,        // Passwork_USC
    history: 8,     // History_USC
    timeupdate: 9   // TimeUpdate_USC
  },
  
  // Department users columns
  DSUserDV: {
    id: 0,          // ID_UDV
    donvi: 1,       // Tên Đơn vị_UDV
    kihieu: 2,      // Ký hiệu_UDV
    email: 3,       // Email_UDV
    username: 4,    // Username_UDV
    pass: 5,        // Passwork_UDV
    logo: 6,        // Ảnh logo_UDV
    history: 7,     // History_UDV
    timeupdate: 8   // TimeUpdate_UDV
  },
  
  // Enum settings columns
  EnumSetting: {
    id: 0,          // ID_EnumST
    nhom: 1,        // Nhóm_EnumST
    ten: 2          // Tên_EnumST
  }
};
// ===== 3. ENUM SETTINGS =====
export const CONFIG_ENUM = {
  // Status codes
  TRANGTHAI: {
    DE_NGHI_SUA: "Em001",   // 01 Đề nghị sửa chữa
    KHAO_SAT: "Em002",      // 02 Khảo sát tình trạng thiết bị hỏng
    DANG_SUA: "Em003",      // 03 Đang sửa
    BAO_HANH: "Em004",      // 04 Bảo hành
    SUA_NGOAI: "Em005",     // 05 Sửa ngoài
    HOAN_THANH: "Em006",    // 06 Hoàn thành
    XOA: "Em007"            // 07 Xóa
  },
  
  // Equipment status
  TINHTRANG_THIETBI: {
    HONG: "Em010",         // Hỏng
    BINH_THUONG: "Em011"   // Hoạt động bình thường
  },
  
  // Priority levels
  MUC_DO_YC: {
    GAP: "Em020",          // Gấp
    RAT_GAP: "Em021"       // Rất gấp
  }
};