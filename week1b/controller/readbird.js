// read bird information
var bodyParser = require("body-parser");
var Bird = require('../model/bird');
var path = require('path');

exports.getBirds = function (req, res) {
    console.log('getBirds called');
    Bird.findDistinctNames()
        .then(names => {
            console.log('Distinct bird names:', names);
            const birdPromises = names.map(name => {
                return Bird.findOne({ name: name.name }).sort({ date: -1 });
            });
            return Promise.all(birdPromises);
        })
        .then(birds => {
            console.log('Birds:', birds);
            res.render('index', { bird: birds });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error retrieving birds from database.');
        });
};
