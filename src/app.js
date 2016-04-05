// import libraries
var path = require("path");
var express = require("express");
var compression = require("compression");
var favicon = require("serve-favicon");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var RedisStore = require("connect-redis")(session);
var url = require("url");
var csrf = require("csurf");
var socketio = require('socket.io');

var dbURL = process.env.MONGOLAB_URI || "mongodb://localhost/Chatterbox";

var db = mongoose.connect(dbURL, function(err) {
	if (err) {
		console.log("Could not connect to database");
		throw err;
	}
});

var redisURL = {
		hostname: "localhost",
		port: 6379
};

var redisPASS;

if(process.env.REDISCLOUD_URL) {
	redisURL = url.parse(process.env.REDISCLOUD_URL);
	redisPASS = redisURL.auth.split(":")[1];
}

// connect routes
var router = require("./router.js");
var port = process.env.PORT || process.env.NODE_PORT || 3000;

var app = express();
app.use("/assets", express.static(path.resolve(__dirname + "/../client/")));
app.use(compression());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	key: "sessionid",
	store: new RedisStore({
		host: redisURL.hostname,
		port: redisURL.port,
		pass: redisPASS
	}),
	secret: "Domo Arigato",
	resave: true,
	saveUninitialized: true,
	cookie: {
		httpOnly: true
	}
}));
app.set("view engine", "jade");
app.set("views", __dirname + "/views");
app.disable("x-powered-by");
app.use(cookieParser());

app.use(csrf());
app.use(function (err, req, res, next) {
	if (err.code !== 'EBADCSRFTOKEN') return next(err);
	
	return;
});

router(app);

app.listen(port, function(err) {
	if(err) {
		throw err;
	}
	console.log("Listening on port " + port);
});

// Code from chat homework
/*
var app = require('http').createServer(onRequest);
var fs = require('fs');
var socketio = require('socket.io');

var port = process.env.PORT || process.env.NODE_PORT || 3000;
app.listen(port);

// read the client html file into memory
// __dirname in node is the current directory
// in this case the same folder as the server js file
var index = fs.readFileSync(__dirname + '/../client/client.html');

function onRequest(request, response) {
	response.writeHead(200);
	response.write(index);
	response.end();
}

// pass in the http server into socketio and grab the websocket server as io
var io = socketio(app);

// object to hold all of our connected users
var users = {};

var onJoined = function(socket) {
	socket.on("join", function(data) {
		var joinMsg = {
			name: "server",
			msg: "There are " + Object.keys(users).length + " users online."
		};
		
		socket.emit("msg", joinMsg);
		socket.name = data.name;
		
		socket.join("room1");
		
		socket.broadcast.to("room1").emit("msg", {
			name: "server",
			msg: data.name + " has joined the room."
		});
		
		socket.emit("msg", {
			name: "server",
			msg: "You joined the room."
		});

		// Append new user to the users object
		users[socket.id] = data.name;
	});
};

var onUsernameChange = function(socket) {
	socket.on("usernameChange", function(data) {
		io.sockets.in("room1").emit("msg", {
			name: "server",
			msg: data.name + " has changed their name to " + data.newname + "."
		});

		// Update users object to reflect name change.
		users[socket.id] = data.newname;

		// Update socket name.
		socket.name = data.newname;
	});
};

var onMsg = function(socket) {
	socket.on("msgToServer", function(data) {
		io.sockets.in("room1").emit("msg", {
			name: socket.name,
			msg: data.msg
		});
	});
};

var onAction = function(socket) {
	socket.on("action", function(data) {
		io.sockets.in("room1").emit("msg", {
			name: "server",
			msg: data.name + " " + data.action + "."
		});
	});
};

var onRoll = function(socket) {
	socket.on("roll", function(data) {
		io.sockets.in("room1").emit("msg", {
			name: "server",
			msg: data.name + " rolled a " + Math.ceil((Math.random() * 10) % 6) + " on a six-sided die."
		});
	});
};

var onDisconnect = function(socket) {
	socket.on("disconnect", function(data) {
		// Remove user from users object.
		delete users[socket.id];

		socket.broadcast.to("room1").emit("msg", {
			name: "server",
			msg: socket.name + " has left the room."
		});

		var leaveMsg = {
			name: "server",
			msg: "There are " + Object.keys(users).length + " users online."
		};
		
		socket.broadcast.to("room1").emit("msg", leaveMsg);
	});
};

io.sockets.on("connection", function(socket) {
		onJoined(socket);
		onMsg(socket);
		onDisconnect(socket);
		onUsernameChange(socket);
		onAction(socket);
		onRoll(socket);
});

console.log("websocket server started");*/