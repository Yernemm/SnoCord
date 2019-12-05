<a name="Bot"></a>

## Bot
**Kind**: global class  

* [Bot](#Bot)
    * [new Bot()](#new_Bot_new)
    * _instance_
        * [.mention](#Bot+mention)
        * [.init(token, [callback])](#Bot+init) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.parseCommand(message)](#Bot+parseCommand) ⇒ <code>Object</code> \| <code>null</code>
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
<a name="Bot+parseCommand"></a>

### bot.parseCommand(message) ⇒ <code>Object</code> \| <code>null</code>
Parse a command into an object containing info about the command.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Discord.Message</code> | The message to try parsing |

<a name="Bot.defaultConfigOptions"></a>

### Bot.defaultConfigOptions
Default options to fall back on if the config object exists but doesn't have a given option.

**Kind**: static property of [<code>Bot</code>](#Bot)  
<a name="Bot.defaultConfigOptions.mentionAsPrefix"></a>

#### defaultConfigOptions.mentionAsPrefix
Prefixing the message with a ping to the bot will work the same as using the bot's prefix.

**Kind**: static property of [<code>defaultConfigOptions</code>](#Bot.defaultConfigOptions)  
