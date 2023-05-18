/**

 Create a new bird entry in the database based on the provided user data.
 @param {Object} req - The request object.
 @param {Object} res - The response object.
 @returns {void}
 @throws {Error} If an error occurs while executing the function.
 */

var bodyParser = require("body-parser");
var Bird = require('../model/bird');
var path = require('path');
var readbird = require('../controller/readbird');
const fs = require('fs');


exports.create = function (req, res) {
    delete res.locals.bird;
    const userData = req.body
    let trimmmedImgFilePath = req.file.path.substring(7)
    const date1 = new Date(userData.date);
    const birdsave = new Bird({
        name: userData.name,
        details: userData.details,
        date: date1,
        Nickname : userData.Nickname,
        inputImg: trimmmedImgFilePath,
        lat: userData.lat,
        lng: userData.lng,
        addr: userData.addr
    });


    birdsave.save()
        .then(savedBird => {
            const options = { async: true };
            const birdObject = savedBird.toObject();
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
