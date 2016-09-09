var express = require("express");
var app = express();
var morgan = require("morgan");
var mongoose = require("mongoose");
var bluebird = require("bluebird");
var port = process.env.PORT || 3000;
var bodyParser = require ("body-parser");
var routes = require("./config/routes");
var environment = app.get("env");
var databaseUri = require("./config/db")(environment);

mongoose.Promise = bluebird
mongoose.connect('mongodb://localhost/wdi-project-4');

if('test' !== environment) {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/api', routes);

app.listen(port, function() {
  console.log("Express is listening on port " + port);
});

// module.exports = app;