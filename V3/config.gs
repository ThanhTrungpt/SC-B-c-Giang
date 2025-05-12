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
      ID: 0,
      DON_VI: 1,
      HO_TEN: 2,
      EMAIL: 3,
      SO_DIEN_THOAI: 4,
      USE_TELE: 5,
      USERNAME: 6,
      PASSWORD: 7,
      HISTORY: 8,
      TIME_UPDATE: 9
    },
    DSUserSua: {
      ID: 0,
      DON_VI: 1,
      HO_TEN: 2,
      EMAIL: 3,
      SO_DIEN_THOAI: 4,
      USE_TELE: 5,
      USERNAME: 6,
      PASSWORD: 7,
      HISTORY: 8,
      TIME_UPDATE: 9
    },
    DSNhomTB: {
      ID: 0,
      NHOM_THIET_BI: 1,
      KY_HIEU_NHOM: 2,
      GHI_CHU: 3,
      HISTORY: 4,
      TIME_UPDATE: 5
    },
    DSThietBi: {
      ID: 0,
      DON_VI: 1,
      NHOM_THIET_BI: 2,
      MA_THIET_BI: 3,
      TEN_THIET_BI: 4,
      MODEL: 5,
      SERIAL: 6,
      HANG_SAN_XUAT: 7,
      NUOC_SAN_XUAT: 8,
      NAM_SAN_XUAT: 9,
      THOI_GIAN_SU_DUNG: 10,
      HAN_BAO_HANH: 11,
      VI_TRI_DAT: 12,
      TINH_TRANG_THIET_BI: 13,
      GHI_CHU: 14,
      HISTORY: 15,
      TIME_UPDATE: 16
    },
    MainSC: {
      ID: 0,
      WEBHOOK: 1,
      TRANG_THAI: 2,
      MUC_DO: 3,
      DON_VI: 4,
      NGUOI_SUA: 5,
      THIET_BI: 6,
      TINH_TRANG_TB_DV_BAO: 7,
      THOI_GIAN_DV_BAO: 8,
      NGAY_KHAO_SAT: 9,
      TINH_TRANG_TB_KHAO_SAT: 10,
      KET_LUAN_KHAO_SAT: 11,
      DE_XUAT_PHUONG_AN: 12,
      NGAY_DE_NGHI: 13,
      NOI_DUNG_DE_NGHI: 14,
      NGAY_BAN_GIAO: 15,
      TINH_TRANG_TB_BAN_GIAO: 16,
      GHI_CHU: 17,
      HO_TEN: 18,
      SO_DIEN_THOAI: 19,
      NGUOI_SUA_CHUA: 20,
      QUYET_DINH_TO_KHAO_SAT: 21,
      DAI_DIEN_BV_1: 22,
      CHUC_VU_DD_BV_1: 23,
      DAI_DIEN_BV_2: 24,
      CHUC_VU_DD_BV_2: 25,
      DAI_DIEN_BV_3: 26,
      CHUC_VU_DD_BV_3: 27,
      DAI_DIEN_BV_4: 28,
      CHUC_VU_DD_BV_4: 29,
      DAI_DIEN_BV_5: 30,
      CHUC_VU_DD_BV_5: 31,
      DAI_DIEN_DV1_BAO_SUA_1: 32,
      CHUC_VU_DD_DV1_BAO_SUA: 33,
      DAI_DIEN_DV2_BAO_SUA: 34,
      CHUC_VU_DD_DV2_BAO_SUA: 35,
      QR_CODE: 36,
      HISTORY: 37,
      TIME_UPDATE: 38
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
    BAO_HONG: 'Em001',
    DANG_SUA: 'Em002',
    BAO_HANH: 'Em003',
    SUA_NGOAI: 'Em004',
    XOA: 'Em999'
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