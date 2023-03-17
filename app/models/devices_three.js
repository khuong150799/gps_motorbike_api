"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Devices_three extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Devices_three.init(
    {
      userid: DataTypes.NUMBER,
      deviceid: DataTypes.NUMBER,
      lat: DataTypes.STRING,
      lng: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Location_devices_three",
    }
  );
  return Devices_three;
};
