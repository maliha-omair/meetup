'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      })
      Event.hasMany(models.Attendee, {foreignKey: 'eventId', onDelete: 'CASCADE', hooks: true})
    }
  }
  Event.init({
    groupId: {
      type:DataTypes.INTEGER
    },
    venueId: {
      type:DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.ENUM('In person','Online'),
    capacity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    startDate: {
      type:DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
    },
    endDate: {
      type:DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};