require('dotenv').config();

const app = require('./app');
const cloudinary = require('cloudinary')
const connectionToDB = require('./config/dbConnection')
const PORT = process.env.PORT || 5000;


// cloudinary configuration

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


// server is listening 
app.listen(PORT, async ()=>{
    await connectionToDB();
    console.log(`Server is running on http://localhost:${PORT}`);
})
