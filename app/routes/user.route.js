const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { body } = require("express-validator");

module.exports = (app) => {
  router.get("/getall", userController.getAll);
  router.get("/getbyid/:id", userController.getById);
  router.post("/create", userController.create);
  router.put(
    "/update/:id",
    [
      body("firstName", "The firstName not empty").notEmpty(),
      body("lastName", "The lastName not empty").notEmpty(),
      body("email", "The email not empty").notEmpty().trim(),
    ],
    userController.update
  );
  router.delete("/delete/:id", userController.delete);

  app.use("/api/user", router);
};
