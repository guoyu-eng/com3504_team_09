const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    name: { type: String, required: true, max: 10 },
    details: { type: String, required: true },
    inputImg: { type: String },
    date: { type: Date },
    userid: { type: String },
    content: { type: String },
    Nickname: { type: String,  max: 10, required: true},


});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
