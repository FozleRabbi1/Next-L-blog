import { Post, Prisma } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createPostIntoDB = async (data: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
    const result = await prisma.post.create({
        data
    })
    return result
}

// const getAppPostFromDB = async (searchQuery?: string) => {

//     const result = await prisma.post.findMany({
//         where: searchQuery ? {
//             OR: [{ title: { contains: searchQuery, mode: "insensitive" } }]
//         } : undefined
//     });
//     return result;
// }

const getAllPostFromDB = async (searchQuery?: string) => {
    const whereClause: Prisma.PostWhereInput = searchQuery
        ? {
            OR: [
                {
                    title: {
                        contains: searchQuery,
                        mode: "insensitive" as Prisma.QueryMode,
                    },
                },
                {
                    content: {
                        contains: searchQuery,
                        mode: "insensitive" as Prisma.QueryMode,
                    },
                },
                {
                    tags: {
                        has: searchQuery
                    }
                }
            ],
        }
        : {};

    const result = await prisma.post.findMany({
        where: whereClause,
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role : true,
                    image : true
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


