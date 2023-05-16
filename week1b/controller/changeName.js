// use to change the Name is user know the nickname when they create it
const Bird = require('../model/bird');
const birdController = require('./readbird');

exports.changeName = async function(req, res, next) {
    const newName = req.body.newName;
    const nickname = req.body.nickname;
    const changeid = req.body.changeid;

    console.log(newName)
    console.log(nickname)
    console.log(changeid)

    try {
        // check whether has this data
        const ObjectId = require('mongoose').Types.ObjectId;
        const bird = await Bird.findOne({ _id: new ObjectId(changeid) });
        console.log(bird);
        // if not go back directly
        if (!bird) {
            console.log(bird);
            return res.redirect('/');
        }
        // compare whether is has this
        const isValidNickname = bird.Nickname === nickname;
        if (!isValidNickname) {
            console.log(bird);
            return res.redirect('/');
        }
        // change the new name
        bird.name = newName;
        await bird.save();
        // change  successful
        // req.flash('success', 'Bird name successfully changed!');
        // res.redirect('/');
        res.redirect('/');
    } catch (err) {
        return next(err);
    }
};


