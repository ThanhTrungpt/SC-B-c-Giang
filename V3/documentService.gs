/**
 * @fileoverview Dịch vụ xử lý các tài liệu Google Docs và tạo báo cáo
 * Bệnh viện Đa khoa Bắc Giang
 */

/**
 * Tạo file từ template
 * @param {string} templateId - ID của file template
 * @param {Object} data - Dữ liệu cần thay thế
 * @param {string} newFileName - Tên file mới
 * @returns {string} URL của file đã tạo
 */
function createFileFromTemplate(templateId, data, newFileName) {
  // Lấy thông tin user được lưu trong cache nếu có
  let userInfo = "System";
  try {
    const cache = CacheService.getScriptCache();
    const userCacheData = cache.get('current_user');
    if (userCacheData) {
      const userData = JSON.parse(userCacheData);
      userInfo = userData.donVi || userData.hoTen || userData.username || "System";
    }
  } catch (e) {
    // Ignore
  }
  
  saveLogData([[new Date(), 'createFileFromTemplate', `Bắt đầu tạo file: ${newFileName} từ template: ${templateId}`, userInfo]]);
  
  try {
    // Mở file template
    const templateFile = DriveApp.getFileById(templateId);
    
    // Tạo bản sao trong thư mục tạm
    const tempFolder = DriveApp.getRootFolder(); // Hoặc một thư mục cụ thể
    const newFile = templateFile.makeCopy(newFileName, tempFolder);
    
    saveLogData([[new Date(), 'createFileFromTemplate', `Đã tạo bản sao file: ${newFile.getId()}`, userInfo]]);
    
    // Mở file mới để thay thế nội dung
    const doc = DocumentApp.openById(newFile.getId());
    const body = doc.getBody();
    
    // Thay thế dữ liệu
    for (const [key, value] of Object.entries(data)) {
      if (value) {
        body.replaceText(`{{${key}}}`, value.toString());
      } else {
        body.replaceText(`{{${key}}}`, '');
      }
    }
    
    // Lưu và đóng document
    doc.saveAndClose();
    
    saveLogData([[new Date(), 'createFileFromTemplate', `Đã thay thế nội dung trong file`, userInfo]]);
    
    // Xuất file PDF
    const pdfBlob = newFile.getAs(MimeType.PDF);
    const pdfFile = tempFolder.createFile(pdfBlob);
    pdfFile.setName(`${newFileName}.pdf`);
    
    saveLogData([[new Date(), 'createFileFromTemplate', `Đã xuất file PDF: ${pdfFile.getId()}`, userInfo]]);
    
    return {
      docUrl: newFile.getUrl(),
      pdfUrl: pdfFile.getUrl(),
      docId: newFile.getId(),
      pdfId: pdfFile.getId()
    };
  } catch (error) {
    saveLogData([[new Date(), 'createFileFromTemplate', `Lỗi khi tạo file: ${error.message}`, userInfo]]);
    console.error('Lỗi khi tạo file từ template:', error);
    return null;
  }
}

/**
 * Tạo báo cáo BM.VTTB.09.01 Giấy đề nghị sửa chữa
 * @param {string} repairId - ID báo cáo
 * @param {Array} deviceRow - Dòng dữ liệu thiết bị
 * @param {Array} unitRow - Dòng dữ liệu đơn vị
 * @returns {Object} URL của file đã tạo
 */
