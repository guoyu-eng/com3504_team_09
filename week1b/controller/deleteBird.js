const Bird = require('../model/bird');
const fs = require('fs');
// import the model and module

exports.deleteBird = function (req, res) {
    // console.log('deleteBird controller is called!');
    console.log(req.params)
    console.log(req.params)

    const birdId = req.params.id;
    console.log('birdId:', birdId);

    Bird.findById(birdId, function(err, bird) {
        if (err) {
            console.log(err);
            return res.status(500).send('An error occurred while deleting the bird.');
        }

        if (!bird) {
            return res.status(404).send('Bird not found.');
        }

        console.log('bird:', bird);

        // 如果有相关的图像文件，从服务器上删除
        if (bird.inputImg) {
            console.log('deleting image:', bird.inputImg);
            fs.unlink(`public${bird.inputImg}`, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        }

        bird.remove(function(err) {
            if (err) {
                console.log(err);
                return res.status(500).send('An error occurred while deleting the bird.');
            }

            console.log('Bird deleted successfully.');
            return res.redirect('/'); // 删除成功后重定向到主页
        });
    });
}
