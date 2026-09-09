import jwt from 'jsonwebtoken';

import AppException from '../errors/AppException.js';
import { JWT_EXPIRES_IN, JWT_SECRET_KEY } from '../config/config.js';
import HTTP_STATUS from '../errors/status_codes.js';
import TokenBlacklist from '../models/blacklist-token.model.js';
import { User } from '../models/index.js';

export const authenticate_jwt = async (req, res, next) => {

    try {

        const authorization = req.headers.authorization;

        if (!authorization) {
            throw new AppException(
                HTTP_STATUS.HTTP_401_UNAUTHORIZED,
                'Authorization token is required!'
            );
        }

        const [type, token] = authorization.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new AppException(
                HTTP_STATUS.HTTP_401_UNAUTHORIZED,
                'Invalid Authorization format!'
            );
        }

        const verified_token = jwt.verify(
            token,
            JWT_SECRET_KEY
        );

        const blacklistedToken = await TokenBlacklist.findOne({
            where: {
                token,
            }
        });

        if (blacklistedToken) {
            throw new AppException(
                HTTP_STATUS.HTTP_401_UNAUTHORIZED,
                'Authentication Token has been revoked!',
            );
        }

        const user = await User.findByPk(verified_token.id);

        if (!user || !user.status) {
            throw new AppException(
                HTTP_STATUS.HTTP_401_UNAUTHORIZED,
                `Either your account is unavailable or has been disabled`
            );
        }

        req.user = user;
        req.auth = verified_token;
        req.token = token;

        next();

    } catch (e) {

        if(
            e instanceof jwt.JsonWebTokenError ||
            e instanceof jwt.TokenExpiredError ||
            e instanceof jwt.NotBeforeError
        ){
            return next(
                new AppException(
                    HTTP_STATUS.HTTP_401_UNAUTHORIZED,
                    'Invalid or Expired Authentication Token.'
                )
            );
        }

        return next(e);
    }

}

export const generate_jwt = (data) => {

    const token = jwt.sign(
        {
            id: data.id,
            userid: data.userid,
            name: data.name,
        },
        JWT_SECRET_KEY,
        {
            expiresIn: JWT_EXPIRES_IN,
        }
    );

    return {
        token: token,
        token_type: 'Bearer',
        expires_in: JWT_EXPIRES_IN,
    }

}