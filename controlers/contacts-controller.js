
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/index.js";
import Contact from '../models/Contact.js';


const getAll = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 2 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner }).skip(skip).limit(parseInt(limit)).populate("owner", "userName email");
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
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...newContact, owner });

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
    res.status(200).json(result);
}

// контролер для фільтрації контактів за полем favorite---------

const getFiltered = async (req, res) => {

    const { _id: owner } = req.user;
    const { favorite } = req.query;

    let filteredContacts;
    try {
        if (favorite === "true") {
            filteredContacts = await Contact.find({ owner, favorite: true });
        }
        res.status(200).json(filteredContacts);
    } catch (error) {
        console.log('Немає улюблених контактів')
    }

}



export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
    getFiltered: ctrlWrapper(getFiltered),
}