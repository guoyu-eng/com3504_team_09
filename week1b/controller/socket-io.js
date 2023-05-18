/**
 * This module initializes the socket.io server and handles socket connections for chat functionality.
 * It allows creating or joining rooms, sending and receiving chat messages, and saving chat history.
 */

const server = require('http').createServer();
const io = require('socket.io')(server);
const Bird = require('../model/bird');
const Chat = require('../model/chat');
exports.init = function(io) {
    io.sockets.on('connection', function (socket) {
        console.log("try");
        try {
            /**
             * create or joins a room
             */

            socket.on('create or join', function (room, userId, defaultName, defaultDetails, defaultNickname) {
                socket.join(room);
                console.log(room, userId)
                io.sockets.to(room).emit('joined', room, userId);


                Chat.find({ name: defaultName, details: defaultDetails, Nickname: defaultNickname }, 'userid content')
                    .exec()
                    .then(records => {
                        const chatHistory = records.map(record => `${record.userid}: ${record.content}`);

                        socket.emit('initialChatHistory', chatHistory);
                    })
                    .catch(error => {

                    });
            });

            socket.on('chat', function (room, userId, chatText, defaultName, defaultDetails, defaultNickname) {
                io.sockets.to(room).emit('chat', room, userId, chatText);
                //set the defalut data
                const chatRecord = new Chat({
                    userid: userId,
                    content: chatText,
                    name: defaultName,
                    details: defaultDetails,
                    Nickname: defaultNickname
                });

                chatRecord.save()
                    .then(savedRecord => {
                        console.log("savedRecord:", savedRecord);
                    })
                    .catch(error => {
                        console.error("error:", error);
                    });
            });
            socket.on('disconnect', function(){
                console.log('someone disconnected');
            });
        } catch (e) {
        }
    });
}
