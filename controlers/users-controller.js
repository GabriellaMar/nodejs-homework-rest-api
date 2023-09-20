import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/index.js";
import path from "path";
import fs from "fs/promises";
import gravatar from "gravatar";

const { JWT_SECRET } = process.env;
const avatarPath = path.resolve("public", "avatars")


const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email in use")
    }
    const hasPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email)
    const newUser = await User.create({ ...req.body, password: hasPassword, avatarURL });

    res.status(201).json({

        user: {
            userName: newUser.userName,
            email: newUser.email,
            subscription: newUser.subscription,
        }
    });
}


const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong")
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong")
    }
    const { _id: id } = user;
    const payload = {
        id,
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "48h" });
    await User.findByIdAndUpdate(id, { token });

    res.status(200).json({
        token,
        user: {
            email: email,
            subscription: user.subscription,
        }
    })

}


const getCurrent = (req, res) => {
    const { name, email, subscription } = req.user;
    res.status(200).json({
        name,
        email,
        subscription,
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(_id, { token: '' });

    if (!user) {
        throw HttpError(401, "Not authorized")
    }
    res.status(204)
}


const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    if (!user) {
        throw HttpError(401, "Not authorized")
    }

    res.status(200).json({
        avatarURL,
    })


}


export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
    updateAvatar: ctrlWrapper(updateAvatar),
}