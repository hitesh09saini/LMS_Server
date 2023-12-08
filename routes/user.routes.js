const Router = require('express')
const isLoggedIn = require('../middlewares/auth.middleWare')
const {register, login, logout, getProfile} = require('../controllers/user.controller')
const router = Router();

router.post('/register',register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/me',isLoggedIn, getProfile)


module.exports=  router