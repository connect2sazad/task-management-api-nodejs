import 'dotenv/config';

import AppException from '../errors/AppException.js';
import HTTP_STATUS from '../errors/status_codes.js';

// API Configurations
export const PROJECT_NAME = getRequiredEnv('PROJECT_NAME', 'task-management-api');
export const PROJECT_TITLE = getRequiredEnv('PROJECT_TITLE', 'Task Management API');
export const PORT = getRequiredEnv('PORT', 3333);
export const ENVIRONMENT = getRequiredEnv('ENVIRONMENT');
export const API_PREFIX = getRequiredEnv('API_PREFIX', '/api/v1');
export const API_VERSION = getRequiredEnv('API_VERSION', '1.0.0');

// JWT Configuration
export const JWT_SECRET_KEY = getRequiredEnv('JWT_SECRET_KEY');
export const JWT_EXPIRES_IN = getRequiredEnv('JWT_EXPIRES_IN', '1d');

// DB Configurations
export const DB_DIALECT = getRequiredEnv('DB_DIALECT', 'postgres');
export const DB_HOST = getRequiredEnv('DB_HOST');
export const DB_NAME = getRequiredEnv('DB_NAME');
export const DB_PORT = getRequiredEnv('DB_PORT');
export const DB_USER = getRequiredEnv('DB_USER');
export const DB_PASSWORD = getRequiredEnv('DB_PASSWORD');

// Frontend Configurqations for react/next/vite-react/etc
export const ALLOWED_ORIGINS = getRequiredEnv('ALLOWED_ORIGINS');

export function getRequiredEnv(name, defaultVal = null){
    const value = process.env[name] || defaultVal;

    if (value === undefined || value === null) {
        throw new AppException(
            HTTP_STATUS.HTTP_500_INTERNAL_SERVER_ERROR,
            `${name} is not defined in the Environment`, {
                "instructions":  `Please set the value of ${name} in .env file`,
            }
        )
    }

    return value;
}