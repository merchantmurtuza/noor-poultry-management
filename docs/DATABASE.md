# Database Schema

NOOR Poultry ERP uses Google Sheets as its operational database. All sheet access must go through `backend/Database.gs`.

## Sheets

- `Settings`
- `Sheds`
- `DailyProduction`
- `FeedStock`
- `EggSales`
- `Expenses`
- `Users`
- `DashboardCache`
- `Logs`

## Sheds

| Column | Description |
| --- | --- |
| ID | Unique shed identifier. |
| Shed | Human-readable shed name. |
| Breed | Bird breed in the shed. |
| Birds | Current placed bird count. |
| PlacementDate | Date birds were placed. |
| Active | Active flag; values other than `false` are treated as active. |

## DailyProduction

| Column | Description |
| --- | --- |
| Date | Production date. |
| ShedID | Related shed ID. |
| Eggs | Total eggs collected. |
| BrokenEggs | Broken eggs collected. |
| FeedKg | Feed consumed in kilograms. |
| WaterLitres | Water consumed in litres. |
| Mortality | Bird mortality count. |
| Remarks | Operational remarks. |
| CreatedBy | User email captured by Apps Script. |
| CreatedOn | Timestamp for auditability. |
