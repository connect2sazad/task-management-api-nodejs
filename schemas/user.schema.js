import { z } from 'zod';
import { BaseSchema } from './base.schema.js';

export const UserSchema = BaseSchema.extend({

    userid: z.string()
        .openapi({
            example: "tester"
        }),

    name: z.string()
        .openapi({
            example: "Tester",
        }),

}).openapi("User");