console.log("Hello World");
import { CONFIG_COLUMNS } from "./config.js";
import { CONFIG_ENUM } from "./config.js";

const API_URL = "https://script.google.com/macros/s/AKfycbyD6LqYk_R6oDJd9jlyGjqJmOqBfCIHJGO8_HHpxVJ03vSgjobnBhQWbMLVaBx_uUNNew/exec";

// Global data variables
let userData = {};
let appData = {};
let currRepair;

///////////////////////////////////
// * Get Element
///////////////////////////////////
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
const tabRepairBaohong = document.getElementById('tabRepairBaohong');
const tabRepairDangsua = document.getElementById('tabRepairDangsua');
const tabRepairBaohanh = document.getElementById('tabRepairBaohanh');
const tabRepairSuangoai = document.getElementById('tabRepairSuangoai');

// TableBody -- Frame Main
const TableBodyBaohong = document.getElementById('TableBodyBaohong');
const TableBodyDangsua = document.getElementById('TableBodyDangsua');
const TableBodyBaohanh = document.getElementById('TableBodyBaohanh');
const TableBodySuangoai = document.getElementById('TableBodySuangoai');

// Repair Modal
const FormRepairModal = document.getElementById('FormRepairModal');
const FormRepairModalTitle = document.getElementById('FormRepairModalTitle');

// Nhóm Đơn vị yêu cầu -- Repair Modal

// const GroupDonViYC = document.getElementById('GroupDonViYC');




///////////////////////////////////
// * Add Event Listener
///////////////////////////////////
// Add Event Loading...
document.addEventListener('DOMContentLoaded', async () => {
  // Load data
  try {
    console.log("Vào Loading...");
    appData = await JSON.parse(localStorage.getItem("storeAppData"));
    } catch (error) {
      console.error("Lỗi:", error);
      appData = 0;
    }
  if(!appData){
    console.log("Vao API");
    appData = await sendFormAPI("getdata");
    localStorage.setItem("storeAppData", JSON.stringify(appData));
  }

  // Ẩn loading screen
  frmloading.style.display = "none";

  // Kiểm tra dữ liệu LocalStorage
  try{
    userData = await JSON.parse(localStorage.getItem("storeUserData"));
  } catch (error) {
    console.error("Lỗi:", error);
    userData = 0;
  }
  if (userData) {
    UpdateTablesRepair();
    updateUserInfo();
    // Ẩn phần đăng nhập Hiển thị phần chính
    frmlogin.style.display = "none";
    frmainApp.style.display = "block";
  }
});

// bsCollapseDonViYC = new bootstrap.Collapse(GroupDonViYC, { toggle: false });
//  bsCollapseDonViYC.hide(); // Ẩn nhóm Đơn vị yêu cầu khi khởi tạo
// new bootstrap.Collapse(GroupDonViYC, { toggle: false }).hide();
// const WGroupDonViYC = document.getElementById('wrapperDonViYC');

  // WGroupDonViYC.style.display = "none";

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

// Add Event  btnLogout
btnLogout.addEventListener('click', () => {
  // Xóa dữ liệu người dùng khỏi localStorage
  localStorage.removeItem("storeUserData");
  // Hiển thị lại phần đăng nhập
  frmlogin.style.display = "block";
  frmainApp.style.display = "none";
  // Reset userData
  userData = {};
});

