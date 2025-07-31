


function doPost(e) {
  const params = e.parameter;
  const action = params.action;

  let result;

  switch (action) {
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