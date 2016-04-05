var models = require("../models");

var Account = models.Account;

var loginPage = function(req, res) {
	res.render("login");
};

var signupPage = function(req, res) {
	res.render("signup");
};

var logout = function(req, res) {
	req.session.destroy();
	res.redirect("/");
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

	Account.AccountModel.generateHash(req.body.pass, function(salt, hash) {
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

var chatPage = function(req, res) {
	res.render("app");
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.chatPage = chatPage;