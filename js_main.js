import { CONFIG_COLUMNS } from "./config.js";
import { CONFIG_ENUM } from "./config.js";

const API_URL = "https://script.google.com/macros/s/AKfycbyD6LqYk_R6oDJd9jlyGjqJmOqBfCIHJGO8_HHpxVJ03vSgjobnBhQWbMLVaBx_uUNNew/exec";

// #region *** Global data variables ***
let userData = {};
let appData = {};
let currRepair;
// #endregion

// #region * Get Element
// Frame Loading
const frmloading = document.getElementById('frmloading');

// Frame Login
const frmlogin = document.getElementById('frmlogin');
const btnLoginSubmit = document.getElementById('btnLoginSubmit');

// Frame Main
const frmainApp = document.getElementById('frmainApp');
//frmainApp.style.display = "block";
//frmainApp.style.display = "none";

// Head -- Frame Main
const userNametxt = document.getElementById('txtuserName');
const userAvatarimg = document.getElementById('imguserAvatar');

const btnFreshData = document.getElementById('btnFreshData');
const btnEdituser = document.getElementById('btnEdituser');
const btnChangePw = document.getElementById('btnChangePw');
const btnLogout = document.getElementById('btnLogout');

// Nút bấm, tìm kiếm -- Frame Main
const btnAddRepair = document.getElementById('btnAddRepair');
const txtsearchInput = document.getElementById('txtsearchInput');
const btnSearch = document.getElementById('btnSearch');
const btnSearchCancel = document.getElementById('btnSearchCancel');

// Tabs -- Frame Main
const tabRepairDeNghi = document.getElementById('tabRepairDeNghi');
const tabRepairKhaoSat = document.getElementById('tabRepairKhaoSat');
const tabRepairDangsua = document.getElementById('tabRepairDangsua');
const tabRepairBaohanh = document.getElementById('tabRepairBaohanh');
const tabRepairSuangoai = document.getElementById('tabRepairSuangoai');

// TableBody -- Frame Main
const TableBodyDeNghi = document.getElementById('TableBodyDeNghi');
const TableBodyKhaosat = document.getElementById('TableBodyKhaosat');
const TableBodyDangsua = document.getElementById('TableBodyDangsua');
const TableBodyBaohanh = document.getElementById('TableBodyBaohanh');
const TableBodySuangoai = document.getElementById('TableBodySuangoai');

// Repair Modal
const FormRepairModal = document.getElementById('FormRepairModal');
const FormRepairModalTitle = document.getElementById('FormRepairModalTitle');

// Nhóm Đơn vị yêu cầu -- Repair Modal
const mrDepartmentName = document.getElementById('mrDepartmentName');
const mrRequesterName = document.getElementById('mrRequesterName');
const mrRequesterPhone = document.getElementById('mrRequesterPhone');
// Nhóm Người sửa chữa -- Repair Modal
const mrRepairerName = document.getElementById('mrRepairerName');
const mrRepairerPhone = document.getElementById('mrRepairerPhone');
// Nhóm Thông tin thiết bị -- Repair Modal
const mrDeviceGroup = document.getElementById('mrDeviceGroup');
const mrDeviceID = document.getElementById('mrDeviceID');
const mrDeviceName = document.getElementById('mrDeviceName');
const mrManufacturer = document.getElementById('mrManufacturer');
const mrModel = document.getElementById('mrModel');
const mrSerial = document.getElementById('mrSerial');
const mrYearManufactured = document.getElementById('mrYearManufactured');
const mrYearInUse = document.getElementById('mrYearInUse');
const mrLocation = document.getElementById('mrLocation');
const mrWarrantyExpiry = document.getElementById('mrWarrantyExpiry');
const mrRequirementLevel = document.getElementById('mrRequirementLevel');
const mrDeviceStatus = document.getElementById('mrDeviceStatus');


// Button
const btnModalRepairNew = document.getElementById('btnModalRepairNew');
// Nhóm Ghi chú -- Repair Modal
const mrNote = document.getElementById('mrNote');
// #endregion


// *** Add Event Listener ***
// Add Event Loading...
document.addEventListener('DOMContentLoaded', async () => {
  // Load data
  try {
    console.log("Vào Loading...");
    appData = 0;
    appData = await JSON.parse(localStorage.getItem("storeAppData"));
  } catch (error) {
    console.error("Lỗi:", error);
    appData = 0;
  }
  if (!appData) {
    console.log("Vao API");
    appData = await sendFormAPI("getdata");
    localStorage.setItem("storeAppData", JSON.stringify(appData));
  }

  // Ẩn loading screen
  frmloading.style.display = "none";

  // Kiểm tra dữ liệu LocalStorage
  try {
    userData = await JSON.parse(localStorage.getItem("storeUserData"));
  } catch (error) {
    console.error("Lỗi:", error);
    userData = 0;
  }
  if (userData) {
    UpdateTablesRepair();
    updateUserInfo();
    updateSuggestionInRepairModal();
    // Ẩn phần đăng nhập Hiển thị phần chính
    frmlogin.style.display = "none";
    frmainApp.style.display = "block";
  }
});


