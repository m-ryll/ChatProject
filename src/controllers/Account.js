var models = require("../models");
var Account = models.Account;
var Chat = models.Chat;
var Message = models.Message;

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

// Render the account page.
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

// Render the user page.
var renderUser = function(req, res) {
	// Find id by username.
	Account.AccountModel.findByUsername(req.session.account.username, function(err, doc) {
		if(err) {
			console.log(err);
		}
        if(!doc) {
            return res.status(400).json({error: "User does not exist"});
        }
        // Find the chats associated with this user's id to display on the sidebar.
        Chat.ChatModel.findByUser(doc.id, function(err, docs) {
			if(err) {
				console.log(err);
				return res.status(400).json({error: "Couldn't find chats"});
			}

			Account.AccountModel.findByUsername(req.params.username, function(err, u) {
				if(err)
				{
					return callback(err);
				}
		        if(!doc) {
		            return callback();
		        }

				res.render("user", {chats:docs, contacts:doc.contacts, currentuser:req.session.account.username, user: u});
			});
		});
	});
}

// Render the chat page.
var renderChat = function(req, res) {
	// Find id by username so we can query chats.
	Account.AccountModel.findByUsername(req.session.account.username, function(err, doc) {
		if(err) {
			console.log(err);
		}
        if(!doc) {
            return res.status(400).json({error: "User does not exist"});
        }
        // Find the chats associated with this user's id to display on the sidebar.
        Chat.ChatModel.findByUser(doc.id, function(err, docs) {
			if(err) {
				console.log(err);
				return res.status(400).json({error: "Couldn't find chats"});
			}

			if (req.params.id) {
				// Finally, get the messages for the chat if there's one selected!
				Message.MessageModel.findByChat(req.params.id, function(err, msgs) {
					if(err) {
						console.log(err);
						return res.status(400).json({error: "Couldn't find messages"});
					}

					// Render it all.
					res.render("app", {chats:docs, contacts:doc.contacts, currentuser: req.session.account.username, messages:msgs});
				});
			} else if(req.params.username) {
				Account.AccountModel.findByUsername(req.params.username, function(err, doc) {
					if(err)
					{
						return callback(err);
					}
			        if(!doc) {
			            return callback();
			        }

					res.render("app", {chats:docs, contacts:doc.contacts, currentuser:req.session.account.username, user: doc});
				});
			} else {
				res.render("app", {chats:docs, contacts:doc.contacts, currentuser: req.session.account.username});
			}
		});
	});
};

// Execute login.
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

// Execute signup.
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

// Adds a contact.
var addcontact = function(req, res) {
	if (!req.body.username) {
		return res.status(400).json({error: "Username required"});
	}

	Account.AccountModel.findByUsername(req.session.account.username, function(err, doc) {
		if(err)
		{
			console.log(err);
			return res.status(400).json({error: "An error occurred"});
		}
		if(!doc) {
            return res.status(400).json({error: "An error occurred"});
        }

        var user = doc;

        // Check to make sure contact isn't already on contact list.
        for (var i = 0; i < user.contacts.length; i++) {
        	if (user.contacts[i] == req.body.username) {
        		return res.status(400).json({error: "User already in contacts!"});
        	}
        }
        user.contacts.push(req.body.username);

        user.save(function(err) {
        	if(err) {
        		console.log(err);
        		return res.status(400).json({error: "An error occurred"});
        	}
        	res.json({redirect: "/user/" + req.body.username});
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
module.exports.renderUser = renderUser;
module.exports.renderChat = renderChat;
module.exports.updateaccount = updateaccount;
module.exports.addContact = addcontact;
module.exports.login = login;
module.exports.signup = signup;
module.exports.logout = logout;