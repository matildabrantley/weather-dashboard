var resultText = $('#result-text');
var resultContent = $('#result-content');
var searchForm = document.querySelector('#search-form');
var units = "imperial"; //imperial is default, metric is other option
var bgOpacity = 0.3;
var bgOpacity2 = 0;
var bgOpacityDirection = 1;
const apiKey = 'a641bf9af84171a774e42ab0fb8b528b';

searchForm.addEventListener('submit', searchFormSubmit);

displayStoredCities(); //searches from previous visits

//fecth all necessary weather data, both current and 5-day forecast, and display
async function weather(city){
    //units are imperial by default, metric only other option
    units = document.querySelector('#units-input').value;
    if (units != "imperial" && units != "metric")
        units = "imperial";
    //get city's coordinates
    var coords = await getCityCoordinates(city);
    //use coordinates to get current weather of city
    var weather = await getWeather(coords[0], coords[1]);
    //display weather, passing only the necessary data
    currentWeather = weather.current;
    forecastDays = weather.daily;
    displayWeather(currentWeather, forecastDays, city); 
}

//get coordinates of city with OpenWeather's API
async function getCityCoordinates(city) {
    var geocodeUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;
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
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude +'&units=' + units + '&appid=' + apiKey;
    //return fetch Promise of weather data object
    return fetch(weatherUrl)
    .then(function (response) {
        console.log(response);
        return response.json();
    })
    .then(function (weatherData) {
        return weatherData;
    });
};

function displayWeather(currentWeather, forecastDays, city){
    //display user's chosen units
    var degreeUnits = " °F";
    var speedUnits = " MPH";
    if (units != "imperial"){
        degreeUnits = " °C"; 
        speedUnits = " KPH";
    }
    
    //convert from Unix time
    var date = getDate(currentWeather.dt);

    //display today's weather
    var weatherContainer = $('#current-weather');
    weatherContainer.css('display', 'flex');
    weatherContainer.children().eq(0).text(city + " (" + date + ")");
    weatherContainer.children().eq(1).text("Temp: " + currentWeather.temp + degreeUnits);
    weatherContainer.children().eq(2).text("Wind: " + currentWeather.wind_speed + speedUnits);
    weatherContainer.children().eq(3).text("Humidity: " + currentWeather.humidity) + "%";
    weatherContainer.children().eq(4).text("UV Index: " + currentWeather.uvi);
    //weatherContainer.children().eq(4).css('background-color', getUVIColor(currentWeather.uvi));
    setUVIColor(currentWeather.uvi, weatherContainer.children().eq(4));

    $('#forecast-section').css('display', 'block');
    forecastContainer = $('#forecast-container');
    iconSource = "https://openweathermap.org/img/wn/";
    for (var day=1; day<6; day++) {
        //target forecasted day's element
        var dayContainer = forecastContainer.children().eq(day-1);
        //convert from Unix time
        date = getDate(forecastDays[day].dt);
        dayContainer.children().eq(0).text(date);
        var iconUrl = iconSource + forecastDays[day].weather[0].icon + ".png";
        dayContainer.children().eq(1).attr("src", iconUrl);
        dayContainer.children().eq(2).text("Temp: " + forecastDays[day].temp.day + degreeUnits);
        dayContainer.children().eq(3).text("Wind: " + forecastDays[day].wind_speed + speedUnits);
        dayContainer.children().eq(4).text("Humidity: " + forecastDays[day].humidity + "%");
    }
    //add to localStorage array if it's not already there
    if (!getStoredCities().includes(city))
        addStoredCity(city);
}

//get locally stored array and push to it, then add button to history
function addStoredCity(city){
    var storedCitiesArray = getStoredCities(); //get stored cities from localStorage
    //push new item to local array
    storedCitiesArray.push(city);
    //set localStorage to updated array
    localStorage.setItem("storedCities", JSON.stringify(storedCitiesArray));
    //now add button to search history
    var storedCity = $(document.createElement("button"));
    storedCity.text(city);
    storedCity.addClass('btn btn-info btn-block history-button');
    storedCity.on('click', function(){weather(this.innerHTML)});
    $('#search-section').append(storedCity);
}

function getStoredCities() {
    //if first city in search history
    if (localStorage.getItem("storedCities") === null)
         localStorage.setItem("storedCities", JSON.stringify(new Array()));
     return JSON.parse(localStorage.getItem("storedCities"));
}

//displays cities from previous page visits in localStorage
function displayStoredCities() {
    var storedCities = getStoredCities();
    console.log(storedCities);
    for (i in storedCities){
        console.log(storedCities[i]);
        var storedCity = $(document.createElement("button"));
        storedCity.text(storedCities[i]);
        storedCity.addClass('btn btn-info btn-block history-button');
        storedCity.on('click', function(){weather(this.innerHTML)});
        $('#search-section').append(storedCity);
    }
}

function searchFormSubmit(event) {
    event.preventDefault();

    var searchCity = document.querySelector('#search-input').value;
    units = document.querySelector('#units-input').value;

    console.log(searchCity);
    weather(searchCity);
  }

//set UV Index scale color on provided element, and make text readable
function setUVIColor (uvi, element) {
    if (uvi < 3){
        element.css('background-color', "green");
        element.css('color', "white"); //readability
    }
     else if (uvi >= 3 && uvi < 6) {
        element.css('background-color', "yellow");
        element.css('color', "black"); //readability
     }
    else if (uvi >= 6 && uvi < 8) {
        element.css('background-color', "orange");
        element.css('color', "black"); //readability
    }
    else if (uvi >= 8 && uvi < 11) {
        element.css('background-color', "red");
        element.css('color', "white"); //readability
    }
    else if (uvi >= 11) {
        element.css('background-color', "violet");
        element.css('color', "white"); //readability
    }
}

function getDate(unixTime){
    return moment.unix(unixTime).format("MM/DD/YYYY")
}

setInterval(() => { 
    const bg1 = $('#background1');
    const bg2 = $('#background2');
    if (bgOpacity > 0.3)
        bgOpacityDirection = -1;
    else if (bgOpacity < 0)
        bgOpacityDirection = 1;
    
    bgOpacity += 0.002 * bgOpacityDirection;
    bgOpacity2 += 0.002 * bgOpacityDirection * -1;

    bg1.css('opacity', bgOpacity) 
    bg2.css('opacity', bgOpacity2) 
}, 100);

//get 5-day per 3 hour forecast data by coordinates
/*async function get5DayPer3HourForecast(latitude, longitude) {
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude +'&units=' + units + '&appid=' + apiKey;
    //return fetch Promise of weather data object
    return fetch(weatherUrl)
    .then(function (response) {
        console.log(response);
        return response.json();
    })
    .then(function (weatherData) {
        return weatherData;
    });
};*/