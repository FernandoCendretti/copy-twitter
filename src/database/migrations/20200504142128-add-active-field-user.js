module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'active', {
      type: Sequelize.BOOLEAN,
      allownull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'active');
  },
};
