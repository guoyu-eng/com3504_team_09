var express = require('express');
var router = express.Router();

//创建一个包含多个鸟的数组
var birds = [
    {name: "Sparrow", location: "Garden"},
    {name: "Pigeon", location: "City"},
    {name: "Eagle", location: "Mountains"}
];

//处理"/birds"路由的GET请求
router.get('details', function(req, res, next) {
    res.render('details', {birds: birds});
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

module.exports = router;
