const { Router } = require('express');
const upload = require('../middlewares/multer.middleware');
const { getCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse } = require('../controllers/course.controller');

const authorizedRoles = require('../middlewares/auth.middleWare');
const isLoggedIn = require('../middlewares/isLogged.middleware');

const router = Router();

router.route('/')
    .get(getCourses)
    .post(isLoggedIn, authorizedRoles('ADMIN'), upload.single('thumbnail'), createCourse)


router.route('/:id').get(isLoggedIn, getLecturesByCourseId)
    .put(isLoggedIn,authorizedRoles('ADMIN'), updateCourse)
    .delete(isLoggedIn,authorizedRoles('ADMIN'), removeCourse)



module.exports = router;