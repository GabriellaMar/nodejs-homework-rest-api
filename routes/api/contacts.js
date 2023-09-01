import express from "express";
import contacts from '../../models/contacts.js';
import { HttpError } from "../../helpers/index.js";
import Joi from "joi";
const router = express.Router();



const addSchema = Joi.object({
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
})


router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts()
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId;
  const result = await contacts.getContactById(contactId)
  if (!result) {
    // return res.status(404).json({ message: 'Not found' });
    throw HttpError(404, "Not found");
  }

  res.status(200).json(result);

})

router.post('/', async (req, res, next) => {
  const newContact = req.body;
  try {
    const { error } = addSchema.validate(newContact);

    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await contacts.addContact(newContact);

    res.status(201).json(result);
  }
  catch (error) {
    next(error)
  }

})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const result = await contacts.removeContact(contactId);

    if (!result) {
      throw HttpError(400, "Not found");
    }

    res.status(200).json({
      message: "contact deleted"
    })
  } catch (error) {

    next(error)
  }
})


router.put('/:contactId', async (req, res, next) => {
  try {
    const body = req.body
    const contactId = req.params.contactId;
    const { error } = addSchema.validate(body);

    if (error) {
      throw HttpError(400, error.message);
    }



    const result = await contacts.updateContact(contactId, body);

    if (!result) {
      throw HttpError(400, "Not found");
    }
    res.status(200).json(result);

  } catch (error) {
    next(error)
  }
})

export default router;
