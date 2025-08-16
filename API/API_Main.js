// API/API_Main.js
function doPost(e) {
  const params = e.parameter;
  const action = params.action;

  let result;

  switch (action) {
    case "checkAPI":
      result = checkAPI(params);
      break;
    case "editProfile":
      result = editProfile(params);
      break;
    case "changePassword":
      result = changePassword(params);
      break;
    case "editProfileRepair":
      result = editProfileRepair(params);
      break;
    case "changePasswordRepair":
      result = changePasswordRepair(params);
      break;
    case "getdata":
      result = getdata();
      break;
    case "addNewRepair":
      result = addNewRepair(params);
      break;
    case "deleteRepair":
      result = deleteRepair(params);
      break;
    case "updateRepairDn01":
      result = updateRepairDn01(params);
      break;
    case "updateRepairDn02":
      result = updateRepairDn02(params);
      break;    
    case "updateRepairDn03":
      result = updateRepairDn03(params);
      break;
    case "updateRepairDn04":
      result = updateRepairDn04(params);
      break;
    case "switchStateRepair_Device":
      result = switchStateRepair_Device(params);
      break;
    default:
      result = { status: "lỗi action error", message: "Unknown action" };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function checkAPI(params) {
  try {
    return { status: "success", message: "API is working" , data: params };
  } catch (error) {
    return { status: "error", message: error.message };
  } 
}