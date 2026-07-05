const API_BASE_URL = ENV.API_BASE_URL;


// this function is called when the page is loaded, and used to change the settings once the unit is clicked

var biomassUnit = "tons"; // default unit for biomass
var ethanolUnit = "MM gal/year"; // default unit for ethanol
var priceUnit = "$/gal"; // default unit for price
var gwpUnit = "lb CO2/gal"; // default unit for gwp

var tonToTonne = 0.907185;
var galToKgforEthanol = 2.98668849;
var kgToLbsConversion = 2.20462;
var galToMMBTUConversion = 0.07633; 
var BTUtoMJ = 0.00105506; // 1 MJ = 0.00105506 BTU
// source for MM gal to MMBTU 
// https://h2tools.org/hyarc/calculator-tools/lower-and-higher-heating-values-fuels

function changeSettings(unit) {
    if (unit == "imperial") {

        // change the unit values
        biomassUnit = "tons";
        ethanolUnit = "MM gal/year";
        priceUnit = "$/gal";
        gwpUnit = "lb CO2/gal"; 

    }
    else if (unit == "metric") {

        // change the unit values
        biomassUnit = "tonnes";
        ethanolUnit = "kilotonnes/year";
        priceUnit = "$/kg";
        gwpUnit = "kg CO2/kg";

    }

    updateUnitsEverywhere(); // this changes the tool tips and the unit values
}

// this function is for when a unit is changed in the drop down menus
function updateUnits() {

    // get the units from the html
    biomassUnit = document.getElementById('biomass-units').value;
    ethanolUnit = document.getElementById('ethanol-units').value;
    priceUnit = document.getElementById('price-units').value;
    gwpUnit = document.getElementById('gwp-units').value;

    updateUnitsEverywhere();
} 

// this function is for when a unit is changed in the manual input drop down menus
function updateUnitsForManual() {

    // get the units from the html
    biomassUnit = document.getElementById('m-biomass-units').value;
    ethanolUnit = document.getElementById('m-ethanol-units').value;
    priceUnit = document.getElementById('m-price-units').value;
    gwpUnit = document.getElementById('m-gwp-units').value;

    updateUnitsEverywhere();
}

// this function is used to update the units in all of the HTML
// we also change the tool tips over here
function updateUnitsEverywhere() {

    // update the drop down menus
    document.getElementById('biomass-units').value = biomassUnit;
    document.getElementById('ethanol-units').value = ethanolUnit;
    document.getElementById('price-units').value = priceUnit;
    document.getElementById('gwp-units').value = gwpUnit;

    document.getElementById('m-biomass-units').value = biomassUnit;
    document.getElementById('m-ethanol-units').value = ethanolUnit;
    document.getElementById('m-price-units').value = priceUnit;
    document.getElementById('m-gwp-units').value = gwpUnit;

    switch (biomassUnit) {
        case "tons":
            document.getElementById('biomass-tool').innerHTML = 'US Short Tons (2000 lbs) are used for measuring the annual lignocellulose'
            document.getElementById('r0-biomass').innerHTML = 'Annual Biomass (tons):';
            break;
        case "tonnes":
            document.getElementById('biomass-tool').innerHTML = 'Metric tonnes (1000 kgs) are used for measuring the annual lignocellulose'
            document.getElementById('r0-biomass').innerHTML = 'Annual Biomass (tonnes):';
            break;
    }

    switch (ethanolUnit) {
        case "MM gal/year":
            document.getElementById('ethanol-tool').innerHTML = 'Annual production in million gallons'
            document.getElementById('r0-ethanol').innerHTML = 'Annual Ethanol (MM gal/year):';
            break;
        case "tonnes/year":
            document.getElementById('ethanol-tool').innerHTML = 'Annual production in metric tonnes (1000 kgs)'
            document.getElementById('r0-ethanol').innerHTML = 'Annual Ethanol (tonnes/year):';
            break;
        case "kilotonnes/year":
            document.getElementById('ethanol-tool').innerHTML = 'Annual production in kilotonnes (1M kgs)'
            document.getElementById('r0-ethanol').innerHTML = 'Annual Ethanol (kilotonnes/year):';
            break;
        case "MMBTU/year":
            document.getElementById('ethanol-tool').innerHTML = 'Annual production in million MMBTU (million british thermal units)'
            document.getElementById('r0-ethanol').innerHTML = 'Annual Ethanol (MMBTU/year):';
            break;
        case "MJ/year":
            document.getElementById('ethanol-tool').innerHTML = 'Annual production in mega joules'
            document.getElementById('r0-ethanol').innerHTML = 'Annual Ethanol (MJ/year):';
            break;
    }

    switch (priceUnit) {
        case "$/gal":
            document.getElementById('price-tool').innerHTML = 'Cost of ethanol per gallon (Minimum Selling Price)'
            document.getElementById('r0-price').innerHTML = 'Price ($/gal):';
            break;
        case "$/kg":
            document.getElementById('price-tool').innerHTML = 'Cost of ethanol per kg (Minimum Selling Price)'
            document.getElementById('r0-price').innerHTML = 'Price ($/kg):';
            break;
        case "$/MMBTU":
            document.getElementById('price-tool').innerHTML = 'Cost of ethanol per MMBTU (Minimum Selling Price)'
            document.getElementById('r0-price').innerHTML = 'Price ($/MMBTU):';
            break;
        case "$/MJ":
            document.getElementById('price-tool').innerHTML = 'Cost of ethanol per MJ (Minimum Selling Price)'
            document.getElementById('r0-price').innerHTML = 'Price ($/MJ):';
            break;
    }

    switch (gwpUnit) {
        case "lb CO2/gal":
            document.getElementById('gwp-tool').innerHTML = 'Every gallon of ethanol saves this much CO2 in pounds'
            document.getElementById('r0-gwp').innerHTML = 'GWP (lb CO2/gal):';
            break;
        case "kg CO2/kg":
            document.getElementById('gwp-tool').innerHTML = 'Every kg of ethanol saves this much CO2 in kg'
            document.getElementById('r0-gwp').innerHTML = 'GWP (kg CO2/kg):';
            break;
        case "kg CO2/MMBTU":
            document.getElementById('gwp-tool').innerHTML = 'Every MMBTU of ethanol saves this much CO2 in kg'
            document.getElementById('r0-gwp').innerHTML = 'GWP (kg CO2/MMBTU):';
            break;
        case "kg CO2/MJ":
            document.getElementById('gwp-tool').innerHTML = 'Every MJ of ethanol saves this much CO2 in kg'
            document.getElementById('r0-gwp').innerHTML = 'GWP (kg CO2/MJ):';
            break;
    }

    updateValuesEverywhere(); // this updates the values in the HTML

}

