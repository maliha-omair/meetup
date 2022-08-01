'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendee.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      Attendee.belongsTo(models.Event, {
        foreignKey: 'eventId'
      })
    }
  }
  Attendee.init({
    userId: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER,
    status: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'Attendee',
  });
  return Attendee;
};