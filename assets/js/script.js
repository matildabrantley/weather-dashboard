var resultText = $('#result-text');
var resultContent = $('#result-content');
var searchForm = document.querySelector('#search-form');
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

//get One Call weather data by coordinates
async function getWeather(latitude, longitude) {
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

//fecth all necessary weather data, both current and 5-day forecast, and display
async function weather(city){
    //get city's coordinates
    var coords = await getCityCoordinates(city);
    //use coordinates to get current weather of city
    var weather = await getWeather(coords[0], coords[1]);
    //display weather
    displayWeather(weather); 
}

function displayWeather(weather){
    currentWeather = weather.current;
    var date = getDate(currentWeather.dt);
    console.log(date);

    forecastDays = weather.daily;
    for (var d=1; d<6; d++) {
        date = getDate(forecastDays[d].dt);
        console.log(date);
    }
}


weather("Atlanta");













function getDate(unixTime){
    return moment.unix(unixTime).format("MM/DD/YYYY")
}


// function display5DayPer3HourForecast(forecastWeather){
//     forecastDays = forecastWeather.list;
//     for (var i=0; i<5*8; i++) {
//         var date = moment.unix(forecastDays[d].dt).format("MM/DD/YYYY");
//         console.log(date);
//     }
// }

// //get 5-day per 3 hour forecast data by coordinates
// async function get5DayPer3HourForecast(latitude, longitude) {
//     var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude +'&units=imperial&appid=' + apiKey;
//     //returjn fetch Promise of weather data object
//     return fetch(weatherUrl)
//     .then(function (response) {
//         console.log(response);
//         return response.json();
//     })
//     .then(function (weatherData) {
//         return weatherData;
//     });
// };