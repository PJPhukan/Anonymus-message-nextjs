import { z } from 'zod'

export const MessageSchema = z.object({
    content: z
        .string()
        .min(8, { message: "Content must be at least 8 character" })
        .max(1000, { message: "Content must not exceed 1000 characters" })
})