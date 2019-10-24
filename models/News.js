'use strict';
module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    title: DataTypes.STRING,
    introductionText: DataTypes.TEXT,
    expandedText: DataTypes.TEXT,
    authorId: DataTypes.INTEGER,
    comments: DataTypes.INTEGER
  }, {});
  News.associate = function(models) {
    News.belongsTo(models.User, {
      foreignKey: 'authorId',
      sourceKey: 'id'
    })
    News.hasMany(models.NewsComments, {
      foreignKey: 'newsId',
      sourceKey: 'id'
    }) 
  };
  return News;
};