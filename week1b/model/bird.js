const mongoose = require('mongoose');

const BirdSchema = new mongoose.Schema({
    name: { type: String, required: true, max: 10 },
    details: { type: String, required: true },
    inputImg: { type: String }
});

const Bird = mongoose.model('Bird', BirdSchema);

module.exports = Bird;
