/**

 Controller method to show all birds from the database and show that in the index page
 @param req HTTP request object
 @param res HTTP response object
 @param next Next middleware function
 @return a Promise representing the asynchronous operation
 @throws any error that occurred while executing the operation
 */
const Bird = require('../model/bird');

exports.showBirds = async function(req, res, next) {
    try {
        const birds = await Bird.find().exec();
        res.render('index', { title: 'bird Class', birds: birds });
    } catch (err) {
        return next(err);
    }
}

