/**
 * Serves the NOOR Poultry ERP web application.
 * @returns {GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet() {
  return HtmlService.createTemplateFromFile('frontend/Index')
    .evaluate()
    .setTitle(CONFIG.APP_NAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Includes an HTML partial in a template.
 * @param {string} filename File path without .html extension.
 * @returns {string}
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Initializes configured Google Sheets tables.
 * @returns {{success:boolean,message:string,data:Object}}
 */
function setupDatabase() {
  try {
    return dbInitialize();
  } catch (error) {
    return createErrorResponse(error, 'Code.setupDatabase');
  }
}
