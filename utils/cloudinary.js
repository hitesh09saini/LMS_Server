const cloudinary = require('cloudinary')
const fs = require('fs');

const cloudinaryURl = async (localFilePath) => {

    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: 'lms',
            width: 250,
            height: 250,
            gravity: 'face',
            crop: 'fill'
        })
        // file has been uploaded successfull
        // console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

module.exports = cloudinaryURl;