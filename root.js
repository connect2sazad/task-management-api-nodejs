import express from 'express';

import HTTP_STATUS from './errors/status_codes.js';

// routes
import HealthRouter from './routes/health.route.js';
import AuthRouter from './routes/auth.route.js';
import TaskRouter from './routes/task.route.js';
import { API_PREFIX } from './config/config.js';

const router = express.Router();

router.get('/', (req, res) => {
    return res.status(
        HTTP_STATUS.HTTP_200_OK.status_code
    ).json({
        success: true,
        message: "Task Management API is working!",
        swagger_docs: "http://127.0.0.1:3333/swagger-docs/",
        swagger_json: "http://127.0.0.1:3333/swagger-docs.json"
    });
});

router.use(HealthRouter);
router.use(API_PREFIX, AuthRouter);
router.use(API_PREFIX, TaskRouter);

export default router;