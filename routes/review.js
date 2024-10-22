let express = require('express')
let router = express.Router({mergeParams:true})
const mongoose = require('mongoose')
const Campground = require('../modals/campground.js')
const methodOverride = require('method-override')
const asyncWrapper = require('../utilities/asyncWraper.js')
const CustomError = require('../utilities/CustomExpressError.js')
const {reviewSchema} = require('../Schemas.js')
const Review = require('../modals/reviews.js')
let validatorMiddleware = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    console.log(req.body)
    if(error){
        console.log(error.details)
        throw new CustomError(error.details.map(el => el.message).join(','),400)
    }
    else(next())
}
router.post('/', validatorMiddleware,asyncWrapper(async (req, res) => {
    let { id } = req.params;
    let review = await Review.create(req.body);
    let reviewId = review._id.toString();
    let campground = await Campground.findById(id);
    campground.reviews.push(reviewId);
    await campground.save();
    req.flash('success','successfully created review')
    res.redirect(`/campgrounds/${id}`);
}));
router.delete('/', asyncWrapper(async (req, res) => {
    let { id } = req.params;
    let { _id } = req.query;
    await Review.findByIdAndDelete(_id);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: _id } });
    req.flash('success','successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}));
module.exports = router;