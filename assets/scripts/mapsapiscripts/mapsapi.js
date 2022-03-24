
function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: 30.266666, lng: -97.733330 },
    disableDefaultUI:true,
  });
  directionsRenderer.setMap(map);
  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };

  document.getElementById("btn").addEventListener("click", onChangeHandler);
  
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService
    .route({
      origin: {
        query: document.getElementById("startLocation").value,
      },
      destination: {
        query: document.getElementById("endingLocation").value,
      },
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      var distance = response.routes[0].legs[0].distance.text;
      var duration = response.routes[0].legs[0].duration.text;
      var h3El = document.getElementById('summaryText');
     
      h3El.textContent = 'Duration: '+duration+'  Distance: '+distance;
      directionsRenderer.setDirections(response);
    })
    .catch((e) => console.error("Directions request failed due to " + status));
} 
