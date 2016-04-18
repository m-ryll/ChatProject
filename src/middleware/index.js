// If the user is not logged in, redirect to the homepage.
var reqLogIn = function(req, res, next) {
	if(!req.session.account) {
		return res.redirect("/");
	}
	next();
};

// If the user is logged in, redirect to the main app page.
var reqLogOut = function(req, res, next) {
	if(req.session.account) {
		return res.redirect("/app");
	}
	next();
};

// Export the middleware functions to be used with the router.
module.exports.reqLogIn = reqLogIn;
module.exports.reqLogOut = reqLogOut;