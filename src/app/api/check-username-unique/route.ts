import dbConnect from "@/lib/dbConnection";
import { UserModel } from "@/model/User.model";
import { usernameValidation } from "@/Schemas/SignupSchema";
import { z } from 'zod'
const usernameValidationSchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const queryParams = {
            username: searchParams.get("username") //how to extract query perameter from url
        }

        //validate username with zod
        const validationResult = usernameValidationSchema.safeParse(queryParams)
        console.log("Print validateResult", validationResult) //TODO: Remove

        if (!validationResult.success) {
            const usernameError = validationResult.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameError.length > 0 ? usernameError.join(" ,\n") : "Invalid username",
                statusCode: 400
            }, {
                status: 400
            })

        }

        const { username } = validationResult.data

        const user = await UserModel.findOne({ username, isVerified: true })

        if (user) {
            return Response.json({
                success: false,
                message: "Username already taken",
                statusCode: 404
            }, {
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: "Username is unique",
            statusCode: 200
        }, {
            status: 200
        })
    } catch (error) {
        console.error("Error checking username :", error)
        return Response.json({
            success: false,
            message: "Error checking username",
            statusCode: 500
        }, { status: 500 })
    }
}