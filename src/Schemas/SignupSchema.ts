import { z } from 'zod'

//individual validation for a field
export const usernameValidation = z
    .string()
    .min(3, "Username must be atleast 2 characters")
    .max(15, "Username must be no more than 15 character")
    .regex(/^[a-zA-Z0-9]+$/, "Username can only contain alphanumeric characters")


//validation for multiple field
export const signUpSchema = z.object({
    username: usernameValidation,

    email: z
        .string()
        .email({ message: "Invalid email address" }),

    password: z.string()
        .min(8, {
            message: "Password must be at least 8 characters"
        })
        .regex(/[a-z]+/, { message: "Password should be contain atleast one lower case" })
        .regex(/[A-Z]+/, { message: "Password should be contain atleast one upper case" })
        .regex(/[0-9]+/, { message: "Password should be contain atleast one number" })
        .regex(/[^a-zA-Z0-9]+/, { message: "Password should be contain atleast one speacial character" })


})