const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/drewsDB");

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB succesfully");
});

module.exports = {mongoose};