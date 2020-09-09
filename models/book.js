let mongoose = require('mongoose');

let bookSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'Author'
    },
    isbn: {
        type: String,
        validate: {
            validator: function(newISBN){
                // A validator function simply returns true or false
                return newISBN.length == 13;
            },
            message: "ISBN must be exactly 13 digits long"
        }
    },
    dop: {
        type: Date,
        default: Date.now()
    },
    summary: String
});

module.exports = mongoose.model('Book',bookSchema);