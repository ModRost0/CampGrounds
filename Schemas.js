const Joi = require('joi')
module.exports.campgroundSchema = Joi.object({
    name:Joi.string().required(),
    price:Joi.number().min(0).max(99).required(),
    location:Joi.string().required(),
    image:Joi.string().required(),
    description:Joi.string().required()
});
module.exports.reviewSchema = Joi.object({
    rating:Joi.number().required().min(0).max(5),
    review:Joi.string().required()
})