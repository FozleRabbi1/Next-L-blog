type IOptions = {
    page?: number,
    limit?: number,
    sortBy?: string,
    orderBy?: string
}

type IOptionReturn = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    orderBy: string
}

export const paginationHelper = (options: IOptions) : IOptionReturn => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 5;
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || "createdAt";
    const orderBy = options.orderBy || "desc";

    return {
        page, limit, skip, sortBy, orderBy
    }
}

