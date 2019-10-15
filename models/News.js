'use strict';
module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    title: DataTypes.STRING,
    introductionText: DataTypes.STRING,
    expandedText: DataTypes.STRING,
    authorId: DataTypes.INTEGER
  }, {});
  News.associate = function(models) {
    News.belongsTo(models.User, {
      foreignKey: 'authorId',
      sourceKey: 'id'
    })
  };
  return News;
};