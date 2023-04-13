// const image = require('../model/image');
var bodyParser = require("body-parser");
//var req = require('request');
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
                    res.render('add_picture', { bird: birds });
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
