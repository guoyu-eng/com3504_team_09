const mongoose = require('mongoose');

const BirdSchema = new mongoose.Schema({
    name: { type: String, required: true, max: 10 },
    details: { type: String, required: true },
    inputImg: { type: String },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    lat: { type: Number, required: false},
    lng: { type: Number},
    addr: { type: String, required: true}

});

const Bird = mongoose.model('Bird', BirdSchema);

module.exports = Bird;
