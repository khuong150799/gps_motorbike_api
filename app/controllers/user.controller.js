const userService = require("../services/user.service");
const { validationResult } = require("express-validator");

exports.getAll = (req, res) => {
  const data = req.query;
  // console.log(data);
  userService.getAll(data, (err, data) => {
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
  userService.getById(id, (err, data) => {
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
    name: req.body.name,
    email: req.body.email,
  };
  // console.log(data);
  userService.register(data, (err, resultAdd) => {
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
  userService.update(data, id, (err, resultUpdate) => {
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

  userService.delete(id, (err, resultDelete) => {
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
