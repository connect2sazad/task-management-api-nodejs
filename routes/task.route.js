import express from "express";

import { TaskCreateSchema, TaskIdParamSchema, TaskUpdateSchema } from '../schemas/task.schema.js';
import { authenticate_jwt } from "../middlewares/auth.middleware.js";
import task_controller from "../controllers/task.controller.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

const TASKS = '/tasks';
const TASK_ID = TASKS + '/:id';

// get tasks list
// params:
// ?page=1
// ?limit=10
// ?search=test
// ?status=true
router.get(TASKS, authenticate_jwt, async (req, res, next) => {
    await task_controller.get(req, res, next);
});

// get task by id
router.get(TASK_ID, authenticate_jwt, validate(TaskIdParamSchema, 'params'), async (req, res, next) => {
    await task_controller.get(req, res, next);
});

// post/create a task
router.post(TASKS, authenticate_jwt, validate(TaskCreateSchema), async (req, res, next) => {
    await task_controller.create(req, res, next);
});

// put/update a task by id
router.put(TASK_ID, authenticate_jwt, validate(TaskIdParamSchema, 'params'), validate(TaskUpdateSchema), async (req, res, next) => {
    await task_controller.update(req, res, next);
});

// delete a task by id
router.delete(TASK_ID, authenticate_jwt, validate(TaskIdParamSchema, 'params'), async (req, res, next) => {
    await task_controller.delete(req, res, next);
});


export default router;