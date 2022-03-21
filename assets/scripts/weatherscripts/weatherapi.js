var apiKey = "5df764fc78aa40c1b5f6775a91f20e6a";
var weekWeatherEl = document.querySelector("#weekWeather");
var cityName;
var stateCode;
var inputValue = document.querySelector("#inputValue");
var stateValue = document.querySelector("#stateValue");

// function to get the geolocation from the city input
var getCity = function() {
    // geocoding API url with variables to accommodate whatever the user picks
    var geoApi = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + stateCode + ",us&limit=1&appid=" + apiKey;
    var geoLat;
    var geoLon;
    var geoName;
    var geoState;

    // gets the data from the url
    fetch(geoApi).then(function(response) {
        // if the request from the url is successful
        if (response.ok) {
            response.json().then(function(data) {
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
                getWeather(geoLat, geoLon, geoName, geoState);
            });
        }
        // needs to be changed from pop-up
        else {
            alert("Can't leave blank!")
        }
    });

    $("form").trigger("reset");
};

var getWeather = function(geoLat, geoLon, geoName, geoState) {
    var oneCallApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + geoLat + "&lon=" + geoLon + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=" + apiKey;

    fetch(oneCallApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                for (var i = 0; i < 7; i++) {
                    weekWeather(data.daily[i]);    
                }
            });
        }
    });
};


var weekWeather = function(weekData) {

    var weatherCard = document.createElement("div");
    weekWeatherEl.appendChild(weatherCard);

    var cardTemp = document.createElement("p");
    cardTemp.innerHTML = "Temp: " + weekData.temp.day;
    weatherCard.appendChild(cardTemp);
};

$("#currSubmit").on("click", function(event) {
    event.preventDefault();
    cityName = inputValue.value;
    stateCode = stateValue.value;
    console.log(stateCode);
    getCity();
});