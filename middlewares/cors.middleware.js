import cors from 'cors';

import { ALLOWED_ORIGINS } from '../config/config.js';
import AppException from '../errors/AppException.js';
import HTTP_STATUS from '../errors/status_codes.js';

const allowedOrigins = ALLOWED_ORIGINS
    .split(',')
    .map((origin) => origin.trim());

const CORS_POLICY_MIDDLEWARE = cors({
    origin: (origin, callback) => {

        // allow requests without header, eg: Postman
        if (!origin) {
            return callback(null, true);
        }

        // allow origins registered in environment
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // return exception for unauthorized cors
        return callback(new AppException( HTTP_STATUS.HTTP_403_FORBIDDEN, 'Not allowed by CORS'))
    }
});

export default CORS_POLICY_MIDDLEWARE;