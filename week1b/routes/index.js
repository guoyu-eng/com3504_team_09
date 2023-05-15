var express = require('express');
const mongoose = require('mongoose');
var birdModel = require('../controller/bird');
var readbird = require('../controller/readbird');
var multer = require('multer');
var router = express.Router();


const fs = require('fs');
const uploadDir = 'D:\\Websotrm\\com3504_team_09\\week1b\\public\\uploads';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check if the upload directory exists, create it if necessary
    fs.stat(uploadDir, function(err, stats) {
      if (err) {
        console.log('Upload directory does not exist. Creating new directory...');
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    });
  },
  filename: function (req, file, cb) {
    var original = file.originalname;
    var file_extension = original.split(".");
    // Make the file name the date + the file extension
    filename =  Date.now() + '.' + file_extension[file_extension.length-1];
    cb(null, filename);
  }
});
var upload = multer({ storage: storage });

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/uploads/');
//   },
//   filename: function (req, file, cb) {
//     var original = file.originalname;
//     var file_extension = original.split(".");
//     // Make the file name the date + the file extension
//     filename =  Date.now() + '.' + file_extension[file_extension.length-1];
//     cb(null, filename);
//   }
// });
// var upload = multer({ storage: storage });

















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

// router.post('/bird', upload.single('inputImg'), function(req, res) {
//   console.log(req);
//   birdModel.create(req,res);
//   readbird.getBirds(req,res);
// });

router.post('/bird', upload.single('inputImg'), function(req, res) {
  birdModel.create(req, res);
  // readbird.getBirds(req, res);

  if (!req.file) {
    console.log('Error: no file uploaded');
    return res.status(400).send('Error: no file uploaded');
  }

  console.log(req.file);
});






router.post('/add_picture', function(req, res, next) {
  res.render('bird', { title: " " });
});

router.post('/details', function(req, res, next) {
  res.render('details', { title: "" });
});




module.exports = router;
