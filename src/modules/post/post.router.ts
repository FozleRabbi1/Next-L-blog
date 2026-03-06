import express from "express";
import { postController } from "./post.controller";
import { Auth, UserRole } from "../../middlewares/auth";


const router = express.Router();

router.get("/", postController.getAllPosts)
router.post("/", Auth([UserRole.USER]), postController.createPost)
router.get("/:postId", postController.getPostById)

export const postRouter = router