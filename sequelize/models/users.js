import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'provide a valid email address',
        },
      },
    },
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'user'],
      defaultValue: 'user',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: ['[a-z]+$', 'i'],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: {
          args: 8,
          msg: 'password must not be more than 8 characters',
        },
        min: {
          args: 6,
          msg: 'password must not be less than 6 characters',
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'this username is not available',
      },
      validate: {
        min: 3,
        max: 12,
      },
    },
  });
  Users.associate = (models) => {
    Users.hasMany(models.Locations, {
      foreignKey: 'id',
    });
  };

  Users.associate = (models) => {
    Users.hasMany(models.SubLocations, {
      foreignKey: 'id',
    });
  };

  Users.beforeCreate(async (pendingUser) => {
    // eslint-disable-next-line no-param-reassign
    pendingUser.password = await pendingUser.generatePasswordHash();
  });

  // eslint-disable-next-line func-names
  Users.prototype.generatePasswordHash = async function () {
    const saltRounds = 10;
    const response = await bcrypt.hash(this.password, saltRounds);
    return response;
  };

  // eslint-disable-next-line func-names
  Users.prototype.validatePassword = async function (password) {
    const response = await bcrypt.compare(password, this.password);
    return response;
  };

  return Users;
};
