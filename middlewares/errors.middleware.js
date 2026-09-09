import {
    ValidationError,
    UniqueConstraintError,
    ForeignKeyConstraintError,
} from 'sequelize';

import AppException from '../errors/AppException.js';


const ERRORS_MIDDLEWARE = (
    error,
    req,
    res,
    next
) => {

    if (res.headersSent) {

        return next(error);

    }


    // -----------------------------------------
    // Invalid JSON body
    // -----------------------------------------
    if (error.type === 'entity.parse.failed') {
        return res.status(400)
            .json({
                success: false,
                code: 'INVALID_JSON',
                message: 'Request body contains invalid JSON.',
                request_id: req.reqId,
                timestamp: new Date().toISOString(),
            });
    }


    // -----------------------------------------
    // Custom application errors
    // -----------------------------------------
    if (error instanceof AppException) {

        console.error({
            request_id: req.reqId,
            status_code: error.statusCode,
            error_name: error.name,
        });

        return res.status(error.statusCode)
            .json({
                success: false,
                code: error.code,
                message: error.message,
                request_id: req.reqId,
                timestamp: error.timestamp,
                ...(Array.isArray(
                    error.errors
                ) && {
                    errors:
                        error.errors.map(
                            ({
                                field,
                                message,
                            }) => ({
                                field,
                                message,
                            })
                        ),
                }),
            });
    }


    // -----------------------------------------
    // Sequelize unique constraint
    // -----------------------------------------
    if (error instanceof UniqueConstraintError) {
        const errors = error.errors.map(
            item => ({
                field: item.path,
                message: item.message,
            })
        );


        return res.status(409)
            .json({
                success: false,
                code: 'CONFLICT',
                message: 'A record with the provided value already exists.',
                errors,
                request_id: req.reqId,
                timestamp: new Date().toISOString(),
            });
    }


    // -----------------------------------------
    // Sequelize validation
    // -----------------------------------------

    if (error instanceof ValidationError) {
        const errors = error.errors.map(
            item => ({
                field: item.path,
                message: item.message,
            })
        );

        return res.status(422)
            .json({
                success: false,
                code: 'UNPROCESSABLE_ENTITY',
                message: 'Database validation failed.',
                errors,
                request_id: req.reqId,
                timestamp: new Date().toISOString(),
            });
    }


    // -----------------------------------------
    // Foreign key violation
    // -----------------------------------------

    if (error instanceof ForeignKeyConstraintError) {

        return res.status(409)
            .json({
                success: false,
                code: 'FOREIGN_KEY_CONSTRAINT',
                message: 'The related record does not exist or cannot be modified.',
                request_id: req.reqId,
                timestamp: new Date().toISOString(),
            });
    }


    // -----------------------------------------
    // Unknown/internal server error
    // -----------------------------------------
    console.error({
        request_id: req.reqId,
        status_code: 500,
        error_name: error.name || 'Error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development'
            ? error.stack
            : undefined,
    });


    return res
        .status(500)
        .json({
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An internal server error occurred.',
            request_id: req.reqId,
            timestamp: new Date().toISOString(),
        });

};


export default ERRORS_MIDDLEWARE;