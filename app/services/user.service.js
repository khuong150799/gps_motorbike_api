const { Op } = require("sequelize");
const db = require("../models");

exports.getAll = async (data, result) => {
  try {
    const { count, rows } = await db.User.findAndCountAll({});
    // console.log(count);==> number page
    // console.log(rows);
    result(null, { data: rows });
  } catch (error) {
    console.log(error);
    result({ msg: error }, null);
  }
};

exports.getById = async (id, result) => {
  try {
    const dataUser = await db.User.findOne({
      where: {
        id,
      },
    });
    result(null, { data: dataUser });
    // console.log(dataUser);
  } catch (error) {
    result({ msg: error }, null);
  }
};

exports.register = async (data, result) => {
  try {
    const user = await db.User.create(data);

    result(null, { msg: "Đăng kí thành công", data: user });
  } catch (error) {
    // console.log(error);
    result({ msg: error }, null);
  }
};

exports.update = async (data, id, result) => {
  try {
    const dataUser = await db.User.findByPk(id);
    // console.log(typeof data.email);
    if (dataUser === null) {
      result({ msg: "ID không tồn tại" }, null);
    }
    if (data.email == dataUser.email) {
      const resultUpdate = await db.User.update(data, { where: { id } });
      // console.log(resultUpdate);
      if (resultUpdate[0] === 1) {
        result(null, { msg: "Cập nhật dữ liệu thành công" });
        return;
      }
      result({ msg: "Cập nhật dữ liệu thất bại" }, null);
    } else {
      const resAll = await db.User.findAll();
      // console.log(resAll);
      const emailAll = resAll.map((value) => value.email);

      if (!emailAll.includes(data.email)) {
        const resultUpdate = await db.User.update(data, { where: { id } });
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
    const resultDelete = await db.User.destroy({ where: { id } });
    if (resultDelete === 1) {
      result(null, { msg: "Xóa dữ liệu thành công" });
      return;
    }
    result({ msg: "Xóa dữ liệu thất bại" }, null);
  } catch (error) {
    result({ msg: error }, null);
  }
};
