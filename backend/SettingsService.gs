/**
 * Returns application settings as key-value pairs.
 * @returns {{success:boolean,message:string,data:Object}}
 */
function getSettings() {
  try {
    const settings = dbGetRecords(CONFIG.SHEETS.SETTINGS).reduce((map, record) => {
      map[record.Key] = record.Value;
      return map;
    }, {});
    return createSuccessResponse(settings);
  } catch (error) {
    return createErrorResponse(error, 'SettingsService.getSettings');
  }
}

/**
 * Smoke test for settings service.
 * @returns {{success:boolean,message:string,data:Object}}
 */
function testSettings() {
  return getSettings();
}
