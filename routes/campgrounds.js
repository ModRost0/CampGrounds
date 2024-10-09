const express = require('express')
const mongoose = require('mongoose')
const Campground = require('../modals/campground.js')
const asyncWrapper = require('../utilities/asyncWraper.js')
const {campgroundSchema} = require('../Schemas.js')
let router = express.Router();
let validatorMiddleware = (req,res,next)=>{
    let {error} = campgroundSchema.validate(req.body)
    console.log(req.body)
    if(error){
        console.log(error.details)
        throw new CustomError(error.details.map(el => el.message).join(','),400)
    }
    else(next())
}
router.get('/', asyncWrapper(async (req, res, next) => {
    let grounds = await Campground.find({});
    res.render('main/campgrounds', { grounds });
}));
router.get('/create', (req, res) => {
    res.render('main/create');
});
router.get('/:id', asyncWrapper(async (req, res, next) => {
    let { id } = req.params;
    let ground = await Campground.findById(id).populate('reviews');
    console.log(ground);
    if(!ground){
        req.flash('danger','campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('main/details', { ground });
}));
router.get('/:id/edit', asyncWrapper(async (req, res, next) => {
    let { id } = req.params;
    let ground = await Campground.findById(id);
    console.log(ground);
    if(!ground){
        req.flash('danger','campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('main/edit', { ground });
}));
router.post('/', validatorMiddleware, asyncWrapper(async (req, res, next) => {
    console.log(req.body);
    await Campground.create(req.body);
    req.flash('success','successfully created campground')
    res.redirect('/campgrounds');
}));
router.delete('/', asyncWrapper(async (req, res, next) => {
    let { _id } = req.query;
    console.log(_id);
    await Campground.findByIdAndDelete(_id);
    req.flash('success','successfully deleted campground')
    console.log(res.locals)
    res.redirect('/campgrounds');
}));
router.patch('/:id', validatorMiddleware, asyncWrapper(async (req, res, next) => {
    let { id } = req.params;
    let change = req.body;
    await Campground.findByIdAndUpdate(id, change);
    req.flash('success','successfully patched campground')
    res.redirect('/campgrounds');
}));
module.exports = router;