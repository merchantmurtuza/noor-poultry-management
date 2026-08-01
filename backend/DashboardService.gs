/**
 * Builds dashboard metrics for the current date.
 * @returns {{success:boolean,message:string,data:Object}}
 */
function getDashboard() {
  try {
    const today = formatAppDate(new Date());
    const sheds = dbGetRecords(CONFIG.SHEETS.SHEDS).filter(shed => String(shed.Active).toLowerCase() !== 'false');
    const production = dbGetRecords(CONFIG.SHEETS.DAILY_PRODUCTION);
    const todayRows = production.filter(row => formatAppDate(row.Date) === today);
    const totals = todayRows.reduce((sum, row) => {
      sum.eggs += toNumber(row.Eggs);
      sum.brokenEggs += toNumber(row.BrokenEggs);
      sum.feedKg += toNumber(row.FeedKg);
      sum.waterLitres += toNumber(row.WaterLitres);
      sum.mortality += toNumber(row.Mortality);
      return sum;
    }, { eggs: 0, brokenEggs: 0, feedKg: 0, waterLitres: 0, mortality: 0 });
    const liveBirds = sheds.reduce((total, shed) => total + toNumber(shed.Birds), 0) - production.reduce((total, row) => total + toNumber(row.Mortality), 0);
    const productionPercent = liveBirds > 0 ? Math.round((totals.eggs / liveBirds) * 10000) / 100 : 0;
    const recent = getRecentProduction(CONFIG.DEFAULT_RECENT_LIMIT);
    return createSuccessResponse({
      date: today,
      todaysEggs: totals.eggs,
      productionPercent: productionPercent,
      feedToday: totals.feedKg,
      waterToday: totals.waterLitres,
      mortality: totals.mortality,
      liveBirds: Math.max(liveBirds, 0),
      recentEntries: recent.success ? recent.data : []
    });
  } catch (error) {
    return createErrorResponse(error, 'DashboardService.getDashboard');
  }
}

/** @returns {{success:boolean,message:string,data:Object}} */
function testDashboard() {
  return getDashboard();
}
