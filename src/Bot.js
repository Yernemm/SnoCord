'use strict';
const Discord = require('discord.js');
const EventEmitter = require('events');
const { mergeDefault, parseCommand } = require('./utils.js');
const Response = require("./Response.js");
const Command = require("./Command.js");

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

        //if (!options.config) throw new Error('No config object provided');
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
                const responses = this.tryResponses(message);

                if (responses.length > 0) {
                    
                    //Run each response.
                    //Emit each response with the response class type.
                    //e.g. Command will emit ('Command', response)
                responses.forEach(response => {
                    response.run(message)
                    this.emit(response.constructor.name, response)
                }); 
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
     * Set the config object for the bot.
     * @param {object} config - Config object.
     */
    setConfig(config)
    {
        this.config = config;
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

    /**
     * Adds Response object to the bot's set of responses.
     * @param {RegExp|Function(Discord#Message)} trigger - The RegExp pattern to match to trigger this response OR Custom checking function which takes the message object and returns boolean.
     * @param {Function(Discord#Message, respond)} funct - Code to run when triggered. Will pass two parameters: The full discord message object to respond to, respond function which repsonds to the message.
     */
    addResponse(trigger, funct){
        this.responses.add(new Response(trigger, funct));
    }

    /**
     * 
     * @param {string} commandWord - The word which will execute the command.
     * @param {Array<string>} aliases - Array of all command aliases.
     * @param {object} info - Info metadata object for command.
     * @param {Function(data, respond)} funct - Code to run when triggered. Will pass two parameters: object containing parsed command data and message object, respond function which repsonds to the message.
     */
    addCommand(commandWord, aliases, info, funct){
        this.responses.add(
            new Command([`<@${this.client.user.id}> `,`<@!${this.client.user.id}> `, this.config.prefix],
            commandWord,aliases, info, funct))
    }

    /**
     * Add a custom response object to the list. (Not recommended for standard response types)
     * @param {Response} response - Object of Response or class which extends response.
     */
    addCustomResponse(response){
        this.responses.add(response);
    }
}

Bot.defaultOptions = {
    config: null,
    client: {}
};

/** Default options to fall back on if the config object exists but doesn't have a given option. */
Bot.defaultConfigOptions = {
    /** Prefixing the message with a ping to the bot will work the same as using the bot's prefix. */
    mentionAsPrefix: true,
    prefix: "!"
};

Bot.defaultInitCallbacks = {
    preInit: null,
    postInit: null
};

module.exports = Bot;
