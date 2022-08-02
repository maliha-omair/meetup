'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Images.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      Images.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
      Images.belongsTo(models.Event, {
        foreignKey: 'eventId'
      })
    }
  }
  Images.init({
    url: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Images',
  });
  return Images;
};