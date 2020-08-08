'use strict';

/**
 * Generic class which handles responses to user messages.
 */
class Response {

    /**
     * Creates Response object.
     * @param {RegExp|Function(Discord#Message)} trigger - The RegExp pattern to match to trigger this response OR Custom checking function which takes the message object and returns boolean.
     * @param {Function} funct - Code to run when triggered. Will pass response object.
     */
    constructor(trigger, funct, priority = 0, cooldown = 0)
    {
        this.trigger = trigger;
        this.funct = funct;
        this.priority = priority;
        this.cooldown = cooldown;
    }

    /**
     *
     * @param {Discord#Message} message - Message object to respond to.
     * @param {string} response - String text to send in response.
     * @param {Discord#MessageOptions} messageOptions - Options provided when sending or editing a message.
     */
    _respond(message, response, messageOptions = {})
    {
        //Trim response to 2000 chars - discord's message char limit.
        if(response.length <= 0 && messageOptions === {})
            return; //Cannot send empty message.

        if(response.length > 2000){
            response = response.substring(0, 1997) + '...';
        }
        message.channel.send(response, messageOptions);
    }

    /**
     * Run the response code to a message.
     * @param {Discord#Message} message - Message object to respond to.
     */
    run(message, bot)
    {
        const respond = (response, messageOptions = {}) => {
            this._respond(message, response, messageOptions);
        };
        this.funct({message, bot, respond});
    }

    /**
     * Checks whether the trigger pattern matches the message.
     * @param {Discord#Message} message - The message object to check.
     */
    isTriggered(message,bot)
    {
        return new promise((resolve, reject)=>{

          switch (typeof this.trigger) {

            case 'function':
              resolve(this.trigger(message,bot));
              break;

            default:
            if(this.trigger.promise !== undefined){
              this.trigger.promise(message,bot)
              .then(res => resolve(res))
              .catch(err => reject(err))
            }else{
              resolve(this.trigger.test(message.content));
            }


          }

        });
    }

    /**
     * Do nothing if user on cooldown
     * @param {Discord#message} message message
     * @param {Bot} bot bot
     * @param {number} cooldownStamp stamp of time after cooldown is over
     */
    runCooldown(message, bot, cooldownStamp)
    {

    }
}

module.exports = Response;
