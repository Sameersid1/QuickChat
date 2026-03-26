import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import {sendMessage,getMessages} from "../controllers/message.controllers"

const router=new Router()

router.route("/message").post(verifyJWT,sendMessage);
router.route("/message/:chatId").get(verifyJWT,getMessages)

export default router;