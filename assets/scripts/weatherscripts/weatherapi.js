var iconurl = "https://openweathermap.org/img/wn/";
var DateTime = luxon.DateTime;

// function for dates
var dt = DateTime.now();
date = dt.toLocaleString({weekday: 'long', day: 'numeric'});

// function to get the geolocation from the city input
 async function getCity(cityName) {
    // geocoding API url with variables to accommodate whatever the user picks
    var geoApi = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + ",us&limit=1&appid=5df764fc78aa40c1b5f6775a91f20e6a";
    // gets the data from the url
    var response = await fetch(geoApi)
            .then((response) => { return response.json();})
            .catch(err => console.error(err));
    return response;

};

// get's the coordinates converted from city name from the geocoding api and gives it to the One Call api so that it can get the weather data
async function getWeather(geoLat, geoLon) {
    var oneCallApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + geoLat + "&lon=" + geoLon + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=5df764fc78aa40c1b5f6775a91f20e6a";
    var weatherResponse = await fetch(oneCallApi)
            .then((response) =>{return response.json();})
            .catch(err => console.error(err));
    return weatherResponse;
};

// get weather for single day
async function weatherForTheDay(geoLat, geoLon, travelDate) {
    var weatherInformation = await getWeather(geoLat, geoLon);
    var dailyWeather = weatherInformation.daily;
    for(var i=0; i<dailyWeather.length; i++){
        var formattedDate = (DateTime.fromMillis(dailyWeather[i].dt * 1000)).toFormat('yyyy-LL-dd');
        if(formattedDate == travelDate){
           return dailyWeather[i];
        }
        
    }
};

function getIconUrl(iconvalue){
    return iconurl+iconvalue+'@2x.png';
}