'use strict';
const Response = require('./Response.js');
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
    run(){
        function respond(response, messageOptions = {})
        {
            this._respond(message, response, messageOptions);
        }
        this.funct(message, respond)
    }
}
        
Command.defaultMetadata = {
    description: "A sample command.",
    usage: "params"
}

module.exports = Command;
