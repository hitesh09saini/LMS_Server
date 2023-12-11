const asyncHandler = require('../middlewares/asyncHandler.middleware');
const AppError = require('../utils/error.utils')
const Course = require('../models/course.models');
const { cloudinaryURl, deleteClodinaryUrl } = require('../utils/cloudinary')

// get all courses
const getCourses = asyncHandler(async (req, res, next) => {
    const courses = await Course.find({}).select('-lectures');



    res.status(200).json({
        success: true,
        message: 'fetch All courses successfully !',
        courses: courses,
    });
});


// get lecture by id
const getLecturesByCourseId = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
        return next(
            new AppError('Invalid course id', 400)
        );
    }


    res.status(200).json({
        success: true,
        message: 'fetch  course by id successfully !',
        lectures: course.lectures,
    });
});

// createCourse

const createCourse = asyncHandler(async (req, res, next) => {
    const { title, description, category, createdBy } = req.body;
    // console.log(title, description, category, createdBy);

    if (!title || !description || !category || !createdBy) {
        throw next(new AppError("All fields are required", 400));
    }

    // console.log(req.file);
    if (!req.file) {
        return next(new AppError('File does not exist !', 400))
    }

    const result = await cloudinaryURl(req.file.path);

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail: {
            public_id: result.public_id,
            secure_url: result.secure_url,
        }
    })

    if (!course) {
        return next(new AppError('Creating of course failed, please try again', 400));
    }

    await course.save();

    res.status(201).json({
        success: true,
        message: 'Course created successfully',
        course,
    });

})

// updateCourse
const updateCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const course = await Course.findByIdAndUpdate(
        id, {
        $set: req.body
    },
        {
            runValidators: true,
        }
    )

    console.log(course);

    if (!course) {
        return next(
            new AppError('Course with given id does not exist', 500)
        )
    }

    res.status(201).json({
        success: true,
        message: 'Course updated successfully',
        course,
    });

})

// remove course
const removeCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const course = await Course.findById(id);

    await deleteClodinaryUrl(course.thumbnail.public_id);

    if (!course) {
        return next(
            new AppError('Course with given id does not exist', 500)
        )
    }

    await Course.findByIdAndDelete(id);

    res.status(201).json({
        success: true,
        message: 'Course delete successfully',
        course,
    });

})


module.exports = {
    getCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse
}