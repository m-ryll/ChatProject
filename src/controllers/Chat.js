var models = require("../models");
var Chat = models.Chat;
var Message = models.Message;
var Account = models.Account;

// Add a new chat to the users accounts.
var addChat = function(req, res) {
	if(!req.body.username || !req.body.message) {
		return res.status(400).json({error: "Body username and message are required."});
	}

	var receivingUserId;
	var sendingUserId;

	Account.AccountModel.findByUsername(req.session.account.username, function(err, doc1) {
		if(err)
		{
			console.log(err);
		}
        if(!doc1) {
            console.log("USER DOES NOT EXIST");
            return res.status(400).json({error: "User does not exist"});
        }
        
        sendingUserId = doc1.id;

        Account.AccountModel.findByUsername(req.body.username, function(err, doc2) {
			if(err)
			{
				console.log(err);
			}
	        if(!doc2) {
	            console.log("USER DOES NOT EXIST");
	            return res.status(400).json({error: "User does not exist"});
	        }

	        receivingUserId = doc2.id;

	        // Add user to sending user's contact list.
	        doc1.contacts.push(req.body.username);

	        doc1.save(function(err) {
	        	if (err) {
					console.log(err);
				}

				// Send retrieved user id's once both have been found!
				// This function was written before I understood callbacks lol. "WHY IS MY CODE RUNNING OUT OF ORDER???"
	        	chatCreator(req.body.username, req.session.account.username, sendingUserId, receivingUserId, req.body.message, res);
	        });
		});
	});
}

function chatCreator(receivingUsername, sendingUsername, sendingId, receivingId, msg, res) {
	var chatData = {
		users: [sendingId, receivingId],
		usernames: [sendingUsername, receivingUsername]
	};

	var newChat = new Chat.ChatModel(chatData);

	var messageData = {
		chat: newChat.id,
		username: sendingUsername,
		message: msg
	};

	var newMessage = new Message.MessageModel(messageData);

	newChat.save(function(err) {
		if (err) {
			console.log(err);
		}

		newMessage.save(function(err) {
			if (err) {
				console.log(err);
				return res.status(400).json({error: "Message could not be sent"});
			}

			res.json({redirect: "/app/" + newChat._id});	
		});
	});
};

// Export all functions
module.exports.addChat = addChat;