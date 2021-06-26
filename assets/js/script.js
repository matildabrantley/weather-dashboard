var resultTextEl = $('#result-text');
var resultContentEl = $('#result-content');
var searchFormEl = document.querySelector('#search-form');
const apiKey = 'a641bf9af84171a774e42ab0fb8b528b';

//TODO: change to address
async function getCityCoordinates(city) {
    var geocodeUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;
    //return fetch Promise of coordinates
    return fetch(geocodeUrl)
    .then(function (response) {
        //console.log(response);
        return response.json();
    })
    .then(function (data) {
        //return first city in array matching
        return [data[0].lat, data[0].lon];
    });
};

//get current data by coordinates
async function getCurrentWeather(latitude, longitude) {
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude +'&units=imperial&appid=' + apiKey;
    //returjn fetch Promise of weather data object
    return fetch(weatherUrl)
    .then(function (response) {
        console.log(response);
        return response.json();
    })
    .then(function (weatherData) {
        return weatherData;
    });
};

//get 5-day forecast data by coordinates
async function getForecastWeather(latitude, longitude) {
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude +'&units=imperial&appid=' + apiKey;
    //returjn fetch Promise of weather data object
    return fetch(weatherUrl)
    .then(function (response) {
        console.log(response);
        return response.json();
    })
    .then(function (weatherData) {
        return weatherData;
    });
};

//fecth all necessary weather data, both current and 5-day forecast, and display
async function getWeather(city){
    //get city's coordinates
    var coords = await getCityCoordinates(city);
    //use coordinates to get current weather of city
    var currentWeather = await getCurrentWeather(coords[0], coords[1]);
    console.log(currentWeather);
    var forecastWeather = await getForecastWeather(coords[0], coords[1]);
    console.log(forecastWeather);
    displayCurrentWeather(currentWeather); 
    displayForecastWeather(forecastWeather);
}

function displayCurrentWeather(currentWeather){

}

function displayForecastWeather(forecastWeather){
    
}

getWeather("Atlanta");