const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: Number,
        default: 0
    },
    password:{
        type:String,
        required: true,
        min: 6
    }
});

mongoose.model(process.env.USER_MODEL, UserSchema, process.env.USER_COLLECTION)