// Add Event button Login Submit
  btnLoginSubmit.addEventListener('click', async () => {
  // Get Elements
  const txtUsername = document.getElementById('txtLoginUsername').value;
  const txtPassword = document.getElementById('txtLoginUPassword').value;
  const cbLocalstorage = document.getElementById('cbLocalstorage').checked;

  if (!txtUsername || !txtPassword) {
    showwarning("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // Kiểm tra dữ liệu trong DSUserDV
  let user = null;
  for (const row of appData.DSUserDV) {
    if (
      row[CONFIG_COLUMNS.DSUserDV.username] === txtUsername &&
      row[CONFIG_COLUMNS.DSUserDV.pass] === txtPassword
    ) {
      user = row;
      break;
    }
  }
  if (!user) {
    showwarning("Tên đăng nhập hoặc mật khẩu không đúng!");
    return;
  }

  // Lưu thông tin người dùng vào biến userData
  userData = {
    id: user[CONFIG_COLUMNS.DSUserDV.id],
    donvi: user[CONFIG_COLUMNS.DSUserDV.donvi],
    kihieu: user[CONFIG_COLUMNS.DSUserDV.kihieu],
    email: user[CONFIG_COLUMNS.DSUserDV.email],
    username: user[CONFIG_COLUMNS.DSUserDV.username],
    logo: user[CONFIG_COLUMNS.DSUserDV.logo],
  };

  // Chuyển sang trang chính
  UpdateTablesRepair();
  updateUserInfo();
  frmlogin.style.display = "none";
  frmainApp.style.display = "block";

  // Kiểm tra cbLocalstorage - Luu LocalStorage
  if (cbLocalstorage) {
    localStorage.setItem("storeUserData", JSON.stringify(userData));
  }
});

// #region *** Add Event Nav (tiêu đề) ***
// Add Event  btnLogout
  btnLogout.addEventListener('click', () => {
  // Xóa dữ liệu người dùng khỏi localStorage
  // Ask for confirmation before logging out
  showConfirm("Bạn có chắc chắn muốn đăng xuất?", "Xác nhận đăng xuất")
    .then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with logout
        localStorage.removeItem("storeUserData");
        // Hiển thị lại phần đăng nhập
        frmlogin.style.display = "block";
        frmainApp.style.display = "none";
        // Reset userData
        userData = {};
      }
    });
});

// Add Event btnFreshData
btnFreshData.addEventListener('click', async () => {
  // Refresh data
  // Hiển thị loading
  frmloading.style.display = "flex";
  appData = await sendFormAPI("getdata");
  
  //Note!!
  localStorage.setItem("storeAppData", JSON.stringify(appData));

  UpdateTablesRepair();
  // Ẩn loading
  frmloading.style.display = "none";
});

// Add Event btnEdituser
btnEdituser.addEventListener('click', () => {
  console.log("Chức năng chỉnh sửa người dùng chưa được triển khai.");
});


// Add Event btnChangePw
btnChangePw.addEventListener('click', () => {
  // Hiển thị modal đổi mật khẩu
  console.log("Chức năng đổi mật khẩu chưa được triển khai.");
});
// #endregion

// #region *** Add Event Add Search Repair ***
// Add Event btnSearch
btnSearch.addEventListener('click', () => {
  const searchString = txtsearchInput.value.trim();
  if (!searchString) {
    showwarning("Vui lòng nhập từ khóa tìm kiếm!");
    return;
  }
  // Define tables, tab IDs, and tab names
  const allTables = [TableBodyDeNghi, TableBodyKhaosat, TableBodyDangsua, TableBodyBaohanh, TableBodySuangoai];
  const tabIds = [tabRepairDeNghi, tabRepairKhaoSat, tabRepairDangsua, tabRepairBaohanh, tabRepairSuangoai];
  const tabNames = ["Đề nghị sửa chữa", "Khảo sát tình trạng thiết bị hỏng", "Đang sửa", "Bảo hành", "Sửa ngoài"];

  try {
    // Convert search string to lowercase for case-insensitive comparison
    const searchTerm = searchString.toLowerCase();
    let totalMatchCount = 0;
    let matchCountPerTab = [0, 0, 0, 0, 0];

    // Search in each tab and count matches
    allTables.forEach((tableBody, index) => {
      const rows = tableBody.getElementsByTagName('tr');
      console.log(`Searching in tab: ${tabNames[index]} with ${rows.length} rows`);

      for (let i = 0; i < rows.length; i++) {
        const content = rows[i].innerText.toLowerCase();
        if (content.includes(searchTerm)) {
          rows[i].style.display = '';
          totalMatchCount++;
          matchCountPerTab[index]++;
        } else {
          rows[i].style.display = 'none';
        }
      }

      // Update tab name with match count
      tabIds[index].textContent = `${tabNames[index]} (${matchCountPerTab[index]})`;
    });

    if (totalMatchCount === 0) {
      showwarning("Không tìm thấy kết quả phù hợp");
    } else {
      // Create a detailed message with counts per tab
      let detailMessage = `Tìm thấy ${totalMatchCount} kết quả phù hợp:\n`;
      allTables.forEach((tableBody, index) => {
        if (matchCountPerTab[index] > 0) {
          detailMessage += `\n- ${tabNames[index]}: ${matchCountPerTab[index]} kết quả`;
        }
      });

      showsucces(detailMessage);
    }
  } catch (error) {
    showerror('Lỗi khi lọc dữ liệu tìm kiếm: ' + error.message);
  }
});

