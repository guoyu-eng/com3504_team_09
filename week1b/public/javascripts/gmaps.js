/**

 Initializes the Google Map and sets up click event listener to retrieve latitude and longitude information.
 */

let map;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    const myLatLng = { lat: 53.374, lng: -1.698 };

    map = new Map(document.getElementById("map"), {
        center: { lat: 53.374, lng: -1.698 },
        zoom: 10,
    });

    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: myLatLng,
    });

    infoWindow.open(map);
    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.
        infoWindow.close();
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );
        let latlngObj = mapsMouseEvent.latLng.toJSON();
        let lat = latlngObj.lat;
        let lng = latlngObj.lng;
        let latlngStr = JSON.stringify(mapsMouseEvent.latLng.toJSON());
        let nearestAddress = ""
        infoWindow.open(map);
        console.log(mapsMouseEvent.latLng.toJSON());
        console.log(mapsMouseEvent.latLng.lat())
        document.getElementById("latlng").setAttribute("value", lat + "," + lng)
        document.getElementById("lat").setAttribute("value", lat)
        document.getElementById("lng").setAttribute("value", lng)
        let reverseGeoLocURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyCE2UeJSbO5af-ZqcPD8x-dflXCUWp3ZWY"

        //fetch nearest address to click event
        const addressRequest = async () => {
            const response = await fetch(reverseGeoLocURL);
            const addressJSON = await response.json(); //extract JSON from the http response
            // do something with myJson
            console.log(addressJSON)
            console.log(addressJSON["results"]["0"]["formatted_address"])
            nearestAddress = addressJSON["results"]["0"]["formatted_address"]
            document.getElementById("addr").setAttribute("value", nearestAddress)
            //req.body.addr = nearestAddress
        }
        addressRequest();

    });

}



initMap();