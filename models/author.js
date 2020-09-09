let mongoose = require('mongoose');

let authorSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    dob: Date,
    address:{
        state: {
            type: String,
            validate:{
                validator: function(newState){
                    return newState.length>=2 && newState.length<=3;
                },
                message: 'State should be between 2 and 3 characters'
            }
        },
        suburb: String,
        street: String,
        unit: {
            type: Number,
            get: function(newUnit){
                return "U " + newUnit;
            }
        }
    },
    numBooks: {
        type: Number,
        min: 1,
        max: 150
    }
});

module.exports = mongoose.model('Author',authorSchema);