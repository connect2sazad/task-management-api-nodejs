'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('tasks', 'description', {
      type: Sequelize.STRING(250),
      allowNull: false
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE "tasks"
      ALTER COLUMN "deleted_at"
      TYPE TIMESTAMP WITH TIME ZONE
      USING "deleted_at"::TIMESTAMP WITH TIME ZONE
    `);

    await queryInterface.changeColumn('tasks', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('tasks', 'description', {
      type: Sequelize.STRING(250),
      allowNull: true
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE "tasks"
      ALTER COLUMN "deleted_at"
      TYPE VARCHAR(250)
      USING "deleted_at"::VARCHAR(250)
    `);
  }
};
