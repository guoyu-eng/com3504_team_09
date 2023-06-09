const mongoose = require('mongoose');

const BirdSchema = new mongoose.Schema({
    name: { type: String, required: true, max: 10 },
    details: { type: String, required: true },
    inputImg: { type: String },
    date: { type: Date },
    userid: { type: String },
    content: { type: String },
    Nickname: { type: String,  max: 10, required: true},
    // location: { type: String, required: true },
    lat: { type: Number, required: false},
    lng: { type: Number},
    addr: { type: String }

});

const Bird = mongoose.model('Bird', BirdSchema);

module.exports = Bird;
