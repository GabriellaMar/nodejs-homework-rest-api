import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

 const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: emailRegexp,
        required: [true, 'Email is required'],
        unique: true,
    },

    password: {
        type: String,
        required: [true, 'Set password for user'],
        minlength: 6,
    },

    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
  token: {
    type: String,
     default: '',
  },
  
    avatarURL: {
        type: String,
        required: true,
    }, 
  

}, { versionKey: false, timestamps: true })


userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', runValidateAtUpdate);
userSchema.post('findOneAndUpdate', handleSaveError);





export const userSignupSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

export const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})


const User = model("user", userSchema);

export default User;