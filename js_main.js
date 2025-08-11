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

// Nhóm Quyết định -- Repair Modal
const mrDecisionNumber = document.getElementById('mrDecisionNumber');
const mrDecisionDate = document.getElementById('mrDecisionDate');

// Nhóm Đại diện bệnh viện -- Repair Modal
const mrDaiDienName1 = document.getElementById('mrDaiDienName1');
const mrDaiDienChucVu1 = document.getElementById('mrDaiDienChucVu1');
const mrDaiDienName2 = document.getElementById('mrDaiDienName2');
const mrDaiDienChucVu2 = document.getElementById('mrDaiDienChucVu2');
const mrDaiDienName3 = document.getElementById('mrDaiDienName3');
const mrDaiDienChucVu3 = document.getElementById('mrDaiDienChucVu3');
const mrDaiDienName4 = document.getElementById('mrDaiDienName4');
const mrDaiDienChucVu4 = document.getElementById('mrDaiDienChucVu4');
const mrDaiDienName5 = document.getElementById('mrDaiDienName5');
const mrDaiDienChucVu5 = document.getElementById('mrDaiDienChucVu5');

// Nhóm Đại diện đơn vị -- Repair Modal
const dvDaiDienName1 = document.getElementById('dvDaiDienName1');
const dvDaiDienChucVu1 = document.getElementById('dvDaiDienChucVu1');
const dvDaiDienName2 = document.getElementById('dvDaiDienName2');
const dvDaiDienChucVu2 = document.getElementById('dvDaiDienChucVu2');

// Thông tin khảo sát -- Repair Modal
const mrSurveyStatus = document.getElementById('mrSurveyStatus');
const mrSurveyConclusion = document.getElementById('mrSurveyConclusion');
const mrRepairProposal = document.getElementById('mrRepairProposal');

// Nhóm Nội dung đề nghị -- Repair Modal
const mrProposalContent = document.getElementById('mrProposalContent');

// Nhóm Tình trạng thiết bị bàn giao -- Repair Modal
const mrDeviceStatusBG = document.getElementById('mrDeviceStatusBG');

// Nhóm Ghi chú -- Repair Modal
const mrNote = document.getElementById('mrNote');

// Button -- Repair Modal
const btnNew_ModalRepair = document.getElementById('btnNew_ModalRepair');
const btn01_ModalRepairSave = document.getElementById('btn01_ModalRepairSave');
const btn02_ModalRepairSave = document.getElementById('btn02_ModalRepairSave');
const btn03_ModalRepairSave = document.getElementById('btn03_ModalRepairSave');
const btn04_ModalRepairSave = document.getElementById('btn04_ModalRepairSave');
const btn05_ModalRepairSave = document.getElementById('btn05_ModalRepairSave');

const btnModalRepairPdf01 = document.getElementById('btnModalRepairPdf01');
const btnModalRepairWord01 = document.getElementById('btnModalRepairWord01');
const btnModalRepairPdf02 = document.getElementById('btnModalRepairPdf02');
const btnModalRepairWord02 = document.getElementById('btnModalRepairWord02');
const btnModalRepairPdf03 = document.getElementById('btnModalRepairPdf03');
const btnModalRepairWord03 = document.getElementById('btnModalRepairWord03');
const btnModalRepairPdf04 = document.getElementById('btnModalRepairPdf04');
const btnModalRepairWord04 = document.getElementById('btnModalRepairWord04');

// Group Repair Modal
const GroupDonViYC = document.getElementById('GroupDonViYC');
const GroupNguoiSuaChua = document.getElementById('GroupNguoiSuaChua');
const GroupThongTinThietBi = document.getElementById('GroupThongTinThietBi');
const GroupThongTinTinhTrangThietBi = document.getElementById('GroupThongTinTinhTrangThietBi');

const GroupQuyetDinh = document.getElementById('GroupQuyetDinh');
const GroupDaiDienBenhVien = document.getElementById('GroupDaiDienBenhVien');
const GroupDaiDienDonVi = document.getElementById('GroupDaiDienDonVi');
const GroupThongTinKhaoSat = document.getElementById('GroupThongTinKhaoSat');

const GroupNoiDungDeNghi = document.getElementById('GroupNoiDungDeNghi');
const GroupDeviceStatusBG = document.getElementById('GroupDeviceStatusBG');
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
  updateSuggestionGroupDevice();
  FormRepairModalTitle.textContent = "Thêm báo hỏng vào tạo Biên bản đề nghị sửa chữa";
  showButtonRepairModal(btnNew_ModalRepair);
  showGroupRepairModal();
  enableInputRepairModal("Edit", CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA);

  });
 // #endregion

// #region *** Trạng thái Đề nghị sửa chữa - Add Event Form Repair Modal ***
// Add Event mrRepairerName
mrRepairerName.addEventListener('change', () => {
  const valSelectedRepairer = mrRepairerName.value;
  const selectedRepairer = appData.DSUserSua.find(item => item[CONFIG_COLUMNS.DSUserSua.id] === valSelectedRepairer);
  if (selectedRepairer) {
    mrRepairerPhone.value = selectedRepairer[CONFIG_COLUMNS.DSUserSua.sdt];
  }
});

// Add Event mrDeviceGroup
mrDeviceGroup.addEventListener('change', () => updateSuggestionDevice(mrDeviceGroup.value));

// Add Event mrDeviceID
mrDeviceID.addEventListener('change', () => updateInformationDevice());
// #endregion *** Trạng thái Đề nghị sửa chữa - Add Event Form Repair Modal ***

