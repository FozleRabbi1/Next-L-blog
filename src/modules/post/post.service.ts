import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client"
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
            },
            _count: {
                select: { comments: true }
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

// =========== normal away , single qury ===============
// const getPostByIdFromDB = async (id: string) => {
//     console.time("getPost")

//     const result = await prisma.post.update({
//         where: { id },
//         data: {
//             views: {
//                 increment: 1
//             }
//         },
//         include: {
//             author: {
//                 select: {
//                     id: true,
//                     name: true,
//                     email: true,
//                     role: true,
//                     image: true
//                 }
//             }
//         }
//     })

//     console.timeEnd("getPost")
//     return result
// }

// ================= two query way with transaction rollback for better performance ===========

const getPostByIdFromDB = async (id: string) => {
    return await prisma.$transaction(async (jekononam) => {

        await jekononam.post.update({
            where: { id },
            data: {
                views: {
                    increment: 1
                }
            }
        })

        const result2 = await jekononam.post.findUnique({
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
                },
                comments: {
                    where: {
                        parentId: null,
                        status: CommentStatus.APPROVED
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        replies: {
                            where: {
                                status: CommentStatus.APPROVED
                            },
                            include: {
                                replies: {
                                    where: {
                                        status: CommentStatus.APPROVED
                                    },
                                    include: {
                                        replies: {
                                            where: {
                                                status: CommentStatus.APPROVED
                                            },
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: { comments: true }
                }
            }
        })
        return result2
    })
}


const getMyPostFromDB = async (authorId: string) => {

    await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId,
            status: "ACTIVE"
        }
    })

    // if(userInfo.status !== "ACTIVE"){
    //     throw new Error ("Unauthorize! Your are not a ACTIVE user")
    // }


    const result = await prisma.post.findMany({
        where: { authorId },
        include: {
            comments: true,
            _count: {
                select: {
                    comments: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    // const totalPost = await prisma.post.count({
    //     where: { authorId }
    // })
    const totalPost = await prisma.post.aggregate({
        where: { authorId },
        _count: { authorId: true }
    })

    return { totalPost, result }

}

const updateOwnePost = async (authorId: string, postId: string, payload: Partial<Post>, isAdmin: boolean) => {
    const postData = await prisma.post.findFirstOrThrow({ where: { id: postId } })
    if (!isAdmin && (authorId !== postData.authorId)) {
        throw new Error("Unauthorize! you are not abale to update this data")
    }

    if (!isAdmin) {
        delete payload.isFeatured
    }

    return await prisma.post.update({
        where: { id: postId },
        data: payload
    })
}

const deletePost = async (authorId: string, postId: string, isAdmin: boolean) => {
    const postData = await prisma.post.findFirstOrThrow({ where: { id: postId } })
    if (!isAdmin && (authorId !== postData.authorId)) {
        throw new Error("Unauthorize! you are not abale to delete this data")
    }
    return await prisma.post.delete({
        where: { id: postId }
    })
}

// const getStatisticsByAdmin = async () =>{
//     const postStatistics = await prisma.post.aggregate({
//         _count : {id : true},
//         _count : {comment : true}
//     })

//     return { totalPost : postStatistics }

// }

const getStatisticsByAdmin = async () => {
    const [totalPosts, totalComments, published, archived, draft, totalViews] = await Promise.all([
        prisma.post.count(),
        prisma.comment.count(),
        prisma.post.count({
            where: { status: PostStatus.PUBLISHED }
        }),
        prisma.post.count({
            where: { status: PostStatus.ARCHIVED }
        }),
        prisma.post.count({
            where: { status: PostStatus.DRAFT }
        }),
        prisma.post.aggregate({
            _sum: { views: true }
        })
    ]);

    return {
        totalPosts,
        totalComments,
        published, archived, draft, totalViews : totalViews._sum.views
    };
};


export const postService = {
    createPostIntoDB,
    getAllPostFromDB,
    getPostByIdFromDB,
    getMyPostFromDB,
    updateOwnePost,
    deletePost,
    getStatisticsByAdmin
}


