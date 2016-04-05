var controllers = require("./controllers");

var router = function(app) {
	app.get("/login", controllers.Account.loginPage);
	app.post("/login", controllers.Account.login);
	app.get("/signup", controllers.Account.signupPage);
	app.post("/signup", controllers.Account.signup);
	app.get("/app", controllers.Account.chatPage);
	app.get("/", controllers.Account.signupPage);
};

module.exports = router;