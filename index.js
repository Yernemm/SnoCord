'use strict';
const Discord = require('discord.js');
const EventEmitter = require('events');

// A set containing all of Discord.js' events except `message`
const events = new Set(Object.values(Discord.Constants.Events));
events.delete('message');

class SnoCord extends EventEmitter
{
    /**
     * Creates a new SnoCord instance.
     */
    constructor(opts)
    {
        super();
        const options = mergeDefault(opts, SnoCord.defaultOptions);

        if (!options.config) throw new Error('No config object provided');
        this.config = options.config;
        this.client = new Discord.Client(options.client);

        this.commands = new Map();
        this.invokers = new Set();
    }

    /**
     * Intializes the SnoCord instance.
     * @param {string} token - The Discord token to log in with.
     * @param {Object} [callback] - An object defining functions to call before or after the bot connects to the discord API
     * @returns {Promise<void>}
     * @example
     * new SnoCord(options).init({
     *   async preInit() {
     *     // Do stuff before connecting to the API
     *   },
     *   async postInit() {
     *     // Do stuff after connecting to the API
     *   }
     * });
     */
    async init(callbacks)
    {
        const { preInit, postInit } = mergeDefault(callbacks, SnoCord.defaultInitCallbacks);

        if (!this.config.token) throw new Error('No token provided');

        if (preInit) await preInit(this);

        await this.client.login(this.config.token);

        this.client.once('ready', async () => {
            if (postInit) await postInit(this);

            for (let event of events) {
                this.client.on(event, (...args) => {
                    this.emit(event, ...args);
                });
            }

            this.client.on('message', (message) => {
                if (messageIsCommand) {
                    // Message is a command, execute command somehow
                } else if (messageIsInvoker) {
                    // Message is an invoker, execute invoker somehow
                } else {
                    // Message is a normal message
                    this.emit('message', message);
                }
            });
        });
    }
}

SnoCord.defaultOptions = {
    config: null,
    client: {}
};

SnoCord.defaultInitCallbacks = {
    preInit: null,
    postInit: null
};

module.exports = SnoCord;

function mergeDefault(def, given) {
    if (!given) return def;
    for (const key in def) {
        if (!{}.hasOwnProperty.call(given, key)) {
            given[key] = def[key];
        } else if (given[key] === Object(given[key])) {
            given[key] = mergeDefault(def[key], given[key]);
        }
    }
  
    return given;
}
