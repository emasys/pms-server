module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Residents', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    locationId: {
      type: Sequelize.INTEGER,
      unique: true,
      references: {
        model: 'Locations',
        key: 'id',
      },
    },
    subLocationId: {
      type: Sequelize.INTEGER,
      unique: true,
      references: {
        model: 'SubLocations',
        key: 'id',
      },
    },
    modifiedBy: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    male: {
      type: Sequelize.INTEGER,
    },
    female: {
      type: Sequelize.INTEGER,
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
  down: queryInterface => queryInterface.dropTable('Residents'),
};
