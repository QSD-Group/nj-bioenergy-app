# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static frontend for the **New Jersey Bioenergy** portal — a tool for exploring bioenergy/biochemical potentials from organic wastes across New Jersey counties. There is no build step; it runs directly in a browser by opening the HTML files or serving them via a local HTTP server.

## Development

**Run locally:**
```bash
# Any static server works, e.g.:
python3 -m http.server 8000
# then open http://localhost:8000
```

There are no package managers, bundlers, linters, or test frameworks. All JS is vanilla and loaded via `<script>` tags.

## Architecture

**Page structure:** Each technology has its own HTML page (`fermentation.html`, `htl.html`, `combustion.html`, `anaerobic.html`) plus a landing page (`index.html`). Each page is self-contained.

**Script loading order matters:** Every technology page loads scripts in this order:
1. `script.js` — shared map logic, sidebar toggle, county click state machine, manual input handler
2. `env.js` — defines `ENV.API_BASE_URL` (currently `https://nj-bioenergy-api.apps.qsdsan.com`)
3. `scripts/<technology>.js` — technology-specific API calls and unit conversions

**Shared assets injected at runtime:** `script.js` fetches and injects HTML fragments on `DOMContentLoaded`:
- `assets/navbar.html` → `#navbar-placeholder`
- `assets/unitbutton.html` → `#unitbutton-placeholder`
- `assets/njname.svg` → `#mapContainer` (the interactive NJ county map)
- `assets/exportcsv.html` → `#export-container`

**County selection state machine (script.js):** Global vars `currentCounty`/`previousCounty` and `currentCountyData`/`previousCountyData` track selections. Clicking a county cycles through three states: first click sets current, second click (different county) shifts current→previous and sets new current (enabling comparison), third click (any county) resets previous and sets new current.

**Unit system:** Each technology script implements `changeSettings(unit)` (called by the imperial/metric toggle) and `updateUnits()`/`updateUnitsForManual()` (called by per-field `<select>` dropdowns). All conversions happen client-side in `reformDataPerUnits()` — the API always returns values in base units (see API section below).

## API

**Base URL:** `https://nj-bioenergy-api.apps.qsdsan.com/api/v1` (set in `env.js`)  
**Interactive docs:** `https://nj-bioenergy-api.apps.qsdsan.com/docs`

### Endpoints

```
GET /api/v1/htl/county?county_name={county}
GET /api/v1/htl/calc?sludge={mass}&unit={unit}

GET /api/v1/fermentation/county?county_name={county}
GET /api/v1/fermentation/calc?mass={mass}&unit={unit}

GET /api/v1/combustion/county?county_name={county}&waste_type={type}
GET /api/v1/combustion/calc?mass={mass}&unit={unit}&waste_type={type}
```

### Valid Values

**County names (21 total):**
Atlantic, Bergen, Burlington, Camden, Cape May, Cumberland, Essex, Gloucester, Hudson, Hunterdon, Mercer, Middlesex, Monmouth, Morris, Ocean, Passaic, Salem, Somerset, Sussex, Union, Warren

**Units:**
- `kghr` — kg/hour (default)
- `tons` — short tons/year
- `tonnes` — metric tonnes/year
- `mgd` — million gallons/day
- `m3d` — cubic meters/day

**Waste types (combustion only):** `sludge`, `food`, `fog`, `green`, `manure`

### Example Response (HTL county)

```json
{
  "county_name": "Atlantic",
  "sludge_dmt_yr": 8991.7,
  "price_per_gallon": 162.63,
  "gwp_lb_co2_per_gallon": 176.07
}
```
