'use strict';
const Discord = require('discord.js');
const EventEmitter = require('events');
const { mergeDefault } = require('./utils.js');

// A set containing all of Discord.js' events except `message`
const events = Object.values(Discord.Constants.Events);

class Bot extends EventEmitter {
    /** Creates a new Bot instance. */
    constructor(opts) {
        super();
        const options = mergeDefault(opts, Bot.defaultOptions);

        if (!options.config) throw new Error('No config object provided');
        this.config = mergeDefault(options.config, Bot.defaultConfigOptions);
        this.client = new Discord.Client(options.client);

        this.commands = new Map();
        this.invokers = new Set();
    }

    /**
     * Intializes the Bot instance.
     * @param {string} token - The Discord token to log in with.
     * @param {Object} [callback] - An object defining functions to call before or after the bot connects to the discord API
     * @returns {Promise<void>}
     * @example
     * new Bot(options).init({
     *     async preInit() {
     *         // Do stuff before connecting to the API
     *     },
     *     async postInit() {
     *         // Do stuff after connecting to the API
     *     }
     * });
     */
    async init(callbacks) {
        const { preInit, postInit } = mergeDefault(callbacks, Bot.defaultInitCallbacks);

        if (!this.config.token) throw new Error('No token provided');

        if (preInit) await preInit(this);

        await this.client.login(this.config.token);

        this.client.once('ready', async () => {
            if (postInit) await postInit(this);

            for (let event of events) {
                if (event === 'message') continue;
                this.client.on(event, (...args) => {
                    this.emit(event, ...args);
                });
            }

            this.client.on('message', (message) => {
                const parsed = this.parseCommand(message);

                if (parsed) {
                    this.emit('command', parsed);
                } else {
                    this.emit('message', message);
                }
            });
        });
    }

    /** Gets a regular expression that will match a message mention directed at this bot */
    get mention() {
        return new RegExp(`^<@!?${this.client.user.id}>\\s*`);
    }

    /**
     * Parse a command into an object containing info about the command.
     * @param {Discord.Message} message The message to try parsing
     * @returns {Object|null}
     */
    parseCommand(message) {
        if (message.author.bot) return null;

        const content = message.content.trim();
        
        // If the message starts with a prefix
        const prefixed = content.startsWith(this.config.prefix);
        const mentioned = this.config.mentionAsPrefix ? this.mention.test(content) : false;

        if (!prefixed && !mentioned) return null;

        const prefix = prefixed ? this.config.prefix : content.match(this.mention)[0];

        // Dissallow whitespace between the prefix and command name
        if (/^\s+/.test(content.slice(prefix.length))) return;

        let args = content.slice(prefix.length).trim().split(/\s+/g);
        const command = args.shift().toLowerCase();
        const argsText = content.slice(prefix.length + command.length).trim();

        return { message, command, args, argsText };
    }
}

Bot.defaultOptions = {
    config: null,
    client: {}
};

/** Default options to fall back on if the config object exists but doesn't have a given option. */
Bot.defaultConfigOptions = {
    /** Prefixing the message with a ping to the bot will work the same as using the bot's prefix. */
    mentionAsPrefix: true
};

Bot.defaultInitCallbacks = {
    preInit: null,
    postInit: null
};

module.exports = Bot;