// btnNew_ModalRepair - Tạo mới đề nghị báo hỏng </br>và Biên bản
btnNew_ModalRepair.addEventListener('click', async () => {
  const isValid = validateRepairModal(CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA);
  if (!isValid) {
    return;
  }

  // Lấy thông tin từ các trường trong modal
  const currentTime = new Date();
  const formattedDate = currentTime.toLocaleTimeString('vi-VN') + ' ' + currentTime.toLocaleDateString('vi-VN');
  let txtHistory = `* ${formattedDate} - ${mrRequesterName.value}: Thêm đề nghị báo hỏng mới\n`;
  if (mrNote.value?.trim()) {
    txtHistory += `   - Ghi chú: ${mrNote.value}`;
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
  console.log("addNewRepair:", objaddnewrepair);

  showloading();
  // Gửi dữ liệu đến API
  const objAddNewRepair = await sendFormAPI ("addNewRepair", objaddnewrepair);
  console.log("Đề nghị báo hỏng mới:", objAddNewRepair);
  if (objAddNewRepair.status === "success") {
    // Cập nhật dữ liệu appData
    appData.DataSC.push(objAddNewRepair.dataRowNewRepair);

    // Cập nhật trạng thái thiết bị theo IndexThietBi
    appData.DSThietBi[Number(objAddNewRepair.indexDevice)] = objAddNewRepair.dataRowDevice;
    
    Swal.close();
    // Dong modal
    const ModalRepairShowHide = bootstrap.Modal.getInstance(FormRepairModal);
    ModalRepairShowHide.hide();

    UpdateTablesRepair();
    updateSuggestionInRepairModal();
    frmainApp.style.display = "block";
    // Đóng loading
  } else {
    console.log("Cập nhật trạng thái thiết bị không thành công");
    showerror("Lỗi khi tạo đề nghị báo hỏng: " + objAddNewRepair.message);
    return;
  }// End if objAddNewRepair.status === "success"
});

// #region *** Update - View File  - Add Event Form Repair Modal ***
// btn01_ModalRepairSave - Cập nhật đề nghị báo hỏng
btn01_ModalRepairSave.addEventListener('click', async () => {
  console.log("Cập nhật đề nghị báo hỏng.");
  const isValid = validateRepairModal(CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA);
  if (!isValid) {
    return;
  }
  
  // Lấy thông tin từ các trường trong modal
const currentTime = new Date();
  const formattedDate = currentTime.toLocaleTimeString('vi-VN') + ' ' + currentTime.toLocaleDateString('vi-VN');
  let txtHistory = `* ${formattedDate} - ${mrRequesterName.value}: Cập nhật thông tin đề nghị báo hỏng\n`;
  if (mrNote.value?.trim()) {
    txtHistory += `   - Ghi chú: ${mrNote.value}`;
  }

  const rowUserSua = appData.DSUserSua.find(  item => item[CONFIG_COLUMNS.DSUserSua.id] === mrRepairerName.value  );
  
  // Tạo đối tượng đề nghị báo hỏng mới
  const objUpdateRepair_01 = {
    // Lấy id theo FormRepairModal.dataset.rowRepair
    repairID: FormRepairModal.dataset.idRepair,
    indexRepair: FormRepairModal.dataset.indexRepair,
    idDeviceOld: FormRepairModal.dataset.idDevice,
    indexDeviceOld: FormRepairModal.dataset.indexDevice,
    idDeviceNew: mrDeviceID.value,
    trangthai: CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA,
    mucdo: mrRequirementLevel.value,
    iduserdv: userData.id,
    idusersua: mrRepairerName.value,
    tinhtrangtbdvbao: mrDeviceStatus.value,
    ngaydonvibao: formattedDate,
    ghichu: mrNote.value,
    hotenYeucau: mrRequesterName.value,
    sdtYeucau: mrRequesterPhone.value,
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
    idTeleNguoiSua: rowUserSua ? rowUserSua[CONFIG_COLUMNS.DSUserSua.usetele] || "" : ""
  };
  console.log("objUpdateRepair_01:", objUpdateRepair_01);

  showloading();
  // Gửi dữ liệu đến API
  const objUpdateRepairDn01 = await sendFormAPI ("updateRepairDn01", objUpdateRepair_01);
  console.log("Update bao hong:", objUpdateRepairDn01);
  if (objUpdateRepairDn01.status === "success") {
    // Cập nhật dữ liệu cục bộ appData
    console.log("Cập nhật dữ liệu cục bộ appData");
    console.log(appData.DataSC);
    console.log(objUpdateRepairDn01.rowRepair);
    console.log("Index sửa chữa:", objUpdateRepairDn01.indexRepair);
    appData.DataSC[Number(objUpdateRepairDn01.indexRepair)] = objUpdateRepairDn01.rowRepair;
    // Cập nhật trạng thái thiết bị theo IndexThietBi
    console.log(appData.DataSC);

    console.log("Cập nhật trạng thái thiết bị mới");
    console.log("Cập nhật trạng thái thiết bị theo IndexThietBi cũ:", objUpdateRepairDn01.indexDeviceOld);
    console.log("Cập nhật trạng thái thiết bị theo IndexThietBi mới:", objUpdateRepairDn01.indexDeviceNew);
    console.log("Cập nhật trạng thái thiết bị cũ:", objUpdateRepairDn01.rowDeviceOld);
    console.log("Cập nhật trạng thái thiết bị mới:", objUpdateRepairDn01.rowDeviceNew);
    if (objUpdateRepairDn01.indexDeviceOld !== "0" && objUpdateRepairDn01.indexDeviceOld !== 0) {
      appData.DSThietBi[Number(objUpdateRepairDn01.indexDeviceOld)] = objUpdateRepairDn01.rowDeviceOld;
      appData.DSThietBi[Number(objUpdateRepairDn01.indexDeviceNew)] = objUpdateRepairDn01.rowDeviceNew;
    }
    console.log("Cập nhật trạng thái thiết bị mới thành công");
    UpdateTablesRepair();
    updateSuggestionInRepairModal();
    // Đóng loading
    Swal.close();
    // Dong modal
    const ModalRepairShowHide = bootstrap.Modal.getInstance(FormRepairModal);
    ModalRepairShowHide.hide();
  } else {
    console.log("Cập nhật trạng thái thiết bị không thành công");
    showerror("Lỗi khi tạo đề nghị báo hỏng: " + objUpdateRepairDn01.message);
    return;
  }// End if objUpdateRepairDn01.status === "success"

  // Ẩn Modal
  const ModalRepairShowHide = bootstrap.Modal.getInstance(FormRepairModal);
  ModalRepairShowHide.hide();
  });

// btn02_ModalRepairSave - Cập nhật khảo sát tình trạng thiết bị hỏng
btn02_ModalRepairSave.addEventListener('click', async () => {
  console.log("Cập nhật khảo sát tình trạng thiết bị hỏng.");
  const isValid = validateRepairModal(CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA);
  if (!isValid) {
    return;
  }
  const idRepair = FormRepairModal.dataset.idRepair;
  const indexRepair = Number(FormRepairModal.dataset.indexRepair);
  const idDevice = FormRepairModal.dataset.idDevice;
  const indexDevice = Number(FormRepairModal.dataset.indexDevice);
  const indexUserSua = Number(FormRepairModal.dataset.indexUserSua);
  // Lấy thông tin từ các trường trong modal
  const currentTime = new Date();
  const formattedDate = currentTime.toLocaleTimeString('vi-VN') + ' ' + currentTime.toLocaleDateString('vi-VN');
  let txtHistory = `* ${formattedDate} - ${userData.donvi}: Cập nhật thông tin - Khảo sát tình trạng thiết bị hỏng\n`;
  if (mrNote.value?.trim()) {
    txtHistory += `   - Ghi chú: ${mrNote.value}`;
  }
  
  // data Repair
  const rowRepair = appData.DataSC[Number(indexRepair)];
  console.log("rowRepair:", rowRepair);
  // data Device
  const rowDevice = appData.DSThietBi[Number(indexDevice)];
  console.log("rowDevice:", rowDevice);
  // data User Sua
  const rowUserSua = appData.DSUserSua[Number(indexUserSua)];
  console.log("rowUserSua:", rowUserSua);

  // Mức độ
  const rowMucDo = appData.EnumSetting.find(item => item[CONFIG_COLUMNS.EnumSetting.id] === rowRepair[CONFIG_COLUMNS.DataSC.mucdo]);
  console.log("rowMucDo:", rowMucDo);

  let nameMucDo = "";
  if (rowMucDo) {
    nameMucDo = rowMucDo[CONFIG_COLUMNS.EnumSetting.ten];
  }
  const objBtn02API = {
    mrDecisionNumber: mrDecisionNumber.value,
    mrDecisionDate: mrDecisionDate.value,
    mrDaiDienName1: mrDaiDienName1.value,
    mrDaiDienChucVu1: mrDaiDienChucVu1.value,
    mrDaiDienName2: mrDaiDienName2.value,
    mrDaiDienChucVu2: mrDaiDienChucVu2.value,
    mrDaiDienName3: mrDaiDienName3.value,
    mrDaiDienChucVu3: mrDaiDienChucVu3.value,
    mrDaiDienName4: mrDaiDienName4.value,
    mrDaiDienChucVu4: mrDaiDienChucVu4.value,
    mrDaiDienName5: mrDaiDienName5.value,
    mrDaiDienChucVu5: mrDaiDienChucVu5.value,
    dvDaiDienName1: dvDaiDienName1.value,
    dvDaiDienChucVu1: dvDaiDienChucVu1.value,
    dvDaiDienName2: dvDaiDienName2.value,
    dvDaiDienChucVu2: dvDaiDienChucVu2.value,
    mrSurveyStatus: mrSurveyStatus.value,
    mrSurveyConclusion: mrSurveyConclusion.value,
    mrRepairProposal: mrRepairProposal.value,

    repairID: idRepair, // Thông tin mặc định
    indexRepair: indexRepair,
    idDevice: idDevice,
    indexDevice: indexDevice,
    nameuserdv: userData.donvi,
    nameThietbi: rowDevice[CONFIG_COLUMNS.DSThietBi.tentb],
    nameModel: rowDevice[CONFIG_COLUMNS.DSThietBi.model],
    nameSerial: rowDevice[CONFIG_COLUMNS.DSThietBi.serial],
    nameTinhTrang: rowDevice[CONFIG_COLUMNS.DSThietBi.tinhtrang],
    nameMucDo: nameMucDo,
    nameNguoiYeuCau: rowRepair[CONFIG_COLUMNS.DataSC.hotenYeucau],
    nameSDTYeuCau: rowRepair[CONFIG_COLUMNS.DataSC.sdtYeucau],
    nameNguoiSua: rowUserSua[CONFIG_COLUMNS.DSUserSua.hoten],
    nameSDTNguoiSua: rowUserSua[CONFIG_COLUMNS.DSUserSua.sdt],
    history: txtHistory,
    timeupdate: formattedDate,
    idTeleNguoiSua: rowUserSua ? rowUserSua[CONFIG_COLUMNS.DSUserSua.usetele] || "" : ""
  };
  console.log("objBtn02API:", objBtn02API);
  // Hiển thị loading
  showloading("Đang cập nhật thông tin và tạo biên bản khảo sát tình trạng trang thiết bị hỏng ...");
  const objDeleteRepair = await sendFormAPI("updateRepairDn02", objBtn02API);
  console.log("Cập nhật", objDeleteRepair);
  if (objDeleteRepair.status === "success") {
    showsucces("Đã cập nhật thông tin và tạo biên bản khảo sát tình trạng trang thiết bị hỏng thành công.");
    // Cập nhật DataSC
    appData.DataSC[Number(indexRepair)] = objDeleteRepair.rowRepair;
    // Cập nhật DataTB
    // appData.DSThietBi[Number(indexDevice)] = objDeleteRepair.rowDevice;
    UpdateTablesRepair();
    updateSuggestionInRepairModal();
    // Đóng loading
    Swal.close();
  } else {
    showerror("Cập nhật thông tin và tạo biên bản khảo sát tình trạng trang thiết bị hỏng thất bại: " + objDeleteRepair.message);
    console.error("Lỗi cập nhật thông tin và tạo biên bản khảo sát tình trạng trang thiết bị hỏng:", objDeleteRepair.message);
  }
  const ModalRepairShowHide = bootstrap.Modal.getInstance(FormRepairModal);
  ModalRepairShowHide.hide();
});

// btn03_ModalRepairSave - Cập nhật đang sửa
btn03_ModalRepairSave.addEventListener('click', async () => {
  console.log("Cập nhật đang sửa.");
  const ModalRepairShowHide = bootstrap.Modal.getInstance(FormRepairModal);
  ModalRepairShowHide.hide();
}); 

// btn04_ModalRepairSave - Cập nhật bảo hành
btn04_ModalRepairSave.addEventListener('click', async () => {
  console.log("Cập nhật bảo hành.");
  const ModalRepairShowHide = bootstrap.Modal.getInstance(FormRepairModal);
  ModalRepairShowHide.hide();
});

// btn05_ModalRepairSave - Cập nhật sửa ngoài
btn05_ModalRepairSave.addEventListener('click', async () => {
  console.log("Cập nhật sửa ngoài.");
  const ModalRepairShowHide = bootstrap.Modal.getInstance(FormRepairModal);
  ModalRepairShowHide.hide();
});

// btnModalRepairWord01
btnModalRepairPdf01.addEventListener('click',  () => {
  const indexRepair = Number(FormRepairModal.dataset.indexRepair);
  const rowRepair = appData.DataSC[indexRepair];
  window.open(rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB01], "_blank");
});

