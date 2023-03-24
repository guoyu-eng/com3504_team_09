var express = require('express');

var router = express.Router();
const birdData = {};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'COM3504/6504 Lab Class', login_is_correct:true });
});


/* POST from form. */
router.post('/welcome', function(req, res, next) {
  var username= req.body.username;
  var password= req.body.password;


  if (username==='COM3504_6504'){
    res.render('welcome', { title: username,  login_is_correct:true });
  } else {
    res.render('index', { title: 'COM3504/6504', login_is_correct:false });
  }


});
//get the bird page
router.get('/bird', function(req, res, next) {
  res.render('bird', { title: 'birdData'});
});

//get the add picture  page
router.get('/add_picture', function(req, res, next) {
  res.render('add_picture', { title: 'add_picture'});
});



router.post('/bird', function(req, res, next) {
  var username= req.body.username;
  var name = req.body.name;
  var data = req.body.data;
  var category = req.body.category;

  var details = req.body.details;
  var location = req.body.location;
  // var photo = req.files.photo;


  let birdData_1 = {};
  birdData[name] = { name };
  birdData[data] = { data };
  birdData[details] = { details };
  birdData[location] = { location };


  if (username!== null){
    res.render('add_picture', { bird: birdData  });
  }

});

router.post('/add_picture', function(req, res, next) {
  var username= req.body.username;
  var category = req.body.category;
  var photos = req.body.photos;
  var details = req.body.details;

  if (username!== null){
    res.render('bird', { title: "" });
  }

});



router.post('/details', function(req, res, next) {
  var username= req.body.username;
  var category = req.body.category;
  var photos = req.body.photos;
  var details = req.body.details;

  if (username!== null){
    res.render('details', { title: "" });
  }

});


router.get('/details', function(req, res, next) {
  res.render('details', { title: 'details'});
});






// const express = require('express');
// const multer = require('multer');
// const app = express();
//
// // 存储上传的图片到 public/image 目录下
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/image')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// });
//
// const upload = multer({ storage: storage });
//
// // 处理表单提交的数据
// app.post('/upload', upload.single('photos'), function(req, res) {
//   // 这里可以添加一些额外的处理逻辑
//   res.send('上传成功');
// });



module.exports = router;
