'use strict';
const Response = require('./Response.js');
/**
 * Command class only to be instantiated by methods inside Bot. Do not manually instantiate.
 */
class Command extends Response {

    constructor(prefixes, commandWord, aliases, metadata, funct) {

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
    }

        if (typeof options.run !== 'function')
            throw new Error('options.run is not a function');

        this.name = options.name;
        this.aliases = options.aliases;
        this.info = options.info;
        this.where = options.where;
        this.disabled = options.disabled;
        this.hidden = options.hidden;
        this.run = options.run;
    }

    /**
     * Try to execute a command with the given data object. The command will not execute
     * if it is disabled, or if its `where` property does not match up with whether it is
     * in DM or a guild.
     * @param {Object} data A command data object
     * @returns {Promise} A promise resolving to whatever the command's `run` function resolves,
     *   or `null` if the command did not execute.
     */
    async attempt(data) {
        if (this.disabled) return null;

        const inDM = !data.message.guild;

        if (!inDM && this.where === Command.DM) return null;
        if (inDM && this.where === Command.GUILD) return null;

        return await this.run(data);
    }

    /**
     * Check whether a query matches this command's name or one of its aliases.
     * @param {String} query The command name to check
     * @returns {Boolean} Whether it matches or not
     */
    is(query) {
        if (this.name === query) return true;
        for (let alias of this.aliases)
            if (alias === query) return true;
        return false;
    }

    /**
     * Search a list of commands for one with the given name.
     * @param {Set<Command>} commands A set of commands to search through
     * @param {String} query The name or alias of a command to find
     * @returns {Command|null} The command object if one was found, or `null` if one wasn't
     */
    static find(commands, query) {
        for (let command of commands)
            if (command.is(query)) return command;
        return null;
    }
}

module.exports = Command;
