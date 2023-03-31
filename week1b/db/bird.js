var MongoClient = require("mongodb").MongoClient;
let mongoose = require('mongoose');

let mongoDB = 'mongodb://127.0.0.1:27017/com3504Bird)';


mongoose.Promise = global.Promise;

try {
    connection = mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        checkServerIdentity: false,
    });
    console.log('connection to mongodb worked!');

// db.dropDatabase();

} catch (e) {
    console.log('error in db connection: ' + e.message);
}

