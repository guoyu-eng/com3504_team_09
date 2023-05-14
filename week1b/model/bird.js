const mongoose = require('mongoose');

const BirdSchema = new mongoose.Schema({
    name: { type: String, required: true, max: 10 },
    details: { type: String, required: true },
    inputImg: { type: String },
    // date: { type: Date, required: true },
    Nickname: { type: String,  max: 10 },
    location: { type: String, required: true }




});

BirdSchema.statics.findDistinctNames = function() {
    return this.aggregate([
        { $group: { _id: "$name" } },
        { $project: { _id: 0, name: "$_id" } }
    ]);
};



const Bird = mongoose.model('Bird', BirdSchema);

module.exports = Bird;
