const mongoose = require('mongoose')



mongoose.set('strictQuery', false);

const MONGO_URl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/LMS'

const connectionToDB = async () => {
    try {
        const { connection } = await mongoose.connect(MONGO_URl);

        if (connection) {
            console.log(`Database is connected: ${connection.host}`);
        }
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}


module.exports = connectionToDB;
