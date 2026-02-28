import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification : true,
        sendVerificationEmail: async ({ user, url, token }, request) => {

            try {
                const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

                const info = await transporter.sendMail({
                    from: '"Prisma Blog" <prisma@blog.com>',
                    to: user.email,
                    subject: "Verify Your Email Address",
                    text: `Hello,
Thank you for signing up for Prisma Blog.
Please verify your email address by clicking the link below:
${verificationUrl}
If you did not create this account, you can safely ignore this email.
Best regards,
Prisma Blog Team
  `,
                    html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px;">
      <h2 style="color: #333333; text-align: center;">Verify Your Email</h2>      
      <p style="color: #555555; font-size: 16px;">
        Thank you for signing up for <strong>Prisma Blog</strong>.
      </p>      
      <p style="color: #555555; font-size: 16px;">
        Please confirm your email address by clicking the button below:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #4F46E5; color: #ffffff; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-size: 16px; 
                  display: inline-block;">
          Verify Email
        </a>
      </div>
      <p style="color: #777777; font-size: 14px;">
        Or copy and paste this link into your browser:
      </p>
      <p class="link" style="color: #777777; font-size: 14px;">
        url == ${url}
      </p>
      <p style="word-break: break-all; color: #4F46E5; font-size: 14px;">
        ${verificationUrl}
      </p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eeeeee;" />
      <p style="color: #999999; font-size: 13px; text-align: center;">
        If you did not create an account, you can safely ignore this email.
      </p>
      <p style="color: #999999; font-size: 13px; text-align: center;">
        © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
      </p>
    </div>
  </div>
  `,
                });
                console.log("Message sent:", info.messageId);
            } catch (error) {
                console.error("error sending verification email", error);
                throw error;
            }

        },
    },
    trustedOrigins: [
        process.env.APP_URL ||
        "http://localhost:3000",
        "http://localhost:5173"
    ]
});