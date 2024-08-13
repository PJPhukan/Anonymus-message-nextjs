import { Message } from "@/model/User.model";

export interface ApiResponse {
    success: boolean;
    message: string;
    statusCode: number;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>;

}