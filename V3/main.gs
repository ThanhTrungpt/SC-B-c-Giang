console.log("Hello World");
const API_URL = "";

let formRepairModalInstance = null;
// Global data variables
let userData = {};
let appData = {};
let data_Repair_DV = {};
let CONFIG_COLUMNS = {};
let CONFIG_ENUM = {};
let val_Repair = {
  MaxId_Count: 0,
  MaxRow_Id: 0,
  CurrentRow_Id: 0
};

///////////////////////////////////
// 1. Nhóm hàm xử lý dữ liệu ban đầu
///////////////////////////////////
// 1.1. Bắt sự kiện để tải dữ liệu
document.addEventListener('DOMContentLoaded', function() {
  // Load data
  loadAllData();
});

// 1.2. Hàm tải dữ liệu
async function loadAllData() {
  console.log('Starting to load data...');
  const formData = "GetData";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
