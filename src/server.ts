import app from "./app";
import { prisma } from "./lib/prisma";
const port = process.env.PORT || 5000;

async function main() {
    try {
        await prisma.$connect();
        console.log("database connected");

        app.listen(port, () => {
            console.log(`server is running on port http://localhost:${port}`);
        });

    }
    catch (err) {
        console.error(err);
        await prisma.$disconnect();
        process.exit(1);

    }
}

main();