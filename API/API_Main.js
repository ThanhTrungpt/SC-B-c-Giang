// API/API_Main.js
function doPost(e) {
  const params = e.parameter;
  const action = params.action;

  let result;

  switch (action) {
    case "checkAPI":
      result = checkAPI(params);
      break;
    case "getdata":
      result = getdata();
      break;
    case "addnewrepair":
      result = addNewRepair(params);
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