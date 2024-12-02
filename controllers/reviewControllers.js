const Review = require('../modals/reviews.js')
const Campground = require('../modals/campground')

module.exports.postReview = async (req, res) => {
    let { id } = req.params;
    let newReview = req.body
    newReview.author = req.user._id
    let review = await Review.create(newReview);
    console.log(newReview)
    let reviewId = review._id.toString();
    let campground = await Campground.findById(id);
    campground.reviews.push(reviewId);
    await campground.save();
    req.flash('success','successfully created review')
    res.redirect(`/campgrounds/${id}`);
}
module.exports.deleteReview = async (req, res) => {
    let { id } = req.params;
    let { _id } = req.query;
    await Review.findByIdAndDelete(_id);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: _id } });
    req.flash('success','successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}