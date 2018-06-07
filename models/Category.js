const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = Schema({

    name:{
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('categories', CategorySchema);