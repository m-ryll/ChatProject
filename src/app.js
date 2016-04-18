// Include NPM packages.
var path = require("path");
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server); // Including socket.io for later use in final project.
var compression = require("compression");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var redis = require("connect-redis")(session);
var url = require("url");

// Set up Mongoose.
var dbURL = process.env.MONGODB_URI || "mongodb://localhost/Chatterbox";
var db = mongoose.connect(dbURL, function(err) {
	if (err) {
		console.log("Could not connect to database");
		throw err;
	}
});

// Set up Redis.
var redisURL = {
		hostname: "localhost",
		port: 6379
};
var redisPASS;
if(process.env.REDISCLOUD_URL) {
	redisURL = url.parse(process.env.REDISCLOUD_URL);
	redisPASS = redisURL.auth.split(":")[1];
}

// Connect routes.
var router = require("./router.js");
var port = process.env.PORT || process.env.NODE_PORT || 3000;

app.use("/assets", express.static(path.resolve(__dirname + "/../client/")));
app.use(compression());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	key: "id",
	store: new redis({
		host: redisURL.hostname,
		port: redisURL.port,
		pass: redisPASS
	}),
	secret: "secret",
	resave: true,
	saveUninitialized: true
}));
app.set("view engine", "jade");
app.set("views", __dirname + "/views");
app.disable("x-powered-by");
app.use(cookieParser());

router(app);

server.listen(port, function(err) {
	if(err) {
		throw err;
	}
	console.log("Listening on port " + port);
});