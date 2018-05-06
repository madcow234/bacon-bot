import { initLogger } from './config/logging';
import log            from 'winston';
import db             from './database/models';
import Discord        from 'discord.js';

// Create a Discord client
var client = new Discord.Client();

// Load a local .env file if in development or test
if (process.env.NODE_ENV !== 'production') {
    require("dotenv").load({path: "./src/config/.env"});
}

// Setup logger
initLogger();

// Get the bot's access token
const BOT_TOKEN = process.env.BOT_TOKEN;

db.sequelize.sync()
    .then(()=> 
        client.login(BOT_TOKEN)
            .then(token => 
                log.info(`${client.user.username} is logged in.`))
            .catch(error => 
                console.log(error)));