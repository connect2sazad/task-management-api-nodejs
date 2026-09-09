import express from 'express';
import swaggerUi from 'swagger-ui-express';

import rootRouter from './root.js';
import swaggerSpec from './config/swagger.js';

// middlewares
import CORS_POLICY_MIDDLEWARE from './middlewares/cors.middleware.js'
import REQUEST_UUID_MIDDLEWARE from './middlewares/requuid.middleware.js'
import ERRORS_MIDDLEWARE from './middlewares/errors.middleware.js'

const taskapp = express();


// =========================
// Middlewares
// =========================
taskapp.use(CORS_POLICY_MIDDLEWARE);
taskapp.use(REQUEST_UUID_MIDDLEWARE);
taskapp.use(express.json());
taskapp.use(express.urlencoded({
    extended: true,
}));
// =========================
// Swagger
// =========================
taskapp.use('/swagger-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
}));

// json from swagger
taskapp.get('/swagger-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.send(swaggerSpec);
});

// =========================
// Routes
// =========================
taskapp.use(rootRouter);




taskapp.use(ERRORS_MIDDLEWARE);

export default taskapp;