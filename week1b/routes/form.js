var express = require('express');
var router = express.Router();
var model = require('../model/bird');

/* GET home page. */
router.get('/form', function(req, res, next) {
    res.render('form', { title: 'Bird' });
});


/**
 *  POST the data about the weather.
 *  parameters in body:
 *    location: a City Id
 *    date: a date
 */
router.post('/bird', function(req, res, next) {
    const birdData = req.body
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(birdData));

});

router.get('/form', function(req, res, next) {
    res.render('form', { title: 'Bird' });
});


const CLOUDY= 0;
const CLEAR=1;
const RAINY=2;
const OVERCAST=3;
const SNOWY=4;

/**
 *
 * @param location
 * @param forecast (cloudy, etc.)
 * @param temperature
 * @param wind
 * @param precipitation
 * @constructor
 */
class Bird {
    constructor (name, details, inputImg, lat, lng, addr) {
        this.name = name;
        this.details = details;
        this.inputImg = inputImg;
        this.lat = lat;
        this.lng = lng;
        this.addr = addr;
    }
}


module.exports = router;
