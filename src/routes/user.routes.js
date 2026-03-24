import {Router} from "express"
import { changeCurrentPassword, forgotPasswordRequest, forgotResetPassword, getCurrentUser, login, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, searchUser } from "../controllers/user.controllers.js"
import {validate} from '../middlewares/validator.middleware.js'
import { verifyJWT } from "../middlewares/auth.middlewares"
import { userChangeCurrentPasswordValidator, userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgotPasswordValidator } from "../validators"
const router=Router()
//unsecured routes
router.route("/register").post(userRegisterValidator(),validate,registerUser)
router.route("/login").post(userLoginValidator(),validate,login)
router.route("/verify-email/:verficationToken").get(verifyEmail)
router.route("/refresh-token").post(refreshAccessToken)
router.route("forgot-password").post(userForgotPasswordValidator(),validate,forgotPasswordRequest)
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),validate,forgotResetPassword)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/change-password").post(verifyJWT,userChangeCurrentPasswordValidator(),validate,changeCurrentPassword)
router.route("/resend-email-verification").post(verifyJWT,resendEmailVerification)
router.route("/users").get(verifyJWT,searchUser)
export default router;