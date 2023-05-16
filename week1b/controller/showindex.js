const Bird = require('../model/bird');

exports.showBirds = async function(req, res, next) {
    try {
        const birds = await Bird.find().exec();
        res.render('index', { title: 'bird Class', birds: birds });
    } catch (err) {
        return next(err);
    }
}

