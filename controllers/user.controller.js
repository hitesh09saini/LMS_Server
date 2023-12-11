const AppError = require('../utils/error.utils')
const User = require('../models/user.models')
const {cloudinaryURl, deleteClodinaryUrl}= require('../utils/cloudinary')
const sendEmail = require('../utils/mail')
const crypto = require('crypto');
const asyncHandler = require('../middlewares/asyncHandler.middleware');

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true,
    secure: true,
}
// register user
const register = asyncHandler(async (req, res, next) => {

    const { fullName, email, password } = req.body;

    console.log(fullName, email, password);

    if (!fullName || !email || !password) {
        throw next(new AppError("All fields are required", 400));
    }

    const userExists = await User.findOne({ email });
    console.log(userExists);
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

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
    });
});

// login user
const login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('All field are requird', 400))

    }

    const user = await User.findOne({
        email
    }).select('+password');


    // If no user or sent password do not match then send generic response
    if (!(user && (await user.comparePassword(password)))) {
        return next(
            new AppError('Email or Password do not match or user does not exist', 401)
        );
    }

    const token = await user.generateJETToken();
    user.password = undefined;

    res.cookie('token', token, cookieOptions);

    res.status(200).json({
        success: true,
        message: 'User loggedin Successfully',
        user
    })

})

// logout user

const logout = asyncHandler((req, res) => {
    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'User logged out successfully'
    })
})

// get profile
const getProfile = asyncHandler(async (req, res) => {
    // Finding the user using the id from modified req object
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        message: 'User details',
        user,
    });
})


// forgot password
const forgotPassword = asyncHandler(async (req, res, next) => {


    const { email } = req.body;

    if (!email) {
        return next(new AppError('Email is required', 500))
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('Email is not registered', 500))
    }


    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordURL = `http://localhost:8081/api/v1/user/reset/${resetToken}`;

    console.log(resetPasswordURL);
    const subject = 'Forgot you password';
    const message = `<html lang="en-US"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type" /><title>Reset Password Email Template</title><meta name="description" content="Reset Password Email Template."><style type="text/css">a:hover {text-decoration: underline !important;}</style></head><body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><!--100% body table--><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;"><tr><td><table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td style="height:80px;">&nbsp;</td></tr><tr><td style="height:20px;">&nbsp;</td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"><tr><td style="height:40px;">&nbsp;</td></tr><tr><td style="padding:0 35px;"><h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have requested to reset your password</h1><span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">We cannot simply send you your old password. A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.</p><a href=${resetPasswordURL} style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a></td></tr><tr><td style="height:40px;">&nbsp;</td></tr></table></td><tr><td style="height:20px;">&nbsp;</td></tr><tr><td style="height:80px;">&nbsp;</td></tr></table></td></tr></table></body></html>`

    try {
        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: `Reset password token has been sent to ${email}`,
        })

    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save();

        return next(new AppError('failed to forgot password', 500));
    }
})


// reset password
const resetPassword = asyncHandler(async (req, res, next) => {
    // Extracting resetToken from req.params object
    const { resetToken } = req.params;
    // Extracting password from req.body object
    const { password } = req.body;

    // We are again hashing the resetToken using sha256 since we have stored our resetToken in DB using the same algorithm
    const forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Check if password is not there then send response saying password is required
    if (!password) {
        return next(new AppError('Password is required', 400));
    }

    //   console.log(forgotPasswordToken);

    // Checking if token matches in DB and if it is still valid(Not expired)
    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry: { $gt: Date.now() }, // $gt will help us check for greater than value, with this we can check if token is valid or expired
    });

    // If not found or expired send the response
    if (!user) {
        return next(
            new AppError('Token is invalid or expired, please try again', 400)
        );
    }

    // Update the password if token is valid and not expired
    user.password = password;

    // making forgotPassword* valus undefined in the DB
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    // Saving the updated user values
    await user.save();

    // Sending the response when everything goes good
    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
    });
})

// changePassword

const changePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;
    if (!oldPassword || !newPassword) {
        return next(
            new AppError('All fiels are manddantoy', 400)
        )
    }

    const user = await User.findById(id).select('+password');

    if (!user) {
        return next(
            new AppError('User does not exist', 400)
        )
    }

    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
        return next(
            new AppError('Old Password is invalid', 400)
        )
    }

    user.password = newPassword;
    await user.save();

    user.password = undefined;

    res.status(200).json({
        success: true,
        message: 'Password change successfully !',
        user,
    });

})



// updateProfile

const updateProfile = asyncHandler(async (req, res, next) => {
    const { fullName } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(
            new AppError('User does not exist', 400)
        )
    }

    if (req.fullName) {
        // change name 
        user.fullName = fullName;
    }

    // check file
    if (req.file) {
        // remove file from cloudinary
        await deleteClodinaryUrl(user.avatar.public_id);
        // upload on cloudinary
        const result = await cloudinaryURl(req.file.path);
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;
    }


    await user.save();

    res.status(200).json({
        success: true,
        message: 'Profile updated !',
        user,
    });

})





module.exports = {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile
}