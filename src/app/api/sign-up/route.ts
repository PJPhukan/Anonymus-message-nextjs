import dbConnect from "@/lib/dbConnection";
import { UserModel } from "@/model/User.model";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendMail";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: Request): Promise<ApiResponse> {

    //connect with database
    await dbConnect()

    try {
        //extract all data from request objects
        const { username, email, password } = await request.json();

        //check, email is already exist or not
        const existingUser = await UserModel.findOne({ email });

        //generate varification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        //set expiraty date
        const expiryDate = new Date()

        //set only one hours expiry time
        expiryDate.setHours(expiryDate.getHours() + 1)

        if (existingUser) {
            //if user is already registered and verified
            if (existingUser.isVerified) {
                return {
                    success: false,
                    message: "Email already registered and verified",
                    statusCode: 409
                }
            }
             //if user is already registered but not verified
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUser.password = hashedPassword;
                existingUser.verifyCode = verifyCode;
                existingUser.verifyCodeExp = expiryDate;
                await existingUser.save()
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);

            //create a new user 
            const user = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExp: expiryDate,
                isVerified: false,
                isAccept: true,
                messages: []

            })
            
            console.log("Newly Registered user :", user)

            //check user creation 
            if (!user) {
                return { success: false, message: "Failed to create user", statusCode: 500 }
            }
        }

        //send verification email to user
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        console.log(emailResponse)

        //if failed to send email, return an error message
        if (!emailResponse.success) {
            return { success: false, message: "Failed to send varification email", statusCode: emailResponse.statusCode }
        }

        //if email sent successfully, return a success message
        return { success: true, message: "User Regiter successfully. Please verify your email.", statusCode: 201 }

    } catch (signinError) {
        console.error("User registering error", signinError);
        return { success: false, message: "Sign in error", statusCode: 401 }
    }
}