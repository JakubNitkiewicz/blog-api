'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserDetails = sequelize.define('UserDetails', {
    avatarURL: DataTypes.STRING,
    posts: DataTypes.INTEGER
  }, {});
  UserDetails.associate = function(models) {
    UserDetails.belongsTo(models.User, {
      foreignKey: 'id'
    })
  };
  return UserDetails;
};