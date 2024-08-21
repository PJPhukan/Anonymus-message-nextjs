import { UserModel } from "@/model/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnection";
import mongoose from "mongoose";

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
    const userId = new mongoose.Types.ObjectId(user?._id)

    try {

        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId,
                }
            },
            {
                $unwind: '$messages'
            },
            {
                $sort: {
                    "messages.createdAt": -1,
                }
            },
            {
                $group:{
                    _id:'$_id',
                    messages: {
                        $push: "$messages"
                    }
                }
            }
        ])

        if(!user || user.length === 0){
            return Response.json({
                success: false,
                message: "No messages found",
                statusCode: 404
            }, {
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: "Successfully get messages",
            messages: user[0].messages,
            statusCode: 200
        }, {
            status: 200
        })

    } catch (error) {
        console.error("Failed to get message", error)
        return Response.json({
            success: false,
            message: "Failed to get message ",
            statusCode: 500
        }, {
            status: 500
        })
    }
}