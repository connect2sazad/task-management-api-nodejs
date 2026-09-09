import { Sequelize } from "sequelize";

import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, ENVIRONMENT, DB_DIALECT, PROJECT_NAME } from "./config.js";


const sequelize = new Sequelize(
    DB_NAME, DB_USER, DB_PASSWORD,
    {
        host: DB_HOST,
        port: DB_PORT,
        dialect: DB_DIALECT,

        logging: ENVIRONMENT === 'development' ? console.log : false,

        pool: {
            max: 10,
            min: 0,
            acquire: 30_000,
            idle: 10_000,
        },

        dialectOptions: {
            application_name: PROJECT_NAME,
        }
    }
);

export default sequelize;