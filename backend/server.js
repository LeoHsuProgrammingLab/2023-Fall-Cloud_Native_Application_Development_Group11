const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./config/database');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const walletRouter = require('./routes/wallet');
const routeRouter = require('./routes/route');
const stopRouter = require('./routes/stop');
const passengersRouter = require('./routes/passengers');

const Routes = require('./db/models/Routes');
const Grid = require('./db/models/Routes');
const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    // origin: ['https://tsmc-myuber.azurewebsites.net', "tsmc-myuber.azurewebsites.net"],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}))
app.use(bodyParser.json());

// Session configuration
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hour
    }
    // cookie: {
    //     httpOnly: false,
    //     sameSite: 'none'
    // }
}));

// Set Router
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/wallet', walletRouter);
app.use('/api/v1/route', routeRouter);
app.use('/api/v1/stop', stopRouter);
app.use('/api/v1/passengers', passengersRouter);

// Connect to the database and create the server
sequelize.sync()
    .then(() => {
        console.log('Database and tables have been created!');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });

const port = process.env.PORT || 3000;

// Cloud Server
// const server = app.listen(port, '0.0.0.0', () => {
//     console.log(`Server is running on port ${port}`);
// });

// Local Server
// const server = app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// HTTPS Server
// HTTPS configuration
const privateKey = fs.readFileSync('./certificates/key.pem', 'utf8');
const certificate = fs.readFileSync('./certificates/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`HTTPS Server is running on port ${port}`);
});

module.exports = {
    app,
    httpsServer
};
