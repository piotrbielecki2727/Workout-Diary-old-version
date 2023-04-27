const mongoose = require('mongoose')
const exercisesSchema=new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    muscle: {
        type:String,
        required: true,
    },
    
    });

    const exercisesModel = mongoose.model("exercises",exercisesSchema)
    module.exports = exercisesModel