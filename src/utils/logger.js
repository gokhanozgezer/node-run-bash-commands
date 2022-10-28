import path from 'path';
import winston from "winston";

const appRoot = path.join(process.cwd());

const consoleTransportSetting = {
    level: 'debug',
    handleExceptions: true,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    )
};

// Winston Logger
const command = winston.createLogger({
    format: winston.format.combine(
        winston.format.label({ label: 'commandLog' }),
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: `${appRoot}/logs/commandError.log`, level: 'error' }),
      new winston.transports.File({ filename: `${appRoot}/logs/commandCombined.log`, level: 'info' }),
      new winston.transports.Console(consoleTransportSetting)
    ],
    exitOnError: false
});

const user = winston.createLogger({
    format: winston.format.combine(
        winston.format.label({ label: 'userLog' }),
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: `${appRoot}/logs/userError.log`, level: 'error' }),
      new winston.transports.File({ filename: `${appRoot}/logs/userCombined.log`, level: 'info' }),
      new winston.transports.Console(consoleTransportSetting)
    ],
    exitOnError: false
});

const server = winston.createLogger({
    format: winston.format.combine(
        winston.format.label({ label: 'serverLog' }),
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: `${appRoot}/logs/server.log` })
    ],
    exitOnError: false
});

export default {
    command,
    user,
    server
}