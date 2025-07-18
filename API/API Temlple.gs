const SHEET_NAME = "Users";

function doPost(e) {
  const params = e.parameter;
  const action = params.action;

  let result;

  switch (action) {
    case "signup":
      result = signup(params);
      break;
    case "login":
      result = login(params);
      break;
    case "getProfile":
      result = getProfile(params);
      break;
    default:
      result = { status: "error", message: "Unknown action" };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ======= CHỨC NĂNG =======

// ✅ Signup - thêm user nếu chưa có
function signup(params) {
  const email = params.email;
  const password = params.password;

  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  // kiểm tra email đã tồn tại chưa
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      return { status: "error", message: "Email đã tồn tại!" };
    }
  }

  sheet.appendRow([email, password, new Date()]);
  return { status: "success", message: "Đăng ký thành công!" };
}

// ✅ Login - kiểm tra email và password
function login(params) {
  const email = params.email.trim();
  const password = params.password.trim();

  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const rowEmail = data[i][0].toString().trim();
    const rowPass = data[i][1].toString().trim();

    if (rowEmail === email && rowPass === password) {
      return {
        status: "success",
        message: "Đăng nhập thành công!",
        user: {
          email: rowEmail,
          createdAt: data[i][2]
        }
      };
    }
  }

  return { status: "error", message: "Sai email hoặc mật khẩu." };
}


// ✅ getProfile - lấy thông tin user theo email
function getProfile(params) {
  const email = params.email;

  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      return {
        status: "success",
        user: {
          email: data[i][0],
          password: data[i][1],
          createdAt: data[i][2]
        }
      };
    }
  }

  return { status: "error", message: "Không tìm thấy user." };
}

// === Hàm tiện ích ===
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Email", "Password", "CreatedAt"]);
  }
  return sheet;
}
