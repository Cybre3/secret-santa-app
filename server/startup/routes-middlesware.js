const express = require('express');
const morgan = require('morgan');
const Winston = require('winston');
const debug = require('debug')('app:startup')
const { format, transports } = Winston;
const { printf, combine, label, prettyPrint, colorize } = format;

const errors = require('../middleware/errorMiddleware');
const userRouter = require('../routes/userRoute');
const groupRouter = require('../routes/groupRoute');
const authRouter = require('../routes/authRoute');


const myFormat = printf(({ level, message }) => {
    return `${level}: ${message}`;
});

module.exports = function (app) {
    app.disable('x-powered-by');
    app.disable('X-Powered-By');
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))

    if (app.get('env') === 'development' || app.get('env') === 'production') {
        app.use(morgan('tiny'));
        debug('Morgan Activated...');
    }

    Winston.add(
        new transports.Console({
            format: combine(label({ label: 'info' }), prettyPrint(), colorize(), myFormat)
        })
    );

    app.use('/api/users', userRouter);
    app.use('/api/groups', groupRouter);
    app.use('/api/auth', authRouter);
    app.use(errors);
}