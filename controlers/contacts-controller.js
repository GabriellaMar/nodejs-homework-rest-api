
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/index.js";
import Contact from '../models/Contact.js';


const getAll = async (req, res) => {
    const result = await Contact.find();
    res.status(200).json(result)
}


const getById = async (req, res) => {
    const contactId = req.params.contactId;
    const result = await Contact.findById(contactId);

    if (!result) {
        throw HttpError(404, "Not found");
    }

    res.status(200).json(result);
}


const add = async (req, res) => {
    const newContact = req.body;
    const result = await Contact.create(newContact);

    res.status(201).json(result);
}

const deleteById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);

    if (!result) {
        throw HttpError(400, "Not found");
    }

    res.status(200).json({
        message: "contact deleted"
    })
}

const updateById = async (req, res) => {
    const body = req.body
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, body, { new: true });

    if (!result) {
        throw HttpError(400, "Not found");
    }
    if (body === undefined) {
        throw HttpError(400, "missing field favorite");
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