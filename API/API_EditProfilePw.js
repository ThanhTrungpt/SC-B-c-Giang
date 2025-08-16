
function testchangePassword() {
  const params = {
    id: "UDV001",
    oldPassword: "a",
    newPassword: "matkhauMoi",
    history: "* 21:49:47 13/8/2025 - Đơn Vị Can Thiệp Mạch: Cập nhật thông tin",
    timeupdate: "21:49:47 13/8/2025"
  };
  const result = changePassword(params);
  console.log(result);
  // Call API to change password

}

function testeditProfile() {
const params = {
    donvi: "Đơn Vị Can Thiệp Mạch",
    id: "UDV001",
    // kihieu: "DVCTM",
    username: "b",
    history: "* 11:32:45 14/8/2025 - Đơn Vị Can Thiệp Mạch: Cập nhật thông tin đơn vị",
    timeupdate: "11:32:45 14/8/2025"
  };
    const result = editProfile(params);

  console.log(result);
  // Call API to edit profile

}


//editProfile
function editProfile(params) {
    try {
        // Lấy giá trị từ Google Sheet
        const ssUserData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DanhSach);
        const shUserData = ssUserData.getSheetByName(CONFIG_SHEET_NAMES.DSUserDV);
        const valUserData = shUserData.getDataRange().getValues();
        console.log("[editProfile] Lấy dữ liệu người dùng: " + JSON.stringify(valUserData));
        
        // // Kiểm tra ký hiệu có trùng không, nếu trùng thì trả về lỗi đã có ký hiệu trùng, đề nghị chọn ký hiệu khác
        // // Modify this to exclude the current user being edited
        // const existingUser = valUserData.findIndex(user => 
        //     user[CONFIG_COLUMNS.DSUserDV.kihieu] === params.kihieu && 
        //     user[CONFIG_COLUMNS.DSUserDV.id] !== params.id);
        // console.log("[editProfile] Kiểm tra ký hiệu: " + params.kihieu + ", Kết quả: " + JSON.stringify(existingUser));
        // if (existingUser !== -1) {
        //     return { status: "error", message: "Ký hiệu đã tồn tại, vui lòng chọn ký hiệu khác." };
        // }
        
        // Cập nhật thay đổi
        const userIndex = valUserData.findIndex(user => user[CONFIG_COLUMNS.DSUserDV.id] === params.id);
        console.log("[editProfile] Tìm kiếm người dùng với ID: " + params.id + ", Kết quả: " + userIndex);
        if (userIndex !== -1) {
            const userData = valUserData[userIndex];
            console.log("[editProfile] Cập nhật người dùng: " + JSON.stringify(userData));

            // Update the user data
            userData[CONFIG_COLUMNS.DSUserDV.donvi] = params.donvi;
            // userData[CONFIG_COLUMNS.DSUserDV.kihieu] = params.kihieu;
            userData[CONFIG_COLUMNS.DSUserDV.username] = params.username;
            userData[CONFIG_COLUMNS.DSUserDV.history] = params.history;
            userData[CONFIG_COLUMNS.DSUserDV.timeupdate] = params.timeupdate;

            shUserData.getRange(userIndex + 1, 1, 1, userData.length).setValues([userData]);
            console.log("[editProfile] Cập nhật người dùng thành công: " + JSON.stringify(userData));

            return { 
                status: "success", 
                message: "Cập nhật hồ sơ thành công.", 
                userIndex: userIndex, 
                rowUser: userData  // Đổi userData thành rowUser để đồng nhất với changePassword
            };
        } else {
            return { status: "error", message: "Không tìm thấy người dùng." };
        }
    } catch (error) {
        console.log("[editProfile] lỗi" + error.message);
        return { status: "error", message: "Cập nhật hồ sơ lỗi" + error.message };
    }   
}

//changePassword
function changePassword(params) {
  // Simulate API call
  console.log("Changing password with params:", params);
    try {
        // Lấy giá trị từ Google Sheet
        const ssUserData = SpreadsheetApp.openById(CONFIG_SpreadSheet_ID.idSH_DanhSach);
        const shUserData = ssUserData.getSheetByName(CONFIG_SHEET_NAMES.DSUserDV);
        const valUserData = shUserData.getDataRange().getValues();
        console.log("[changePassword] Lấy dữ liệu người dùng");
        // Tìm kiếm người dùng với ID
        const userIndex = valUserData.findIndex(user => user[CONFIG_COLUMNS.DSUserDV.id] === params.id);
        console.log("[changePassword] Tìm kiếm người dùng với ID: " + params.id + ", Kết quả: " + userIndex);

        if (userIndex !== -1) {
            const userData = valUserData[userIndex];
            
            // Kiểm tra mật khẩu cũ
            if (userData[CONFIG_COLUMNS.DSUserDV.pass] !== params.oldPassword) {
                return { status: "error", message: "Mật khẩu cũ không đúng." };
            }
            
            // Cập nhật mật khẩu mới
            userData[CONFIG_COLUMNS.DSUserDV.pass] = params.newPassword;
            userData[CONFIG_COLUMNS.DSUserDV.history] = params.history;
            userData[CONFIG_COLUMNS.DSUserDV.timeupdate] = params.timeupdate;
        // Lưu vào sheet
        shUserData.getRange(userIndex + 1, 1, 1, userData.length).setValues([userData]);
        console.log("[changePassword] Đổi mật khẩu thành công");
        
        return { 
            status: "success", 
            message: "Đổi mật khẩu thành công.", 
            userIndex: userIndex, 
            rowUser: userData 
        };
    } else {
        return { status: "error", message: "Không tìm thấy người dùng." };
        }
    } catch (error) {
        console.log("[changePassword] lỗi: " + error.message);
        return { status: "error", message: "Đổi mật khẩu lỗi: " + error.message };
    }
}
