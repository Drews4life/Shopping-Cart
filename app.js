const express = require("express");
const path = require("path");
const pages = require("./routes/pages");
const adminPages = require("./routes/adminPages");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressValidator = require("express-validator");

var app = express();
var port = process.env.PORT || 3000;


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length){
            formParam += "[" + namespace.shift() + "]";
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use("/", pages);
app.use("/admin/pages", adminPages);





app.listen(port, () => {
    console.log(`Up and running on port ${port}`);
})