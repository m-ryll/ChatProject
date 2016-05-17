var models = require("../models");
var Message = models.Message;

// Add a new message to the chat.
var addMessage = function(req, res) {
	if(!req.body.message) {
		return res.status(400).json({error: "Message is required."});
	}

	var messageData = {
		chat: req.params.id,
		username: req.session.account.username,
		message: req.body.message
	};

	var newMessage = new Message.MessageModel(messageData);

	newMessage.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).json({error: "Message could not be sent"});
		}

		res.json({redirect: "/app/" + req.params.id});	
	});
}

// Export all functions.
module.exports.addMessage = addMessage;