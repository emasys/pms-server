export default (sequelize, DataTypes) => {
  const Residents = sequelize.define('Residents', {
    male: {
      type: DataTypes.STRING,
    },
    female: {
      type: DataTypes.STRING,
    },
    locationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Locations',
        key: 'id',
      },
    },
    modifiedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    subLocationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'SubLocations',
        key: 'id',
      },
    },
  });
  Residents.associate = (models) => {
    Residents.belongsTo(models.Locations, {
      foreignKey: 'id',
    });
  };
  Residents.associate = (models) => {
    Residents.belongsTo(models.SubLocations, {
      foreignKey: 'id',
    });
  };
  Residents.associate = (models) => {
    Residents.belongsTo(models.Users, {
      foreignKey: 'id',
    });
  };

  return Residents;
};
