var searchBtn = document.querySelector(".button");
var destinationInputEl = document.getElementById("inputDestination");
var basicInfoEl = document.getElementById("basic-info");
var currencyEl = document.getElementById("currency");
var exchangeEl = document.getElementById("exchange");
var covidCasesEl = document.getElementById("covid-cases");
var covidRateEl = document.getElementById("covid-rate");
var covidDeathsEl = document.getElementById("covid-deaths");

searchBtn.addEventListener("click", function(event) {
    event.preventDefault();

var country = destinationInputEl.value;
var restCountriesQuery = "https://restcountries.com/v2/name/" + country;

fetch(restCountriesQuery)
    .then(function (response1) {
        return response1.json();
    })
    .then(function(data) {
        console.log(data);
        getBasicInfo(data);
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
    basicInfoEl.textContent = "Official Name: " + data[0].altSpellings[2] + "\r\n Capital: " + data[0].capital + "\r\n Language: " + data[0].languages[0].name;
    
    //Currency Info
    var currencyElTitle = document.getElementById("currency-title");
    currencyElTitle.textContent = data[0].currencies[0].name;
    
    // currencyEl is the element containg the code for the currency exchange
    currencyEl.textContent = data[0].currencies[0].code;
}

var alphaQuery = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo";