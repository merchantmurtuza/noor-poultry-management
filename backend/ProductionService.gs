/**
 * Returns active sheds for dropdowns and operational screens.
 * @returns {{success:boolean,message:string,data:Object[]}}
 */
function getSheds() {
  try {
    const sheds = dbGetRecords(CONFIG.SHEETS.SHEDS)
      .filter(shed => String(shed.Active).toLowerCase() !== 'false')
      .map(shed => ({
        id: shed.ID,
        name: shed.Shed,
        breed: shed.Breed,
        birds: toNumber(shed.Birds),
        placementDate: formatAppDate(shed.PlacementDate)
      }));
    return createSuccessResponse(sheds);
  } catch (error) {
    return createErrorResponse(error, 'ProductionService.getSheds');
  }
}

/**
 * Saves a daily production entry after validation.
 * @param {Object} payload Production data from frontend.
 * @returns {{success:boolean,message:string,data:Object}}
 */
function saveProduction(payload) {
  try {
    const validation = validateProductionPayload(payload);
    if (!validation.valid) {
      return { success: false, message: validation.errors.join(' '), data: { errors: validation.errors } };
    }
    const createdOn = new Date();
    const row = [
      new Date(payload.date),
      payload.shedId,
      toNumber(payload.eggs),
      toNumber(payload.brokenEggs),
      toNumber(payload.feedKg),
      toNumber(payload.waterLitres),
      toNumber(payload.mortality),
      payload.remarks || '',
      getCurrentUserEmail(),
      createdOn
    ];
    const rowNumber = dbAppendRow(CONFIG.SHEETS.DAILY_PRODUCTION, row);
    return createSuccessResponse({ rowNumber: rowNumber, createdOn: formatAppDate(createdOn, CONFIG.DATETIME_FORMAT) }, 'Production saved successfully.');
  } catch (error) {
    return createErrorResponse(error, 'ProductionService.saveProduction');
  }
}

/**
 * Returns recent production entries ordered by creation date descending.
 * @param {number=} limit Maximum number of rows.
 * @returns {{success:boolean,message:string,data:Object[]}}
 */
function getRecentProduction(limit) {
  try {
    const maxRows = limit || CONFIG.DEFAULT_RECENT_LIMIT;
    const shedMap = dbGetRecords(CONFIG.SHEETS.SHEDS).reduce((map, shed) => {
      map[shed.ID] = shed.Shed;
      return map;
    }, {});
    const records = dbGetRecords(CONFIG.SHEETS.DAILY_PRODUCTION)
      .sort((a, b) => new Date(b.CreatedOn).getTime() - new Date(a.CreatedOn).getTime())
      .slice(0, maxRows)
      .map(record => ({
        date: formatAppDate(record.Date),
        shedId: record.ShedID,
        shed: shedMap[record.ShedID] || record.ShedID,
        eggs: toNumber(record.Eggs),
        brokenEggs: toNumber(record.BrokenEggs),
        feedKg: toNumber(record.FeedKg),
        waterLitres: toNumber(record.WaterLitres),
        mortality: toNumber(record.Mortality),
        remarks: record.Remarks || '',
        createdBy: record.CreatedBy || '',
        createdOn: formatAppDate(record.CreatedOn, CONFIG.DATETIME_FORMAT)
      }));
    return createSuccessResponse(records);
  } catch (error) {
    return createErrorResponse(error, 'ProductionService.getRecentProduction');
  }
}

/** @returns {{success:boolean,message:string,data:Object[]}} */
function testGetSheds() {
  return getSheds();
}

/** @returns {{success:boolean,message:string,data:Object}} */
function testSaveProduction() {
  const shedsResponse = getSheds();
  const shed = shedsResponse.data && shedsResponse.data[0];
  return saveProduction({ date: formatAppDate(new Date()), shedId: shed ? shed.id : 'TEST-SHED', eggs: 1, brokenEggs: 0, feedKg: 1, waterLitres: 1, mortality: 0, remarks: 'Automated test entry' });
}
