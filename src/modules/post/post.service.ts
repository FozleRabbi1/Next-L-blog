import { Post, PostStatus } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { postSearchQuery } from "./post.queryParams"

const createPostIntoDB = async (data: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
    const result = await prisma.post.create({
        data
    })
    return result
}


const getAllPostFromDB = async (page: number, limit: number, skip: number, searchQuery?: string, tags?: string[], isFeatured?: string, status?: PostStatus | undefined, authorId?: string | undefined, sortBy?: string, orderBy?: string) => {

    const result = await prisma.post.findMany({
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
        },
        // orderBy: {
        //     createdAt: "desc"
        // }
        skip: skip,
        take: limit,
        orderBy: sortBy && orderBy ? {   // dynamic sorting 
            [sortBy]: orderBy   // sortby holo field name, orderBy holo sorting order (asc or desc)
        } : { createdAt: "desc" }
    });
    const totalData = await prisma.post.count({ where: postSearchQuery(searchQuery, tags, isFeatured, status, authorId), })

    const metadata = {
        totalData,
        currentPage: page,
        currentData: limit,
        totalPage: Math.ceil(totalData / limit)
    }

    return { metadata, result };
};

const getPostByIdFromDB = async (id: string) => {
    const result = await prisma.post.findUnique({
        where: { id },
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
    })
    return result
}


export const postService = {
    createPostIntoDB,
    getAllPostFromDB,
    getPostByIdFromDB
}


