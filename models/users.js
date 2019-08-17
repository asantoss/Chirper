'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    email: DataTypes.STRING,
    alias: DataTypes.STRING,
    photos: DataTypes.STRING
  }, {});
  users.associate = function (models) {
    // associations can be defined here
    users.belongsToMany(models.messages, { through: 'Like' })
    users.hasMany(models.messages)
  };
  return users;
};