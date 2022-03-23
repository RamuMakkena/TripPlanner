// Read Form data
$("#form").on('click','.button', function(){
    var startCity = $('#startLocation').text();
    var endCity = $('#endingLocation').text();
    var travelDate = $('#traveldate').text();
    console.log(startCity, endCity, travelDate); //2022-03-23
    var displayWeather = getWeatherInformation(endCity, travelDate);
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

    //calling weather API to get weather for a date
}