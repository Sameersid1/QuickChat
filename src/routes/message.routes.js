import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import {sendMessage,getMessages} from "../controllers/message.controllers.js"

const router=new Router()

router.route("/").post(verifyJWT,sendMessage);
router.route("/:chatId").get(verifyJWT,getMessages)

export default router;