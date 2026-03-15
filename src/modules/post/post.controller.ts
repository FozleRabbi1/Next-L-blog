import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import { paginationHelper } from "../../helpers/paginationHelper";
import { UserRole } from "../../middlewares/auth";

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

const getPostById = async (req: Request, res: Response) => {
    const id = req.params.postId;

    try {
        const result = await postService.getPostByIdFromDB(id as string);
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            message: "post not retrived",
            error: error instanceof Error ? error.message : "Unknown error"
        })
    }
}

const getMyPost = async (req: Request, res: Response) => {
    try {
        const authorId = req.user?.id;
        const result = await postService.getMyPostFromDB(authorId as string)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            message: "my post not retrived",
            error: error instanceof Error ? error.message : "Unknown error"
        })
    }
}

const updateOwnePost = async (req: Request, res: Response) => {
    try {
        const authorId = req.user?.id;
        const isAdmin = req.user?.role === UserRole.ADMIN;
        const result = await postService.updateOwnePost(authorId as string, req.params.postId as string, req.body, isAdmin)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            message: "post data field to update",
            error: error instanceof Error ? error.message : "Unknown error"
        })
    }
}

export const postController = {
    createPost,
    getAllPosts,
    getPostById,
    getMyPost,
    updateOwnePost
}