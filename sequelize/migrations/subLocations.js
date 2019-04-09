module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('SubLocations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    locationId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Locations',
        key: 'id',
      },
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('SubLocations'),
};
