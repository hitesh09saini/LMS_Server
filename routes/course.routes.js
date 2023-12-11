const { Router } = require('express');
const upload = require('../middlewares/multer.middleware');
const { getCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse } = require('../controllers/course.controller');

const isLoggedIn = require('../middlewares/auth.middleWare');

const router = Router();

router.route('/')
    .get(getCourses)
    .post(isLoggedIn, upload.single('thumbnail'), createCourse)


router.route('/:id').get(isLoggedIn, getLecturesByCourseId)
    .put(isLoggedIn, updateCourse)
    .delete(isLoggedIn, removeCourse)



module.exports = router;