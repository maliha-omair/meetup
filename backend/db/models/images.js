'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      Image.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
      Image.belongsTo(models.Event, {
        foreignKey: 'eventId'
      })
    }
  }
  Image.init({
    url: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};