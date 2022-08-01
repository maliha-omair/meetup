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
      })
      Group.hasMany(models.Venue, {
        foreignKey: 'groupId'
      })
      Group.hasMany(models.Membership, {
        foreignKey: 'groupId'
      })
      Group.hasMany(models.Event, {
        foreignKey: 'groupId'
      })
    }
  }
  Group.init({
    organizerId: {
     typoe:DataTypes.INTEGER,
     allowNull:false
    }, 
    name: {
      type: DataTypes.STRING
    },
    about: DataTypes.STRING,
    type: {
      tyoe: DataTypes.ENUM('In person','Online')
    },
    private: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};