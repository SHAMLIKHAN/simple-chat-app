var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var EndToEndChat = mongoose.model('EndToEndChat', {
    name : String,
    message : String
});

var url = 'mongodb://localhost:27017/chat-app';

app.get('/messages', (req, res) => {
    EndToEndChat.find({}, (err, messages) => {
        if (err) {
            res.sendStatus(500);
        }
        res.send(messages);
    });
});

app.get('/messages/:user', (req, res) => {
    var user = req.params.user;
    Message.find({name: user}, (err, messages) => {
        if (err) {
            res.sendStatus(500);
        }
        res.send(messages);
    });
});

app.post('/messages', async (req, res) => {
    try {
        var message = new EndToEndChat(req.body);
        // var savedMessage = await message.save();
        // console.log(savedMessage);
        // var censored = await EndToEndChat.findOne({message:'some_kind_of_bad_word'});
        // console.log(censored);
        // if (censored) {
        //     var deletedMessage = await EndToEndChat.deleteOne({_id: censored.id});
        //     console.log(deletedMessage);
        // }
        // else {
        //     io.emit('message', req.body);
        // }
        await message.save();
        io.emit('message', req.body);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
        return console.log("Error : ", err);
    } finally {
        console.log('Message Posted!');
    }
});

io.on('connection', () => {
    console.log('A user is connected!');
});

mongoose.connect(url, (err) => {
    if (!err) {
        console.log('Connected to mongodb!');
    } else {
        console.log('Failed to connect mongodb!');
    }
});

var server = http.listen(3000, () => {
    console.log('Server is running on port ', server.address().port);
});