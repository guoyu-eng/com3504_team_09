// const image = require('../model/image');
var bodyParser = require("body-parser");
var Bird = require('../model/bird');
var path = require('path');
// var req = require('request');
var readbird = require('../controller/readbird');


exports.create = function (req, res) {
    const userData = req.body;
    const birdsave = new Bird({
        name: userData.name,
        details: userData.details,
        // dob: userData.year
        inputImg: req.file.path
    });


    birdsave.save()
        .then(savedCharacter => {
            const options = { async: true };
            const birdObject = savedCharacter.toObject();
            // res.send(JSON.stringify(birdsave));
            // console.log(birdObject);
            // res.render('add_picture', { bird: birdObject }, options);
            // res.redirect('add_picture');
            return readbird.getBirds(req, res);
        })
        // .then(function() {
        //     return readbird.getBirds(req, res);
        //     })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error saving  database.');
        });

    //
    // birdsave.save(function (err, results) {
    //     if (err)
    //         res.status(500).send('Invalid data!');
    //     //ntent-Type', 'application/json');
    //     // res.send(JSON.stringify(birdsave));
    //     res.json({bird: birdsave});
    //     res.render('add_picture', { birdsave: birdsave });
    // });


};

exports.listAll = function(req, res) {
    Bird.find({}, function(err, birds) {
        if (err) {
            console.log(err);
        } else {
            res.render('add_picture', { bird: birds });
        }
    });
};







