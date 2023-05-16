var express = require('express');
const mongoose = require('mongoose');
var birdModel = require('../controller/bird');
var readbird = require('../controller/readbird');
var multer = require('multer');
var router = express.Router();
var showindex = require('../controller/showindex');
const birdController = require('../controller/deleteBird');

const changeName = require('../controller/changeName');




const fs = require('fs');
const uploadDir = 'public/uploads/';

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
console.log('File upload middleware called');
var upload = multer({ storage: storage });


















/* GET home page. */

router.get('/', function(req, res, next) {
  readbird.getBirds(req, res);
  // res.render('index', { title: 'birdData'});
});




/* POST from form. */

router.get('/bird', function(req, res, next) {
  res.render('bird', { title: 'birdData'});
});

//get the add picture  page
router.get('/add_picture', function(req, res, next) {
  res.render('add_picture', { title: 'add_picture'});
});

// router.get('/details', function(req, res, next) {
//   res.render('details', { title: 'details'});
// });
const Bird = require('../model/bird');


router.get('/details', function(req, res) {
  const id = req.query.id;
  Bird.findOne({ _id: id }).exec()
      .then(bird => {
        res.render('details', { title: 'add_picture', bird: bird });
      })
      .catch(err => {
        throw err;
      });
});

// router.get('/some/route', function(req, res) {
//   // cacho
//   res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
//   res.set('Pragma', 'no-cache');
//   res.set('Expires', 0);
//
//   //
//   // ...
// });





// router.get('/add_picture', birdModel.listAll);
//

// router.post('/bird', upload.single('inputImg'), function(req, res) {
//   console.log(req);
//   birdModel.create(req,res);
//   readbird.getBirds(req,res);
// });

router.post('/bird', upload.single('inputImg'), function(req, res) {
  // analysis object and save to database. And check the uploaded files
  birdModel.create(req, res);
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


router.post('/change_name', changeName.changeName);



router.delete('/bird/delete', birdController.deleteBird);



module.exports = router;
