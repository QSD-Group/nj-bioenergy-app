const API_BASE_URL = ENV.API_BASE_URL;

// when the unit buttons
var wasteType = "food"; // changes when the user selects a waste type
var wasteTypeUnit = "tons"; // drop down menu
var electrictyUnit = "mwh";
var emissionsUnit = "tons";

// this is for the imperial and metric button
function changeSettings(unit) {
    if (unit == "imperial") {
        wasteTypeUnit = "tons";
        emissionsUnit = "tons";
    }
    else if (unit == "metric") {
        wasteTypeUnit = "tonnes";
        emissionsUnit = "tonnes"; // TODO : get correct unit
    }

    console.log(wasteTypeUnit, electrictyUnit, emissionsUnit);

    // update drop down menus
    document.getElementById("wastetype-units").value = wasteTypeUnit;
    document.getElementById("electricity-units").value = electrictyUnit;
    document.getElementById("emissions-units").value = emissionsUnit;

    updateUnitsEverywhere();
}

// anytime the user clicks on the drop down menus next to the info top section
function updateUnits() {
    wasteTypeUnit = document.getElementById("wastetype-units").value;
    electrictyUnit = document.getElementById("electricity-units").value;
    emissionsUnit = document.getElementById("emissions-units").value;

    console.log(wasteTypeUnit, electrictyUnit, emissionsUnit);

    updateUnitsEverywhere();

}

//anytime the user clicks on the drop down menus next to the manual input section
function updateUnitsForManual() {
    wasteTypeUnit = document.getElementById("m-wastetype-units").value;
    electrictyUnit = document.getElementById("m-electricity-units").value;
    emissionsUnit = document.getElementById("m-emissions-units").value;

    console.log(wasteTypeUnit, electrictyUnit, emissionsUnit);

    updateUnitsEverywhere();
}

// anytime the user selects a waste type 
function selectWasteType(waste_type) {
    wasteType = waste_type;

    console.log(wasteType);

    updateWasteTypeEverywhere();
}

/*
units can be changes in three ways
1. changing metric or imperial
2. clicking on drop down menus in the info top section
3. clicking on drop down menus in the manual input section
*/
function updateUnitsEverywhere() {
    // update the drop down menus
    document.getElementById("wastetype-units").value = wasteTypeUnit;
    document.getElementById("electricity-units").value = electrictyUnit;
    document.getElementById("emissions-units").value = emissionsUnit;

    document.getElementById("m-wastetype-units").value = wasteTypeUnit;
    document.getElementById("m-electricity-units").value = electrictyUnit;
    document.getElementById("m-emissions-units").value = emissionsUnit;

    /*
    Every unit updates 2 things
    1 - the text in the tool tip
    2 - the header in the comparison section
    3* - the maximum and minimum values in the manual input section
    4* - the placeholder text for the manual input section
    */
    switch (wasteTypeUnit) {
        case "tons":
            document.getElementById("wastetype-tool").innerHTML = "US short tons (2000 lbs) of waste";
            document.getElementById("r0-wasteunit").innerHTML = "(tons)";

            document.getElementById('manualInput').min = 1; // 1 short ton
            document.getElementById('manualInput').max = 1e5; // 100,000 short tons
            document.getElementById('manualInput').placeholder = "1-100,000";    
            break;
        case "tonnes":
            document.getElementById("wastetype-tool").innerHTML = "Metric tonnes (1000 kgs) of waste";
            document.getElementById("r0-wasteunit").innerHTML = "(tonnes)";

            document.getElementById('manualInput').min = 1; // 1 tonne
            document.getElementById('manualInput').max = 1e5; // 100,000 tonnes
            document.getElementById('manualInput').placeholder = "1-100,000";    
            break;
        case "mgd":
            document.getElementById("wastetype-tool").innerHTML = "Million gallons per day of waste";
            document.getElementById("r0-wasteunit").innerHTML = "(MGD)";

            document.getElementById('manualInput').min = 1; // 1 MGD
            document.getElementById('manualInput').max = 2000; // 2000 MGD
            document.getElementById('manualInput').placeholder = "1-2000";

            break;
        case "m3d":
            document.getElementById("wastetype-tool").innerHTML = "Cubic meters per day of waste";
            document.getElementById("r0-wasteunit").innerHTML = "(m3/d)";

            document.getElementById('manualInput').min = 1; // 1 m3/d
            document.getElementById('manualInput').max = 1e6; // 1 million m3/d
            document.getElementById('manualInput').placeholder = "1-1,000,000";    
            break;
    }

    switch (electrictyUnit) {
        case "mwh":
            document.getElementById("electricity-tool").innerHTML = "Megawatt hours of electricity annually generated";
            document.getElementById("r0-electricity").innerHTML = "Annual Electricity (MWh)";
            break;
    }

    switch (emissionsUnit) {
        case "tons":
            document.getElementById("emissions-tool").innerHTML = "Million Short tons (2000 lbs) of CO2 emissions";
            document.getElementById("r0-emissions").innerHTML = "Avoided CO2 Emissions (tons)";
            break;
        case "tonnes":
            document.getElementById("emissions-tool").innerHTML = "Million Metric tonnes (1000 kgs) of CO2 emissions";
            document.getElementById("r0-emissions").innerHTML = "Avoided CO2 Emissions (tonnes)";
            break;
    }

    // update the units
    console.log(wasteTypeUnit, electrictyUnit, emissionsUnit);

    updateValuesEverywhere();
    
}

