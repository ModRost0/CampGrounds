const mongoose = require('mongoose')
const Review  = require('../modals/reviews')
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
    image:{type:String,
        required:true
    },
    description:{type:String,
        required:true
    },
    reviews:[{type:mongoose.Schema.Types.ObjectId,ref:'Review'}]
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