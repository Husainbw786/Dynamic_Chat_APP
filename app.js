require('dotenv').config();

var mongoose = require('mongoose');

//mongoose.connect('mongodb+srv://husain:husain@todo.jrxtitu.mongodb.net/?retryWrites=true&w=majority&appName=todo');
// mongoose.connect('mongodb+srv://G1yomf2zJBcfKaai:G1yomf2zJBcfKaai@todo.jrxtitu.mongodb.net/?retryWrites=true&w=majority&appName=todo');
// const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://G1yomf2zJBcfKaai:G1yomf2zJBcfKaai@todo.jrxtitu.mongodb.net/?retryWrites=true&w=majority&appName=todo', {
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

const app = require('express')()

const http = require('http').Server(app);

const { user_route } = require('./routes/userRoute');

app.use('/',user_route);

http.listen(3000,()=>{
    console.log("server is running");
});
