export interface IComment {
    content: string;
    authorId: string;
    postId: string;
    parentId?: string | null;
}
