/**

 Initializes the map and sets up the geocoder buttons.
 */
let map;
let marker;
let geocoder;
let responseDiv;
let response;
let formattedAddress;
let chosenLng;
let chosenLat;

function initMap() {
    let mapDiv = document.getElementById("geocoder-buttons");
    //map = new google.maps.Map(document.getElementById("map"), {
    //    zoom: 10,
    //    center: { lat: 53.3817443, lng: -1.4819343 },
    //    mapTypeControl: false,
    //});

    geocoder = new google.maps.Geocoder();

    const inputText = document.createElement("input");
    mapDiv.appendChild(inputText);
    inputText.type = "text";
    inputText.placeholder = "Enter a location";
    inputText.id = "addressInput";

    const submitButton = document.createElement("input");
    mapDiv.appendChild(submitButton);
    submitButton.type = "button";
    submitButton.value = "Sort by distance";
    submitButton.classList.add("button", "button-primary");

    const clearButton = document.createElement("input");
    mapDiv.appendChild(clearButton);

    const createMapButton = document.createElement("input");
    mapDiv.appendChild(createMapButton);
    createMapButton.type = "button";
    createMapButton.value = "Click to toggle map"
    submitButton.classList.add("button", "button-primary");


    clearButton.type = "button";
    clearButton.value = "Clear";
    clearButton.classList.add("button", "button-secondary");
    response = document.createElement("pre");
    response.id = "response";
    response.innerText = "";
    responseDiv = document.createElement("div");
    responseDiv.id = "response-container";
    responseDiv.appendChild(response);

    const instructionsElement = document.createElement("p");
    mapDiv.appendChild(instructionsElement);


    instructionsElement.id = "instructions";
    instructionsElement.innerHTML =
        "<strong>Instructions</strong>: Enter an address in the textbox to geocode or click on the map to reverse geocode.";

    //map.addListener("click", (e) => {
    //    geocode({ location: e.latLng });
    //});
    submitButton.addEventListener("click", () =>
        geocode({address: inputText.value})
    );
    clearButton.addEventListener("click", () => {
        clear();
    });

    createMapButton.addEventListener("click", () => {
      $("#map").toggle();
    });

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: { lat: 53.3817443, lng: -1.4819343 },
        mapTypeControl: false,
    });
    map.addListener("click", (e) => {
        geocode({ location: e.latLng });
    });
    //});

    clear();
}

function clear() {
    //marker.setMap(null);
    responseDiv.style.display = "none";
}

function geocode(request) {
    clear();
    geocoder
        .geocode(request)
        .then((result) => {
            const { results } = result;

            //map.setCenter(results[0].geometry.location);
            //marker.setPosition(results[0].geometry.location);
            //marker.setMap(map);
            responseDiv.style.display = "block";
            response.innerText = JSON.stringify(result, null, 2);
            //console.log(results);
            //console.log(results[0]["formatted_address"]);
            //console.log(results[0]["geometry"]["location"].lat());
            //console.log(results[0]["geometry"]["location"].lng());
            formattedAddress = results[0]["formatted_address"];
            $("#addressInput").val(formattedAddress);
            chosenLat = results[0]["geometry"]["location"].lat();
            chosenLng = results[0]["geometry"]["location"].lng();
            sortBirds(chosenLat, chosenLng);
            return results;
        })
        .catch((e) => {
            alert("Geocode was not successful for the following reason: " + e);
        });
}

//order bird listings based on distance from chosen location
function sortBirds(chosenLat, chosenLng) {
    // 4 values per index: index, lat, lng, distance from chosen point
    let birdListing = [[]];
    //get the lat/lng values for each bird in the db
    for (let i=0; i<$('.bird-info').length; i++) {
        birdListing[i] = [i, $('#bird-info-' + i + ' .lat .list-value').text().trim(),
            $('#bird-info-' + i + ' .lng .list-value').text().trim(), 12756]
        if (birdListing[i][1] !== "" && birdListing[i][2] !== "") {
            haversine(chosenLat, chosenLng, birdListing, i)
            let roundedDist = birdListing[i][3].toFixed(1)
            //let distanceEl = document.createElement("li");
            //distanceEl.innerHTML = `<span><strong>Distance:</strong> <span>${roundedDist}km</span></span>`;
            // change so that distance is updated instead of adding a new element, the second time it is updated
            //distanceEl.classList.add("distance");
            $(".distance").removeClass("hidden");
            $('#bird-info-' + i + " ul .distance .list-value").text(roundedDist+"km")
            //$('#bird-info-' + i + " ul #address").after(distanceEl);
        }
    }
    birdListing.sort(compareDistances)
    for (let i=0; i<$('.bird-info').length; i++) {
        document.getElementById('birds-list').appendChild(document.getElementById('bird-info-' + birdListing[i][0]))
    }
}

function compareDistances(a, b) {
    if (a[3] === b[3]) {
        return 0
    }
    else return (a[3] < b[3]) ? -1 : 1
}

//radius of Earth
let R = 6371
//calculate distance between two points on a sphere's surface
function haversine(chosenLat, chosenLng, birdListing, iterator) {
    //console.log(chosenLat, chosenLng, birdListing, iterator)
    //debugger;
    let birdLat = birdListing[iterator][1]
    let birdLng = birdListing[iterator][2]
    let latDiff = birdLat - chosenLat
    let lngDiff = birdLng - chosenLng
    let latDiffRads = toRadians(latDiff)
    let lngDiffRads = toRadians(lngDiff)

    let a = Math.sin(latDiffRads/2)**2 + Math.cos(toRadians(birdLat)) * Math.cos(toRadians(chosenLat))
            * Math.sin(lngDiffRads/2)**2
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    let distance = R * c
    birdListing[iterator][3] = distance
}

function toRadians(n) {
    return n * Math.PI / 180;
}

window.initMap = initMap;