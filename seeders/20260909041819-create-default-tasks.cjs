'use strict';

module.exports = {

    async up(queryInterface, Sequelize) {

        const [users] = await queryInterface.sequelize.query(`
            SELECT id, userid
            FROM users
            WHERE userid IN ('connect2sazad', 'tester')
            AND deleted_at IS NULL
        `);

        const sazad = users.find(user => user.userid === 'connect2sazad');
        const tester = users.find(user => user.userid === 'tester');

        if (!sazad || !tester) {
            throw new Error('Default users must be seeded before default tasks.');
        }

        const now = new Date();

        await queryInterface.bulkInsert('tasks', [
            {
                title: 'Setup project',
                description: 'Setup Node.js Express project structure',
                status: true,
                creator_id: sazad.id,
                updater_id: sazad.id,
                created_at: now,
                updated_at: now,
                deleted_at: null
            },
            {
                title: 'Create authentication',
                description: 'Implement JWT based user authentication',
                status: true,
                creator_id: sazad.id,
                updater_id: sazad.id,
                created_at: now,
                updated_at: now,
                deleted_at: null
            },
            {
                title: 'Create task APIs',
                description: 'Implement CRUD APIs for task management',
                status: true,
                creator_id: sazad.id,
                updater_id: tester.id,
                created_at: now,
                updated_at: now,
                deleted_at: null
            },
            {
                title: 'Add pagination',
                description: 'Add search filtering and pagination to tasks',
                status: true,
                creator_id: tester.id,
                updater_id: tester.id,
                created_at: now,
                updated_at: now,
                deleted_at: null
            },
            {
                title: 'Test inactive task',
                description: 'Sample inactive task for status filter testing',
                status: false,
                creator_id: tester.id,
                updater_id: tester.id,
                created_at: now,
                updated_at: now,
                deleted_at: null
            },
            {
                title: 'Write API documentation',
                description: 'Generate Swagger documentation using OpenAPI',
                status: true,
                creator_id: sazad.id,
                updater_id: sazad.id,
                created_at: now,
                updated_at: now,
                deleted_at: null
            }
        ]);

    },

    async down(queryInterface, Sequelize) {

        await queryInterface.bulkDelete('tasks', {
            title: {
                [Sequelize.Op.in]: [
                    'Setup project',
                    'Create authentication',
                    'Create task APIs',
                    'Add pagination',
                    'Test inactive task',
                    'Write API documentation'
                ]
            }
        });

    }

};