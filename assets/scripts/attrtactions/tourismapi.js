var api = "https://api.opentripmap.com/0.1/en/places/radius?radius=17000&src_attr=wikidata&rate=3&limit=10&apikey=5ae2e3f221c38a28845f05b62eced4aa074ee3128aee127b9dd0c180&";

async function getTourismPlaces(longitude, lattitude){
    console.log(longitude, lattitude);
    var response = await fetch(api+'lon='+longitude+'&lat='+lattitude)
                        .then( (response) => {return response.json(); })
                        .catch(err => console.err(err));
    return response;
}