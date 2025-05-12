//region các hàm gửi tin nhắn telegram
const mytele={
  token: "7875824905:AAGJ-GJj8C7xuCtUPXBr5UzwBQ9G8UkOMqA",
  token_SUACHUABOT:"7608333223:AAGaXXuSEmQuphnZ9YG-XeRlTaeC6EYoE2I",
  idgroup:"-4514885810",
  iduser_trung: "5468165152",
  iduser_nhuong: "5490483595"
  
}
//webhook: 
//nút bấm:  
function tele_sendsms_user(rowsc, rowtb, rowusersua, rowuserdv, CHAT_ID) {
  const BOT_TOKEN = mytele.token ; // Thay bằng Token của bot Telegram
  const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  // Nội dung mẫu
  // const maSuaChua = rowsc[mycol.DataSC.id];
  // const tinhTrang = rowsc[mycol.DataSC.tinhtrangtbdvbao];
  // const maThietBi = rowtb[mycol.DSThietBi.id];
  // const tenThietBi = rowtb[mycol.DSThietBi.tentb];
  // const model = rowtb[mycol.DSThietBi.model];
  // const serial = rowtb[mycol.DSThietBi.serial];
  // const nuocSanXuat = rowtb[mycol.DSThietBi.nuocsx];
  // const donViBao = rowuserdv[mycol.DSUserDV.donvi];
  // const nguoiBao = rowuserdv[mycol.DSUserDV.hoten];
  // const ngayBao = rowsc[mycol.DataSC.ngaydonvibao];
  // // const thoiGianBao = "10:00 AM";
  // const nguoiSua = rowusersua[mycol.DSUserSua.hoten];

  // Tạo nội dung tin nhắn
//   const message = `
// ⚠️ 🛠 ${maSuaChua}
// ♟ [Tình trạng máy hỏng]: ${tinhTrang}
// ♟ [Mã thiết bị]: ${maThietBi} ⚙️ [Tên thiết bị]: ${tenThietBi}
// ⚙️ [Model]: ${model} ⚙️ [Số serial]: ${serial} ⚙️ [Nước sản xuất]: ${nuocSanXuat}
// 🏚️ [Đơn vị báo]: ${donViBao}
// 👨‍🔧 [Họ và tên người báo sửa]: ${nguoiBao}
// 📅 [Ngày báo]: ${ngayBao}
// 👨‍🔧 [Họ và tên người sửa]: ${nguoiSua}
// ❤️👍💪❤️
// `;
  const message = `⚠️ ${rowsc[mycol.DataSC.id]} 🛠️ ${rowsc[mycol.DataSC.tinhtrangtbdvbao]} 🛠️
    ♟️${rowtb[mycol.DSThietBi.id]}⚙️${rowtb[mycol.DSThietBi.tentb]}⚙️${rowtb[mycol.DSThietBi.model]}⚙️${rowtb[mycol.DSThietBi.serial]}⚙️${rowtb[mycol.DSThietBi.nuocsx]}
    🏚️${rowuserdv[mycol.DSUserDV.donvi]}👨‍🔧${rowuserdv[mycol.DSUserDV.hoten]}📅[${rowsc[mycol.DataSC.ngaydonvibao]}
    👨‍🔧${rowusersua[mycol.DSUserSua.hoten]}​`;

  // Gửi tin nhắn
  const payload = {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: "HTML" // Định dạng HTML hoặc Markdown
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(API_URL, options);
  Logger.log(`Response: ${response.getContentText()}`);
}

function tele_sendsms_group(rowsc, rowtb, rowusersua, rowuserdv) {
  const BOT_TOKEN = mytele.token; // Thay bằng Token của bot Telegram
  const GROUP_CHAT_ID = mytele.idgroup; // Thay bằng Chat ID của nhóm
  const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  // Nội dung mẫu
  // const maSuaChua = rowsc[mycol.DataSC.id];
  // const tinhTrang = rowsc[mycol.DataSC.tinhtrangtbdvbao];
  // const maThietBi = rowtb[mycol.DSThietBi.id];
  // const tenThietBi = rowtb[mycol.DSThietBi.tentb];
  // const model = rowtb[mycol.DSThietBi.model];
  // const serial = rowtb[mycol.DSThietBi.serial];
  // const nuocSanXuat = rowtb[mycol.DSThietBi.nuocsx];
  // const donViBao = rowuserdv[mycol.DSUserDV.donvi];
  // const nguoiBao = rowuserdv[mycol.DSUserDV.hoten];
  // const ngayBao = rowsc[mycol.DataSC.ngaydonvibao];
  // // const thoiGianBao = "10:00 AM";
  // const nguoiSua = rowusersua[mycol.DSUserSua.hoten];

  // Tạo nội dung tin nhắn
//   const message = `
// ⚠️ [Mã sửa chữa] 🛠 ${maSuaChua}
// ♟ [Tình trạng máy hỏng]: ${tinhTrang}
// ♟ [Mã thiết bị]: ${maThietBi} ⚙️ [Tên thiết bị]: ${tenThietBi}
// ⚙️ [Model]: ${model} ⚙️ [Số serial]: ${serial} ⚙️ [Nước sản xuất]: ${nuocSanXuat}
// 🏚️ [Đơn vị báo]: ${donViBao}
// 👨‍🔧 [Họ và tên người báo sửa]: ${nguoiBao}
// 📅 [Ngày báo]: ${ngayBao}
// 👨‍🔧 [Họ và tên người sửa]: ${nguoiSua}
// ❤️👍💪❤️
// `;
  const message = `⚠️ ${rowsc[mycol.DataSC.id]} 🛠️ ${rowsc[mycol.DataSC.tinhtrangtbdvbao]} 🛠️
    ♟️${rowtb[mycol.DSThietBi.id]}⚙️${rowtb[mycol.DSThietBi.tentb]}⚙️${rowtb[mycol.DSThietBi.model]}⚙️${rowtb[mycol.DSThietBi.serial]}⚙️${rowtb[mycol.DSThietBi.nuocsx]}
    🏚️${rowuserdv[mycol.DSUserDV.donvi]}👨‍🔧${rowuserdv[mycol.DSUserDV.hoten]}📅[${rowsc[mycol.DataSC.ngaydonvibao]}
    👨‍🔧${rowusersua[mycol.DSUserSua.hoten]}​`;

  // Gửi tin nhắn
  const payload = {
    chat_id: GROUP_CHAT_ID,
    text: message,
    parse_mode: "HTML" // Định dạng HTML hoặc Markdown
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  try {
    const response = UrlFetchApp.fetch(API_URL, options);
    Logger.log(`Response: ${response.getContentText()}`);
  } catch (error) {
    Logger.log(`Error: ${error.message}`);
  }
}

function tele_sendsms(){
  
    var body  = ref
    var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + mytele.token + "/sendMessage?text=" + encodeURIComponent(body) + "&chat_id=" + mytele.idgroup + "&parse_mode=HTML");
    return response
}
function tele_getChatId() {
  const BOT_TOKEN =mytele.token;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=0`;
  // Gửi yêu cầu đến Telegram API
  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  // if (data.ok && data.result.length > 0) {
  //   data.result.forEach(update => {
  //     const chatId = parseInt(update.message.chat.id); // Chat ID
  //     const userId = parseInt(update.message.from.id); // User ID
  //     const firstName = update.message.from.first_name || "No name";
  //     const text = update.message.text || "No text";

  //     Logger.log(`Chat ID: ${chatId}, User ID: ${userId}, Name: ${firstName}, Message: ${text}`);
  //   });
  // } else {
  //   Logger.log("Không có dữ liệu mới.");
  // }
  if (data.ok && data.result.length > 0) {
    var sheet = SpreadsheetApp.openById(myid.id_filedata).getSheetByName("TELEUSER")
    if (!sheet) {
      Logger.log(`Sheet TELEUSER không tồn tại.`);
      return;
    }

    const header = ["First Name", "User ID", "Username"]; // Tiêu đề
    const existingData = sheet.getDataRange().getValues(); // Lấy toàn bộ dữ liệu từ sheet
    const existingUserIds = new Set(existingData.slice(1).map(row => row[1])); // Bỏ qua tiêu đề, kiểm tra User ID

    // Thêm tiêu đề nếu chưa có
    if (existingData.length === 0 || existingData[0][0] !== header[0]) {
      sheet.insertRowBefore(1).getRange(1, 1, 1, header.length).setValues([header]);
    }

    const newRows = []; // Lưu trữ các hàng dữ liệu mới
    data.result.forEach(update => {
      if (update.message) {
        const userId = parseInt(update.message.from.id); // User ID
        const username = update.message.from.username || "No username";
        const firstName = update.message.from.first_name || "No name";

        // Kiểm tra nếu user ID chưa tồn tại
        if (!existingUserIds.has(userId)) {
          newRows.push([firstName, userId, username]); // Thêm dòng mới vào mảng
          existingUserIds.add(userId); // Cập nhật vào Set để tránh trùng lặp
        }
      }
    });

    // Ghi toàn bộ dữ liệu mới vào sheet một lần
    if (newRows.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, newRows[0].length).setValues(newRows);
      Logger.log(`Đã thêm ${newRows.length} dòng mới.`);
    } else {
      Logger.log("Không có dữ liệu mới để thêm.");
    }
  } else {
    Logger.log("Không có dữ liệu mới từ Telegram API.");
  }
}

