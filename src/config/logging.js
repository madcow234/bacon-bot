import { Logger, transports } from "winston";
import * as fs from "fs";

export function getLogger() {

    const nodeEnv = process.env.NODE_ENV;

    if (nodeEnv === 'production') {
        // Log to console in production because Heroku will add STDOUT to the log stream
        return getConsoleLogger();

    } else if (nodeEnv === 'development' || nodeEnv === 'test') {

        try {
            // Attempt to create a /logs directory
            fs.mkdirSync('./logs');

        } catch (err) {
            // If the /logs directory already exists, continue
            // Otherwise, return a console logger
            if (err.code !== 'EEXIST') {
                console.log(`An error has occurred that cannot be fixed (code: ${err.code})!`);
                console.log(`Switching to console logging...`);
                return getConsoleLogger();      
            }
        }

        var filename = nodeEnv === 'test' ? 'bacon-bot_test.log' : 'bacon-bot.log';

        // As long as a /logs directory exists, return a file logger
        return getFileLogger('logs', `${filename}`);

    } else {
        console.log(`Cannot determine current Node environment! You may need to set a "process.env.NODE_ENV" variable in your .env file.`);
        console.log(`Switching to console logging...`);
        return getConsoleLogger();
    }
}

function getConsoleLogger() {
    // Create a console logger
    var logger = new Logger({
        transports: [
            new transports.Console()
        ]
    });
    // Configure CLI output
    logger.cli();

    return logger;
}

function getFileLogger(directoryName, filename) {    
    // Create a file logger       
    var logger = new Logger({
        transports: [
            new transports.File({ filename: `./${directoryName}/${filename}` })
        ]
    });
    
    return logger;
}