var apiKey = "5df764fc78aa40c1b5f6775a91f20e6a";
var weatherEl = document.querySelector("#weekWeather");
var inputValue = document.querySelector("#endInputValue");
var stateValue = document.querySelector("#endStateValue");
var cityName;
var stateCode;

// function for dates
var dt = luxon.DateTime.now();
date = dt.toLocaleString({weekday: 'long', day: 'numeric'});

// function to get the geolocation from the city input
 async function getCity(cityName, stateCode) {
    // geocoding API url with variables to accommodate whatever the user picks
    var geoApi = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + stateCode + ",us&limit=1&appid=" + apiKey;
    var geoLat;
    var geoLon;
    var geoName;
    var geoState;

    // gets the data from the url
    var weatherInformation = await fetch(geoApi).then(function(response) {
        // if the request from the url is successful
        if (response.ok) {
            response.json().then(async function(data) {
                // if user types in a city that doesn't exist
                if (data.length === 0) {
                    alert("Unable to find city.")
                    return false;
                }
                // gives variables values from the data gathered by geocoding api
                geoLat = data[0].lat;
                geoLon = data[0].lon;
                geoName = data[0].name;
                geoState = data[0].state;
                console.log("calling weather");
                var response =  await getWeather(geoLat, geoLon, geoName, geoState);
                return response;
            });
        }
    });
    return weatherInformation;

 
};

// get's the coordinates converted from city name from the geocoding api and gives it to the One Call api so that it can get the weather data
async function getWeather(geoLat, geoLon, geoName, geoState) {
    var oneCallApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + geoLat + "&lon=" + geoLon + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=" + apiKey;

    var weatherInfo = await fetch(oneCallApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // clears weather data from previously searched ending city
                
                return JSON.stringify(data);
            });
        }
    });
    return weatherInfo;
};

// creates weather cards with the appropriate data
var weekWeather = function(weekData, cardDates) {

    var iconUrl = "https://openweathermap.org/img/wn/" + weekData.weather[0].icon + "@2x.png";

    // creates card to place the weather data
    var weatherCard = document.createElement("div");
    weatherCard.className = "card columns is-size-5";
    weatherEl.appendChild(weatherCard);

    // creates header for each card for the date
    var weatherDate = document.createElement("div");
    weatherDate.innerHTML = cardDates;
    weatherDate.className = "weather-disp column is-3 is-flex is-justify-content-center is-align-items-center";
    weatherCard.appendChild(weatherDate);
    
    // gets the temperature and places it into the weather card
    var cardTemp = document.createElement("div");
    cardTemp.className = "weather-disp column is-3 is-flex is-align-items-center";
    cardTemp.innerHTML = weekData.temp.max + "&deg/" + weekData.temp.min + "&deg";
    weatherCard.appendChild(cardTemp);

    // places weather icon
    var weatherIconHolder = document.createElement("div");
    weatherIconHolder.className = "weather-disp column is-2";
    weatherCard.appendChild(weatherIconHolder);

    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", iconUrl);
    weatherIcon.className = "weather-icon";
    weatherIconHolder.appendChild(weatherIcon);

    // creates weather description
    var weatherDesc = document.createElement("div");
    weatherDesc.innerHTML = weekData.weather[0].description.toUpperCase();
    weatherDesc.className = "weather-disp column is-4 is-flex is-align-items-center";
    weatherCard.appendChild(weatherDesc);
};

// listens for click on the submit button to run functions
$("#currSubmit").on("click", function(event) {
    event.preventDefault();
    cityName = inputValue.value;
    stateCode = stateValue.value;
    getCity();
});