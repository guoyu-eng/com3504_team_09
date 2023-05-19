/**
 * called by the HTML onload
 * showing any cached sightings and declaring the service worker
 */


function initBirdWatching() {
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js')
            .then(function() { console.log('Service Worker Registered'); });
    }
    loadData(false);
}

/**
 * given the list of sightings created by the user, it will retrieve all the data from
 * the server (or failing that) from the database
 * @param forceReload true if the data is to be loaded from the server
 */
function loadData(forceReload){
    var birdList=JSON.parse(localStorage.getItem('name'));
    retrieveAllCitiesData(birdList, forceReload);
}

/**
 * it cycles through the list of sightings and requests the data from the server for each
 * city
 * @param birdList the list of the cities the user has requested
 * @param forceReload true if the data is to be retrieved from the server
 */
function retrieveAllCitiesData(birdList, forceReload){
    refreshBirdList();
    for (let index in birdList)
        loadBirdData(birdList[index], forceReload);
}

/**
 * given one bird name, it queries the server via Ajax to get the sighting
 * if the request to the server fails, it shows the data stored in the database
 * @param name
 * @param forceReload true if the data is to be retrieved from the server
 */
async function loadBirdData(name, forceReload){
    // there is no point in retrieving the data from the db if force reload is true:
    // we should not do the following operation if forceReload is true
    // there is room for improvement in this code
    let cachedData=await getCachedData(name);
    if (!forceReload && cachedData && cachedData.length>0) {
        for (let res of cachedData)
            addToResults(res);
    } else {
        const input = JSON.stringify({location: name});
        $.ajax({
            url: '/birds/bird',
            data: input,
            contentType: 'application/json',
            type: 'POST',
            success: function (dataR) {
                // no need to JSON parse the result, as we are using
                // dataType:json, so JQuery knows it and unpacks the
                // object for us before returning it
                addToResults(dataR);
                storeCachedData(dataR.location, dataR);
                if (document.getElementById('offline_div') != null)
                    document.getElementById('offline_div').style.display = 'none';
            },
            // the request to the server has failed. Let's show the cached data
            error: async function (xhr, status, error) {
                showOfflineWarning();
                let cachedData=await getCachedData(name);
                if (cachedData && cachedData.length>0)
                    addToResults(cachedData[0]);
                const dvv = document.getElementById('offline_div');
                if (dvv != null)
                    dvv.style.display = 'block';
            }
        });
    }
    // hide the list of cities if currently shown
    if (document.getElementById('bird_list')!=null)
        document.getElementById('bird_list').style.display = 'none';
}

/**
 * given the sightings returned by the server,
 * it adds a row of bird sightings to the results div
 * @param dataR the data returned by the server:
 */
function addToResults(dataR) {
    if (document.getElementById('results') != null) {
        const row = document.createElement('div');
        // appending a new row
        document.getElementById('results').appendChild(row);
        // formatting the row by applying css classes
        row.classList.add('card');
        row.classList.add('my_card');
        row.classList.add('bg-faded');
        // the following is far from ideal. we should really create divs using javascript
        // rather than assigning innerHTML
        row.innerHTML = "<div class='card-block'>" +
            "<div class='row'>" +
            "<div class='col-sm'>" + dataR.location + "</div>" +

            "<div class='col-sm'></div></div></div>";
    }
}

/**
 * Store cached data by click
 */
function storeToIDB(){
    let name = document.getElementById('name').value;
    let details = document.getElementById('details').value;
    let inputImg = document.getElementById('inputImage').value;
    let lat = document.getElementById('lat').value;
    let lng = document.getElementById('lng').value;
    let latlng = document.getElementById('latlng').value;

    storeCachedData(name, details, inputImg, lat, lng, latlng);
    alert("Successfully created sighting");
    console.log("Successfully created sighting")
}


/**
 * it removes all sightings from the result div
 */
function refreshBirdList(){
    if (document.getElementById('results')!=null)
        document.getElementById('results').innerHTML='';
}

/**
 * When the client gets off-line, it shows an off line warning to the user
 * so that it is clear that the data is stale
 */
window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    showOfflineWarning();
}, false);

/**
 * When the client gets online, it hides the off line warning
 */
window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");
    hideOfflineWarning();
    loadData(false);
}, false);


function showOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='block';
}

function hideOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='none';
}


/**
 * it shows the sightings in the browser
 */
function showBirdList() {
    if (document.getElementById('bird_list')!=null)
        document.getElementById('bird_list').style.display = 'block';
}

/**
 * upload bird data by fetching
 */
function birdUpload(){
    var name = document.getElementById('name').value;
    var data = document.getElementById('data').value;
    var location = document.getElementById('location').value;

    var latlng = document.getElementById('latlng').value;
    var lat = document.getElementById('lat').value;
    var lng = document.getElementById('lng').value;
    var category = document.getElementById('category').value;
    var inputImage = document.getElementById('inputImage').value;
    var details = document.getElementById('details').value;
    var formData = {
        name: name,
        data: data,
        location: location,

        latlng: latlng,
        lat: lat,
        lng: lng,
        category: category,
        inputImage: inputImage,
        details: details
    };

    // Send a POST request to the server
    fetch('/bird', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => {
            console.error('Error:', error);
        });

}