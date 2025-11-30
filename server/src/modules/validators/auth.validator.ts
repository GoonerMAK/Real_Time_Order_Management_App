import {z} from "zod";

export const authLoginSchema = z.object({
    email: z.email({ message: "Invalid email address" }).optional(),
    password: z.string(),
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" }).optional(),
}).refine((data) => data.email || data.username, {
        message: "Either email or username must be provided"
});

export const authSignUpSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string(),
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" }),
});


export type AuthLogin = z.infer<typeof authLoginSchema>
export type AuthSignup = z.infer<typeof authSignUpSchema>