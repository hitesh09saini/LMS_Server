require('dotenv').config();

const app = require('./app');
const connectionToDB = require('./config/dbConnection')
const PORT = process.env.PORT || 5000;


app.listen(PORT, async ()=>{
    await connectionToDB();
    console.log(`Server is running on http://localhost:${PORT}`);
})
