import contacts from '../models/contacts.js';

// import { HttpError }  from "../helpers/HttpError.js";
import HttpError from "../helpers/HttpError.js";

import { ctrlWrapper } from "../decorators/index.js";


const getAll = async (req, res) => {
    const result = await contacts.listContacts()
    res.status(200).json(result)
}


const getById = async (req, res) => {
    const contactId = req.params.contactId;
    const result = await contacts.getContactById(contactId);

    if (!result) {
        throw HttpError(404, "Not found");
    }

    res.status(200).json(result);
}


const add = async (req, res) => {
    const newContact = req.body;
    const result = await contacts.addContact(newContact);

    res.status(201).json(result);
}

const deleteById = async (req, res) => {
    const contactId = req.params.contactId;
    const result = await contacts.removeContact(contactId);

    if (!result) {
        throw HttpError(400, "Not found");
    }

    res.status(200).json({
        message: "contact deleted"
    })
}

const updateById = async (req, res) => {
    const body = req.body
    const contactId = req.params.contactId;
    const result = await contacts.updateContact(contactId, body);

    if (!result) {
        throw HttpError(400, "Not found");
    }
    res.status(200).json(result);
}

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
}