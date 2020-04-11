'use strict';

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

/**
 * Parses a message object into command objects.
 * @param {Bot} bot - The bot instance.
 * @param {Discord#Message} message - The message object to parse.message
 * @param {string} prefixOverride - Optional custom prefix.
 */
function parseCommand(bot, message, prefixOverride) {
    if (message.author.bot) return null;

    const content = message.content.trim();
    
    // If the message starts with a prefix
    const prefixed = content.startsWith(prefixOverride || bot.config.prefix);
    const mentioned = bot.config.mentionAsPrefix ? bot.mention.test(content) : false;

    if (!prefixed && !mentioned) return null;

    const prefix = prefixed ? bot.config.prefix : content.match(bot.mention)[0];

    // Dissallow whitespace between the prefix and command name
    if (/^\s+/.test(content.slice(prefix.length))) return;

    let args = content.slice(prefix.length).trim().split(/\s+/g);
    const command = args.shift().toLowerCase();
    const argsText = content.slice(prefix.length + command.length).trim();

    return { bot, message, command, args, argsText };
}

/**
 * Checks if the message is syntaxically a command. Does not check if it is an existing command.
 * @param {Bot} bot - The bot instance.
 * @param {Discord#Message} message - The message object to parse.message
 * @param {string} prefixOverride - Optional custom prefix.
 */
function isCommandSyntax(bot, message, prefixOverride) {
    return parseCommand(bot, message, prefixOverride) !== null;
}

/**
 * Checks if the message is a given command.
 * @param {Bot} bot - The bot instance.
 * @param {Discord#Message} message - The message object to parse.message
 * @param {string} prefixOverride - Optional custom prefix.
 * @param {string} commandName - Name of command.
 */
function isCommand(bot, message, prefixOverride, commandName){
  return isCommandSyntax(bot, message, prefixOverride) 
  && parseCommand(bot, message, prefixOverride).command === commandName;
}

/**
 * Capitalise first letter of text.
 * @param {String} string text
 */
function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Sorts keys of object alphabetically
 * @param {object} obj object to sort
 * @returns sorted object
 */
function sortJson(obj){
  let unordered = {...obj};
  let ordered = {};
  Object.keys(unordered).sort().forEach(function(key) {
    ordered[key] = unordered[key];
  });
  return ordered;
}

module.exports = {
  mergeDefault,
  parseCommand,
  isCommand,
  isCommandSyntax,
  capitaliseFirstLetter,
  sortJson
};
