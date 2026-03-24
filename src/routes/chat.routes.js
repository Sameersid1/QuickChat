import {Router} from "routes"
import { verifyJWT } from "../middlewares/auth.middlewares"
import { getAllChats } from "../controllers/chat.controllers"

const router=Router()

//chat routes
router.route("/chat").post(verifyJWT,accessChat)
router.route("/chat").get(verifyJWT,getAllChats)
export default router;