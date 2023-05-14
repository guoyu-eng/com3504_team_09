
const CLOUDY = 0;
const CLEAR = 1;
const RAINY = 2;
const OVERCAST = 3;
const SNOWY = 4;


/**
 * called by the HTML onload
 * showing any cached forecast data and declaring the service worker
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
 * given the list of cities created by the user, it will retrieve all the data from
 * the server (or failing that) from the database
 * @param forceReload true if the data is to be loaded from the server
 */
function loadData(forceReload){
    var birdList=JSON.parse(localStorage.getItem('name'));
    birdList=removeDuplicates(birdList);
    retrieveAllCitiesData(birdList, forceReload);
}

/**
 * it cycles through the list of cities and requests the data from the server for each
 * city
 * @param birdList the list of the cities the user has requested
 * @param date the date for the forecasts (not in use)
 * @param forceReload true if the data is to be retrieved from the server
 */
function retrieveAllCitiesData(birdList, forceReload){
    refreshBirdList();
    for (let index in birdList)
        loadBirdyData(birdList[index], forceReload);
}

/**
 * given one city and a date, it queries the server via Ajax to get the latest
 * weather forecast for that city
 * if the request to the server fails, it shows the data stored in the database
 * @param name
 * @param date
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


///////////////////////// INTERFACE MANAGEMENT ////////////


/**
 * given the forecast data returned by the server,
 * it adds a row of weather forecasts to the results div
 * @param dataR the data returned by the server:
 * class WeatherForecast{
 *  constructor (location, date, forecast, temperature, wind, precipitations) {
 *    this.location= location;
 *    this.date= date,
 *    this.forecast=forecast;
 *    this.temperature= temperature;
 *    this.wind= wind;
 *    this.precipitations= precipitations;
 *  }
 *}
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
            "<div class='col-sm'>" + getForecast(dataR.forecast) + "</div>" +
            "<div class='col-sm'>" + getTemperature(dataR) + "</div>" +
            "<div class='col-sm'>" + getPrecipitations(dataR) + "</div>" +
            "<div class='col-sm'>" + getWind(dataR) + "</div>" +
            "<div class='col-sm'></div></div></div>";
    }
}


/**
 * it removes all forecasts from the result div
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
 * it enables selecting the city from the drop down menu
 * it saves the selected city in the database so that it can be retrieved next time
 * @param city
 * @param date
 */
function selectCity(name) {
    var birdList=JSON.parse(localStorage.getItem('cities'));
    if (birdList==null) birdList=[];
    birdList.push(bird);
    birdList = removeDuplicates(birdList);
    localStorage.setItem('cities', JSON.stringify(birdList));
    retrieveAllCitiesData(birdList, true);
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
 * it shows the city list in the browser
 */
function showBirdList() {
    if (document.getElementById('bird_list')!=null)
        document.getElementById('bird_list').style.display = 'block';
}



/**
 * Given a list of cities, it removes any duplicates
 * @param cityList
 * @returns {Array}
 */
function removeDuplicates(birdList) {
    // remove any duplicate
    var uniqueNames=[];
    $.each(birdList, function(i, el){
        if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
    });
    return uniqueNames;
}

function birdUpload(){
    var name = document.getElementById('name').value;
    var data = document.getElementById('data').value;
    var location = document.getElementById('location').value;
    var addr = document.getElementById('addr').value;
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
        addr: addr,
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