const { Router } = require('express');
const isLoggedIn = require('../middlewares/auth.middleWare');
const { register, login, logout, getProfile, forgotPassword, resetPassword} = require('../controllers/user.controller');
const upload = require('../middlewares/multer.middleware');
const router = Router();


router.post('/register',upload.single('avatar'), register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', isLoggedIn, getProfile);
router.post('/reset',forgotPassword );
router.post('/reset/:resetToken', resetPassword);

module.exports = router;
