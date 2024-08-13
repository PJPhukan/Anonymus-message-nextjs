import { resend } from "@/lib/resend";
import varificationMail from "../../emails/varification"
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (
    email: string,
    username: string,
    verificationCode: string
): Promise<ApiResponse> => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Anonymus Message Varification Code',
            react: varificationMail({ username: username, otp: verificationCode }),
        });

        if (error) {
            console.error("Failed to send email", error);
            return { success: false, statusCode: 500, message: "Failed to send email" }
        }

        return { success: true, statusCode: 200, message: "Varificatio email send successfully" }

    } catch (emailError) {

        console.error("Failed to send varification email", emailError);
        return { success: false, statusCode: 500, message: "Failed to send varification email" }
    }
}