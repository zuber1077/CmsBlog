const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    body: {
        type: String,
        require: true
    },

    date: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('comments', CommentSchema);