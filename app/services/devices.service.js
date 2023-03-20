const { Op } = require('sequelize');
const db = require('../models');
const util = require('util');
const { tree } = require('../helper/rbush.helper');
// const insertTree = require('./test')
// const rtree = require('rtree');
// const rbush = require('rbush');

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
                    limit: 3,
                }),
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
                    limit: 3,
                }),
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
                    limit: 3,
                }),
            );
        });
        Promise.all([locationDeviceOne, locationDeviceTwo, locationDeviceThree]).then(
            ([result1s, result2s, result3s]) => {
                // console.log('result1s',result1s);
                // console.log('result2s',result2s);
                // console.log('result3s',result3s);
                for (let i = 0; i < result1s.length + result2s.length + result3s.length; i++) {
                    // const element = array[i];
                    switch (parseInt(rows[i].id) % 3) {
                        case 0:
                            result1s.forEach((result1) => {
                                if (rows[i].id == result1.deviceid) {
                                    rows[i].dataValues.lat = result1.lat;
                                    rows[i].dataValues.lng = result1.lng;
                                    rows[i].dataValues.minX = result1.lng;
                                    rows[i].dataValues.minY = result1.lat;
                                    rows[i].dataValues.maxX = result1.lng;
                                    rows[i].dataValues.maxY = result1.lat;
                                }
                            });
                            break;
                        case 1:
                            result2s.forEach((result2) => {
                                // console.log(21321);
                                // console.log("result2", result2.deviceid);
                                if (rows[i].id == result2.deviceid) {
                                    rows[i].dataValues.lat = result2.lat;
                                    rows[i].dataValues.lng = result2.lng;
                                    rows[i].dataValues.minX = result2.lng;
                                    rows[i].dataValues.minY = result2.lat;
                                    rows[i].dataValues.maxX = result2.lng;
                                    rows[i].dataValues.maxY = result2.lat;
                                    // console.log(rows[i]);
                                }
                            });
                            break;
                        case 2:
                            result3s.forEach((result3) => {
                                if (rows[i].id == result3.deviceid) {
                                    rows[i].dataValues.lat = result3.lat;
                                    rows[i].dataValues.lng = result3.lng;
                                    rows[i].dataValues.minX = result3.lng;
                                    rows[i].dataValues.minY = result3.lat;
                                    rows[i].dataValues.maxX = result3.lng;
                                    rows[i].dataValues.maxY = result3.lat;
                                }
                            });
                            break;

                        default:
                            break;
                    }
                }
                // rows.forEach((row) => {
                //   switch (parseInt(row.id) % 3) {
                //     case 0:
                //       result1s.forEach((result1) => {
                //         if (row.id == result1.deviceid) {
                //           row.dataValues.lat = result1.lat;
                //           row.dataValues.lng = result1.lng;
                //         }
                //       });
                //       break;
                //     case 1:
                //       result2s.forEach((result2) => {
                //         // console.log(21321);
                //         // console.log("result2", result2.deviceid);
                //         if (row.id == result2.deviceid) {
                //           row.dataValues.lat = result2.lat;
                //           row.dataValues.lng = result2.lng;
                //           // console.log(row);
                //         }
                //       });
                //       break;
                //     case 2:
                //       result3s.forEach((result3) => {
                //         if (row.id == result3.deviceid) {
                //           row.dataValues.lat = result3.lat;
                //           row.dataValues.lng = result3.lng;
                //         }
                //       });
                //       break;

                //     default:
                //       break;
                //   }
                // });
                const resultRows = rows.slice(0, result1s.length + result2s.length + result3s.length - 1);
                // console.log('resultRows', resultRows);
                let _resultRows = [];
                resultRows.forEach((element) => {
                    _resultRows = [..._resultRows, element.dataValues];
                });

                // Tìm các điểm trong bán kính quanh trung tâm
                tree.load(_resultRows);
                // console.log('tree', util.inspect(tree, false, null, true /* enable colors */));

                result(null, tree);
            },
        );
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

        result(null, { msg: 'Đăng kí thành công', data: devices });
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
            result({ msg: 'ID không tồn tại' }, null);
        }
        if (data.email == dataDevices.email) {
            const resultUpdate = await db.Devices.update(data, { where: { id } });
            // console.log(resultUpdate);
            if (resultUpdate[0] === 1) {
                result(null, { msg: 'Cập nhật dữ liệu thành công' });
                return;
            }
            result({ msg: 'Cập nhật dữ liệu thất bại' }, null);
        } else {
            const resAll = await db.Devices.findAll();
            // console.log(resAll);
            const emailAll = resAll.map((value) => value.email);

            if (!emailAll.includes(data.email)) {
                const resultUpdate = await db.Devices.update(data, { where: { id } });
                // console.log(resultUpdate);
                if (resultUpdate[0] === 1) {
                    result(null, { msg: 'Cập nhật dữ liệu thành công' });
                    return;
                }
            } else {
                result({ msg: 'Email đã tồn tại' }, null);
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
            result(null, { msg: 'Xóa dữ liệu thành công' });
            return;
        }
        result({ msg: 'Xóa dữ liệu thất bại' }, null);
    } catch (error) {
        result({ msg: error }, null);
    }
};
