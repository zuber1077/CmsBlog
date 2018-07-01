const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs');

const PostSchema = Schema({

    user: {

    },
    title: {
        type: String,
        require: true
    },
    slug: {
        type: String
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

PostSchema.plugin(URLSlugs('title',{field: 'slug'}));

module.exports = mongoose.model('Post', PostSchema);