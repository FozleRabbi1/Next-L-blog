import { Router } from "express"
import { commentController } from "./comment.controller";
import { Auth, UserRole } from "../../middlewares/auth";


const router = Router()

router.post("/", Auth([UserRole.ADMIN, UserRole.USER]), commentController.createComment)


export const commentRouter: Router = router;



