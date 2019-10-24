'use strict';
module.exports = (sequelize, DataTypes) => {
  const NewsComments = sequelize.define('NewsComments', {
    newsId: DataTypes.INTEGER,
    authorId: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {});
  NewsComments.associate = function(models) {
    NewsComments.belongsTo(models.User, {
      foreignKey: 'authorId',
      sourceKey: 'id'
    })
    NewsComments.belongsTo(models.News, {
      foreignKey: 'newsId',
      sourceKey: 'id'
    })
  };
  return NewsComments;
};