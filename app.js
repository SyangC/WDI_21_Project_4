var express = require("express");
var app = express();
var morgan = require("morgan");
var mongoose = require("mongoose");
var bluebird = require("bluebird");
var cors = require("cors");
var port = process.env.PORT || 3000;
var bodyParser = require ("body-parser");
var routes = require("./config/routes");
var environment = app.get("env");
var databaseUri = require("./config/db")(environment);
var unirest = require('unirest');

mongoose.Promise = bluebird
mongoose.connect(databaseUri);

if('test' !== environment) {
  app.use(morgan('dev'));
}

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/api', routes);

// app.all("/api/*", function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
//     return next();
// });

var server = app.listen(port, function() {
  console.log("Express is running... away!");
});

var io = require("socket.io").listen(server);

io.on("connection", function(socket) {
  console.log("Connected to socket with id: " + socket.id);

  socket.on("message", function(message) {
    console.log("Message as follows: " + message)
    io.sockets.emit("message", message);
  })
})

module.exports = app;