import { registry, bearerAuth } from "./registry.js";
import { API_PREFIX } from "../config/config.js";
import { PaginationSchema } from "../schemas/pagination.schema.js";
import { TaskCreateSchema, TaskUpdateSchema, TaskIdParamSchema, TaskResponseSchema, TaskListResponseSchema } from "../schemas/task.schema.js";
import { jsonResponse, errorResponse, EmptyResponseSchema } from "./responses.js";

const tasks = API_PREFIX + "/tasks";
const common = {
    tags: ["Tasks"],
    security: [{ [bearerAuth.name]: [] }],
};
const errors = {
    401: errorResponse("Missing, invalid, expired or revoked token; unavailable account"),
    500: errorResponse("Internal server error"),
};
const writeErrors = {
    ...errors,
    400: errorResponse("Invalid JSON body"),
    409: errorResponse("Database constraint conflict"),
    422: errorResponse("Validation failed"),
};
const body = (schema) => ({ required: true, content: { "application/json": { schema } } });

registry.registerPath({
    ...common,
    method: "get",
    path: tasks,
    summary: "List tasks",
    description: "Search by title, filter by status and paginate. Newest created tasks come first.",
    request: { query: PaginationSchema },
    responses: {
        ...errors,
        200: jsonResponse("Tasks with pagination and filters", TaskListResponseSchema),
        422: errorResponse("Invalid query parameters"),
    },
});

registry.registerPath({
    ...common,
    method: "get",
    path: tasks + "/{id}",
    summary: "Get task by ID",
    request: { params: TaskIdParamSchema },
    responses: {
        ...errors,
        200: jsonResponse("Task retrieved", TaskResponseSchema),
        404: errorResponse("Task not found"),
    },
});

registry.registerPath({
    ...common,
    method: "post",
    path: tasks,
    summary: "Create task",
    request: { body: body(TaskCreateSchema) },
    responses: { ...writeErrors, 201: jsonResponse("Task created", TaskResponseSchema) },
});

registry.registerPath({
    ...common,
    method: "put",
    path: tasks + "/{id}",
    summary: "Update task",
    description: "Only supplied fields are updated. The current schema also accepts an empty object.",
    request: { params: TaskIdParamSchema, body: body(TaskUpdateSchema) },
    responses: {
        ...writeErrors,
        200: jsonResponse("Task updated", TaskResponseSchema),
        404: errorResponse("Task not found"),
    },
});

registry.registerPath({
    ...common,
    method: "delete",
    path: tasks + "/{id}",
    summary: "Delete task",
    request: { params: TaskIdParamSchema },
    responses: {
        ...errors,
        200: jsonResponse("Task deleted; data is an empty object", EmptyResponseSchema),
        404: errorResponse("Task not found"),
        409: errorResponse("Database constraint conflict"),
    },
});