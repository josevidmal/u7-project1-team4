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
    });
    return availableTags;
}



searchBtn.addEventListener("click", function(event) {
    event.preventDefault();
    
var country = destinationInputEl.value;
var restCountriesQuery = "https://restcountries.com/v2/name/" + country;

//initMap();
searchLatLongCity(country);

fetch(restCountriesQuery)
    .then(function (response1) {
        return response1.json();
    })
    .then(function(data) {
        console.log(data);
        mapiDiv.style.display = "block";
        getBasicInfo(data);
    })

renderHistoryBtns();
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
    
    // currencyEl is the element containg the code for the currency exchange
    currencyEl.textContent = data[0].currencies[0].code;
    Exchangerate(data);
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





function searchLatLongCity(city){

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
        searchMap(lat,lng);
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
        content: '<h4>Data: </h4>'
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
function searchMap(lat,lng) {
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
        content: '<h4>Data: </h4>'
    });

    marker.addListener('click',function(){
        infoWindow.open(map,marker);
    });

    var options = {
        types: ['(cities)']
    }

    //var autocomplete1 = new  google.maps.places.Autocomplete(destinationInputEl,options);

  }

function renderHistoryBtns () {
    var localStorageContent = localStorage.getItem("countries");

    var countries;
    if (localStorageContent === null) {
        countries = [];
    } else {
        countries = JSON.parse(localStorageContent);
    }

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