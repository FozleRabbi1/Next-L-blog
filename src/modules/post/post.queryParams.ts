import { Prisma } from "../../../generated/prisma/client";

export const postSearchQuery = (searchQuery?: string, tags?: string[], isFeatured?: string) => {

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
                tags: {
                    has: searchQuery
                }
            }
        ];
    }

    // Only add tags filter if tags array exists and has items
    if (tags && tags.length > 0) {
        whereClause.tags = {
            hasEvery: tags
        };
    }
    if (isFeatured !== undefined) {
        whereClause.isFeatured = typeof isFeatured === "string" ? isFeatured.toLowerCase() === "true" : false
    }

    return whereClause;
}