function updateWasteTypeEverywhere() {

    // update the info top section
    // update the comparison section
    // update the manual input section

    switch (wasteType) {
        case "food":
            document.getElementById("wastetype-name").innerHTML = "Food Waste";
            document.getElementById("wastetype-unit").innerHTML = "Food:";
            document.getElementById("wastetype-units").innerHTML = getDropDownText(1);
            document.getElementById("r0-wastetype").innerHTML = "Food Waste";
            document.getElementById("m-wastetype").innerHTML = "food waste";
            document.getElementById("m-wastetype-units").innerHTML = getDropDownText(1);
            break;
        case "sludge":
            document.getElementById("wastetype-name").innerHTML = "Sludge";
            document.getElementById("wastetype-unit").innerHTML = "Sludge:";
            document.getElementById("wastetype-units").innerHTML = getDropDownText(2);
            document.getElementById("r0-wastetype").innerHTML = "Sludge";
            document.getElementById("m-wastetype").innerHTML = "sludge";
            document.getElementById("m-wastetype-units").innerHTML = getDropDownText(2);
            break;
        case "fog":
            document.getElementById("wastetype-name").innerHTML = "Fats, Oils, and Grease";
            document.getElementById("wastetype-unit").innerHTML = "FOG:";
            document.getElementById("wastetype-units").innerHTML = getDropDownText(1);
            document.getElementById("r0-wastetype").innerHTML = "Fats, Oils, and Grease";
            document.getElementById("m-wastetype").innerHTML = "fats, oils, and grease";
            document.getElementById("m-wastetype-units").innerHTML = getDropDownText(1);
            break;
        case "green":
            document.getElementById("wastetype-name").innerHTML = "Green Waste";
            document.getElementById("wastetype-unit").innerHTML = "Green:";
            document.getElementById("wastetype-units").innerHTML = getDropDownText(1);
            document.getElementById("r0-wastetype").innerHTML = "Green Waste";
            document.getElementById("m-wastetype").innerHTML = "green waste";
            document.getElementById("m-wastetype-units").innerHTML = getDropDownText(1);
            break;
        case "manure":
            document.getElementById("wastetype-name").innerHTML = "Manure";
            document.getElementById("wastetype-unit").innerHTML = "Manure:";
            document.getElementById("wastetype-units").innerHTML = getDropDownText(1);
            document.getElementById("r0-wastetype").innerHTML = "Manure";
            document.getElementById("m-wastetype").innerHTML = "manure";
            document.getElementById("m-wastetype-units").innerHTML = getDropDownText(1);
            break;
    }

    /*
    very interesting part of code
    first we're clearing all the values, so it doesn't automatically update the values when we switch the waste type
    second, we're updating the values so when we go from manure to sludge the units are updated accross
    */
    clearValuesEcerywhere();
    updateUnits();
    /*
    selectWasteType("food");
    updateWassteTypeEverywhere();
    clearValuesEverywhere();
    updateUnits();
    updateValuesEverywhere();
    displayInfoTop(data);
    displayComparison(data);
    displayManualInput(data);
    */
}

