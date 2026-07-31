/**
 * Global application configuration for NOOR Poultry ERP.
 * This is the only permitted global variable in the codebase.
 */
const CONFIG = Object.freeze({
  APP_NAME: 'NOOR Poultry ERP',
  VERSION: '1.0.0',
  TIMEZONE: Session.getScriptTimeZone(),
  SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || SpreadsheetApp.getActiveSpreadsheet().getId(),
  DATE_FORMAT: 'yyyy-MM-dd',
  DATETIME_FORMAT: 'yyyy-MM-dd HH:mm:ss',
  DEFAULT_RECENT_LIMIT: 10,
  SHEETS: Object.freeze({
    SETTINGS: 'Settings',
    SHEDS: 'Sheds',
    DAILY_PRODUCTION: 'DailyProduction',
    FEED_STOCK: 'FeedStock',
    EGG_SALES: 'EggSales',
    EXPENSES: 'Expenses',
    USERS: 'Users',
    DASHBOARD_CACHE: 'DashboardCache',
    LOGS: 'Logs'
  }),
  HEADERS: Object.freeze({
    Settings: ['Key', 'Value', 'Description', 'UpdatedOn'],
    Sheds: ['ID', 'Shed', 'Breed', 'Birds', 'PlacementDate', 'Active'],
    DailyProduction: ['Date', 'ShedID', 'Eggs', 'BrokenEggs', 'FeedKg', 'WaterLitres', 'Mortality', 'Remarks', 'CreatedBy', 'CreatedOn'],
    FeedStock: ['Date', 'Item', 'QuantityKg', 'UnitCost', 'Reference', 'CreatedOn'],
    EggSales: ['Date', 'Customer', 'Eggs', 'UnitPrice', 'Total', 'CreatedOn'],
    Expenses: ['Date', 'Category', 'Amount', 'Notes', 'CreatedOn'],
    Users: ['Email', 'Name', 'Role', 'Active', 'CreatedOn'],
    DashboardCache: ['Key', 'Value', 'UpdatedOn'],
    Logs: ['Timestamp', 'Level', 'Source', 'Message', 'Details']
  })
});
