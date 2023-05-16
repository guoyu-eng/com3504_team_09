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
    birdsave.save()
        .then(savedBird => {
            const options = { async: true };
            const birdObject = savedBird.toObject();
            return readbird.getBirds(req, res);
        })
        .then(() => {
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error saving  database.');
        });
};






