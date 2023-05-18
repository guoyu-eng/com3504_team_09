var express = require('express');
var router = express.Router();
var model = require('../model/bird');

router.post('/bird',function(req, res, next){
    var birds = {
        name: req.body.name,
        data: req.body.data,
        id: Date.now(),
    }
    model.connect(function(db){
        db.collection('birdAdd').insertOne(birds, function(err, ret){
            if(err){
                console.log("cannot do ", err)
                res.redirect('/index')
            }else{
                res.redirect('/index')
            }
        })
    })
})
module.exports = router;