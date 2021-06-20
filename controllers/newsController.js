require("dotenv").config();
const User = require("../models/user-model");
const News = require("../models/news-model");
const ApiError = require("../handlers/ApiError");

class newsController {
  //лист новостей, только заголовки
  async getAll(req, res, next) {
    try {
      //получаем поля с заголовком и id - который будет использоваться для перехода в полную версию новости
      let news = await News.find({}, { title: 1, _id: 1 });
      //случай когда новостей в базе нет
      news =
        news.length == 0
          ? [{ title: "There is no news yet, login and create one!", _id: 0 }]
          : news;

      res.render("news", { newsList: news });
      // res.status(200).json({news})
    } catch (e) {
      console.log(e);
    }
  }

  //полная версия новости
  async getOne(req, res, next) {
    try {
      //случай когда новостей в базе нет
      if (req.params.id == 0) {
        res.render("single", {
          news: {
            title: "This is placeholder",
            content:
              'Please do some registration/login, then hit "Create News" button to add your awesome news.',
          },
          isAuthor: false,
        });
      } else {
      //ищем новость по строке запроса, и юзера, который хочет получить к ней доступ. Если юзер является
      // создателем новости, то возвращаем true для условного рендеринга кнопки редактирования
      const user = await User.findOne({ email: req.user.email });
      const news = await News.findOne({ _id: req.params.id });
      const isAuthor = JSON.stringify(news.user) === JSON.stringify(user._id);

      res.render("single", { news, isAuthor });
      // res.status(200).json({news, renderEdit: isAuthor})
      } 
    } catch (e) {
      console.log(e);
      next(ApiError.badRequest("No such page"))
    }
  }
  //страница создания новости
  async getCreate(req, res, next) {
    try {
      res.render("create");
    } catch (e) {
      console.log(e);
    }
  }
  //создание новости
  async postCreate(req, res, next) {
    try {
      //ищем юзера, который создает новость
      const user = await User.findOne({ email: req.user.email });
      //создаем новость и передаем туда инфу о юзере
      const news = new News({
        title: req.body.newsTitle,
        content: req.body.newsContent,
        user,
      });
      //сохраняем новость
      news.save();

      //res.status(200).json({news})
      res.redirect("../news");
    } catch (e) {
      console.log(e);
    }
  }

  //получаем еще раз новость из параметров гет запроса для рендеринга страницы с ее редактированием
  async getEdit(req, res, next) {
    try {
       
      const user = await User.findOne({ email: req.user.email });
      const news = await News.findOne({ _id: req.params.id });
      const isAuthor = JSON.stringify(news.user) === JSON.stringify(user._id);
        
      //мало ли юзер перелогинился или вышел
      if (!isAuthor) {
        next(ApiError.forbidden("Editing is allowed only for authors"));
      }

      res.render("edit", { news });
      //res.status(200).json({news})
    } catch (e) {
      console.log(e);
      next(ApiError.badRequest("No such page"))
    }
  }

  //редактирование новости в параметрах put запрос
  async edit(req, res, next) {
    try {
      //ищем новость по айди=параметру
      const newstoUpdate = await News.findByIdAndUpdate(
        { _id: req.params.id },
        { title: req.body.newsTitle, content: req.body.newsContent }
      );
      console.log(newstoUpdate);
      res.redirect("../../news");
      //res.status(201).json({newstoUpdate})
    } catch (e) {
      console.log(e);
    }
  }
  async delete(req, res, next) {
    const user = await User.findOne({ email: req.user.email });
    const news = await News.findOne({ _id: req.params.id });
    const isAuthor = JSON.stringify(news.user) === JSON.stringify(user._id);

    //мало ли юзер перелогинился или вышел
    if (!isAuthor) {
      next(ApiError.forbidden("Editing is allowed only for authors"));
    }
    const delNews = await News.deleteOne({ _id: req.params.id });
    res.redirect("../../news");
  }
}

module.exports = new newsController();
