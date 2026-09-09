import express from 'express';

import { API_VERSION, PROJECT_TITLE } from '../config/config.js';
import sequelize from '../config/sequelize.js';
import HTTP_STATUS from '../errors/status_codes.js';
import { structurize_response } from '../includes/helpers.js';

const router = express.Router();

const HEALTH = '/health';
const READY = '/health/ready';

router.get(HEALTH, (req, res) => {
    return res.status(HTTP_STATUS.HTTP_200_OK.status_code).json(
        structurize_response(
            true,
            "API is ready to take requests. Check Readiness at /health/ready",
            {
                healthy: true,
                project_title: PROJECT_TITLE,
                api_version: API_VERSION,
                check_readiness: READY,
            }
        )
    );
});

router.get(READY, async (req, res) => {
    try {
        await sequelize.authenticate();

        return res
            .status(HTTP_STATUS.HTTP_200_OK.status_code)
            .json(
                structurize_response(
                    true,
                    "Database is ready and connected to take requests.",
                    {
                        ready: true,
                        database: "connected",
                        project_title: PROJECT_TITLE,
                        api_version: API_VERSION,
                    }
                )
            );
    } catch (error) {
        console.error("Readiness check failed:", error);

        return res
            .status(
                HTTP_STATUS.HTTP_503_SERVICE_UNAVAILABLE.status_code
            )
            .json(
                structurize_response(
                    false,
                    "Unable to communicate with the database.",
                    {
                        ready: false,
                        database: "disconnected",
                        project_title: PROJECT_TITLE,
                        api_version: API_VERSION,
                    }
                )
            );
    }
});



export default router;