const API_BASE_URL = ENV.API_BASE_URL;

// when the unit button is clicked

var sludgeUnit = "mgd";
var priceUnit = "$/gal";
var gwpUnit = "lb CO2/gal";

function changeSettings(unit) {
    if (unit == "imperial") {

        // change the unit values
        sludgeUnit = "mgd"
        priceUnit = "$/gal"
        gwpUnit = "lb CO2/gal"

    }

    else if (unit == "metric") {

        // change the unit values
        sludgeUnit = "m3d"
        priceUnit = "$/kg"
        gwpUnit = "kg CO2/kg"

    }

    updateUnitsEverywhere();
}

// this function is for when a unit is changed in the drop down menus
function updateUnits() {

    // get the unit value from HTML
    sludgeUnit = document.getElementById('sludge-units').value;
    priceUnit = document.getElementById('price-units').value;
    gwpUnit = document.getElementById('gwp-units').value;

    updateUnitsEverywhere();

}

function updateUnitsForManual() {
    
    // get the unit value from HTML
    sludgeUnit = document.getElementById('m-sludge-units').value;
    priceUnit = document.getElementById('m-price-units').value;
    gwpUnit = document.getElementById('m-gwp-units').value;
    
    updateUnitsEverywhere();
        
}

// this function to update the units everywhere
// and also change the tool tips
function updateUnitsEverywhere() {

    // update the drop down menus
    document.getElementById('sludge-units').value = sludgeUnit;
    document.getElementById('price-units').value = priceUnit;
    document.getElementById('gwp-units').value = gwpUnit;

    document.getElementById('m-sludge-units').value = sludgeUnit;
    document.getElementById('m-price-units').value = priceUnit;
    document.getElementById('m-gwp-units').value = gwpUnit;

    /* changes units in two places:
    1. the comparison table headers
    2. the tool tips in the top info div */
    switch (sludgeUnit) {
        case "mgd":
            document.getElementById('r0-sludge').innerHTML = 'Sludge (MGD)';
            document.getElementById('sludge-tool').innerHTML = 'Holding capacity in million gallons a day';

            document.getElementById('manualInput').min = 1;
            document.getElementById('manualInput').max = 2000;
            document.getElementById('manualInput').placeholder = "1-2000";
            break;
        case "m3d":
            document.getElementById('r0-sludge').innerHTML = 'Sludge (m3/d)';
            document.getElementById('sludge-tool').innerHTML = 'Holding capacity in cubic meters a day';

            document.getElementById('manualInput').min = 10000;
            document.getElementById('manualInput').max = 1000000;
            document.getElementById('manualInput').placeholder = "10,000-1,000,000";    
            break;
    }

    switch (priceUnit) {
        case "$/gal":
            document.getElementById('r0-price').innerHTML = 'Price ($/gal):';
            document.getElementById('price-tool').innerHTML = 'Cost of diesel per gallon (Minimum Selling Price)';
            break;
        case "$/kg":
            document.getElementById('r0-price').innerHTML = 'Price ($/kg):';
            document.getElementById('price-tool').innerHTML = 'Cost of diesel per kg (Minimum Selling Price)';
            break;
        case "$/m3":
            document.getElementById('r0-price').innerHTML = 'Price ($/m3):';
            document.getElementById('price-tool').innerHTML = 'Cost of diesel per cubic meter (Minimum Selling Price)';
            break;
        case "$/MMBTU":
            document.getElementById('r0-price').innerHTML = 'Price ($/MMBTU):';
            document.getElementById('price-tool').innerHTML = 'Cost of diesel per million british thermal units (Minimum Selling Price)';
            break;
        case "$/MJ":
            document.getElementById('r0-price').innerHTML = 'Price ($/MJ):';
            document.getElementById('price-tool').innerHTML = 'Cost of diesel per megajoule (Minimum Selling Price)';
            break;
    }

    switch (gwpUnit) {
        case "lb CO2/gal":
            document.getElementById('r0-gwp').innerHTML = 'GWP (lb CO2 eq/gal):';
            document.getElementById('gwp-tool').innerHTML = 'Every gallon of ethanol saves this much CO2 in pounds';
            break;
        case "kg CO2/kg":
            document.getElementById('r0-gwp').innerHTML = 'GWP (kg CO2 eq/kg):';
            document.getElementById('gwp-tool').innerHTML = 'Every kg of ethanol saves this much CO2 in kg';
            break;
        case "kg CO2/m3":
            document.getElementById('r0-gwp').innerHTML = 'GWP (kg CO2 eq/m3):';
            document.getElementById('gwp-tool').innerHTML = 'Every cubic meter of ethanol saves this much CO2 in kg';
            break;
        case "kg CO2/MMBTU":
            document.getElementById('r0-gwp').innerHTML = 'GWP (kg CO2 eq/MMBTU):';
            document.getElementById('gwp-tool').innerHTML = 'Every MMBTU of ethanol saves this much CO2 in kg';
            break;
        case "kg CO2/MJ":
            document.getElementById('r0-gwp').innerHTML = 'GWP (kg CO2 eq/MJ):';
            document.getElementById('gwp-tool').innerHTML = 'Every MJ of ethanol saves this much CO2 in kg';
            break;
    }

    updateValuesEverywhere(); // update the values in the top info div, comparison div and manual div
}

