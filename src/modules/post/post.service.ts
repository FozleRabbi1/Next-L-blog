import { Post, PostStatus } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { postSearchQuery } from "./post.queryParams"

const createPostIntoDB = async (data: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
    const result = await prisma.post.create({
        data
    })
    return result
}


const getAllPostFromDB = async ( skip: number, take: number, searchQuery?: string, tags?: string[], isFeatured?: string, status?: PostStatus | undefined, authorId?: string | undefined) => {

    // const getAllPostFromDB = async (skip: number, take: number, searchQuery?: string, tags?: string[], isFeatured?: string, status?: PostStatus | undefined, authorId?: string | undefined) => {

    const result = await prisma.post.findMany({
        skip,
        take,
        where: postSearchQuery(searchQuery, tags, isFeatured, status, authorId),
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    image: true
                }
            }
        }
    });

    return result;
};

export const postService = {
    createPostIntoDB,
    getAllPostFromDB
}


