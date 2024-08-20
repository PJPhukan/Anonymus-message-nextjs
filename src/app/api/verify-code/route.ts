import dbConnect from "@/lib/dbConnection";
import { UserModel } from "@/model/User.model";
import { verifySchema } from "@/Schemas/VerifySchema";
export async function POST(request: Request) {
    await dbConnect()
    try {
        const { code, username } = await request.json();

        const decodeUsername = decodeURIComponent(username)// it basically use when we passed value in the url from the client side and we need to decode the url component 

        const validationResult = verifySchema.safeParse({ code })

        if (!validationResult.success) {
            const varificationCodeError = validationResult.error.format().code?._errors || []
            return Response.json({
                success: false,
                message: varificationCodeError.length > 0 ? varificationCodeError.join(" ,\n") : "Invalid verification code",
                statusCode: 400
            }, {
                status: 400
            })

        }

        const user = await UserModel.findOne({ username: decodeUsername })

        if (!user) {
            return Response.json({
                success: false,
                message: "No user found with this username",
                statusCode: 404
            }, {
                status: 404
            })
        }

        const isValidVarificationCode = user.verifyCode === code;
        const isCodeNoExpary = new Date(user.verifyCodeExp) > new Date()
        if (isValidVarificationCode && isCodeNoExpary) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "Verification successful",
                statusCode: 200
            }, {
                status: 200
            })
        }
        else if (!isCodeNoExpary) {
            await user.deleteOne();
            return Response.json({
                success: false,
                message: "Verification code has expired.Plese signup again.",
                statusCode: 400
            }, {
                status: 400
            })
        }
        else {
            return Response.json({
                success: false,
                message: "Incorrect varification code",
                statusCode: 400
            }, {
                status: 400
            })
        }

    } catch (error) {
        console.error("Verify code error", error);
        return Response.json({
            success: false,
            message: "Failed to verify code",
            statusCode: 500
        }, {
            status: 500
        })
    }
}