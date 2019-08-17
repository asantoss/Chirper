'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: DataTypes.INTEGER,
    messageId: DataTypes.INTEGER
  }, {});
  Like.associate = function (models) {
    Like.belongsTo(models.users);
    Like.belongsTo(models.messages)
    // associations can be defined here
  };
  return Like;
};