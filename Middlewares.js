const Review = require('./modals/reviews.js')
const Campground = require('./modals/campground.js')
const {reviewSchema} = require('./Schemas.js')
const CustomError = require('./utilities/CustomExpressError.js')

module.exports.validatorMiddleware = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
        console.log(error.details)
        throw new CustomError(error.details.map(el => el.message).join(','),400)
    }
    else(next())
}
module.exports.isAuthor = async (req, res, next) => {
    let { id } = req.params;
    let { _id } = req.query;
    let review = await Review.findById(_id).populate('author');
    if (req.user._id.equals(review.author._id)) {
        return next();
    } else {
        console.log(req.user._id == review.author._id);
        req.flash('danger', 'You Do Not Own It');
        res.redirect(`/campgrounds/${id}`);
    }
};

module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('danger', 'You need to be logged in to access that page.');
    res.redirect('/login');
};
module.exports.isCampAuthor = async (req, res, next) => {
    let { id } = req.params;
    if(!id){
        id = req.query._id;
    }
    try {
        const ground = await Campground.findById(id).populate('author');
        console.log(ground)
        if (!ground) {
            req.flash('danger', 'Campground not found.');
            return res.redirect('/campgrounds');
        }
        if (req.user._id.equals(ground.author._id)) {
            return next();
        } else {
            req.flash('danger', 'You are not authorized to perform this action!');
            return res.redirect(`/campgrounds/${id}`);
        }
    } catch (err) {
        req.flash('danger', 'Something went wrong!');
        return res.redirect('/campgrounds');
    }
};
