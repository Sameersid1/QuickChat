import {Router} from "express"
import { changeCurrentPassword, forgotPasswordRequest, forgotResetPassword, getCurrentUser, login, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, searchUser ,updateProfile,verifyEmail} from "../controllers/user.controllers.js"
import {validate} from '../middlewares/validator.middleware.js'
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js"
import { userChangeCurrentPasswordValidator, userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgotPasswordValidator } from "../validators/index.js"
const router=Router()
//unsecured routes
router.route("/register").post(upload.single("avatar"),userRegisterValidator(),validate,registerUser)
router.route("/login").post(userLoginValidator(),validate,login)
router.route("/verify-email/:verificationToken").get(verifyEmail)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/forgot-password").post(userForgotPasswordValidator(),validate,forgotPasswordRequest)
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),validate,forgotResetPassword)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/change-password").post(verifyJWT,userChangeCurrentPasswordValidator(),validate,changeCurrentPassword)
router.route("/resend-email-verification").post(verifyJWT,resendEmailVerification)
router.route("/search").get(verifyJWT,searchUser)
router.route("/profile").put(verifyJWT,updateProfile)
export default router;