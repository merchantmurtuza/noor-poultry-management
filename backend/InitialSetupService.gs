/**
 * Saves first-time master data for farm opening balances.
 * @param {Object} payload Setup payload containing total sheds, shed opening birds, and opening feed stock.
 * @returns {{success:boolean,message:string,data:Object}}
 */
function savePrimarySetup(payload) {
  try {
    const validation = validatePrimarySetupPayload(payload);
    if (!validation.valid) {
      return { success: false, message: validation.errors.join(' '), data: { errors: validation.errors } };
    }

    const setup = payload || {};
    const createdOn = new Date();
    const normalizedSheds = setup.sheds.map((shed, index) => ({
      ID: shed.id || 'SHED-' + String(index + 1).padStart(3, '0'),
      Shed: shed.name,
      Breed: shed.breed || '',
      Birds: toNumber(shed.openingBirds),
      PlacementDate: new Date(shed.placementDate),
      Active: true
    }));

    dbReplaceRecords(CONFIG.SHEETS.SHEDS, normalizedSheds);
    upsertSetting('TOTAL_SHEDS', String(toNumber(setup.totalSheds)), 'Total number of sheds configured during first-time setup.');
    upsertSetting('OPENING_BIRDS', String(normalizedSheds.reduce((total, shed) => total + toNumber(shed.Birds), 0)), 'Opening bird stock across all sheds.');
    upsertSetting('PRIMARY_SETUP_COMPLETED', 'true', 'Indicates first-time primary data has been saved.');

    if (toNumber(setup.openingFeedKg) > 0) {
      dbAppendRow(CONFIG.SHEETS.FEED_STOCK, [new Date(setup.feedOpeningDate), 'Opening Feed Stock', toNumber(setup.openingFeedKg), toNumber(setup.feedUnitCost), 'PRIMARY_SETUP', createdOn]);
    }

    return createSuccessResponse({
      totalSheds: toNumber(setup.totalSheds),
      openingBirds: normalizedSheds.reduce((total, shed) => total + toNumber(shed.Birds), 0),
      openingFeedKg: toNumber(setup.openingFeedKg),
      savedOn: formatAppDate(createdOn, CONFIG.DATETIME_FORMAT)
    }, 'Primary setup saved successfully.');
  } catch (error) {
    return createErrorResponse(error, 'InitialSetupService.savePrimarySetup');
  }
}

/**
 * Returns whether primary setup has been completed and the current opening totals.
 * @returns {{success:boolean,message:string,data:Object}}
 */
function getPrimarySetupStatus() {
  try {
    const settings = dbGetRecords(CONFIG.SHEETS.SETTINGS).reduce((map, record) => {
      map[record.Key] = record.Value;
      return map;
    }, {});
    const sheds = dbGetRecords(CONFIG.SHEETS.SHEDS);
    const feedRows = dbGetRecords(CONFIG.SHEETS.FEED_STOCK).filter(row => row.Reference === 'PRIMARY_SETUP');
    return createSuccessResponse({
      completed: settings.PRIMARY_SETUP_COMPLETED === 'true',
      totalSheds: toNumber(settings.TOTAL_SHEDS || sheds.length),
      openingBirds: toNumber(settings.OPENING_BIRDS || sheds.reduce((total, shed) => total + toNumber(shed.Birds), 0)),
      openingFeedKg: feedRows.reduce((total, row) => total + toNumber(row.QuantityKg), 0)
    });
  } catch (error) {
    return createErrorResponse(error, 'InitialSetupService.getPrimarySetupStatus');
  }
}

/**
 * Inserts or updates a setting row by key.
 * @param {string} key Setting key.
 * @param {string} value Setting value.
 * @param {string} description Setting description.
 */
function upsertSetting(key, value, description) {
  const records = dbGetRecords(CONFIG.SHEETS.SETTINGS).filter(record => record.Key !== key);
  records.push({ Key: key, Value: value, Description: description, UpdatedOn: new Date() });
  dbReplaceRecords(CONFIG.SHEETS.SETTINGS, records);
}

/**
 * Smoke test for primary setup validation without writing production data.
 * @returns {{success:boolean,message:string,data:Object}}
 */
function testPrimarySetupStatus() {
  return getPrimarySetupStatus();
}
