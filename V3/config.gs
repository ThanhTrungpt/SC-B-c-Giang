/**
 * @fileoverview Cấu hình chung cho ứng dụng quản lý sửa chữa thiết bị
 * Bệnh viện Đa khoa Bắc Giang
 */

const CONFIG = {
  // ID của Google Spreadsheet chứa dữ liệu
  FILE_DATA_ID: '1AcF4se3EMZftlAoZ-YCl4GOPww9yzsIuM8CgRoleoZ0',
  FILE_MAIN_DATA_ID: '1LYBsUlDo42-DVIhbjsJ9aRTc-quVzSF1h_2BukeMikk',
  FILE_LOG_ID: '1afHg9kN6L044ySLqZU63MB7Pc-XQ43GcdYbcowR4CO4',
  
  // Tên các sheet chứa dữ liệu
  SHEET_NAMES: {
    DSUserDV: 'DSUserDV',   // Danh sách User đơn vị
    DSUserSua: 'DSUserSua', // Danh sách User sửa
    DSNhomTB: 'DSNhomTB',   // Danh sách nhóm thiết bị
    DSThietBi: 'DSThietBi', // Danh sách thiết bị
    MainSC: 'Main_SC',      // Dữ liệu sửa chữa chính
    EnumSetting: 'Enum Setting', // Cài đặt danh sách enum
    Log: 'Log'              // Sheet chứa log hệ thống
  },
  
  // Cấu trúc cột trong các sheet
  COLUMNS: {
    DSUserDV: {
      ID_UDV: 0,
      TEN_DON_VI_UDV: 1,
      KY_HIEU_UDV: 2,
      EMAIL_UDV: 3,
      USERNAME_UDV: 4,
      PASSWORK_UDV: 5,
      ANH_LOGO_UDV: 6,
      HISTORY_UDV: 7,
      TIME_UPDATE_UDV: 8
    },
    DSUserSua: {
      ID_USC: 0,
      DON_VI_USC: 1,
      HO_VA_TEN_USC: 2,
      EMAIL_USC: 3,
      SO_DIEN_THOAI_USC: 4,
      USE_TELE_USC: 5,
      USERNAME_USC: 6,
      PASSWORK_USC: 7,
      HISTORY_USC: 8,
      TIME_UPDATE_USC: 9
    },
    DSNhomTB: {
      ID_NTB: 0,
      NHOM_THIET_BI_NTB: 1,
      KY_HIEU_NHOM_NTB: 2,
      GHI_CHU_NTB: 3,
      HISTORY_NTB: 4,
      TIME_UPDATE_NTB: 5
    },
    DSThietBi: {
      ID_TB: 0,
      DON_VI_TB: 1,
      NHOM_THIET_BI_TB: 2,
      MA_THIET_BI_TB: 3,
      TEN_THIET_BI_TB: 4,
      MODEL_TB: 5,
      SERIAL_TB: 6,
      HANG_SAN_XUAT_TB: 7,
      NUOC_SAN_XUAT_TB: 8,
      NAM_SAN_XUAT_TB: 9,
      THOI_GIAN_DUA_VAO_SU_DUNG_TB: 10,
      HAN_BAO_HANH_TB: 11,
      VI_TRI_DAT_TB: 12,
      TINH_TRANG_THIET_BI_TB: 13,
      GHI_CHU_TB: 14,
      HISTORY_TB: 15,
      TIME_UPDATE_TB: 16
    },
    MainSC: {
      ID_DataSC: 0,
      WEBHOOK_DataSC: 1,
      TRANG_THAI_DataSC: 2,
      MUC_DO_DataSC: 3,
      DON_VI_DataSC: 4,
      NGUOI_SUA_DataSC: 5,
      THIET_BI_DataSC: 6,
      TINH_TRANG_TB_DV_BAO_DataSC: 7,
      THOI_GIAN_DV_BAO_DataSC: 8,
      NGAY_KHAO_SAT_DataSC: 9,
      TINH_TRANG_TB_KHAO_SAT_DataSC: 10,
      KET_LUAN_KHAO_SAT_DataSC: 11,
      DE_XUAT_PHUONG_AN_DataSC: 12,
      NGAY_DE_NGHI_DataSC: 13,
      NOI_DUNG_DE_NGHI_DataSC: 14,
      NGAY_BAN_GIAO_DataSC: 15,
      TINH_TRANG_TB_BAN_GIAO_DataSC: 16,
      GHI_CHU_DataSC: 17,
      HO_TEN_DataSC: 18,
      SO_DIEN_THOAI_DataSC: 19,
      NGUOI_SUA_CHUA_DataSC: 20,
      QUYET_DINH_TO_KHAO_SAT_DataSC: 21,
      DAI_DIEN_BV_1_DataSC: 22,
      CHUC_VU_DD_BV_1_DataSC: 23,
      DAI_DIEN_BV_2_DataSC: 24,
      CHUC_VU_DD_BV_2_DataSC: 25,
      DAI_DIEN_BV_3_DataSC: 26,
      CHUC_VU_DD_BV_3_DataSC: 27,
      DAI_DIEN_BV_4_DataSC: 28,
      CHUC_VU_DD_BV_4_DataSC: 29,
      DAI_DIEN_BV_5_DataSC: 30,
      CHUC_VU_DD_BV_5_DataSC: 31,
      DAI_DIEN_DV1_BAO_SUA_1_DataSC: 32,
      CHUC_VU_DD_DV1_BAO_SUA_DataSC: 33,
      DAI_DIEN_DV2_BAO_SUA_DataSC: 34,
      CHUC_VU_DD_DV2_BAO_SUA_DataSC: 35,
      QR_CODE_DataSC: 36,
      HISTORY_DataSC: 37,
      TIME_UPDATE_DataSC: 38
    }
  },
  
  // Đường dẫn mẫu báo cáo
  TEMPLATES: {
    BM_VTTB_09_01: '1jDqUToV79fyv3jNr_3j4HL64g_coxW3joVheIHdDWxg',
    BM_VTTB_09_02: '1fGUPZNrEi2OeBsmzWqj0FWx9oZYO79z4c5c45o20pl0',
    BM_VTTB_09_03: '1WCtJY6wA0-fBnurYf8beZyv4PAmWtGqAPZUwoJtUntM',
    BM_VTTB_09_04: '1mWJutc5TZ7EIf1Mq8Gj1ludhoRahOrHodZa5SU6Qi6k'
  },
  
  // Các trạng thái của báo sửa
  REPAIR_STATUS: {
    BAO_HONG: 'Em001',       // Trạng thái 01 Báo hỏng
    DANG_SUA: 'Em002',       // Trạng thái 02 Đang sửa
    BAO_HANH: 'Em003',       // Trạng thái 03 Bảo hành
    SUA_NGOAI: 'Em004',      // Trạng thái 04 Sửa ngoài
    HOAN_THANH: 'Em005',     // Trạng thái 05 Hoàn thành
    XOA: 'Em006'             // Trạng thái 06 Đã xóa
  },
  DEVICE_STATUS: {
    TB_Hong: 'Em010',                // Trạng thái thiết bị hỏng
    TB_HoatDongBT: 'Em011' // Trạng thái thiết bị hoạt động bình thường
  },
  REQUEST_URGENCY_LEVEL: {
    GAP: 'Em020',          // Mức độ yêu cầu Gấp
    RAT_GAP: 'Em021'       // Mức độ yêu cầu Rất gấp
  },
  // Cấu hình cache
  CACHE: {
    DEFAULT_EXPIRATION: 21600 // 6 giờ
  },
  
  // Cấu hình log
  LOG: {
    MAX_ENTRIES: 10000,      // Số lượng log tối đa trong sheet
    CLEAN_THRESHOLD: 9000    // Ngưỡng để dọn dẹp log cũ
  },
  
  // Cấu hình Telegram
  TELEGRAM: {
    BOT_TOKEN: '8150634839:AAFFG7s-7zYcBsYlDWqFYybdejOAOvket1Y',  // Token của bot Telegram
    GROUP_CHAT_ID: '-4705814679',  // Chat ID của nhóm
    ENABLED: true  // Bật/tắt thông báo Telegram
  }
};

/**
 * Tạo ID sửa chữa mới
 * @param {string} unitCode - Mã đơn vị
 * @return {string} ID sửa chữa mới
 */
function generateRepairID(unitCode) {
  // Mã đơn vị
  const unit = unitCode || "XX";  

  // Ngày hiện tại theo định dạng yymmdd
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);
  const datePart = year + month + day;

  // Kiểm tra số lượng ID trong ngày
  const ss = SpreadsheetApp.openById(CONFIG.FILE_MAIN_DATA_ID);
  const sh = ss.getSheetByName(CONFIG.SHEET_NAMES.MainSC);
  const range = sh.getRange("A:A");
  const values = range.getValues().flat();
  
  // Đếm số ID theo ngày
  const pattern = `SC.${unit}.${datePart}`;
  const todayCount = values.filter(id => id && id.includes(pattern)).length;

  // Tạo số thứ tự 5 chữ số
  const sequence = ("00000" + todayCount).slice(-5);

  // Trả về ID hoàn chỉnh
  return `SC.${unit}.${datePart}.${sequence}`;
} 