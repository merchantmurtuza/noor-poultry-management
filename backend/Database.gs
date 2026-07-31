/**
 * Gets the configured spreadsheet. This is the only function that opens a spreadsheet by ID.
 * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet}
 */
function dbGetSpreadsheet() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}

/**
 * Gets a sheet by name, creating it with configured headers when missing.
 * @param {string} sheetName Sheet name.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function dbGetSheet(sheetName) {
  const spreadsheet = dbGetSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    dbEnsureHeaders(sheetName);
  }
  return sheet;
}

/**
 * Ensures all configured sheets and headers exist.
 * @returns {{success:boolean,message:string,data:Object}}
 */
function dbInitialize() {
  Object.keys(CONFIG.HEADERS).forEach(dbEnsureHeaders);
  return createSuccessResponse({ sheets: Object.keys(CONFIG.HEADERS) }, 'Database initialized.');
}

/**
 * Ensures a sheet has the configured header row.
 * @param {string} sheetName Sheet name.
 */
function dbEnsureHeaders(sheetName) {
  const spreadsheet = dbGetSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(sheetName);
  const headers = CONFIG.HEADERS[sheetName];
  if (!headers) return;
  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const missing = headers.some((header, index) => firstRow[index] !== header);
  if (missing) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

/**
 * Reads rows as objects keyed by header name.
 * @param {string} sheetName Sheet name.
 * @returns {Object[]}
 */
function dbGetRecords(sheetName) {
  const sheet = dbGetSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values[0];
  return values.slice(1).filter(row => row.some(cell => cell !== '')).map(row => {
    return headers.reduce((record, header, index) => {
      record[header] = row[index];
      return record;
    }, {});
  });
}

/**
 * Appends a row to a configured sheet.
 * @param {string} sheetName Sheet name.
 * @param {Array<*>} row Row values.
 * @returns {number} One-based row number.
 */
function dbAppendRow(sheetName, row) {
  const sheet = dbGetSheet(sheetName);
  sheet.appendRow(row);
  return sheet.getLastRow();
}

/**
 * Writes objects to a sheet, replacing all existing data after headers.
 * @param {string} sheetName Sheet name.
 * @param {Object[]} records Records to write.
 */
function dbReplaceRecords(sheetName, records) {
  const sheet = dbGetSheet(sheetName);
  const headers = CONFIG.HEADERS[sheetName];
  if (sheet.getLastRow() > 1) sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  if (!records.length) return;
  const rows = records.map(record => headers.map(header => record[header] === undefined ? '' : record[header]));
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}
