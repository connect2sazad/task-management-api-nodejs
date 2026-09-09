import { z } from "../docs/registry.js";
import { BaseSchema } from './base.schema.js';
import { UserSchema } from './user.schema.js';
import { PaginationResponseSchema, TaskFiltersSchema } from "./pagination.schema.js";
import { createSuccessResponseSchema } from "../docs/responses.js";

export const TaskSchema = BaseSchema.extend({

    title: z.string()
        .openapi({
            example: "Swagger documentation",
        }),

    description: z.string()
        .openapi({
            example: "Swagger Documentation is ready to be viewed",
        }),


    creator: UserSchema.optional(),

    updater: UserSchema.optional(),

}).openapi('Task');

export const TaskCreateSchema = z.object({

    title: z.string().min(3).max(50)
        .openapi({
            example: "Create Swagger documentation",
        }),

    description: z.string().min(3).max(250)
        .openapi({
            example: "Swagger Documentation needs to be created",
        }),

    status: z.boolean().default(true)
        .openapi({
            example: true,
        }),

}).openapi('TaskCreateRequest');

export const TaskUpdateSchema = z.object({

    title: z.string().min(3).max(50).optional()
        .openapi({
            example: "Update Swagger documentation",
        }),

    description: z.string().min(3).max(250).optional()
        .openapi({
            example: "Swagger Documentation needs to be updated",
        }),

    status: z.boolean()
        .optional().openapi({
            example: true,
        }),

}).openapi('TaskUpdateRequest');

export const TaskIdParamSchema = z.object({

    id: z.coerce.number().int().positive()
        .openapi({
            example: 1,
            description: "Task ID",
            param: {
                name: "id",
                in: "path"
            }
        }),

});

export const TaskResponseSchema = createSuccessResponseSchema("TaskResponse", TaskSchema);

export const TaskListResponseSchema = createSuccessResponseSchema("TaskResponse", z.object({

    data: z.array(TaskSchema)

}), {
    pagination: PaginationResponseSchema,
    filters: TaskFiltersSchema
});