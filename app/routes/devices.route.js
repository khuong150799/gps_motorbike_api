const router = require("express").Router();
const devicesController = require("../controllers/devices.controller");
const { body } = require("express-validator");

module.exports = (app) => {
  router.get("/getall", devicesController.getAll);
  router.get("/getbyid/:id", devicesController.getById);
  router.post("/create", devicesController.create);
  router.put(
    "/update/:id",
    [
      body("firstName", "The firstName not empty").notEmpty(),
      body("lastName", "The lastName not empty").notEmpty(),
      body("email", "The email not empty").notEmpty().trim(),
    ],
    devicesController.update
  );
  router.delete("/delete/:id", devicesController.delete);

  app.use("/api/devices", router);
};
