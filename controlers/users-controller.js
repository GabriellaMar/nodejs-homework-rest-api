import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { HttpError, sendEmail } from "../helpers/index.js"
import { ctrlWrapper } from "../decorators/index.js";
import path from "path";
import fs from "fs/promises";
import gravatar from "gravatar";
import { nanoid } from "nanoid";


const { JWT_SECRET, BASE_URL } = process.env;

const avatarPath = path.resolve("public", "avatars")


const register = async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {

        throw HttpError(409, "Email in use")
    }

    const hasPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email);

    const varificationToken = nanoid();

    const newUser = await User.create({ ...req.body, password: hasPassword, avatarURL, varificationToken });

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target = "_blank" href = "${BASE_URL}/api/users/verify/${varificationToken}">Click to verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            userName: newUser.userName,
            email: newUser.email,
            subscription: newUser.subscription,
        }
    });
}



const verify = async (req, res) => {

    const { varificationToken } = req.params;
    const user = await User.findOne({ varificationToken });

    if (!user) {
        // throw HttpError(404)
        return res.status(404).json({
            message: 'User not found'
        });
    }

    await User.findByIdAndUpdate(user._id, { verify: true, varificationToken: null });

    res.status(200).json({

        message: 'Verification successful',
    })
}


const resendVerifyEmail = async (req, res) => {

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        // throw HttpError(404, "Email not found");

        return res.status(404).json({
            message: 'Email not found'
        });
    }

    if (user.verify) {
        // throw HttpError(400, "Verification has already been passed")

        return res.status(400).json({
            message: 'Verification has already been passed'
        });
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target = "_blank" href = "${BASE_URL}/api/users/verify/${user.varificationToken}">Click to verify email</a>`
    }
    await sendEmail(verifyEmail);

    res.status(200).json({
        message: "Verification email sent"
    })
}

const login = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong")
    }

    if (!user.verify) {
        throw HttpError(401, "Email not verify")
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
    const user = await User.findByIdAndUpdate(_id, { avatarURL });

    if (!user) {
        throw HttpError(401, "Not authorized")
    }

    res.status(200).json({
        avatarURL,
    })


}


export default {
    register: ctrlWrapper(register),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
    updateAvatar: ctrlWrapper(updateAvatar),
}