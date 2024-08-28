import { UserModel } from "@/model/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnection";


export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated",
            statusCode: 401
        }, {
            status: 401
        })
    }
    const userId = user?._id
    const { acceptmessage } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            isAccept: acceptmessage
        }, {
            new: true
        })

        if (!updatedUser) {
            return Response.json({
                success: false, message: "Please authenticate with a valid credentials",
                statusCode: 401
            }, {
                status: 401
            })
        }
        return Response.json({
            success: true,
            message: "Acceptenence message updated successfully",
            updatedUser,
            statusCode: 200
        }, {
            status: 200
        })

    } catch (error) {
        console.error("Failed to update user status to accept messages")
        return Response.json({
            success: false,
            message: "Failed to update user status",
            statusCode: 500
        }, {
            status: 500
        })
    }
}



export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated",
            statusCode: 401
        }, {
            status: 401
        })
    }
    const userId = user?._id
    try {
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found",
                statusCode: 404
            }, {
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: "Successfully get user status",
            isAcceptingMessage: foundUser.isAccept,
            statusCode: 200
        }, {
            status: 200
        })
    } catch (error) {
        console.error("Failed to get user status", error)
        return Response.json({
            success: false,
            message: "Failed to get user acceptence status",
            statusCode: 500
        }, {
            status: 500
        })
    }

}