// Add Event btnSearchCancel
btnSearchCancel.addEventListener('click', () => {
  txtsearchInput.value = '';
  UpdateTablesRepair();
  showsucces("Đã hủy tìm kiếm và hiển thị lại tất cả dữ liệu");
});

// Add Event btnAddRepair
btnAddRepair.addEventListener('click', () => {
  console.log("Chức năng thêm báo hỏng.");
  FormRepairModalTitle.textContent = "Thêm báo hỏng vào tạo Biên bản đề nghị sửa chữa";
});
// #endregion

// #region *** Add Event Form Repair Modal ***
// Add Event mrRepairerName
mrRepairerName.addEventListener('change', () => {
  const valSelectedRepairer = mrRepairerName.value;
  const selectedRepairer = appData.DSUserSua.find(item => item[CONFIG_COLUMNS.DSUserSua.id] === valSelectedRepairer);
  if (selectedRepairer) {
    mrRepairerPhone.value = selectedRepairer[CONFIG_COLUMNS.DSUserSua.sdt];
  }
});

// Add Event mrDeviceGroup
mrDeviceGroup.addEventListener('change', () => {
  const valSelectedGroup = mrDeviceGroup.value;
  console.log("Đã chọn nhóm thiết bị:", valSelectedGroup);
  console.log("Danh sách nhóm thiết bị:", userData.donvi);
  console.log("Danh sách thiết bị:", appData.DSThietBi);
  // Lọc danh sách thiết bị theo nhóm đã chọn và đơn vị
  const filteredDevices = appData.DSThietBi.filter(item => item[CONFIG_COLUMNS.DSThietBi.nhomtb] === valSelectedGroup && item[CONFIG_COLUMNS.DSThietBi.donvi] === userData.id);
  console.log("Danh sách thiết bị sau khi lọc:", filteredDevices);
  // thêm vào list thiết bị select mrDeviceID
  // Clear existing options in the device ID dropdown
  mrDeviceID.innerHTML = '<option value="">-- Chọn thiết bị --</option>';

  // Add filtered devices to the dropdown
  filteredDevices.forEach(device => {
    const newOption = document.createElement('option');
    newOption.value = device[CONFIG_COLUMNS.DSThietBi.id];
    newOption.textContent = `${device[CONFIG_COLUMNS.DSThietBi.mathietbi]} - ${device[CONFIG_COLUMNS.DSThietBi.tentb]}`;
    mrDeviceID.appendChild(newOption);
    console.log(`Thêm thiết bị: ${device[CONFIG_COLUMNS.DSThietBi.mathietbi]} - ${device[CONFIG_COLUMNS.DSThietBi.tentb]}`);
  });
  // Reset device details
  // Reset device details when changing device group
  mrDeviceName.value = '';
  mrManufacturer.value = '';
  mrModel.value = '';
  mrSerial.value = '';
  mrYearManufactured.value = '';
  mrYearInUse.value = '';
  mrLocation.value = '';
  mrWarrantyExpiry.value = '';
});

// Add Event mrDeviceID
mrDeviceID.addEventListener('change', () => {
  const selectedDeviceId = mrDeviceID.value;
  const selectedDevice = appData.DSThietBi.find(item => item[CONFIG_COLUMNS.DSThietBi.id] === selectedDeviceId);
  if (selectedDevice) {
    mrDeviceName.value = selectedDevice[CONFIG_COLUMNS.DSThietBi.tentb];
    mrManufacturer.value = selectedDevice[CONFIG_COLUMNS.DSThietBi.hangsx];
    mrModel.value = selectedDevice[CONFIG_COLUMNS.DSThietBi.model];
    mrSerial.value = selectedDevice[CONFIG_COLUMNS.DSThietBi.serial];
    mrYearManufactured.value = selectedDevice[CONFIG_COLUMNS.DSThietBi.namsx];
    mrYearInUse.value = selectedDevice[CONFIG_COLUMNS.DSThietBi.namsd];
    mrLocation.value = selectedDevice[CONFIG_COLUMNS.DSThietBi.vitri];
    mrWarrantyExpiry.value = selectedDevice[CONFIG_COLUMNS.DSThietBi.hanbh];
  }
});

