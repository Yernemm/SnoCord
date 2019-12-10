'use strict';
const Response = require('./Response.js');
const utils = require('./utils.js');

/**
 * Child class of Response - Provides additional functionality for commands.
 */
class Command extends Response {

    constructor(prefixes, commandWord, aliases, metadata, funct, priority = 0) {
        //regex builder

        let regexString = '^((';

        prefixes.forEach(p => {
            //escape all prefix characters
            regexString += p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '|';
        });

        //trim the last '|'
        regexString = regexString.substring(0, regexString.length - 1);
        regexString += ')(' + commandWord + '|';

        aliases.forEach(a => regexString += a + '|');

        regexString = regexString.substring(0, regexString.length - 1);
        regexString += ')(?!\S))';

        let finalRegex = new RegExp(regexString);

        super(finalRegex, funct, priority);
        
        this.metadata = metadata;
        this.metadata.aliases = aliases;
        this.metadata.commandWord = commandWord;
    }

    /**
     * Run the response code to a message.
     * @param {Discord#Message} message - Message object to respond to.
     */
    run(message, bot) {
        let data = utils.parseCommand();
        data.message = message;
        const respond = (response, messageOptions = {}) => {
            this._respond(message, response, messageOptions);
        };
        this.funct(data, respond);
    }


}

Command.defaultMetadata = {
    description: 'A sample command.',
    usage: 'params'
};

module.exports = Command;
