const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = Schema({

    user: {

    },
    title: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    file: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    }

});

module.exports = mongoose.model('Post', PostSchema);