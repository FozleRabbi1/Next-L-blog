import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    /**
     * Prisma Validation Error
     */
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Invalid query or missing required fields";
    }

    /**
     * Prisma Known Errors
     */
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {

        if (err.code === "P2002") {
            statusCode = 409;
            message = `Duplicate value for ${err.meta?.target}`;
        }

        else if (err.code === "P2025") {
            statusCode = 404;
            message = "Record not found";
        }

        else if (err.code === "P2003") {
            statusCode = 400;
            message = "Foreign key constraint failed";
        }
    }

    /**
     * Prisma Unknown Error
     */
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        message = "Unknown database error occurred";
    }

    /**
     * Prisma Initialization Error
     */
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = 500;
        message = "Database connection failed";
    }


    /**
     * Final Response
     */
    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === "development" ? err : undefined,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

export default errorHandler;











// import { NextFunction, Request, Response } from "express"
// import { Prisma } from "../../generated/prisma/client";

// function errorHandler(
//     err: any,
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) {
//     let statusCode = 500;
//     let errorMessage = "Internal Server Error";
//     let errorDetails = err;

//     // PrismaClientValidationError
//     if (err instanceof Prisma.PrismaClientValidationError) {
//         statusCode = 400;
//         errorMessage = "You provide incorrect field type or missing fields!"
//     }
//     // PrismaClientKnownRequestError
//     else if (err instanceof Prisma.PrismaClientKnownRequestError) {
//         if (err.code === "P2025") {
//             statusCode = 400;
//             errorMessage = "An operation failed because it depends on one or more records that were required but not found."
//         }
//         else if (err.code === "P2002") {
//             statusCode = 400;
//             errorMessage = "Duplicate key error"
//         }
//         else if (err.code === "P2003") {
//             statusCode = 400;
//             errorMessage = "Foreign key constraint failed"
//         }
//     }
//     else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
//         statusCode = 500;
//         errorMessage = "Error occurred during query execution"
//     }
//     else if (err instanceof Prisma.PrismaClientInitializationError) {
//         if (err.errorCode === "P1000") {
//             statusCode = 401;
//             errorMessage = "Authentication failed. Please check your creditials!"
//         }
//         else if (err.errorCode === "P1001") {
//             statusCode = 400;
//             errorMessage = "Can't reach database server"
//         }
//     }

//     res.status(statusCode)
//     res.json({
//         message: errorMessage,
//         error: errorDetails
//     })
// }

// export default errorHandler;
