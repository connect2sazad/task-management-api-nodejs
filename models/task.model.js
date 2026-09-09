import { DataTypes } from 'sequelize';

import sequelize from '../config/sequelize.js';

import {
    baseFields,
    baseOptions
} from './base.model.js';


const Task = sequelize.define(
    'Task',
    {
        ...baseFields,

        title: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        description: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },

        creator_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            index: true,
        },

        updater_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            index: true,
        }

    },
    {
        ...baseOptions,
        tableName: 'tasks',
    }
);

export default Task;