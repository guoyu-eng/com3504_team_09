/**
 * The main script for the chat application.
 */


let name = null;
let roomNo = null;
let socket = io();

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';

    let historyDisplayed = false;

    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            hideLoginInterface(room, userId);
        } else {
            // notifies that someone has joined the room
            writeOnHistory('<b>'+userId+'</b>' + ' joined room ' + room);

        }
    });
    // called when a message is received
    socket.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnHistory('<b>' + who + ':</b> ' + chatText);
    });


    // called when initial chat history is received from the server
    socket.on('initialChatHistory', function (records) {
        if (!historyDisplayed) {
            var historyDiv = document.getElementById('history');
            records.forEach(function (record) {
                var chatItem = document.createElement('div');
                chatItem.textContent = record;
                historyDiv.appendChild(chatItem);
            });
            historyDisplayed = true;
        }
        var chatInterface = document.getElementById('chat_interface');
        chatInterface.style.display = 'block';
    });
}

/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    roomNo = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomNo;
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    let default_details = document.getElementById('default_details').value;
    let default_name = document.getElementById('default_name').value;
    let defaultNickname = document.getElementById('default_Nickname').value;

    console.log("Name:", name);
    console.log("Room No:", roomNo);
    socket.emit('chat', roomNo, name, chatText,default_name,default_details,defaultNickname);
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {

    roomNo = document.getElementById('roomNo').value;
    name = document.getElementById('name').value;

    let default_details = document.getElementById('default_details').value;
    let default_name = document.getElementById('default_name').value;
    let defaultNickname = document.getElementById('default_Nickname').value;

    console.log(roomNo, name)
    if (!name) name = 'Unknown-' + Math.random();
    socket.emit('create or join', roomNo, name, default_name,default_details,defaultNickname);
}

/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    // document.getElementById('who_you_are').innerHTML= userId;
    // document.getElementById('in_room').innerHTML= ' '+room;
}



