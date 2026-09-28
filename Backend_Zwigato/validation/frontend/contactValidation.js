const Joi = require("joi");


const contactSchema = Joi.object({

    name: Joi.string()
        .min(3)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/),

    subject: Joi.string()
        .required(),

    message: Joi.string()
        .min(10)
        .required()

});


module.exports = {
    contactSchema
};