import { z } from 'zod'

export const verifySchema = z.object({
    code: z
        .string({ message: "Invalid verificaton code" })
        .length(6, "Varification code must be 6 digit")
})