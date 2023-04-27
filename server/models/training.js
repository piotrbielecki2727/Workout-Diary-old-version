const mongoose = require('mongoose')
const trainingSchema=new mongoose.Schema({
name: {
    type:String,
    required: false,
},
date: {
    type:String,
    required: false,
},

exercises: {
    type:Array,
    required: false,
}

});


const trainingModel = mongoose.model("workouts",trainingSchema)
module.exports = trainingModel
