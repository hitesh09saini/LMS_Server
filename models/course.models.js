const { model, Schema } = require('mongoose')

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, 'title is required!'],
        minLength: [8, 'Title must be atleast 8 characters'],
        maxLength: [60, 'Title should be less then 60 characters'],
        trim : true,
    },
    description: {
        type: String,
        required: [true, 'description is required!'],
        minLength: [8, 'Title must be atleast 8 characters'],
        maxLength: [200, 'Title should be less then 200 characters'],

    },
    category: {
        type: String,
        required: [true, 'category is required!'],
    },
    thumbnail: {
        public_id: {
            type: String,
            required: true,
        },
        secure_url: {
            type: String,
            required: true,
        }
    },
    lectures: [
        {
            title: String,
            description: String,
            lecture: {
                public_id: {
                    type: String,
                    required: true,
                },
                secure_url: {
                    type: String,
                    required: true,
                }
            }
        },
    ],

    numberOfLectures: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: String,
        required: true,
    }

}, {
    timestamps: true,
})


const Course = model('course', courseSchema);
module.exports = Course;