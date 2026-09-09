import { registry } from "./registry.js";
import { API_PREFIX } from "../config/config.js";
import { loginSchema, LoginResponseSchema } from "../schemas/auth.schema.js";
import { jsonResponse, errorResponse } from "./responses.js";

registry.registerPath({

    method: "post",

    path: API_PREFIX + "/login",

    tags: ["Authentication"],

    summary: "Login user",

    security: [],

    request: { body: { required: true, content: { "application/json": { schema: loginSchema } } } },

    responses: {
        200: jsonResponse("Login successful; JWT is in token.token", LoginResponseSchema),
        400: errorResponse("Invalid JSON body"),
        401: errorResponse("Invalid credentials or disabled account"),
        422: errorResponse("Validation failed"),
        500: errorResponse("Internal server error"),
    },
    
});