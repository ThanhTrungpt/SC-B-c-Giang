// This is the main code file for the web app
// This file contains the code for the server side functions
function doGet() {
  return HtmlService.createTemplateFromFile("index.html")
    .evaluate()
    .setTitle("Google Apps Script - Web App Template")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// This function is used to save the Schema and app settings to the script properties by reading from the App Settings sheet and Schema sheet
const saveAppPrefs = () => {
  const obj = {};
  const settingsSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("App Settings");
  const appSettings = settingsSheet
    .getRange(1, 1, settingsSheet.getLastRow(), settingsSheet.getLastColumn())
    .getValues();
  const appSettingsHeaders = appSettings.shift();
  const appSettingsJsonArray = appSettings.map((row) => {
    return row.reduce((obj, value, index) => {
      obj[appSettingsHeaders[index]] = value;
      return obj;
    }, {});
  });
  obj.appSettings = appSettingsJsonArray[0];

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    obj.appSettings.SchemaSheet
  );

  const data = sheet
    .getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn())
    .getValues();
  const headers = data.shift();
  const jsonArray = data.map((row) => {
    return row.reduce((obj, value, index) => {
      obj[headers[index]] = value;
      return obj;
    }, {});
  });

  obj.schema = jsonArray;

  // save to script properties
  PropertiesService.getScriptProperties().setProperty(
    "appPrefs",
    JSON.stringify(obj)
  );
  return jsonArray;
};

// This function is used to get the appPrefs from the script properties
function getAppPrefs() {
  const appPrefs =
    PropertiesService.getScriptProperties().getProperty("appPrefs");
  return JSON.parse(appPrefs);
}

// This function is used to populate the dropdown list of sheets in the App Settings sheet
function getAllSheets() {
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  const sheetNames = sheets.map((sheet) => sheet.getName());

  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(sheetNames)
    .build();
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("App Settings");
  sheet.getRange("D2:E2").setDataValidation(rule);
}

// ----------------- ORM Class -------------------
class ORM {
  constructor() {
    this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      getAppPrefs().appSettings.DataEntrySheet
    );
    this.ID_COL = getAppPrefs().appSettings.IdColumn;
  }

  // Create a new record
  create(data) {
    const id = this.getNextId() || 1;
    data[this.ID_COL] = id;
    data["Challan No."] = id;
    //Get 2 dimensional Array Data from dataset
    const headers = this.sheet
      .getRange(1, 1, 1, this.sheet.getLastColumn())
      .getValues()[0];

    const newRow = [];

    for (const header of headers) {
      newRow.push(data[header] || "");
    }
    this.sheet.appendRow(newRow);
  }

  // Read all records
  readAll() {
    const dataRange = this.sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0];
    const records = [];
    //Returning data from multi-dimensional array
    for (let i = 1; i < values.length; i++) {
      const record = {};
      for (let j = 0; j < headers.length; j++) {
        record[headers[j]] = values[i][j];
      }
      records.push(record);
    }
    Logger.log(records);
    return records.reverse();
  }

  // Read a specific record by ID
  readById(id) {
    const dataRange = this.sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0];
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === id) {
        const record = {};
        for (let j = 0; j < headers.length; j++) {
          record[headers[j]] = values[i][j];
        }
        return record;
      }
    }
    return null;
  }

  // Update a record by ID
  updateById(data) {
    const dataRange = this.sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0];

    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == data[this.ID_COL]) {
        for (const key in data) {
          const columnIndex = headers.indexOf(key);
          if (columnIndex !== -1) {
            values[i][columnIndex] = data[key];
          }
        }
        dataRange.setValues(values);
        return true;
      }
    }
    return false;
  }

  // Delete a record by ID
  deleteById(record) {
    const id = record[this.ID_COL];
    const dataRange = this.sheet.getDataRange();
    const values = dataRange.getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == id) {
        this.sheet.deleteRow(i + 1);
        return true;
      }
    }
    return false;
  }

  // Get the next ID
  getNextId() {
    const dataRange = this.sheet.getDataRange();
    const values = dataRange.getValues();
    let maxId = 0;
    for (let i = 1; i < values.length; i++) {
      const id = values[i][0];
      if (id > maxId) {
        maxId = id;
      }
    }
    return maxId + 1;
  }
}

