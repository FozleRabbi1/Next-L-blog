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

const getCommentById = async (req: Request, res: Response) => {
    try {
        const result = await commentService.getSingleCommentById(req.params.commentId as string)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            message: "somthig went wrong",
            error: error instanceof Error ? error.message : "Unknown error"
        })
    }
}

const getCommentsByAuthorId = async (req: Request, res: Response) => {
    try {
        const result = await commentService.getCommentsByAuthorId(req.params.authorId as string)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            message: "somthig went wrong",
            error: error instanceof Error ? error.message : "Unknown error"
        })
    }
}

export const commentController = {
    createComment,
    getCommentById,
    getCommentsByAuthorId
}

