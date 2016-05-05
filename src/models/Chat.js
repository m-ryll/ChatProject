var mongoose = require('mongoose');

var ChatModel;

var ChatSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Account"
    }],

    messages: {
        type: Array
    }
});

ChatSchema.statics.findByUser = function(userId, callback) {
    var search = {
        owner: mongoose.Types.ObjectId(userId)
    };

    return ChatSchema.find(search).select("owner messages").exec(callback);
};

ChatModel = mongoose.model('Chat', ChatSchema);

module.exports.ChatModel = ChatModel;
module.exports.ChatSchema = ChatSchema;