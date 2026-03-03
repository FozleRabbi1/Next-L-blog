import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
    try {

        const adminData = {
            name: "Admin user",
            email: "admin@example.com",
            password: "admin123",
            role: UserRole.ADMIN
        }

        const isUserExist = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })
        if (isUserExist) {
            throw new Error("Admin already exists");
        }

        const signUpAdmin = await fetch(`http://localhost:5000/api/auth/sign-up/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                origin: "http://localhost:5000"
            },
            body: JSON.stringify(adminData)
        })

        if (signUpAdmin.ok) {
            const updateAdmin = await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }

            })

            console.log(updateAdmin);

        }

    } catch (error) {
        console.error(error);

    }
}

seedAdmin()