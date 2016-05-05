var models = require("../models");
var Chat = models.Chat;
var Message = models.Message;
var Account = models.Account;

var addChat = function(req, res) {
	if(!req.body.username || !req.message) {
		return res.status(400).json({error: "Body username and message are required."});
	}

	var userId;
	Account.AccountModel.findByUsername(req.body.username, function(err, doc) {
		if(err)
		{
			return callback(err);
		}
        if(!doc) {
            return callback();
        }

        userId = doc.id;
	});

	var chatData = {
		users: [req.session.account.id, userId]
	};

	var newChat = new Chat.ChatModel(chatData);

	var messageData = {
		chat: newChat.id,
		username: req.session.account.username,
		message: req.body.message
	};

	var newMessage = new Message.MessageModel(messageData);

	newChat.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).json({error: "Chat could not be created"});
		}

		res.json({redirect: "/app"});
	});
};

// Export all functions