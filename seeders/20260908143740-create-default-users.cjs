'use strict';

const bcrypt = require('bcryptjs');

module.exports = {

    async up(queryInterface, Sequelize) {

        const password = await bcrypt.hash('Pass@123789', 12);
        const now = new Date();

        await queryInterface.bulkInsert('users', [
            {
                name: 'Sazad',
                userid: 'connect2sazad',
                password,
                status: true,
                created_at: now,
                updated_at: now
            },
            {
                name: 'Tester',
                userid: 'tester',
                password,
                status: true,
                created_at: now,
                updated_at: now
            }
        ]);

    },

    async down(queryInterface, Sequelize) {

        await queryInterface.bulkDelete('users', {
            userid: {
                [Sequelize.Op.in]: ['connect2sazad', 'tester']
            }
        });

    }

};