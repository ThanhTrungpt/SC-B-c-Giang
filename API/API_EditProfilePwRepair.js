
function testeditProfileRepair() {
  const params = {
    donvi: "Phòng Vật tư",
    email: "email1@gmail.com",
    history: "* 23:38:31 16/8/2025 - Phạm Thành Test: Cập nhật thông tin người sửa chữa",
    hoten: "Phạm Thành Test",
    id: "USC001",
    sdt: "038 994 3573",
    timeupdate: "Sat Aug 16 2025 23:38:31 GMT+0700 (Giờ Đông Dương)",
    username: "b",
    usetele: "5468165152"
  };
  const result = editProfileRepair(params);
  console.log(result);
  // Call API to change password

}

function testchangePasswordRepair() {
const params = {
    history: "* 23:48:15 16/8/2025 - Phạm Thành Test: Đổi mật khẩu",
    id: "USC001",
    newPassword: "b",
    oldPassword: "a",
    timeupdate: "Sat Aug 16 2025 23:48:15 GMT+0700 (Giờ Đông Dương)"
};
    const result = changePasswordRepair(params);

  console.log(result);
  // Call API to edit profile

}


//editProfile
function editProfileRepair(params) {
    try {
        // Lấy giá trị từ Google Sheet
        const ssUserData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DanhSach);
        const shUserData = ssUserData.getSheetByName(CONFIG_SHEET_NAMES.DSUserSua);
        const valUserData = shUserData.getDataRange().getValues();
        console.log("[editProfile] Lấy dữ liệu người dùng sửa chữa: " + JSON.stringify(valUserData));
        
        // Cập nhật thay đổi
        const userIndex = valUserData.findIndex(user => user[CONFIG_COLUMNS.DSUserSua.id] === params.id);
        console.log("[editProfile] Tìm kiếm người dùng sửa chữa với ID: " + params.id + ", Kết quả: " + userIndex);
        if (userIndex === -1) {
            return { status: "error", message: "Không tìm thấy người dùng sửa chữa." };
        }
        const userData = valUserData[userIndex];
        console.log("[editProfile] Cập nhật người dùng sửa chữa: " + JSON.stringify(userData));

        // Update the user data
        userData[CONFIG_COLUMNS.DSUserSua.donvi] = params.donvi;
        userData[CONFIG_COLUMNS.DSUserSua.hoten] = params.hoten;
        userData[CONFIG_COLUMNS.DSUserSua.email] = params.email;
        userData[CONFIG_COLUMNS.DSUserSua.sdt] = params.sdt;
        userData[CONFIG_COLUMNS.DSUserSua.usetele] = params.usetele;
        userData[CONFIG_COLUMNS.DSUserSua.username] = params.username;
        userData[CONFIG_COLUMNS.DSUserSua.history] += "\n" + params.history;
        userData[CONFIG_COLUMNS.DSUserSua.timeupdate] = params.timeupdate;

        shUserData.getRange(userIndex + 1, 1, 1, userData.length).setValues([userData]);
        console.log("[editProfile] Cập nhật người dùng sửa chữa thành công: " + JSON.stringify(userData));
        return { 
            status: "success", 
            message: "Cập nhật hồ sơ thành công.", 
            userIndex: userIndex, 
            rowUser: userData  
        };
    } catch (error) {
        console.log("[editProfile] lỗi" + error.message);
        return { status: "error", message: "Cập nhật hồ sơ lỗi" + error.message };
    }   
}

//changePassword
function changePasswordRepair(params) {
  // Simulate API call
  console.log("Changing password with params:", params);
try {
    // Lấy giá trị từ Google Sheet
    const ssUserData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DanhSach);
    const shUserData = ssUserData.getSheetByName(CONFIG_SHEET_NAMES.DSUserSua);
    const valUserData = shUserData.getDataRange().getValues();
    console.log("[changePassword] Lấy dữ liệu người dùng sửa chữa");
    // Tìm kiếm người dùng với ID
    const userIndex = valUserData.findIndex(user => user[CONFIG_COLUMNS.DSUserSua.id] === params.id);
    console.log("[changePassword] Tìm kiếm người dùng sửa chữa với ID: " + params.id + ", Kết quả: " + userIndex);

    if (userIndex === -1) {
        return { status: "error", message: "Không tìm thấy người dùng sửa chữa." };
    } 
    const userData = valUserData[userIndex];
    
    // Kiểm tra mật khẩu cũ
    if (userData[CONFIG_COLUMNS.DSUserSua.pass] !== params.oldPassword) {
        return { status: "error", message: "Mật khẩu cũ không đúng." };
    }
    
    // Cập nhật mật khẩu mới
    userData[CONFIG_COLUMNS.DSUserSua.pass] = params.newPassword;
    userData[CONFIG_COLUMNS.DSUserSua.history] += "\n" + params.history;
    userData[CONFIG_COLUMNS.DSUserSua.timeupdate] = params.timeupdate;
    // Lưu vào sheet
    shUserData.getRange(userIndex + 1, 1, 1, userData.length).setValues([userData]);
    console.log("[changePassword] Đổi mật khẩu thành công");
    
    return { 
        status: "success", 
        message: "Đổi mật khẩu thành công.", 
        userIndex: userIndex, 
        rowUser: userData 
    };
    } catch (error) {
        console.log("[changePassword] lỗi: " + error.message);
        return { status: "error", message: "Đổi mật khẩu lỗi: " + error.message };
    }
}
