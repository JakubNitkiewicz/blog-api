'use strict';
module.exports = (sequelize, DataTypes) => {
  const AuthorizationUser = sequelize.define('AuthorizationUser', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  AuthorizationUser.associate = function(models) {
    AuthorizationUser.belongsTo(models.User, {
      foreignKey: 'id'
    })
  };
  return AuthorizationUser;
};