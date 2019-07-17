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
      onDelete: 'CASCADE',
      references: {
        model: 'Locations',
        key: 'id',
      },
    },
    userId: {
      type: Sequelize.INTEGER,
      onDelete: 'SET NULL',
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
    male: {
      type: Sequelize.STRING,
    },
    female: {
      type: Sequelize.STRING,
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