// btnModalRepairWord01
btnModalRepairWord01.addEventListener('click',  () => {
  const indexRepair = Number(FormRepairModal.dataset.indexRepair);
  const rowRepair = appData.DataSC[indexRepair];
  window.open(rowRepair[CONFIG_COLUMNS.DataSC.Word_BB01], "_blank");
});

// btnModalRepairPdf02
btnModalRepairPdf02.addEventListener('click',  () => {
  const indexRepair = Number(FormRepairModal.dataset.indexRepair);
  const rowRepair = appData.DataSC[indexRepair];
  window.open(rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB02], "_blank");
});

// btnModalRepairWord02
btnModalRepairWord02.addEventListener('click',  () => {
  const indexRepair = Number(FormRepairModal.dataset.indexRepair);
  const rowRepair = appData.DataSC[indexRepair];
  window.open(rowRepair[CONFIG_COLUMNS.DataSC.Word_BB02], "_blank");
});

// btnModalRepairPdf03
btnModalRepairPdf03.addEventListener('click',  () => {
  const indexRepair = Number(FormRepairModal.dataset.indexRepair);
  const rowRepair = appData.DataSC[indexRepair];
  window.open(rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB03], "_blank");
});

// btnModalRepairWord03
btnModalRepairWord03.addEventListener('click',  () => {
  const indexRepair = Number(FormRepairModal.dataset.indexRepair);
  const rowRepair = appData.DataSC[indexRepair];
  window.open(rowRepair[CONFIG_COLUMNS.DataSC.Word_BB03], "_blank");
});

