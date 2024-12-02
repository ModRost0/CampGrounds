const express = require('express')
const mongoose = require('mongoose')
const Campground = require('../modals/campground.js')
const asyncWrapper = require('../utilities/asyncWraper.js')
const CustomError = require('../utilities/CustomExpressError.js')
const {isLoggedIn,isCampAuthor} = require('../Middlewares.js')
const {campgroundSchema} = require('../Schemas.js')
const passport = require('passport');
const campController = require('../controllers/campControllers.js')
const multer = require('multer')
const {storage} = require('../cloudinary/index.js')
const upload = multer({storage:storage})

let router = express.Router();
let validatorMiddleware = (req,res,next)=>{
    let {error} = campgroundSchema.validate(req.body)
    if(error){
        console.log(error.details)
        throw new CustomError(error.details.map(el => el.message).join(','),400)
    }
    else(next())
}
router.route('/')
.get(asyncWrapper(campController.showCampgrounds))
.post(isLoggedIn,upload.array('image',7),validatorMiddleware, asyncWrapper(campController.createCampground))
.delete(isLoggedIn,isCampAuthor,asyncWrapper(campController.deleteCampground));

router.get('/create', isLoggedIn,campController.showCreatePage);

router.route('/:id')
.get(asyncWrapper(campController.showCampDetails))
.patch(isLoggedIn,isCampAuthor,upload.array('image',7),validatorMiddleware, asyncWrapper(campController.patchCampground));

router.get('/:id/edit',isLoggedIn,isCampAuthor,asyncWrapper(campController.showEditPage));

module.exports = router;