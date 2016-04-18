var models = require("../models");
var Account = models.Account;

// Render all pages.
var renderLogin = function(req, res) {
	res.render("login");
};
var renderSignup = function(req, res) {
	res.render("signup");
};
var renderAbout = function(req, res) {
	res.render("about");
};
var renderAccount = function(req, res) {
	Account.AccountModel.findByUsername(req.session.account.username, function(err, doc) {
		if(err)
		{
			return callback(err);
		}
        if(!doc) {
            return callback();
        }

		res.render("account", {usn: req.session.account.username, b: doc.bio});
	});
};
var renderChat = function(req, res) {
	res.render("app");
};

var login = function(req, res) {
	if(!req.body.username || !req.body.password) {
		return res.status(400).json({error: "All fields required"});
	}

	Account.AccountModel.authenticate(req.body.username, req.body.password, function(err, account) {
		if(err || !account) {
			return res.status(401).json({error: "Wrong username or password"});
		}

		req.session.account = account.toAPI();

		res.json({redirect: "/app"});
	});
};

var signup = function(req, res) {
	if(!req.body.username || !req.body.password || !req.body.password2) {
		return res.status(400).json({error: "All fields required."});
	}

	if(req.body.password !== req.body.password2) {
		return res.status(400).json({error: "Passwords do not match."});
	}

	Account.AccountModel.generateHash(req.body.password, function(salt, hash) {
		var accountData = {
			username: req.body.username,
			salt: salt,
			password: hash
		};

		var newAccount = new Account.AccountModel(accountData);

		newAccount.save(function(err) {
			if(err) {
				console.log(err);
				return res.status(400).json({error:"An error occurred"});
			}

			req.session.account = newAccount.toAPI();

			res.json({redirect: "/app"});
		});
	});
};

// Updates or sets the user's bio.
var updateaccount = function(req, res) {
	if(!req.body.bio) {
		return;
	}

	Account.AccountModel.findByUsername(req.session.account.username, function(err, doc) {
		if(err)
		{
			return callback(err);
		}
        if(!doc) {
            return callback();
        }
        var user = doc;
        user.bio = req.body.bio;

        user.save(function(err) {
        	if(err) {
        		console.log(err);
        		return res.status(400).json({error: "An error occurred"});
        	}
        });
	});
};
 
// Ends the user session and redirects to the app's home page.
var logout = function(req, res) {
	req.session.destroy();
	res.redirect("/");
};

// Export all functions.
module.exports.renderLogin = renderLogin;
module.exports.renderSignup = renderSignup;
module.exports.renderAccount = renderAccount;
module.exports.renderAbout = renderAbout;
module.exports.renderChat = renderChat;
module.exports.updateaccount = updateaccount;
module.exports.login = login;
module.exports.signup = signup;
module.exports.logout = logout;