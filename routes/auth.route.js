import express from "express";

import auth_controller from '../controllers/auth.controller.js';
import validate from "../middlewares/validate.middleware.js";
import { loginSchema } from '../schemas/auth.schema.js';

const router = express.Router();

const LOGIN = '/login';

router.post(LOGIN, validate(loginSchema), async (req, res, next) => {
    await auth_controller.login(req, res, next);
});


export default router;