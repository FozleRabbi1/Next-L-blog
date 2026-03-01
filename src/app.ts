import express, { Application } from 'express';
import { postRouter } from './modules/post/post.router';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import cors from "cors";

const app: Application = express();


app.use(cors({
    origin: [process.env.APP_URL || "http://localhost:3000", "http://localhost:5173"],
    credentials: true
}));

app.use(express.json());

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use("/posts", postRouter)

export default app;