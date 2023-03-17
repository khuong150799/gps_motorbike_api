const router = require("express").Router();
const locationDevicesController = require("../controllers/location_devices.controller");
const { body } = require("express-validator");

module.exports = (app) => {
  router.get("/getall", locationDevicesController.getAll);
  router.get("/getbyid/:id", locationDevicesController.getById);
  router.post("/create", locationDevicesController.create);
  router.put(
    "/update/:id",
    [
      body("firstName", "The firstName not empty").notEmpty(),
      body("lastName", "The lastName not empty").notEmpty(),
      body("email", "The email not empty").notEmpty().trim(),
    ],
    locationDevicesController.update
  );
  router.delete("/delete/:id", locationDevicesController.delete);

  app.use("/api/location-devices", router);
};
