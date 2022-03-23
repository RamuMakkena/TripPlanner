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

    $('#weather').text(desc);
    $('#weather').append(icon);

    //calling weather API to get weather for a date
}