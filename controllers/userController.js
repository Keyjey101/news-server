require("dotenv").config();
const ApiError = require("../handlers/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user-model");

const jwtGenerate = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT, { expiresIn: "1h" });
};

class UserController {
  //========================================регистрация
  async registration(req, res, next) {
    try {
      //ошибки при валидации предыдущей функцией (в роутере)
      const valitationErrors = validationResult(req);
      //в принципе тут можно было бы тоже рендерить страницу типа "error"
      //но т.к. такой задачи не стояло, сделал по нормальному через json
      //ну как и в принципе любые ошибки
      if (!valitationErrors.isEmpty()) {
        return res.status(400).json({
          valitationErrors: valitationErrors.array(),
          message: valitationErrors.errors[0].msg,
        });
      }

      const { email, password } = req.body;
      //проверка существует ли юзер
      const candidate = await User.findOne({ email });

      if (candidate) {
        return next(ApiError.badRequest("User already exist"));
      }
      //создаем пароль и токен пользователю, сохраняем инфу в бд
      const hashPassword = await bcrypt.hash(password, 12);
      const user = await User.create({ email, password: hashPassword });
      const token = jwtGenerate(user._id, user.email);
      await user.save();
      //отдаем куку
      res.cookie("token", token, {
        httpOnly: true,
      });

      return res.redirect(301, "../news");
      //return res.json({token})
    } catch (e) {
      console.log(e);
    }
  }
  //========================================логин
  async login(req, res, next) {
    try {
      //ошибки при валидации предыдущей функцией (в роутере)
      const valitationErrors = validationResult(req);

      if (!valitationErrors.isEmpty()) {
        return res.status(400).json({
          valitationErrors: valitationErrors.array(),
          message: valitationErrors.errors[0].msg,
        });
      }

      const { email, password } = req.body;

      //ищем юзера
      const user = await User.findOne({ email });
      //если его нет - возращаем ошибку
      if (!user) {
        return next(ApiError.internal("Wrong username and/or password"));
      }
      //проверяем хэши паролей
      const isMatch = await bcrypt.compare(password, user.password);
      //если не совпадают - возвращаем ошибку
      if (!isMatch) {
        return next(ApiError.internal("Wrong username and/or password"));
      }

      //создаем токен и записываем в куку пользователю

      const token = jwtGenerate(user.id, user.email);
      //console.log('destroing cookie')
      //res.clearCookie('token')
      res.cookie("token", token, {
        httpOnly: true,
      });

      return res.redirect(301, "../news");
      //return res.json({token})
    } catch (e) {
      console.log(e);
    }
  }

  // сперва думал сделать проверки через авторизацию, но потом подумал про куки, раз нет фронта
  //  async auth(req, res, next){
  // const token = jwtGenerate(req.user.id, req.user.email)
  // return res.json({token})
  // }

  //====================================логаут
  async logout(req, res, next) {
    //удаляем куку и редиректим на главную
    res.clearCookie("token");
    res.redirect("../news");
  }
}

module.exports = new UserController();
