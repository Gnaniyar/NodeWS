const http = require('http');
const express = require("express");
const bodyParser = require('body-parser');
const socketio = require("socket.io");

const port = 7000;
const app = express();
const appRouter = express.Router();

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    //res.setheader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Cache-Control');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get("/", function (req, res) {
    res.send("Express server response");
});

const server = http.createServer(app);
server.listen(port, () => {
    console.log('server is running on the port 7000');
});

const io = socketio.listen(server, { pingtimeout: 7000, pinginterval: 10000 });
io.set("transports", [ "websocket","xhr-polling", "polling", "htmlfile"]);


io.on("connection", function (socket) {
    console.log('Socket was connected to ' + socket.client.request.headers.origin);
    socket.emit("connection response", "Server connection established.");

    socket.on("check status count", function (data) {
        console.log("check status from:" + socket.client.request.headers.origin)
        io.emit("workflow status upate", data.result);
    });
});

