/**

 Get all unique birds from the Bird model, group them by name and replace the root with the first element.
 Then delete all the documents in the collection and insert the new bird documents.
 Finally, render the 'index' view with the bird data.used to deal with the image
 @param {Object} req - The HTTP request object.
 @param {Object} res - The HTTP response object.
 @returns {undefined}
 @throws {Error} If there is an error retrieving birds from the database.
 */
var bodyParser = require("body-parser");
var Bird = require('../model/bird');
var path = require('path');


exports.getBirds = (req, res) => {
    Bird.aggregate([
        { $group: { _id: "$name", bird: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$bird" } }
    ])
        .then(birds => {
            Bird.deleteMany({})
                .then(() => {
                    // delect the coche
                    return Bird.insertMany(birds);
                })
                .then(() => {
                    res.render('index', { bird: birds });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send('Error retrieving birds from database.');
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error retrieving birds from database.');
        });
};

