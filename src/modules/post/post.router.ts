import express from "express";
import { postController } from "./post.controller";
import { Auth, UserRole } from "../../middlewares/auth";


const router = express.Router();

router.get("/get-statistics-by-admin", postController.getStatisticsByAdmin)
router.get("/", postController.getAllPosts)
router.get("/my-post", Auth([UserRole.USER, UserRole.ADMIN]), postController.getMyPost)
router.get("/:postId", postController.getPostById)
router.post("/", Auth([UserRole.USER]), postController.createPost)
router.patch("/:postId", Auth([UserRole.USER, UserRole.ADMIN]), postController.updateOwnePost)
router.delete("/:postId", Auth([UserRole.USER, UserRole.ADMIN]), postController.updateOwnePost)

export const postRouter = router