function getDropDownText(no){
    // can either get one or two
    switch (no){
        case 1:
            // this is for food, fog, green and manure
            return `
                <option value="tons">short tons</option>
                <option value="tonnes">metric tonnes</option>
            `;
        case 2:
            // this is for sludge
            return `
                <option value="mgd">MGD</option>
                <option value="m3d">m³/d</option>
            `
    }
}

function clearValuesEcerywhere() {
    // set the county datas to null
    previousCountyData = null;
    currentCountyData = null;
    manualData = null;

    // clear the values
    previousCounty = null;
    currentCounty = null;

    // clear the values in the info top section
    document.getElementById("countyName").innerHTML = "";
    document.getElementById("wastetype").innerHTML = "";
    document.getElementById("electricity").innerHTML = "";
    document.getElementById("emissions").innerHTML = "";
    document.getElementById("percent").innerHTML = "";

    // clear the values in the comparison section
    for (let i = 1; i <= 2; i++) {
        document.getElementById(`r${i}-name`).innerHTML = `County ${i}`;
        document.getElementById(`r${i}-waste`).innerHTML = 0;
        document.getElementById(`r${i}-electricity`).innerHTML = 0;
        document.getElementById(`r${i}-emissions`).innerHTML = 0;
        document.getElementById(`r${i}-percent`).innerHTML = '0%';
    }

    // clear the values in the manual input section
    document.getElementById("manualInput").value = null;
    document.getElementById("m-electricity").innerHTML = 0;
    document.getElementById("m-emissions").innerHTML = 0;
    document.getElementById("m-percent").innerHTML = 0;
}


