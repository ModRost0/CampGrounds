let express = require('express')
let router = express.Router({mergeParams:true})
const mongoose = require('mongoose')
const Campground = require('../modals/campground.js')
const methodOverride = require('method-override')
const asyncWrapper = require('../utilities/asyncWraper.js')
const CustomError = require('../utilities/CustomExpressError.js')
const {isLoggedIn,isAuthor,validatorMiddleware} = require('../Middlewares')
const {reviewSchema} = require('../Schemas.js')
const passport = require('passport');
const Review = require('../modals/reviews.js')
const reviewController = require('../controllers/reviewControllers.js')


router.post('/',isLoggedIn,validatorMiddleware,asyncWrapper(reviewController.postReview));

router.delete('/',isLoggedIn,isAuthor,asyncWrapper(reviewController.deleteReview));

module.exports = router;