// btnModalRepairNew - Tạo mới đề nghị báo hỏng </br>và Biên bản
btnModalRepairNew.addEventListener('click', () => {
  console.log("Chức năng tạo mới đề nghị báo hỏng.");
  const isValid = validateRepairModal(CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA);
  if (!isValid) {
    return; // Ngừng thực hiện nếu không hợp lệ
  }
  // Nếu tất cả các trường đều hợp lệ, thực hiện tạo mới
  const resultAPI = sendFormAPI ("addnewrepair", {
    repairerName: mrRepairerName.value,
    repairerPhone: mrRepairerPhone.value,
    deviceID: mrDeviceID.value,
    // Thêm các trường khác nếu cần
  });
  console.log("Đề nghị báo hỏng mới:", resultAPI);
  showloading();
});

// #endregion  *** Add Event Form Repair Modal ***


// #region **** Function Message box ****
//Hàm hiển thị thông báo message box
function showerror(message) {
  Swal.fire({
    icon: 'error',
    title: 'Thông báo',
    text: message,
    confirmButtonText: 'Đồng ý',
  });
}
function showwarning(message) {
  Swal.fire({
    icon: 'warning',
    title: 'Thông báo',
    text: message,
    confirmButtonText: 'Đồng ý',
  });
}
function showinfor(message) {
  Swal.fire({
    icon: 'info',
    title: 'Thông báo',
    text: message,
    confirmButtonText: 'Đồng ý',
  });
}
function showsucces(message) {
  Swal.fire({
    icon: 'success',
    title: 'Thông báo',
    text: message,
    confirmButtonText: 'Đồng ý',
  });
}
function showConfirm(message, title, txtConfirm = "Có", txtCancel = "Không") {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: txtConfirm,
    cancelButtonText: txtCancel
  });
}
function showloading(message = "Đang xử lý...") {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
}
// #endregion

// sendFormAPI
async function sendFormAPI(action, fields) {
  const formData = new FormData();
  formData.append("action", action);
  if (fields) {
    for (const key in fields) {
      formData.append(key, fields[key]);
    }
  }
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData
    });
    return await res.json();

  } catch (err) {
    console.log({ status: "error API", message: err.message });
  }
}

// Update user info in the header
function updateUserInfo() {
  userNametxt.textContent = userData.donvi;
  userAvatarimg.src = `https://drive.google.com/thumbnail?id=${userData.logo}&sz=s100` || "https://drive.google.com/thumbnail?id=1Y2obUC2vpgQLsD1JokCX8QY4olp3LjXe&sz=s100"; // Placeholder if logo is not set
  //https://drive.google.com/thumbnail?id=1Y2obUC2vpgQLsD1JokCX8QY4olp3LjXe&sz=s100
}

// Ghi các đề xuất trong modal Repair
function updateSuggestionInRepairModal() {
  // Tên đơn vị
  mrDepartmentName.value = userData.donvi;

  // Lọc danh sách DataSC theo đơn vị
  const filteredDataSC = appData.DataSC.filter(item => item[CONFIG_COLUMNS.DataSC.iduserdv] === userData.id);
  //Người yêu cầu mrRequesterName
  const uniqueNames = [...new Set(filteredDataSC.map(item => item[CONFIG_COLUMNS.DataSC.hotenYeucau]))];
  const mrRequesterNameList = document.getElementById('mrRequesterNameList');
  uniqueNames.forEach(name => {
    const newOption = document.createElement('option');
    newOption.value = name;
    mrRequesterNameList.appendChild(newOption);
  });

  // Số điện thoại người yêu cầu mrRequesterPhone
  const uniquePhones = [...new Set(filteredDataSC.map(item => item[CONFIG_COLUMNS.DataSC.sdtYeucau]))];
  const mrRequesterPhoneList = document.getElementById('mrRequesterPhoneList');
  uniquePhones.forEach(phone => {
    const newOption = document.createElement('option');
    newOption.value = phone;
    mrRequesterPhoneList.appendChild(newOption);
  });

  
  // Người sửa chữa mrRepairerName trong appData.DSUserSua
  appData.DSUserSua.slice(1).forEach(user => {
    const newOption = document.createElement('option');
    newOption.value = user[CONFIG_COLUMNS.DSUserSua.id];
    newOption.textContent = user[CONFIG_COLUMNS.DSUserSua.hoten];
    mrRepairerName.appendChild(newOption);
  });

  // Lọc danh sách thiết bị theo đơn vị và trạng thái Em011 Bình thường
  const filteredDevices = appData.DSThietBi.filter(item => item[CONFIG_COLUMNS.DSThietBi.donvi] === userData.id && item[CONFIG_COLUMNS.DSThietBi.tinhtrang] === CONFIG_ENUM.TINHTRANG_THIETBI.BINH_THUONG);
  // CONFIG_COLUMNS.DSThietBi.donvi CONFIG_COLUMNS.DSThietBi.tinhtrang
  // Lọc nhóm thiết bị set theo filteredDevices
  const uniqueDeviceGroups = [...new Set(filteredDevices.map(item => item[CONFIG_COLUMNS.DSThietBi.nhomtb]))];
  // Thêm các nhóm thiết bị vào danh sách nhóm thiết bị 
  uniqueDeviceGroups.forEach(group => {
    const newOption = document.createElement('option');
    newOption.value = group;
    newOption.textContent = appData.DSNhomTB.find(item => item[CONFIG_COLUMNS.DSNhomTB.id] === group)[CONFIG_COLUMNS.DSNhomTB.nhomtb];
    mrDeviceGroup.appendChild(newOption);
  });

  // Tình trạng thiết bị mrDeviceStatus
  const uniqueDeviceStatuses = [...new Set(filteredDataSC.map(item => item[CONFIG_COLUMNS.DataSC.tinhtrangtbdvbao]))];
  const mrDeviceStatusList = document.getElementById('mrDeviceStatusList');
  uniqueDeviceStatuses.forEach(status => {
    const newOption = document.createElement('option');
    newOption.value = status;
    newOption.textContent = status;
    mrDeviceStatusList.appendChild(newOption);
  });
}

