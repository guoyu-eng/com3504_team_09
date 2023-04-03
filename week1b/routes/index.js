var express = require('express');
const mongoose = require('mongoose');
var birdModel = require('../controller/bird');
var readbird = require('../controller/readbird');


var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'bird Class', login_is_correct:true });
});


/* POST from form. */

router.get('/bird', function(req, res, next) {
  res.render('bird', { title: 'birdData'});
});

//get the add picture  page
router.get('/add_picture', function(req, res, next) {
  res.render('add_picture', { title: 'add_picture'});
});

router.get('/details', function(req, res, next) {
  res.render('details', { title: 'details'});
});


// router.get('/add_picture', birdModel.listAll);
//

router.post('/bird', function(req, res, next) {
  birdModel.create(req,res);
  readbird.getBirds(req,res);
});

router.post('/add_picture', function(req, res, next) {
  res.render('bird', { title: " " });
});

router.post('/details', function(req, res, next) {
  res.render('details', { title: "" });
});




module.exports = router;
