import express from "express";
import * as userSchemas from "../../models/User.js";
import { validateBodyWrapper } from "../../decorators/index.js";
 import authController from "../../controlers/users-controller.js";
 import { authenticate, upload} from "../../middlewarws/index.js";

const authRouter = express.Router();

const userRegisterValidate = validateBodyWrapper(userSchemas.userSignupSchema);
const userLoginValidate = validateBodyWrapper(userSchemas.userSigninSchema)

authRouter.post("/register",  userRegisterValidate, authController.register);

authRouter.post("/login", userLoginValidate, authController.login);

 authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch("/avatars", authenticate, upload.single("avatar"),  authController.updateAvatar)

export default authRouter;