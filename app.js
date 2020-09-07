const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const Logger = require("morgan");
const Mongoose = require("mongoose");
const Cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 5000;

const route_workplaces = require("./routes/workplaces.js");
const route_employees = require("./routes/employees.js");

var app = Express();

app.use(Cors());

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
Mongoose.Promise = Promise;

// LOGGER
app.use(Logger('dev'));

// ROUTES
app.use("/workplaces", route_workplaces);
app.use("/employees", route_employees);

let config;
if(process.env.NODE_ENV === "production") {
  app.use(Express.static("frontend/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
} else {
  config = require("./config");
}

Mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://admin:" + config.mongopw + "@cluster0-caapu.mongodb.net/db?retryWrites=true&w=majority", { useNewUrlParser: true });

// START SERVER
app.listen(PORT, () => {
  console.log("Server starting at PORT: " + PORT);
});

Mongoose.connection.on("connected", function() {
  console.log("Connected to database!");
});

Mongoose.connection.on("error", function(err) {
  console.log("Mongoose error " + err + " has occured.");
});

Mongoose.connection.on("disconnected", function() {
  console.log("Mongoose connection disconnected.");
});
