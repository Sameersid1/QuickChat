import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { accessChat,getAllChats,createGroupChat,addToGroup,removeFromGroup,renameGroup } from "../controllers/chat.controllers.js"

const router=Router()

//chat routes
router.route("/").post(verifyJWT,accessChat)
router.route("/").get(verifyJWT,getAllChats)

//group
router.route("/group").post(verifyJWT,createGroupChat)
router.route("/group/add").post(verifyJWT,addToGroup)
router.route("/group/remove").post(verifyJWT,removeFromGroup)
router.route("/group/rename").post(verifyJWT,renameGroup)
export default router;