import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { accessChat,getAllChats,createGroupChat,addToGroup,removeFromGroup,renameGroup, deleteGroup } from "../controllers/chat.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js"

const router=Router()

//chat routes
router.route("/").post(verifyJWT,accessChat)
router.route("/").get(verifyJWT,getAllChats)

//group
router.route("/group").post(verifyJWT,upload.single("avatar"),createGroupChat)
router.route("/group/add").post(verifyJWT,addToGroup)
router.route("/group/remove").post(verifyJWT,removeFromGroup)
router.route("/group/rename").post(verifyJWT,renameGroup)
router.route("/group/:chatId").delete(verifyJWT,deleteGroup)
export default router;