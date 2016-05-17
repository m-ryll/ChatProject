// Include necessary directories.
var controllers = require("./controllers");
var middleware = require("./middleware");

var router = function(app) {
	// Route page rendering functions.
	app.get("/", middleware.reqLogOut, controllers.Account.renderSignup);
	app.get("/login", middleware.reqLogOut, controllers.Account.renderLogin);
	app.get("/signup", middleware.reqLogOut, controllers.Account.renderSignup);
	app.get("/account", middleware.reqLogIn, controllers.Account.renderAccount);
	app.get("/about", middleware.reqLogIn, controllers.Account.renderAbout);
	app.get("/app/:id", middleware.reqLogIn, controllers.Account.renderChat);
	app.get("/app", middleware.reqLogIn, controllers.Account.renderChat);
	app.get("/user/:username", middleware.reqLogIn, controllers.Account.renderUser);

	// Route chat functions.
	app.post("/addchat", middleware.reqLogIn, controllers.Chat.addChat);
	app.post("/addcontact", middleware.reqLogIn, controllers.Account.addContact);
	app.post("/addmessage/:id", middleware.reqLogIn, controllers.Message.addMessage);

	// Route session and account functions.
	app.post("/updateaccount", middleware.reqLogIn, controllers.Account.updateaccount);
	app.get("/logout", middleware.reqLogIn, controllers.Account.logout);
	app.post("/login", middleware.reqLogOut, controllers.Account.login);
	app.post("/signup", middleware.reqLogOut, controllers.Account.signup);
};

module.exports = router;