function createBM0901(repairId, deviceRow, unitRow) {
  // Lấy thông tin user được lưu trong cache nếu có
  let userInfo = "System";
  try {
    const cache = CacheService.getScriptCache();
    const userCacheData = cache.get('current_user');
    if (userCacheData) {
      const userData = JSON.parse(userCacheData);
      userInfo = userData.donVi || userData.hoTen || userData.username || "System";
    }
  } catch (e) {
    // Ignore
  }
  
  saveLogData([[new Date(), 'createBM0901', `Bắt đầu tạo BM.VTTB.09.01 cho báo cáo: ${repairId}`, userInfo]]);
  
  // Xử lý ngày hiện tại
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  // Chuẩn bị dữ liệu thay thế
  const templateData = {
    'Đơn vị yêu cầu': unitRow[CONFIG.COLUMNS.DSUserDV.DON_VI],
    'today': day,
    'month': month,
    'year': year,
    'Tên thiết bị': deviceRow[CONFIG.COLUMNS.DSThietBi.TEN_THIET_BI],
    'Model': deviceRow[CONFIG.COLUMNS.DSThietBi.MODEL],
    'Serial': deviceRow[CONFIG.COLUMNS.DSThietBi.SERIAL],
    'Hãng sản xuất': deviceRow[CONFIG.COLUMNS.DSThietBi.HANG_SAN_XUAT],
    'Nước sản xuất': deviceRow[CONFIG.COLUMNS.DSThietBi.NUOC_SAN_XUAT],
    'Năm sản xuất': deviceRow[CONFIG.COLUMNS.DSThietBi.NAM_SAN_XUAT],
    'Năm sử dụng': deviceRow[CONFIG.COLUMNS.DSThietBi.THOI_GIAN_SU_DUNG],
    'QR_CODE': generateQRCodeUrl(repairId),
    'id': repairId
  };
  
  // Tạo tên file
  const fileName = `BM.VTTB.09.01 Giấy đề nghị sửa chữa - ${repairId}`;
  
  // Tạo file từ template
  const result = createFileFromTemplate(CONFIG.TEMPLATES.BM_VTTB_09_01, templateData, fileName);
  
  if (result) {
    saveLogData([[new Date(), 'createBM0901', `Đã tạo BM.VTTB.09.01 thành công - DocID: ${result.docId}`, userInfo]]);
  } else {
    saveLogData([[new Date(), 'createBM0901', `Lỗi khi tạo BM.VTTB.09.01`, userInfo]]);
  }
  
  return result;
}

/**
 * Tạo báo cáo BM.VTTB.09.02 Biên bản khảo sát tình trạng thiết bị hỏng
 * @param {Object} data - Dữ liệu báo cáo
 * @returns {Object} URL của file đã tạo
 */