// internal function, used to get info about a county
// this info will be set to current county data, and then used to update info and comparison
async function getInfo(county) {
    console.log(unit);
    const url = `${API_BASE_URL}/api/v1/fermentation/county?county_name=${county}`;
    try {
        const data = await fetchWithRetry(url);
        console.log(data);
        currentCountyData = data;
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

// this displays the current county data on the top
function displayInfoTop(data){
    /*
    county_name - "Sussex"
    ethanol - 86.60816293602124 (in MM gal/yr)
    gwp - 5.039313894974568 (in lbCO2e/gal)
    mass - 151081  (in kg/hr)
    price - 5.4198048787318305 (in $/gal)
    */
    let countyname = data.county_name;

    document.getElementById('countyName').innerHTML = `${countyname} County`;

    let {tons, ethanol, price, gwp} = reformDataPerUnits(data);

    console.log(tons, ethanol, price, gwp);

    document.getElementById('biomass').innerHTML = tons;
    document.getElementById('ethanol').innerHTML = ethanol;
    document.getElementById('price').innerHTML = price;
    document.getElementById('gwp').innerHTML = gwp;

    // highlight the county name
    highlightElement("countyName");
    
}

// this is for the comparison
function displayComparison(data1, data2){

    if (data1 === null){
        return;
    }

    displayComparisonHelper(data1, 1);

    if (data2 === null){
        document.getElementById('r2-name').innerHTML = 'County 2'
        document.getElementById('r2-biomass').innerHTML = 0
        document.getElementById('r2-ethanol').innerHTML = 0
        document.getElementById('r2-price').innerHTML = 0
        document.getElementById('r2-gwp').innerHTML = 0
    }

    else {
        displayComparisonHelper(data2, 2);
    }
}

// this function is used to display the data in the comparison table
function displayComparisonHelper(data, row){
    let countyname = data.county_name;

    let {tons, ethanol, price, gwp} = reformDataPerUnits(data);
    
    document.getElementById(`r${row}-name`).innerHTML = `${countyname} County`
    document.getElementById(`r${row}-biomass`).innerHTML = tons
    document.getElementById(`r${row}-ethanol`).innerHTML = ethanol
    document.getElementById(`r${row}-price`).innerHTML = price
    document.getElementById(`r${row}-gwp`).innerHTML = gwp

}

// this function is used to get the manual input data
async function getManualInfo(mass) {
    const url = `${API_BASE_URL}/api/v1/fermentation/calc?mass=${mass}&unit=${biomassUnit}`;
    try {
        const data = await fetchWithRetry(url);
        console.log(data);
        manualData = data;
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

// this function is used to display the manual input data
function displayManualInfo(data){
    let {tons, ethanol, price, gwp} = reformDataPerUnits(data);

    document.getElementById('manualInput').value = tons;
    document.getElementById('m-ethanol').innerHTML = ethanol;
    document.getElementById('m-price').innerHTML = price;
    document.getElementById('m-gwp').innerHTML = gwp;
}

// Reforming data according to units
function reformDataPerUnits(data) {
    /*
    county_name - "Sussex"
    ethanol - 86.60816293602124 (in MM gal/yr)
    gwp - 5.039313894974568 (in lbCO2e/gal)
    mass - 151081  (in kg/hr)
    price - 5.4198048787318305 (in $/gal)
    */
    let mass = data.mass;
    let ethanol = data.ethanol;
    let price = data.price;
    let gwp = data.gwp;

    // change the units based on the unit selected
    switch (biomassUnit) {
        case "tons":
            tons = mass * (365 * 24) / (907.2); // since we're converting from kg/hr into short tons/yr
            break;
        case "tonnes":
            tons = mass * (365 * 24)/ (1000); // since we're converting from kg into metric tonnes
            // tons = tons * tonToTonne; // since we're converting from short tons into metric tonnes
    }

    switch (ethanolUnit) {
        case "MM gal/year":
            break;
        case "tonnes/year":
            ethanol = ethanol * galToKgforEthanol * 1e3; // since we're converting from million gallons into tonnes
            break;
        case "kilotonnes/year":
            ethanol = ethanol * galToKgforEthanol; 
            break;
        case "MMBTU/year":
            ethanol = ethanol * galToMMBTUConversion;
        case "MJ/year":
            ethanol = ethanol * galToMMBTUConversion * BTUtoMJ * 1e6; // 1 MMBTU = 1055.06 MJ
    }
    
    switch (priceUnit) {
        case "$/gal":
            break;
        case "$/kg":
            price = price / galToKgforEthanol; 
            break;
        case "$/MMBTU":
            price = price / galToMMBTUConversion;
        case "$/MJ":
            price = price / (galToMMBTUConversion * BTUtoMJ * 1e6); // 1 MMBTU = 1055.06 MJ
    }

    switch (gwpUnit) {
        case "lb CO2/gal":
            break;
        case "kg CO2/kg":
            gwp = gwp * kgToLbsConversion / galToKgforEthanol;
            break;
        case "kg CO2/MMBTU":
            gwp = gwp * kgToLbsConversion / galToMMBTUConversion;
        case "kg CO2/MJ":
            gwp = gwp * kgToLbsConversion / (galToMMBTUConversion * BTUtoMJ * 1e6); // 1 MMBTU = 1055.06 MJ
    }

    tons = toSigFigs(tons);
    ethanol = toSigFigs(ethanol);
    price = toSigFigs(price);
    gwp = toSigFigs(gwp);

    // return the values
    return {tons, ethanol, price, gwp}; // return the values in an array
}
          

const NJ_COUNTIES = ['Sussex','Passaic','Bergen','Warren','Morris','Essex','Hunterdon','Somerset','Union','Mercer','Hudson','Middlesex','Camden','Gloucester','Burlington','Salem','Cumberland','Cape+May','Atlantic','Ocean','Monmouth'];

function downloadCsv(filename, rows) {
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function exportToCsvMain() {
    try {
        const results = await Promise.all(
            NJ_COUNTIES.map(c => fetchWithRetry(`${API_BASE_URL}/api/v1/fermentation/county?county_name=${c}`))
        );
        const rows = [['County', 'Mass (kg/hr)', 'Ethanol (MM gal/yr)', 'Price ($/gal)', 'GWP (lb CO2e/gal)']];
        results.forEach(d => rows.push([d.county_name, d.mass, d.ethanol, d.price, d.gwp]));
        downloadCsv('nj_fermentation.csv', rows);
        document.getElementById("errorExport").innerHTML = "";
    } catch (error) {
        document.getElementById("errorExport").innerHTML = `<span class='error'>Error exporting data: ${error}</span>`;
    }
}

async function exportToCsvCounty() {
    if (currentCounty === null) {
        document.getElementById("errorExport").innerHTML = "<span class='error'> Please click on a county first </span>";
        return;
    }
    const d = currentCountyData;
    const rows = [
        ['County', 'Mass (kg/hr)', 'Ethanol (MM gal/yr)', 'Price ($/gal)', 'GWP (lb CO2e/gal)'],
        [d.county_name, d.mass, d.ethanol, d.price, d.gwp]
    ];
    downloadCsv(`${currentCounty.toLowerCase()}_fermentation.csv`, rows);
    document.getElementById("errorExport").innerHTML = "";
}