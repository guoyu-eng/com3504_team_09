var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BirdSchema = new Schema({
    name: { type: String, required: true,max :10 },
    details: { type: String, required: true },
    inputImg: { type: String }

});

// const ImageSchema = new Schema({
//     birdInformation: { type: BirdSchema, required: true },
//     // other fields in the schema
// });

var Bird = mongoose.model('Bird', BirdSchema);

module.exports = Bird;







