'use strict';
const Discord = require('discord.js');
const EventEmitter = require('events');
const {
    mergeDefault
} = require('./utils.js');
const Response = require("./Response.js");
const Command = require("./Command.js");
const fs = require('fs');
const SnoDB = require('snodb');

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
        this.config = {
            ...Bot.defaultConfigOptions,
            ...options.config
        };
        this.client = new Discord.Client(options.client);
        this.responses = new Set();
        this.userCooldowns = {};
        this._db = new SnoDB('./SnoCord.sqlite');
        this.prefixCache = {}; //cache guild custom prefixes to speed things up.

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
        this.client.on('ready', () => {
            console.log("[SC] SnoCord Ready");
            if(this.presence){
                this.client.user.setPresence(this.presence);
                setInterval(()=>{this.client.user.setPresence(this.presence);}, 1000 * 60 * 60);
            }
        });
        this.client.on('message', (message) => {
            this.getPrefix(message.guild.id)
                .then(prefix => {

                    //Set default prefix. Can be altered by server later.
                    message.snocord = {
                        config: this.config,
                        prefix: prefix
                    };

                    this.tryResponses(message, this)
                    .then(responses=>{



                                          //Never run responses to itself
                                          if (responses.length > 0 && message.author.id !== this.client.user.id) {

                                              let highestPriority = -Infinity;

                                              responses.forEach(response => {
                                                  if (response.priority > highestPriority)
                                                      highestPriority = response.priority;
                                              });

                                              //Run each response.
                                              //Emit each response with the response class type.
                                              //e.g. Command will emit ('Command', response)
                                              responses.forEach(response => {
                                                  if (response.priority === highestPriority && (!this.userCooldowns[message.author.id] || this.userCooldowns[message.author.id] < Date.now())) {
                                                      response.run(message, this);
                                                      this.emit(response.constructor.name, response);
                                                      this.userCooldowns[message.author.id] = Date.now() + response.cooldown;
                                                  } else if (response.priority === highestPriority && this.userCooldowns[message.author.id] >= Date.now()) {
                                                      response.runCooldown(message, this, this.userCooldowns[message.author.id]);
                                                  }
                                              });
                                          } else {
                                              this.emit('message', message);
                                          }




                    })
                    .catch()



                })
                .catch(err=>{console.error(err)});

        });

        const {
            preInit,
            postInit
        } = mergeDefault(callbacks, Bot.defaultInitCallbacks);

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
    setConfig(config) {
        this.config = {
            ...this.config,
            ...config
        };
    }



    _tryResponsesCallback(matching, all, message, bot, callback) {
      all[0].isTriggered(message,bot).then(res=>{
        if(res){
          matching.push(all[0])
        }
      })
      .catch(()=>{})
      .finally(()=>{
        all.shift();
        if(all.length === 0){
          callback(matching)
        }else{
          this._tryResponsesCallback(matching, all, message, bot, callback)
        }
      });
    }



    /**
     * Loops through each response, attempting to find one that will trigger on the given message.
     * @param {Message} message The message
     * @returns {Array<Response>} - Array of all matching responses.
     */
    tryResponses(message, bot) {
          return new Promise((resolve, reject)=>{
          let all = [];
          this.responses.forEach((i)=>{all.push(i)});

          this._tryResponsesCallback([], all, message, bot, (res)=>{
              resolve(res);
          })

        })
    }



    /**
     * Adds Response object to the bot's set of responses.
     * @param {RegExp|Function(Discord#Message)} trigger - The RegExp pattern to match to trigger this response OR Custom checking function which takes the message object and returns boolean.
     * @param {Function(response)} funct - Code to run when triggered. Will pass an object containing message (Discord#Message), respond function, messageOptions.
     * @param {integer} priority - (Optional) The priority value for the response. When two or more responses match, only those with the highest priority value will run. Defaults to 0.
     * @example
     *  bot.addResponse(() => {return true;}, (r) => {
     *      r.respond("I like responding.")
     *   }, -1);
     *
     *  bot.addResponse(/^(hello bot)/i, (r) => r.respond("hi human"));
     */
    addResponse(trigger, funct, priority = 0) {
        this.responses.add(new Response(trigger, funct, priority));
    }

    /**
     *
     * @param {string} commandWord - The word which will execute the command.
     * @param {Array<string>} aliases - Array of all command aliases.
     * @param {object} info - Info metadata object for command.
     * @param {Function(response)} funct - Code to run when triggered. Will pass an object containing message (Discord#Message), respond function, messageOptions.
     * @param {integer} priority - (Optional) The priority value for the response. When two or more responses match, only those with the highest priority value will run. Defaults to 0.
     * @example
     * bot.addCommand("help",(r)=>{r.respond(`I won't help you, ${r.message.author}`)})
     */
    addCommand(commandWord, funct, aliases = [], info = Command.defaultMetadata, priority = 0, cooldown = this.config.commandCooldown) {
        let newCommand = new Command(this, commandWord, aliases, info, funct, priority, cooldown)
        this.responses.add(newCommand);
        console.log(`[SC] Added command ${commandWord}`);
    }

    /**
     * Add a command using a command class, similar to what the command handler does.
     * @param {Command} commandClass Class for this command
     * @example
     * bot.addCommandClass(require('./commands/SomeCommand.js'));
     * bot.addCommandClass(SomeCommandClass);
     */
    addCommandClass(commandClass) {
        let cmdObj = new commandClass();
        this.addCommand(
            cmdObj.metadata.commandWord,
            cmdObj.run,
            cmdObj.metadata.aliases,
            cmdObj.metadata,
            5
        );
    }

    /**
     * Add a command handler to a specified directory.
     * @param {string} path - The local path to the directory containing only command class files.
     * @example
     * bot.addCommandHandler('./commands/');
     */
    addCommandHandler(path) {
        fs.readdir(path, (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                if (!file.endsWith(".js")) return;
                let cmdClass = require.main.require(`${path}${file}`);
                let cmdObj = new cmdClass();
                this.addCommand(
                    cmdObj.metadata.commandWord,
                    cmdObj.run,
                    cmdObj.metadata.aliases,
                    cmdObj.metadata,
                    5
                );
            });
        });
    }

    /**
     * Add a custom response object to the list. (Not recommended for standard response types)
     * @param {Response} response - Object of Response or class which extends response.
     */
    addCustomResponse(response) {
        this.responses.add(response);
    }

    /**
     * Get all added commands.
     * @returns array of Command instances.
     */
    getAllCommands() {
        let cmds = []
        this.responses.forEach(res => {
            if (res instanceof Command) {
                cmds.push(res);

            }
        });
        return cmds;
    }

    /**
     * Adds the core help command to the commands.
     */
    addHelpCommand() {
        this.addCommandClass(require("./commands/help.js"));
    }

    /**
     * Adds the core 'prefix' and 'resetprefix' commands to the commands.
     */
    addPrefixCommands() {
        this.addCommandClass(require("./commands/prefix.js"));
        this.addCommandClass(require("./commands/resetprefix.js"));
    }

    /**
     * Enables all of the built-in core commands.
     */
    addCoreCommands() {
        this.addHelpCommand();
        this.addPrefixCommands();
    }

    /**
     * Set custom prefix for a specific guild.
     * @param {string} guildId ID of Discord guild.
     * @param {string} prefix custom prefix for this guild or false for no custom prefix.
     * @returns {Promise} if the setting is successful.
     */
    setCustomGuildPrefix(guildId, prefix) {
        return new Promise((resolve, reject) => {
            this._db.setTo('CustomGuildPrefixes', guildId, prefix)
                .then(data => {
                    this.prefixCache[guildId] = prefix ? prefix : this.config.prefix;
                    resolve(data);
                })
                .catch(err => reject(err));
        });

    }

    /**
     * Get the custom prefix if the guild has one, else return default prefix.
     * @param {string} guildId ID of the guild in which the command is run.
     * @returns {Promise} promise resolving to the guild's prefix.
     */
    getPrefix(guildId) {
        return new Promise((resolve, reject) => {
            if (this.prefixCache[guildId]) {
                resolve(this.prefixCache[guildId]);
            } else {
                this._db.getFrom('CustomGuildPrefixes', guildId)
                    .then(prefix => {
                        prefix = prefix ? prefix : this.config.prefix;
                        this.prefixCache[guildId] = prefix;
                        resolve(prefix);
                    })
                    .catch(err => reject(err));
            }
        });
    }

    /**
     * Set the bot's presence (status). Refereshed every hour.
     * @param {Discord#PresenceData} presence Data for presence
     */
    setPresence(presence) {
        this.presence = presence;
    }
}

Bot.defaultOptions = {
    config: null,
    client: {}
};

/** Default options to fall back on if the config object exists but doesn't have a given option. */
Bot.defaultConfigOptions = {
    name: "Some Bot",
    owner: "Some User",
    ownerID: false,
    description: "A SnoCord bot",
    token: "",
    prefix: "!",
    mentionAsPrefix: true,
    /** Prefixing the message with a ping to the bot will work the same as using the bot's prefix. */
    commandCooldown: 2000
};

Bot.defaultInitCallbacks = {
    preInit: null,
    postInit: null
};

module.exports = Bot;