// internal function, used to get info about a county depending on the waste type
// info here will be used on the info top section and comparison section
async function getInfo(county) {
    const url = `${API_BASE_URL}/api/v1/combustion/county?county_name=${county}&waste_type=${wasteType}`;
    console.log(wasteType);
    try {
        const data = await fetchWithRetry(url);
        console.log(data);
        currentCountyData = data;
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// populates the info top section
function displayInfoTop(data){

    /*
    "county_name": "Mercer",
    "electricity": 115576741968.87698, (MWh)
    "emissions": 25511.42472586155, (million metric tonnes)
    "mass": 6891212.724666667, (kg/hr)
    "percent": 261.3875484207126, (percentage)
    "waste_type": "sludge"
    */

    let countyName = data.county_name; // name of the county

    let {mass, electricity, emissions, percent} = reformDataPerUnits(data);

    // fill the info top section
    document.getElementById("countyName").innerHTML = `${countyName} `;
    document.getElementById("wastetype").innerHTML = mass;
    document.getElementById("electricity").innerHTML = electricity;
    document.getElementById("emissions").innerHTML = emissions;
    document.getElementById("percent").innerHTML = percent;

    // highlight the county name
    highlightElement("completeCountySpan");
}


// populates the comparison section
function displayComparison(data1, data2){

    if (data1 === null){
        return; 
    }

    displayComparisonHelper(data1, 1);

    if (data2 === null){
        document.getElementById("r2-name").innerHTML = "County 2";
        document.getElementById("r2-waste").innerHTML = 0;
        document.getElementById("r2-electricity").innerHTML = 0;
        document.getElementById("r2-emissions").innerHTML = 0;
    }

    else {
        displayComparisonHelper(data2, 2);
    }
}

// helper function for displayComparison
function displayComparisonHelper(data, row){
    let countyName = data.county_name; // name of the county

    let {mass, electricity, emissions, percent} = reformDataPerUnits(data);

    // fill the comparison section
    document.getElementById(`r${row}-name`).innerHTML = countyName;
    document.getElementById(`r${row}-waste`).innerHTML = mass;
    document.getElementById(`r${row}-electricity`).innerHTML = electricity;
    document.getElementById(`r${row}-emissions`).innerHTML = emissions;
    document.getElementById(`r${row}-percent`).innerHTML = percent;

}

// function to get the manual info
async function getManualInfo(manualInput){
    const url = `${API_BASE_URL}/api/v1/combustion/calc?mass=${manualInput}&unit=${wasteTypeUnit}&waste_type=${wasteType}`;
    try {
        const data = await fetchWithRetry(url);
        console.log(data);
        manualData = data;
        return data;
    } catch (error) {
        console.log("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// populates the manual input section
function displayManualInfo(data){
    let {mass, electricity, emissions, percent} = reformDataPerUnits(data);

    // fill the manual input section
    document.getElementById("manualInput").innerHTML = mass;
    document.getElementById("m-electricity").innerHTML = electricity;
    document.getElementById("m-emissions").innerHTML = emissions;
    document.getElementById("m-percent").innerHTML = percent;

}

function reformDataPerUnits(data){

    /*
    "county_name": "Mercer",
    "electricity": 115576741968.87698, (MWh)
    "emissions": 25511.42472586155, (million metric tonnes)
    "mass": 6891212.724666667, (kg/hr)
    "percent": 261.3875484207126, (percentage)
    "waste_type": "sludge"
    */


    let mass = data.mass; // mass of waste in kg/hr
    let electricity = data.electricity; // electricity generated in MWh
    let emissions = data.emissions; // emissions in million metric tonnes
    let percent = data.percent; // percentage of emissions avoided out of 1

    // conversion factors
    let shortTonsToKg = 907.185; // 1 short ton = 907.185 kg
    let MGDtokg = 3785411.784; // 1 MGD = 3785411.784 kg
    let galToM3 = 0.00378541 // 1 gallon = 0.00378541 m3

    switch (wasteTypeUnit) {
        case "tons":
            mass = mass * (24*365) / shortTonsToKg; // convert to US short tons
            mass = toSigFigs(mass);
            break;
        case "tonnes":
            mass = mass * (24*365) / 1000; // convert to metric tonnes
            mass = toSigFigs(mass);
            break;
        case "mgd":
            mass = (mass * 24)/(MGDtokg); // convert to MGD
            mass = toSigFigs(mass);
            break;
        case "m3d":
            mass = (mass * 24)/(MGDtokg); // convert to MGD
            mass = mass * galToM3 * 1e6; // convert to m3/d
            mass = toSigFigs(mass);
            break;
    }

    switch (electrictyUnit) {
        case "mwh":
            electricity = electricity;
            break;
    }

    switch (emissionsUnit) {
        case "tons":
            // convert from million metric tonnes to million short tons
            emissions = emissions * 1.10231;
            break;
        case "tonnes":
            emissions = emissions;
            break;
    }

    percent = percent * 100; // convert to percentage
    percent = toSigFigs(percent);
    electricity = toSigFigs(electricity);
    emissions = toSigFigs(emissions);

    return {mass, electricity, emissions, percent}; // return the reformatted data
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
            NJ_COUNTIES.map(c => fetchWithRetry(`${API_BASE_URL}/api/v1/combustion/county?county_name=${c}&waste_type=${wasteType}`))
        );
        const rows = [['County', 'Waste Type', 'Mass (kg/hr)', 'Electricity (MWh/yr)', 'Avoided Emissions (million metric tonnes CO2e)', 'NJ Emissions (%)']];
        results.forEach(d => rows.push([d.county_name, d.waste_type, d.mass, d.electricity, d.emissions, (d.percent * 100).toFixed(2)]));
        downloadCsv(`nj_combustion_${wasteType}.csv`, rows);
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
        ['County', 'Waste Type', 'Mass (kg/hr)', 'Electricity (MWh/yr)', 'Avoided Emissions (million metric tonnes CO2e)', 'NJ Emissions (%)'],
        [d.county_name, d.waste_type, d.mass, d.electricity, d.emissions, (d.percent * 100).toFixed(2)]
    ];
    downloadCsv(`${currentCounty.toLowerCase()}_combustion_${wasteType}.csv`, rows);
    document.getElementById("errorExport").innerHTML = "";
}