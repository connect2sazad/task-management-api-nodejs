import BaseController from "./base.controller.js";
import { Task, User } from '../models/index.js';
import { TaskCreateSchema, TaskSchema, TaskUpdateSchema } from '../schemas/task.schema.js';

class TaskController extends BaseController{

    constructor(){
        super(Task, {
            schema: TaskSchema,
            createSchema: TaskCreateSchema,
            updateSchema: TaskUpdateSchema,
            creator: true,
            includes: [
                {
                    model: User,
                    as: 'creator'
                },
                {
                    model: User,
                    as: 'updater'
                }
            ],
            searchFields: [
                'title'
            ],
        });
    }

}

const task_controller = new TaskController();
export default task_controller;