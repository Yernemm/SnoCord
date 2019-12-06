'use strict';
const Discord = require('discord.js');
const EventEmitter = require('events');
const { mergeDefault, parseCommand } = require('./utils.js');

// A set containing all of Discord.js' events except `message`
const events = Object.values(Discord.Constants.Events);

/**
 * Main class which everything starts from.
 */
class Bot extends EventEmitter {
    /** Creates a new Bot instance. */
    constructor(opts) {
        super();
        const options = mergeDefault(opts, Bot.defaultOptions);

        if (!options.config) throw new Error('No config object provided');
        this.config = mergeDefault(options.config, Bot.defaultConfigOptions);
        this.client = new Discord.Client(options.client);

        this.responses = new Set();
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

        if (preInit) await preInit.call(this);

        await this.client.login(this.config.token);

        this.client.once('ready', async () => {
            if (postInit) await postInit.call(this);

            for (let event of events) {
                if (event === 'message') continue;
                this.client.on(event, (...args) => {
                    this.emit(event, ...args);
                });
            }

            this.client.on('message', (message) => {
                const response = this.tryResponses(message);

                if (response) {
                    // Do something?
                    // this.emit('response', response);
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
     * Loops through each response, attempting to find one that will trigger on the given message.
     * @param {Message} message The message
     * @returns {Array<Response>} - Array of all matching responses.
     */
    tryResponses(message) {
        let matching = [];
        for (let resp of this.responses) {
            if (resp.isTriggered(message)) matching.push(resp);
        }
        return matching;
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
