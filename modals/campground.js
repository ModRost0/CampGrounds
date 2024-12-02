const mongoose = require('mongoose')
const Review  = require('../modals/reviews')
const { coordinates } = require('@maptiler/client')

const imageSchema = new mongoose.Schema({
    url:String,
    filename:String
})
imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('upload/','upload/w_300/')
})
const campgroundSchema = new mongoose.Schema({
    name:{type:String,
          required:true
    },
    price:{type:Number,
        min:0,
        max:100,
        required:true
    },
    location:{type:String,
        required:true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
    ,
    image:[imageSchema],
    description:{type:String,
        required:true
    },
    reviews:[{type:mongoose.Schema.Types.ObjectId,ref:'Review'}]
    ,author:{type:mongoose.Schema.Types.ObjectId,
        ref:'User'}
})
campgroundSchema.set('toJSON', {
    virtuals: true
  });
campgroundSchema.virtual('properties').get(function() {
    return {title:this.name,route:`/campgrounds/${this._id}`,description:this.description}
})
campgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
    await Review.deleteMany({
        _id:{
            $in:doc.reviews
        }
    })}
})
const Campground = mongoose.model('Campground',campgroundSchema)
module.exports = Campground;