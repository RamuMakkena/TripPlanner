var weatherEl = document.querySelector("#weather");
var tripsSearched = JSON.parse(localStorage.getItem("phoenix-trips"));
var currentDate = (DateTime.now()).toFormat('yyyy-LL-dd');
getWeatherInformation("Austin", currentDate);

$('#traveldate').datepicker({
    dateFormat:"yy-mm-dd",
    minDate: 0,
    maxDate: 5
  });


if(tripsSearched){
    updatePreviousTrips(tripsSearched);
}
else{
    tripsSearched = [];
}
// Read Form data
$("#form").on('click','.button', function(){
    var startCity = $('#startLocation').text();
    var endCity = $('#endingLocation').text();
    var travelDate = $('#traveldate').text();
    console.log(travelDate);
    if(!startCity){
        $('#errorpan').text("");
        $('#errorpan').text("Starting Location should not be empty");
        return false;
    } else if(!endCity ){
        $('#errorpan').text("");
        $('#errorpan').text("Ending Location City should not be empty");
        return false;
    }else if(!travelDate){
        travelDate = (DateTime.now()).toFormat('yyyy-LL-dd');
    }
    else{
        $('#errorpan').text("");
    }

    $('#weatherCard').html('');
     getWeatherInformation(endCity, travelDate);
     updateLocalStorage(startCity, endCity);
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
    if(!geoCoordinates[0]){
        $('#errorpan').text("We are not able to identify the cities entered, please try again ");
        return false;
    }
    var lon = geoCoordinates[0].lon;
    var lat = geoCoordinates[0].lat;
    var city = geoCoordinates[0].name;
    var state = geoCoordinates[0].state;
    updateAttractions(endCity, lon, lat);
    var weatherInformationForGivendate = await weatherForTheDay(lat,lon, travelDate);
    var temp = weatherInformationForGivendate.temp;
    var minTemp = temp.min;
    var maxTemp = temp.max;

    var humidity = weatherInformationForGivendate.humidity;
    var windSpeed = weatherInformationForGivendate.wind_speed;
    var rainPercent = weatherInformationForGivendate.rain;
    var weather = weatherInformationForGivendate.weather[0];
    var desc = weather.description;
    var icon = getIconUrl(weather.icon);
    var uvi = weatherInformationForGivendate.uvi;


    // Below is everything that creates the weather forecast
    var iconImage = $("<img src='" + icon + "'class='weather-icon' width='50' height='50'>");
    
    // creates a card to place the weather data
    var weatherCard = document.getElementById('weatherCard');
    weatherCard.className = "card";
    
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


async function updateAttractions(endCity, longitutude, lattitude){

var response = await getTourismPlaces(longitutude, lattitude);
    var destinationFeatues = response.features;
    var placesList = $("<ul>").addClass("popularPlacesList");
    for(var i=0; i<destinationFeatues.length; i++){
        var placeName = destinationFeatues[i].properties.name;
        var wikiLinkID =  destinationFeatues[i].properties.wikidata;
       var listElement = $('<li>').addClass('popularPlace');
        listElement.html("<a href='https://www.wikidata.org/wiki/"+wikiLinkID+"' alt='"+placeName+"'>"+placeName+"</a>");
        placesList.append(listElement);
    }

   var h2Elemet = $("<h2 class='is-size-3 has-text-centered'>Popular places around "+endCity+" </h2>");
   $('#popularPlaces').html(""); //removing existing data;
   $('#popularPlaces').append(h2Elemet); 
   $('#popularPlaces').append(placesList);


}


function updateLocalStorage(startCity, endCity){

    tripsSearched.forEach(trip => {
        if(trip.startCity == startCity && trip.destinationCity == endCity){
            return true;
        }
    });
    var tripObject = {
        "startCity" : startCity,
        "destinationCity" : endCity
    }
    tripsSearched.push(tripObject);
    localStorage.setItem("phoenix-trips",JSON.stringify(tripsSearched));
    updatePreviousTrips(tripsSearched);
}


function updatePreviousTrips(tripsSearched){
    var previousTripsList = $("<ul>").addClass("previousTrips");
    var h2Elemet = $('<h2>').text("Previous searched trips");
    tripsSearched.forEach(trip => {
        var tripElement = $('<li>').addClass('previousTrip');
        tripElement.text(trip.startCity+" - "+trip.destinationCity);
        previousTripsList.append(tripElement);
    });
    $('#previousTrips').html(""); //removing existing data;
    $('#previousTrips').append(h2Elemet); 
    $('#previousTrips').append(previousTripsList);
}



function getMinDate(){
    return("2022-03-22");
}
function getMaxDate(){
    return("2022-03-27");
}