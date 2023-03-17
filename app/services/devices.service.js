const { Op } = require("sequelize");
const db = require("../models");

exports.getAll = async (data, result) => {
  try {
    const { count, rows } = await db.Devices.findAndCountAll({});
    // console.log(count);==> number page

    const locationDeviceOne = new Promise(function (resolve) {
      resolve(
        db.Location_devices_one.findAll({
          where: {
            id: {
              [Op.in]: db.sequelize.literal(`(
                    SELECT 
                        MAX(id) 
                    FROM 
                        location_devices_ones 
                    GROUP BY 
                        deviceid
                )`),
            },
          },
        })
      );
    });
    const locationDeviceTwo = new Promise(function (resolve) {
      resolve(
        db.Location_devices_two.findAll({
          where: {
            id: {
              [Op.in]: db.sequelize.literal(`(
                    SELECT 
                        MAX(id) 
                    FROM 
                        location_devices_twos 
                    GROUP BY 
                        deviceid
                )`),
            },
          },
        })
      );
    });
    const locationDeviceThree = new Promise(function (resolve) {
      resolve(
        db.Location_devices_three.findAll({
          where: {
            id: {
              [Op.in]: db.sequelize.literal(`(
                    SELECT 
                        MAX(id) 
                    FROM 
                        location_devices_threes 
                    GROUP BY 
                        deviceid
                )`),
            },
          },
        })
      );
    });
    Promise.all([
      locationDeviceOne,
      locationDeviceTwo,
      locationDeviceThree,
    ]).then(([result1s, result2s, result3s]) => {
      rows.forEach((row) => {
        switch (parseInt(row.id) % 3) {
          case 0:
            result1s.forEach((result1) => {
              if (row.id == result1.deviceid) {
                row.dataValues.lat = result1.lat;
                row.dataValues.lng = result1.lng;
              }
            });
            break;
          case 1:
            result2s.forEach((result2) => {
              // console.log(21321);
              // console.log("result2", result2.deviceid);
              if (row.id == result2.deviceid) {
                row.dataValues.lat = result2.lat;
                row.dataValues.lng = result2.lng;
                // console.log(row);
              }
            });
            break;
          case 2:
            result3s.forEach((result3) => {
              if (row.id == result3.deviceid) {
                row.dataValues.lat = result3.lat;
                row.dataValues.lng = result3.lng;
              }
            });
            break;

          default:
            break;
        }
      });
      result(null, rows);
    });
  } catch (error) {
    console.log(error);
    result({ msg: error }, null);
  }
};

exports.getById = async (id, result) => {
  try {
    const dataDevices = await db.Devices.findOne({
      where: {
        id,
      },
    });
    result(null, { data: dataDevices });
    // console.log(dataDevices);
  } catch (error) {
    result({ msg: error }, null);
  }
};

exports.register = async (data, result) => {
  try {
    const devices = await db.Devices.create(data);

    result(null, { msg: "Đăng kí thành công", data: devices });
  } catch (error) {
    // console.log(error);
    result({ msg: error }, null);
  }
};

exports.update = async (data, id, result) => {
  try {
    const dataDevices = await db.Devices.findByPk(id);
    // console.log(typeof data.email);
    if (dataDevices === null) {
      result({ msg: "ID không tồn tại" }, null);
    }
    if (data.email == dataDevices.email) {
      const resultUpdate = await db.Devices.update(data, { where: { id } });
      // console.log(resultUpdate);
      if (resultUpdate[0] === 1) {
        result(null, { msg: "Cập nhật dữ liệu thành công" });
        return;
      }
      result({ msg: "Cập nhật dữ liệu thất bại" }, null);
    } else {
      const resAll = await db.Devices.findAll();
      // console.log(resAll);
      const emailAll = resAll.map((value) => value.email);

      if (!emailAll.includes(data.email)) {
        const resultUpdate = await db.Devices.update(data, { where: { id } });
        // console.log(resultUpdate);
        if (resultUpdate[0] === 1) {
          result(null, { msg: "Cập nhật dữ liệu thành công" });
          return;
        }
      } else {
        result({ msg: "Email đã tồn tại" }, null);
      }
    }
  } catch (error) {
    result({ msg: error }, null);
  }
};

exports.delete = async (id, result) => {
  try {
    const resultDelete = await db.Devices.destroy({ where: { id } });
    if (resultDelete === 1) {
      result(null, { msg: "Xóa dữ liệu thành công" });
      return;
    }
    result({ msg: "Xóa dữ liệu thất bại" }, null);
  } catch (error) {
    result({ msg: error }, null);
  }
};
