const AppError = require('../utils/error.utils')
const User = require('../models/user.models')
const cloudinaryURl = require('../utils/cloudinary')

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true,
    secure: true,
}
// register user
const register = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;


        if (!fullName || !email || !password) {
            throw next(new AppError("All fields are required", 400));
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return next(new AppError('Email already Exists', 400));
        }

        // check the file 

        // console.log(req.file);

        if (!req.file) {
            return next(new AppError("File is not exist", 400));
        }

        //    upload on cloudinary

         const result = await cloudinaryURl(req.file.path);
        //  console.log(result);
       
        // // create user 

        const user = await User.create({
            fullName,
            email,
            password,
            avatar: {
                public_id: result.public_id,
                secure_url: result.secure_url,
            }
        });

        if (!user) {
            return next(new AppError('User registration failed, please try again', 400));
        }



        await user.save();
        user.password = undefined;

        const token = await user.generateJETToken();

        // console.log(token);
        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        next(new AppError("Internal Server Error", 500));
    }
};

// login user
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('All field are requird', 400))

        }

        const user = await User.findOne({
            email
        }).select('+password');

        if (!user || !user.comparePassword(password)) {
            return next(new AppError('email or password does not match ', 400))
        }

        const token = await user.generateJETToken();
        user.password = undefined;

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'User loggedin Successfully',
            user,
        })

    } catch (error) {
        return next(new AppError(error.message, 400));
    }

}


// logout user

const logout = (req, res) => {
    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'User logged out successfully'
    })
}


// get profile
const getProfile = async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById({
            userId
        })

        res.status(200).json({
            success: true,
            message: 'User details',
            user
        })
    } catch (error) {
        return next(new AppError('failed to fetch profile details', 500));
    }

}

module.exports = {
    register,
    login,
    logout,
    getProfile
}