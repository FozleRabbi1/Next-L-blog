import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import { paginationHelper } from "../../helpers/paginationHelper";

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

        // const page = req.query.page ? parseInt(req.query.page as string) : 0;
        // const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
        // const sortBy = req.query.sortBy as string | undefined;  // field name 
        // const orderBy = req.query.orderBy as string | undefined; // asc or desc  ( order name )

        const { page, limit, skip, sortBy, orderBy } = paginationHelper(req.query)

        const result = await postService.getAllPostFromDB(page, limit, skip, searchQuery, tags, isFeatured, status, authorId, sortBy, orderBy);
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