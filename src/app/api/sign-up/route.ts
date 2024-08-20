import dbConnect from "@/lib/dbConnection";
import { UserModel } from "@/model/User.model";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendMail";
import { ApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    // Connect to the database
    await dbConnect();

    try {
        // Extract data from the request object
        const { username, email, password } = await request.json();

        // Check if the email already exists
        const existingUser = await UserModel.findOne({ email });

        // Generate a verification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiry date for the verification code (1 hour from now)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        let response: ApiResponse;

        if (existingUser) {
            if (existingUser.isVerified) {
                response = {
                    success: false,
                    message: "Email already registered and verified",
                    statusCode: 409,
                };
                return NextResponse.json(response);
            } else {
                // Update the user's password and verification details
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUser.password = hashedPassword;
                existingUser.verifyCode = verifyCode;
                existingUser.verifyCodeExp = expiryDate;
                await existingUser.save();
            }
        } else {
            // Create a new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExp: expiryDate,
                isVerified: false,
                isAccept: true,
                messages: [],
            });

            console.log("Newly Registered user:", user);

            // Check if user creation failed
            if (!user) {
                response = {
                    success: false,
                    message: "Failed to create user",
                    statusCode: 500,
                };
                return NextResponse.json(response);
            }
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        console.log(emailResponse);

        // If failed to send the email, return an error message
        if (!emailResponse.success) {
            response = {
                success: false,
                message: "Failed to send verification email",
                statusCode: emailResponse.statusCode,
            };
            return NextResponse.json(response);
        }

        // If email sent successfully, return a success message
        response = {
            success: true,
            message: "User registered successfully. Please verify your email.",
            statusCode: 201,
        };
        return NextResponse.json(response);

    } catch (signinError) {
        console.error("User registering error", signinError);
        const response: ApiResponse = {
            success: false,
            message: "Sign in error",
            statusCode: 401,
        };
        return NextResponse.json(response);
    }
}
