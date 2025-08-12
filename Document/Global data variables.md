// #region *** Global data variables ***
let userData = {};
let appData = {};
let currRepair;
// #endregion

// #region * Get Element
// Frame Loading
frmloading

// Frame Login
frmlogin
btnLoginSubmit

// Frame Main
frmainApp
//frmainApp.style.display = "block";
//frmainApp.style.display = "none";

// Head -- Frame Main
userNametxt
userAvatarimg

btnFreshData
btnEdituser
btnChangePw
btnLogout
enableInputRepairModal(View_Edit, TrangThai);
    case CONFIG_ENUM.TRANGTHAI.DE_NGHI_SUA:
    case "Edit":

// Nút bấm, tìm kiếm -- Frame Main
btnAddRepair
txtsearchInput
btnSearch
btnSearchCancel

// Tabs -- Frame Main
tabRepairDeNghi
tabRepairKhaoSat
tabRepairDangsua
tabRepairBaohanh
tabRepairSuangoai

// TableBody -- Frame Main
TableBodyDeNghi
TableBodyKhaosat
TableBodyDangsua
TableBodyBaohanh
TableBodySuangoai

// Repair Modal
FormRepairModal
FormRepairModalTitle

// Nhóm Đơn vị yêu cầu -- Repair Modal
mrDepartmentName
mrRequesterName
mrRequesterPhone
// Nhóm Người sửa chữa -- Repair Modal
mrRepairerName
mrRepairerPhone
// Nhóm Thông tin thiết bị -- Repair Modal
mrDeviceGroup
mrDeviceID
mrDeviceName
mrManufacturer
mrModel
mrSerial
mrYearManufactured
mrYearInUse
mrLocation
mrWarrantyExpiry
mrRequirementLevel
mrDeviceStatus

// Nhóm Quyết định -- Repair Modal
mrDecisionNumber
mrDecisionDate

// Nhóm Đại diện bệnh viện -- Repair Modal
mrDaiDienName1
mrDaiDienChucVu1
mrDaiDienName2
mrDaiDienChucVu2
mrDaiDienName3
mrDaiDienChucVu3
mrDaiDienName4
mrDaiDienChucVu4
mrDaiDienName5
mrDaiDienChucVu5

// Nhóm Đại diện đơn vị -- Repair Modal
dvDaiDienName1
dvDaiDienChucVu1
dvDaiDienName2
dvDaiDienChucVu2

// Thông tin khảo sát -- Repair Modal
mrSurveyStatus
mrSurveyConclusion
mrRepairProposal

// Nhóm Nội dung đề nghị -- Repair Modal
mrProposalContent

// Nhóm Tình trạng thiết bị bàn giao -- Repair Modal
mrDeviceStatusBG

// Nhóm Ghi chú -- Repair Modal
mrNote

// Button -- Repair Modal
btnNew_ModalRepair
btn01_ModalRepairSave
btn02_ModalRepairSave
btn03_ModalRepairSave
btn04_ModalRepairSave
btn05_ModalRepairSave

// Group Repair Modal
GroupDonViYC
GroupNguoiSuaChua
GroupThongTinThietBi
GroupThongTinTinhTrangThietBi

GroupQuyetDinh
GroupDaiDienBenhVien
GroupDaiDienDonVi
GroupThongTinKhaoSat

GroupNoiDungDeNghi
GroupDeviceStatusBG
group 
button
buttonFile

const btnModalRepairPdf01 = document.getElementById('btnModalRepairPdf01');
const btnModalRepairWord01 = document.getElementById('btnModalRepairWord01');
const btnModalRepairPdf02 = document.getElementById('btnModalRepairPdf02');
const btnModalRepairWord02 = document.getElementById('btnModalRepairWord02');
const btnModalRepairPdf03 = document.getElementById('btnModalRepairPdf03');
const btnModalRepairWord03 = document.getElementById('btnModalRepairWord03');
const btnModalRepairPdf04 = document.getElementById('btnModalRepairPdf04');
const btnModalRepairWord04 = document.getElementById('btnModalRepairWord04');

      GroupQuyetDinh.style.display = "none";
      GroupDaiDienBenhVien.style.display = "none";
      GroupDaiDienDonVi.style.display = "none";
      GroupThongTinKhaoSat.style.display = "none";
      GroupNoiDungDeNghi.style.display = "none";
      GroupDeviceStatusBG.style.display = "none";