// Kiểm Validation các trường trong Repair Modal
function validateRepairModal(TrangThai = CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA) {

  switch (TrangThai) {
    case CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA:
      if (!mrRequesterName.value || mrRequesterName.value.trim() === "") {
          mrRequesterName.focus();
          showwarning("Vui lòng điền thông tin: Tên người yêu cầu");
          return false;
        }
        if (!mrRequesterPhone.value || mrRequesterPhone.value.trim() === "") {
          mrRequesterPhone.focus();
          showwarning("Vui lòng điền thông tin: Số điện thoại người yêu cầu");
          return false;
        }
        if (!mrRepairerName.value || mrRepairerName.value.trim() === "") {
          mrRepairerName.focus();
          showwarning("Vui lòng chọn người sửa chữa");
          return false;
        }
        if (!mrDeviceGroup.value || mrDeviceGroup.value.trim() === "") {
          mrDeviceGroup.focus();
          showwarning("Vui lòng chọn nhóm thiết bị");
          return false;
        }
        if (!mrDeviceID.value || mrDeviceID.value.trim() === "") {
          mrDeviceID.focus();
          showwarning("Vui lòng chọn Mã thiết bị");
          return false;
        }
        if (!mrDeviceStatus.value || mrDeviceStatus.value.trim() === "") {
          mrDeviceStatus.focus();
          showwarning("Vui lòng điền thông tin: Tình trạng thiết bị");
          return false;
        }
        if (!mrRequirementLevel.value || mrRequirementLevel.value.trim() === "") {
          mrRequirementLevel.focus();
          showwarning("Vui lòng chọn Mức độ yêu cầu");
          return false;
        }
    case CONFIG_ENUM.TRANGTHAI.KHAO_SAT:
      break;
    case CONFIG_ENUM.TRANGTHAI.DANG_SUA:
      break;
    case CONFIG_ENUM.TRANGTHAI.BAO_HANH:
      break;
    case CONFIG_ENUM.TRANGTHAI.SUA_NGOAI:
      break;
    default:
  }

  return true;
}

// Cập nhật thông tin Repair
function UpdateTablesRepair() {
  // Hiển thị các bảng
  UpdatetableRepair_each("Đề nghị sửa chữa", CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA, TableBodyDeNghi, tabRepairDeNghi);
  UpdatetableRepair_each("Khảo sát tình trạng thiết bị hỏng", CONFIG_ENUM.TRANGTHAI.KHAO_SAT, TableBodyKhaosat, tabRepairKhaoSat);
  UpdatetableRepair_each("Đang sửa", CONFIG_ENUM.TRANGTHAI.DANG_SUA, TableBodyDangsua, tabRepairDangsua);
  UpdatetableRepair_each("Bảo hành", CONFIG_ENUM.TRANGTHAI.BAO_HANH, TableBodyBaohanh, tabRepairBaohanh);
  UpdatetableRepair_each("Sửa ngoài", CONFIG_ENUM.TRANGTHAI.SUA_NGOAI, TableBodySuangoai, tabRepairSuangoai);
}

