import { z } from "./registry.js";

export const MetadataSchema = z.object({
    timestamp: z.string().datetime(),
}).openapi("ResponseMetadata");

export const ErrorResponseSchema = z.object({
    success: z.literal(false),
    code: z.string(),
    message: z.string(),
    request_id: z.string().uuid(),
    timestamp: z.string().datetime(),
    errors: z.array(z.object({
        field: z.string().nullable().optional(),
        message: z.string(),
    })).optional(),
}).openapi("ErrorResponse");

export const createSuccessResponseSchema = (name, dataSchema, extras = {}) => {
    return z.object({
        success: z.literal(true),
        message: z.string(),
        data: dataSchema,
        ...extras,
        metadata: MetadataSchema,
    }).openapi(name);
};

export const EmptyResponseSchema = createSuccessResponseSchema("EmptyResponse", z.object({}));

export const jsonResponse = (description, schema) => ({
    description,
    content: { "application/json": { schema } },
});

export const errorResponse = (description) => jsonResponse(description, ErrorResponseSchema);