function createBM0902(data) {
  const { id, rowsc, rowthietbi, rowdvyc } = data;
  
  // Xử lý ngày
  const dateParts = {};
  
  // Ngày khảo sát
  if (rowsc[CONFIG.COLUMNS.MainSC.NGAY_KHAO_SAT]) {
    const ngaykhaosat = new Date(rowsc[CONFIG.COLUMNS.MainSC.NGAY_KHAO_SAT]);
    dateParts.day_ngaykhaosat = ngaykhaosat.getDate();
    dateParts.month_ngaykhaosat = ngaykhaosat.getMonth() + 1;
    dateParts.year_ngaykhaosat = ngaykhaosat.getFullYear();
  } else {
    const now = new Date();
    dateParts.day_ngaykhaosat = now.getDate();
    dateParts.month_ngaykhaosat = now.getMonth() + 1;
    dateParts.year_ngaykhaosat = now.getFullYear();
  }
  
  // Ngày đơn vị báo
  if (rowsc[CONFIG.COLUMNS.MainSC.THOI_GIAN_DV_BAO]) {
    const ngaydvbao = new Date(rowsc[CONFIG.COLUMNS.MainSC.THOI_GIAN_DV_BAO]);
    dateParts.day_ngaydvbao = ngaydvbao.getDate();
    dateParts.month_ngaydvbao = ngaydvbao.getMonth() + 1;
    dateParts.year_ngaydvbao = ngaydvbao.getFullYear();
  } else {
    const now = new Date();
    dateParts.day_ngaydvbao = now.getDate();
    dateParts.month_ngaydvbao = now.getMonth() + 1;
    dateParts.year_ngaydvbao = now.getFullYear();
  }
  
  // Chuẩn bị dữ liệu thay thế
  const templateData = {
    ...dateParts,
    'Đơn vị yêu cầu': rowdvyc[CONFIG.COLUMNS.DSUserDV.DON_VI],
    'Quyết định tổ khảo sát': rowdvyc[CONFIG.COLUMNS.DSUserDV.QUYET_DINH_TO_KHAO_SAT] || '',
    'Đại diện BV 1': rowdvyc[CONFIG.COLUMNS.DSUserDV.DAI_DIEN_BV_1] || '',
    'Chức vụ DD BV 1': rowdvyc[CONFIG.COLUMNS.DSUserDV.CHUC_VU_DD_BV_1] || '',
    'Đại diện BV 2': rowdvyc[CONFIG.COLUMNS.DSUserDV.DAI_DIEN_BV_2] || '',
    'Chức vụ DD BV 2': rowdvyc[CONFIG.COLUMNS.DSUserDV.CHUC_VU_DD_BV_2] || '',
    'Đại diện BV 3': rowdvyc[CONFIG.COLUMNS.DSUserDV.DAI_DIEN_BV_3] || '',
    'Chức vụ DD BV 3': rowdvyc[CONFIG.COLUMNS.DSUserDV.CHUC_VU_DD_BV_3] || '',
    'Đại diện BV 4': rowdvyc[CONFIG.COLUMNS.DSUserDV.DAI_DIEN_BV_4] || '',
    'Chức vụ DD BV 4': rowdvyc[CONFIG.COLUMNS.DSUserDV.CHUC_VU_DD_BV_4] || '',
    'Đại diện BV 5': rowdvyc[CONFIG.COLUMNS.DSUserDV.DAI_DIEN_BV_5] || '',
    'Chức vụ DD BV 5': rowdvyc[CONFIG.COLUMNS.DSUserDV.CHUC_VU_DD_BV_5] || '',
    'Đại diện ĐV Báo sửa 1': rowdvyc[CONFIG.COLUMNS.DSUserDV.DAI_DIEN_DV1_BAO_SUA_1] || '',
    'Chức vụ DD ĐV Báo sửa 1': rowdvyc[CONFIG.COLUMNS.DSUserDV.CHUC_VU_DD_DV1_BAO_SUA] || '',
    'Đại diện ĐV Báo sửa 2': rowdvyc[CONFIG.COLUMNS.DSUserDV.DAI_DIEN_DV2_BAO_SUA] || '',
    'Chức vụ DD ĐV Báo sửa 2': rowdvyc[CONFIG.COLUMNS.DSUserDV.CHUC_VU_DD_DV2_BAO_SUA] || '',
    'Tên thiết bị': rowthietbi[CONFIG.COLUMNS.DSThietBi.TEN_THIET_BI],
    'Model': rowthietbi[CONFIG.COLUMNS.DSThietBi.MODEL],
    'Serial': rowthietbi[CONFIG.COLUMNS.DSThietBi.SERIAL],
    'Hãng sản xuất': rowthietbi[CONFIG.COLUMNS.DSThietBi.HANG_SAN_XUAT],
    'Nước sản xuất': rowthietbi[CONFIG.COLUMNS.DSThietBi.NUOC_SAN_XUAT],
    'Năm sản xuất': rowthietbi[CONFIG.COLUMNS.DSThietBi.NAM_SAN_XUAT],
    'Năm sử dụng': rowthietbi[CONFIG.COLUMNS.DSThietBi.THOI_GIAN_SU_DUNG],
    'Tình trang thiết bị khảo sát': rowsc[CONFIG.COLUMNS.MainSC.TINH_TRANG_TB_KHAO_SAT] || '',
    'Kết luận khảo sát': rowsc[CONFIG.COLUMNS.MainSC.KET_LUAN_KHAO_SAT] || '',
    'Đề xuất phương án': rowsc[CONFIG.COLUMNS.MainSC.DE_XUAT_PHUONG_AN] || '',
    'QR_CODE': generateQRCodeUrl(id),
    'id': id
  };
  
  // Tạo tên file
  const fileName = `BM.VTTB.09.02 Biên bản khảo sát - ${id}`;
  
  // Tạo file từ template
  return createFileFromTemplate(CONFIG.TEMPLATES.BM_VTTB_09_02, templateData, fileName);
}

