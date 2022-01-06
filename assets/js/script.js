var searchBtn = document.querySelector(".button");
var destinationInputEl = document.getElementById("inputDestination");
var basicInfoEl = document.getElementById("basic-info");
var currencyEl = document.getElementById("currency");
var exchangeEl = document.getElementById("exchange-rate");
var covidCasesEl = document.getElementById("covid-cases");
var covidRateEl = document.getElementById("covid-rate");
var covidDeathsEl = document.getElementById("covid-deaths");
var mapiDiv = document.getElementById("mapi");
var buttonsDivEl = document.getElementById("buttons-div");
var asideSectionEl = document.querySelectorAll(".aside-section");
var displayInfoBoxEl = document.querySelector(".display-information-box");
var searchBoxEl = document.querySelector(".form-custom");
var covidDeathsFlag = "";
var populationFlag = "";

init();

//initial values from Mexico
var lat = 23;
var lng = -102;


// jquery function--> Search Countries for autocomplete
$( function() {
    var availableCities = searchCitiesAuto();    
    $( "#inputDestination" ).autocomplete({
      source: availableCities
    });
  } );

//searching function use for autcomplete
function searchCitiesAuto(){

    var queryCountries = "https://restcountries.com/v3.1/all";
    var availableTags = [];

    fetch(queryCountries)
    .then(function (responseC) {
        return responseC.json();
    })
    .then(function(dataC) {
        //console.log(dataC); 
        //console.log('Length dataC ',dataC.length);  
        for (let i = 0; i < dataC.length; i++) {
            //console.log('Country ',i,' ',dataC[i].name.common);
            availableTags.push(dataC[i].name.common);
        } 
        availableTags.push('United States of America') 
    });
    return availableTags;
}



searchBtn.addEventListener("click", function(event) {
    event.preventDefault();
    
var country = destinationInputEl.value;
var restCountriesQuery = "https://restcountries.com/v2/name/" + country;

//initMap(); call the map
//searchLatLongCity(country);

fetch(restCountriesQuery)
    .then(function (response1) {
        if (response1.ok) {
        renderHistoryBtns();
        return response1.json();
        } else {
        return;
        }
    })
    .then(function(data) {
        console.log(data);
        mapiDiv.style.display = "block";
        getBasicInfo(data);
        for (var i = 0; i < asideSectionEl.length; i++) {
        asideSectionEl[i].setAttribute("style", "visibility: visible");
        }
        displayInfoBoxEl.setAttribute("style", "visibility: visible");
        searchBoxEl.setAttribute("style", "position: static");

        populationFlag = data[0].population;
        console.log('population: ',populationFlag);

        //initMap(); call the map
        searchLatLongCity(country,populationFlag);
    })
})

function getBasicInfo(data) {
    var basicInfoTitle = document.getElementById("basic-info-title");
    basicInfoTitle.textContent = data[0].name + "   ";

    //add flag icon
    var flagIconUrl = data[0].flag;
    var flagIcon = document.createElement("img");
    flagIcon.src = flagIconUrl;
    flagIcon.setAttribute('width', '50px');
    flagIcon.setAttribute('height', '50px');
    basicInfoTitle.appendChild(flagIcon);

    //Basic Info
    basicInfoEl.textContent = "Region: " + data[0].subregion + "\r\n Capital: " + data[0].capital + "\r\n Language: " + data[0].languages[0].name;
    console.log(basicInfoEl);
    //Currency Info
    var currencyElTitle = document.getElementById("currency-title");
    currencyElTitle.textContent = data[0].currencies[0].name;

    //Population variable for Map
    var populationEl = data[0].population;
    console.log("population: " + populationEl);
    
    // currencyEl is the element containg the code for the currency exchange
    currencyEl.textContent = data[0].currencies[0].code;
    Exchangerate(data);
    safetyInfo(data);
    covidInfo();
}

