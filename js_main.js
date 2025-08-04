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

// Nhóm Ghi chú -- Repair Modal
const mrNote = document.getElementById('mrNote');

// Button -- Repair Modal
const btnModalRepairNew = document.getElementById('btnModalRepairNew');
const btnModalRepairSave = document.getElementById('btnModalRepairSave');
// #endregion


// Add Event Loading...
document.addEventListener('DOMContentLoaded', async () => {
  // Load data
  try {
    console.log("Vào Loading...");
    appData = 0;
    appData = await JSON.parse(localStorage.getItem("storeAppData"));
  } catch (error) {
    console.log("Lỗi:", error);
    appData = 0;
  }
  if (!appData) {
    console.log("Vao API");
    const objgetdata = await sendFormAPI("getdata");
    if (objgetdata.status !== "success") {
    frmloading.style.display = "none";
    showerror("Lỗi khi làm mới dữ liệu: " + objgetdata.message);
    return;
    }
    appData = objgetdata.data;
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
  updateSuggestionInRepairModal();
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
  const objgetdata = await sendFormAPI("getdata");
  if (objgetdata.status !== "success") {
    showerror("Lỗi khi làm mới dữ liệu: " + objgetdata.message);
    return;
  }
  appData = objgetdata.data;

  //Note!!
  localStorage.setItem("storeAppData", JSON.stringify(appData));

  UpdateTablesRepair();
  updateUserInfo();
  updateSuggestionInRepairModal();

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
btnAddRepair.addEventListener('click', async () => {
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
mrDeviceGroup.addEventListener('change', () => updateSuggestionDevice());

// Add Event mrDeviceID
mrDeviceID.addEventListener('change', () => updateInformationDevice());

// btnModalRepairNew - Tạo mới đề nghị báo hỏng </br>và Biên bản
btnModalRepairNew.addEventListener('click', async () => {
  const isValid = validateRepairModal(CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA);
  if (!isValid) {
    return;
  }

  // Lấy thông tin từ các trường trong modal
  const currentTime = new Date();
  const formattedDate = currentTime.toLocaleTimeString('vi-VN') + ' ' + currentTime.toLocaleDateString('vi-VN');
  let txtHistory = `* ${formattedDate} - ${mrRequesterName.value}: Thêm đề nghị báo hỏng mới\n`;
  if (mrNote.value?.trim()) {
    txtHistory += `\n   - Ghi chú: ${mrNote.value}`;
  }

  const IndexRepairer = appData.DSUserSua.find(
  item => item[CONFIG_COLUMNS.DSUserSua.id] === mrRepairerName.value
  );

  // Tạo đối tượng đề nghị báo hỏng mới
  const objaddnewrepair = {
    repairID: GenerateRepairID(),
    trangthai: CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA,
    mucdo: mrRequirementLevel.value,
    iduserdv: userData.id,
    idusersua: mrRepairerName.value,
    idthietbi: mrDeviceID.value,
    tinhtrangtbdvbao: mrDeviceStatus.value,
    ngaydonvibao: formattedDate,
    ghichu: mrNote.value,
    hotenYeucau: mrRequesterName.value,
    sdtYeucau: mrRequesterPhone.value,
    qrcode: "",
    history: txtHistory,
    timeupdate: formattedDate,
    nameuserdv: userData.donvi,
    nameThietbi: mrDeviceName.value,
    nameModel: mrModel.value,
    nameSerial: mrSerial.value,
    nameHangSX: mrManufacturer.value,
    nameNuocSX: mrYearManufactured.value,
    nameNamSX: mrYearManufactured.value,
    nameNamSD: mrYearInUse.value,
    nameTinhTrang: mrDeviceStatus.value,
    nameMucDo: mrRequirementLevel.options[mrRequirementLevel.selectedIndex].text,
    nameNguoiYeuCau: mrRequesterName.value,
    nameSDTYeuCau: mrRequesterPhone.value,
    nameNguoiSua: mrRepairerName.options[mrRepairerName.selectedIndex].text,
    nameSDTNguoiSua: mrRepairerPhone.value,
    idTeleNguoiSua: IndexRepairer ? IndexRepairer[CONFIG_COLUMNS.DSUserSua.usetele] || "" : ""
  };
  console.log("addnewrepair:", objaddnewrepair);

  showloading();
  // Gửi dữ liệu đến API
  const ObjresultAPI = await sendFormAPI ("addnewrepair", objaddnewrepair);
  console.log("Đề nghị báo hỏng mới:", ObjresultAPI);
  if (ObjresultAPI.status === "success") {
    // Cập nhật dữ liệu cục bộ appData
    appData.DataSC.push([ObjresultAPI.dataNewRow]);
    // Cập nhật trạng thái thiết bị theo IndexThietBi
    const valIDThietBi = appData.DSThietBi[Number(ObjresultAPI.IndexThietBi)][CONFIG_COLUMNS.DSThietBi.id];
    const valIDThietBiFromAPI = ObjresultAPI.dataNewRow[CONFIG_COLUMNS.DataSC.idthietbi];
    if (valIDThietBi === valIDThietBiFromAPI) {
      appData.DSThietBi[ObjresultAPI.IndexThietBi][CONFIG_COLUMNS.DSThietBi.tinhtrang] = CONFIG_ENUM.TINHTRANG_THIETBI.HONG;
    } else {
      // Tìm thiết bị bằng ID
      const deviceIndex = appData.DSThietBi.findIndex(item => item[CONFIG_COLUMNS.DSThietBi.id] === valIDThietBiFromAPI);
      if (deviceIndex !== -1) {
        appData.DSThietBi[deviceIndex][CONFIG_COLUMNS.DSThietBi.tinhtrang] = CONFIG_ENUM.TINHTRANG_THIETBI.HONG;
      }
    }
    UpdateTablesRepair();
    updateSuggestionInRepairModal();
    // Đóng loading
    Swal.close();
    // Dong modal
    const ModalRepairShowHide = bootstrap.Modal.getInstance(FormRepairModal);
    ModalRepairShowHide.hide();
  } else {
    console.log("Cập nhật trạng thái thiết bị không thành công");
    showerror("Lỗi khi tạo đề nghị báo hỏng: " + ObjresultAPI.message);
    return;
  }// End if ObjresultAPI.status === "success"
});

// btnModalRepairSave - Cập nhật đề nghị báo hỏng
btnModalRepairSave.addEventListener('click', async () => {
  console.log("Cập nhật đề nghị báo hỏng.");
  const ModalRepairShowHide = bootstrap.Modal.getInstance(FormRepairModal);
  ModalRepairShowHide.hide();
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
    const data = await res.json();
    return data;

  } catch (err) {
    console.log({ status: "error API", message: err.message });
  }
}

// Header - Update user info in the 
function updateUserInfo() {
  userNametxt.textContent = userData.donvi;
  userAvatarimg.src = `https://drive.google.com/thumbnail?id=${userData.logo}&sz=s100` || "https://drive.google.com/thumbnail?id=1Y2obUC2vpgQLsD1JokCX8QY4olp3LjXe&sz=s100"; // Placeholder if logo is not set
  //https://drive.google.com/thumbnail?id=1Y2obUC2vpgQLsD1JokCX8QY4olp3LjXe&sz=s100
}

// Table Repair - Cập nhật thông tin 
function UpdateTablesRepair() {
  // Hiển thị các bảng
  UpdatetableRepair_each("Đề nghị sửa chữa", CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA, TableBodyDeNghi, tabRepairDeNghi);
  UpdatetableRepair_each("Khảo sát tình trạng thiết bị hỏng", CONFIG_ENUM.TRANGTHAI.KHAO_SAT, TableBodyKhaosat, tabRepairKhaoSat);
  UpdatetableRepair_each("Đang sửa", CONFIG_ENUM.TRANGTHAI.DANG_SUA, TableBodyDangsua, tabRepairDangsua);
  UpdatetableRepair_each("Bảo hành", CONFIG_ENUM.TRANGTHAI.BAO_HANH, TableBodyBaohanh, tabRepairBaohanh);
  UpdatetableRepair_each("Sửa ngoài", CONFIG_ENUM.TRANGTHAI.SUA_NGOAI, TableBodySuangoai, tabRepairSuangoai);
}

// Table Repair - Cập nhật từng bảng 
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
          console.log(`Không tìm thấy thiết bị với id: ${idthietbi} item: ${JSON.stringify(item)}`);
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
              ♟️${rowthietbi[CONFIG_COLUMNS.DSThietBi.mathietbi]}⚙️${rowthietbi[CONFIG_COLUMNS.DSThietBi.tentb]}⚙️${rowthietbi[CONFIG_COLUMNS.DSThietBi.model]}⚙️${rowthietbi[CONFIG_COLUMNS.DSThietBi.serial]}⚙️${rowthietbi[CONFIG_COLUMNS.DSThietBi.nuocsx]}<br>
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
            UpdateValViewModalRepair(rowDataRepair, CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA, "View");
          }
          else if (btnEdit) {
            UpdateValViewModalRepair(indexRepair, CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA, "Edit");
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

// Modal Repair - List Suggestion 
function updateSuggestionInRepairModal() {
  // Tên đơn vị
  mrDepartmentName.value = userData.donvi;

  // Lọc danh sách DataSC theo đơn vị
  const filteredDataSC = appData.DataSC.filter(item => item[CONFIG_COLUMNS.DataSC.iduserdv] === userData.id);
  //Người yêu cầu mrRequesterName
  const uniqueNames = [...new Set(filteredDataSC.map(item => item[CONFIG_COLUMNS.DataSC.hotenYeucau]))];
  const mrRequesterNameList = document.getElementById('mrRequesterNameList');
  mrRequesterNameList.innerHTML = '';
  uniqueNames.forEach(name => {
    const newOption = document.createElement('option');
    newOption.value = name;
    mrRequesterNameList.appendChild(newOption);
  });

  // Số điện thoại người yêu cầu mrRequesterPhone
  const uniquePhones = [...new Set(filteredDataSC.map(item => item[CONFIG_COLUMNS.DataSC.sdtYeucau]))];
  const mrRequesterPhoneList = document.getElementById('mrRequesterPhoneList');
  mrRequesterPhoneList.innerHTML = '';
  uniquePhones.forEach(phone => {
    const newOption = document.createElement('option');
    newOption.value = phone;
    mrRequesterPhoneList.appendChild(newOption);
  });

  
  // Người sửa chữa mrRepairerName trong appData.DSUserSua
  mrRepairerName.innerHTML = '<option value="">-- Chọn người sửa chữa --</option>';
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
  mrDeviceGroup.innerHTML = '<option value="">-- Chọn nhóm thiết bị --</option>';
  uniqueDeviceGroups.forEach(group => {
    const newOption = document.createElement('option');
    newOption.value = group;
    newOption.textContent = appData.DSNhomTB.find(item => item[CONFIG_COLUMNS.DSNhomTB.id] === group)[CONFIG_COLUMNS.DSNhomTB.nhomtb];
    mrDeviceGroup.appendChild(newOption);
  });

  // Tình trạng thiết bị mrDeviceStatus
  const uniqueDeviceStatuses = [...new Set(filteredDataSC.map(item => item[CONFIG_COLUMNS.DataSC.tinhtrangtbdvbao]))];
  const mrDeviceStatusList = document.getElementById('mrDeviceStatusList');
  mrDeviceStatusList.innerHTML = '';
  uniqueDeviceStatuses.forEach(status => {
    const newOption = document.createElement('option');
    newOption.value = status;
    newOption.textContent = status;
    mrDeviceStatusList.appendChild(newOption);
  });
}

// Repair Modal - Check Validation
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

// Repair Modal - Update suggestion device based on selected group
function updateSuggestionDevice(rowDevice = null) {
  const valSelectedGroup = mrDeviceGroup.value;
  // Lọc danh sách thiết bị theo nhóm đã chọn và đơn vị
  const filteredDevices = appData.DSThietBi.filter(item => item[CONFIG_COLUMNS.DSThietBi.nhomtb] === valSelectedGroup && item[CONFIG_COLUMNS.DSThietBi.donvi] === userData.id && item[CONFIG_COLUMNS.DSThietBi.tinhtrang] === CONFIG_ENUM.TINHTRANG_THIETBI.BINH_THUONG);

  if (rowDevice !== null) {
    // Nếu có rowDevice, thêm nó vào danh sách thiết bị đã lọc
    filteredDevices.push(rowDevice);
    console.log("Row device added to filtered devices:", rowDevice);
  }
  // thêm vào list thiết bị select mrDeviceID
  // Clear existing options in the device ID dropdown
  mrDeviceID.innerHTML = '<option value="">-- Chọn mã thiết bị --</option>';

  // Add filtered devices to the dropdown
  filteredDevices.forEach(device => {
    const newOption = document.createElement('option');
    newOption.value = device[CONFIG_COLUMNS.DSThietBi.id];
    newOption.textContent = `${device[CONFIG_COLUMNS.DSThietBi.mathietbi]} - ${device[CONFIG_COLUMNS.DSThietBi.tentb]}`;
    mrDeviceID.appendChild(newOption);
  });
  // Reset device details
  updateInformationDevice();
}

// Repair Modal - Update device information based on selected device ID
function updateInformationDevice() {
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
  else {
    mrDeviceName.value = "";
    mrManufacturer.value = "";
    mrModel.value = "";
    mrSerial.value = "";
    mrYearManufactured.value = "";
    mrYearInUse.value = "";
    mrLocation.value = "";
    mrWarrantyExpiry.value = "";
  }
}

// Repair ID - Tao ID sửa chữa mới
function GenerateRepairID() {
  const now = new Date();
  
  // Find max sequence number for current department and year
  const currentYear = now.getFullYear().toString().slice(-2);
  const userDeptRepairs = appData.DataSC.filter(row => 
    row && row[CONFIG_COLUMNS.DataSC.iduserdv] === userData.id
  );
  
  let maxSequence = 0;
  if (userDeptRepairs.length > 0) {
    const sequenceNumbers = userDeptRepairs
      .map(row => {
        if (!row || !row[CONFIG_COLUMNS.DataSC.id]) return 0;
        
        const parts = row[CONFIG_COLUMNS.DataSC.id].split('.');
        if (parts.length < 4) return 0;
        
        const idYear = parts[2].slice(0, 2);
        return idYear === currentYear ? parseInt(parts[3], 10) : 0;
      })
      .filter(num => !isNaN(num));
    
    if (sequenceNumbers.length > 0) {
      maxSequence = Math.max(...sequenceNumbers);
    }
  }

  // Format components of the ID
  const sequenceNumber = String(maxSequence + 1).padStart(3, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePart = currentYear + month + day;
  const millisecondPart = String(now.getMilliseconds()).padStart(3, '0');
  
  // Create final ID
  const repairID = `SC.${userData.kihieu}.${datePart}.${sequenceNumber}.${millisecondPart}`;
  
  return repairID;
}

// Get val value to Modal Repair
function UpdateValViewModalRepair(rowRepair, TrangThai, View_Edit = "View") {
  
  // Lấy row
  const valIDUserSua = appData.DataSC[rowRepair][CONFIG_COLUMNS.DataSC.idusersua];
  const rowUserSua = appData.DSUserSua.find(item => item[CONFIG_COLUMNS.DSUserSua.id] === valIDUserSua);
  console.log("rowUserSua:", rowUserSua);

  const valIDThietBi = appData.DataSC[rowRepair][CONFIG_COLUMNS.DataSC.idthietbi];
  const rowDevice = appData.DSThietBi.find(item => item[CONFIG_COLUMNS.DSThietBi.id] === valIDThietBi);
  console.log("rowThietBi:", rowDevice);

  // dataset
  FormRepairModal.dataset.rowRepair = rowRepair;
  console.log("FormRepairModal.dataset.rowRepair:", FormRepairModal.dataset.rowRepair);
  FormRepairModal.dataset.rowDevice = rowDevice[CONFIG_COLUMNS.DSThietBi.id];
  console.log("FormRepairModal.dataset.rowDevice:", FormRepairModal.dataset.rowDevice);

  // Cập nhật giá trị Modal Repair
  switch (TrangThai) {
    case CONFIG_ENUM.TRANGTHAI.HOAN_THANH:

    case CONFIG_ENUM.TRANGTHAI.SUA_NGOAI:

    case CONFIG_ENUM.TRANGTHAI.BAO_HANH:

    case CONFIG_ENUM.TRANGTHAI.DANG_SUA:

    case CONFIG_ENUM.TRANGTHAI.KHAO_SAT:

    case CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA:
      // Thông tin đơn vị
      mrRequesterName.value = appData.DataSC[rowRepair][CONFIG_COLUMNS.DataSC.hotenYeucau];
      mrRequesterPhone.value = appData.DataSC[rowRepair][CONFIG_COLUMNS.DataSC.sdtYeucau];

      //Thông tin người sửa
      mrRepairerName.value = rowUserSua[CONFIG_COLUMNS.DSUserSua.id];
      mrRepairerPhone.value = rowUserSua[CONFIG_COLUMNS.DSUserSua.sdt];

        //Thông tin thiết bị
        mrDeviceGroup.value = rowDevice[CONFIG_COLUMNS.DSThietBi.nhomtb];
        updateSuggestionDevice(rowDevice);
        mrDeviceID.value = rowDevice[CONFIG_COLUMNS.DSThietBi.id];
        updateInformationDevice();
        //Thông tin tình trạng thiết bị
        mrDeviceStatus.value = appData.DataSC[rowRepair][CONFIG_COLUMNS.DataSC.tinhtrangtbdvbao];
        mrRequirementLevel.value = appData.DataSC[rowRepair][CONFIG_COLUMNS.DataSC.mucdo];

        //Thông tin ghi chú
        mrNote.value = appData.DataSC[rowRepair][CONFIG_COLUMNS.DataSC.ghichu];
      break;
    default:
      console.log("Value Default Modal Repair: " + TrangThai);
  }

  // Cập nhật View
  switch (TrangThai) {
    case CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA:
      // Cập nhật các trường trong Modal Repair
      break;
    case CONFIG_ENUM.TRANGTHAI.KHAO_SAT:
      // Cập nhật các trường trong Modal Repair
      break;
    case CONFIG_ENUM.TRANGTHAI.DANG_SUA:
      // Cập nhật các trường trong Modal Repair
      break;
    case CONFIG_ENUM.TRANGTHAI.BAO_HANH:
      // Cập nhật các trường trong Modal Repair
      break;
    case CONFIG_ENUM.TRANGTHAI.SUA_NGOAI:
      // Cập nhật các trường trong Modal Repair
      break;
    default:
      console.log("Value Default Modal Repair: " + TrangThai);
  }

  // Cập nhật Readonly
  switch (View_Edit) {
    case "View":
      // Đặt các trường readonly
      console.log("View");
      mrRequesterName.disabled = true;
      mrRequesterPhone.disabled = true;
      mrRepairerName.disabled = true;
      mrDeviceGroup.disabled = true;
      mrDeviceID.disabled = true;
      mrDeviceStatus.disabled = true;
      mrRequirementLevel.disabled = true;
      mrNote.disabled = true;
      break;
    case "Edit":
      // Đặt các trường editable
      console.log("Edit");
      mrRequesterName.disabled = false;
      mrRequesterPhone.disabled = false;
      mrRepairerName.disabled = false;
      mrDeviceGroup.disabled = false;
      mrDeviceID.disabled = false;
      mrDeviceStatus.disabled = false;
      mrRequirementLevel.disabled = false;
      mrNote.disabled = false;
      break;
    default:
      console.log("Value Default View_Edit: " + View_Edit);
      break;
  }
}

// #region *** Trạng thái Đề nghi sửa chữa ***
// View
function eBtnViewDeNghi(idRepair, rowDataRepair) {
  UpdateValViewModalRepair(rowDataRepair, CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA, "View");
}

function eBtnEditDeNghi(idRepair, indexRepair) {
  UpdateValViewModalRepair(indexRepair, CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA, "Edit");
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