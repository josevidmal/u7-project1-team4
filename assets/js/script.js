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
var restCountriesQuery = "https://restcountries.com/v3.1/name/" + country;

fetch(restCountriesQuery)
    .then(function (response1) {
        return response1.json();
    })
    .then(function(data1) {
        console.log(data1);
    })
})

var alphaQuery = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo";