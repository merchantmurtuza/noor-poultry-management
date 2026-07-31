# NOOR Poultry ERP

NOOR Poultry ERP is a production-oriented poultry farm management application built with Google Apps Script, Google Sheets, Bootstrap 5, and vanilla JavaScript.

## Features

- Responsive admin dashboard with dark sidebar and operational header.
- Daily production capture for eggs, broken eggs, feed, water, mortality, and remarks.
- Google Sheets persistence through a dedicated database gateway.
- Clean separation between backend Apps Script code and frontend HTML/CSS/JavaScript partials.
- Standard JSON response contract for all backend APIs.
- JSDoc documentation on public functions.

## Folder Structure

```text
backend/   Apps Script backend services and database gateway
frontend/  HTML templates, Bootstrap UI, styles, and browser JavaScript
assets/    Static project assets for future use
docs/      Project, installation, and database documentation
tests/     Apps Script smoke test functions
```

## Architecture

The application follows clean architecture principles:

- `Code.gs` exposes web app entry points and thin API wrappers.
- `Database.gs` is the only module allowed to open the spreadsheet.
- Service files encapsulate business use cases.
- Frontend templates never define Apps Script backend functions.
- Backend files never contain HTML markup.

## Backend API

- `getDashboard()` returns dashboard KPIs and recent production entries.
- `getSheds()` returns active shed records.
- `saveProduction(payload)` validates and stores a daily production entry.
- `getRecentProduction(limit)` returns recent production rows.
