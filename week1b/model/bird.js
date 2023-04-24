var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BirdSchema = new Schema({
    name: { type: String, required: true,max :10 },
    details: { type: String, required: true },
    inputImg: { type: String },
    lat: { type: Number, required: false},
    lng: { type: Number},
    addr: { type: String, required: true}

});

// const ImageSchema = new Schema({
//     birdInformation: { type: BirdSchema, required: true },
//     // other fields in the schema
// });

var Bird = mongoose.model('Bird', BirdSchema);

module.exports = Bird;







