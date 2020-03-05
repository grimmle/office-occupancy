const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const Logger = require("morgan");
const Mongoose = require("mongoose");
const Cors = require("cors");
const path = require("path");

const DATABASE_NAME = "occupation";
const PORT = process.env.PORT || 5000;

const route_workplaces = require("./routes/workplaces.js");
const route_employees = require("./routes/employees.js");

var app = Express();

// app.use(function(req,res) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
// })

app.use(Cors());

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
Mongoose.Promise = Promise;

// LOGGER
app.use(Logger('dev'));

// ROUTES
app.use("/workplaces", route_workplaces);
app.use("/employees", route_employees);

if(process.env.NODE_ENV === "production") {
  app.use(Express.static("frontend/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
}

// START SERVER
app.listen(PORT, () => {
  Mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017", function(err, db) {
    if(!err) console.log("Connection successful!")
    else throw err
  })
});

Mongoose.connection.on("connected", function() {
  console.log("Connected to '" + DATABASE_NAME + "'!");
});

Mongoose.connection.on("error", function(err) {
  console.log("Mongoose error "+err+" has occured.");
});

Mongoose.connection.on("disconnected", function() {
  console.log("Mongoose connection disconnected.");
});
