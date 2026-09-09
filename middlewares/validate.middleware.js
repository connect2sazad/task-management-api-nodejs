import AppException from "../errors/AppException.js";
import HTTP_STATUS from "../errors/status_codes.js";

const validate = (schema, source = 'body') => {

    return async (req, res, next) => {

        try{

            const result = schema.safeParse(req[source]);

            if(!result.success){

                const errors = result.error.issues.map(
                    issue => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })
                );

                throw new AppException(
                    HTTP_STATUS.HTTP_422_UNPROCESSABLE_ENTITY,
                    'Validation failed!',
                    {
                        errors
                    }
                );

            }

            // replace request data with validated data
            req[source] = result.data;

            return next();

        } catch(e){

            return next(e);

        }

    }

}

export default validate;