// ----------Callables Methods ------------

// Create a new record
function createRecord(data) {
  const orm = new ORM();
  orm.create(data);
}

// Read all records
function readAllRecords() {
  const orm = new ORM();
  const allRecords = orm.readAll();
  return JSON.stringify(allRecords);
}

// Read a specific record by ID
function readRecordById(recordId) {
  const orm = new ORM();
  const specificRecord = orm.readById(recordId);
}

// Update a record by ID
function updateRecordById(data) {
  const orm = new ORM();
  const isUpdated = orm.updateById(data);
}

// Delete a record by ID
function deleteRecord(record) {
  const orm = new ORM();
  const isDeleted = orm.deleteById(record);
}

//------------ This is maintanance code. You don't need to bother about the code below.------------

function SixHourlyMaintenanceRun() {
  seedDataToActiveSpreadsheet(fake_employees, "Records");
  seedDataToActiveSpreadsheet(fake_projects, "Projects");
}

const fake_employees = [
  [
    "Name",
    "Age",
    "Gender",
    "Salary",
    "Date of Joining",
    "Department",
    "City",
    "Employee ID",
    "Performance Rating",
  ],
  ["John Doe", 28, "Male", 60000, "2020-01-15", "IT", "New York", 101, 4],
  [
    "Jane Smith",
    35,
    "Female",
    75000,
    "2018-03-20",
    "Finance",
    "Chicago",
    102,
    5,
  ],
  ["Bob Johnson", 40, "Male", 80000, "2015-07-10", "HR", "Los Angeles", 103, 3],
  [
    "Alice Davis",
    25,
    "Female",
    55000,
    "2021-02-05",
    "Marketing",
    "San Francisco",
    104,
    4,
  ],
  ["Charlie Brown", 32, "Male", 70000, "2016-09-12", "IT", "Seattle", 105, 3],
  ["Eva White", 28, "Female", 65000, "2019-11-30", "Finance", "Boston", 106, 5],
  ["David Lee", 45, "Male", 90000, "2014-05-25", "HR", "Chicago", 107, 4],
  [
    "Grace Turner",
    30,
    "Female",
    68000,
    "2017-08-18",
    "Marketing",
    "Los Angeles",
    108,
    3,
  ],
  ["Frank Miller", 38, "Male", 85000, "2013-12-08", "IT", "New York", 109, 5],
  [
    "Helen Johnson",
    27,
    "Female",
    62000,
    "2020-04-02",
    "HR",
    "San Francisco",
    110,
    4,
  ],
  [
    "Jack Taylor",
    33,
    "Male",
    72000,
    "2018-06-14",
    "Marketing",
    "Seattle",
    111,
    3,
  ],
  ["Karen White", 29, "Female", 63000, "2019-09-08", "IT", "Boston", 112, 4],
  [
    "Mark Davis",
    42,
    "Male",
    88000,
    "2016-03-30",
    "Finance",
    "Los Angeles",
    113,
    5,
  ],
  [
    "Nancy Johnson",
    31,
    "Female",
    67000,
    "2017-11-23",
    "HR",
    "New York",
    114,
    3,
  ],
  [
    "Oscar Brown",
    36,
    "Male",
    76000,
    "2015-01-10",
    "Marketing",
    "Chicago",
    115,
    4,
  ],
  [
    "Pamela Smith",
    26,
    "Female",
    59000,
    "2020-07-05",
    "IT",
    "San Francisco",
    116,
    5,
  ],
  [
    "Quincy Adams",
    34,
    "Male",
    78000,
    "2019-04-18",
    "Finance",
    "Seattle",
    117,
    3,
  ],
  ["Rachel Lee", 39, "Female", 82000, "2014-08-22", "HR", "Boston", 118, 4],
  [
    "Sam Turner",
    28,
    "Male",
    61000,
    "2020-05-12",
    "Marketing",
    "Los Angeles",
    119,
    5,
  ],
  ["Tina Miller", 37, "Female", 80000, "2015-10-27", "IT", "New York", 120, 3],
  [
    "Ulysses Grant",
    32,
    "Male",
    74000,
    "2016-12-03",
    "Finance",
    "Chicago",
    121,
    4,
  ],
  [
    "Victoria White",
    30,
    "Female",
    67000,
    "2017-02-28",
    "HR",
    "San Francisco",
    122,
    5,
  ],
  [
    "Walter Scott",
    43,
    "Male",
    91000,
    "2013-06-16",
    "Marketing",
    "Seattle",
    123,
    3,
  ],
  ["Xena Johnson", 27, "Female", 64000, "2020-09-20", "IT", "Boston", 124, 4],
  [
    "Yoda Brown",
    35,
    "Male",
    77000,
    "2018-01-07",
    "Finance",
    "Los Angeles",
    125,
    5,
  ],
  ["Zara Taylor", 29, "Female", 60000, "2019-10-15", "HR", "New York", 126, 3],
  [
    "Aaron Davis",
    31,
    "Male",
    70000,
    "2016-04-28",
    "Marketing",
    "Chicago",
    127,
    4,
  ],
  [
    "Bella Lee",
    28,
    "Female",
    65000,
    "2017-11-01",
    "IT",
    "San Francisco",
    128,
    5,
  ],
  [
    "Chris Turner",
    36,
    "Male",
    80000,
    "2014-03-14",
    "Finance",
    "Seattle",
    129,
    3,
  ],
  ["Diana Smith", 33, "Female", 72000, "2015-08-09", "HR", "Boston", 130, 4],
  [
    "Evan White",
    42,
    "Male",
    86000,
    "2013-09-25",
    "Marketing",
    "Los Angeles",
    131,
    5,
  ],
  ["Fiona Miller", 26, "Female", 59000, "2020-12-02", "IT", "New York", 132, 3],
  [
    "George Johnson",
    39,
    "Male",
    83000,
    "2016-07-18",
    "Finance",
    "Chicago",
    133,
    4,
  ],
  [
    "Holly Adams",
    31,
    "Female",
    68000,
    "2017-04-04",
    "HR",
    "San Francisco",
    134,
    5,
  ],
  [
    "Ian Brown",
    29,
    "Male",
    66000,
    "2018-11-19",
    "Marketing",
    "Seattle",
    135,
    3,
  ],
  ["Jenna White", 38, "Female", 79000, "2015-02-22", "IT", "Boston", 136, 4],
  [
    "Kevin Taylor",
    27,
    "Male",
    63000,
    "2019-05-08",
    "Finance",
    "Los Angeles",
    137,
    5,
  ],
  ["Linda Davis", 34, "Female", 71000, "2014-10-11", "HR", "New York", 138, 3],
  [
    "Michael Lee",
    43,
    "Male",
    90000,
    "2013-03-27",
    "Marketing",
    "Chicago",
    139,
    4,
  ],
  [
    "Nina Turner",
    30,
    "Female",
    64000,
    "2016-08-14",
    "IT",
    "San Francisco",
    140,
    5,
  ],
  [
    "Oliver Brown",
    32,
    "Male",
    75000,
    "2015-01-30",
    "Finance",
    "Seattle",
    141,
    3,
  ],
];
const fake_projects = [
  [
    "Project Name",
    "Category",
    "Deadline",
    "Status",
    "Approval",
    "Priority",
    "Assigned User",
  ],
  [
    "Project X",
    "Web Development",
    "2023-02-15",
    "In-Progress",
    "Yes",
    "High",
    "Alice",
  ],
  ["Project Y", "Mobile App", "2023-03-10", "Completed", "No", "Medium", "Bob"],
  [
    "Project Z",
    "Data Analysis",
    "2023-04-05",
    "Pending",
    "Yes",
    "Low",
    "Charlie",
  ],
  [
    "Project A",
    "Machine Learning",
    "2023-05-20",
    "In-Progress",
    "No",
    "High",
    "Alice",
  ],
  [
    "Project B",
    "UI/UX Design",
    "2023-06-15",
    "Pending",
    "Yes",
    "Medium",
    "David",
  ],
  [
    "Project C",
    "Database Management",
    "2023-07-01",
    "Completed",
    "No",
    "Low",
    "Bob",
  ],
  [
    "Project D",
    "DevOps",
    "2023-08-12",
    "In-Progress",
    "Yes",
    "High",
    "Charlie",
  ],
  [
    "Project E",
    "Cybersecurity",
    "2023-09-25",
    "Pending",
    "No",
    "Medium",
    "Alice",
  ],
  [
    "Project F",
    "Cloud Computing",
    "2023-10-30",
    "Completed",
    "Yes",
    "Low",
    "David",
  ],
  ["Project G", "Blockchain", "2023-11-15", "In-Progress", "No", "High", "Bob"],
  [
    "Project H",
    "Artificial Intelligence",
    "2023-12-20",
    "Pending",
    "Yes",
    "Medium",
    "Charlie",
  ],
  [
    "Project I",
    "Software Testing",
    "2024-01-05",
    "Completed",
    "No",
    "Low",
    "Alice",
  ],
  [
    "Project J",
    "Network Security",
    "2024-02-18",
    "In-Progress",
    "Yes",
    "High",
    "David",
  ],
  [
    "Project K",
    "IoT Development",
    "2024-03-22",
    "Pending",
    "No",
    "Medium",
    "Bob",
  ],
  [
    "Project L",
    "Data Science",
    "2024-04-30",
    "Completed",
    "Yes",
    "Low",
    "Charlie",
  ],
  [
    "Project M",
    "Web Development",
    "2024-05-15",
    "In-Progress",
    "No",
    "High",
    "Alice",
  ],
  [
    "Project N",
    "Mobile App",
    "2024-06-20",
    "Pending",
    "Yes",
    "Medium",
    "David",
  ],
  ["Project O", "Data Analysis", "2024-07-05", "Completed", "No", "Low", "Bob"],
  [
    "Project P",
    "Machine Learning",
    "2024-08-10",
    "In-Progress",
    "Yes",
    "High",
    "Charlie",
  ],
  [
    "Project Q",
    "UI/UX Design",
    "2024-09-25",
    "Pending",
    "No",
    "Medium",
    "Alice",
  ],
  [
    "Project R",
    "Database Management",
    "2024-10-30",
    "Completed",
    "Yes",
    "Low",
    "David",
  ],
  ["Project S", "DevOps", "2024-11-15", "In-Progress", "No", "High", "Bob"],
  [
    "Project T",
    "Cybersecurity",
    "2024-12-20",
    "Pending",
    "Yes",
    "Medium",
    "Charlie",
  ],
  [
    "Project U",
    "Cloud Computing",
    "2025-01-05",
    "Completed",
    "No",
    "Low",
    "Alice",
  ],
  [
    "Project V",
    "Blockchain",
    "2025-02-18",
    "In-Progress",
    "Yes",
    "High",
    "David",
  ],
  [
    "Project W",
    "Artificial Intelligence",
    "2025-03-22",
    "Pending",
    "No",
    "Medium",
    "Bob",
  ],
  [
    "Project X",
    "Software Testing",
    "2025-04-30",
    "Completed",
    "Yes",
    "Low",
    "Charlie",
  ],
  [
    "Project Y",
    "Network Security",
    "2025-05-15",
    "In-Progress",
    "No",
    "High",
    "Alice",
  ],
  [
    "Project Z",
    "IoT Development",
    "2025-06-20",
    "Pending",
    "Yes",
    "Medium",
    "David",
  ],
  ["Project A", "Data Science", "2025-07-05", "Completed", "No", "Low", "Bob"],
  [
    "Project B",
    "Web Development",
    "2025-08-10",
    "In-Progress",
    "Yes",
    "High",
    "Charlie",
  ],
  ["Project C", "Mobile App", "2025-09-25", "Pending", "No", "Medium", "Alice"],
];
const seedDataToActiveSpreadsheet = (data = fake_projects, targetSheetName) => {
  data.shift();
  data = data.map((row, i) => {
    row = [i + 1, ...row];
    return row;
  });
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(targetSheetName);
  sheet.getDataRange().offset(1, 0).clearContent();
  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
};
