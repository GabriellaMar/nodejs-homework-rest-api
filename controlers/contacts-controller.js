
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/index.js";
import Contact from '../models/Contact.js';


// контролер для отримання всього списку контактів, пагінація, фільтрація контактів за полем favorite---------
const getAll = async (req, res) => {

    const { _id } = req.user;
    const { page = 1, limit = 10, favorite = false } = req.query;

    const skip = (page - 1) * limit;
    
    const contacts = favorite
        ? await Contact.find({ owner: _id, favorite: true }, "-createdAt -updatedAt", { skip, limit: Number(limit), }).populate("owner", "email _id")
        : await Contact.find({ owner: _id }, "-createdAt -updatedAt", { skip, limit: Number(limit), }).populate("owner", "email _id");

    res.status(200).json(contacts)
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





export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
}