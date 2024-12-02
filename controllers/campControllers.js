const Campground = require('../modals/campground')
const {cloudinary} = require('../cloudinary/index')
const maptilerClient = require('@maptiler/client')

maptilerClient.config.apiKey = process.env.MAPTILER_API;

module.exports.showCampgrounds = async (req, res, next) => {
    let grounds = await Campground.find({});
    res.render('main/campgrounds', { grounds });
}
module.exports.showCreatePage = (req, res) => {
    res.render('main/create');
}
module.exports.showCampDetails = async (req, res, next) => {
    let { id } = req.params;
    let ground = await Campground.findById(id).populate('reviews').populate('author').populate('reviews.author');
    const geoData = await maptilerClient.geocoding.forward(ground.location, { limit: 1 });
    ground.geometry = geoData.features[0].geometry;
    if(!ground){
        req.flash('danger','campground not found')
        return res.redirect('/campgrounds')
    }
    console.log(ground)
    res.render('main/details', { ground });
}
module.exports.showEditPage = async (req, res, next) => {
    let { id } = req.params;
    let ground = await Campground.findById(id).populate('author');
    if(!ground){
        req.flash('danger','campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('main/edit', { ground, });
}
module.exports.createCampground = async (req, res, next) => {
    let ground = req.body;
    ground.author = req.user;
    const images = req.files.map(({ path, filename }) => ({
        url:path,
        filename,
      }));
    ground.image = images
    const geoData = await maptilerClient.geocoding.forward(ground.location, { limit: 1 });
    console.log(geoData.features[0].geometry)
    ground.geometry = geoData.features[0].geometry;
    await Campground.create(ground);
    req.flash('success','successfully created campground')
    res.redirect('/campgrounds');
}
module.exports.deleteCampground = async (req, res, next) => {
    let { _id } = req.query;
    console.log(_id);
    await Campground.findByIdAndDelete(_id);
    req.flash('success','successfully deleted campground')
    res.redirect('/campgrounds');
}
module.exports.patchCampground = async (req, res, next) => {
    let { id } = req.params;
    let change = req.body;
    const images = req.files.map(({ path, filename }) => ({
        url:path,
        filename,
      }));
    change.image = ground.image
    change.image = [...ground.image, ...images];
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    change.geometry = geoData.features[0].geometry;
    await Campground.findByIdAndUpdate(id, change);
    if(req.body.deleteImage){
        await Campground.updateOne({$pull:{image:{filename:{$in:req.body.deleteImage}}}});
        await cloudinary.uploader.destroy(req.body.deleteImage)
    }
    req.flash('success','successfully patched campground')
    res.redirect('/campgrounds');
}