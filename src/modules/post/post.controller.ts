import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
    const postData = { ...req.body, authorId: req.user?.id as string }
    try {
        const result = await postService.createPostIntoDB(postData)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({
            message: "post not created",
            error: error instanceof Error ? error.message : "Unknown error"
        })
    }
}

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const searchQuery = req.query.search as string | undefined;
        const isFeatured = req.query.isFeatured as string | undefined;
        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
        const status = req.query.status as PostStatus | undefined;
        const authorId = req.query.authorId as string | undefined;
        const skip = req.query.skip ? parseInt(req.query.skip as string) | 0 : 0;
        const take = req.query.take ? parseInt(req.query.take as string) | 2 : 2;


        const result = await postService.getAllPostFromDB(skip, take, searchQuery, tags, isFeatured, status, authorId);
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            message: "post not retrived",
            error: error instanceof Error ? error.message : "Unknown error"
        })
    }
}

export const postController = {
    createPost,
    getAllPosts
}