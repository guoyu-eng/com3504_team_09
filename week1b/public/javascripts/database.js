////////////////// DATABASE //////////////////
// the database receives from the server the following structure
import * as idb from './idb/index.js';

/** class BirdWatchinig{
 *  constructor (name, details, inputImg, lat, lnt, addr) {
 *    this.name = name;
 *    this.details = details;
 *    this.inputImg = inputImg;
 *    this.lat = lat;
 *    this.lnt = lnt;
 *    this.addr = addr;
 *  }
 *}
 */

/** class chatRoom{
 *  constructor (name, details, inputImg, date, userid, content, Nickname) {
 *    this.name = name;
 *    this.details = details;
 *    this.inputImg = inputImg;
 *    this.date = date;
 *    this.userid = userid;
 *    this.content= content;
 *    this.Nickname = Nickname;
 *  }
 *}
 */

let db;

const BIRD_DB_NAME= 'db_bird_1';
const BIRD_STORE_NAME= 'store_birds';
const CHAT_ROOM_NAME = 'chats';

/**
 * it inits the database
 */
async function initDatabase(){
    if (!db) {
        db = await idb.openDB(BIRD_DB_NAME, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(BIRD_STORE_NAME) && !upgradeDb.objectStoreNames.contains(CHAT_ROOM_NAME)) {
                    let birdDB = upgradeDb.createObjectStore(BIRD_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    birdDB.createIndex('name', 'name', {unique: false, multiEntry: true});

                    let chatDB = upgradeDb.createObjectStore(CHAT_ROOM_NAME, {
                        keyPath: 'id',
                        autoIncrement: false
                    });
                    chatDB.createIndex('chat', 'chatID', {unique: false});
                }
            }
        });
        console.log('db created');
    }
}
window.initDatabase= initDatabase;

/**
 * it saves the sighting of bird in localStorage
 * @param name
 * @param details
 * @param inputImg
 * @param lat
 * @param lng
 * @param latlng
 */
async function storeCachedData(name, details, inputImg, lat, lng, latlng) {
    console.log('inserting: ');
    if (!db)
        console.log('await...')
    await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(BIRD_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(BIRD_STORE_NAME);
            await store.put({
                name: name,
                details: details,
                inputImg: inputImg,
                lat: lat,
                lng: lng,
                latlng: latlng
            });
            await  tx.complete;
            console.log('added item to the store! ');
        } catch(error) {
            console.log(error);
        };
    }
}

window.storeCachedData=storeCachedData;

/**
 * it saves the chat comments of a sighting in localStorage
 * @param name
 * @param details
 * @param inputImg
 * @param date
 * @param userid
 * @param content
 * @param Nickname
 */
async function storeCachedChat(name, details, inputImg, date, userid, content, Nickname){
    console.log('inserting: ');
    if (!db)
        console.log('await...')
    await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(CHAT_ROOM_NAME, 'readwrite');
            let store = await tx.objectStore(CHAT_ROOM_NAME);
            await store.put({
                name: name,
                details: details,
                inputImg: inputImg,
                date: date,
                uerid: userid,
                content: content,
                Nickname: Nickname
            });
            await  tx.complete;
            console.log('added item to the chat db! ');
        } catch(error) {
            console.log(error);
        };
    }
}

window.storeCachedChat = storeCachedChat;



/**
 * it retrieves the sighting for a bird from the database
 * @param birdName
 * @returns {*}
 */
async function getCachedBirdData(birdName) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            console.log('fetching: ' + birdName);
            let tx = await db.transaction(BIRD_STORE_NAME, 'readonly');
            let store = await tx.objectStore(BIRD_STORE_NAME);
            let index = await store.index('name');

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
window.getCachedBirdData = getCachedBirdData;

/**
 * it retrieves the chat comments for a sighting from the database
 * @param chatID
 * @returns {*}
 */
async function getCachedChatData    (chatID) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            console.log('fetching: ' + chatID);
            let tx = await db.transaction(CHAT_ROOM_NAME, 'readonly');
            let store = await tx.objectStore(CHAT_ROOM_NAME);
            let index = await store.index('name');

            await tx.complete;
        }catch (error) {
            console.log(error);
        }
    } else {
        const value = localStorage.getItem(chatID);
        let finalResults=[];
        if (value == null)
            return finalResults;
        else finalResults.push(value);
        return finalResults;
    }
}
window.getCachedChatData = getCachedChatData;