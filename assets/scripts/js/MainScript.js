// Read Form data
$("#form").on('click','.button', function(){
    var startCity = $('#startLocation').text();
    var endCity = $('#endingLocation').text();
    console.log(startCity, endCity);
    var displayWeather = getWeatherInformation(endCity);
});

$('#startLocation').on('change', function(){
    $('#startLocation').text($(this).val());
})

$('#endingLocation').on('change', function(){
    $('#endingLocation').text($(this).val());
})

async function getWeatherInformation(endCity){
    var destinationDetails = endCity.split(',');
    var weatherInformation= await getCity(destinationDetails[0], destinationDetails[1]);
    console.log(JSON.stringify(weatherInformation));
}