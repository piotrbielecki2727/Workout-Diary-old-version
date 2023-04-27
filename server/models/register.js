const mongoose = require('mongoose')
const userSchema=new mongoose.Schema({
firstname: {
    type:String,
    required: true,
},
lastname: {
    type:String,
    required: true,
},
email: {
    type:String,
    required: true,
    unique: true,
},
password: {
    type:String,
    required: true,
},

block: {
    type: Boolean,
    required: false,
    default: false, 
},

trainings: {
    type:Array,
    required: false,
},


});


const userModel = mongoose.model("users",userSchema)
module.exports = userModel;
