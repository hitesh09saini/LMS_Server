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
    console.log(title, description, category, createdBy);

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

// addLectures
const addLectureToCourseById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { title, description } = req.body;
    //  console.log(title, description );
    if (!title || !description) {
        throw next(new AppError("All fields are required", 400));
    }

    const course = await Course.findById(id);
    if (!course) {
        return next(
            new AppError('Course with given id does not exist', 500)
        )
    }


    if (!course) {
        return next(new AppError('Creating of course failed, please try again', 400));
    }

    const lectureData = {
        title,
        description,
        lecture: {}
    }

    if (req.file) {
        const result = await cloudinaryURl(req.file.path);
        lectureData.lecture.public_id = result.public_id;
        lectureData.lecture.secure_url = result.secure_url;
    }

    // console.log(lectureData);
    course.lectures.push(lectureData);
    course.numberOfLectures = course.lectures.length;
    await course.save();

    res.status(201).json({
        success: true,
        message: 'lecture created successfully',
        course,
    });


})

// delete a lecture 

const deleteLectureToCourseById = asyncHandler(async (req, res, next) => {
    const { id, lectureid } = req.params;
    const course = await Course.findById(id);
    if (!course) {
        return next(new AppError('Course with given id does not exist', 500));
    }

    if(!lectureid){
        return next(new AppError('lecture id does not exist', 500));
    }

    // Use filter to create a new array excluding the lecture with the specified ID
    course.lectures = course.lectures.filter(lecture => !lecture._id.equals(lectureid));

    await course.save();
    res.status(201).json({
        success: true,
        message: 'Lecture deleted successfully',
        course,
    });
});


module.exports = {
    getCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    deleteLectureToCourseById,
}