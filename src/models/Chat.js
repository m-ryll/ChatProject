var mongoose = require('mongoose');

var ChatModel;

var ChatSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Account"
    }],

    usernames: [{
        type: String
    }]
});

ChatSchema.statics.findByUser = function(userId, callback) {
    var search = {
        users: userId
    };

    return ChatModel.find(search).select("users usernames").exec(callback);
};

ChatModel = mongoose.model('Chat', ChatSchema);

module.exports.ChatModel = ChatModel;
module.exports.ChatSchema = ChatSchema;