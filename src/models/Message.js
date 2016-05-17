var mongoose = require('mongoose');

var MessageModel;

var MessageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Chat"
    },

    username: {
    	type: String,
    	required: true
    },

    message: {
    	type: String,
    	required: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

MessageSchema.statics.findByChat = function(chatId, callback) {
    var search = {
        chat: mongoose.Types.ObjectId(chatId)
    };

    return MessageModel.find(search).select("chat username message timestamp").exec(callback);
};

MessageModel = mongoose.model('Message', MessageSchema);

module.exports.MessageModel = MessageModel;
module.exports.MessageSchema = MessageSchema;