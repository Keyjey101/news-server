const Router = require('express')

const newsRouter = require('./news/newsRouter')
const userRouter = require('./user/userRouter')
const router = new Router()

router.use('/news', newsRouter)
router.use('/user', userRouter)

module.exports = router