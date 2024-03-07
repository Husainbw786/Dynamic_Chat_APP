require('dotenv').config();

var mongoose = require('mongoose');

//mongoose.connect('mongodb+srv://husain:husain@todo.jrxtitu.mongodb.net/?retryWrites=true&w=majority&appName=todo');
// mongoose.connect('mongodb+srv://G1yomf2zJBcfKaai:G1yomf2zJBcfKaai@todo.jrxtitu.mongodb.net/?retryWrites=true&w=majority&appName=todo');
// const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', err => {
    console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

const app = require('express')();
const Chat = require('./models/ChatModel');

const http = require('http').Server(app);

const { user_route } = require('./routes/userRoute');

app.use('/', user_route);

const User = require('./models/UserModel');
const io = require('socket.io')(http);

var usp = io.of('/user-namespace');

usp.on('connection', async function (socket) {
    console.log('User Connected');

    var userId = socket.handshake.auth.token;
    await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: '1' } });

    // User Broadcast for status online/offline
    socket.broadcast.emit('getOnlineUser', { user_id: userId });

    socket.on('disconnect', async function () {
        console.log('user disconnected');
        var userId = socket.handshake.auth.token;
        await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: '0' } });

        // user braodcast offline status.
        socket.broadcast.emit('getOfflineUser', { user_id: userId });
    });

    // chatting showing to user profile
    socket.on('newChat',function(data){
        socket.broadcast.emit('loadNewChat',data);
    });

    // Load pervious Chat

    socket.on('existsChat',async function(data){
       var chats =  await Chat.find({ $or:[
            { sender_id : data.sender_id, receiver_id : data.receiver_id},
            { sender_id : data.receiver_id, receiver_id : data.sender_id},
        ] });

        socket.emit('loadChats',{ chats: chats });

    });

});


http.listen(3000, () => {
    console.log("server is running");
});
