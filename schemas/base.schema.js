import { z } from '../docs/registry.js';

export const BaseSchema = z.object({

    id: z.number().int()
        .openapi({
            example: 1
        }),

    status: z.boolean()
        .openapi({
            example: true
        }),

    created_at: z.coerce.date()
        .openapi({
            type: 'string',
            format: 'date-time',
            example: '2026-09-09T07:46:00.000Z',
        }),

    updated_at: z.coerce.date()
        .openapi({
            type: 'string',
            format: 'date-time',
            example: '2026-09-09T07:46:00.000Z',
        }),

});