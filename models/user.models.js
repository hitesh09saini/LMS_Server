require('dotenv').config({
    path: '../.env'
});

const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({

    fullName: {
        type: String,
        required: [true, 'Name is reuired'],
        minLength: [5, 'Name must be greater then 5'],
        maxLength: [50, 'Name must be less then 50'],
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'email is reuired'],
        lowercase: true,
        trim: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please fill in a vaild email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password should be required'],
        minLength: [8, 'Name must be greater then 8'],
        select: false,
    },

    avatar: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },

    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },

    forgotPasswordToken: String,

    forgotPasswordExpiry: Date

}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);

    next();
})

userSchema.methods = {
    generateJETToken:async function () {
       
        return await jwt.sign({ id: this._id, email: this.email, subscription: this.subscription, role: this.role },
            process.env.JWT_SECRET,

            {
                expiresIn: process.env.JWT_EXPIRY,
            }
        )
    },

    comparePassword:async function (plainTextPassword) {
        return  await bcrypt.compare(plainTextPassword,this.password);

    },
}


const User = model('User', userSchema);

module.exports = User
