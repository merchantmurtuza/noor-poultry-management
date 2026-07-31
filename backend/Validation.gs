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
