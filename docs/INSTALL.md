# Installation and Deployment

## Prerequisites

- Google account with access to Apps Script and Google Sheets.
- Node.js and npm installed locally.
- `clasp` installed globally with `npm install -g @google/clasp`.
- VS Code with Git support.

## Setup

1. Create a Google Sheet for NOOR Poultry ERP.
2. Create an Apps Script project bound to the sheet or create a standalone Apps Script project.
3. Set the script property `SPREADSHEET_ID` to the target Google Sheet ID when using a standalone script.
4. Run `setupDatabase()` once from the Apps Script editor to create configured sheets and headers.

## clasp Deployment

```bash
clasp login
clasp create --type webapp --title "NOOR Poultry ERP"
clasp push
clasp deploy --description "Initial NOOR Poultry ERP deployment"
```

If you use an existing Apps Script project, add its script ID to `.clasp.json` before running `clasp push`.

## Web App Deployment

1. Open the Apps Script project.
2. Click **Deploy > New deployment**.
3. Select **Web app**.
4. Execute as the appropriate account for your farm operations.
5. Choose the access policy required by your organization.
6. Deploy and open the generated web app URL.
