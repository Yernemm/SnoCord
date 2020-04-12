'use strict';
const Response = require('./Response.js');
const utils = require('./utils.js');

/** 
 * Child class of Response - Provides additional functionality for commands.
 * Default priority: 5
 */
class Command extends Response {

    constructor(bot, commandWord, aliases, metadata, funct, priority = 5, cooldown = 0) {

        super((message,bot)=>{
            let check = utils.isCommand(bot,message,message.snocord.prefix,commandWord);
            if(!check){
                aliases.forEach(e => {
                    //check aliases.
                   check = (check || utils.isCommand(bot,message,message.snocord.prefix,e));
                });
            }
            return check;
        },
         funct, priority, cooldown);
        
        this.metadata = {...metadata};
        this.metadata.aliases = aliases;
        this.metadata.commandWord = commandWord;
        this.metadata.category = this.metadata.category ? this.metadata.category : "other";
        this.config = bot.config;

    }

    /**
     * Run the response code to a message.
     * @param {Discord#Message} message - Message object to respond to.
     */
    run(message, bot) {
        if(this.isRunnableBy(message.member)){
            let data = utils.parseCommand(bot, message, message.snocord.prefix);
            data.message = message;
            const respond = (response, messageOptions = {}) => {
                this._respond(message, response, messageOptions);
            };
            data.respond = respond;
            this.funct(data);
        }
    }

    /**
     * Check if the member has the required permissions to run this command.
     * @param {Discord#GuildMember} member Guild member to check.
     */
    isRunnableBy(member) {
        if(this.metadata.ownerOnly === true){
            return member.id == this.config.ownerID;      
        }else if(this.metadata.permissions){
            return member.hasPermission(this.metadata.permissions);
        }else{
            return true;
        }
    }

    /**
     * Send message if user on cooldown
     * @param {Discord#message} message message
     * @param {Bot} bot bot
     * @param {number} cooldownStamp stamp of time after cooldown is over
     */
    runCooldown(message, bot, cooldownStamp)
    {
        message.reply(`Please wait **${utils.msToTime(cooldownStamp - Date.now())}** before using another command.`)
        .then((message)=>{
            message.delete({timeout: 5000})
            .then(()=>{}).catch(()=>{});
        });
    }


}

Command.defaultMetadata = {
    description: 'A sample command.',
    usage: 'params'
};

module.exports = Command;
