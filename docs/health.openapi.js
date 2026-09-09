import { registry, z } from "./registry.js";
import { createSuccessResponseSchema, MetadataSchema, jsonResponse } from "./responses.js";

const HealthResponseSchema = createSuccessResponseSchema("HealthResponse", z.object({
    healthy: z.literal(true),
    project_title: z.string(),
    api_version: z.string(),
    check_readiness: z.literal("/health/ready"),
}));
const readinessData = (ready, database) => z.object({
    ready: z.literal(ready),
    database: z.literal(database),
    project_title: z.string(),
    api_version: z.string(),
});
const ReadyResponseSchema = createSuccessResponseSchema("ReadyResponse", readinessData(true, "connected"));
const NotReadyResponseSchema = z.object({
    success: z.literal(false),
    message: z.string(),
    data: readinessData(false, "disconnected"),
    metadata: MetadataSchema,
}).openapi("NotReadyResponse");

registry.registerPath({
    method: "get",
    path: "/health",
    tags: ["Health"],
    summary: "Health check",
    security: [],
    responses: { 200: jsonResponse("Application is running", HealthResponseSchema) },
});

registry.registerPath({
    method: "get",
    path: "/health/ready",
    tags: ["Health"],
    summary: "Database readiness check",
    security: [],
    responses: {
        200: jsonResponse("Database is connected", ReadyResponseSchema),
        503: jsonResponse("Database is unavailable", NotReadyResponseSchema),
    },
});