/**
 * Tạo báo cáo BM.VTTB.09.03 Giấy đề nghị phương án sửa chữa
 * @param {Object} data - Dữ liệu báo cáo
 * @returns {Object} URL của file đã tạo
 */
function createBM0903(data) {
  const { id, rowsc, rowthietbi, rowdvyc, rowusersc } = data;
  
  // Xử lý ngày
  const dateParts = {};
  
  // Ngày đề nghị
  if (rowsc[CONFIG.COLUMNS.MainSC.NGAY_DE_NGHI]) {
    const ngaydenghi = new Date(rowsc[CONFIG.COLUMNS.MainSC.NGAY_DE_NGHI]);
    dateParts.day_ngaydenghi = ngaydenghi.getDate();
    dateParts.month_ngaydenghi = ngaydenghi.getMonth() + 1;
    dateParts.year_ngaydenghi = ngaydenghi.getFullYear();
  } else {
    const now = new Date();
    dateParts.day_ngaydenghi = now.getDate();
    dateParts.month_ngaydenghi = now.getMonth() + 1;
    dateParts.year_ngaydenghi = now.getFullYear();
  }
  
  // Ngày đơn vị báo
  if (rowsc[CONFIG.COLUMNS.MainSC.THOI_GIAN_DV_BAO]) {
    const ngaydvbao = new Date(rowsc[CONFIG.COLUMNS.MainSC.THOI_GIAN_DV_BAO]);
    dateParts.day_ngaydvbao = ngaydvbao.getDate();
    dateParts.month_ngaydvbao = ngaydvbao.getMonth() + 1;
    dateParts.year_ngaydvbao = ngaydvbao.getFullYear();
  } else {
    const now = new Date();
    dateParts.day_ngaydvbao = now.getDate();
    dateParts.month_ngaydvbao = now.getMonth() + 1;
    dateParts.year_ngaydvbao = now.getFullYear();
  }
  
  // Ngày khảo sát
  if (rowsc[CONFIG.COLUMNS.MainSC.NGAY_KHAO_SAT]) {
    const ngaykhaosat = new Date(rowsc[CONFIG.COLUMNS.MainSC.NGAY_KHAO_SAT]);
    dateParts.day_ngaykhaosat = ngaykhaosat.getDate();
    dateParts.month_ngaykhaosat = ngaykhaosat.getMonth() + 1;
    dateParts.year_ngaykhaosat = ngaykhaosat.getFullYear();
  } else {
    const now = new Date();
    dateParts.day_ngaykhaosat = now.getDate();
    dateParts.month_ngaykhaosat = now.getMonth() + 1;
    dateParts.year_ngaykhaosat = now.getFullYear();
  }
  
  // Chuẩn bị dữ liệu thay thế
  const templateData = {
    ...dateParts,
    'Đơn vị yêu cầu': rowdvyc[CONFIG.COLUMNS.DSUserDV.DON_VI],
    'Quyết định tổ khảo sát': rowdvyc[CONFIG.COLUMNS.DSUserDV.QUYET_DINH_TO_KHAO_SAT] || '',
    'Tên thiết bị': rowthietbi[CONFIG.COLUMNS.DSThietBi.TEN_THIET_BI],
    'Model': rowthietbi[CONFIG.COLUMNS.DSThietBi.MODEL],
    'Serial': rowthietbi[CONFIG.COLUMNS.DSThietBi.SERIAL],
    'Hãng sản xuất': rowthietbi[CONFIG.COLUMNS.DSThietBi.HANG_SAN_XUAT],
    'Nước sản xuất': rowthietbi[CONFIG.COLUMNS.DSThietBi.NUOC_SAN_XUAT],
    'Năm sản xuất': rowthietbi[CONFIG.COLUMNS.DSThietBi.NAM_SAN_XUAT],
    'Năm sử dụng': rowthietbi[CONFIG.COLUMNS.DSThietBi.THOI_GIAN_SU_DUNG],
    'Tình trang thiết bị khảo sát': rowsc[CONFIG.COLUMNS.MainSC.TINH_TRANG_TB_KHAO_SAT] || '',
    'Kết luận khảo sát': rowsc[CONFIG.COLUMNS.MainSC.KET_LUAN_KHAO_SAT] || '',
    'Đề xuất phương án': rowsc[CONFIG.COLUMNS.MainSC.DE_XUAT_PHUONG_AN] || '',
    'Nội dung đề nghi': rowsc[CONFIG.COLUMNS.MainSC.NOI_DUNG_DE_NGHI] || '',
    'Người sửa chữa': rowusersc ? rowusersc[CONFIG.COLUMNS.DSUserSua.HO_TEN] : '',
    'QR_CODE': generateQRCodeUrl(id),
    'id': id
  };
  
  // Tạo tên file
  const fileName = `BM.VTTB.09.03 Giấy đề nghị phương án sửa chữa - ${id}`;
  
  // Tạo file từ template
  return createFileFromTemplate(CONFIG.TEMPLATES.BM_VTTB_09_03, templateData, fileName);
}

