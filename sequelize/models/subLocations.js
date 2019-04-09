export default (sequelize, DataTypes) => {
  const SubLocations = sequelize.define('SubLocations', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Locations',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  });
  SubLocations.associate = (models) => {
    SubLocations.belongsTo(models.Locations, {
      foreignKey: 'id',
    });
  };
  SubLocations.associate = (models) => {
    SubLocations.belongsTo(models.Users, {
      foreignKey: 'id',
    });
  };

  return SubLocations;
};
