const server = require('http').createServer();
const io = require('socket.io')(server);

const Bird = require('../model/bird');




exports.init = function(io) {
    io.sockets.on('connection', function (socket) {
        console.log("try");
        try {
            /**
             * create or joins a room
             */
            console.log("服务器");
            socket.on('create or join', function (room, userId, defaultName, defaultDetails, defaultNickname) {
                socket.join(room);
                console.log(room, userId)
                io.sockets.to(room).emit('joined', room, userId);
                console.log("服务器1");

                Bird.find({ name: defaultName, details: defaultDetails, Nickname: defaultNickname }, 'userid content')
                    .exec()
                    .then(records => {
                        const chatHistory = records.map(record => `${record.userid}: ${record.content}`);
                        console.log("成功获取到的聊天记录:", chatHistory);
                        socket.emit('initialChatHistory', chatHistory);
                    })
                    .catch(error => {
                        console.error("从数据库获取聊天记录时出错:", error);
                    });





            });


            socket.on('chat', function (room, userId, chatText, defaultName, defaultDetails, defaultNickname) {
                io.sockets.to(room).emit('chat', room, userId, chatText);
                console.log("服务器2");
                console.log(room, userId, chatText);





                // 创建聊天记录对象并设置默认数据
                const chatRecord = new Bird({
                    userid: userId,
                    content: chatText,
                    name: defaultName,
                    details: defaultDetails,
                    Nickname: defaultNickname
                });

                chatRecord.save()
                    .then(savedRecord => {
                        console.log("聊天记录已保存到数据库:", savedRecord);
                    })
                    .catch(error => {
                        console.error("保存聊天记录时出错:", error);
                    });
            });

            socket.on('disconnect', function(){
                console.log('someone disconnected');
                console.log('问问我');
            });

            // 从数据库中获取聊天记录
            // Bird.find({}, 'content', function(err, records) {
            //     if (err) {
            //         console.error("从数据库获取聊天记录时出错:", err);
            //     } else {
            //         // 将聊天记录发送给客户端
            //         console.error("成功");
            //         socket.emit('initialChatHistory', records);
            //
            //         // 在这里执行其他操作，比如打印调试输出
            //         console.log("获取到的聊天记录:", records);
            //     }
            // });
            //


        } catch (e) {
        }
    });
}
