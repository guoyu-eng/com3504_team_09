////////////////// DATABASE //////////////////
// the database receives from the server the following structure
import * as idb from './idb/index.js';

/** class BirdWatchinig{
 *  constructor (name, details, inputImg, lat, lnt, addr) {
 *    this.name = name;
 *    this.details = details,
 *    this.inputImg = inputImg;
 *    this.lat = lat;
 *    this.lnt = lnt;
 *    this.addr = addr;
 *  }
 *}
 */

let db;

const BIRD_DB_NAME= 'db_bird_1';
const BIRDT_STORE_NAME= 'store_birds';

/**
 * it inits the database
 */
async function initDatabase(){
    if (!db) {
        db = await idb.openDB(BIRD_DB_NAME, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(BIRDT_STORE_NAME)) {
                    let forecastDB = upgradeDb.createObjectStore(BIRDT_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    forecastDB.createIndex('location', 'location', {unique: false, multiEntry: true});
                }
            }
        });
        console.log('db created');
    }
}
window.initDatabase= initDatabase;

/**
 * it saves the forecasts for a city in localStorage
 * @param city
 * @param forecastObject
 */
async function storeCachedData(city, forecastObject) {
    console.log('inserting: '+JSON.stringify(forecastObject));
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(FORECAST_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(FORECAST_STORE_NAME);
            await store.put(forecastObject);
            await  tx.complete;
            console.log('added item to the store! '+ JSON.stringify(forecastObject));
        } catch(error) {
            localStorage.setItem(city, JSON.stringify(forecastObject));
        };
    }
    else localStorage.setItem(city, JSON.stringify(forecastObject));
}

window.storeCachedData=storeCachedData;

/**
 * it retrieves the forecasts data for a city from the database
 * @param city
 * @param date
 * @returns {*}
 */
async function getCachedData(city, date) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            console.log('fetching: ' + city);
            let tx = await db.transaction(FORECAST_STORE_NAME, 'readonly');
            let store = await tx.objectStore(FORECAST_STORE_NAME);
            let index = await store.index('location');
            let readingsList = await index.getAll(IDBKeyRange.only(city));
            await tx.complete;
            let finalResults=[];
            if (readingsList && readingsList.length > 0) {
                let max;
                for (let elem of readingsList)
                    if (!max || elem.date > max.date)
                        max = elem;
                if (max)
                    finalResults.push(max);
                return finalResults;
            } else {
                const value = localStorage.getItem(city);
                if (value == null)
                    return finalResults;
                else finalResults.push(value);
                return finalResults;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        const value = localStorage.getItem(city);
        let finalResults=[];
        if (value == null)
            return finalResults;
        else finalResults.push(value);
        return finalResults;
    }
}
window.getCachedData= getCachedData;


/**
 * given the server data, it returns the value of the field precipitations
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getPrecipitations(dataR) {
    if (dataR.precipitations == null && dataR.precipitations === undefined)
        return "unavailable";
    return dataR.precipitations
}
window.getPrecipitations=getPrecipitations;

/**
 * given the server data, it returns the value of the field wind
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getWind(dataR) {
    if (dataR.wind == null && dataR.wind === undefined)
        return "unavailable";
    else return dataR.wind;
}
window.getWind=getWind;

/**
 * given the server data, it returns the value of the field temperature
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getTemperature(dataR) {
    if (dataR.temperature == null && dataR.temperature === undefined)
        return "unavailable";
    else return dataR.temperature;
}
window.getTemperature=getTemperature;


/**
 * the server returns the forecast as a n integer. Here we find out the
 * string so to display it to the user
 * @param forecast
 * @returns {string}
 */
function getForecast(forecast) {
    if (forecast == null && forecast === undefined)
        return "unavailable";
    switch (forecast) {
        case CLOUDY:
            return 'Cloudy';
        case CLEAR:
            return 'Clear';
        case RAINY:
            return 'Rainy';
        case OVERCAST:
            return 'Overcast';
        case SNOWY:
            return 'Snowy';
    }
}
window.getForecast=getForecast;


