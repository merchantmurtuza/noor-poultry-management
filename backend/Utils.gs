/**
 * Creates a standard API success response.
 * @param {*} data Response payload.
 * @param {string=} message Human-readable message.
 * @returns {{success:boolean,message:string,data:*}}
 */
function createSuccessResponse(data, message) {
  return { success: true, message: message || '', data: data === undefined ? {} : data };
}

/**
 * Creates a standard API error response and writes the error to Logs when possible.
 * @param {Error|string} error Error instance or message.
 * @param {string=} source Function or service name.
 * @returns {{success:boolean,message:string,data:Object}}
 */
function createErrorResponse(error, source) {
  const message = error && error.message ? error.message : String(error || 'Unknown error');
  try {
    dbAppendRow(CONFIG.SHEETS.LOGS, [new Date(), 'ERROR', source || 'Application', message, JSON.stringify(error || {})]);
  } catch (logError) {
    console.error('Failed to write application log', logError);
  }
  return { success: false, message: message, data: {} };
}

/**
 * Formats a date value using the application timezone.
 * @param {Date|string|number} value Date-like value.
 * @param {string=} format Apps Script date format.
 * @returns {string}
 */
function formatAppDate(value, format) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  return Utilities.formatDate(date, CONFIG.TIMEZONE, format || CONFIG.DATE_FORMAT);
}

/**
 * Returns the effective user email when available.
 * @returns {string}
 */
function getCurrentUserEmail() {
  return Session.getActiveUser().getEmail() || 'system@noor.local';
}

/**
 * Converts a value to a finite number; empty values become zero.
 * @param {*} value Input value.
 * @returns {number}
 */
function toNumber(value) {
  if (value === '' || value === null || value === undefined) return 0;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : NaN;
}
