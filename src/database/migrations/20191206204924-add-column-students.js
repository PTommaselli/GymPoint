module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('students', 'canceled_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('students', 'canceled_at');
  },
};
