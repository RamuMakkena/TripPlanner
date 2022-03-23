
 
 var map;
 function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
     center: {lat: 30.26759, lng: -97.74299},
zoom: 13
   });
 }



var test ="https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=AIzaSyDM0RuEHkSrRzqb3IobHITR7T59jhtk4ZM"


function sample (){
    fetch (test)
    .then(response =>{return response.json()})
    .then(body => console.log(JSON.stringify(body))) 
}
    sample();




var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30.26759, lng: -97.74299},
zoom: 13
  });
}

//Direction service object to use route method and get a result for our request
var directionsService = new google.maps.DirectionsService();

//Directions display object which we will use to display the route 
var directionsDisplay = new google.maps.DirectionsRenderer();

//Bind the directionsRenderer to the map 
directionsDisplay.setMap(map);

//Function 
function calcRoute() {
    //Creating the request //
    var request = {
        origin: document.getElementById("start").value,
        destionation: document.getElementById("end").value,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL

     }

     //Pass the request to the route method
     directionsService.route(request, (result, status) => {
         if (status == google.maps.DirectionsStatus.OK) {

         }

         //display route
         directionsDisplay.setDirections(result); 
        })
    }