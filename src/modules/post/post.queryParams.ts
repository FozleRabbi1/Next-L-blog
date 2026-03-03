import { PostStatus, Prisma } from "../../../generated/prisma/client";

export const postSearchQuery = (searchQuery?: string, tags?: string[], isFeatured?: string, status?: PostStatus | undefined, authorId?: string | undefined) => {

    const whereClause: Prisma.PostWhereInput = {};

    if (searchQuery) {
        whereClause.OR = [
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
                tags: {  // single value search korbe array er moddhe theke 
                    has: searchQuery
                }
            }
        ];
    }

    // Only add tags filter if tags array exists and has items   (ekti array er tags er job value diye search korbe)
    if (tags && tags.length > 0) {
        whereClause.tags = {
            hasEvery: tags
        };
    }
    if (isFeatured !== undefined) {
        whereClause.isFeatured = typeof isFeatured === "string" ? isFeatured.toLowerCase() === "true" : false
    }

    if (status !== undefined) {
        whereClause.status = status as PostStatus;
    }
    if (authorId !== undefined) {
        whereClause.authorId = authorId;
    }

    return whereClause;
}