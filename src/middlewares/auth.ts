import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";


export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: string;
                emailVerified: boolean;
            }
        }
    }
}

export const Auth = (role: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            })

            if (!session || !session.user || !session.user.emailVerified) {
                return res.status(401).json({
                    message: "Unauthorized"
                })
            }
            if (role.length > 0 && !role.includes(session.user.role as UserRole)) {
                return res.status(403).json({
                    message: "Forbidden ( you don't have the required role to access this resource )"
                })
            }

            req.user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role as string,
                emailVerified: session.user.emailVerified
            };

            next();
        } catch (error) {
            next(error)
            return res.status(401).json({
                message: "Unauthorized",
                error: error instanceof Error ? error.message : "Unknown error"
            })
        }

    }
}
