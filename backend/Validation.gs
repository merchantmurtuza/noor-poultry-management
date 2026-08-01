/**
 * Validates daily production input.
 * @param {Object} payload Production payload from the UI.
 * @returns {{valid:boolean,errors:string[]}}
 */
function validateProductionPayload(payload) {
  const errors = [];
  const data = payload || {};
  if (!data.date) errors.push('Date is required.');
  if (!data.shedId) errors.push('Shed is required.');
  ['eggs', 'brokenEggs', 'feedKg', 'waterLitres', 'mortality'].forEach(field => {
    if (data[field] === '' || data[field] === null || data[field] === undefined) errors.push(field + ' is required.');
    const value = toNumber(data[field]);
    if (Number.isNaN(value)) errors.push(field + ' must be numeric.');
    if (!Number.isNaN(value) && value < 0) errors.push(field + ' cannot be negative.');
  });
  return { valid: errors.length === 0, errors: errors };
}

/**
 * Validates first-time primary setup data.
 * @param {Object} payload Setup payload.
 * @returns {{valid:boolean,errors:string[]}}
 */
function validatePrimarySetupPayload(payload) {
  const errors = [];
  const data = payload || {};
  const totalSheds = toNumber(data.totalSheds);
  if (!data.totalSheds && data.totalSheds !== 0) errors.push('Total number of sheds is required.');
  if (Number.isNaN(totalSheds) || totalSheds <= 0) errors.push('Total number of sheds must be greater than zero.');
  if (!Array.isArray(data.sheds) || data.sheds.length === 0) errors.push('At least one shed opening stock row is required.');
  if (Array.isArray(data.sheds) && totalSheds > 0 && data.sheds.length !== totalSheds) errors.push('Shed rows must match total number of sheds.');

  (data.sheds || []).forEach((shed, index) => {
    const label = 'Shed row ' + (index + 1) + ': ';
    if (!shed.name) errors.push(label + 'shed name is required.');
    if (!shed.placementDate) errors.push(label + 'placement date is required.');
    const birds = toNumber(shed.openingBirds);
    if (shed.openingBirds === '' || shed.openingBirds === null || shed.openingBirds === undefined) errors.push(label + 'opening birds are required.');
    if (Number.isNaN(birds)) errors.push(label + 'opening birds must be numeric.');
    if (!Number.isNaN(birds) && birds < 0) errors.push(label + 'opening birds cannot be negative.');
  });

  ['openingFeedKg', 'feedUnitCost'].forEach(field => {
    const value = toNumber(data[field]);
    if (Number.isNaN(value)) errors.push(field + ' must be numeric.');
    if (!Number.isNaN(value) && value < 0) errors.push(field + ' cannot be negative.');
  });
  if (toNumber(data.openingFeedKg) > 0 && !data.feedOpeningDate) errors.push('Feed opening date is required when opening feed stock is entered.');
  return { valid: errors.length === 0, errors: errors };
}
