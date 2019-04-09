export default (sequelize, DataTypes) => {
  const Locations = sequelize.define('Locations', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
      foreignKey: 'id',
    });
  };

  return Locations;
};
