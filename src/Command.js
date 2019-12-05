'use strict';
const { mergeDefault } = require('./utils.js');

class Command {
    constructor(opts) {
        const options = mergeDefault(Command.defaultOptions, opts);

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

Command.DM = 0;
Command.GUILD = 1;
Command.ANYWHERE = 2;

Command.defaultOptions = {
    name: 'default',
    aliases: [],
    info: {},
    where: 'anywhere',
    disabled: false,
    hidden: false,
    run: null
};

module.exports = Command;
