import { Router } from "express";
import {getNotification} from "../controllers/notification.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router=Router()

router.route("/").get(verifyJWT,getNotification)

export default router