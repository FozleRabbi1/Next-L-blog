import { Post } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { postSearchQuery } from "./post.queryParams"

const createPostIntoDB = async (data: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
    const result = await prisma.post.create({
        data
    })
    return result
}


const getAllPostFromDB = async (searchQuery?: string, tags?: string[], isFeatured?: string) => {

    const result = await prisma.post.findMany({
        where: postSearchQuery(searchQuery, tags, isFeatured),
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


