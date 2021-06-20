const Router = require("express");
const newsController = require("../../controllers/newsController");
const AuthHandlerMiddleware = require("../../handlers/AuthHandlerMiddleware");
const router = new Router();

router.get("/", newsController.getAll);
router.get("/create", AuthHandlerMiddleware, newsController.getCreate);
router.post("/create", AuthHandlerMiddleware, newsController.postCreate);
router.get("/:id", AuthHandlerMiddleware, newsController.getOne);
router.post('/:id', AuthHandlerMiddleware, newsController.delete )
router.get("/edit/:id", AuthHandlerMiddleware, newsController.getEdit);
router.post("/edit/:id", AuthHandlerMiddleware, newsController.edit);

module.exports = router;
