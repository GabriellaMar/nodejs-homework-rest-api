import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

// ------mongooose schema--------
 const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const contactSchema = new Schema({
        name: {
          type: String,
          required: [true, 'Set name for contact'],
        },
        email: {
          type: String,
          match: emailRegexp,
        },
        phone: {
          type: String,
          // match: /^\\(\\d{3}\\) \\d{3}-\\d{4}$/,
          required: true,
        },
        favorite: {
          type: Boolean,
          default: false,
        },
        owner: {
          type: Schema.Types.ObjectId,
          ref: 'user',
          required: true,
        },
}, {versionKey: false, timestamps: true})

contactSchema.post('save', handleSaveError);
contactSchema.pre('findOneAndUpdate', runValidateAtUpdate);
contactSchema.post('findOneAndUpdate', handleSaveError);


// ------Joi schema--------
 export const addContactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'any.required': 'missing required name field',
    }),

  phone: Joi.string()
    // .pattern(new RegExp('^\\(\\d{3}\\) \\d{3}-\\d{4}$'))
    .required()
    .messages({
      'any.required': 'missing required phone field',
      'string.pattern.base': 'phone field must have the format (123) 456-7890',
    }),

  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .messages({
      'any.required': 'missing required email field',
    }),
  favorite: Joi.boolean(),
})


export const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean(),
})


const Contact = model('contact', contactSchema);

export default Contact;