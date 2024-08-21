import { UserModel } from "@/model/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnection";
import mongoose from "mongoose";
import { Message } from "@/model/User.model";


export async function POST(request: Request) {
    await dbConnect()
    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "Not found user",
                    statusCode: 404
                },
                {
                    status: 404
                }
            )
        }

        if (!user.isAccept) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting the messages",
                    statusCode: 403
                },
                {
                    status: 403
                }
            )
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
                statusCode: 201
            },
            {
                status: 201
            }
        )
    } catch (error) {
        console.error("Failed to send message", error)
        return Response.json({
            success: false,
            message: "Failed to send message",
            statusCode: 500
        }, {
            status: 500
        })
    }
}