function Exchangerate(data){ 
    var apikey = "60MP74RUOD4MUHKI"
    var currencyrate = data[0].currencies[0].code
    var alphaQuery = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=" + currencyrate + "&apikey=" + apikey;
    fetch(alphaQuery)
    .then(function(responsecurrency) {
        return responsecurrency.json();
    })
    .then(function(datacurrency) {
        console.log(datacurrency);
        var currencyDecimals = datacurrency["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
        var currencyWoDecimals = (Number(currencyDecimals).toFixed(3));
        exchangeEl.textContent = "1 USD = " + currencyWoDecimals + " " + currencyrate;

        var exchangeTitle = document.getElementById("exchange-title");
        exchangeTitle.textContent = " Exchange Rate";
    })   
}

//Function to get covid situation summary, covid policy and covid hotspots
function safetyInfo(data) {

    //Fectch to obtain the token and access token
    var countryCode = data[0].alpha2Code;
    var covidSafetyQuery = "https://test.api.amadeus.com/v1/duty-of-care/diseases/covid19-area-report?countryCode=" + countryCode;

    var summaryTitle = document.getElementById("summary-title");
    summaryTitle.textContent = "COVID-19 Situation Summary";
    var policyTitle = document.getElementById("policy-title");
    policyTitle.textContent = "COVID-19 Policy";
    var hotspotsTitle = document.getElementById("hotspots-title");
    hotspotsTitle.textContent = "COVID-19 Hotspots";

    fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
        body: "grant_type=client_credentials&client_id=okk9rLWaV8mPJQTKZDh6HyQQIx3UkOzY&client_secret=UlH7ebo3nVVBsSZ9",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    }).then(function(responseToken) {
        return responseToken.json();
    }).then(function(dataToken) {
        console.log(dataToken);

        var amadeusToken = "Bearer " + dataToken.access_token;
        console.log(amadeusToken);

        fetch(covidSafetyQuery, {
            method: "GET",
            headers:{
                "Authorization": amadeusToken
            },
            mode:"cors",
            catch:"default"
        }).then(function(responseSafety) {
            return responseSafety.json();
        }).then(function(dataSafety) {
            console.log(dataSafety);

            var covidSummary = dataSafety.data.summary;
            var covidPolicy = dataSafety.data.areaPolicy.text;
            var covidHotspots = dataSafety.data.hotspots;
            console.log(covidSummary, covidPolicy, covidHotspots);
        
            var summaryEl = document.getElementById("covid-summary");
            summaryEl.innerHTML = covidSummary;
            var policyEl = document.getElementById("covid-policy");
            policyEl.innerHTML = covidPolicy;
            var hotspotsEl = document.getElementById("covid-hotspots");
            if (covidHotspots === undefined) {
                hotspotsEl.textContent = "There are no hotspots reported at this moment"
            } else {
            hotspotsEl.innerHTML = covidHotspots;
            }
        })
    })
}

function covidCasesEl(data){
    var covidData = "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases2_v1/FeatureServer/2/query?where=1%3D1&outFields=Country_Region,Last_Update,UID,ISO3,Confirmed&outSR=4326&f=json"
    fetch(covidData)
    .then(function(responsecovidcases) {
        return covidCasesEl.json();
    })
}


function searchLatLongCity(city,population){

    var resGeocodingMaps = "https://maps.googleapis.com/maps/api/geocode/json?address="+city+"&key=AIzaSyD6O2RWQkdjXJXTCNIsjBwXUzxeQDCF0Lc";

    fetch(resGeocodingMaps)
    .then(function (responseMap) {
        return responseMap.json();
    })
    .then(function(dataMaps) {
        console.log(dataMaps);
        lat = dataMaps.results[0].geometry.location.lat;
        lng = dataMaps.results[0].geometry.location.lng;
        console.log('Latitud: ',lat);
        console.log('Longitud: ',lng);
        searchMap(lat,lng,population);
        //getBasicInfo(data);
    })

}

// Initialize and add the map
function initMap() {
    // The location of Uluru
    const citySearch = { lat: 23, lng: -102 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("mapi"), {
      zoom: 4,
      center: citySearch,
    });
    const image =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: citySearch,
      map: map,
      icon: image
    });

    var infoWindow = new google.maps.InfoWindow({
        content: '<h4>Population: '+ populationFlag.toLocaleString() + '</h4>'
    });

    marker.addListener('click',function(){
        infoWindow.open(map,marker);
    });

    var options = {
        types: ['(cities)']
    }

    //var autocomplete1 = new  google.maps.places.Autocomplete(destinationInputEl,options);

  }


