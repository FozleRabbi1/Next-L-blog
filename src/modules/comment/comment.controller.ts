import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {
        req.body.authorId = req.user?.id;
        const result = await commentService.createComment(req.body)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            message: "post not created",
            error: error instanceof Error ? error.message : "Unknown error"
        })
    }
}

export const commentController = {
    createComment
}

