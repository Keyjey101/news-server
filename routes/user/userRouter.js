const Router = require("express");
const { check } = require("express-validator");
const userController = require("../../controllers/userController");
const AuthHandlerMiddleware = require("../../handlers/AuthHandlerMiddleware");


const router = new Router();

router.post(
  "/registration",

  [
    check("email", "Введите пожалуйста корректный адрес почты").isEmail(),
    check("password", "Минимальная длина пароля шесть символов").isLength({
      min: 6,
    }),
  ],

  userController.registration
);

router.post(
  "/login",

  [
    check("email", "Введите пожалуйста корректный адрес почты").isEmail(),
    check("password", "Минимальная длина пароля шесть символов").isLength({
      min: 6,
    }),
  ],
  userController.login
);

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/registration", (req, res) => {
  res.render("registration");
});



router.get("/logout", AuthHandlerMiddleware ,userController.logout);

module.exports = router;
