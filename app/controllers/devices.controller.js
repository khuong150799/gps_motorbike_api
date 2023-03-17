const devicesService = require("../services/devices.service");
const { validationResult } = require("express-validator");

exports.getAll = (req, res) => {
  const data = req.query;
  // console.log(data);
  devicesService.getAll(data, (err, data) => {
    if (err) {
      res.send({
        result: false,
        error: [err],
      });
      return;
    }
    res.send({
      result: true,
      data,
    });
  });
};

exports.getById = (req, res) => {
  const id = req.params.id;
  // console.log(data);
  devicesService.getById(id, (err, data) => {
    if (err) {
      res.send({
        result: false,
        error: [err],
      });
      return;
    }
    res.send({
      result: true,
      data: [data],
    });
  });
};

exports.create = (req, res) => {
  const errors = validationResult(req);
  // console.log('HUY NE');
  if (!errors.isEmpty()) {
    res.send({
      result: false,
      errors,
    });
    return;
  }
  const data = {
    userid: req.body.userid,
    name: req.body.name,
  };
  // console.log(data);
  devicesService.register(data, (err, resultAdd) => {
    if (err) {
      res.send({
        result: false,
        error: [err],
      });
      return;
    }
    res.send({
      result: true,
      data: [{ data: resultAdd }],
    });
  });
};

exports.update = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send({
      result: false,
      errors,
    });
    return;
  }
  const data = {
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
  };
  const id = req.params.id;
  devicesService.update(data, id, (err, resultUpdate) => {
    if (err) {
      res.send({
        result: false,
        error: [err],
      });
      return;
    }
    resultUpdate.data = data;
    res.send({
      result: true,
      data: [resultUpdate],
    });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  devicesService.delete(id, (err, resultDelete) => {
    if (err) {
      res.send({
        result: false,
        error: [err],
      });
      return;
    }
    res.send({
      result: true,
      data: [resultDelete],
    });
  });
};
