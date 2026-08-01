/**
 * Smoke test for shed loading.
 * @returns {{success:boolean,message:string,data:Object[]}}
 */
function runGetShedsTest() {
  return testGetSheds();
}

/**
 * Smoke test for saving production.
 * @returns {{success:boolean,message:string,data:Object}}
 */
function runSaveProductionTest() {
  return testSaveProduction();
}

/**
 * Smoke test for primary setup status.
 * @returns {{success:boolean,message:string,data:Object}}
 */
function runPrimarySetupStatusTest() {
  return testPrimarySetupStatus();
}