// Cập nhật từng bảng Repair
function UpdatetableRepair_each(strTable, strTrangThai, valTableEach, valTabEach) {
  valTableEach.innerHTML = "";
  let valSTT = 0;
  try {
    // Duyệt qua các dòng dữ liệu
    appData.DataSC.slice(1).forEach((item, index) => {
      if (item[CONFIG_COLUMNS.DataSC.trangthai] === strTrangThai && item[CONFIG_COLUMNS.DataSC.iduserdv] === userData.id) {
        // Tăng STT cho bảng báo hỏng
        valSTT++;
        //Lấy thông tin thiết bị 
        const idthietbi = item[CONFIG_COLUMNS.DataSC.idthietbi];
        const rowsthietbi = appData.DSThietBi.filter(item => item[CONFIG_COLUMNS.DSThietBi.id] === idthietbi);
        if (rowsthietbi.length === 0) {
          console.log("Không tìm thấy thiết bị với id: " + idthietbi);
          return; // Hoặc xử lý logic khác nếu cần
        }
        const rowthietbi = rowsthietbi[0]
        const idusersua = item[CONFIG_COLUMNS.DataSC.idusersua];

        const rowsnguoisua = appData.DSUserSua.filter(item => item[CONFIG_COLUMNS.DSUserSua.id] === idusersua);
        if (rowsnguoisua.length === 0) {
          console.log("Không tìm thấy người sửa với id: " + idusersua);
          return; // Hoặc xử lý logic khác nếu cần
        }
        const rownguoisua = rowsnguoisua[0]

        valTableEach.innerHTML += `
        <tr class="align-middle">
            <td class="text-center">${valSTT}</td>
            <td>⚠️ ${item[CONFIG_COLUMNS.DataSC.id]} 🛠️ ${item[CONFIG_COLUMNS.DataSC.tinhtrangtbdvbao]} 🛠️<br>
              ♟️${rowthietbi[CONFIG_COLUMNS.DSThietBi.id]}⚙️${rowthietbi[CONFIG_COLUMNS.DSThietBi.tentb]}⚙️${rowthietbi[CONFIG_COLUMNS.DSThietBi.model]}⚙️${rowthietbi[CONFIG_COLUMNS.DSThietBi.serial]}⚙️${rowthietbi[CONFIG_COLUMNS.DSThietBi.nuocsx]}<br>
              👨‍🔧${rownguoisua[CONFIG_COLUMNS.DSUserSua.hoten]} 📅${item[CONFIG_COLUMNS.DataSC.ngaydonvibao]}
            </td>
            <td class="d-flex align-middle align-items-center justify-content-center text-center gap-2" style="height:70%;"> 
                <button type="button" data-repair-id='${item[CONFIG_COLUMNS.DataSC.id]}' data-repair-row='${index}' data-repair-status='${strTrangThai}' class="btn btn-outline-primary view-btn" data-bs-toggle="modal" data-bs-target="#FormRepairModal">
                    <i class="bi bi-eye-fill" style="font-size: 1.5rem; color:rgba(9, 23, 221, 0.85)"></i>
                </button>
                <button type="button" data-repair-id='${item[CONFIG_COLUMNS.DataSC.id]}' data-repair-row='${index}' data-repair-status='${strTrangThai}' class="btn btn-outline-secondary edit-btn" data-bs-toggle="modal" data-bs-target="#FormRepairModal">
                    <i class="bi bi-pencil-square" style="font-size: 1.5rem; color:rgba(6, 248, 66, 0.85)"></i>
                </button>
                <button type="button" data-repair-id='${item[CONFIG_COLUMNS.DataSC.id]}' data-repair-row='${index}' data-repair-status='${strTrangThai}' class="btn btn-outline-danger del-btn">
                    <i class="bi bi-trash" style="font-size: 1.5rem; color:rgba(248, 6, 6, 0.85)"></i>
                </button>
            </td>
        </tr>
       `;
      }
    });
    // Cập nhật số lượng báo hỏng
    valTabEach.textContent = `${strTable} (${valSTT})`;

    // //Add listener querySelectorAll().forEach()
    // console.log("Add listener");
    // console.log(`${CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA}-view-btn`);

    // document.querySelectorAll(`.${strTrangThai}-view-btn`)
    // .forEach((button) =>{
    //   //Add Evnet listener for button
    //   button.addEventListener('click', () => {
    //     // ID: SC.DVCTM.250519.021 - Row: 0 bắt đầu từ 0 do Index mảng và có slice(1)
    //     console.log(`Clicked. ID: ${button.dataset.repairId}. Row: ${button.dataset.repairRow}`);
    //     console.log(appData.DataSC[Number(button.dataset.repairRow) + 1]);
    //   });
    // });

    //Add listener  event delegation 
    valTableEach.addEventListener('click', (event) => {
      const btnView = event.target.closest(`.view-btn`);
      const btnEdit = event.target.closest(`.edit-btn`);
      const btnDel = event.target.closest(`.del-btn`);
      // switch (strTrangThai) để thêm event listener cho các nút khác nhau
      switch (strTrangThai) {
        case CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA:
          if (btnView) {
            eBtnViewDeNghi(btnView.dataset.repairId, Number(btnView.dataset.repairRow) + 1);
          }
          else if (btnEdit) {
            eBtnEditDeNghi(btnEdit.dataset.repairId, Number(btnEdit.dataset.repairRow) + 1);
          }
          else if (btnDel) {
            eBtnDelDeNghi(btnDel.dataset.repairId, Number(btnDel.dataset.repairRow) + 1);
          }
          break;
        case CONFIG_ENUM.TRANGTHAI.KHAO_SAT:
          if (btnView) {
            eBtnViewKhaoSat(btnView.dataset.repairId, Number(btnView.dataset.repairRow) + 1);
          }
          else if (btnEdit) {
            eBtnEditKhaoSat(btnEdit.dataset.repairId, Number(btnEdit.dataset.repairRow) + 1);
          }
          else if (btnDel) {
            eBtnDelKhaoSat(btnDel.dataset.repairId, Number(btnDel.dataset.repairRow) + 1);
          }
          break;
        case CONFIG_ENUM.TRANGTHAI.DANG_SUA:
          if (btnView) {
            eBtnViewDangSua(btnView.dataset.repairId, Number(btnView.dataset.repairRow) + 1);
          }
          else if (btnEdit) {
            eBtnEditDangSua(btnEdit.dataset.repairId, Number(btnEdit.dataset.repairRow) + 1);
          }
          else if (btnDel) {
            eBtnDelDangSua(btnDel.dataset.repairId, Number(btnDel.dataset.repairRow) + 1);
          }
          break;
        case CONFIG_ENUM.TRANGTHAI.BAO_HANH:
          if (btnView) {
            eBtnViewBaoHanh(btnView.dataset.repairId, Number(btnView.dataset.repairRow) + 1);
          }
          else if (btnEdit) {
            eBtnEditBaoHanh(btnEdit.dataset.repairId, Number(btnEdit.dataset.repairRow) + 1);
          }
          else if (btnDel) {
            eBtnDelBaoHanh(btnDel.dataset.repairId, Number(btnDel.dataset.repairRow) + 1);
          }
          break;
        case CONFIG_ENUM.TRANGTHAI.SUA_NGOAI:
          if (btnView) {
            eBtnViewSuaNgoai(btnView.dataset.repairId, Number(btnView.dataset.repairRow) + 1);
          }
          else if (btnEdit) {
            eBtnEditSuaNgoai(btnEdit.dataset.repairId, Number(btnEdit.dataset.repairRow) + 1);
          }
          else if (btnDel) {
            eBtnDelSuaNgoai(btnDel.dataset.repairId, Number(btnDel.dataset.repairRow) + 1);
          }
          break;
        default:
          console.log("Trang thai khong hop le");
          break;
      }
    });

  } catch (error) {
    console.log("Đã xảy ra lỗi: " + error.message);
  }
}

