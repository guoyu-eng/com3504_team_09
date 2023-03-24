var express = require('express');
var router = express.Router();

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
module.exports = router;
