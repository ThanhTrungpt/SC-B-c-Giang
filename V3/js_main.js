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

// Frame Login

// Frame Main
// Head -- Frame Main
const frmainApp = document.getElementById('frmainApp');
//frmainApp.style.display = "block";
//frmainApp.style.display = "none";

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


// const history_baohong = document.getElementById("history_baohong");




///////////////////////////////////
// * Add Event Listener
///////////////////////////////////

document.addEventListener('DOMContentLoaded', async () => {
  // Load data
  appData = await JSON.parse(localStorage.getItem("storeAppData"));
  // console.log (appData);
  if(!appData){
    console.log("Vao API");
    appData = await sendFormAPI("getdata");
    localStorage.setItem("storeAppData", JSON.stringify(appData));
  }
  userData = {
    id: "UDV001",
    donvi: "Đơn Vị Can Thiệp Mạch",
    Kyhieu: "DVCTM",
    Anh: "1mPlDPwnPbrYC5Sb5gsjnXkIrAt_GUYxx"
  };
   UpdatetablesRepair();
});

///////////////////////////////////
// * Function
///////////////////////////////////
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

function UpdatetablesRepair(){
  UpdatetableRepair_each("Báo hỏng", CONFIG_ENUM.TRANGTHAI.BAO_HONG, TableBodyBaohong, tabRepairBaohong);
  UpdatetableRepair_each("Đang sửa", CONFIG_ENUM.TRANGTHAI.DANG_SUA, TableBodyDangsua, tabRepairDangsua);
  UpdatetableRepair_each("Bảo hành", CONFIG_ENUM.TRANGTHAI.BAO_HANH, TableBodyBaohanh, tabRepairBaohanh);
  UpdatetableRepair_each("Sửa ngoài", CONFIG_ENUM.TRANGTHAI.SUA_NGOAI, TableBodySuangoai, tabRepairSuangoai);
}

function UpdatetableRepair_each(strTable, strTrangThai, valTableEach, valTabEach){
  valTableEach.innerHTML = "";
  let valSTT = 0;
  // console.log(strTrangThai);
  try {
    // Duyệt qua các dòng dữ liệu
    appData.val_DataSC.slice(1).forEach((item, index) => {
      if (item[CONFIG_COLUMNS.DataSC.trangthai] === strTrangThai && item[CONFIG_COLUMNS.DataSC.iduserdv] === userData.id ) {
        // Tăng STT cho bảng báo hỏng
        valSTT++;
        //Lấy thông tin thiết bị 
        const idthietbi = item[CONFIG_COLUMNS.DataSC.idthietbi];
        const rowsthietbi = appData.val_DSThietBi.filter(item => item[CONFIG_COLUMNS.DSThietBi.id] === idthietbi);   
        if (rowsthietbi.length === 0) {
            console.log("Không tìm thấy thiết bị với id: " + idthietbi);
            return; // Hoặc xử lý logic khác nếu cần
        }
        const rowthietbi = rowsthietbi[0]
        const idusersua = item[CONFIG_COLUMNS.DataSC.idusersua];
        const rowsnguoisua = appData.val_DSUserSua.filter(item => item[CONFIG_COLUMNS.DSUserSua.id] === idusersua);   
        if (rowsnguoisua.length === 0) {
            console.log("Không tìm thấy người sửa với id: " + idusersua);
            return; // Hoặc xử lý logic khác nếu cần
        } 
        const rownguoisua = rowsnguoisua[0]
       
       valTableEach.innerHTML += `
        <tr class="align-middle">
            <td class="text-center">${valSTT}</td>
            <td>⚠️ ${item[CONFIG_COLUMNS.DataSC.id]} 🛠️ ${item[CONFIG_COLUMNS.DataSC.tinhtrangtbdvbao]} 🛠️<br>
              ♟️${rowthietbi[CONFIG_COLUMNS.DSThietBi.id]}⚙️${rowthietbi[CONFIG_COLUMNS.DSThietBi.DSThietBi]}⚙️${rowthietbi[CONFIG_COLUMNS.DSThietBi.model]}⚙️${rowthietbi[CONFIG_COLUMNS.DSThietBi.serial]}⚙️${rowthietbi[CONFIG_COLUMNS.DSThietBi.nuocsx]}<br>
              👨‍🔧${rownguoisua[CONFIG_COLUMNS.DSUserSua.DSUserSua]} 📅${item[CONFIG_COLUMNS.DataSC.ngaydonvibao]}
            </td>
            <td class="d-flex align-items-center justify-content-center text-center gap-2"> 
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
    //     console.log(appData.val_DataSC[Number(button.dataset.repairRow) + 1]);
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

