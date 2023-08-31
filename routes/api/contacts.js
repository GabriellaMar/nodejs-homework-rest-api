const express = require('express')
const router = express.Router()
const contacts = require('../../models/contacts');
const HttpError = require("../../helpers/HttpError");
const Joi = require("joi");



const addSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),

  phone: Joi.string()
    .pattern(new RegExp('^[0-9]{10}$'))
    .required(),
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
      throw HttpError(400, "missing required name field")
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
    const { error } = addSchema.validate(body);

    if (error) {
      throw HttpError(400, "missing fields");
    }

    const contactId = req.params.contactId;
    const body = req.body
    const result = await contacts.updateContact(contactId, body);

    if (!result) {
      throw HttpError(400, "Not found");
    }
    res.status(200).json(result);

  } catch (error) {
    next(error)
  }
})

module.exports = router
