const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

const renderRouter = require('./routes/renderRoutes');
const userRouter = require('./routes/userRoutes');
const biodataRouter = require('./routes/biodataRoutes');
const historyRouter = require('./routes/historyRoutes');

const app = express();

app.set('view engine', 'ejs');

const limiter = {
    max: 200,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request, please try again in 1 hour!',
};

app.use('/api', rateLimit(limiter));

app.use(morgan('dev'));

app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize());

app.use(xss());

app.use('/', renderRouter);
app.use('/api/user-game', userRouter);
app.use('/api/user-game-biodata', biodataRouter);
app.use('/api/user-game-history', historyRouter);

module.exports = app;
