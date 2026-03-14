import express from "express";
import { postController } from "./post.controller";
import { Auth, UserRole } from "../../middlewares/auth";


const router = express.Router();

router.get("/", postController.getAllPosts)
router.get("/my-post", Auth([UserRole.USER, UserRole.ADMIN]), postController.getMyPost)
router.get("/:postId", postController.getPostById)
router.post("/", Auth([UserRole.USER]), postController.createPost)

export const postRouter = router