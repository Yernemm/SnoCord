'use strict';
const Response = require('./Response.js');
const utils = require('./utils.js');

/** 
 * Child class of Response - Provides additional functionality for commands.
 * Default priority: 5
 */
class Command extends Response {

    constructor(commandWord, aliases, metadata, funct, priority = 5) {



        super((message,bot)=>{return utils.isCommand(bot,message,message.prefix,commandWord);},
         funct, priority);
        
        this.metadata = metadata;
        this.metadata.aliases = aliases;
        this.metadata.commandWord = commandWord;
    }

    /**
     * Run the response code to a message.
     * @param {Discord#Message} message - Message object to respond to.
     */
    run(message, bot) {
        let data = utils.parseCommand(bot, message, message.snocord.prefix);
        data.message = message;
        const respond = (response, messageOptions = {}) => {
            this._respond(message, response, messageOptions);
        };
        data.respond = respond;
        this.funct(data);
    }


}

Command.defaultMetadata = {
    description: 'A sample command.',
    usage: 'params'
};

module.exports = Command;
