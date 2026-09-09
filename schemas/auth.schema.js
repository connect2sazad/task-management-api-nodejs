import { z } from "../docs/registry.js";
import { UserSchema } from './user.schema.js'
import { createSuccessResponseSchema } from "../docs/responses.js";

export const loginSchema = z.object({

    userid: z.string().trim().min(3).max(50)
        .openapi({
            example: "tester",
            description: "User ID",
        }),

    password: z.string().min(6).max(255)
        .openapi({
            example: "Pass@123789",
            description: "User Password",
        }),
}).openapi('LoginRequest');

export const TokenSchema = z.object({

    token: z.string(),

    token_type: z.literal("Bearer"),

    expires_in: z.string()
        .openapi({
            example: "1d"
        }),

}).openapi("Token");

export const LoginResponseSchema = createSuccessResponseSchema(
    "LoginResponse",
    UserSchema,
    {
        token: TokenSchema,
    })
    .openapi("LoginResponse");