/**
 * Tạo báo cáo BM.VTTB.09.04 Biên bản bàn giao
 * @param {Object} data - Dữ liệu báo cáo
 * @returns {Object} URL của file đã tạo
 */
function createBM0904(data) {
  const { id, rowsc, rowthietbi, rowdvyc } = data;
  
  // Xử lý ngày bàn giao
  let day_ngaybangiao, month_ngaybangiao, year_ngaybangiao;
  
  if (rowsc[CONFIG.COLUMNS.MainSC.NGAY_BAN_GIAO]) {
    const ngaybangiao = new Date(rowsc[CONFIG.COLUMNS.MainSC.NGAY_BAN_GIAO]);
    day_ngaybangiao = ngaybangiao.getDate();
    month_ngaybangiao = ngaybangiao.getMonth() + 1;
    year_ngaybangiao = ngaybangiao.getFullYear();
  } else {
    const now = new Date();
    day_ngaybangiao = now.getDate();
    month_ngaybangiao = now.getMonth() + 1;
    year_ngaybangiao = now.getFullYear();
  }
  
  // Chuẩn bị dữ liệu thay thế
  const templateData = {
    'day_ngaybangiao': day_ngaybangiao,
    'month_ngaybangiao': month_ngaybangiao,
    'year_ngaybangiao': year_ngaybangiao,
    'quyetdinhtokhaosat': rowdvyc[CONFIG.COLUMNS.DSUserDV.QUYET_DINH_TO_KHAO_SAT] || '',
    'Đơn vị yêu cầu': rowdvyc[CONFIG.COLUMNS.DSUserDV.DON_VI],
    'Đại diện BV 1': rowdvyc[CONFIG.COLUMNS.DSUserDV.DAI_DIEN_BV_1] || '',
    'Chức vụ DD BV 1': rowdvyc[CONFIG.COLUMNS.DSUserDV.CHUC_VU_DD_BV_1] || '',
    'Đại diện BV 2': rowdvyc[CONFIG.COLUMNS.DSUserDV.DAI_DIEN_BV_2] || '',
    'Chức vụ DD BV 2': rowdvyc[CONFIG.COLUMNS.DSUserDV.CHUC_VU_DD_BV_2] || '',
    'Đại diện BV 3': rowdvyc[CONFIG.COLUMNS.DSUserDV.DAI_DIEN_BV_3] || '',
    'Chức vụ DD BV 3': rowdvyc[CONFIG.COLUMNS.DSUserDV.CHUC_VU_DD_BV_3] || '',
    'Đại diện BV 4': rowdvyc[CONFIG.COLUMNS.DSUserDV.DAI_DIEN_BV_4] || '',
    'Chức vụ DD BV 4': rowdvyc[CONFIG.COLUMNS.DSUserDV.CHUC_VU_DD_BV_4] || '',
    'Đại diện BV 5': rowdvyc[CONFIG.COLUMNS.DSUserDV.DAI_DIEN_BV_5] || '',
    'Chức vụ DD BV 5': rowdvyc[CONFIG.COLUMNS.DSUserDV.CHUC_VU_DD_BV_5] || '',
    'Đại diện ĐV Báo sửa 1': rowdvyc[CONFIG.COLUMNS.DSUserDV.DAI_DIEN_DV1_BAO_SUA_1] || '',
    'Chức vụ DD ĐV Báo sửa 1': rowdvyc[CONFIG.COLUMNS.DSUserDV.CHUC_VU_DD_DV1_BAO_SUA] || '',
    'Đại diện ĐV Báo sửa 2': rowdvyc[CONFIG.COLUMNS.DSUserDV.DAI_DIEN_DV2_BAO_SUA] || '',
    'Chức vụ DD ĐV Báo sửa 2': rowdvyc[CONFIG.COLUMNS.DSUserDV.CHUC_VU_DD_DV2_BAO_SUA] || '',
    'Tên thiết bị': rowthietbi[CONFIG.COLUMNS.DSThietBi.TEN_THIET_BI],
    'Model': rowthietbi[CONFIG.COLUMNS.DSThietBi.MODEL],
    'Serial': rowthietbi[CONFIG.COLUMNS.DSThietBi.SERIAL],
    'Hãng sản xuất': rowthietbi[CONFIG.COLUMNS.DSThietBi.HANG_SAN_XUAT],
    'Nước sản xuất': rowthietbi[CONFIG.COLUMNS.DSThietBi.NUOC_SAN_XUAT],
    'Năm sản xuất': rowthietbi[CONFIG.COLUMNS.DSThietBi.NAM_SAN_XUAT],
    'Năm sử dụng': rowthietbi[CONFIG.COLUMNS.DSThietBi.THOI_GIAN_SU_DUNG],
    'Tình trang thiết bị khảo sát': rowsc[CONFIG.COLUMNS.MainSC.TINH_TRANG_TB_KHAO_SAT] || '',
    'Tình trạng thiết bị bàn giao': rowsc[CONFIG.COLUMNS.MainSC.TINH_TRANG_TB_BAN_GIAO] || '',
    'QR_CODE': generateQRCodeUrl(id),
    'id': id
  };
  
  // Tạo tên file
  const fileName = `BM.VTTB.09.04 Biên bản bàn giao - ${id}`;
  
  // Tạo file từ template
  return createFileFromTemplate(CONFIG.TEMPLATES.BM_VTTB_09_04, templateData, fileName);
}

/**
 * Tạo URL QR code từ ID sửa chữa
 * @param {string} repairId - ID sửa chữa
 * @returns {string} URL hình ảnh QR code
 */
function generateQRCodeUrl(repairId) {
  // Sử dụng Google Chart API để tạo QR code
  const baseUrl = 'https://chart.googleapis.com/chart?';
  const params = {
    cht: 'qr',  // Loại biểu đồ: QR code
    chs: '200x200',  // Kích thước
    chl: repairId,  // Nội dung QR code
    chld: 'M|4'  // Error correction level và margin
  };
  
  // Tạo query string từ params
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  return baseUrl + queryString;
} 