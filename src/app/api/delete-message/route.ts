import dbConnect from "@/lib/dbConnection";
import { UserModel } from "@/model/User.model";
import { Message } from "@/model/User.model";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
export async function DELETE(request: Request) {
    await dbConnect()
    try {

        const { messageId } = await request.json();

        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
        
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Not authenticated",
                statusCode: 401
            })
        }
        const userId = new mongoose.Types.ObjectId(user?._id)
        const UserDetails = await UserModel.findById(userId)
        if (!UserDetails) {
            return Response.json({
                success: false,
                message: "User not found",
                statusCode: 404
            })
        }

      
        UserDetails.messages = UserDetails.messages.filter((message: Message) => {
            return message._id.toString() !== messageId
        })

        await UserDetails.save()


        return Response.json({
            success: true,
            message: "Message deleted successfully",
            statusCode: 200
        }, {
            status: 200
        })

    } catch (error) {
       
        return Response.json({
            success: false,
            message: "Failed to delete message",
            statusCode: 500
        }, {
            status: 500
        })
    }



}