import { Router } from "express"
import { commentController } from "./comment.controller";
import { Auth, UserRole } from "../../middlewares/auth";


const router = Router()

router.post("/", Auth([UserRole.ADMIN, UserRole.USER]), commentController.createComment)
router.get("/:commentId", Auth([UserRole.ADMIN, UserRole.USER]), commentController.getCommentById)
router.get("/each-author-all-comments/:authorId", Auth([UserRole.ADMIN, UserRole.USER]), commentController.getCommentsByAuthorId)
router.delete("/:commentId", Auth([UserRole.ADMIN, UserRole.USER]), commentController.deleteComment)
router.patch("/:commentId", Auth([UserRole.ADMIN, UserRole.USER]), commentController.updateComment)
router.patch("/moderate-comment/:commentId", Auth([UserRole.ADMIN]), commentController.moderateCommentByAdmin)


export const commentRouter: Router = router;



