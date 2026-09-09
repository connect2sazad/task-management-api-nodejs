import { z } from "zod";

const BooleanQuerySchema = z.preprocess(
    (value) => {

        if (value === undefined || value === null || value === "") {
            return undefined;
        }

        if (value === true || value === "true" || value === "1") {
            return true;
        }

        if (value === false || value === "false" || value === "0") {
            return false;
        }

        return value;

    },

    z.boolean().optional()
);

export const PaginationSchema = z.object({

    page: z.coerce.number().int().min(1).default(1)
        .openapi({
            example: 1,
            description: "Current page number",
        }),

    limit: z.coerce.number().int().min(1).max(100).default(10)
        .openapi({
            example: 10,
            description: "Number of records per page",
        }),

    search: z.string().trim().optional()
        .openapi({
            example: "swagger",
            description: "Search tasks by title",
        }),

    status: BooleanQuerySchema
        .openapi({
            example: true,
            description: "Filter records by status", 
        }),

}).openapi("TaskQuery");

export const PaginationResponseSchema = z.object({

    page: z.number().int().min(1),

    limit: z.number().int().min(1).max(100),

    total: z.number().int().min(0),

    total_pages: z.number().int().min(0),

    has_next_page: z.boolean(),

    has_previous_page: z.boolean(),

}).openapi("Pagination");

export const TaskFiltersSchema = z.object({

    search: z.string().nullable(),

    status: z.boolean().nullable(),
    
}).openapi("TaskFilters");