// get info for county
async function getInfo(county) {
    console.log(unit);
    const url = `${API_BASE_URL}/api/v1/htl/county?county_name=${county}`;
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
    county_name - "Morris"
    gwp - 125.3302254919193 (in lb CO2/gal)
    price - 119.3145623249685 (in $/gal)
    sludge - 12257.6 (in kg/hr)
    */

    let countyname = data.county_name;

    document.getElementById('countyName').innerHTML = `${countyname} County`;

    let {sludge, price, gwp} = reformDataPerUnits(data);

    console.log(sludge, price, gwp);

    document.getElementById('sludge').innerHTML = sludge;
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
        document.getElementById('r2-sludge').innerHTML = 0
        document.getElementById('r2-price').innerHTML = 0
        document.getElementById('r2-gwp').innerHTML = 0
    }

    else {
        displayComparisonHelper(data2, 2);
    }
}

// this is a helper function for the comparison
function displayComparisonHelper(data, row){

    /*
    county_name - "Morris"
    gwp - 125.3302254919193 (in lb CO2/gal)
    price - 119.3145623249685 (in $/gal)
    sludge - 12257.6 (in kg/hr)
    */


    let countyname = data.county_name;

    let {sludge, price, gwp} = reformDataPerUnits(data);
    document.getElementById(`r${row}-name`).innerHTML = `${countyname} County`
    document.getElementById(`r${row}-sludge`).innerHTML = sludge
    document.getElementById(`r${row}-price`).innerHTML = price
    document.getElementById(`r${row}-gwp`).innerHTML = gwp

}

// this function is used to get manual sludge data
async function getManualInfo(sludge) {
    const url = `${API_BASE_URL}/api/v1/htl/calc?sludge=${sludge}&unit=${sludgeUnit}`;
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

function displayManualInfo(data) {

    let {sludge, price, gwp} = reformDataPerUnits(data);

    document.getElementById('manualInput').value = sludge;
    document.getElementById('m-price').innerHTML = price;
    document.getElementById('m-gwp').innerHTML = gwp;

}

// Reforming data according to units
function reformDataPerUnits(data) {
    /*
    {
        county_name: 'Sussex', 
        gwp: 1149.285948065567, (in lb CO2/gal)
        price: 1123.5193734237218,  (in $/gal)
        sludge: 1285.9 (in kg/hr)
    }
    */


    let sludge = data.sludge;
    let price = data.price;
    let gwp = data.gwp;

    // conversion factors
    var galToM3 = 0.00378541;
    var kgToLbsConversion = 2.20462;
    var galToMMBTUConversion = 0.12845;
    var galToKg = 0.838*3.78541;
    var BTUToMJ = 0.00105506; // 1 MJ = 0.00105506 BTU    

    // change the units based on the units selected
    switch (sludgeUnit) {
        case "mgd":
            // million gallons per day
            sludge = sludge * 24 / (3.78541 * 1e6); // convert to kg/hr
            sludge = sludge.toFixed(3); // round to 3 decimal places, since it is a smaller number
            break;
        case "m3d":
            sludge = sludge * 24 / 1000; // 1 m³ = 1000 kg, convert hourly to daily
            sludge = sludge.toFixed(0);
            break;
    }

    switch (priceUnit) {
        case "$/gal":
            break;
        case "$/kg":
            price = price / galToKg; 
            break;
        case "$/m3":
            price = price / galToM3; // divide by 0.00378541 to get $/m3
            break;
        case "$/MMBTU":
            price = price / (galToMMBTUConversion * galToKg); // divide by 0.12845 * 0.838 * 3.78541 to get $/MMBTU
            break;
        case "$/MJ":
            price = price / (galToMMBTUConversion * galToKg * BTUToMJ * 1e6); // divide by 0.12845 * 0.838 * 3.78541 * 0.00105506 to get $/MJ
            break;
    }

    switch (gwpUnit) {
        case "lb CO2/gal":
            break;
        case "kg CO2/kg":
            gwp = gwp / (kgToLbsConversion * galToKg); // first change the lb to kg, then remove the gal
            break; 
        case "kg CO2/m3":
            gwp = gwp / (kgToLbsConversion * galToM3); // first change the lb to kg, then remove the gal
            break;
        case "kg CO2/MMBTU":
            gwp = gwp / (kgToLbsConversion * galToMMBTUConversion); // first change the lb to kg, then remove the gal
            break;
        case "kg CO2/MJ":
            gwp = gwp / (kgToLbsConversion * galToMMBTUConversion * BTUToMJ * 1e6); // first change the lb to kg, then remove the gal
            break;
    }

    price = price.toFixed(3); // round to 3 decimal places
    gwp = gwp.toFixed(3); // round to 3 decimal places

    return {sludge, price, gwp}; // return the values in an object
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
            NJ_COUNTIES.map(c => fetchWithRetry(`${API_BASE_URL}/api/v1/htl/county?county_name=${c}`))
        );
        const rows = [['County', 'Sludge (kg/hr)', 'Price ($/gal)', 'GWP (lb CO2e/gal)']];
        results.forEach(d => rows.push([d.county_name, d.sludge, d.price, d.gwp]));
        downloadCsv('nj_htl.csv', rows);
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
        ['County', 'Sludge (kg/hr)', 'Price ($/gal)', 'GWP (lb CO2e/gal)'],
        [d.county_name, d.sludge, d.price, d.gwp]
    ];
    downloadCsv(`${currentCounty.toLowerCase()}_htl.csv`, rows);
    document.getElementById("errorExport").innerHTML = "";
}