// #region *** Trạng thái Đề nghi sửa chữa ***
// View
function eBtnViewDeNghi(idRepair, rowDataRepair) {
  console.log(`Nhấn nút View Đề nghị sửa chữa. ID: ${idRepair}. Row: ${rowDataRepair}`);
  mrRequesterName.value = appData.DataSC[rowDataRepair][CONFIG_COLUMNS.DataSC.hotenYeucau];
  mrRequesterPhone.value = appData.DataSC[rowDataRepair][CONFIG_COLUMNS.DataSC.sdtYeucau];

  //Thông tin người sửa
  const valIDUserSua = appData.DataSC[rowDataRepair][CONFIG_COLUMNS.DataSC.idusersua];
  const rowUserSua = appData.DSUserSua.find(item => item[CONFIG_COLUMNS.DSUserSua.id] === valIDUserSua);
  if (rowUserSua) {
    mrRepairerName.value = rowUserSua[CONFIG_COLUMNS.DSUserSua.hoten];
    mrRepairerPhone.value = rowUserSua[CONFIG_COLUMNS.DSUserSua.sdt];
  }

  //Thông tin thiết bị
  const valIDThietBi = appData.DataSC[rowDataRepair][CONFIG_COLUMNS.DataSC.idthietbi];
  console.log(`Thông tin thiết bị: ${appData.DataSC[rowDataRepair][CONFIG_COLUMNS.DataSC.idthietbi]}`);

  const rowThietBi = appData.DSThietBi.find(item => item[CONFIG_COLUMNS.DSThietBi.id] === valIDThietBi);
  if (rowThietBi) {
    const valNhomtb = rowThietBi[CONFIG_COLUMNS.DSThietBi.nhomtb];
    const rowNhomtb = appData.DSNhomTB.find(item => item[CONFIG_COLUMNS.DSNhomTB.nhomtb] === valNhomtb);
    if (rowNhomtb) {
      mrDeviceGroup.value = rowNhomtb[CONFIG_COLUMNS.DSNhomTB.ten];
    }

    mrDeviceID.value = rowThietBi[CONFIG_COLUMNS.DSThietBi.id];
    mrDeviceName.value = rowThietBi[CONFIG_COLUMNS.DSThietBi.ten];
    mrManufacturer.value = rowThietBi[CONFIG_COLUMNS.DSThietBi.nuocsx];
    mrModel.value = rowThietBi[CONFIG_COLUMNS.DSThietBi.model];
    mrSerial.value = rowThietBi[CONFIG_COLUMNS.DSThietBi.serial];
    mrYearManufactured.value = rowThietBi[CONFIG_COLUMNS.DSThietBi.namsx];
    mrYearInUse.value = rowThietBi[CONFIG_COLUMNS.DSThietBi.namsd];
    mrLocation.value = rowThietBi[CONFIG_COLUMNS.DSThietBi.vitridat];
    mrWarrantyExpiry.value = rowThietBi[CONFIG_COLUMNS.DSThietBi.hanbaohanh];
  }

  //Thông tin tình trạng thiết bị
  mrDeviceStatus.value = appData.DataSC[rowDataRepair][CONFIG_COLUMNS.DataSC.tinhtrangtbdvbao];
  mrRequirementLevel.value = appData.DataSC[rowDataRepair][CONFIG_COLUMNS.DataSC.mucdoquyennang];
  //Thông tin ghi chú
  mrNote.value = appData.DataSC[rowDataRepair][CONFIG_COLUMNS.DataSC.ghichu];

}
function eBtnEditDeNghi(idRepair, rowDataRepair) {
  console.log(`Nhấn nút Edit Đề nghị sửa chữa. ID: ${idRepair}. Row: ${rowDataRepair}`);
}
function eBtnDelDeNghi(idRepair, rowDataRepair) {
  console.log(`Nhấn nút Del Đề nghị sửa chữa. ID: ${idRepair}. Row: ${rowDataRepair}`);
}
// #endregion