// btnModalRepairPdf04
btnModalRepairPdf04.addEventListener('click',  () => {
  const indexRepair = Number(FormRepairModal.dataset.indexRepair);
  const rowRepair = appData.DataSC[indexRepair];
  window.open(rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB04], "_blank");
});

// btnModalRepairWord04
btnModalRepairWord04.addEventListener('click',  () => {
  const indexRepair = Number(FormRepairModal.dataset.indexRepair);
  const rowRepair = appData.DataSC[indexRepair];
  window.open(rowRepair[CONFIG_COLUMNS.DataSC.Word_BB04], "_blank");
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
    appData.DataSC.forEach((item, index) => {
      if (item[CONFIG_COLUMNS.DataSC.trangthai] === strTrangThai && item[CONFIG_COLUMNS.DataSC.iduserdv] === userData.id) {
        // Tăng STT cho bảng báo hỏng
        valSTT++;
        //Lấy thông tin thiết bị 
        const idthietbi = item[CONFIG_COLUMNS.DataSC.idthietbi];
        const indexDevice = appData.DSThietBi.findIndex(item => item[CONFIG_COLUMNS.DSThietBi.id] === idthietbi);
        if (indexDevice === -1) {
          console.log(`Không tìm thấy thiết bị với id: ${idthietbi} item: ${JSON.stringify(item)}`);
          return; // Hoặc xử lý logic khác nếu cần
        }
        const rowDevice = appData.DSThietBi[indexDevice];
        const idusersua = item[CONFIG_COLUMNS.DataSC.idusersua];

        const indexUserSua = appData.DSUserSua.findIndex(item => item[CONFIG_COLUMNS.DSUserSua.id] === idusersua);
        if (indexUserSua === -1) {
          console.log("Không tìm thấy người sửa với id: " + idusersua);
          return; // Hoặc xử lý logic khác nếu cần
        }
        const rowUserSua = appData.DSUserSua[indexUserSua];

        valTableEach.innerHTML += `
        <tr class="align-middle">
            <td class="text-center">${valSTT}</td>
            <td>⚠️ ${item[CONFIG_COLUMNS.DataSC.id]} 🛠️ ${item[CONFIG_COLUMNS.DataSC.tinhtrangtbdvbao]} 🛠️<br>
              ♟️${rowDevice[CONFIG_COLUMNS.DSThietBi.mathietbi]}⚙️${rowDevice[CONFIG_COLUMNS.DSThietBi.tentb]}⚙️${rowDevice[CONFIG_COLUMNS.DSThietBi.model]}⚙️${rowDevice[CONFIG_COLUMNS.DSThietBi.serial]}⚙️${rowDevice[CONFIG_COLUMNS.DSThietBi.nuocsx]}<br>
              👨‍🔧${rowUserSua[CONFIG_COLUMNS.DSUserSua.hoten]} 📅${item[CONFIG_COLUMNS.DataSC.ngaydonvibao]}
            </td>
            <td class="d-flex align-middle align-items-center justify-content-center text-center gap-2" style="height:70%;"> 
                <button type="button" data-id-repair='${item[CONFIG_COLUMNS.DataSC.id]}' data-index-repair='${index}' data-id-device='${rowDevice[CONFIG_COLUMNS.DSThietBi.id]}' data-index-device='${indexDevice}' data-index-user-sua='${indexUserSua}' data-repair-status='${strTrangThai}' class="btn btn-outline-primary view-btn" data-bs-toggle="modal" data-bs-target="#FormRepairModal">
                    <i class="bi bi-eye-fill" style="font-size: 1.5rem; color:rgba(9, 23, 221, 0.85)"></i>
                </button>
                <button type="button" data-id-repair='${item[CONFIG_COLUMNS.DataSC.id]}' data-index-repair='${index}' data-id-device='${rowDevice[CONFIG_COLUMNS.DSThietBi.id]}' data-index-device='${indexDevice}' data-index-user-sua='${indexUserSua}' data-repair-status='${strTrangThai}' class="btn btn-outline-secondary edit-btn" data-bs-toggle="modal" data-bs-target="#FormRepairModal">
                    <i class="bi bi-pencil-square" style="font-size: 1.5rem; color:rgba(6, 248, 66, 0.85)"></i>
                </button>
                <button type="button" data-id-repair='${item[CONFIG_COLUMNS.DataSC.id]}' data-index-repair='${index}' data-id-device='${rowDevice[CONFIG_COLUMNS.DSThietBi.id]}' data-index-device='${indexDevice}'  data-index-user-sua='${indexUserSua}' class="btn btn-outline-danger del-btn">
                    <i class="bi bi-trash" style="font-size: 1.5rem; color:rgba(248, 6, 6, 0.85)"></i>
                </button>
            </td>
        </tr>
       `;
      }
    });
    // Cập nhật số lượng báo hỏng
    valTabEach.textContent = `${strTable} (${valSTT})`;

    //Add listener  event delegation 
    valTableEach.addEventListener('click', (event) => {
      const btnView = event.target.closest(`.view-btn`);
      const btnEdit = event.target.closest(`.edit-btn`);
      const btnDel = event.target.closest(`.del-btn`);
      // switch (strTrangThai) để thêm event listener cho các nút khác nhau
      switch (strTrangThai) {
        case CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA:
          if (btnView) {
            UpdateValViewModalRepair(btnView.dataset.idRepair, btnView.dataset.indexRepair, btnView.dataset.idDevice, btnView.dataset.indexDevice, btnView.dataset.indexUserSua, btnView.dataset.repairStatus, "View");
          }
          else if (btnEdit) {
            UpdateValViewModalRepair(btnEdit.dataset.idRepair, btnEdit.dataset.indexRepair, btnEdit.dataset.idDevice, btnEdit.dataset.indexDevice, btnEdit.dataset.indexUserSua, btnEdit.dataset.repairStatus, "Edit");
          }
          else if (btnDel) {
              console.log(`Nhấn nút Del Đề nghị sửa chữa. ID: ${btnDel.dataset.idRepair}. Row: ${btnDel.dataset.indexRepair} Device: ${btnDel.dataset.idDevice} IndexDevice: ${btnDel.dataset.indexDevice}`);
              showConfirm("Bạn có chắc chắn muốn xóa đề nghị sửa chữa này không?", "Xác nhận xóa", "Có", "Không").then((result) => {
                if (result.isConfirmed) {
                  // Xóa đề nghị sửa chữa
                  console.log("Xác nhận xóa đề nghị sửa chữa: " + btnDel.dataset.idRepair);
                  deleteRepair(btnDel.dataset.idRepair, btnDel.dataset.indexRepair, btnDel.dataset.idDevice, btnDel.dataset.indexDevice, btnDel.dataset.indexUserSua);
                }
              });
          }
          break;
        case CONFIG_ENUM.TRANGTHAI.KHAO_SAT:
          if (btnView) {
            UpdateValViewModalRepair(btnView.dataset.idRepair, btnView.dataset.indexRepair, btnView.dataset.idDevice, btnView.dataset.indexDevice, btnView.dataset.indexUserSua, btnView.dataset.repairStatus, "View");
          }
          else if (btnEdit) {
            UpdateValViewModalRepair(btnEdit.dataset.idRepair, btnEdit.dataset.indexRepair, btnEdit.dataset.idDevice, btnEdit.dataset.indexDevice, btnEdit.dataset.indexUserSua, btnEdit.dataset.repairStatus, "Edit");
          }
          break;
        case CONFIG_ENUM.TRANGTHAI.DANG_SUA:
          if (btnView) {
            UpdateValViewModalRepair(btnView.dataset.idRepair, btnView.dataset.indexRepair, btnView.dataset.idDevice, btnView.dataset.indexDevice, btnView.dataset.indexUserSua, btnView.dataset.repairStatus, "View");
          }
          else if (btnEdit) {
            UpdateValViewModalRepair(btnEdit.dataset.idRepair, btnEdit.dataset.indexRepair, btnEdit.dataset.idDevice, btnEdit.dataset.indexDevice, btnEdit.dataset.indexUserSua, btnEdit.dataset.repairStatus, "Edit");
          }
          break;
        case CONFIG_ENUM.TRANGTHAI.BAO_HANH:
          if (btnView) {
            UpdateValViewModalRepair(btnView.dataset.idRepair, btnView.dataset.indexRepair, btnView.dataset.idDevice, btnView.dataset.indexDevice, btnView.dataset.indexUserSua, btnView.dataset.repairStatus, "View");
          }
          else if (btnEdit) {
            UpdateValViewModalRepair(btnEdit.dataset.idRepair, btnEdit.dataset.indexRepair, btnEdit.dataset.idDevice, btnEdit.dataset.indexDevice, btnEdit.dataset.indexUserSua, btnEdit.dataset.repairStatus, "Edit");
          }
          break;
        case CONFIG_ENUM.TRANGTHAI.SUA_NGOAI:
          if (btnView) {
            UpdateValViewModalRepair(btnView.dataset.idRepair, btnView.dataset.indexRepair, btnView.dataset.idDevice, btnView.dataset.indexDevice, btnView.dataset.indexUserSua, btnView.dataset.repairStatus, "View");
          }
          else if (btnEdit) {
            UpdateValViewModalRepair(btnEdit.dataset.idRepair, btnEdit.dataset.indexRepair, btnEdit.dataset.idDevice, btnEdit.dataset.indexDevice, btnEdit.dataset.indexUserSua, btnEdit.dataset.repairStatus, "Edit");
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
  // Nhom thiết bị mrDeviceGroup
  updateSuggestionGroupDevice();
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

// Repair Modal - Update suggestion group device
function updateSuggestionGroupDevice(idGroupDevice = null, View_Edit = "Edit") {
  // Lọc danh sách thiết bị theo đơn vị và trạng thái Em011 Bình thường
  const filteredDevices = appData.DSThietBi.filter(item => item[CONFIG_COLUMNS.DSThietBi.donvi] === userData.id && item[CONFIG_COLUMNS.DSThietBi.tinhtrang] === CONFIG_ENUM.TINHTRANG_THIETBI.BINH_THUONG);
  // CONFIG_COLUMNS.DSThietBi.donvi CONFIG_COLUMNS.DSThietBi.tinhtrang
  // Lọc nhóm thiết bị set theo filteredDevices
  const listDeviceGroups = [...new Set(filteredDevices.map(item => item[CONFIG_COLUMNS.DSThietBi.nhomtb]))];

  if (idGroupDevice !== null) {
       listDeviceGroups.push(idGroupDevice);
  }
  
  // Thêm các nhóm thiết bị vào danh sách nhóm thiết bị
  mrDeviceGroup.innerHTML = '<option value="">-- Chọn nhóm thiết bị --</option>';
  listDeviceGroups.forEach(group => {
    const newOption = document.createElement('option');
    newOption.value = group;
    newOption.textContent = appData.DSNhomTB.find(item => item[CONFIG_COLUMNS.DSNhomTB.id] === group)[CONFIG_COLUMNS.DSNhomTB.nhomtb];
    mrDeviceGroup.appendChild(newOption);
  });
}
// Repair Modal - Update suggestion device based on selected group
function updateSuggestionDevice(valSelectedGroup, rowDevice = null, View_Edit = "Edit") {
  // Lọc danh sách thiết bị theo nhóm đã chọn và đơn vị
  const filteredDevices = appData.DSThietBi.filter(item => item[CONFIG_COLUMNS.DSThietBi.nhomtb] === valSelectedGroup && item[CONFIG_COLUMNS.DSThietBi.donvi] === userData.id && item[CONFIG_COLUMNS.DSThietBi.tinhtrang] === CONFIG_ENUM.TINHTRANG_THIETBI.BINH_THUONG);

  if (rowDevice !== null) {
    // Nếu có rowDevice, thêm nó vào danh sách thiết bị đã lọc
    filteredDevices.push(rowDevice);
  }

  if(View_Edit === "Edit")
  {
    mrDeviceID.innerHTML = '<option value="">-- Chọn mã thiết bị --</option>';
  }

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
function UpdateValViewModalRepair(idRepair, indexRepair, idDevice, indexDevice, indexUserSua, TrangThai, View_Edit = "View") {
  console.log("UpdateValViewModalRepair:", idRepair, indexRepair, idDevice, indexDevice, indexUserSua, TrangThai, View_Edit);

  // dataset
  FormRepairModal.dataset.idRepair = idRepair;
  FormRepairModal.dataset.indexRepair = indexRepair;
  FormRepairModal.dataset.idDevice = idDevice;
  FormRepairModal.dataset.indexDevice = indexDevice;
  FormRepairModal.dataset.indexUserSua = indexUserSua;

  // Lấy data row Repair
  const rowRepair = appData.DataSC[Number(indexRepair)]; 
  if  (rowRepair[CONFIG_COLUMNS.DataSC.id] !== idRepair) {
    console.log("Lỗi: ID sửa chữa không khớp với dữ liệu");
    console.log("rowRepair:", rowRepair); 
    return;
  }

  const rowDevice = appData.DSThietBi[Number(indexDevice)];
  if (rowDevice[CONFIG_COLUMNS.DSThietBi.id] !== idDevice) {
    console.log("Lỗi: ID thiết bị không khớp với dữ liệu");
    console.log("rowDevice:", rowDevice);
    return;
  }

  const rowUserSua = appData.DSUserSua[Number(indexUserSua)];

  // Cập nhật giá trị Modal Repair // Không có break để hiển thị các thông tin
  switch (TrangThai) {
    case CONFIG_ENUM.TRANGTHAI.HOAN_THANH:

    case CONFIG_ENUM.TRANGTHAI.SUA_NGOAI:

    case CONFIG_ENUM.TRANGTHAI.BAO_HANH:

    case CONFIG_ENUM.TRANGTHAI.DANG_SUA:

    case CONFIG_ENUM.TRANGTHAI.KHAO_SAT:

    case CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA:
      // Thông tin đơn vị
      mrRequesterName.value = rowRepair[CONFIG_COLUMNS.DataSC.hotenYeucau];
      mrRequesterPhone.value = rowRepair[CONFIG_COLUMNS.DataSC.sdtYeucau];

      //Thông tin người sửa
      mrRepairerName.value = rowUserSua[CONFIG_COLUMNS.DSUserSua.id];
      mrRepairerPhone.value = rowUserSua[CONFIG_COLUMNS.DSUserSua.sdt];

      // Nhóm thiết bị
      updateSuggestionGroupDevice(rowDevice[CONFIG_COLUMNS.DSThietBi.nhomtb], View_Edit);

      //Thông tin thiết bị
      mrDeviceGroup.value = rowDevice[CONFIG_COLUMNS.DSThietBi.nhomtb];

      updateSuggestionDevice(mrDeviceGroup.value, rowDevice, View_Edit);
      mrDeviceID.value = rowDevice[CONFIG_COLUMNS.DSThietBi.id];
      updateInformationDevice();
      //Thông tin tình trạng thiết bị
      mrDeviceStatus.value = rowRepair[CONFIG_COLUMNS.DataSC.tinhtrangtbdvbao];
      mrRequirementLevel.value = rowRepair[CONFIG_COLUMNS.DataSC.mucdo];

      //Thông tin ghi chú
      mrNote.value = rowRepair[CONFIG_COLUMNS.DataSC.ghichu];
      break;
    default:
      console.log("Value Default Modal Repair: " + TrangThai);
  }
  // Cập nhật tiêu đề Modal Repair
  FormRepairModalTitle.textContent =  strHeaderRepairModal(View_Edit, TrangThai);
  // Cập nhật Enable Input Modal Repair
  enableInputRepairModal(View_Edit, TrangThai);

  // Cập nhật hiển thị Button Modal Repair
  switch (View_Edit) {
    case "View":
      // Kiểm tra data trong ô file khác rỗng thì hiển thị
      if (rowRepair[CONFIG_COLUMNS.DataSC.Word_BB01]) {
        btnModalRepairWord01.style.display = "block";
      }
      if (rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB01]) {
        btnModalRepairPdf01.style.display = "block";
      }
      if (rowRepair[CONFIG_COLUMNS.DataSC.Word_BB02]) {
        btnModalRepairWord02.style.display = "block";
      }
      if (rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB02]) {
        btnModalRepairPdf02.style.display = "block";
      }
      if (rowRepair[CONFIG_COLUMNS.DataSC.Word_BB03]) {
        btnModalRepairWord03.style.display = "block";
      }
      if (rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB03]) {
        btnModalRepairPdf03.style.display = "block";
      }
      if (rowRepair[CONFIG_COLUMNS.DataSC.Word_BB04]) {
        btnModalRepairWord04.style.display = "block";
      } 
      if (rowRepair[CONFIG_COLUMNS.DataSC.Pdf_BB04]) {
        btnModalRepairPdf04.style.display = "block";
      }
      break;
    case "Edit":
      switch (TrangThai) { // View button
        case CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA:
          showButtonRepairModal(btn01_ModalRepairSave);
          break;
        case CONFIG_ENUM.TRANGTHAI.KHAO_SAT:
          showButtonRepairModal(btn02_ModalRepairSave);
          break;
        case CONFIG_ENUM.TRANGTHAI.DANG_SUA:
          showButtonRepairModal(btn03_ModalRepairSave);
          break;
        case CONFIG_ENUM.TRANGTHAI.BAO_HANH:
          showButtonRepairModal(btn04_ModalRepairSave);
          break;
        case CONFIG_ENUM.TRANGTHAI.SUA_NGOAI:
          showButtonRepairModal(btn05_ModalRepairSave);
          break;
        default:
          break;
      } // switch (TrangThai) -- case "Edit":
      break;
    default:
      console.log("Value Default View_Edit: " + View_Edit);
      break;
  } //switch (View_Edit)


  // Cập nhật View Modal Repair
  switch (TrangThai) {
    case CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA:
      showGroupRepairModal();
      mrRequesterName.focus();
      break;
    case CONFIG_ENUM.TRANGTHAI.KHAO_SAT:
      showGroupRepairModal(GroupQuyetDinh, GroupDaiDienBenhVien, GroupDaiDienDonVi, GroupThongTinKhaoSat);
      mrDecisionNumber.focus();
      break;
    case CONFIG_ENUM.TRANGTHAI.DANG_SUA:
      showGroupRepairModal(GroupQuyetDinh, GroupDaiDienBenhVien, GroupDaiDienDonVi, GroupThongTinKhaoSat, GroupNoiDungDeNghi, GroupDeviceStatusBG);
      mrProposalContent.focus();
      break;
    case CONFIG_ENUM.TRANGTHAI.BAO_HANH:
      showGroupRepairModal(GroupQuyetDinh, GroupDaiDienBenhVien, GroupDaiDienDonVi, GroupThongTinKhaoSat, GroupNoiDungDeNghi, GroupDeviceStatusBG);
      mrDeviceStatusBG.focus();
      break;
    case CONFIG_ENUM.TRANGTHAI.SUA_NGOAI:
      showGroupRepairModal(GroupQuyetDinh, GroupDaiDienBenhVien, GroupDaiDienDonVi, GroupThongTinKhaoSat, GroupNoiDungDeNghi, GroupDeviceStatusBG);
      mrDeviceStatusBG.focus();
      break;
    default:
      console.log("Value Default Modal Repair: " + TrangThai);
  }
}

// #region *** Add Event Form Repair Modal ***
//deleteRepair
async function deleteRepair(idRepair, indexRepair, idDevice, indexDevice, indexUserSua) {
  console.log(`Nhấn nút Del Đề nghị sửa chữa. ID: ${idRepair}. Row: ${indexRepair} Device: ${idDevice} IndexDevice: ${indexDevice} IndexUserSua: ${indexUserSua}`);

  // Lấy thông tin từ các trường trong modal
  const currentTime = new Date();
  const formattedDate = currentTime.toLocaleTimeString('vi-VN') + ' ' + currentTime.toLocaleDateString('vi-VN');
  let txtHistory = `* ${formattedDate} - ${userData.donvi}: Xóa báo hỏng\n`;


  // data Repair
  const rowRepair = appData.DataSC[Number(indexRepair)];
  console.log("rowRepair:", rowRepair);
  // data Device
  const rowDevice = appData.DSThietBi[Number(indexDevice)];
  console.log("rowDevice:", rowDevice);
  // data User Sua
  const rowUserSua = appData.DSUserSua[Number(indexUserSua)];
  console.log("rowUserSua:", rowUserSua);

  // Mức độ
  const rowMucDo = appData.EnumSetting.find(item => item[CONFIG_COLUMNS.EnumSetting.id] === rowRepair[CONFIG_COLUMNS.DataSC.mucdo]);
  console.log("rowMucDo:", rowMucDo);
  // Nếu không tìm thấy mức độ, sử dụng giá trị mặc định
  let nameMucDo = "";

  if (rowMucDo) {
    nameMucDo = rowMucDo[CONFIG_COLUMNS.EnumSetting.ten];
  }

  const objDeleteAPI = {
    repairID: idRepair,
    indexRepair: indexRepair,
    idDevice: idDevice,
    indexDevice: indexDevice,
    nameuserdv: userData.donvi,
    nameThietbi: rowDevice[CONFIG_COLUMNS.DSThietBi.tentb],
    nameModel: rowDevice[CONFIG_COLUMNS.DSThietBi.model],
    nameSerial: rowDevice[CONFIG_COLUMNS.DSThietBi.serial],
    nameTinhTrang: rowDevice[CONFIG_COLUMNS.DSThietBi.tinhtrang],
    nameMucDo: nameMucDo,
    nameNguoiYeuCau: rowRepair[CONFIG_COLUMNS.DataSC.hotenYeucau],
    nameSDTYeuCau: rowRepair[CONFIG_COLUMNS.DataSC.sdtYeucau],
    nameNguoiSua: rowUserSua[CONFIG_COLUMNS.DSUserSua.hoten],
    nameSDTNguoiSua: rowUserSua[CONFIG_COLUMNS.DSUserSua.sdt],
    history: txtHistory,
    timeupdate: formattedDate,
    idTeleNguoiSua: rowUserSua ? rowUserSua[CONFIG_COLUMNS.DSUserSua.usetele] || "" : ""
  };
  console.log("objDeleteAPI:", objDeleteAPI);
  // Hiển thị loading
  showloading("Đang xóa đề nghị sửa chữa...");
  const objDeleteRepair = await sendFormAPI("deleteRepair", objDeleteAPI);
  console.log("Kết quả xóa đề nghị sửa chữa:", objDeleteRepair);
  if (objDeleteRepair.status === "success") {
    showsucces("Đã xóa đề nghị sửa chữa thành công.");
    // Cập nhật DataSC
    appData.DataSC[Number(indexRepair)] = objDeleteRepair.rowRepair;
    // Cập nhật DataTB
    appData.DSThietBi[Number(indexDevice)] = objDeleteRepair.rowDevice;
    UpdateTablesRepair();
    updateSuggestionInRepairModal();
    // Đóng loading
    Swal.close();
  } else {
    showerror("Xóa đề nghị sửa chữa thất bại: " + objDeleteRepair.message);
    console.error("Lỗi xóa đề nghị sửa chữa:", objDeleteRepair.message);
  }
}

// Show Group Repair Modal
function showGroupRepairModal( ...groups) {
   try{
      GroupQuyetDinh.style.display = "none";
      GroupDaiDienBenhVien.style.display = "none";
      GroupDaiDienDonVi.style.display = "none";
      GroupThongTinKhaoSat.style.display = "none";
      GroupNoiDungDeNghi.style.display = "none";
      GroupDeviceStatusBG.style.display = "none";
      // Show only the groups passed as arguments
      if (groups && groups.length > 0) {
        groups.forEach(group => {
            group.style.display = "block";
        });
      }
  } catch (error) {
    console.error("Lỗi khi hiển thị nhóm nút trong Modal Repair:", error);
  }
}

// Show Button Repair Modal
function showButtonRepairModal(...buttons) {
  try {
    btnNew_ModalRepair.style.display = "none"; //Button Tạo mới
    btn01_ModalRepairSave.style.display = "none"; // Button Đề nghị sửa chữa
    btn02_ModalRepairSave.style.display = "none"; // Button Khảo sát tình trạng thiết bị hỏng
    btn03_ModalRepairSave.style.display = "none"; // Button Đang sửa
    btn04_ModalRepairSave.style.display = "none"; // Button Bảo hành
    btn05_ModalRepairSave.style.display = "none"; // Button Sửa ngoài

    btnModalRepairPdf01.style.display = "none";
    btnModalRepairWord01.style.display = "none";
    btnModalRepairPdf02.style.display = "none";
    btnModalRepairWord02.style.display = "none";
    btnModalRepairPdf03.style.display = "none";
    btnModalRepairWord03.style.display = "none";
    btnModalRepairPdf04.style.display = "none";
    btnModalRepairWord04.style.display = "none";
    buttons.forEach(button => {
      button.style.display = "block";
    });
  } catch (error) {
    console.error("Lỗi khi hiển thị nút trong Modal Repair:", error);
  }
}

// enableInputRepairModal
function enableInputRepairModal(View_Edit = "View", TrangThai) {
  // Disable các trường không cần thiết
  mrRequesterName.disabled = true; // Nhóm Đơn vị yêu cầu -- Repair Modal
  mrRequesterPhone.disabled = true;
  mrRepairerName.disabled = true; // Nhóm Người sửa chữa -- Repair Modal
  mrDeviceGroup.disabled = true; // Nhóm Thông tin thiết bị -- Repair Modal
  mrDeviceID.disabled = true;
  mrDeviceStatus.disabled = true;
  mrRequirementLevel.disabled = true;
  mrDecisionNumber.disabled = true; // Nhóm Quyết định sửa chữa -- Repair Modal
  mrDecisionDate.disabled = true;
  mrDaiDienName1.disabled = true; // Nhóm Đại diện bệnh viện -- Repair Modal
  mrDaiDienChucVu1.disabled = true;
  mrDaiDienName2.disabled = true;
  mrDaiDienChucVu2.disabled = true;
  mrDaiDienName3.disabled = true;
  mrDaiDienChucVu3.disabled = true;
  mrDaiDienName4.disabled = true;
  mrDaiDienChucVu4.disabled = true;
  mrDaiDienName5.disabled = true;
  mrDaiDienChucVu5.disabled = true;
  dvDaiDienName1.disabled = true; // Nhóm Đại diện đơn vị -- Repair Modal
  dvDaiDienChucVu1.disabled = true;
  dvDaiDienName2.disabled = true;
  dvDaiDienChucVu2.disabled = true;
  mrSurveyStatus.disabled = true; // Nhóm Thông tin khảo sát -- Repair Modal
  mrSurveyConclusion.disabled = true;
  mrRepairProposal.disabled = true;
  mrProposalContent.disabled = true; // Nhóm Nội dung đề nghị -- Repair Modal
  mrDeviceStatusBG.disabled = true; // Nhóm Tình trạng thiết bị -- Repair Modal
  mrNote.disabled = true;
  if (View_Edit === "Edit") {
  mrNote.disabled = false;
    switch (TrangThai) {
      case CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA:
        console.log("Trang Thai: DE_NGHI_SUA");
        // Đặt các trường editable
        mrRequesterName.disabled = false;
        mrRequesterPhone.disabled = false;
        mrRepairerName.disabled = false;
        mrDeviceGroup.disabled = false;
        mrDeviceID.disabled = false;
        mrDeviceStatus.disabled = false;
        mrRequirementLevel.disabled = false;
        mrNote.disabled = false;
        break;
      case CONFIG_ENUM.TRANGTHAI.KHAO_SAT:
        console.log("Trang Thai: KHAO_SAT");
        mrDecisionNumber.disabled = false; // Nhóm Quyết định sửa chữa -- Repair Modal
        mrDecisionDate.disabled = false;
        mrDaiDienName1.disabled = false; // Nhóm Đại diện bệnh viện -- Repair Modal
        mrDaiDienChucVu1.disabled = false;
        mrDaiDienName2.disabled = false;
        mrDaiDienChucVu2.disabled = false;
        mrDaiDienName3.disabled = false;
        mrDaiDienChucVu3.disabled = false;
        mrDaiDienName4.disabled = false;
        mrDaiDienChucVu4.disabled = false;
        mrDaiDienName5.disabled = false;
        mrDaiDienChucVu5.disabled = false;
        dvDaiDienName1.disabled = false; // Nhóm Đại diện đơn vị -- Repair Modal
        dvDaiDienChucVu1.disabled = false;
        dvDaiDienName2.disabled = false;
        dvDaiDienChucVu2.disabled = false;
        mrSurveyStatus.disabled = false; // Nhóm Thông tin khảo sát -- Repair Modal
        mrSurveyConclusion.disabled = false;
        mrRepairProposal.disabled = false;
        break;
      case CONFIG_ENUM.TRANGTHAI.DANG_SUA:
        console.log("Trang Thai: DANG_SUA");
        mrProposalContent.disabled = false; // Nhóm Nội dung đề nghị -- Repair Modal
        mrDeviceStatusBG.disabled = false; // Nhóm Tình trạng thiết bị -- Repair Modal
        break;
      case CONFIG_ENUM.TRANGTHAI.BAO_HANH:
        console.log("Trang Thai: BAO_HANH");
        mrDeviceStatusBG.disabled = false; // Nhóm Tình trạng thiết bị -- Repair Modal

        break;
      case CONFIG_ENUM.TRANGTHAI.SUA_NGOAI:
        console.log("Trang Thai: SUA_NGOAI");
        mrDeviceStatusBG.disabled = false; // Nhóm Tình trạng thiết bị -- Repair Modal

        break;
      default:
        console.log("Trang Thai khong hop le: " + TrangThai);
        break;
    }
  }
}

// strHeaderRepairModal
function strHeaderRepairModal(View_Edit, TrangThai) {
  let strHeader = "";
  switch (TrangThai) {
    case CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA:
      strHeader = "Đề nghị sửa chữa";
      break;
    case CONFIG_ENUM.TRANGTHAI.KHAO_SAT:
      strHeader = "Khảo sát tình trạng thiết bị hỏng";
      break;
    case CONFIG_ENUM.TRANGTHAI.DANG_SUA:
      strHeader = "Đang sửa";
      break;
    case CONFIG_ENUM.TRANGTHAI.BAO_HANH:
      // Cập nhật các trường trong Modal Repair
      strHeader = "Bảo hành";
      break;
    case CONFIG_ENUM.TRANGTHAI.SUA_NGOAI:
      // Cập nhật các trường trong Modal Repair
      strHeader = "Sửa ngoài";
      break;
    default:
      strHeader = "";
  }
  switch (View_Edit) {
    case "View":
      strHeader = "Cập nhật thông tin và tạo biên bản - " + strHeader;
      break;
    case "Edit":
      strHeader = "Xem thông tin - " + strHeader;
      break;
  }
  return strHeader;
}