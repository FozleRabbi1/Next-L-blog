import { Request, Response } from "express";
import { postService } from "./post.service";

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
        const result = await postService.getAllPostFromDB(searchQuery);
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