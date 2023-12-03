const config = require('config');
const { format, transports, loggers, createLogger } = require('winston');
const { printf, label, timestamp, prettyPrint, combine, colorize, metadata } = format;
require('winston-mongodb');
require('express-async-errors');

const getDB = require('../utilities/getDB');

const myDefaultFormat = printf(({ level, message, label, timestamp }) => {
    const [errorMessage, ...stack] = message.split('\n');
    return `\n--- ${label} ${level} ---\n[${timestamp}]${level} ${errorMessage}\nstack: ${stack.join(
        '\n'
    )}\n--- ${label} ${level} ---\n`;
});

const myReqFormat = printf(({ level, message, label, timestamp, metadata }) => {
    return `\n--- ${label} ${level} ---\n[${timestamp}] ${level} ${message}\nstack: ${metadata}\n--- ${label} ${level} ---\n`;
});

module.exports = function (app) {
    const { db } = getDB(app);

    loggers.add('exceptions', {
        level: 'error',
        format: combine(
            label({ label: 'exception' }),
            timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
            prettyPrint(),
            metadata(),
            myDefaultFormat
        ),
        transports: [
            new transports.Console({
                format: combine(colorize(), prettyPrint(), myDefaultFormat),
                handleExceptions: true,
            }),
            new transports.File({ filename: 'logs/exceptions.log', handleExceptions: true }),
            new transports.MongoDB({
                db: db,
                dbName: 'secret-santa',
                options: { useUnifiedTopology: true },
                storeHost: true,
                collection: 'secret-santa_logs',
                label: 'exception',
                handleExceptions: true,
            }),
        ],
    })

    createLogger({
        level: 'error',
        format: combine(
            label({ label: 'rejection' }),
            timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
            prettyPrint(),
            myDefaultFormat
        ),
        rejectionHandlers: [
            new transports.Console({
                format: combine(colorize(), prettyPrint(), myDefaultFormat),
            }),
            new transports.File({ filename: 'logs/rejections.log' }),
            new transports.MongoDB({
                db: db,
                dbName: 'secret-santa',
                options: { useUnifiedTopology: true },
                storeHost: true,
                collection: 'secret-santa_logs',
                label: 'rejection',
            }),
        ],
    });

    loggers.add('errors', {
        format: combine(
            label({ label: 'request' }),
            timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
            prettyPrint(),
            myReqFormat
        ),
        transports: [
            new transports.Console({
                format: combine(colorize(), prettyPrint(), myReqFormat),
            }),
            new transports.File({
                filename: 'logs/requests.log',
                format: combine(prettyPrint(), myReqFormat),
            }),
            new transports.MongoDB({
                db: db,
                dbName: 'secret-santa',
                options: { useUnifiedTopology: true },
                storeHost: true,
                collection: 'secret-santa_logs',
                label: 'request',
            }),
        ],
    });
}

