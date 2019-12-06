## Classes

<dl>
<dt><a href="#Bot">Bot</a></dt>
<dd></dd>
<dt><a href="#Command">Command</a></dt>
<dd><p>Command class only to be instantiated by methods inside Bot. Do not manually instantiate.</p>
</dd>
<dt><a href="#Response">Response</a></dt>
<dd><p>Response class only to be instantiated by methods inside Bot. Do not manually instantiate.</p>
</dd>
</dl>

<a name="Bot"></a>

## Bot
**Kind**: global class  

* [Bot](#Bot)
    * [new Bot()](#new_Bot_new)
    * _instance_
        * [.mention](#Bot+mention)
        * [.init(token, [callback])](#Bot+init) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.tryResponses(message)](#Bot+tryResponses)
    * _static_
        * [.defaultConfigOptions](#Bot.defaultConfigOptions)
            * [.mentionAsPrefix](#Bot.defaultConfigOptions.mentionAsPrefix)

<a name="new_Bot_new"></a>

### new Bot()
Creates a new Bot instance.

<a name="Bot+mention"></a>

### bot.mention
Gets a regular expression that will match a message mention directed at this bot

**Kind**: instance property of [<code>Bot</code>](#Bot)  
<a name="Bot+init"></a>

### bot.init(token, [callback]) ⇒ <code>Promise.&lt;void&gt;</code>
Intializes the Bot instance.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | The Discord token to log in with. |
| [callback] | <code>Object</code> | An object defining functions to call before or after the bot connects to the discord API |

**Example**  
```js
new Bot(options).init({    async preInit() {        // Do stuff before connecting to the API    },    async postInit() {        // Do stuff after connecting to the API    }});
```
<a name="Bot+tryResponses"></a>

### bot.tryResponses(message)
Loops through each response, attempting to find one that will trigger on the given message.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Message</code> | The message |

<a name="Bot.defaultConfigOptions"></a>

### Bot.defaultConfigOptions
Default options to fall back on if the config object exists but doesn't have a given option.

**Kind**: static property of [<code>Bot</code>](#Bot)  
<a name="Bot.defaultConfigOptions.mentionAsPrefix"></a>

#### defaultConfigOptions.mentionAsPrefix
Prefixing the message with a ping to the bot will work the same as using the bot's prefix.

**Kind**: static property of [<code>defaultConfigOptions</code>](#Bot.defaultConfigOptions)  
<a name="Command"></a>

## Command
Command class only to be instantiated by methods inside Bot. Do not manually instantiate.

**Kind**: global class  
<a name="Response"></a>

## Response
Response class only to be instantiated by methods inside Bot. Do not manually instantiate.

**Kind**: global class  

* [Response](#Response)
    * [new Response(trigger, funct)](#new_Response_new)
    * [._respond(message, response, messageOptions)](#Response+_respond)
    * [.run(message)](#Response+run)
    * [.isTriggered(message)](#Response+isTriggered)

<a name="new_Response_new"></a>

### new Response(trigger, funct)
Creates Response object.


| Param | Type | Description |
| --- | --- | --- |
| trigger | <code>RegExp</code> \| <code>function</code> | The RegExp pattern to match to trigger this response OR Custom checking function which takes the message object and returns boolean. |
| funct | <code>function</code> | Code to run when triggered. Will pass response object. |

<a name="Response+_respond"></a>

### response.\_respond(message, response, messageOptions)
**Kind**: instance method of [<code>Response</code>](#Response)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Discord#Message</code> | Message object to respond to. |
| response | <code>string</code> | String text to send in response. |
| messageOptions | <code>Discord#MessageOptions</code> | Options provided when sending or editing a message. |

<a name="Response+run"></a>

### response.run(message)
Run the response code to a message.

**Kind**: instance method of [<code>Response</code>](#Response)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Discord#Message</code> | Message object to respond to. |

<a name="Response+isTriggered"></a>

### response.isTriggered(message)
Checks whether the trigger pattern matches the message.

**Kind**: instance method of [<code>Response</code>](#Response)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Discord#Message</code> | The message object to check. |

