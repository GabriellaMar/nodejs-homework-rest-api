const express = require('express')
const router = express.Router()
const contacts = require('../../models/contacts');

router.get('/', async (req, res, next) => {
  const result = await contacts.listContacts()
  res.json(result)
})

router.get('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId;
  const result = await contacts.getContactById(contactId)
  res.json(result)

})

router.post('/', async (req, res, next) => {
  const newContact = req.body;
  try {
    const result = await contacts.addContact(newContact);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

})

router.delete('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId;
  const result = await contacts.removeContact(contactId)
  res.json(result)
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