// Add Event btnFreshData
btnFreshData.addEventListener('click', async () => {
  // Refresh data
  // Hiển thị loading
  frmloading.style.display = "flex";
  appData = await sendFormAPI("getdata");
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

// Add Event btnSearch
btnSearch.addEventListener('click', () => {
  const searchString = txtsearchInput.value.trim();
  if (!searchString) {
    showwarning("Vui lòng nhập từ khóa tìm kiếm!");
    return;
  }
    // Define tables, tab IDs, and tab names
    const allTables = [TableBodyBaohong, TableBodyDangsua, TableBodyBaohanh, TableBodySuangoai];
    const tabIds = [tabRepairBaohong, tabRepairDangsua, tabRepairBaohanh, tabRepairSuangoai];
    const tabNames = ["Báo hỏng", "Đang sửa", "Bảo hành", "Sửa ngoài"];
    
    try {
      // Convert search string to lowercase for case-insensitive comparison
      const searchTerm = searchString.toLowerCase();
      let totalMatchCount = 0;
      let matchCountPerTab = [0, 0, 0, 0];
      
      // Search in each tab and count matches
      allTables.forEach((tableBody, index) => {
        const rows = tableBody.getElementsByTagName('tr');
        
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
  if (txtsearchInput.value.trim() === '') {
    showinfor("Không có từ khóa tìm kiếm nào để hủy.");
    return;
  }
  txtsearchInput.value = '';
  UpdateTablesRepair();
  showsucces("Đã hủy tìm kiếm và hiển thị lại tất cả dữ liệu");
});

// Add Event btnAddRepair
btnAddRepair.addEventListener('click', () => {
  showConfirm('Bạn có chắc chắn muốn thêm mới phiếu sửa chữa không?', 'Xác nhận thêm mới', "thêm mới", "hủy")
    .then((result) => {
      if (result.isConfirmed) {
        // Xử lý khi người dùng xác nhận thêm mới
        console.log("Người dùng đã xác nhận thêm mới phiếu sửa chữa");
        // Reset form và hiển thị modal thêm mới
      } else {
        // Xử lý khi người dùng hủy
        console.log("Người dùng đã hủy thêm mới phiếu sửa chữa");
      }
    });
});


// * Function
///////////////////////////////////
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
  console.log(userData.logo);
}

// Cập nhật thông tin Repair
function UpdateTablesRepair(){
  // Hiển thị các bảng
  UpdatetableRepair_each("Báo hỏng", CONFIG_ENUM.TRANGTHAI.BAO_HONG, TableBodyBaohong, tabRepairBaohong);
  UpdatetableRepair_each("Đang sửa", CONFIG_ENUM.TRANGTHAI.DANG_SUA, TableBodyDangsua, tabRepairDangsua);
  UpdatetableRepair_each("Bảo hành", CONFIG_ENUM.TRANGTHAI.BAO_HANH, TableBodyBaohanh, tabRepairBaohanh);
  UpdatetableRepair_each("Sửa ngoài", CONFIG_ENUM.TRANGTHAI.SUA_NGOAI, TableBodySuangoai, tabRepairSuangoai);
}

function UpdatetableRepair_each(strTable, strTrangThai, valTableEach, valTabEach){
  valTableEach.innerHTML = "";
  let valSTT = 0;
  try {
    // Duyệt qua các dòng dữ liệu
    appData.DataSC.slice(1).forEach((item, index) => {
      if (item[CONFIG_COLUMNS.DataSC.trangthai] === strTrangThai && item[CONFIG_COLUMNS.DataSC.iduserdv] === userData.id ) {
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
    // console.log(`${CONFIG_ENUM.TRANGTHAI.BAO_HONG}-view-btn`);

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
      console.log(`Trang thai: ${strTrangThai}`);
      const btnView = event.target.closest(`.view-btn`);
      if (btnView) {
        console.log("Nut View duoc nhan");
        const repairIdView  = btnView.dataset.repairId;
        const rowDataView   = Number(btnView.dataset.repairRow) + 1;
        const repairStatsView   = btnView.dataset.repairStatus; //data-repair-status
        console.log(`Clicked. ID: ${repairIdView}. Row: ${rowDataView}. Status: ${repairStatsView}`);
        return;
      }
      
      //Edit
      const btnEdit = event.target.closest(`.edit-btn`);
      if (btnEdit) {
        console.log("Nut Edit duoc nhan");
        const repairIdEdit  = btnEdit.dataset.repairId;
        const rowDataEdit   = Number(btnEdit.dataset.repairRow) + 1;
        console.log(`Clicked. ID: ${repairIdEdit}. Row: ${rowDataEdit}`);
        return;
      }

      //Delete
      const btnDel = event.target.closest(`.del-btn`);
      if (btnDel) {
        console.log("Nut Del duoc nhan");
        const repairIdDel  = btnDel.dataset.repairId;
        const rowDataDel   = Number(btnDel.dataset.repairRow) + 1;
        console.log(`Clicked. ID: ${repairIdDel}. Row: ${rowDataDel}`);
        return;
      }
      console.log("Khong nhan vao nut");
  });

  } catch (error) {
    console.log("Đã xảy ra lỗi: " + error.message);
  }
}

