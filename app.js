const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();


const corsOptions = {
    origin: [process.env.CLIENT_URL],
    credentials: true, // Use 'credentials' instead of 'Credentials'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Explicitly specify allowed methods
};

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cors(corsOptions));
app.use(cookieParser());


app.use('/ping', function (req, res) {
    res.send('/pong');
});

// routes
const userRouter = require('./routes/user.routes');
app.use('/api/v1/user', userRouter);



app.all('*', (req, res) => {
    const decodedUrl = decodeURIComponent(req.url);
    console.log(`Requested URL: ${decodedUrl}`);
    res.status(404).send('OOPS!! 404 Page not found');
});

app.use(errorMiddleware);

module.exports = app;