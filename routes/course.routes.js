const { Router } = require('express');
const upload = require('../middlewares/multer.middleware');
const { getCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    deleteLectureToCourseById} = require('../controllers/course.controller');

const authorizedRoles = require('../middlewares/auth.middleWare');
const isLoggedIn = require('../middlewares/isLogged.middleware');
const authorizedSubscriber = require('../middlewares/authSubscriber.middleware')
const router = Router();

router.route('/')
    .get( getCourses)
    .post(isLoggedIn, authorizedRoles('ADMIN'), upload.single('thumbnail'), createCourse)


router.route('/:id')
    .get(isLoggedIn,authorizedSubscriber, getLecturesByCourseId)
    .put(isLoggedIn,authorizedRoles('ADMIN'), updateCourse)
    .delete(isLoggedIn,authorizedRoles('ADMIN'), removeCourse)
    .post(isLoggedIn, authorizedRoles('ADMIN'), upload.single('lecture'), addLectureToCourseById)

router.route('/:id/:lectureid').delete(isLoggedIn,authorizedRoles('ADMIN'), deleteLectureToCourseById);


module.exports = router;