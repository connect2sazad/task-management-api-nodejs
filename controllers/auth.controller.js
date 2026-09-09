import bcrypt from 'bcryptjs';

import { User } from '../models/index.js';
import AppException from "../errors/AppException.js";
import HTTP_STATUS from "../errors/status_codes.js";
import { UserSchema } from '../schemas/user.schema.js';
import { generate_jwt } from "../middlewares/auth.middleware.js";
import { structurize_response } from '../includes/helpers.js';

class AuthController {
    async login(req, res, next) {

        try {

            const { userid, password } = req.body;

            const user = await User.findOne({
                where: {
                    userid,
                    deleted_at: null,
                },
            });

            if (!user) {
                throw new AppException(
                    HTTP_STATUS.HTTP_401_UNAUTHORIZED,
                    'Incorrect Authentication detailss.'
                );
            }

            if (!user.status) {
                throw new AppException(
                    HTTP_STATUS.HTTP_401_UNAUTHORIZED,
                    `Your account has been disabled!`
                );
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                throw new AppException(
                    HTTP_STATUS.HTTP_401_UNAUTHORIZED,
                    `Incorrect Authentication detailss.`
                );
            }

            const userData = UserSchema.parse(user.toJSON());

            const token_d = generate_jwt({
                id: userData.id,
                userid: userData.userid,
                name: userData.name,
            });

            return res.status(
                HTTP_STATUS.HTTP_200_OK.status_code
            ).json(structurize_response(
                true,
                "Login Successfull",
                userData,
                {
                    token: token_d
                }
            ));

        } catch (e) {

            next(e);

        }

    }
}

const auth_controller = new AuthController();
export default auth_controller;