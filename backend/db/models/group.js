'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User, {
        foreignKey: 'organizerId'
      });
      Group.hasMany(models.Venue, {
        foreignKey: 'groupId'
      });
      Group.hasMany(models.Membership, {
        foreignKey: 'groupId'
      });
      Group.hasMany(models.Event, {
        foreignKey: 'groupId'
      });
      Group.hasMany(models.Image, {
        foreignKey: 'groupId'
      });
    }
  }
  Group.init({
    organizerId: {
     type:DataTypes.INTEGER,
     allowNull:false
    }, 
    name: {
      type: DataTypes.STRING,
    },
    about: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM('In person','Online')
    },
    private: DataTypes.BOOLEAN,
    city: {
      type:DataTypes.STRING,
      allowNull: false
    },
    state: {
      type:DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};