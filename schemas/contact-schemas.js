import Joi from "joi";

const addContactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'any.required': 'missing required name field',
    }),

  phone: Joi.string()
    .pattern(new RegExp('^\\(\\d{3}\\) \\d{3}-\\d{4}$'))
    .required()
    .messages({
      'any.required': 'missing required phone field',
      'string.pattern.base': 'phone field must have the format (123) 456-7890',
    }),

  email: Joi.string()
    .required()
    .messages({
      'any.required': 'missing required email field',
    }),
  favorite: Joi.boolean(),
})


const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean(),
})


export default {
  addContactSchema,
  contactUpdateFavoriteSchema,
}