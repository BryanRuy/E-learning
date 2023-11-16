'use strict';
const Sequelize = require('sequelize');
const { QueryInterface, DataTypes } =require("sequelize");


module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    // Add seed commands here.
    let date =  new Date();
    let roles = [
      { roleId: 'student', roleName: 'Student', createdAt: date, updatedAt: date },
      { roleId: 'teacher', roleName: 'Teacher', createdAt: date, updatedAt: date },
      { roleId: 'admin', roleName: 'Admin', createdAt: date, updatedAt: date },
      { roleId: 'super-admin', roleName: 'Super Admin', createdAt: date, updatedAt: date },
    ];

    await queryInterface.bulkInsert('Roles', roles, {});
  },

  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   */
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', {
      roleId: {[Sequelize.Op.in]: ['student', 'teacher', 'admin', 'super-admin']}
    }, {});
  }
};
