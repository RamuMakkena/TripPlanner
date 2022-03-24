var weatherEl = document.querySelector("#weather");

// Read Form data
$("#form").on('click','.button', function(){
    var startCity = $('#startLocation').text();
    var endCity = $('#endingLocation').text();
    var travelDate = $('#traveldate').text();
    if((!startCity) || !(endCity) || !(travelDate)){
        $('#errorpan').text("All options need to be present");
        return false;
    }else{
        $('#errorpan').text("");
    }
    console.log(startCity, endCity, travelDate); //2022-03-23
     getWeatherInformation(endCity, travelDate);

     // clears weather so multiple forecast don't show
     weatherEl.innerHTML = "";
});

$('#startLocation').on('change', function(){
    $('#startLocation').text($(this).val());
})

$('#endingLocation').on('change', function(){
    $('#endingLocation').text($(this).val());
})

$('#traveldate').on('change', function(){
    $('#traveldate').text($(this).val());
})

async function getWeatherInformation(endCity, travelDate){
    var geoCoordinates= await getCity(endCity);
    var lon = geoCoordinates[0].lon;
    var lat = geoCoordinates[0].lat;
    var city = geoCoordinates[0].name;
    var state = geoCoordinates[0].state;
    var weatherInformationForGivendate = await weatherForTheDay(lat,lon, travelDate);

    console.log(JSON.stringify(weatherInformationForGivendate));

    var sunrise = weatherInformationForGivendate.sunrise;
    var sunset = weatherInformationForGivendate.sunset;
    var temp = weatherInformationForGivendate.temp;
    console.log(JSON.stringify(temp));
    var dayTemp = temp['day'];
    var eveTemp = temp.eve;
    var nightTemp = temp.night;
    var morningTemp = temp.morn;
    var minTemp = temp.min;
    var maxTemp = temp.max;

    var feelsLike = weatherInformationForGivendate.feelsLike;
    var humidity = weatherInformationForGivendate.humidity;
    var windSpeed = weatherInformationForGivendate.wind_speed;
    var rainPercent = weatherInformationForGivendate.rain;
    var weather = weatherInformationForGivendate.weather[0];
    var mainWeather = weather.main;
    var desc = weather.description;
    var icon = getIconUrl(weather.icon);
    var uvi = weatherInformationForGivendate.uvi;


    // Below is everything that creates the weather forecast
    var iconImage = $("<img src='" + icon + "'class='weather-icon' width='50' height='50'>");
    
    // creates a card to place the weather data
    var weatherCard = document.createElement("div");
    weatherCard.className = "card";
    weatherEl.appendChild(weatherCard);
    
    // creates header to place city and date
    var weatherNameAndDate = document.createElement("div");
    weatherNameAndDate.className = "card-header is-flex is-justify-content-center is-size-3";
    weatherNameAndDate.innerHTML = endCity + " " + travelDate;
    weatherCard.appendChild(weatherNameAndDate);
    
    // create body to place content into
    var weatherCont = document.createElement("div");
    weatherCont.className = "is-flex is-justify-content-center card-cont";
    weatherCard.appendChild(weatherCont);

    // gets the min temperature and places it into the weather card
    var weatherMin = document.createElement("div");
    weatherMin.className = "temp is-size-4 column is-3 is-flex is-justify-content-center";
    var roundedMinTemp = Math.ceil(minTemp);
    weatherMin.innerHTML = "Min: " + roundedMinTemp + "&degF";
    weatherCont.appendChild(weatherMin);
    
    // creates container to hold the icon, description, chance of rain, wind speed, and uvi
    var centerWeatherInfo = document.createElement("div");
    centerWeatherInfo.className = "center-weather column is-5";
    weatherCont.appendChild(centerWeatherInfo);

    // gets and places weather icon
    var weatherIconHolder = document.createElement("div");
    weatherIconHolder.className = "is-flex is-justify-content-center";
    $(weatherIconHolder).append(iconImage);
    centerWeatherInfo.appendChild(weatherIconHolder);
    
    // gets and places weather description
    var weatherDesc = document.createElement("div");
    weatherDesc.className = "is-size-4 is-flex is-justify-content-center";
    weatherDesc.innerHTML = desc.toUpperCase();
    centerWeatherInfo.appendChild(weatherDesc);

    // gets and places chance of rain
    var weatherRain = document.createElement("div");
    weatherRain.className = "is-size-4 is-flex is-justify-content-center";
    // if chance of rain is 0, data does not exist
    if (!rainPercent) {
        weatherRain.innerHTML = "Chance of Rain: 0 %"
    }
    else {
        weatherRain.innerHTML = "Chance of Rain: " + rainPercent + " %";
    }
    centerWeatherInfo.appendChild(weatherRain);

    // gets and places wind speed
    var weatherWind = document.createElement("div");
    weatherWind.className = "is-size-4 is-flex is-justify-content-center";
    weatherWind.innerHTML = "Wind: " + windSpeed + " MPH";
    centerWeatherInfo.appendChild(weatherWind);

    // gets and places uvi
    var weatherUvi = document.createElement("div");
    weatherUvi.className = "is-size-4 is-flex is-justify-content-center";
    weatherUvi.innerHTML = "UV Index: " + uvi;
    centerWeatherInfo.appendChild(weatherUvi);

    // gets and places max temperature
    var weatherMax = document.createElement("div");
    weatherMax.className = "temp is-size-4 column is-3 is-flex is-justify-content-center";
    var roundedMaxTemp = Math.ceil(maxTemp);
    weatherMax.innerHTML = "Max: " + roundedMaxTemp + "&degF";
    weatherCont.appendChild(weatherMax);

    //calling weather API to get weather for a date
}