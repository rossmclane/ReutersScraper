var express = require("express");
var mongoose = require("mongoose");

// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/reutersScraper";
var MONGODB_URI = "mongodb://localhost/reutersScraper";
mongoose.connect(MONGODB_URI);

var app = express();
var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

app.listen(PORT, function() {
  console.log("App listening on http://localhost:" + PORT);
});
