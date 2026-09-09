import HTTP_STATUS from './status_codes.js';

export default class AppException extends Error {

    constructor(status = HTTP_STATUS.HTTP_500_INTERNAL_SERVER_ERROR, message = null, custom = {}) {
        super(message || status.message);
        this.name = 'TaskAppException';
        this.statusCode = status.status_code;
        this.code = status.code;
        this.timestamp = new Date().toISOString();

        if (custom && typeof custom === 'object' && !Array.isArray(custom) && Object.keys(custom).length > 0) {
            Object.assign(this, custom);
        }

        Error.captureStackTrace?.(this, this.constructor);
    }
}