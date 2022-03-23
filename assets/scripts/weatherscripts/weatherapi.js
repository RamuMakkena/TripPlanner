var weatherEl = document.querySelector("#weather");
var inputValue = document.querySelector("#endingLocation");
var stateValue = document.querySelector("#endStateValue");
var cityName;
var stateCode;
var DateTime = luxon.DateTime;

// function for dates
var dt = DateTime.now();
date = dt.toLocaleString({weekday: 'long', day: 'numeric'});

// function to get the geolocation from the city input
var getCity = function(calcDiffDates) {
    // geocoding API url with variables to accommodate whatever the user picks
    var geoApi = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + ",us&limit=1&appid=5df764fc78aa40c1b5f6775a91f20e6a";
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
                getWeather(geoLat, geoLon, calcDiffDates);
            });
        }
    });
};

// get's the coordinates converted from city name from the geocoding api and gives it to the One Call api so that it can get the weather data
var getWeather = function(geoLat, geoLon, calcDiffDates) {
    var oneCallApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + geoLat + "&lon=" + geoLon + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=5df764fc78aa40c1b5f6775a91f20e6a";

    fetch(oneCallApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // clears weather data from previously searched ending city
                weatherEl.innerHTML = "";

                // for loop to get the next seven days of data and passes it to the 'weekWeather' function
                var i = calcDiffDates; 
                var weatherDates = dt.plus({days: i}).toLocaleString({weekday: 'short', day: 'numeric'});
                weekWeather(data.daily[i], weatherDates);    
            
            });
        }
    });
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
$("#btn").on("click", function(event) {
    event.preventDefault();
    cityName = inputValue.value;
    
    // grabs the date from the calendar and gives it value
    var dateValue = new Date($('#dateValue').val());
    
    // variable to convert the day selected from the calendar to lexon format
    var lexonDateValue = DateTime.fromJSDate(dateValue).plus({days: 1}); // plus 1 for offset because the first day starts at 0

    // variables to calculate the difference between the user selected date and the current date
    var diffDates = lexonDateValue.diff(dt, 'days');
    var calcDiffDates = Math.ceil(diffDates.values.days)
    
    // prevents user from selecting a date outside of the available weather forecast
    if (calcDiffDates > 7) {
        alert("Out of range"); // needs to be changed from alert box
        return false;
    }

    getCity(calcDiffDates);
    $("form").trigger("reset");
});