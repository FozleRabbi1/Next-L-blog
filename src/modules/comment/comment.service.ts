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


export const commentService = {
    createComment
}