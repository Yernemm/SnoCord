'use strict';
const Response = require('./Response.js');
const utils = require("./utils.js");
/**
 * Child class of Response - Provides additional functionality for commands.
 */
class Command extends Response {

    constructor(prefixes, commandWord, aliases, metadata, funct) 
    {

        //regex builder

        let regexString = "^((";

        prefixes.forEach(p => {
            //escape all prefix characters
            regexString += p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "|";
        })

        //trim the last '|'
        regexString = regexString.substring(0, regexString.length - 1);
        regexString += ')(' + commandWord + '|';

        aliases.forEach(a => {
            regexString += a + "|"
        })

        regexString = regexString.substring(0, regexString.length - 1);
        regexString += ")(?!\S))";

        let finalRegex = new RegExp(regexString);

        super(finalRegex, funct);
        
        this.metadata = metadata;
        this.metadata.aliases = aliases;
        this.metadata.commandWord = commandWord;
    }

    /**
     * Run the response code to a message.
     * @param {Discord#Message} message - Message object to respond to.
     */
    run(message, bot){
        let data = utils.parseCommand();
        data.message = message;
        function respond(response, messageOptions = {})
        {
            this._respond(message, response, messageOptions);
        }
        this.funct(data, respond)
    }

    //Edited parseCommand becuase prefixes are different.
    parseCommand(message) {
        if (message.author.bot) return null;
    
        const content = message.content.trim();
        
        // If the message starts with a prefix
        const prefixed = content.startsWith(prefixOverride || bot.config.prefix);
        const mentioned = bot.config.mentionAsPrefix ? bot.mention.test(content) : false;
    
        if (!prefixed && !mentioned) return null;
    
        const prefix = prefixed ? bot.config.prefix : content.match(bot.mention)[0];
    
        // Dissallow whitespace between the prefix and command name
        if (/^\s+/.test(content.slice(prefix.length))) return;
    
        let args = content.slice(prefix.length).trim().split(/\s+/g);
        const command = args.shift().toLowerCase();
        const argsText = content.slice(prefix.length + command.length).trim();
    
        return { bot, message, command, args, argsText };
    }
}
        
Command.defaultMetadata = {
    description: "A sample command.",
    usage: "params"
}

module.exports = Command;
