import { prisma } from "../../lib/prisma";
import { IComment } from "./comment.types";

const createComment = async (payload: IComment) => {

    await prisma.post.findUniqueOrThrow({
        where: { id: payload.postId }
    })

    if (payload.parentId) {
        await prisma.comment.findUniqueOrThrow({ where: { id: payload.parentId } })
    }

    const result = await prisma.comment.create({
        data: payload
    })
    return result
}


const getSingleCommentById = async (commentId: string) => {
    const result = await prisma.comment.findUniqueOrThrow({
        where: { id: commentId },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    tags: true
                }
            }
        }
    });
    return result
}

const getCommentsByAuthorId = async (authorId: string) => {
    return await prisma.comment.findMany({
        where: {
            authorId
        }
    })
}

const deleteComment = async (commentId: string, userId: string) => {
    // const comment = await prisma.comment.findUnique({
    //     where: { id: commentId }
    // })

    const comment = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId: userId
        }
    })

    if (!comment) {
        throw new Error("comment not found")
    }

    if (comment?.authorId !== userId) {
        throw new Error("Unauthorize!")
    }
    return await prisma.comment.delete({ where: { id: commentId } })
}


// const updateCommentIntoDB = async (commentId: string, paylod: Partial<IComment>) => {
//     return await prisma.comment.update({
//         where: { id: commentId },
//         data: paylod
//     })
// }

const updateCommentIntoDB = async (
    commentId: string,
    payload: Partial<IComment>
) => {
    const result = await prisma.comment.update({
        where: { id: commentId },
        data: payload
    });

    return result;
};


export const commentService = {
    createComment,
    getSingleCommentById,
    getCommentsByAuthorId,
    deleteComment,
    updateCommentIntoDB
}





