let map;

//$(function(){$("img").click(function(){this.requestFullscreen()})});
async function initMap() {
    const {Map} = await google.maps.importLibrary("maps");
    let myLat = parseFloat($(".lat .list-value").text().trim());
    let myLng = parseFloat($(".lng .list-value").text().trim());
    const myLatLng = {lat: myLat, lng: myLng};

    map = new Map(document.getElementById("map"), {
        center: {lat: myLat, lng: myLng},
        zoom: 10,
        streetViewControl: false,
    });

    new google.maps.Marker({
        position: myLatLng,
        map,
        title: "Bird Sighting Location",
    });
}


initMap();