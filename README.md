# SnoCord
 A Discord.js framework used by SnoBot.


# Usage Docs:

## Classes

<dl>
<dt><a href="#Bot">Bot</a></dt>
<dd><p>Main class which everything starts from.</p>
</dd>
<dt><a href="#Command">Command</a></dt>
<dd><p>Child class of Response - Provides additional functionality for commands.
Default priority: 5</p>
</dd>
<dt><a href="#Response">Response</a></dt>
<dd><p>Generic class which handles responses to user messages.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#parseCommand">parseCommand(bot, message, prefixOverride)</a></dt>
<dd><p>Parses a message object into command objects.</p>
</dd>
<dt><a href="#isCommandSyntax">isCommandSyntax(bot, message, prefixOverride)</a></dt>
<dd><p>Checks if the message is syntaxically a command. Does not check if it is an existing command.</p>
</dd>
<dt><a href="#isCommand">isCommand(bot, message, prefixOverride, commandName)</a></dt>
<dd><p>Checks if the message is a given command.</p>
</dd>
<dt><a href="#capitaliseFirstLetter">capitaliseFirstLetter(string)</a></dt>
<dd><p>Capitalise first letter of text.</p>
</dd>
<dt><a href="#sortJson">sortJson(obj)</a> ⇒</dt>
<dd><p>Sorts keys of object alphabetically</p>
</dd>
<dt><a href="#msToTime">msToTime(duration)</a> ⇒ <code>string</code></dt>
<dd><p>convert ms to time string</p>
</dd>
</dl>

<a name="Bot"></a>

## Bot
Main class which everything starts from.

**Kind**: global class  

