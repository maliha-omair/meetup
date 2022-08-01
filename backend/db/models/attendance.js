'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      Event.belongsTo(models.Event, {
        foreignKey: 'eventId'
      })
    }
  }
  Attendance.init({
    userId: {
      type:DataTypes.INTEGER
    },
    eventId: {
      type:DataTypes.INTEGER
    },
    status: DataTypes.ENUM('member','waitlist','pending')
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};