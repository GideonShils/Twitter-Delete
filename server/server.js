require('dotenv').config();
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import passport from './passport';

import authRouter from './auth';
import apiRouter from './api';
import db from './db';
import path from 'path';

const app = express();

app.set('port', process.env.PORT || 3001);

// Enable cross origin from react port
app.use(cors({
    origin:['http://127.0.0.1:3000'],
    methods:['GET','POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(helmet()); // Security
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(session({
    secret:  process.env.SESSION_SECRET,
    name: 'sessionId',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge : 36000000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Setup authentication routing
app.use('/auth', authRouter);

// Setup api routing
app.use('/api', apiRouter);

if (process.env.NODE_ENV == "prod") {
    // Static resources
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
    })
}

// Start server listening
app.listen(app.get('port'), () => {
	console.log('Express server listening on port ' + app.get('port'));
});