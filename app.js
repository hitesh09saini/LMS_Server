const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router= require('./routes/user.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

const corsOpt = {
    origin: [process.env.CLIENT_URL||'http://localhost:3000'],
    Credentials: true
}


app.use(express.json());
app.use(cors(corsOpt));
app.use(cookieParser());

app.use('/ping', function(req, res){
     res.send('/pong')
})

// routes 

app.use('/api/v1/user', router);

app.all('*', (req, res)=>{
    res.status(400).send('OOPS!! 404 Page not found')
})

app.use(errorMiddleware);

module.exports = app;