// Initialize and add the map
function searchMap(lat,lng,population) {
    // The location of Uluru
    const citySearch = { lat: lat, lng: lng };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("mapi"), {
      zoom: 4,
      center: citySearch,
    });
    const image =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: citySearch,
      map: map,
      icon: image
    });

    var infoWindow = new google.maps.InfoWindow({
        content: '<h4>Population: ' + population.toLocaleString() + '</h4>'
    });

    marker.addListener('click',function(){
        infoWindow.open(map,marker);
    });

    var options = {
        types: ['(cities)']
    }

    //var autocomplete1 = new  google.maps.places.Autocomplete(destinationInputEl,options);

  }

//test function to get COVID-19 data
function covidInfo() {
    
    var covidCasesTitle = document.getElementById("covid-cases-title");
    covidCasesTitle.textContent = "COVID-19 Cases";
    var covidRateTitle = document.getElementById("covid-rate-title");
    covidRateTitle.textContent = "COVID-19 Rates";
    var covidDeathsTitle = document.getElementById("covid-deaths-title");
    covidDeathsTitle.textContent = "COVID-19 Deaths"

    var country = destinationInputEl.value;
    var covidQuery = "https://disease.sh/v3/covid-19/countries/" + country + "?yesterday=yesterday";

    fetch(covidQuery)
        .then(function(covidResponse) {
            return covidResponse.json();
        })
        .then(function(covidData) {
            console.log(covidData);

            var covidCases = covidData.cases;
            var covidActive = covidData.active;
            var covidCasesRate = covidData.casesPerOneMillion;
            var covidActiveRate = covidData.activePerOneMillion;
            var covidDeathsRate = covidData.deathsPerOneMillion;
            var covidDeaths = covidData.deaths;
            console.log(covidCases, covidCasesRate, covidDeaths);

            covidCasesEl.innerHTML = "Total Cases: " + covidCases.toLocaleString("en-US") + "<br>" + "Active Cases: " + covidActive.toLocaleString("en-US");
            covidRateEl.innerHTML = "Cases Per Million: " + covidCasesRate.toLocaleString("en-US") + "<br>" + "Active Per Million: " + covidActiveRate.toLocaleString("en-US") + "<br>" + "Deaths Per Million: " + covidDeathsRate.toLocaleString("en-US");
            covidDeathsEl.innerHTML = "Total Deaths: " + covidDeaths.toLocaleString("en-US");
        })

}

//funtion to render a history button per country search (up to 6 buttons)
function renderHistoryBtns () {
    var localStorageContent = localStorage.getItem("countries");

    var countries;
    if (localStorageContent === null) {
        countries = [];
    } else {

        countries = JSON.parse(localStorageContent);
    }

    //if the value exist into the array dont save
    var positionCountrieArray = jQuery.inArray(destinationInputEl.value,countries);
    //console.log('City array position: ',positionCityArray);
    if  (positionCountrieArray !== -1){
        //dont do anything
        console.log('The countrie exist on the localstorage');
    }

    else {
        countries.unshift(destinationInputEl.value);
        var countriesSliced = countries.slice(0, 7);

        localStorage.setItem("countries", JSON.stringify(countriesSliced));

        var lastSearch = JSON.parse(localStorage.getItem("countries"));

        if (lastSearch !== null) {
            var newBtn = document.createElement("button");
            newBtn.setAttribute("class", "history-btns");
            newBtn.setAttribute("value", lastSearch[0]);
            newBtn.textContent = lastSearch[0];
        } else {
            return;
        }

        if (buttonsDivEl.hasChildNodes()) {
            buttonsDivEl.insertBefore(newBtn, buttonsDivEl.children[0]);
        } else {
            buttonsDivEl.appendChild(newBtn);
        }

        if (lastSearch.length > 6) {
            buttonsDivEl.removeChild(buttonsDivEl.children[6]);
        }
    }
}

//init() function to keep history buttons when app is reloaded
function init() {
    loadHistoryBtns();
}

