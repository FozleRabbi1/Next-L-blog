import express from "express";
import { postController } from "./post.controller";
import { Auth, UserRole } from "../../middlewares/auth";


const router = express.Router();

router.post("/", Auth([UserRole.USER]), postController.createPost)

export const postRouter = router