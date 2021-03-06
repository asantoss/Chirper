'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'photos', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '/images/defaultPhoto.png'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'photo')
  }
};
