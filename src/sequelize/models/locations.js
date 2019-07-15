export default (sequelize, DataTypes) => {
  const Locations = sequelize.define('Locations', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    male: {
      type: DataTypes.STRING,
    },
    female: {
      type: DataTypes.STRING,
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
  Locations.associate = (models) => {
    Locations.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'SET NULL',
    });
  };
  Locations.associate = (models) => {
    Locations.hasMany(models.SubLocations, {
      foreignKey: 'id',
    });
  };

  return Locations;
};
