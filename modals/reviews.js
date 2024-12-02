const mongoose = require('mongoose')

let reviewSchema = new mongoose.Schema({
    rating:{
        type:Number,
        min:0,
        max:5,
        required:true
    },
    review:{
        type:String,
        required:true
    },
    author:{type:mongoose.Schema.Types.ObjectId,
        ref:'User'}
})
let Review = mongoose.model('Review',reviewSchema)
module.exports = Review;