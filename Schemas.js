const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)
module.exports.campgroundSchema = Joi.object({
    name:Joi.string().required(),
    price:Joi.number().min(0).max(99).required(),
    location:Joi.string().required(),
    image:Joi.array(),
    description:Joi.string().required(),
    deleteImage:Joi.array()
});
module.exports.reviewSchema = Joi.object({
    rating:Joi.number().required().min(0).max(5),
    review:Joi.string().required()
})
module.exports.userSchema = Joi.object({
    username:Joi.string().alphanum()
    .min(4)
    .max(30)
    .required(),
    email:Joi.string()
    .email()
    .required(),
    password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{8,30}$'))
    .required() 
    .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must be at most 30 characters long',
        'string.pattern.base': 'Password must contain only letters, numbers, and special characters (!@#$%^&*)'
    })
})