var express = require('express');
var router = express.Router();
var model = require('../model/bird');





router.post('/bird',function(req, res, next){
    var birds = {
        name : req.body.name,
        data : req.body.data,
        id: Date.now(),
        lat : req.body.lat,
        lng : req.body.lng,
        //address: req.body.addr

    }
    model.connect(function(db){
        db.collection('birdAdd').insertOne(birds,function(err,ret){
            console.log(birds);
            debugger;
            if(err){
                console.log("cannot do ",err)
                res.redirect('/bird')
            }else{
                res.redirect('/add_picture')
            }
        })
    })


})



module.exports = router;