function loadHistoryBtns() {

    var lastSearch = JSON.parse(localStorage.getItem("countries"));

    if (lastSearch !== null) {
        for (var i = 0; i < 6; i++) {
            var newBtn = document.createElement("button");
            newBtn.setAttribute("class", "history-btns");
            newBtn.setAttribute("value", lastSearch[i]);
            newBtn.textContent = lastSearch[i];
            buttonsDivEl.appendChild(newBtn);
            var btnValue = newBtn.getAttribute("value");
            if (btnValue === "undefined") {
                newBtn.setAttribute("style", "display: none");
            }
        }
    } else {
        return;
    } 
}

//click event function to call data for history buttons
buttonsDivEl.addEventListener("click", function(event) {
    event.preventDefault();
    var country = event.target.value;
    var restCountriesQuery = "https://restcountries.com/v2/name/" + country;

    //initMap();
    //searchLatLongCity(country);

    fetch(restCountriesQuery)
        .then(function (response1) {
            return response1.json();
        })
        .then(function(data) {
            console.log(data);
            mapiDiv.style.display = "block";

            var basicInfoTitle = document.getElementById("basic-info-title");
            basicInfoTitle.textContent = data[0].name + "   ";

            //add flag icon
            var flagIconUrl = data[0].flag;
            var flagIcon = document.createElement("img");
            flagIcon.src = flagIconUrl;
            flagIcon.setAttribute('width', '50px');
            flagIcon.setAttribute('height', '50px');
            basicInfoTitle.appendChild(flagIcon);

            //Basic Info
            basicInfoEl.textContent = "Region: " + data[0].subregion + "\r\n Capital: " + data[0].capital + "\r\n Language: " + data[0].languages[0].name;
            console.log(basicInfoEl);
            //Currency Info
            var currencyElTitle = document.getElementById("currency-title");
            currencyElTitle.textContent = data[0].currencies[0].name;
            
            populationFlag = data[0].population;
            console.log('population: ',populationFlag);
            
            //call the map
            searchLatLongCity(country,populationFlag);


            // currencyEl is the element containg the code for the currency exchange
            currencyEl.textContent = data[0].currencies[0].code;
            Exchangerate(data);
            safetyInfo(data);

            //test function to get COVID-19 data with history buttons
            var covidCasesTitle = document.getElementById("covid-cases-title");
            covidCasesTitle.textContent = "COVID-19 Cases";
            var covidRateTitle = document.getElementById("covid-rate-title");
            covidRateTitle.textContent = "COVID-19 Rates";
            var covidDeathsTitle = document.getElementById("covid-deaths-title");
            covidDeathsTitle.textContent = "COVID-19 Deaths"

            var covidQuery = "https://disease.sh/v3/covid-19/countries/" + country + "?yesterday=yesterday";

            fetch(covidQuery)
                .then(function(covidResponse) {
                    return covidResponse.json();
                })
                .then(function(covidData) {
                    console.log(covidData);

                    var covidCases = covidData.cases;
                    var covidActive = covidData.active;
                    var covidCasesRate = covidData.casesPerOneMillion;
                    var covidActiveRate = covidData.activePerOneMillion;
                    var covidDeathsRate = covidData.deathsPerOneMillion;
                    var covidDeaths = covidData.deaths;
                    var covidPopulation = covidData.population;                    
                    console.log(covidCases, covidCasesRate, covidDeaths);

                    covidCasesEl.innerHTML = "Total Cases: " + covidCases.toLocaleString("en-US") + "<br>" + "Active Cases: " + covidActive.toLocaleString("en-US");
                    covidRateEl.innerHTML = "Cases Per Million: " + covidCasesRate.toLocaleString("en-US") + "<br>" + "Active Per Million: " + covidActiveRate.toLocaleString("en-US") + "<br>" + "Deaths Per Million: " + covidDeathsRate.toLocaleString("en-US");
                    covidDeathsEl.innerHTML = "Total Deaths: " + covidDeaths.toLocaleString("en-US");
                })
        })
    
    for (var i = 0; i < asideSectionEl.length; i++) {
        asideSectionEl[i].setAttribute("style", "visibility: visible");
    }
    displayInfoBoxEl.setAttribute("style", "visibility: visible");
    searchBoxEl.setAttribute("style", "position: static");
    

});