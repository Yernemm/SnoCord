const Discord = require("discord.js");
class SnoCord
{

    /**
     * Creates a new Discord Client.
     */
    constructor()
    {
        this._client = new Discord.Client();

        this._client.on('ready', () => {
            console.log(`Logged in as ${client.user.tag}.\nRunning SnoCord.`);
          });
          
        this._client.on('message', msg => {
            if (msg.content === 'ping') {
              msg.reply('Pong!');
            }
          });

        this._responses = [];
    }

    /**
     * Logs into the Discord client
     * @param {string} token - The Discord token to log in with.
     * @returns {Promise<string>} - Token of the account used.
     */
    logIn(token)
    {
        return this._client.login(token);
    }

    /**
     * Discord.js Client.
     */
    get client()
    {
        return this._client;
    }

    addResponse(trigger, guilds = [], channels = [], reply)
    {
        
    }
}
module.exports = SnoCord;