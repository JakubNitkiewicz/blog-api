'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.belongsTo(models.AuthorizationUser, {
      foreignKey: 'id'
    })
    User.belongsTo(models.UserDetails, {
      foreignKey: 'id'
    })
  };
  return User;
};