// Trạng thái Kháo sát
function eBtnViewKhaoSat(idRepair, rowDataRepair) {
  // bsCollapseDonViYC = new bootstrap.Collapse(GroupDonViYC, { toggle: false });
//  bsCollapseDonViYC.hide(); // Ẩn nhóm Đơn vị yêu cầu khi khởi tạo
// new bootstrap.Collapse(GroupDonViYC, { toggle: false }).hide();
// const WGroupDonViYC = document.getElementById('wrapperDonViYC');
// WGroupDonViYC.style.display = "none";
  console.log(`Nhấn nút View Khảo sát. ID: ${idRepair}. Row: ${rowDataRepair}`);
}
function eBtnEditKhaoSat(idRepair, rowDataRepair) {
  console.log(`Nhấn nút Edit Khảo sát. ID: ${idRepair}. Row: ${rowDataRepair}`);
}
function eBtnDelKhaoSat(idRepair, rowDataRepair) {
  console.log(`Nhấn nút Del Khảo sát. ID: ${idRepair}. Row: ${rowDataRepair}`);
}

// Trạng thái Đang sửa
function eBtnViewDangSua(idRepair, rowDataRepair) {
  console.log(`Nhấn nút View Đang sửa. ID: ${idRepair}. Row: ${rowDataRepair}`);
}
function eBtnEditDangSua(idRepair, rowDataRepair) {
  console.log(`Nhấn nút Edit Đang sửa. ID: ${idRepair}. Row: ${rowDataRepair}`);
}
function eBtnDelDangSua(idRepair, rowDataRepair) {
  console.log(`Nhấn nút Del Đang sửa. ID: ${idRepair}. Row: ${rowDataRepair}`);
}

// Trạng thái Bảo hành
function eBtnViewBaoHanh(idRepair, rowDataRepair) {
  console.log(`Nhấn nút View Bảo hành. ID: ${idRepair}. Row: ${rowDataRepair}`);
}
function eBtnEditBaoHanh(idRepair, rowDataRepair) {
  console.log(`Nhấn nút Edit Bảo hành. ID: ${idRepair}. Row: ${rowDataRepair}`);
}
function eBtnDelBaoHanh(idRepair, rowDataRepair) {
  console.log(`Nhấn nút Del Bảo hành. ID: ${idRepair}. Row: ${rowDataRepair}`);
}

// Trạng thái Sửa ngoài
function eBtnViewSuaNgoai(idRepair, rowDataRepair) {
  console.log(`Nhấn nút View Sửa ngoài. ID: ${idRepair}. Row: ${rowDataRepair}`);
}
function eBtnEditSuaNgoai(idRepair, rowDataRepair) {
  console.log(`Nhấn nút Edit Sửa ngoài. ID: ${idRepair}. Row: ${rowDataRepair}`);
}
function eBtnDelSuaNgoai(idRepair, rowDataRepair) {
  console.log(`Nhấn nút Del Sửa ngoài. ID: ${idRepair}. Row: ${rowDataRepair}`);
}