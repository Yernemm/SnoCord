'use strict';

/**
 * Response class only to be instantiated by methods inside Bot. Do not manually instantiate.
 */
class Response {

    /**
     * Creates Response object.
     * @param {RegExp} trigger - The RegExp pattern to match to trigger this response.
     * @param {Function} funct - Code to run when triggered. Will pass response object.
     */
    constructor(trigger, funct)
    {
        this.trigger = trigger;
        this.funct = funct;
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
        if(response.length > 2000){ 
            response = response.substring(0, 1997) + "...";
        }
        message.reply(response, messageOptions);
    }

    /**
     * Run the response code to a message.
     * @param {Discord#Message} message - Message object to respond to.
     */
    run(message)
    {
        function respond(response, messageOptions = {})
        {
            this._respond(message, response, messageOptions);
        }
        funct(respond)
    }

    /**
     * Checks whether the trigger pattern matches the message.
     * @param {string} msg - The message to check.
     */
    isTriggered(msg)
    {
        return this.trigger.test(msg);
    }
}

module.exports = Response;
