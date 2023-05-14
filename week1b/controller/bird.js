// const image = require('../model/image');
var bodyParser = require("body-parser");
var Bird = require('../model/bird');
var path = require('path');
// var req = require('request');
var readbird = require('../controller/readbird');
const fs = require('fs');





exports.create = function (req, res) {
    console.log(req.file)


    delete res.locals.bird;
    const userData = req.body
    let trimmmedImgFilePath = req.file.path.substring(7)
    // console.log(userData);

    // console.log("", userData.date);
    // console.log("", new Date(userData.date));

    const date1 = new Date(userData.date);
    const date2 = date1.toISOString();


    const birdsave = new Bird({
        name: userData.name,
        details: userData.details,
        date: userData.date2,
        Nickname : userData.Nickname,
        location: userData.location,
        inputImg: trimmmedImgFilePath
    });
    // console.log("");
    //
    // console.log(birdsave);

    // console.log("Input image path:", req.file.path);

    birdsave.save()
        .then(savedBird => {
            const options = { async: true };
            const birdObject = savedBird.toObject();
            // console.log('Saved bird:', savedBird.toObject());
            // console.log('Date:', savedBird.date);

            return readbird.getBirds(req, res);
        })
        .then(() => {
            // do something else after getBirds has finished

        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error saving  database.');
        });
};






