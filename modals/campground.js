const mongoose = require('mongoose')

const campgroundSchema = new mongoose.Schema({
    name:String,
    price:Number,
    location:String,
    image:String,
    discription:String
})
const Campground = mongoose.model('Campground',campgroundSchema)
module.exports = Campground;