* [Bot](#Bot)
    * [new Bot()](#new_Bot_new)
    * _instance_
        * [.mention](#Bot+mention)
        * [.init(token, [callback])](#Bot+init) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.setConfig(config)](#Bot+setConfig)
        * [.tryResponses(message)](#Bot+tryResponses) ⇒ [<code>Array.&lt;Response&gt;</code>](#Response)
        * [.addResponse(trigger, funct, priority)](#Bot+addResponse)
        * [.addCommand(commandWord, aliases, info, funct, priority)](#Bot+addCommand)
        * [.addCommandClass(commandClass)](#Bot+addCommandClass)
        * [.addCommandHandler(path)](#Bot+addCommandHandler)
        * [.addCustomResponse(response)](#Bot+addCustomResponse)
        * [.getAllCommands()](#Bot+getAllCommands) ⇒
        * [.addHelpCommand()](#Bot+addHelpCommand)
        * [.addPrefixCommands()](#Bot+addPrefixCommands)
        * [.addCoreCommands()](#Bot+addCoreCommands)
        * [.setCustomGuildPrefix(guildId, prefix)](#Bot+setCustomGuildPrefix) ⇒ <code>Promise</code>
        * [.getPrefix(guildId)](#Bot+getPrefix) ⇒ <code>Promise</code>
        * [.setPresence(presence)](#Bot+setPresence)
    * _static_
        * [.defaultConfigOptions](#Bot.defaultConfigOptions)
            * [.commandCooldown](#Bot.defaultConfigOptions.commandCooldown)

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
new Bot(options).init({
    async preInit() {
        // Do stuff before connecting to the API
    },
    async postInit() {
        // Do stuff after connecting to the API
    }
});
```
<a name="Bot+setConfig"></a>

### bot.setConfig(config)
Set the config object for the bot.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | Config object. |

<a name="Bot+tryResponses"></a>

### bot.tryResponses(message) ⇒ [<code>Array.&lt;Response&gt;</code>](#Response)
Loops through each response, attempting to find one that will trigger on the given message.

**Kind**: instance method of [<code>Bot</code>](#Bot)  
**Returns**: [<code>Array.&lt;Response&gt;</code>](#Response) - - Array of all matching responses.  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Message</code> | The message |

<a name="Bot+addResponse"></a>

### bot.addResponse(trigger, funct, priority)
Adds Response object to the bot's set of responses.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| trigger | <code>RegExp</code> \| <code>function</code> |  | The RegExp pattern to match to trigger this response OR Custom checking function which takes the message object and returns boolean. |
| funct | <code>function</code> |  | Code to run when triggered. Will pass an object containing message (Discord#Message), respond function, messageOptions. |
| priority | <code>integer</code> | <code>0</code> | (Optional) The priority value for the response. When two or more responses match, only those with the highest priority value will run. Defaults to 0. |

**Example**  
```js
bot.addResponse(() => {return true;}, (r) => {
     r.respond("I like responding.")
  }, -1);

 bot.addResponse(/^(hello bot)/i, (r) => r.respond("hi human"));
```
<a name="Bot+addCommand"></a>

### bot.addCommand(commandWord, aliases, info, funct, priority)
**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| commandWord | <code>string</code> | The word which will execute the command. |
| aliases | <code>Array.&lt;string&gt;</code> | Array of all command aliases. |
| info | <code>object</code> | Info metadata object for command. |
| funct | <code>function</code> | Code to run when triggered. Will pass an object containing message (Discord#Message), respond function, messageOptions. |
| priority | <code>integer</code> | (Optional) The priority value for the response. When two or more responses match, only those with the highest priority value will run. Defaults to 0. |

**Example**  
```js
bot.addCommand("help",(r)=>{r.respond(`I won't help you, ${r.message.author}`)})
```
<a name="Bot+addCommandClass"></a>

### bot.addCommandClass(commandClass)
Add a command using a command class, similar to what the command handler does.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| commandClass | [<code>Command</code>](#Command) | Class for this command |

**Example**  
```js
bot.addCommandClass(require('./commands/SomeCommand.js'));
bot.addCommandClass(SomeCommandClass);
```
<a name="Bot+addCommandHandler"></a>

### bot.addCommandHandler(path)
Add a command handler to a specified directory.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The local path to the directory containing only command class files. |

**Example**  
```js
bot.addCommandHandler('./commands/');
```
<a name="Bot+addCustomResponse"></a>

### bot.addCustomResponse(response)
Add a custom response object to the list. (Not recommended for standard response types)

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| response | [<code>Response</code>](#Response) | Object of Response or class which extends response. |

<a name="Bot+getAllCommands"></a>

### bot.getAllCommands() ⇒
Get all added commands.

**Kind**: instance method of [<code>Bot</code>](#Bot)  
**Returns**: array of Command instances.  
<a name="Bot+addHelpCommand"></a>

### bot.addHelpCommand()
Adds the core help command to the commands.

**Kind**: instance method of [<code>Bot</code>](#Bot)  
<a name="Bot+addPrefixCommands"></a>

### bot.addPrefixCommands()
Adds the core 'prefix' and 'resetprefix' commands to the commands.

**Kind**: instance method of [<code>Bot</code>](#Bot)  
<a name="Bot+addCoreCommands"></a>

### bot.addCoreCommands()
Enables all of the built-in core commands.

**Kind**: instance method of [<code>Bot</code>](#Bot)  
<a name="Bot+setCustomGuildPrefix"></a>

### bot.setCustomGuildPrefix(guildId, prefix) ⇒ <code>Promise</code>
Set custom prefix for a specific guild.

**Kind**: instance method of [<code>Bot</code>](#Bot)  
**Returns**: <code>Promise</code> - if the setting is successful.  

| Param | Type | Description |
| --- | --- | --- |
| guildId | <code>string</code> | ID of Discord guild. |
| prefix | <code>string</code> | custom prefix for this guild or false for no custom prefix. |

<a name="Bot+getPrefix"></a>

### bot.getPrefix(guildId) ⇒ <code>Promise</code>
Get the custom prefix if the guild has one, else return default prefix.

**Kind**: instance method of [<code>Bot</code>](#Bot)  
**Returns**: <code>Promise</code> - promise resolving to the guild's prefix.  

| Param | Type | Description |
| --- | --- | --- |
| guildId | <code>string</code> | ID of the guild in which the command is run. |

<a name="Bot+setPresence"></a>

### bot.setPresence(presence)
Set the bot's presence (status). Refereshed every hour.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| presence | <code>Discord#PresenceData</code> | Data for presence |

<a name="Bot.defaultConfigOptions"></a>

### Bot.defaultConfigOptions
Default options to fall back on if the config object exists but doesn't have a given option.

**Kind**: static property of [<code>Bot</code>](#Bot)  
<a name="Bot.defaultConfigOptions.commandCooldown"></a>

#### defaultConfigOptions.commandCooldown
Prefixing the message with a ping to the bot will work the same as using the bot's prefix.

**Kind**: static property of [<code>defaultConfigOptions</code>](#Bot.defaultConfigOptions)  
<a name="Command"></a>

## Command
Child class of Response - Provides additional functionality for commands.
Default priority: 5

**Kind**: global class  

* [Command](#Command)
    * [.run(message)](#Command+run)
    * [.isRunnableBy(member)](#Command+isRunnableBy)
    * [.runCooldown(message, bot, cooldownStamp)](#Command+runCooldown)

<a name="Command+run"></a>

### command.run(message)
Run the response code to a message.

**Kind**: instance method of [<code>Command</code>](#Command)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Discord#Message</code> | Message object to respond to. |

<a name="Command+isRunnableBy"></a>

### command.isRunnableBy(member)
Check if the member has the required permissions to run this command.

**Kind**: instance method of [<code>Command</code>](#Command)  

| Param | Type | Description |
| --- | --- | --- |
| member | <code>Discord#GuildMember</code> | Guild member to check. |

<a name="Command+runCooldown"></a>

### command.runCooldown(message, bot, cooldownStamp)
Send message if user on cooldown

**Kind**: instance method of [<code>Command</code>](#Command)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Discord#message</code> | message |
| bot | [<code>Bot</code>](#Bot) | bot |
| cooldownStamp | <code>number</code> | stamp of time after cooldown is over |

<a name="Response"></a>

## Response
Generic class which handles responses to user messages.

**Kind**: global class  

* [Response](#Response)
    * [new Response(trigger, funct)](#new_Response_new)
    * [._respond(message, response, messageOptions)](#Response+_respond)
    * [.run(message)](#Response+run)
    * [.isTriggered(message)](#Response+isTriggered)
    * [.runCooldown(message, bot, cooldownStamp)](#Response+runCooldown)

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

<a name="Response+runCooldown"></a>

### response.runCooldown(message, bot, cooldownStamp)
Do nothing if user on cooldown

**Kind**: instance method of [<code>Response</code>](#Response)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Discord#message</code> | message |
| bot | [<code>Bot</code>](#Bot) | bot |
| cooldownStamp | <code>number</code> | stamp of time after cooldown is over |

<a name="parseCommand"></a>

## parseCommand(bot, message, prefixOverride)
Parses a message object into command objects.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| bot | [<code>Bot</code>](#Bot) | The bot instance. |
| message | <code>Discord#Message</code> | The message object to parse.message |
| prefixOverride | <code>string</code> | Optional custom prefix. |

<a name="isCommandSyntax"></a>

## isCommandSyntax(bot, message, prefixOverride)
Checks if the message is syntaxically a command. Does not check if it is an existing command.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| bot | [<code>Bot</code>](#Bot) | The bot instance. |
| message | <code>Discord#Message</code> | The message object to parse.message |
| prefixOverride | <code>string</code> | Optional custom prefix. |

<a name="isCommand"></a>

## isCommand(bot, message, prefixOverride, commandName)
Checks if the message is a given command.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| bot | [<code>Bot</code>](#Bot) | The bot instance. |
| message | <code>Discord#Message</code> | The message object to parse.message |
| prefixOverride | <code>string</code> | Optional custom prefix. |
| commandName | <code>string</code> | Name of command. |

<a name="capitaliseFirstLetter"></a>

## capitaliseFirstLetter(string)
Capitalise first letter of text.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>String</code> | text |

<a name="sortJson"></a>

## sortJson(obj) ⇒
Sorts keys of object alphabetically

**Kind**: global function  
**Returns**: sorted object  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | object to sort |

<a name="msToTime"></a>

## msToTime(duration) ⇒ <code>string</code>
convert ms to time string

**Kind**: global function  
**Returns**: <code>string</code> - time  

| Param | Type | Description |
| --- | --- | --- |
| duration | <code>number</code> | time in ms |





## Examples

### Sample command using the command handler:
```
class ExampleCommand
{
    constructor()
    {
        this.metadata = {
            commandWord: 'sample',
            aliases: [],
            description: 'Adds num1 and num2 and pings you in return that many times. Requires ban permission for no reason!',
            usage: 'num1 num2',
            permissions: ['BAN_MEMBERS'],
            ownerOnly: false
        };
    }

    run(sno)
    {
        //sno contains { bot, message, command, args, argsText, respond }
        let num1 = sno.args[0] * 1;
        let num2 = sno.args[1] * 1;
        let sum = Math.floor(num1 + num2);
        if(sum > 0){
            if (sum > 1000){sum = 1000;}
            let message = "";
            for(let i = 0; i < sum; i++){
                message += sno.message.author + " "; 
            }
            sno.respond(message);
        }else{
            sno.respond("I can't ping you less than 0 times!");
        }

    }
}
module.exports = ExampleCommand;
```

### Sample config file:
```
{
    "name": "Some Bot",
    "owner": "Some User",
    "ownerID": "000000000000000000",
    "description": "A SnoCord bot",
    "token": "",
    "prefix": "!",
    "mentionAsPrefix": true,
    "commandCooldown": 2000
}
```