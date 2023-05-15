////////////////// DATABASE //////////////////
// the database receives from the server the following structure
import * as idb from '../idb/index.js';

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
const BIRD_STORE_NAME= 'store_birds';

/**
 * it inits the database
 */
async function initDatabase(){
    if (!db) {
        db = await idb.openDB(BIRD_DB_NAME, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(BIRD_STORE_NAME)) {
                    let birdDB = upgradeDb.createObjectStore(BIRD_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    birdDB.createIndex('name', 'name', {unique: false, multiEntry: true});
                }
            }
        });
        console.log('db created');
    }
}
window.initDatabase= initDatabase;

/**
 * it saves the forecasts for a city in localStorage
 * @param birdName
 * @param birdObject
 */
async function storeCachedData(birdName, birdObject) {
    console.log('inserting: '+JSON.stringify(birdObject));
    if (!db)
        console.log('await...')
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(BIRD_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(BIRD_STORE_NAME);
            await store.put(birdObject);
            await  tx.complete;
            console.log('added item to the store! '+ JSON.stringify(birdObject));
        } catch(error) {
            localStorage.setItem(name, JSON.stringify(birdObject));
        };
    }
    else localStorage.setItem(name, JSON.stringify(birdObject));
}

window.storeCachedData=storeCachedData;

/**
 * it retrieves the forecasts data for a city from the database
 * @param birdName
 * @returns {*}
 */
async function getCachedData(birdName) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            console.log('fetching: ' + birdName);
            let tx = await db.transaction(BIRD_STORE_NAME, 'readonly');
            let store = await tx.objectStore(BIRD_STORE_NAME);
            let index = await store.index('name');
            let readingsList = await index.getAll();
            await tx.complete;
        }catch (error) {
            console.log(error);
        }
    } else {
        const value = localStorage.getItem(birdName);
        let finalResults=[];
        if (value == null)
            return finalResults;
        else finalResults.push(value);
        return finalResults;
    }
}
window.getCachedData= getCachedData;