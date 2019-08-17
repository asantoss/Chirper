'use strict';
module.exports = (sequelize, DataTypes) => {
  const messages = sequelize.define('messages', {
    body: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  messages.associate = function (models) {
    // associations can be defined here
    messages.belongsToMany(models.users, { through: 'Like', as: 'likedUsers' })
    messages.belongsTo(models.users)
  };
  return messages;
};