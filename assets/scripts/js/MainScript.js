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
    // console.log(startCity, endCity, travelDate); //2022-03-23
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
    updateAttractions(lon, lat);

    //calling weather API to get weather for a date
}


async function updateAttractions(longitutude, lattitude){
    var lon=-96.7969;
var lat=32.7763;
console.log("before tourism");
console.log(longitutude, lattitude);
var response = await getTourismPlaces(longitutude, lattitude);
    var destinationFeatues = response.features;
    var filteredPlaces = [];
    var placesList = $("<ul>").addClass("popularPlacesList");
    for(var i=0; i<destinationFeatues.length; i++){
        var placeName = destinationFeatues[i].properties.name;
        var wikiLinkID =  destinationFeatues[i].properties.wikidata;
       var placeObject = {
           "place" : placeName,
           "ID" : wikiLinkID
       }
       filteredPlaces.push(placeObject);
       var listElement = $('<li>').addClass('popularPlace');
        listElement.html("<a href='https://en.wikipedia.org/wiki/"+wikiLinkID+"' alt='"+placeName+"'>"+placeName+"</a>");
        placesList.append(listElement);
    }

    $('#popularPlaces').append(placesList);


}