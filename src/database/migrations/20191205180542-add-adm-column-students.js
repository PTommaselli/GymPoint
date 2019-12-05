module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('students', 'adm', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('students', 'adm');
  },
};
